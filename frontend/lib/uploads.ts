import { getFirebaseAuth } from "@/lib/firebase";
import { apiFetch } from "@/lib/api";

export type UploadStatus =
  | "uploading"
  | "ready"
  | "failed"
  | "queued"
  | "processing";

export type VideoUpload = {
  id: string;
  uid: string;
  name: string;
  sizeBytes: number;
  contentType: string;
  status: UploadStatus;
  folder: string;
  publicId: string;
  secureUrl?: string;
  cloudinaryPublicId?: string;
  bytes?: number;
  durationSec?: number;
  latestClipId?: string;
  latestClipUrl?: string;
  latestClipTitle?: string;
  latestViralScore?: number;
  latestClipIds?: string[];
  createdAt: string;
  updatedAt: string;
};

export type ViralClip = {
  id: string;
  uploadId: string;
  uid: string;
  title: string;
  hook: string;
  reason: string;
  viralScore: number;
  startSec: number;
  endSec: number;
  durationSec: number;
  sourcePublicId: string;
  clipUrl: string;
  status: "ready" | "failed" | "processing";
  source?: "ai" | "manual";
  rank?: number;
  createdAt: string;
  updatedAt: string;
};

export type ManualSegment = {
  startSec: number;
  endSec: number;
  title?: string;
};

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

export type ExportRatio = "natural" | "yt-shorts" | "instagram" | "tiktok";

/** Preview URL for a trim range. R2 uses media fragments; Cloudinary uses transforms. */
export function buildCloudinaryClipUrl(
  cloudName: string,
  publicId: string,
  startSec: number,
  endSec: number,
  previewUrl?: string,
) {
  const start = Math.max(0, Math.round(startSec * 10) / 10);
  const end = Math.max(start + 0.1, Math.round(endSec * 10) / 10);
  if (previewUrl && (!cloudName || cloudName === "r2")) {
    return `${previewUrl.split("#")[0]}#t=${start},${end}`;
  }
  if (previewUrl && !previewUrl.includes("res.cloudinary.com")) {
    return `${previewUrl.split("#")[0]}#t=${start},${end}`;
  }
  const duration = Math.max(1, Math.round((endSec - startSec) * 10) / 10);
  const so = Math.round(startSec * 10) / 10;
  return `https://res.cloudinary.com/${cloudName}/video/upload/so_${so},du_${duration},f_mp4,q_auto/${publicId}.mp4`;
}

/** Letterbox to 9:16 (pad, never crop) — matches Shorts / Reels / TikTok preview. */
function ratioTransform(ratio: ExportRatio): string | null {
  if (ratio === "natural") return null;
  // Force exact vertical delivery size (Cloudinary pads landscape inside).
  return "c_pad,b_black,w_1080,h_1920";
}

/**
 * Inject export-ratio transforms into an existing Cloudinary clip URL.
 * Keeps so_/du_ trim; adds 9:16 letterbox for short-form ratios.
 */
