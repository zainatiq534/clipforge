import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { mkdtemp, readdir, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  objectKeyFromParts,
  storageIdFromParts,
  uploadFileToR2,
} from "../config/r2.js";
import { probeDurationSec, resolveFfmpegPath } from "./ffmpegMedia.js";
import {
  completeUpload,
  createUploadRecord,
  markUploadFailed,
} from "./uploads.js";
import type { VideoUpload } from "../types/upload.js";

/**
 * Only re-encode huge downloads. Mid-size files (~100–200MB) upload faster
 * with multipart than waiting on a full ffmpeg compress.
 */
const COMPRESS_ABOVE_BYTES = 280 * 1024 * 1024;

const require = createRequire(import.meta.url);
const youtubedl = require("youtube-dl-exec") as (
  url: string,
  flags?: Record<string, unknown>,
) => Promise<unknown>;

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
  "www.youtu.be",
  "music.youtube.com",
]);

export function isYouTubeUrl(raw: string): boolean {
  try {
    const u = new URL(raw);
    if (!/^https?:$/i.test(u.protocol)) return false;
    return YOUTUBE_HOSTS.has(u.hostname.toLowerCase());
  } catch {
    return false;
  }
}

export function isDirectVideoUrl(raw: string): boolean {
  try {
    const u = new URL(raw);
    if (!/^https?:$/i.test(u.protocol)) return false;
    return /\.(mp4|mov|webm|mkv)(\?|$)/i.test(u.pathname);
  } catch {
    return false;
  }
}

function sanitizeTitle(title: string) {
  const cleaned = title
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180);
  return cleaned || "YouTube video";
}

async function resolveDownloadedFile(
  tempDir: string,
  preferredPath: string,
): Promise<string> {
  try {
    const st = await stat(preferredPath);
    if (st.size > 0) return preferredPath;
  } catch {
    /* fall through — yt-dlp may have used a different name */
  }

  const entries = await readdir(tempDir);
  const videos = entries
    .filter((name) => /\.(mp4|mkv|webm|mov)$/i.test(name))
    .map((name) => join(tempDir, name));

  let best: { path: string; size: number } | null = null;
  for (const path of videos) {
    const st = await stat(path);
    if (!best || st.size > best.size) best = { path, size: st.size };
  }
  if (!best || best.size <= 0) {
    throw Object.assign(
      new Error("YouTube download finished but no video file was produced."),
      { status: 502 },
    );
  }
  return best.path;
}

async function downloadYouTubeToFile(url: string, outPath: string) {
  const ffmpegLocation = resolveFfmpegPath();
  if (!ffmpegLocation) {
    throw Object.assign(
      new Error("FFmpeg is missing on the server — cannot import YouTube videos."),
      { status: 500 },
    );
  }

  // Prefer progressive ≤720p mp4 (no merge). Skip 1080p — too slow to download/upload.
  await youtubedl(url, {
    output: outPath,
    format:
      "b[height<=720][ext=mp4]/bv*[height<=720][ext=mp4]+ba[ext=m4a]/b[height<=720]/bv*[height<=720]+ba/best[height<=720]/best",
    mergeOutputFormat: "mp4",
    noPlaylist: true,
    restrictFilenames: true,
    noCheckCertificates: true,
    ffmpegLocation,
    maxFilesize: "300M",
    noWarnings: true,
    // Faster downloads when available
    concurrentFragments: 4,
  });
}

async function compressVideoIfNeeded(
  inputPath: string,
  tempDir: string,
): Promise<string> {
  const st = await stat(inputPath);
  if (st.size <= COMPRESS_ABOVE_BYTES) return inputPath;

  const ffmpegPath = resolveFfmpegPath();
  if (!ffmpegPath) return inputPath;

  const outPath = join(tempDir, `compressed-${Date.now()}.mp4`);
  console.info(
    "[urlImport] compressing",
    `${(st.size / (1024 * 1024)).toFixed(1)} MB → target <80 MB`,
  );

  await new Promise<void>((resolve, reject) => {
    const child = spawn(
      ffmpegPath,
      [
        "-y",
        "-i",
        inputPath,
        "-vf",
        "scale='min(1280,iw)':-2",
        "-c:v",
        "libx264",
        "-preset",
        "veryfast",
        "-crf",
        "28",
        "-c:a",
        "aac",
        "-b:a",
        "128k",
        "-movflags",
        "+faststart",
        outPath,
      ],
      { windowsHide: true },
    );
    let stderr = "";
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString("utf8");
      if (stderr.length > 8000) stderr = stderr.slice(-4000);
    });
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("Video compress timed out."));
    }, 12 * 60_000);
    child.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0) resolve();
      else
        reject(
          new Error(
            stderr.trim().slice(0, 240) || `ffmpeg exited ${code ?? "?"}`,
          ),
        );
    });
  });

  const outStat = await stat(outPath);
  console.info(
    "[urlImport] compressed to",
    `${(outStat.size / (1024 * 1024)).toFixed(1)} MB`,
  );
  if (outStat.size <= 0) return inputPath;
  return outPath;
}

function importErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error.trim()) return error;
  return "Could not import this link.";
}

async function probeYouTubeMeta(url: string): Promise<{
  title: string;
  durationSec?: number;
}> {
  try {
    const info = (await youtubedl(url, {
      dumpSingleJson: true,
      noPlaylist: true,
      noWarnings: true,
      skipDownload: true,
    })) as { title?: string; duration?: number };
    const duration =
      typeof info?.duration === "number" && Number.isFinite(info.duration)
        ? Number(info.duration)
        : undefined;
    return {
      title: info?.title
        ? sanitizeTitle(String(info.title))
        : "YouTube video",
      durationSec: duration && duration >= 1 ? duration : undefined,
    };
  } catch (error) {
    console.warn(
      "[urlImport] meta probe failed",
      error instanceof Error ? error.message : error,
    );
    return { title: "YouTube video" };
  }
}

