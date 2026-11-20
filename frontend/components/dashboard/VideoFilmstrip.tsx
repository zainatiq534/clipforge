"use client";

import { useEffect, useMemo, useRef } from "react";

type VideoFilmstripProps = {
  mediaUrl: string;
  durationSec: number;
  /** How many canvas tiles to paint (capped internally for speed) */
  frameCount: number;
  className?: string;
  tileClassName?: string;
};

const MAX_TILES = 40;

/**
 * Paints timeline frames onto <canvas> tiles.
 * Does NOT use toDataURL — works cross-origin without R2 CORS readback.
 */
export function VideoFilmstrip({
  mediaUrl,
  durationSec,
  frameCount,
  className,
  tileClassName,
}: VideoFilmstripProps) {
  const cleanUrl = mediaUrl.split("#")[0] ?? mediaUrl;
  const tileCount = Math.min(
    MAX_TILES,
    Math.max(8, Math.round(frameCount)),
  );
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  const keys = useMemo(
    () => Array.from({ length: tileCount }, (_, i) => i),
    [tileCount],
  );

  useEffect(() => {
    if (!cleanUrl || durationSec <= 0) return;

    let cancelled = false;
    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    // No crossOrigin — we only display canvases (no pixel readback),
    // so frames still paint even when R2 CORS is incomplete.
    video.src = cleanUrl;

    const run = async () => {
      try {
        await waitForVideo(video);
        if (cancelled) return;
        // Wait one frame so flex tiles have real clientWidth/Height
        await new Promise<void>((r) =>
          requestAnimationFrame(() => requestAnimationFrame(() => r())),
        );
        if (cancelled) return;

        const mediaDuration = Number.isFinite(video.duration)
          ? video.duration
          : durationSec;

        for (let i = 0; i < tileCount; i++) {
          if (cancelled) return;
          const canvas = canvasRefs.current[i];
          if (!canvas) continue;

          const rel = (durationSec * i) / Math.max(1, tileCount - 1);
          const seekTo = clamp(rel, 0, Math.max(0, mediaDuration - 0.05));
          await seekVideo(video, seekTo);

          const w = Math.max(2, canvas.clientWidth || 64);
          const h = Math.max(2, canvas.clientHeight || 40);
          if (canvas.width !== w) canvas.width = w;
          if (canvas.height !== h) canvas.height = h;

          const ctx = canvas.getContext("2d");
          if (!ctx) continue;
          ctx.drawImage(video, 0, 0, w, h);
        }
      } catch {
        // leave empty tiles
      } finally {
        video.removeAttribute("src");
        video.load();
      }
    };

    void run();

    return () => {
      cancelled = true;
      video.removeAttribute("src");
      video.load();
    };
  }, [cleanUrl, durationSec, tileCount]);

  return (
    <div className={className ?? "pointer-events-none absolute inset-0 flex"}>
      {keys.map((i) => (
        <div
          key={i}
          className={
            tileClassName ??
            "relative h-full min-w-0 flex-1 overflow-hidden border-r border-white/10"
          }
        >
          <canvas
            ref={(el) => {
              canvasRefs.current[i] = el;
            }}
            className="h-full w-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function waitForVideo(video: HTMLVideoElement) {
  return new Promise<void>((resolve, reject) => {
    if (video.readyState >= 2) {
      resolve();
      return;
    }
    const onOk = () => {
      cleanup();
      resolve();
    };
    const onErr = () => {
      cleanup();
      reject(new Error("video load failed"));
    };
    const cleanup = () => {
      video.removeEventListener("loadeddata", onOk);
      video.removeEventListener("error", onErr);
      clearTimeout(timer);
    };
    const timer = setTimeout(() => {
      cleanup();
      if (video.readyState >= 1) resolve();
      else reject(new Error("video load timeout"));
    }, 25_000);
    video.addEventListener("loadeddata", onOk, { once: true });
    video.addEventListener("error", onErr, { once: true });
  });
}

function seekVideo(video: HTMLVideoElement, time: number) {
  return new Promise<void>((resolve) => {
    if (Math.abs(video.currentTime - time) < 0.04) {
      resolve();
      return;
    }
    const onSeeked = () => {
      cleanup();
      resolve();
    };
    const cleanup = () => {
      video.removeEventListener("seeked", onSeeked);
      clearTimeout(timer);
    };
    const timer = setTimeout(() => {
      cleanup();
      resolve();
    }, 2500);
    video.addEventListener("seeked", onSeeked, { once: true });
    try {
      video.currentTime = time;
    } catch {
      cleanup();
      resolve();
    }
  });
}