export function buildExportClipUrl(
  clipUrl: string,
  ratio: ExportRatio = "natural",
) {
  const transform = ratioTransform(ratio);
  if (!transform) return clipUrl;

  try {
    const u = new URL(clipUrl);
    if (!u.hostname.includes("res.cloudinary.com")) return clipUrl;
    const marker = "/video/upload/";
    const idx = u.pathname.indexOf(marker);
    if (idx < 0) return clipUrl;

    const prefix = u.pathname.slice(0, idx + marker.length);
    let after = u.pathname.slice(idx + marker.length);

    // Strip a previous letterbox / attachment layer if re-exporting.
    after = after
      .replace(/^fl_attachment:[^/]+\//, "")
      .replace(
        /(?:^|\/)c_pad,b_black,ar_9:16(?:,w_\d+)?(?:,h_\d+)?(?=\/|,|$)/g,
        "",
      )
      .replace(/^\/+/, "");

    const slash = after.indexOf("/");
    if (slash < 0) {
      u.pathname = `${prefix}${transform},f_mp4,q_auto/${after}`;
      return u.toString();
    }

    const first = after.slice(0, slash);
    const rest = after.slice(slash + 1);

    // Merge into the first transformation segment (alongside so_/du_).
    const parts = first.split(",").filter(Boolean);
    const withoutFormat = parts.filter(
      (p) =>
        !p.startsWith("f_") &&
        !p.startsWith("q_") &&
        !p.startsWith("c_pad") &&
        !p.startsWith("ar_") &&
        p !== "b_black" &&
        !p.startsWith("w_1080") &&
        !p.startsWith("h_1920"),
    );
    const merged = [
      ...withoutFormat,
      ...transform.split(","),
      "f_mp4",
      "q_auto",
    ].join(",");

    u.pathname = `${prefix}${merged}/${rest}`;
    return u.toString();
  } catch {
    return clipUrl;
  }
}

function sanitizeDownloadName(name: string) {
  const base = name
    .replace(/\.[^.]+$/, "")
    .replace(/[^\w\-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 80);
  return `${base || "clipforge-clip"}.mp4`;
}

/** Force Cloudinary to send Content-Disposition: attachment when possible. */
export function buildClipAttachmentUrl(clipUrl: string, fileName: string) {
  try {
    const u = new URL(clipUrl);
    if (!u.hostname.includes("res.cloudinary.com")) return clipUrl;
    const marker = "/video/upload/";
    const idx = u.pathname.indexOf(marker);
    if (idx < 0) return clipUrl;
    const after = u.pathname.slice(idx + marker.length);
    const safe = sanitizeDownloadName(fileName).replace(/\.mp4$/i, "");
    // Keep attachment as its own component so it doesn't break other transforms.
    if (after.startsWith("fl_attachment:")) return u.toString();
    u.pathname = `${u.pathname.slice(0, idx + marker.length)}fl_attachment:${safe}/${after}`;
    return u.toString();
  } catch {
    return clipUrl;
  }
}

/** Download a clip MP4 to the user's device, baked to the selected export ratio. */
export async function downloadClipToDevice(input: {
  url: string;
  fileName: string;
  ratio?: ExportRatio;
}) {
  const ratio = input.ratio ?? "natural";
  const ratioSuffix =
    ratio === "natural"
      ? ""
      : ratio === "yt-shorts"
        ? "_yt_shorts_9x16"
        : ratio === "instagram"
          ? "_instagram_9x16"
          : "_tiktok_9x16";
  const fileName = sanitizeDownloadName(`${input.fileName}${ratioSuffix}`);
  const exportUrl = buildExportClipUrl(input.url, ratio);
  const attachmentUrl = buildClipAttachmentUrl(exportUrl, fileName);

  try {
    const res = await fetch(attachmentUrl, { mode: "cors" });
    if (!res.ok) throw new Error(`Download failed (${res.status})`);
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = fileName;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(objectUrl);
    return;
  } catch {
    // Cross-origin / CORS fallback — Cloudinary fl_attachment still triggers save.
    const a = document.createElement("a");
    a.href = attachmentUrl;
    a.download = fileName;
    a.target = "_blank";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
}

type SignResponse = {
  upload: VideoUpload;
  r2: {
    uploadUrl: string;
    publicUrl: string;
    key: string;
    storageId: string;
    contentType: string;
    folder: string;
    publicId: string;
  };
};

async function authHeader() {
  const user = getFirebaseAuth().currentUser;
  if (!user) throw new Error("Please sign in to upload videos.");
  const idToken = await user.getIdToken();
  return { Authorization: `Bearer ${idToken}` };
}

export async function listUploads() {
  const headers = await authHeader();
  return apiFetch<{ uploads: VideoUpload[] }>("/uploads", { headers });
}

/** Import YouTube / direct video URL into R2 as a normal upload. */
export async function importVideoFromUrl(url: string) {
  const headers = await authHeader();
  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000";
  const controller = new AbortController();
  // YouTube download + R2 upload can take a while
  const timer = setTimeout(() => controller.abort(), 15 * 60_000);
  try {
    const res = await fetch(`${API_BASE}/uploads/from-url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify({ url }),
      signal: controller.signal,
    });
    const data = (await res.json().catch(() => ({}))) as {
      upload?: VideoUpload;
      error?: string;
      message?: string;
    };
    if (!res.ok || !data.upload) {
      throw new Error(
        data.error ?? data.message ?? `Import failed (${res.status})`,
      );
    }
    return { upload: data.upload };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(
        "Import timed out. Try a shorter video, or upload the file instead.",
      );
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

export async function deleteUpload(id: string) {
  const headers = await authHeader();
  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000";
  const res = await fetch(`${API_BASE}/uploads/${id}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok && res.status !== 204) {
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error ?? `Delete failed (${res.status})`);
  }
}

async function postClips(
  path: string,
  body: string,
  timeoutMs: number,
  failLabel: string,
) {
  const headers = await authHeader();
  const API_BASE =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000";
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body,
      signal: controller.signal,
    });
    const data = (await res.json().catch(() => ({}))) as {
      clips?: ViralClip[];
      clip?: ViralClip;
      error?: string;
      message?: string;
    };
    const clips = data.clips?.length
      ? data.clips
      : data.clip
        ? [data.clip]
        : [];
    if (!res.ok || !clips.length) {
      throw new Error(
        data.error ?? data.message ?? `${failLabel} (${res.status})`,
      );
    }
    return { clips, clip: clips[0]! };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(
        "Clipping took too long. Restart the backend and try again.",
      );
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

/** AI: most-watched + predicted viral clips (30–60s each, count scales with length). */
export async function createViralClips(uploadId: string) {
  return postClips(
    `/uploads/${uploadId}/clip`,
    "{}",
    20 * 60_000,
    "AI clipping failed",
  );
}

/** @deprecated use createViralClips */
export async function createViralClip(uploadId: string) {
  return createViralClips(uploadId);
}

/** Manual: one or more user-defined segments. */
export async function createManualClips(
  uploadId: string,
  segments: ManualSegment[],
) {
  return postClips(
    `/uploads/${uploadId}/clip/manual`,
    JSON.stringify({ segments }),
    15 * 60_000,
    "Manual clipping failed",
  );
}

/** Most-watched ~40–45s window for the manual crop editor. */
export async function fetchPeakWindow(uploadId: string) {
  const headers = await authHeader();
  return apiFetch<{ peakWindow: PeakWindow }>(
    `/uploads/${uploadId}/peak-window`,
    { headers },
  );
}

export const EDITOR_CLIPS_KEY = "clipforge.editorClips";

export function stashClipsForEditor(input: {
  clips: ViralClip[];
  ratio: ExportRatio;
  uploadId?: string;
}) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(EDITOR_CLIPS_KEY, JSON.stringify(input));
}

export async function listClips() {
  const headers = await authHeader();
  return apiFetch<{ clips: ViralClip[] }>("/uploads/clips/recent", { headers });
}

export type TimedCaption = {
  startSec: number;
  endSec: number;
  text: string;
};

/** English timed captions from clip audio (Whisper via backend). */
export async function generateEnglishCaptions(mediaUrl: string) {
  const headers = await authHeader();
  return apiFetch<{ captions: TimedCaption[]; language: string }>(
    "/uploads/transcribe-clip",
    {
      method: "POST",
      headers,
      body: JSON.stringify({ mediaUrl }),
    },
  );
}

/** Upload a local video file to Cloudflare R2 via presigned PUT. */
export async function uploadVideoToCloudinary(
  file: File,
  onProgress?: (pct: number) => void,
): Promise<VideoUpload> {
  const headers = await authHeader();

  const signed = await apiFetch<SignResponse>("/uploads/sign", {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: file.name,
      sizeBytes: file.size,
      contentType: file.type || "video/mp4",
    }),
  });

  if (!signed.r2?.uploadUrl) {
    throw new Error("Storage is not configured. Check R2 env vars on the backend.");
  }

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", signed.r2.uploadUrl);
    xhr.setRequestHeader(
      "Content-Type",
      signed.r2.contentType || file.type || "video/mp4",
    );
    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !onProgress) return;
      onProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
        return;
      }
      reject(
        new Error(
          `R2 upload failed (${xhr.status}). If this is CORS, add localhost to your R2 bucket CORS rules.`,
        ),
      );
    };
    xhr.onerror = () =>
      reject(
        new Error(
          "Network error uploading to R2. Check bucket CORS allows PUT from this origin.",
        ),
      );
    xhr.send(file);
  });

  let durationSec: number | undefined;
  try {
    durationSec = await probeBrowserDuration(file);
  } catch {
    durationSec = undefined;
  }

  try {
    const completed = await apiFetch<{ upload: VideoUpload }>(
      `/uploads/${signed.upload.id}/complete`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          secureUrl: signed.r2.publicUrl,
          cloudinaryPublicId: signed.r2.storageId,
          bytes: file.size,
          durationSec,
        }),
      },
    );
    return completed.upload;
  } catch (error) {
    await apiFetch(`/uploads/${signed.upload.id}/fail`, {
      method: "POST",
      headers,
      body: "{}",
    }).catch(() => undefined);
    throw error;
  }
}

function probeBrowserDuration(file: File): Promise<number | undefined> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";
    const done = (value?: number) => {
      URL.revokeObjectURL(url);
      resolve(value);
    };
    video.onloadedmetadata = () => {
      const d = Number(video.duration);
      done(Number.isFinite(d) && d > 0 ? d : undefined);
    };
    video.onerror = () => done(undefined);
    video.src = url;
  });
}