async function uploadLocalFileToR2(input: {
  filePath: string;
  folder: string;
  publicId: string;
  knownDurationSec?: number;
}) {
  const key = objectKeyFromParts(input.folder, input.publicId, "mp4");
  const storageId = storageIdFromParts(input.folder, input.publicId);
  const st = await stat(input.filePath);
  const localDuration =
    input.knownDurationSec ?? (await probeDurationSec(input.filePath));

  console.info(
    "[urlImport] uploading to R2",
    key,
    `${(st.size / (1024 * 1024)).toFixed(1)} MB`,
  );

  try {
    const uploaded = await uploadFileToR2({
      filePath: input.filePath,
      key,
      contentType: "video/mp4",
    });
    console.info("[urlImport] R2 upload done", key);
    return {
      secureUrl: uploaded.publicUrl,
      cloudinaryPublicId: storageId,
      bytes: uploaded.bytes,
      durationSec: localDuration,
    };
  } catch (error) {
    const raw = importErrorMessage(error);
    const friendly = /Timeout|ETIMEDOUT|ESOCKETTIMEDOUT/i.test(raw)
      ? "Upload to storage timed out. Try a shorter YouTube video."
      : `R2 upload failed: ${raw}`;
    throw Object.assign(new Error(friendly), { status: 502 });
  }
}

async function downloadRemoteToFile(remoteUrl: string, outPath: string) {
  const res = await fetch(remoteUrl, {
    signal: AbortSignal.timeout(10 * 60_000),
  });
  if (!res.ok) {
    throw Object.assign(
      new Error(`Could not download video (${res.status}).`),
      { status: 502 },
    );
  }
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length <= 0) {
    throw Object.assign(new Error("Downloaded video was empty."), {
      status: 502,
    });
  }
  await writeFile(outPath, buf);
}

/**
 * Import a YouTube (or direct MP4) URL into ClipForge as a normal upload.
 * Stored on Cloudflare R2 so clipping/editor work the same as file uploads.
 */
export async function importVideoFromUrl(input: {
  uid: string;
  url: string;
}): Promise<VideoUpload> {
  const url = input.url.trim();
  if (!url) {
    throw Object.assign(new Error("Paste a video URL."), { status: 400 });
  }

  const youtube = isYouTubeUrl(url);
  const direct = isDirectVideoUrl(url);
  if (!youtube && !direct) {
    throw Object.assign(
      new Error(
        "Only YouTube links or direct .mp4/.mov/.webm URLs are supported right now.",
      ),
      { status: 400 },
    );
  }

  const meta = youtube
    ? await probeYouTubeMeta(url)
    : {
        title: sanitizeTitle(
          decodeURIComponent(url.split("/").pop() || "Video"),
        ),
      };

  const record = await createUploadRecord({
    uid: input.uid,
    name: meta.title,
    sizeBytes: 1,
    contentType: "video/mp4",
  });

  let tempDir: string | null = null;

  try {
    tempDir = await mkdtemp(join(tmpdir(), "clipforge-yt-"));
    let filePath: string;

    if (youtube) {
      const outTemplate = join(tempDir, `${record.id}.%(ext)s`);
      const preferredPath = join(tempDir, `${record.id}.mp4`);
      console.info("[urlImport] downloading YouTube (≤720p)", url);
      await downloadYouTubeToFile(url, outTemplate);
      const downloaded = await resolveDownloadedFile(tempDir, preferredPath);
      const st = await stat(downloaded);
      console.info(
        "[urlImport] downloaded",
        `${(st.size / (1024 * 1024)).toFixed(1)} MB`,
      );
      // Skip compress for typical sizes — ffmpeg re-encode was hanging imports.
      filePath = await compressVideoIfNeeded(downloaded, tempDir);
      if (filePath === downloaded) {
        console.info("[urlImport] skip compress, uploading as-is");
      }
    } else {
      filePath = join(tempDir, `${record.id}.mp4`);
      await downloadRemoteToFile(url, filePath);
      filePath = await compressVideoIfNeeded(filePath, tempDir);
    }

    const uploaded = await uploadLocalFileToR2({
      filePath,
      folder: record.folder,
      publicId: record.publicId,
      knownDurationSec: meta.durationSec,
    });

    return await completeUpload({
      id: record.id,
      uid: input.uid,
      secureUrl: uploaded.secureUrl,
      cloudinaryPublicId: uploaded.cloudinaryPublicId,
      bytes: uploaded.bytes,
      durationSec: uploaded.durationSec,
    });
  } catch (error) {
    await markUploadFailed(record.id, input.uid).catch(() => undefined);
    if (
      typeof error === "object" &&
      error &&
      "status" in error &&
      error instanceof Error
    ) {
      throw error;
    }
    const message = importErrorMessage(error);
    const friendly = /Private video|Sign in|unavailable|age/i.test(message)
      ? "This YouTube video can’t be imported (private, age-restricted, or unavailable)."
      : /Unsupported URL|ERROR:|Requested format is not available/i.test(message)
        ? "Could not download that YouTube link. Check the URL and try again."
        : /File is larger than max-filesize/i.test(message)
          ? "That YouTube video is too long/large to import. Try a shorter video or upload the file."
          : message.slice(0, 280);
    console.error("[urlImport] failed", message);
    throw Object.assign(new Error(friendly), {
      status:
        typeof error === "object" &&
        error &&
        "status" in error &&
        typeof (error as { status: unknown }).status === "number"
          ? (error as { status: number }).status
          : 500,
    });
  } finally {
    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true }).catch(() => undefined);
    }
  }
}
