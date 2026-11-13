import {
  applyTextCase as applyCaptionCase,
  fontWeightFromFace as captionWeight,
  getCaptionPack,
  styleFromPack,
} from "@/lib/caption";
import { ensureGoogleFont } from "@/lib/google-fonts";
import {
  applyTextCase as applyOverlayCase,
  fontWeightFromFace as textWeight,
  getTextStylePack,
  resolveTextStyle,
} from "@/lib/textStyles";
import type { ExportRatio } from "@/lib/uploads";

export type ExportTextLayer = {
  kind: "text" | "caption";
  startSec: number;
  endSec: number;
  text: string;
  xPct: number;
  yPct: number;
  scale: number;
  widthPct: number;
  styleId?: string;
  captionPackId?: string;
  align?: "left" | "center";
};

type Letterbox = {
  x: number;
  y: number;
  w: number;
  h: number;
};

/** Editor preview column width used for font scaling parity. */
const EDITOR_PREVIEW_W = 420;

function sanitizeDownloadName(name: string) {
  const base = name
    .replace(/\.[^.]+$/, "")
    .replace(/[^\w\-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 80);
  return `${base || "clipforge-clip"}`;
}

function canvasSizeForRatio(
  ratio: ExportRatio,
  videoW: number,
  videoH: number,
) {
  if (ratio === "natural") {
    const maxSide = 1920;
    const long = Math.max(videoW, videoH) || 1280;
    const scale = long > maxSide ? maxSide / long : 1;
    return {
      width: Math.max(2, Math.round((videoW || 1280) * scale)),
      height: Math.max(2, Math.round((videoH || 720) * scale)),
    };
  }
  // Exact TikTok / Shorts / Reels frame
  return { width: 1080, height: 1920 };
}

/** object-contain letterbox of source video into the export canvas */
function fitContain(
  canvasW: number,
  canvasH: number,
  videoW: number,
  videoH: number,
): Letterbox {
  const scale = Math.min(canvasW / Math.max(1, videoW), canvasH / Math.max(1, videoH));
  const w = videoW * scale;
  const h = videoH * scale;
  return {
    x: (canvasW - w) / 2,
    y: (canvasH - h) / 2,
    w,
    h,
  };
}

function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.length ? lines : [text];
}

