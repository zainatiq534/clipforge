import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { createWriteStream } from "node:fs";
import { mkdtemp, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import { uploadFileToR2 } from "../config/r2.js";

const require = createRequire(import.meta.url);

export function resolveFfmpegPath(): string | undefined {
  try {
    const ffmpegPath = require("ffmpeg-static") as string | null;
    return ffmpegPath || undefined;
  } catch {
    return undefined;
  }
}

export async function probeDurationSec(
  source: string,
): Promise<number | undefined> {
  const ffmpegPath = resolveFfmpegPath();
  if (!ffmpegPath) return undefined;
  return new Promise((resolve) => {
    // Header-only probe — do NOT use `-f null -` (that decodes the whole file).
    const child = spawn(ffmpegPath, ["-hide_banner", "-i", source], {
      windowsHide: true,
    });
    let stderr = "";
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString("utf8");
    });
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      resolve(undefined);
    }, 20_000);
    child.on("close", () => {
      clearTimeout(timer);
      const match = stderr.match(/Duration:\s*(\d+):(\d+):(\d+(?:\.\d+)?)/);
      if (!match) {
        resolve(undefined);
        return;
      }
      const h = Number(match[1]);
      const m = Number(match[2]);
      const s = Number(match[3]);
      const total = h * 3600 + m * 60 + s;
      resolve(Number.isFinite(total) && total >= 1 ? total : undefined);
    });
    child.on("error", () => {
      clearTimeout(timer);
      resolve(undefined);
    });
  });
}

/** Download a remote video once so many trims can run locally (much faster). */
export async function downloadSourceToTemp(
  sourceUrl: string,
): Promise<{ tempDir: string; filePath: string }> {
  const tempDir = await mkdtemp(join(tmpdir(), "clipforge-src-"));
  const filePath = join(tempDir, `${randomUUID()}.mp4`);
  console.info("[ffmpeg] downloading source once for clipping…");

  const res = await fetch(sourceUrl, {
    signal: AbortSignal.timeout(15 * 60_000),
  });
  if (!res.ok || !res.body) {
    await rm(tempDir, { recursive: true, force: true }).catch(() => undefined);
    throw Object.assign(
      new Error(`Could not download source video (${res.status}).`),
      { status: 502 },
    );
  }

  const nodeStream = Readable.fromWeb(
    res.body as import("node:stream/web").ReadableStream,
  );
  await pipeline(nodeStream, createWriteStream(filePath));
  const st = await stat(filePath);
  if (st.size <= 0) {
    await rm(tempDir, { recursive: true, force: true }).catch(() => undefined);
    throw Object.assign(new Error("Downloaded source was empty."), {
      status: 502,
    });
  }
  console.info(
    "[ffmpeg] source ready",
    `${(st.size / (1024 * 1024)).toFixed(1)} MB`,
  );
  return { tempDir, filePath };
}

function runFfmpeg(args: string[], timeoutMs: number): Promise<void> {
  const ffmpegPath = resolveFfmpegPath();
  if (!ffmpegPath) {
    return Promise.reject(
      Object.assign(
        new Error("FFmpeg is missing on the server — cannot create clips."),
        { status: 500 },
      ),
    );
  }

  return new Promise((resolve, reject) => {
    const child = spawn(ffmpegPath, args, { windowsHide: true });
    let stderr = "";
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString("utf8");
      if (stderr.length > 12_000) stderr = stderr.slice(-6_000);
    });
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("Clip trim timed out."));
    }, timeoutMs);
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
            stderr.trim().slice(0, 280) || `ffmpeg exited ${code ?? "?"}`,
          ),
        );
    });
  });
}

/**
 * Trim locally with a short re-encode.
 * Stream-copy looks "sticky" in players (keyframe cuts / odd timestamps);
 * ultrafast x264 with a regular GOP plays and exports smoothly.
 */
export async function trimLocalToFile(input: {
  sourcePath: string;
  startSec: number;
  endSec: number;
  outPath: string;
}): Promise<void> {
  const start = Math.max(0, input.startSec);
  const duration = Math.max(0.5, input.endSec - input.startSec);

  await runFfmpeg(
    [
      "-y",
      "-ss",
      String(start),
      "-i",
      input.sourcePath,
      "-t",
      String(duration),
      "-c:v",
      "libx264",
      "-preset",
      "ultrafast",
      "-crf",
      "23",
      "-pix_fmt",
      "yuv420p",
      "-g",
      "30",
      "-keyint_min",
      "30",
      "-sc_threshold",
      "0",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-ar",
      "44100",
      "-movflags",
      "+faststart",
      input.outPath,
    ],
    5 * 60_000,
  );
}

/**
 * Trim a local/remote video and upload the clip to R2.
 * Prefer passing a local `sourcePath` (download once) for speed.
 */
export async function trimAndUploadClip(input: {
  sourceUrl?: string;
  sourcePath?: string;
  startSec: number;
  endSec: number;
  key: string;
}): Promise<{ publicUrl: string; bytes: number; durationSec: number }> {
  const source = input.sourcePath || input.sourceUrl;
  if (!source) {
    throw Object.assign(new Error("No source video for trim."), { status: 400 });
  }

  const duration = Math.max(0.5, input.endSec - input.startSec);
  const tempDir = await mkdtemp(join(tmpdir(), "clipforge-trim-"));
  const outPath = join(tempDir, `${randomUUID()}.mp4`);

  try {
    if (input.sourcePath) {
      await trimLocalToFile({
        sourcePath: input.sourcePath,
        startSec: input.startSec,
        endSec: input.endSec,
        outPath,
      });
    } else {
      // Remote URL path — stream copy first (faster than full re-encode)
      const start = Math.max(0, input.startSec);
      try {
        await runFfmpeg(
          [
            "-y",
            "-ss",
            String(start),
            "-i",
            input.sourceUrl!,
            "-t",
            String(duration),
            "-c",
            "copy",
            "-avoid_negative_ts",
            "make_zero",
            "-movflags",
            "+faststart",
            outPath,
          ],
          3 * 60_000,
        );
      } catch {
        await runFfmpeg(
          [
            "-y",
            "-ss",
            String(start),
            "-i",
            input.sourceUrl!,
            "-t",
            String(duration),
            "-c:v",
            "libx264",
            "-preset",
            "ultrafast",
            "-crf",
            "28",
            "-c:a",
            "aac",
            "-b:a",
            "96k",
            "-movflags",
            "+faststart",
            outPath,
          ],
          8 * 60_000,
        );
      }
    }

    const st = await stat(outPath);
    if (st.size <= 0) {
      throw Object.assign(new Error("Trimmed clip was empty."), { status: 500 });
    }

    const uploaded = await uploadFileToR2({
      filePath: outPath,
      key: input.key,
      contentType: "video/mp4",
    });

    return {
      publicUrl: uploaded.publicUrl,
      bytes: uploaded.bytes,
      durationSec: Math.round(duration * 10) / 10,
    };
  } finally {
    await rm(tempDir, { recursive: true, force: true }).catch(() => undefined);
  }
}
