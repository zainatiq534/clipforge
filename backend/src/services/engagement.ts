import { spawn } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

export type MostWatchedWindow = {
  startSec: number;
  endSec: number;
  peakSec: number;
  viralScore: number;
  method: "peak-energy" | "fallback-thirds" | "ai-viral";
  rank: number;
};

/** Target AI / peak clip length: 30s–60s. */
export const AI_CLIP_MIN_SEC = 30;
export const AI_CLIP_MAX_SEC = 60;
export const AI_CLIP_TARGET_SEC = 45;

/** How many clips to aim for from a long video (scales with duration). */
export function suggestedViralClipCount(durationSec: number): number {
  const duration = Math.max(30, durationSec);
  // ~1 clip per ~75s of source, keep a useful range
  return clamp(Math.round(duration / 75), 2, 15);
}

/**
 * Finds the top N “most watched / most replayed” windows by scanning audio
 * energy (chorus / loudest stretches ≈ YouTube heat-map peaks).
 * Windows are 30–60 seconds so Shorts/Reels stay watchable.
 */
export async function findTopMostWatchedWindows(input: {
  cloudName: string;
  publicId: string;
  durationSec: number;
  count?: number;
  clipLenSec?: number;
  /** When false, return only real peak-energy hits (no synthetic fillers). */
  fillFallback?: boolean;
}): Promise<MostWatchedWindow[]> {
  const duration = Math.max(AI_CLIP_MIN_SEC + 5, input.durationSec);
  const count = clamp(
    input.count ?? suggestedViralClipCount(duration),
    1,
    15,
  );
  const clipLen = clamp(
    input.clipLenSec ?? AI_CLIP_TARGET_SEC,
    AI_CLIP_MIN_SEC,
    Math.min(AI_CLIP_MAX_SEC, Math.floor(duration)),
  );
  const fillFallback = input.fillFallback !== false;

  const scanned = await scanEnergyWindows({
    cloudName: input.cloudName,
    publicId: input.publicId,
    duration,
    clipLen,
    count,
  });

  if (!fillFallback) {
    return scanned.slice(0, count).map((w, i) => ({ ...w, rank: i + 1 }));
  }

  if (scanned.length >= count) return scanned.slice(0, count);
  if (scanned.length > 0) {
    const extras = fallbackSpread(duration, clipLen, count).filter(
      (fb) =>
        !scanned.some(
          (s) => Math.abs(s.peakSec - fb.peakSec) < clipLen * 0.7,
        ),
    );
    return [...scanned, ...extras].slice(0, count).map((w, i) => ({
      ...w,
      rank: i + 1,
    }));
  }

  return fallbackSpread(duration, clipLen, count);
}

/** Back-compat single peak. */
export async function findMostWatchedWindow(input: {
  cloudName: string;
  publicId: string;
  durationSec: number;
  clipLenSec?: number;
}): Promise<MostWatchedWindow | null> {
  const [first] = await findTopMostWatchedWindows({ ...input, count: 1 });
  return first ?? null;
}

