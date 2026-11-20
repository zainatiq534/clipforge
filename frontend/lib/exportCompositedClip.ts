import {
  applyTextCase as applyCaptionCase,
  fontWeightFromFace as captionWeight,
  getCaptionPack,
  pickEmphasizeWordIndex,
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

function parseLetterSpacingPx(raw: string | undefined, fontSize: number) {
  if (!raw) return 0;
  const trimmed = raw.trim();
  if (trimmed.endsWith("em")) {
    const n = Number.parseFloat(trimmed);
    return Number.isFinite(n) ? n * fontSize : 0;
  }
  if (trimmed.endsWith("px")) {
    const n = Number.parseFloat(trimmed);
    return Number.isFinite(n) ? n : 0;
  }
  const n = Number.parseFloat(trimmed);
  return Number.isFinite(n) ? n : 0;
}

function measureSpaced(
  ctx: CanvasRenderingContext2D,
  text: string,
  letterSpacing: number,
) {
  if (!letterSpacing) return ctx.measureText(text).width;
  let w = 0;
  for (let i = 0; i < text.length; i++) {
    w += ctx.measureText(text[i]!).width;
    if (i < text.length - 1) w += letterSpacing;
  }
  return w;
}

function fillSpacedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  letterSpacing: number,
  mode: "fill" | "stroke",
) {
  if (!letterSpacing) {
    if (mode === "stroke") ctx.strokeText(text, x, y);
    else ctx.fillText(text, x, y);
    return;
  }
  const align = ctx.textAlign;
  const total = measureSpaced(ctx, text, letterSpacing);
  let cursor =
    align === "left"
      ? x
      : align === "right"
        ? x - total
        : x - total / 2;
  const prevAlign = ctx.textAlign;
  ctx.textAlign = "left";
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]!;
    if (mode === "stroke") ctx.strokeText(ch, cursor, y);
    else ctx.fillText(ch, cursor, y);
    cursor += ctx.measureText(ch).width + letterSpacing;
  }
  ctx.textAlign = prevAlign;
}

function applyTextShadow(
  ctx: CanvasRenderingContext2D,
  shadow: string | undefined,
  scaleFactor: number,
) {
  const parsed = parseShadow(shadow);
  if (!parsed) {
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    return;
  }
  ctx.shadowOffsetX = parsed.x * scaleFactor;
  ctx.shadowOffsetY = parsed.y * scaleFactor;
  ctx.shadowBlur = parsed.blur * scaleFactor;
  ctx.shadowColor = parsed.color;
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
    drawTextStyleLayer(ctx, layer, cx, cy, maxW, scaleFactor);
    return;
  }
  drawCaptionStyleLayer(ctx, layer, cx, cy, maxW, align, scaleFactor);
}

