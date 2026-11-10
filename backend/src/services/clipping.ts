import { FieldValue } from "firebase-admin/firestore";
import { randomUUID } from "node:crypto";
import { requireCloudName } from "../config/cloudinary.js";
import { getCloudinary } from "../config/cloudinary.js";
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
import { getUploadForUser } from "./uploads.js";
import type { ManualSegment, ViralClip } from "../types/clip.js";

export type PeakWindow = {
  uploadId: string;
  publicId: string;
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

function buildClipUrl(
  cloudName: string,
  publicId: string,
  start: number,
  end: number,
) {
  const duration = Math.max(1, round1(end - start));
  const transforms = [`so_${start}`, `du_${duration}`, "f_mp4", "q_auto"].join(
    ",",
  );
  return `https://res.cloudinary.com/${cloudName}/video/upload/${transforms}/${publicId}.mp4`;
}

async function resolveVideoDuration(input: {
  publicId: string;
  cloudName: string;
  secureUrl?: string;
  bytes?: number;
  savedDuration?: number;
}): Promise<number> {
  if (
    typeof input.savedDuration === "number" &&
    Number.isFinite(input.savedDuration) &&
    input.savedDuration >= 8
  ) {
    return input.savedDuration;
  }

  const cloudinary = getCloudinary();

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const resource = await cloudinary.api.resource(input.publicId, {
        resource_type: "video",
        media_metadata: true,
        image_metadata: true,
      });
      const candidates = [
        resource.duration,
        (resource as { video?: { duration?: number } }).video?.duration,
        Number(
          (resource as { media_metadata?: { video_duration?: string } })
            .media_metadata?.video_duration,
        ),
      ];
      for (const c of candidates) {
        const n = Number(c);
        if (Number.isFinite(n) && n >= 8) return n;
      }
    } catch (error) {
      console.warn("[clipping/duration] resource lookup failed", error);
    }

    try {
      const infoUrl = `https://res.cloudinary.com/${input.cloudName}/video/upload/fl_getinfo/${input.publicId}.json`;
      const res = await fetch(infoUrl, {
        signal: AbortSignal.timeout(8_000),
      });
      if (res.ok) {
        const info = (await res.json()) as {
          duration?: number;
          video?: { duration?: number };
        };
        const n = Number(info.duration ?? info.video?.duration ?? 0);
        if (Number.isFinite(n) && n >= 8) return n;
      }
    } catch (error) {
      console.warn("[clipping/duration] fl_getinfo failed", error);
    }

    if (attempt === 0) {
      await new Promise((r) => setTimeout(r, 1200));
    }
  }

  if (input.bytes && input.bytes > 2_000_000) {
    const estimated = Math.max(60, Math.round((input.bytes * 8) / 1_000_000));
    console.warn(
      `[clipping/duration] using size estimate ~${estimated}s for ${input.publicId}`,
    );
    return estimated;
  }

  throw Object.assign(
    new Error(
      "Could not read this video’s length from Cloudinary yet. Wait ~30s and try again.",
    ),
    { status: 400 },
  );
}

