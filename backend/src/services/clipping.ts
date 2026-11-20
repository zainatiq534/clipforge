import { FieldValue } from "firebase-admin/firestore";
import { randomUUID } from "node:crypto";
import { publicUrlForKey, keyFromStorageId } from "../config/r2.js";
import { db } from "../config/firebase.js";
import { pickViralSegments } from "./agentRouter.js";
import {
  AI_CLIP_MAX_SEC,
  AI_CLIP_MIN_SEC,
  AI_CLIP_TARGET_SEC,
  findTopMostWatchedWindows,
  suggestedViralClipCount,
  type MostWatchedWindow,
} from "./engagement.js";
import {
  downloadSourceToTemp,
  probeDurationSec,
  trimAndUploadClip,
} from "./ffmpegMedia.js";
import { getUploadForUser } from "./uploads.js";
import type { ManualSegment, ViralClip } from "../types/clip.js";
import { rm } from "node:fs/promises";

export type PeakWindow = {
  uploadId: string;
  publicId: string;
  /** Legacy Cloudinary field; "r2" for Cloudflare storage. */
  cloudName: string;
  durationSec: number;
  windowStartSec: number;
  windowEndSec: number;
  windowDurationSec: number;
  peakSec: number;
  previewUrl: string;
  secureUrl?: string;
};

export const CLIPS_COLLECTION = "clips";

function publicIdFromSecureUrl(secureUrl: string): string | null {
  try {
    const u = new URL(secureUrl);
    // Cloudinary: .../video/upload/.../folder/id.mp4
    const marker = "/video/upload/";
    const idx = u.pathname.indexOf(marker);
    if (idx >= 0) {
      const parts = u.pathname
        .slice(idx + marker.length)
        .split("/")
        .filter(Boolean);
      while (
        parts.length &&
        (/^v\d+$/i.test(parts[0]!) ||
          parts[0]!.includes(",") ||
          /^(so_|du_|f_|q_|w_|h_|c_)/.test(parts[0]!))
      ) {
        parts.shift();
      }
      if (!parts.length) return null;
      return parts.join("/").replace(/\.(mp4|mov|webm|mkv)$/i, "");
    }
    // R2 public URL: https://pub-xxx.r2.dev/folder/id.mp4
    const path = u.pathname.replace(/^\/+/, "");
    if (!path) return null;
    return path.replace(/\.(mp4|mov|webm|mkv)$/i, "");
  } catch {
    return null;
  }
}

function resolveUploadPublicId(upload: {
  cloudinaryPublicId?: string;
  folder?: string;
  publicId?: string;
  secureUrl?: string;
}): string {
  const raw = upload.cloudinaryPublicId?.trim();
  if (raw && raw !== "undefined" && raw !== "null") return raw;
  if (upload.secureUrl) {
    const fromUrl = publicIdFromSecureUrl(upload.secureUrl);
    if (fromUrl) return fromUrl;
  }
  if (upload.folder && upload.publicId) {
    return `${upload.folder.replace(/^\/+|\/+$/g, "")}/${upload.publicId}`;
  }
  if (upload.publicId) return upload.publicId;
  throw Object.assign(new Error("Upload has no stored video yet"), {
    status: 400,
  });
}

function resolveSourceUrl(upload: {
  secureUrl?: string;
  cloudinaryPublicId?: string;
  folder?: string;
  publicId?: string;
}): string {
  if (upload.secureUrl?.trim()) return upload.secureUrl.trim();
  const storageId = resolveUploadPublicId(upload);
  return publicUrlForKey(keyFromStorageId(storageId, "mp4"));
}

