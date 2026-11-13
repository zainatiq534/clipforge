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

export function buildCloudinaryClipUrl(
  cloudName: string,
  publicId: string,
  startSec: number,
  endSec: number,
) {
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
  cloudinary: {
    cloudName: string;
    apiKey: string;
    timestamp: number;
    folder: string;
    publicId: string;
    signature: string;
    uploadUrl: string;
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
    150_000,
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
    60_000,
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

  const form = new FormData();
  form.append("file", file);
  form.append("api_key", signed.cloudinary.apiKey);
  form.append("timestamp", String(signed.cloudinary.timestamp));
  form.append("signature", signed.cloudinary.signature);
  form.append("folder", signed.cloudinary.folder);
  form.append("public_id", signed.cloudinary.publicId);

  const cloudResult = await new Promise<{
    secure_url: string;
    public_id: string;
    bytes?: number;
    duration?: number;
  }>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", signed.cloudinary.uploadUrl);
    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !onProgress) return;
      onProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      try {
        const json = JSON.parse(xhr.responseText) as {
          secure_url?: string;
          public_id?: string;
          bytes?: number;
          duration?: number;
          error?: { message?: string };
        };
        if (xhr.status >= 200 && xhr.status < 300 && json.secure_url && json.public_id) {
          resolve({
            secure_url: json.secure_url,
            public_id: json.public_id,
            bytes: json.bytes,
            duration: json.duration,
          });
          return;
        }
        reject(
          new Error(
            json.error?.message ?? `Cloudinary upload failed (${xhr.status})`,
          ),
        );
      } catch {
        reject(new Error(`Cloudinary upload failed (${xhr.status})`));
      }
    };
    xhr.onerror = () => reject(new Error("Network error while uploading to Cloudinary."));
    xhr.send(form);
  });

  try {
    const completed = await apiFetch<{ upload: VideoUpload }>(
      `/uploads/${signed.upload.id}/complete`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          secureUrl: cloudResult.secure_url,
          cloudinaryPublicId: cloudResult.public_id,
          bytes: cloudResult.bytes,
          durationSec: cloudResult.duration,
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