async function loadReadyUpload(uploadId: string, uid: string) {
  const upload = await getUploadForUser(uploadId, uid);
  if (!upload) {
    throw Object.assign(new Error("Upload not found"), { status: 404 });
  }
  if (!upload.cloudinaryPublicId && !upload.publicId) {
    throw Object.assign(new Error("Upload has no Cloudinary asset yet"), {
      status: 400,
    });
  }
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

/**
 * Full Cloudinary source for the manual crop editor.
 * Users trim anywhere in the complete upload (not a 40s peak slice).
 */
export async function getPeakWindowForUpload(input: {
  uploadId: string;
  uid: string;
}): Promise<PeakWindow> {
  const upload = await loadReadyUpload(input.uploadId, input.uid);
  const publicId =
    upload.cloudinaryPublicId ?? `${upload.folder}/${upload.publicId}`;
  const cloudName = requireCloudName();

  const durationSec = await resolveVideoDuration({
    publicId,
    cloudName,
    secureUrl: upload.secureUrl,
    bytes: upload.bytes ?? upload.sizeBytes,
    savedDuration: (upload as { durationSec?: number }).durationSec,
  });

  await db.collection("uploads").doc(upload.id).set(
    {
      durationSec,
      updatedAtServer: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  const previewUrl =
    upload.secureUrl ??
    `https://res.cloudinary.com/${cloudName}/video/upload/f_mp4,q_auto/${publicId}.mp4`;

  return {
    uploadId: upload.id,
    publicId,
    cloudName,
    durationSec,
    windowStartSec: 0,
    windowEndSec: round1(durationSec),
    windowDurationSec: round1(durationSec),
    peakSec: round1(durationSec * 0.32),
    previewUrl,
    secureUrl: upload.secureUrl,
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
  const publicId =
    upload.cloudinaryPublicId ?? `${upload.folder}/${upload.publicId}`;
  const cloudName = requireCloudName();
  const baseName = cleanTitle(upload.name);

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
      publicId,
      cloudName,
      secureUrl: upload.secureUrl,
      bytes: upload.bytes ?? upload.sizeBytes,
      savedDuration: (upload as { durationSec?: number }).durationSec,
    });

    const targetCount = suggestedViralClipCount(durationSec);
    const clipLen = Math.min(
      AI_CLIP_MAX_SEC,
      Math.max(AI_CLIP_MIN_SEC, Math.min(AI_CLIP_TARGET_SEC, Math.floor(durationSec))),
    );

    // Priority 1: real most-watched / peak-energy windows only (no fillers)
    const watched = await findTopMostWatchedWindows({
      cloudName,
      publicId,
      durationSec,
      count: targetCount,
      clipLenSec: clipLen,
      fillFallback: false,
    });

    // Priority 2: AI (or heuristic) viral guesses for uncovered moments
    const aiBudget = Math.max(1, targetCount - watched.length);
    const aiSegments = await pickViralSegments({
      fileName: upload.name,
      durationSec,
      count: aiBudget,
      occupied: watched.map((w) => ({
        startSec: w.startSec,
        endSec: w.endSec,
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
      viralScore: Math.min(seg.viralScore, 88),
      method: "ai-viral",
      rank: watched.length + i + 1,
      title: seg.title,
      hook: seg.hook,
      reason: seg.reason,
    }));

    // Keep most-watched ahead of AI picks; score-rank within each tier
    const windows: WindowMeta[] = [
      ...[...watched].sort((a, b) => b.viralScore - a.viralScore),
      ...[...aiWindows].sort((a, b) => b.viralScore - a.viralScore),
    ].map((w, i) => ({ ...w, rank: i + 1 }));

    console.log(
      `[clipping] AI clips (${windows.length}): ${windows
        .map(
          (w) =>
            `#${w.rank}@${w.peakSec}s/${w.method}/${Math.round(w.endSec - w.startSec)}s`,
        )
        .join(", ")}`,
    );

    const now = new Date().toISOString();
    const clips: ViralClip[] = windows.map((w, index) => {
      const rank = index + 1;
      const clipUrl = buildClipUrl(cloudName, publicId, w.startSec, w.endSec);
      const isWatched = w.method === "peak-energy" || w.method === "fallback-thirds";
      return {
        id: randomUUID(),
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
      };
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
  const publicId =
    upload.cloudinaryPublicId ?? `${upload.folder}/${upload.publicId}`;
  const cloudName = requireCloudName();
  const baseName = cleanTitle(upload.name);

  const durationSec = await resolveVideoDuration({
    publicId,
    cloudName,
    secureUrl: upload.secureUrl,
    bytes: upload.bytes ?? upload.sizeBytes,
    savedDuration: (upload as { durationSec?: number }).durationSec,
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

  const now = new Date().toISOString();
  const clips: ViralClip[] = normalized.map((seg, index) => {
    const rank = index + 1;
    return {
      id: randomUUID(),
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
      clipUrl: buildClipUrl(cloudName, publicId, seg.startSec, seg.endSec),
      status: "ready" as const,
      source: "manual" as const,
      rank,
      createdAt: now,
      updatedAt: now,
    };
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