async function scanEnergyWindows(input: {
  cloudName: string;
  publicId: string;
  duration: number;
  clipLen: number;
  count: number;
}): Promise<MostWatchedWindow[]> {
  const { duration, clipLen, count } = input;
  const ffmpegPath = resolveFfmpegPath();
  if (!ffmpegPath) {
    console.warn("[engagement] ffmpeg-static missing — skip peak scan");
    return [];
  }

  const usableStart = Math.min(10, Math.max(0, duration * 0.03));
  const usableEnd = Math.max(usableStart + clipLen, duration - 10);
  const span = Math.max(1, usableEnd - usableStart);
  // Denser probes on longer videos so we don't miss secondary peaks
  const probeCount = clamp(Math.round(span / 8), 16, 48);
  const step = span / probeCount;
  const probeDur = 2.5;

  const times: number[] = [];
  for (let i = 0; i < probeCount; i++) {
    const t = usableStart + i * step;
    if (t + probeDur >= duration - 1) break;
    times.push(t);
  }

  const scores: { t: number; rms: number }[] = [];
  const concurrency = 4;
  for (let i = 0; i < times.length; i += concurrency) {
    const batch = times.slice(i, i + concurrency);
    const results = await Promise.all(
      batch.map(async (t) => {
        try {
          const url = buildAudioSliceUrl(
            input.cloudName,
            input.publicId,
            t,
            probeDur,
          );
          const rms = await measureRmsFromUrl(ffmpegPath, url);
          if (Number.isFinite(rms) && rms > 0) return { t, rms };
        } catch (error) {
          console.warn(
            `[engagement] probe @${t.toFixed(1)}s failed`,
            error instanceof Error ? error.message : error,
          );
        }
        return null;
      }),
    );
    for (const r of results) {
      if (r) scores.push(r);
    }
  }
  scores.sort((a, b) => a.t - b.t);

  if (scores.length < 3) {
    console.warn("[engagement] not enough energy samples");
    return [];
  }

  const smoothed = scores.map((s, idx) => {
    const prev = scores[idx - 1]?.rms ?? s.rms;
    const next = scores[idx + 1]?.rms ?? s.rms;
    return { t: s.t, rms: (prev + s.rms * 2 + next) / 4 };
  });

  const minRms = Math.min(...smoothed.map((s) => s.rms));
  const maxRms = Math.max(...smoothed.map((s) => s.rms));
  const minGap = clipLen * 0.8;

  const ranked = [...smoothed].sort((a, b) => b.rms - a.rms);
  const picked: MostWatchedWindow[] = [];

  // Only keep peaks that are meaningfully "hot" vs the quietest parts
  const hotThreshold = minRms + (maxRms - minRms) * 0.35;

  for (const peak of ranked) {
    if (picked.length >= count) break;
    if (peak.rms < hotThreshold && picked.length >= 2) continue;

    const peakSec = peak.t + probeDur / 2;
    if (picked.some((p) => Math.abs(p.peakSec - peakSec) < minGap)) continue;

    let startSec = peakSec - clipLen * 0.35;
    startSec = clamp(startSec, 0, Math.max(0, duration - clipLen));
    const endSec = Math.min(duration, startSec + clipLen);
    if (endSec - startSec < AI_CLIP_MIN_SEC - 0.5) continue;

    const relative =
      maxRms > minRms ? (peak.rms - minRms) / (maxRms - minRms) : 0.7;
    const viralScore = Math.round(70 + relative * 28 - picked.length * 1.5);

    picked.push({
      startSec: round1(startSec),
      endSec: round1(endSec),
      peakSec: round1(peakSec),
      viralScore: clamp(viralScore, 62, 98),
      method: "peak-energy",
      rank: picked.length + 1,
    });
  }

  return picked;
}

function fallbackSpread(
  duration: number,
  clipLen: number,
  count: number,
): MostWatchedWindow[] {
  const n = clamp(count, 1, 15);
  const centers: number[] = [];
  for (let i = 0; i < n; i++) {
    // Spread across the video, skip cold open / cold outro
    centers.push(0.12 + ((0.78 - 0.12) * (i + 0.5)) / n);
  }
  return centers.map((ratio, i) => {
    const peakSec = duration * ratio;
    let startSec = peakSec - clipLen * 0.35;
    startSec = clamp(startSec, 0, Math.max(0, duration - clipLen));
    const endSec = Math.min(duration, startSec + clipLen);
    return {
      startSec: round1(startSec),
      endSec: round1(endSec),
      peakSec: round1(peakSec),
      viralScore: 82 - i * 2,
      method: "fallback-thirds" as const,
      rank: i + 1,
    };
  });
}

function buildAudioSliceUrl(
  cloudName: string,
  publicId: string,
  start: number,
  duration: number,
) {
  const so = Math.max(0, Math.floor(start * 10) / 10);
  const du = Math.max(1, Math.floor(duration * 10) / 10);
  return `https://res.cloudinary.com/${cloudName}/video/upload/so_${so},du_${du},f_mp3,q_auto:low/${publicId}.mp3`;
}

function resolveFfmpegPath(): string | null {
  try {
    const mod = require("ffmpeg-static") as string | null;
    return typeof mod === "string" && mod.length > 0 ? mod : null;
  } catch {
    return null;
  }
}

function measureRmsFromUrl(ffmpegPath: string, url: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const args = [
      "-hide_banner",
      "-loglevel",
      "error",
      "-t",
      "3",
      "-i",
      url,
      "-ac",
      "1",
      "-ar",
      "8000",
      "-f",
      "s16le",
      "pipe:1",
    ];

    const child = spawn(ffmpegPath, args, {
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    });

    const chunks: Buffer[] = [];
    let stderr = "";
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("ffmpeg probe timeout"));
    }, 18_000);

    child.stdout.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
      if (Buffer.concat(chunks).length > 500_000) {
        child.kill("SIGKILL");
      }
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString("utf8");
    });
    child.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code !== 0 && chunks.length === 0) {
        reject(new Error(stderr.trim() || `ffmpeg exited ${code}`));
        return;
      }
      const pcm = Buffer.concat(chunks);
      if (pcm.length < 2) {
        reject(new Error("empty PCM"));
        return;
      }
      let sumSq = 0;
      const samples = Math.floor(pcm.length / 2);
      for (let i = 0; i < samples; i++) {
        const sample = pcm.readInt16LE(i * 2) / 32768;
        sumSq += sample * sample;
      }
      resolve(Math.sqrt(sumSq / samples));
    });
  });
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}