function drawTextStyleLayer(
  ctx: CanvasRenderingContext2D,
  layer: ExportTextLayer,
  cx: number,
  cy: number,
  maxW: number,
  scaleFactor: number,
) {
  const pack =
    getTextStylePack(layer.styleId ?? "plain") ?? getTextStylePack("creator");
  if (!pack) return;
  const style = resolveTextStyle(pack);
  const display = applyOverlayCase(layer.text, style.textCase);
  // Matches VideoOverlayBox basePx = fontSize * 0.55
  const basePx = Math.max(10, (style.fontSize ?? 36) * 0.55);
  const fontSize = Math.max(12, basePx * layer.scale * scaleFactor);
  const weight = textWeight(style.fontFace, style.bold);
  const letterSpacing =
    parseLetterSpacingPx(pack.design.letterSpacing, fontSize) * scaleFactor;

  ctx.save();
  ctx.font = `${style.italic ? "italic " : ""}${weight} ${fontSize}px "${style.fontFamily}", system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const lines = wrapLines(ctx, display, Math.max(40, maxW * 0.92));
  const lineH = fontSize * 1.22;
  const blockH = lines.length * lineH;
  const padX = (pack.design.paddingX ?? 12) * layer.scale * scaleFactor;
  const padY = (pack.design.paddingY ?? 6) * layer.scale * scaleFactor;
  const widest = Math.max(
    ...lines.map((l) => measureSpaced(ctx, l, letterSpacing)),
    0,
  );
  const bgW = Math.min(maxW, widest) + padX * 2;
  const bgH = blockH + padY * 2;
  const shape = pack.design.shape ?? "none";

  if (shape !== "none" && shape !== "underline") {
    ctx.fillStyle = pack.design.shapeBg ?? "rgba(0,0,0,0.7)";
    const r =
      shape === "pill"
        ? bgH / 2
        : shape === "rounded" || shape === "glass"
          ? 14 * scaleFactor
          : shape === "badge"
            ? 8 * scaleFactor
            : 4 * scaleFactor;
    roundRect(ctx, cx - bgW / 2, cy - bgH / 2, bgW, bgH, r);
    ctx.fill();
    if (pack.design.shapeBorder || shape === "glass") {
      ctx.strokeStyle =
        pack.design.shapeBorder?.replace(/^.*solid\s+/i, "").trim() ||
        "rgba(255,255,255,0.35)";
      ctx.lineWidth = Math.max(1, 1.25 * scaleFactor);
      roundRect(ctx, cx - bgW / 2, cy - bgH / 2, bgW, bgH, r);
      ctx.stroke();
    }
  }

  applyTextShadow(ctx, pack.design.shadow, scaleFactor);

  const top = cy - blockH / 2;
  lines.forEach((line, i) => {
    const y = top + lineH * i + lineH / 2;

    if (style.gradient) {
      const [a, b] = style.gradient;
      const grad = ctx.createLinearGradient(
        cx - widest / 2,
        y,
        cx + widest / 2,
        y,
      );
      grad.addColorStop(0, a);
      grad.addColorStop(1, b);
      ctx.fillStyle = grad;
    } else if (style.fill === "transparent") {
      ctx.fillStyle = "rgba(0,0,0,0)";
    } else {
      ctx.fillStyle = style.fill;
    }

    if (style.stroke) {
      ctx.lineWidth = Math.max(
        2,
        fontSize * (style.fill === "transparent" ? 0.12 : 0.08),
      );
      ctx.strokeStyle = style.stroke;
      ctx.lineJoin = "round";
      ctx.miterLimit = 2;
      fillSpacedText(ctx, line, cx, y, letterSpacing, "stroke");
    }

    if (style.fill !== "transparent" || style.gradient) {
      fillSpacedText(ctx, line, cx, y, letterSpacing, "fill");
    }

    if (style.underline || shape === "underline") {
      const w = measureSpaced(ctx, line, letterSpacing);
      ctx.shadowColor = "transparent";
      ctx.strokeStyle = style.fill === "transparent" ? style.stroke ?? "#fff" : style.fill;
      ctx.lineWidth = Math.max(2, 3 * scaleFactor);
      ctx.beginPath();
      ctx.moveTo(cx - w / 2, y + fontSize * 0.55);
      ctx.lineTo(cx + w / 2, y + fontSize * 0.55);
      ctx.stroke();
      applyTextShadow(ctx, pack.design.shadow, scaleFactor);
    }
  });
  ctx.restore();
}

function drawCaptionStyleLayer(
  ctx: CanvasRenderingContext2D,
  layer: ExportTextLayer,
  cx: number,
  cy: number,
  maxW: number,
  align: "left" | "center",
  scaleFactor: number,
) {
  const pack =
    getCaptionPack(layer.captionPackId ?? "ali-abdaal") ??
    getCaptionPack("ali-abdaal");
  if (!pack) return;
  const style = styleFromPack(pack);
  const design = pack.design;
  const rawWords = layer.text.trim().split(/\s+/).filter(Boolean);
  const words = rawWords.map((w) => applyCaptionCase(w, style.textCase));
  if (!words.length) return;

  // Matches VideoOverlayBox basePx = fontSize * 0.7
  const basePx = Math.max(10, (style.fontSize ?? 36) * 0.7);
  const fontSize = Math.max(12, basePx * layer.scale * scaleFactor);
  const weight = captionWeight(style.fontFace, style.bold);
  const emphasizeIdx = pickEmphasizeWordIndex(words.length);
  const highlight = style.highlight || "#8B5CF6";
  const effect = pack.motion?.emphasizeEffect ?? "glow";
  const rawScale = design?.emphasizeScale ?? 1.08;
  const emphasizeScale = Math.min(rawScale, 1.12);

  ctx.save();
  const fontCss = `${style.italic ? "italic " : ""}${weight} ${fontSize}px "${style.fontFamily}", system-ui, sans-serif`;
  ctx.font = fontCss;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";

  const gap = fontSize * 0.28;
  const wordWidths = words.map((w, i) => {
    const isEmp = i === emphasizeIdx;
    const scale = isEmp ? emphasizeScale : 1;
    ctx.font = `${style.italic ? "italic " : ""}${isEmp ? 800 : weight} ${fontSize * scale}px "${style.fontFamily}", system-ui, sans-serif`;
    const padX =
      isEmp && design?.highlightBackdrop
        ? fontSize * 0.35 * scale
        : 0;
    return ctx.measureText(w).width + padX * 2;
  });

  // Wrap words into lines like the editor (break-words within widthPct)
  type WordRun = { text: string; index: number; width: number };
  const lines: WordRun[][] = [];
  let current: WordRun[] = [];
  let lineW = 0;
  words.forEach((text, index) => {
    const width = wordWidths[index]!;
    const next = lineW + (current.length ? gap : 0) + width;
    if (current.length && next > maxW * 0.98) {
      lines.push(current);
      current = [{ text, index, width }];
      lineW = width;
    } else {
      current.push({ text, index, width });
      lineW = next;
    }
  });
  if (current.length) lines.push(current);

  const lineHeights = lines.map((line) => {
    let max = fontSize;
    for (const w of line) {
      if (w.index === emphasizeIdx) max = Math.max(max, fontSize * emphasizeScale);
    }
    return max * 1.2;
  });
  const blockH = lineHeights.reduce((a, b) => a + b, 0);
  const lineWidths = lines.map(
    (line) =>
      line.reduce((sum, w) => sum + w.width, 0) +
      Math.max(0, line.length - 1) * gap,
  );
  const blockW = Math.min(maxW, Math.max(...lineWidths, 0));

  if (design?.backdrop) {
    const bgW = blockW + fontSize * 0.9;
    const bgH = blockH + fontSize * 0.55;
    ctx.fillStyle = design.backdropColor ?? "rgba(0,0,0,0.55)";
    roundRect(ctx, cx - bgW / 2, cy - bgH / 2, bgW, bgH, 12 * scaleFactor);
    ctx.fill();
  }

  let yCursor = cy - blockH / 2;
  lines.forEach((line, lineIdx) => {
    const lineH = lineHeights[lineIdx]!;
    const y = yCursor + lineH / 2;
    const lw = lineWidths[lineIdx]!;
    let x =
      align === "left" ? cx - maxW / 2 : cx - lw / 2;

    for (const run of line) {
      const isEmp = run.index === emphasizeIdx;
      const scale = isEmp ? emphasizeScale : 1;
      const drawSize = fontSize * scale;
      const drawWeight = isEmp ? 800 : weight;
      ctx.font = `${style.italic ? "italic " : ""}${drawWeight} ${drawSize}px "${style.fontFamily}", system-ui, sans-serif`;

      const padX = isEmp && design?.highlightBackdrop ? drawSize * 0.35 : 0;
      const padY = isEmp && design?.highlightBackdrop ? drawSize * 0.12 : 0;
      const wordW = ctx.measureText(run.text).width;
      const boxW = wordW + padX * 2;
      const boxH = drawSize + padY * 2;
      const wordCx = x + boxW / 2;

      if (isEmp && design?.highlightBackdrop) {
        ctx.shadowColor = "transparent";
        ctx.fillStyle = design.highlightBackdropColor ?? "#7C3AED";
        roundRect(
          ctx,
          wordCx - boxW / 2,
          y - boxH / 2,
          boxW,
          boxH,
          boxH / 2,
        );
        ctx.fill();
      }

      // Shadows / glow for this word
      if (isEmp) {
        if (effect === "glow" || design?.emphasizeShadow) {
          applyTextShadow(
            ctx,
            design?.emphasizeShadow ?? `0 0 12px ${highlight}`,
            scaleFactor,
          );
        } else if (effect === "color-pop") {
          applyTextShadow(ctx, "0 1px 2px rgba(0,0,0,0.4)", scaleFactor);
        } else {
          applyTextShadow(ctx, design?.normalShadow, scaleFactor);
        }
      } else {
        applyTextShadow(
          ctx,
          design?.normalShadow ??
            (style.stroke ? undefined : "0 1px 2px rgba(0,0,0,0.45)"),
          scaleFactor,
        );
      }

      const textX = wordCx;
      ctx.textAlign = "center";

      if (isEmp && design?.emphasizeGradient) {
        const [a, b] = design.emphasizeGradient;
        const grad = ctx.createLinearGradient(
          textX,
          y - drawSize / 2,
          textX,
          y + drawSize / 2,
        );
        grad.addColorStop(0, a);
        grad.addColorStop(1, b);
        ctx.fillStyle = grad;
        if (style.stroke) {
          ctx.lineWidth = Math.max(2, drawSize * 0.07);
          ctx.strokeStyle = style.stroke;
          ctx.lineJoin = "round";
          ctx.strokeText(run.text, textX, y);
        }
        ctx.fillText(run.text, textX, y);
      } else {
        ctx.fillStyle = isEmp
          ? design?.highlightBackdrop
            ? style.fill || "#FFFFFF"
            : highlight
          : style.fill;
        if (style.stroke) {
          ctx.lineWidth = Math.max(2, drawSize * (isEmp ? 0.075 : 0.065));
          ctx.strokeStyle = style.stroke;
          ctx.lineJoin = "round";
          ctx.strokeText(run.text, textX, y);
        }
        ctx.fillText(run.text, textX, y);
      }

      if (style.underline) {
        ctx.shadowColor = "transparent";
        ctx.strokeStyle = isEmp ? highlight : style.fill;
        ctx.lineWidth = Math.max(1.5, 2 * scaleFactor);
        ctx.beginPath();
        ctx.moveTo(textX - wordW / 2, y + drawSize * 0.52);
        ctx.lineTo(textX + wordW / 2, y + drawSize * 0.52);
        ctx.stroke();
      }

      x += boxW + gap;
    }
    yCursor += lineH;
  });

  ctx.restore();
}

function pickRecorderMime() {
  // Prefer VP8 / mp4 over VP9 — VP9 variable-frame WebM often feels "sticky"
  // in Windows Media Player, Movies & TV, and some mobile players.
  const candidates = [
    "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
    "video/mp4",
    "video/webm;codecs=vp8,opus",
    "video/webm;codecs=vp9,opus",
    "video/webm",
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

function sleep(ms: number) {
  return new Promise<void>((r) => window.setTimeout(r, ms));
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

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000";

/**
 * Load clip as a same-origin blob URL so canvas compositing isn't blocked by R2 CORS.
 */
async function resolveExportSourceUrl(videoUrl: string): Promise<{
  src: string;
  revoke?: () => void;
}> {
  const tryBlob = async (url: string) => {
    const res = await fetch(url, { mode: "cors" });
    if (!res.ok) throw new Error(`fetch ${res.status}`);
    const blob = await res.blob();
    if (blob.size < 1000) throw new Error("empty media");
    const objectUrl = URL.createObjectURL(blob);
    return {
      src: objectUrl,
      revoke: () => URL.revokeObjectURL(objectUrl),
    };
  };

  // 1) Direct R2/Cloudinary fetch (works when CORS is configured)
  try {
    return await tryBlob(videoUrl);
  } catch {
    /* fall through */
  }

  // 2) Backend proxy (same API CORS as the rest of ClipForge)
  const proxy = `${API_BASE}/uploads/media-proxy?url=${encodeURIComponent(videoUrl)}`;
  try {
    return await tryBlob(proxy);
  } catch {
    /* fall through */
  }

  // 3) Last resort — may still fail canvas burn if CDN lacks CORS
  return { src: videoUrl };
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
  if (document.fonts?.load) {
    await Promise.all(
      [...fontFamilies].flatMap((family) => [
        document.fonts.load(`400 48px "${family}"`).catch(() => undefined),
        document.fonts.load(`700 48px "${family}"`).catch(() => undefined),
        document.fonts.load(`800 64px "${family}"`).catch(() => undefined),
        document.fonts.load(`900 64px "${family}"`).catch(() => undefined),
      ]),
    );
  }
  if (document.fonts?.ready) {
    await document.fonts.ready.catch(() => undefined);
  }
  // Give webfont CSS a beat to settle before painting frames
  await new Promise((r) => window.setTimeout(r, 280));

  const source = await resolveExportSourceUrl(input.videoUrl);
  const video = document.createElement("video");
  // Blob URLs are same-origin — no crossOrigin needed (avoids R2 CORS taint).
  if (!source.src.startsWith("blob:")) {
    video.crossOrigin = "anonymous";
  }
  video.playsInline = true;
  video.muted = true; // required for autoplay during export
  video.preload = "auto";
  video.src = source.src;

  try {
    await new Promise<void>((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = () =>
        reject(new Error("Could not load clip for export."));
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

    // Smoke-test that the frame is readable (catches tainted canvas early)
    ctx.drawImage(video, 0, 0, 2, 2);
    try {
      ctx.getImageData(0, 0, 1, 1);
    } catch {
      throw new Error(
        "Browser blocked reading this video for export (CORS). Use the media proxy / fix R2 CORS.",
      );
    }
    ctx.clearRect(0, 0, width, height);

    const FPS = 30;
    const mimeType = pickRecorderMime();
    // Realtime capture at fixed FPS — seek-per-frame was slower than 1x → slow-mo exports
    const canvasStream = canvas.captureStream(FPS);

    // Route this same element through Web Audio: record audio, mute speakers
    let audioCtx: AudioContext | null = null;
    let audioRouted = false;
    try {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (AC) {
        audioCtx = new AC();
        const sourceNode = audioCtx.createMediaElementSource(video);
        const silentGain = audioCtx.createGain();
        silentGain.gain.value = 0;
        const dest = audioCtx.createMediaStreamDestination();
        sourceNode.connect(dest);
        sourceNode.connect(silentGain);
        silentGain.connect(audioCtx.destination);
        const audio = dest.stream.getAudioTracks()[0];
        if (audio) {
          canvasStream.addTrack(audio);
          audioRouted = true;
        }
        if (audioCtx.state === "suspended") {
          await audioCtx.resume().catch(() => undefined);
        }
      }
    } catch {
      audioRouted = false;
    }

    // Keep element unmuted so Web Audio receives samples; speakers stay at gain 0
    video.muted = !audioRouted;
    video.volume = 1;

    const chunks: BlobPart[] = [];
    const recorder = new MediaRecorder(
      canvasStream,
      mimeType
        ? { mimeType, videoBitsPerSecond: 12_000_000 }
        : { videoBitsPerSecond: 12_000_000 },
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

    const duration = Math.max(
      0.5,
      Number.isFinite(video.duration) && video.duration > 0
        ? video.duration
        : input.durationSec,
    );

    video.currentTime = 0;
    if (video.seeking) await waitEvent(video, "seeked").catch(() => undefined);

    recorder.start();
    try {
      await video.play();
    } catch {
      video.muted = true;
      await video.play();
    }

    await new Promise<void>((resolve, reject) => {
      let finished = false;
      let raf = 0;
      let rvfcHandle = 0;

      const finish = () => {
        if (finished) return;
        finished = true;
        cancelAnimationFrame(raf);
        resolve();
      };

      type RvfcMeta = { mediaTime: number };
      const hasRvfc =
        typeof (
          video as HTMLVideoElement & {
            requestVideoFrameCallback?: (
              cb: (now: number, meta: RvfcMeta) => void,
            ) => number;
          }
        ).requestVideoFrameCallback === "function";

      const onVideoFrame = (_now: number, meta: RvfcMeta) => {
        if (finished) return;
        const t = meta.mediaTime;
        paintFrame(t);
        input.onProgress?.(Math.min(99, Math.round((t / duration) * 100)));
        if (video.ended || t >= duration - 0.05) {
          finish();
          return;
        }
        rvfcHandle = (
          video as HTMLVideoElement & {
            requestVideoFrameCallback: (
              cb: (now: number, meta: RvfcMeta) => void,
            ) => number;
          }
        ).requestVideoFrameCallback(onVideoFrame);
      };

      const onRaf = () => {
        if (finished) return;
        const t = video.currentTime;
        paintFrame(t);
        input.onProgress?.(Math.min(99, Math.round((t / duration) * 100)));
        if (video.ended || t >= duration - 0.05) {
          finish();
          return;
        }
        raf = requestAnimationFrame(onRaf);
      };

      video.onended = () => finish();
      video.onerror = () =>
        reject(new Error("Playback failed during export."));

      if (hasRvfc) {
        rvfcHandle = (
          video as HTMLVideoElement & {
            requestVideoFrameCallback: (
              cb: (now: number, meta: RvfcMeta) => void,
            ) => number;
          }
        ).requestVideoFrameCallback(onVideoFrame);
      } else {
        raf = requestAnimationFrame(onRaf);
      }

      // Safety timeout (~2x duration)
      window.setTimeout(
        () => finish(),
        Math.ceil(duration * 2000) + 5000,
      );
      void rvfcHandle;
    });

    paintFrame(Math.min(duration, video.currentTime || duration));
    await sleep(100);
    video.pause();
    if (recorder.state !== "inactive") recorder.stop();
    const blob = await stopped;
    input.onProgress?.(100);
    await audioCtx?.close().catch(() => undefined);

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
  } finally {
    video.removeAttribute("src");
    video.load();
    source.revoke?.();
  }
}