async function resolveVideoDuration(input: {
  sourceUrl: string;
  bytes?: number;
  savedDuration?: number;
  label?: string;
}): Promise<number> {
  if (
    typeof input.savedDuration === "number" &&
    Number.isFinite(input.savedDuration) &&
    input.savedDuration >= 8
  ) {
    return input.savedDuration;
  }

  for (let attempt = 0; attempt < 2; attempt++) {
    const probed = await probeDurationSec(input.sourceUrl);
    if (typeof probed === "number" && probed >= 8) return probed;
    if (attempt === 0) {
      await new Promise((r) => setTimeout(r, 800));
    }
  }

  if (input.bytes && input.bytes > 2_000_000) {
    const estimated = Math.max(60, Math.round((input.bytes * 8) / 1_000_000));
    console.warn(
      `[clipping/duration] using size estimate ~${estimated}s for ${input.label ?? "video"}`,
    );
    return estimated;
  }

  throw Object.assign(
    new Error(
      "Could not read this video’s length yet. Wait a few seconds and try again.",
    ),
    { status: 400 },
  );
}

async function loadReadyUpload(uploadId: string, uid: string) {
  const upload = await getUploadForUser(uploadId, uid);
  if (!upload) {
    throw Object.assign(new Error("Upload not found"), { status: 404 });
  }
  resolveUploadPublicId(upload);
  if (upload.status !== "ready" && upload.status !== "processing") {
    throw Object.assign(new Error("Upload must be Ready before clipping"), {
      status: 400,
    });
  }
  return upload;
}

