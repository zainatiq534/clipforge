"use client";

import { useEffect, useMemo, useState } from "react";

export type TimelineFrame = {
  t: number;
  /** Cloudinary JPEG or client-captured data URL */
  url: string | null;
};

const MAX_CAPTURE_SAMPLES = 36;

/**
 * Film-strip frames for editor / trim timelines.
 * Cloudinary → transform URLs. R2 / direct → capture from video via canvas.
 */
export function useVideoFrameStrip(input: {
  durationSec: number;
  frameCount: number;
  sourceOffsetSec?: number;
  cloudName?: string;
  publicId?: string;
  mediaUrl?: string;
  width?: number;
  height?: number;
}): TimelineFrame[] {
  const durationSec = Math.max(0, input.durationSec);
  const frameCount = Math.max(1, input.frameCount);
  const sourceOffsetSec = input.sourceOffsetSec ?? 0;
  const width = input.width ?? 120;
  const height = input.height ?? 68;

  const displayTimes = useMemo(() => {
    if (durationSec <= 0) return [] as number[];
    return Array.from({ length: frameCount }, (_, i) => {
      const rel = (durationSec * i) / Math.max(1, frameCount - 1);
      return rel;
    });
  }, [durationSec, frameCount]);

  const cloudinaryFrames = useMemo(() => {
    const { cloudName, publicId } = input;
    if (!cloudName || cloudName === "r2" || !publicId) return null;
    return displayTimes.map((rel) => {
      const abs = sourceOffsetSec + rel;
      const so = Math.max(0, Math.floor(abs * 10) / 10);
      return {
        t: rel,
        url: `https://res.cloudinary.com/${cloudName}/video/upload/so_${so},w_${width},h_${height},c_fill,q_auto,f_jpg/${publicId}.jpg`,
      };
    });
  }, [
    input.cloudName,
    input.publicId,
    displayTimes,
    sourceOffsetSec,
    width,
    height,
  ]);

  const [sampleUrls, setSampleUrls] = useState<(string | null)[] | null>(null);

  useEffect(() => {
    if (cloudinaryFrames) {
      setSampleUrls(null);
      return;
    }

    const mediaUrl = input.mediaUrl?.split("#")[0]?.trim();
    if (!mediaUrl || durationSec <= 0) {
      setSampleUrls(null);
      return;
    }

    let cancelled = false;
    const sampleCount = Math.min(
      MAX_CAPTURE_SAMPLES,
      Math.max(8, Math.round(frameCount)),
    );

    const run = async () => {
      const video = document.createElement("video");
      video.muted = true;
      video.playsInline = true;
      video.preload = "auto";
      video.crossOrigin = "anonymous";
      video.src = mediaUrl;

      try {
        await waitForVideo(video);
        if (cancelled) return;

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("no canvas");

        const mediaDuration = Number.isFinite(video.duration)
          ? video.duration
          : durationSec;

        const urls: (string | null)[] = [];
        for (let i = 0; i < sampleCount; i++) {
          if (cancelled) return;
          const rel = (durationSec * i) / Math.max(1, sampleCount - 1);
          const seekTo = clamp(rel, 0, Math.max(0, mediaDuration - 0.05));
          await seekVideo(video, seekTo);
          ctx.drawImage(video, 0, 0, width, height);
          try {
            urls.push(canvas.toDataURL("image/jpeg", 0.68));
          } catch {
            urls.push(null);
          }
        }

        if (!cancelled) setSampleUrls(urls);
      } catch {
        if (!cancelled) setSampleUrls(null);
      } finally {
        video.removeAttribute("src");
        video.load();
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [
    cloudinaryFrames,
    input.mediaUrl,
    durationSec,
    frameCount,
    width,
    height,
  ]);

  return useMemo(() => {
    if (cloudinaryFrames) return cloudinaryFrames;

    if (!sampleUrls || sampleUrls.length === 0) {
      return displayTimes.map((t) => ({ t, url: null as string | null }));
    }

    const n = sampleUrls.length;
    return displayTimes.map((t) => {
      const idx =
        durationSec <= 0
          ? 0
          : Math.round((t / durationSec) * Math.max(1, n - 1));
      return {
        t,
        url: sampleUrls[clamp(idx, 0, n - 1)] ?? null,
      };
    });
  }, [cloudinaryFrames, sampleUrls, displayTimes, durationSec]);
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
    }, 20_000);
    video.addEventListener("loadeddata", onOk, { once: true });
    video.addEventListener("error", onErr, { once: true });
  });
}

function seekVideo(video: HTMLVideoElement, time: number) {
  return new Promise<void>((resolve) => {
    if (Math.abs(video.currentTime - time) < 0.05) {
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
    }, 2000);
    video.addEventListener("seeked", onSeeked, { once: true });
    try {
      video.currentTime = time;
    } catch {
      cleanup();
      resolve();
    }
  });
}