function parseShadow(shadow: string | undefined) {
  if (!shadow) return null;
  const m = shadow.match(
    /(-?\d+(?:\.\d+)?)px\s+(-?\d+(?:\.\d+)?)px\s+(\d+(?:\.\d+)?)px\s+(.+)/,
  );
  if (!m) return null;
  return {
    x: Number(m[1]),
    y: Number(m[2]),
    blur: Number(m[3]),
    color: m[4]!.trim(),
  };
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

/**
 * Overlay xPct/yPct/widthPct are relative to the FULL preview frame
 * (same as editor-video-frame), not the inner letterboxed video.
 */
function drawLayer(
  ctx: CanvasRenderingContext2D,
  layer: ExportTextLayer,
  canvasW: number,
  canvasH: number,
) {
  const maxW = (layer.widthPct / 100) * canvasW;
  const cx = (layer.xPct / 100) * canvasW;
  const cy = (layer.yPct / 100) * canvasH;
  const align = layer.align ?? "center";
  const scaleFactor = canvasW / EDITOR_PREVIEW_W;

  if (layer.kind === "text") {
    const pack =
      getTextStylePack(layer.styleId ?? "plain") ??
      getTextStylePack("creator");
    if (!pack) return;
    const style = resolveTextStyle(pack);
    const display = applyOverlayCase(layer.text, style.textCase);
    // Matches VideoOverlayBox basePx = fontSize * 0.55
    const basePx = Math.max(10, (style.fontSize ?? 36) * 0.55);
    const fontSize = Math.max(12, basePx * layer.scale * scaleFactor);
    const weight = textWeight(style.fontFace, style.bold);

    ctx.save();
    ctx.font = `${style.italic ? "italic " : ""}${weight} ${fontSize}px "${style.fontFamily}", system-ui, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const lines = wrapLines(ctx, display, Math.max(40, maxW * 0.92));
    const lineH = fontSize * 1.2;
    const blockH = lines.length * lineH;
    const top = cy - blockH / 2;

    const padX = (pack.design.paddingX ?? 12) * layer.scale * scaleFactor;
    const padY = (pack.design.paddingY ?? 6) * layer.scale * scaleFactor;
    const widest = Math.max(...lines.map((l) => ctx.measureText(l).width), 0);
    const bgW = Math.min(maxW, widest) + padX * 2;
    const bgH = blockH + padY * 2;

    if (pack.design.shape && pack.design.shape !== "none") {
      ctx.fillStyle = pack.design.shapeBg ?? "rgba(0,0,0,0.7)";
      const r =
        pack.design.shape === "pill"
          ? bgH / 2
          : pack.design.shape === "rounded"
            ? 14 * scaleFactor
            : 8 * scaleFactor;
      roundRect(ctx, cx - bgW / 2, cy - bgH / 2, bgW, bgH, r);
      ctx.fill();
    }

    const shadow = parseShadow(pack.design.shadow);
    if (shadow) {
      ctx.shadowOffsetX = shadow.x * scaleFactor;
      ctx.shadowOffsetY = shadow.y * scaleFactor;
      ctx.shadowBlur = shadow.blur * scaleFactor;
      ctx.shadowColor = shadow.color;
    }

    if (style.stroke) {
      ctx.lineWidth = Math.max(2, fontSize * 0.08);
      ctx.strokeStyle = style.stroke;
      ctx.lineJoin = "round";
    }
    ctx.fillStyle = style.fill === "transparent" ? "#fff" : style.fill;

    lines.forEach((line, i) => {
      const y = top + lineH * i + lineH / 2;
      if (style.stroke) ctx.strokeText(line, cx, y);
      ctx.fillText(line, cx, y);
    });
    ctx.restore();
    return;
  }

  const pack =
    getCaptionPack(layer.captionPackId ?? "ali-abdaal") ??
    getCaptionPack("ali-abdaal");
  if (!pack) return;
  const style = styleFromPack(pack);
  const display = applyCaptionCase(layer.text, style.textCase);
  // Matches VideoOverlayBox basePx = fontSize * 0.7
  const basePx = Math.max(10, (style.fontSize ?? 36) * 0.7);
  const fontSize = Math.max(12, basePx * layer.scale * scaleFactor);
  const weight = captionWeight(style.fontFace, style.bold);

  ctx.save();
  ctx.font = `${style.italic ? "italic " : ""}${weight} ${fontSize}px "${style.fontFamily}", system-ui, sans-serif`;
  ctx.textAlign = align === "left" ? "left" : "center";
  ctx.textBaseline = "middle";

  const lines = wrapLines(ctx, display, Math.max(40, maxW * 0.92));
  const lineH = fontSize * 1.2;
  const blockH = lines.length * lineH;
  const top = cy - blockH / 2;
  const textX = align === "left" ? cx - maxW / 2 : cx;

  if (pack.design?.backdrop) {
    const widest = Math.max(...lines.map((l) => ctx.measureText(l).width), 0);
    const bgW = Math.min(maxW, widest) + fontSize * 0.8;
    const bgH = blockH + fontSize * 0.5;
    ctx.fillStyle = pack.design.backdropColor ?? "rgba(0,0,0,0.55)";
    roundRect(ctx, cx - bgW / 2, cy - bgH / 2, bgW, bgH, 12 * scaleFactor);
    ctx.fill();
  }

  if (style.stroke) {
    ctx.lineWidth = Math.max(2, fontSize * 0.07);
    ctx.strokeStyle = style.stroke;
    ctx.lineJoin = "round";
  }
  ctx.fillStyle = style.fill;
  ctx.shadowColor = "rgba(0,0,0,0.45)";
  ctx.shadowBlur = 3 * scaleFactor;
  ctx.shadowOffsetY = 1 * scaleFactor;

  lines.forEach((line, i) => {
    const y = top + lineH * i + lineH / 2;
    if (style.stroke) ctx.strokeText(line, textX, y);
    ctx.fillText(line, textX, y);
  });
  ctx.restore();
}

function pickRecorderMime() {
  const candidates = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
    "video/mp4",
  ];
  for (const type of candidates) {
    if (
      typeof MediaRecorder !== "undefined" &&
      MediaRecorder.isTypeSupported(type)
    ) {
      return type;
    }
  }
  return "";
}

function waitEvent(el: HTMLMediaElement, event: string, timeoutMs = 20000) {
  return new Promise<void>((resolve, reject) => {
    const t = window.setTimeout(
      () => reject(new Error(`Timed out waiting for ${event}`)),
      timeoutMs,
    );
    const onOk = () => {
      window.clearTimeout(t);
      el.removeEventListener(event, onOk);
      resolve();
    };
    el.addEventListener(event, onOk, { once: true });
  });
}

/**
 * Records the clip at the selected ratio with text + captions burned in.
 * Layout matches the editor preview frame (full 9:16 canvas + letterboxed video).
 */
export async function exportCompositedClip(input: {
  videoUrl: string;
  fileName: string;
  ratio: ExportRatio;
  durationSec: number;
  layers: ExportTextLayer[];
  onProgress?: (pct: number) => void;
}) {
  if (typeof document === "undefined") {
    throw new Error("Export only works in the browser.");
  }

  const fontFamilies = new Set<string>();
  for (const layer of input.layers) {
    if (layer.kind === "text") {
      const pack = getTextStylePack(layer.styleId ?? "");
      if (pack?.style.fontFamily) fontFamilies.add(pack.style.fontFamily);
    } else {
      const pack = getCaptionPack(layer.captionPackId ?? "ali-abdaal");
      if (pack?.style.fontFamily) fontFamilies.add(pack.style.fontFamily);
    }
  }
  for (const f of fontFamilies) ensureGoogleFont(f);
  if (document.fonts?.ready) {
    await document.fonts.ready.catch(() => undefined);
  }
  await new Promise((r) => window.setTimeout(r, 120));

  const video = document.createElement("video");
  video.crossOrigin = "anonymous";
  video.playsInline = true;
  video.muted = true; // required for autoplay during export
  video.preload = "auto";
  video.src = input.videoUrl;

  await new Promise<void>((resolve, reject) => {
    video.onloadedmetadata = () => resolve();
    video.onerror = () => reject(new Error("Could not load clip for export."));
  });
  // Some CDNs report size only after data
  if (!video.videoWidth) {
    await waitEvent(video, "loadeddata").catch(() => undefined);
  }

  const vw = video.videoWidth || 1280;
  const vh = video.videoHeight || 720;
  const { width, height } = canvasSizeForRatio(input.ratio, vw, vh);
  const videoBox = fitContain(width, height, vw, vh);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) throw new Error("Canvas not supported in this browser.");

  const mimeType = pickRecorderMime();
  const canvasStream = canvas.captureStream(30);

  // Try to attach audio (unmute source for capture if possible)
  try {
    video.muted = false;
    const vStream: MediaStream | undefined =
      // @ts-expect-error captureStream exists in Chromium
      typeof video.captureStream === "function"
        ? // @ts-expect-error captureStream
          video.captureStream()
        : // @ts-expect-error mozCaptureStream
          typeof video.mozCaptureStream === "function"
          ? // @ts-expect-error mozCaptureStream
            video.mozCaptureStream()
          : undefined;
    const audio = vStream?.getAudioTracks?.()?.[0];
    if (audio) canvasStream.addTrack(audio);
  } catch {
    video.muted = true;
  }

  const chunks: BlobPart[] = [];
  const recorder = new MediaRecorder(
    canvasStream,
    mimeType
      ? { mimeType, videoBitsPerSecond: 10_000_000 }
      : { videoBitsPerSecond: 10_000_000 },
  );
  recorder.ondataavailable = (e) => {
    if (e.data.size) chunks.push(e.data);
  };

  const stopped = new Promise<Blob>((resolve, reject) => {
    recorder.onstop = () => {
      resolve(
        new Blob(chunks, {
          type: recorder.mimeType || mimeType || "video/webm",
        }),
      );
    };
    recorder.onerror = () => reject(new Error("Recording failed."));
  });

  const paintFrame = (t: number) => {
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(video, videoBox.x, videoBox.y, videoBox.w, videoBox.h);
    for (const layer of input.layers) {
      if (t >= layer.startSec - 0.03 && t <= layer.endSec + 0.03) {
        drawLayer(ctx, layer, width, height);
      }
    }
  };

  video.currentTime = 0;
  if (video.seeking) await waitEvent(video, "seeked").catch(() => undefined);

  recorder.start(100);
  try {
    await video.play();
  } catch {
    video.muted = true;
    await video.play();
  }

  const duration = Math.max(
    0.5,
    Number.isFinite(video.duration) && video.duration > 0
      ? video.duration
      : input.durationSec,
  );

  await new Promise<void>((resolve, reject) => {
    let raf = 0;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(raf);
      resolve();
    };

    const tick = () => {
      if (finished) return;
      const t = video.currentTime;
      paintFrame(t);
      input.onProgress?.(Math.min(99, Math.round((t / duration) * 100)));
      if (video.ended || t >= duration - 0.04) {
        finish();
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    video.onended = () => finish();
    video.onerror = () => reject(new Error("Playback failed during export."));
    raf = requestAnimationFrame(tick);
  });

  // Hold last frame briefly so MediaRecorder flushes it
  paintFrame(Math.min(duration, video.currentTime || duration));
  await new Promise((r) => window.setTimeout(r, 120));

  video.pause();
  if (recorder.state !== "inactive") recorder.stop();
  const blob = await stopped;
  input.onProgress?.(100);

  if (blob.size < 1000) {
    throw new Error("Export produced an empty file. Try again.");
  }

  const ext = blob.type.includes("mp4") ? "mp4" : "webm";
  const ratioSuffix =
    input.ratio === "natural"
      ? ""
      : input.ratio === "yt-shorts"
        ? "_yt_shorts_9x16"
        : input.ratio === "instagram"
          ? "_instagram_9x16"
          : "_tiktok_9x16";
  const fileName = `${sanitizeDownloadName(input.fileName)}${ratioSuffix}.${ext}`;

  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = fileName;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 4000);

  video.removeAttribute("src");
  video.load();
}