function formatTs(sec: number) {
  const s = Math.max(0, Math.round(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

function cleanTitle(fileName: string) {
  return (
    fileName
      .replace(/\.[^.]+$/, "")
      .replace(/[_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 50) || "Clip"
  );
}

function clipObjectKey(folder: string, clipId: string) {
  const cleanFolder = folder.replace(/^\/+|\/+$/g, "") || "clipforge";
  return `${cleanFolder}/clips/${clipId}.mp4`;
}

async function materializeClip(input: {
  sourceUrl: string;
  sourcePath?: string;
  folder: string;
  clipId: string;
  startSec: number;
  endSec: number;
}): Promise<string> {
  const uploaded = await trimAndUploadClip({
    sourceUrl: input.sourceUrl,
    sourcePath: input.sourcePath,
    startSec: input.startSec,
    endSec: input.endSec,
    key: clipObjectKey(input.folder, input.clipId),
  });
  return uploaded.publicUrl;
}

async function mapPool<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  async function run() {
    while (next < items.length) {
      const i = next++;
      results[i] = await worker(items[i]!, i);
    }
  }
  const n = Math.max(1, Math.min(concurrency, items.length));
  await Promise.all(Array.from({ length: n }, () => run()));
  return results;
}

/**
 * Full source for the manual crop editor.
 * Users trim anywhere in the complete upload (not a 40s peak slice).
 */
export async function getPeakWindowForUpload(input: {
  uploadId: string;
  uid: string;
}): Promise<PeakWindow> {
  const upload = await loadReadyUpload(input.uploadId, input.uid);
  const publicId = resolveUploadPublicId(upload);
  const sourceUrl = resolveSourceUrl(upload);

  const durationSec = await resolveVideoDuration({
    sourceUrl,
    bytes: upload.bytes ?? upload.sizeBytes,
    savedDuration: (upload as { durationSec?: number }).durationSec,
    label: publicId,
  });

  await db.collection("uploads").doc(upload.id).set(
    {
      durationSec,
      cloudinaryPublicId: publicId,
      secureUrl: upload.secureUrl ?? sourceUrl,
      updatedAtServer: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  const previewUrl = upload.secureUrl ?? sourceUrl;

  return {
    uploadId: upload.id,
    publicId,
    cloudName: "r2",
    durationSec,
    windowStartSec: 0,
    windowEndSec: round1(durationSec),
    windowDurationSec: round1(durationSec),
    peakSec: round1(durationSec * 0.32),
    previewUrl,
    secureUrl: upload.secureUrl ?? sourceUrl,
  };
}

/**
 * AI path: cover all strong viral moments.
 * Priority 1 — most-watched / peak-energy windows (30–60s).
 * Priority 2 — AI-predicted viral windows that don't overlap those.
 * Clip count scales with video length (not fixed at 3).
 */
export async function createViralClipsForUpload(input: {
  uploadId: string;
  uid: string;
}): Promise<ViralClip[]> {
  const upload = await loadReadyUpload(input.uploadId, input.uid);
  const publicId = resolveUploadPublicId(upload);
  const sourceUrl = resolveSourceUrl(upload);
  const baseName = cleanTitle(upload.name);

  if (upload.cloudinaryPublicId !== publicId) {
    await db.collection("uploads").doc(upload.id).set(
      {
        cloudinaryPublicId: publicId,
        updatedAt: new Date().toISOString(),
        updatedAtServer: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
  }

  await db.collection("uploads").doc(upload.id).set(
    {
      status: "processing",
      updatedAt: new Date().toISOString(),
      updatedAtServer: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  try {
    const durationSec = await resolveVideoDuration({
      sourceUrl,
      bytes: upload.bytes ?? upload.sizeBytes,
      savedDuration: (upload as { durationSec?: number }).durationSec,
      label: publicId,
    });

    const targetCount = suggestedViralClipCount(durationSec);
    const clipLen = Math.min(
      AI_CLIP_MAX_SEC,
      Math.max(AI_CLIP_MIN_SEC, Math.min(AI_CLIP_TARGET_SEC, Math.floor(durationSec))),
    );

    // Peak-energy = hints for the AI (not the final ranking).
    const peakHints = await findTopMostWatchedWindows({
      sourceUrl,
      durationSec,
      count: Math.min(8, Math.max(targetCount, 5)),
      clipLenSec: clipLen,
      fillFallback: false,
    });

    // Primary product: AI viral picks (OpenRouter), informed by peak hints.
    const aiSegments = await pickViralSegments({
      fileName: upload.name,
      durationSec,
      count: targetCount,
      occupied: [],
      peakHints: peakHints.map((w) => ({
        startSec: w.startSec,
        endSec: w.endSec,
        peakSec: w.peakSec,
        viralScore: w.viralScore,
      })),
    });

    type WindowMeta = MostWatchedWindow & {
      title?: string;
      hook?: string;
      reason?: string;
    };

    const aiWindows: WindowMeta[] = aiSegments.map((seg, i) => ({
      startSec: seg.startSec,
      endSec: seg.endSec,
      peakSec: round1((seg.startSec + seg.endSec) / 2),
      viralScore: Math.min(seg.viralScore, 98),
      method: "ai-viral" as const,
      rank: i + 1,
      title: seg.title,
      hook: seg.hook,
      reason: seg.reason,
    }));

    // If AI returned fewer than target, fill remaining with unused peak windows.
    const fillers: WindowMeta[] = [];
    if (aiWindows.length < targetCount) {
      for (const peak of [...peakHints].sort(
        (a, b) => b.viralScore - a.viralScore,
      )) {
        if (aiWindows.length + fillers.length >= targetCount) break;
        const overlaps = [...aiWindows, ...fillers].some(
          (o) =>
            Math.min(peak.endSec, o.endSec) -
              Math.max(peak.startSec, o.startSec) >
            clipLen * 0.35,
        );
        if (overlaps) continue;
        fillers.push({
          ...peak,
          method: "peak-energy",
          rank: aiWindows.length + fillers.length + 1,
        });
      }
    }

    const limited: WindowMeta[] = [...aiWindows, ...fillers]
      .slice(0, 5)
      .map((w, i) => ({ ...w, rank: i + 1 }));
    console.log(
      `[clipping] AI clips (${limited.length}): ${limited
        .map(
          (w) =>
            `#${w.rank}@${w.peakSec}s/${w.method}/${Math.round(w.endSec - w.startSec)}s`,
        )
        .join(", ")}`,
    );

    let localSource: { tempDir: string; filePath: string } | null = null;
    try {
      localSource = await downloadSourceToTemp(sourceUrl);
    } catch (error) {
      console.warn(
        "[clipping] local download failed — trimming from URL",
        error instanceof Error ? error.message : error,
      );
    }

    const now = new Date().toISOString();
    try {
      const clips = await mapPool(limited, 3, async (w, index) => {
        const rank = index + 1;
        const id = randomUUID();
        console.info(
          `[clipping] trimming clip #${rank}`,
          `${w.startSec}–${w.endSec}`,
        );
        const clipUrl = await materializeClip({
          sourceUrl,
          sourcePath: localSource?.filePath,
          folder: upload.folder,
          clipId: id,
          startSec: w.startSec,
          endSec: w.endSec,
        });
        const isWatched =
          w.method === "peak-energy" || w.method === "fallback-thirds";
        return {
          id,
          uploadId: upload.id,
          uid: input.uid,
          title:
            w.title ??
            `${baseName} — viral #${rank} @ ${formatTs(w.peakSec)}`,
          hook:
            w.hook ??
            (isWatched
              ? `Most-watched peak #${rank} near ${formatTs(w.peakSec)}`
              : `AI viral pick #${rank} near ${formatTs(w.peakSec)}`),
          reason:
            w.reason ??
            (isWatched
              ? `Most-watched window #${rank} from peak-energy scan (${w.method}).`
              : `AI-predicted viral window #${rank}.`),
          viralScore: w.viralScore,
          startSec: w.startSec,
          endSec: w.endSec,
          durationSec: round1(w.endSec - w.startSec),
          sourcePublicId: publicId,
          clipUrl,
          status: "ready" as const,
          source: "ai" as const,
          rank,
          createdAt: now,
          updatedAt: now,
        } satisfies ViralClip;
      });

      const batch = db.batch();
      for (const clip of clips) {
        batch.set(db.collection(CLIPS_COLLECTION).doc(clip.id), {
          ...clip,
          createdAtServer: FieldValue.serverTimestamp(),
          updatedAtServer: FieldValue.serverTimestamp(),
        });
      }
      batch.set(
        db.collection("uploads").doc(upload.id),
        {
          status: "ready",
          durationSec,
          latestClipId: clips[0]?.id,
          latestClipUrl: clips[0]?.clipUrl,
          latestClipTitle: clips[0]?.title,
          latestViralScore: clips[0]?.viralScore,
          latestClipIds: clips.map((c) => c.id),
          updatedAt: now,
          updatedAtServer: FieldValue.serverTimestamp(),
        },
        { merge: true },
      );
      await batch.commit();

      return clips;
    } finally {
      if (localSource) {
        await rm(localSource.tempDir, { recursive: true, force: true }).catch(
          () => undefined,
        );
      }
    }
  } catch (error) {
    await db.collection("uploads").doc(upload.id).set(
      {
        status: "ready",
        updatedAt: new Date().toISOString(),
        updatedAtServer: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
    throw error;
  }
}

/** Manual path: user-defined segments → one clip per segment (no fixed count). */
export async function createManualClipsForUpload(input: {
  uploadId: string;
  uid: string;
  segments: ManualSegment[];
}): Promise<ViralClip[]> {
  if (input.segments.length < 1) {
    throw Object.assign(new Error("Add at least one manual segment."), {
      status: 400,
    });
  }

  const upload = await loadReadyUpload(input.uploadId, input.uid);
  const publicId = resolveUploadPublicId(upload);
  const sourceUrl = resolveSourceUrl(upload);
  const baseName = cleanTitle(upload.name);

  if (upload.cloudinaryPublicId !== publicId) {
    await db.collection("uploads").doc(upload.id).set(
      {
        cloudinaryPublicId: publicId,
        updatedAtServer: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
  }

  const durationSec = await resolveVideoDuration({
    sourceUrl,
    bytes: upload.bytes ?? upload.sizeBytes,
    savedDuration: (upload as { durationSec?: number }).durationSec,
    label: publicId,
  });

  const normalized = input.segments.map((seg, index) => {
    const startSec = Number(seg.startSec);
    const endSec = Number(seg.endSec);
    if (!Number.isFinite(startSec) || !Number.isFinite(endSec)) {
      throw Object.assign(
        new Error(`Part ${index + 1}: start and end must be numbers.`),
        { status: 400 },
      );
    }
    if (startSec < 0 || endSec > durationSec + 1) {
      throw Object.assign(
        new Error(
          `Part ${index + 1}: times must be within 0–${durationSec.toFixed(0)}s.`,
        ),
        { status: 400 },
      );
    }
    if (endSec - startSec < 3) {
      throw Object.assign(
        new Error(`Part ${index + 1}: clip must be at least 3 seconds.`),
        { status: 400 },
      );
    }
    if (endSec - startSec > 120) {
      throw Object.assign(
        new Error(`Part ${index + 1}: keep each manual clip under 120 seconds.`),
        { status: 400 },
      );
    }
    return {
      startSec: round1(startSec),
      endSec: round1(endSec),
      title: seg.title?.trim() || undefined,
    };
  });

  let localSource: { tempDir: string; filePath: string } | null = null;
  try {
    localSource = await downloadSourceToTemp(sourceUrl);
  } catch (error) {
    console.warn(
      "[clipping] local download failed — trimming from URL",
      error instanceof Error ? error.message : error,
    );
  }

  const now = new Date().toISOString();
  try {
    const clips = await mapPool(normalized, 3, async (seg, index) => {
      const rank = index + 1;
      const id = randomUUID();
      console.info(
        `[clipping] trimming manual clip #${rank}`,
        `${seg.startSec}–${seg.endSec}`,
      );
      const clipUrl = await materializeClip({
        sourceUrl,
        sourcePath: localSource?.filePath,
        folder: upload.folder,
        clipId: id,
        startSec: seg.startSec,
        endSec: seg.endSec,
      });
      return {
        id,
        uploadId: upload.id,
        uid: input.uid,
        title:
          seg.title ??
          `${baseName} — manual part ${rank} (${formatTs(seg.startSec)}–${formatTs(seg.endSec)})`,
        hook: `Manual cut #${rank}`,
        reason: "User-selected segment.",
        viralScore: 0,
        startSec: seg.startSec,
        endSec: seg.endSec,
        durationSec: round1(seg.endSec - seg.startSec),
        sourcePublicId: publicId,
        clipUrl,
        status: "ready" as const,
        source: "manual" as const,
        rank,
        createdAt: now,
        updatedAt: now,
      } satisfies ViralClip;
    });

    const batch = db.batch();
    for (const clip of clips) {
      batch.set(db.collection(CLIPS_COLLECTION).doc(clip.id), {
        ...clip,
        createdAtServer: FieldValue.serverTimestamp(),
        updatedAtServer: FieldValue.serverTimestamp(),
      });
    }
    batch.set(
      db.collection("uploads").doc(upload.id),
      {
        status: "ready",
        durationSec,
        latestClipId: clips[0]?.id,
        latestClipUrl: clips[0]?.clipUrl,
        latestClipTitle: clips[0]?.title,
        latestViralScore: clips[0]?.viralScore ?? 0,
        latestClipIds: clips.map((c) => c.id),
        updatedAt: now,
        updatedAtServer: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
    await batch.commit();

    return clips;
  } finally {
    if (localSource) {
      await rm(localSource.tempDir, { recursive: true, force: true }).catch(
        () => undefined,
      );
    }
  }
}

/** @deprecated prefer createViralClipsForUpload */
export async function createViralClipForUpload(input: {
  uploadId: string;
  uid: string;
}): Promise<ViralClip> {
  const clips = await createViralClipsForUpload(input);
  if (!clips[0]) {
    throw Object.assign(new Error("No viral clips produced"), { status: 500 });
  }
  return clips[0];
}

export async function listClipsForUser(uid: string, limit = 40) {
  const snap = await db
    .collection(CLIPS_COLLECTION)
    .where("uid", "==", uid)
    .get();
  return snap.docs
    .map((d) => d.data() as ViralClip)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}
