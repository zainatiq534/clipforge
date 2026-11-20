import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { env } from "../config/env.js";

export type CaptionSegment = {
  startSec: number;
  endSec: number;
  text: string;
};

const require = createRequire(import.meta.url);

type WhisperSegment = {
  start?: number;
  end?: number;
  text?: string;
  no_speech_prob?: number;
  avg_logprob?: number;
};

type WhisperWord = {
  word?: string;
  start?: number;
  end?: number;
};

type WhisperVerbose = {
  text?: string;
  words?: WhisperWord[];
  segments?: WhisperSegment[];
};

type TimedWord = {
  text: string;
  startMs: number;
  endMs: number;
};

const HALLUCINATION_TEXT =
  /^(you|thank you\.?|thanks for watching!?|thank you for watching\.?|bye\.?|\.+|♪+|subscribe\.?)$/i;

const MAX_WORDS_PER_LINE = 6;
const MAX_CUE_MS = 1000;
const PAUSE_BREAK_MS = 320;
const MIN_WORDS_BEFORE_SOFT_BREAK = 2;
const WHISPER_TIMEOUT_MS = 5 * 60_000;
const MULTIPART_MAX_BYTES = 25 * 1024 * 1024;

function resolveFfmpegPath(): string | null {
  try {
    const mod = require("ffmpeg-static") as string | null;
    return typeof mod === "string" && mod.length > 0 ? mod : null;
  } catch {
    return null;
  }
}

function cleanText(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function isSilenceSegment(seg: WhisperSegment): boolean {
  const ns = seg.no_speech_prob ?? 0;
  const lp = seg.avg_logprob ?? 0;
  const text = cleanText(seg.text ?? "");
  if (ns > 0.8) return true;
  if (ns > 0.5 && lp < -0.7) return true;
  return ns > 0.3 && HALLUCINATION_TEXT.test(text);
}

function parseWhisperWords(data: WhisperVerbose): TimedWord[] {
  const silent = (data.segments ?? []).filter(isSilenceSegment);
  const inSilence = (startSec: number, endSec: number) => {
    const mid = (startSec + endSec) / 2;
    return silent.some(
      (s) => mid >= (s.start ?? 0) && mid <= (s.end ?? s.start ?? 0),
    );
  };

  if (data.words?.length) {
    return data.words
      .filter((w) => {
        const start = w.start ?? 0;
        const end = w.end ?? start;
        return !inSilence(start, end);
      })
      .map((w) => ({
        text: cleanText(w.word ?? ""),
        startMs: Math.round((w.start ?? 0) * 1000),
        endMs: Math.round((w.end ?? w.start ?? 0) * 1000),
      }))
      .filter((w) => w.text);
  }

  if (data.segments?.length) {
    const out: TimedWord[] = [];
    for (const seg of data.segments) {
      if (isSilenceSegment(seg)) continue;
      const parts = cleanText(seg.text ?? "").split(/\s+/).filter(Boolean);
      if (!parts.length) continue;
      const start = seg.start ?? 0;
      const end = seg.end ?? start + 1;
      const dur = (end - start) * 1000;
      const step = dur / parts.length;
      parts.forEach((text, i) => {
        out.push({
          text,
          startMs: Math.round(start * 1000 + i * step),
          endMs: Math.round(start * 1000 + (i + 1) * step),
        });
      });
    }
    return out;
  }

  const whole = cleanText(data.text ?? "");
  if (!whole) return [];
  return whole.split(/\s+/).map((text, i) => ({
    text,
    startMs: i * 400,
    endMs: (i + 1) * 400,
  }));
}

/** Lykhaari-style cue grouping: short spoken lines, not long dumps. */
export function wordsToCaptionSegments(words: TimedWord[]): CaptionSegment[] {
  if (!words.length) return [];
  const lines: CaptionSegment[] = [];
  let bucket: TimedWord[] = [];

  const flush = () => {
    if (!bucket.length) return;
    const text = cleanText(bucket.map((w) => w.text).join(" "));
    if (!text) {
      bucket = [];
      return;
    }
    const startSec = round2(bucket[0]!.startMs / 1000);
    const endSec = round2(
      Math.max(bucket[0]!.startMs + 450, bucket[bucket.length - 1]!.endMs) /
        1000,
    );
    lines.push({ startSec, endSec, text });
    bucket = [];
  };

  for (const w of words) {
    const prev = bucket[bucket.length - 1];
    const gap = prev ? w.startMs - prev.endMs : 0;
    const cueSoFar = bucket.length ? w.endMs - bucket[0]!.startMs : 0;
    const standsAlone = bucket.length >= MIN_WORDS_BEFORE_SOFT_BREAK;
    const shouldBreak =
      (standsAlone && cueSoFar > MAX_CUE_MS) ||
      (standsAlone && gap > PAUSE_BREAK_MS) ||
      /[.?!،۔]$/.test(prev?.text ?? "") ||
      bucket.length >= MAX_WORDS_PER_LINE;
    if (shouldBreak) flush();
    bucket.push(w);
  }
  flush();
  return lines;
}

async function extractClipAudioMp3(mediaUrl: string): Promise<File> {
  const ffmpegPath = resolveFfmpegPath();
  if (!ffmpegPath) throw new Error("ffmpeg-static is not installed");

  const dir = await mkdtemp(join(tmpdir(), "clipforge-or-"));
  const outPath = join(dir, "audio.mp3");
  try {
    await new Promise<void>((resolve, reject) => {
      const args = [
        "-hide_banner",
        "-loglevel",
        "error",
        "-y",
        "-i",
        mediaUrl,
        "-vn",
        "-map",
        "0:a:0",
        "-ac",
        "1",
        "-ar",
        "16000",
        "-b:a",
        "64k",
        "-f",
        "mp3",
        outPath,
      ];
      const child = spawn(ffmpegPath, args, {
        windowsHide: true,
        stdio: ["ignore", "ignore", "pipe"],
      });
      let stderr = "";
      const timer = setTimeout(() => {
        child.kill("SIGKILL");
        reject(new Error("ffmpeg audio extract timed out"));
      }, 90_000);
      child.stderr.on("data", (chunk: Buffer) => {
        stderr += chunk.toString("utf8");
      });
      child.on("error", (error) => {
        clearTimeout(timer);
        reject(error);
      });
      child.on("close", (code) => {
        clearTimeout(timer);
        if (code !== 0) {
          reject(
            new Error(stderr.trim().slice(0, 240) || `ffmpeg exited ${code}`),
          );
          return;
        }
        resolve();
      });
    });

    const buf = await readFile(outPath);
    if (buf.byteLength < 256) {
      throw new Error("Extracted audio is empty — clip may have no sound track");
    }
    if (buf.byteLength > MULTIPART_MAX_BYTES) {
      throw new Error("Extracted audio too large for OpenRouter Whisper");
    }
    return new File([new Uint8Array(buf)], "audio.mp3", {
      type: "audio/mpeg",
    });
  } finally {
    await rm(dir, { recursive: true, force: true }).catch(() => undefined);
  }
}

function friendlyOpenRouterError(raw: string, status: number): string {
  try {
    const parsed = JSON.parse(raw) as {
      error?: {
        message?: string;
        code?: number | string;
        metadata?: { reason?: string; remedy?: string; limit_source?: string };
      };
      message?: string;
    };
    const msg =
      parsed.error?.message ||
      parsed.message ||
      (typeof parsed.error === "string" ? parsed.error : null);
    const reason = parsed.error?.metadata?.reason ?? "";
    const source = parsed.error?.metadata?.limit_source ?? "";
    if (
      status === 402 ||
      /credits|budget|payment|billing/i.test(`${msg ?? ""} ${reason} ${source}`)
    ) {
      return "OpenRouter is out of credits for captions. Add credits at openrouter.ai/settings/credits, or ClipForge will try Groq next if configured.";
    }
    if (status === 401 || /unauthorized|invalid.*key/i.test(msg ?? "")) {
      return "OpenRouter API key was rejected. Check OPEN_ROUTER_API_KEY in backend/.env.";
    }
    if (msg && !msg.trim().startsWith("{")) return msg.slice(0, 280);
  } catch {
    /* not JSON */
  }
  const trimmed = raw.trim();
  if (trimmed.startsWith("{")) {
    return `OpenRouter caption request failed (HTTP ${status}). Check credits or API key.`;
  }
  return trimmed.slice(0, 280) || `OpenRouter Whisper HTTP ${status}`;
}

async function postOpenRouterTranscription(file: File): Promise<WhisperVerbose> {
  const apiKey = env.openRouter.apiKey;
  if (!apiKey) {
    throw Object.assign(new Error("Missing OPEN_ROUTER_API_KEY in backend/.env"), {
      status: 503,
    });
  }

  const form = new FormData();
  const bytes = new Uint8Array(await file.arrayBuffer());
  form.append(
    "file",
    new Blob([bytes], { type: file.type || "audio/mpeg" }),
    file.name || "audio.mp3",
  );
  form.append("model", env.openRouter.model);
  form.append("response_format", "verbose_json");
  form.append("timestamp_granularities[]", "word");
  form.append("timestamp_granularities[]", "segment");
  form.append("language", "en");
  form.append(
    "prompt",
    "Transcribe the spoken English word for word. Keep every word exactly as said.",
  );

  const res = await fetch("https://openrouter.ai/api/v1/audio/transcriptions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": env.openRouter.referer,
      "X-OpenRouter-Title": env.openRouter.appTitle,
      Accept: "application/json",
    },
    body: form,
    signal: AbortSignal.timeout(WHISPER_TIMEOUT_MS),
  });

  const raw = await res.text();
  if (!res.ok) {
    throw Object.assign(new Error(friendlyOpenRouterError(raw, res.status)), {
      status: res.status,
      provider: "openrouter",
      raw,
    });
  }

  try {
    return JSON.parse(raw) as WhisperVerbose;
  } catch {
    return { text: raw.trim() };
  }
}

/**
 * Cloud Whisper via OpenRouter (`openai/whisper-1`) — same path as Lykhaari.
 */
export async function transcribeVerboseViaOpenRouter(
  mediaUrl: string,
): Promise<CaptionSegment[]> {
  console.info("[openRouter/whisper] extracting mono 16k mp3…");
  const audio = await extractClipAudioMp3(mediaUrl);
  console.info(
    "[openRouter/whisper] uploading",
    Math.round(audio.size / 1024),
    "KB to",
    env.openRouter.model,
  );

  const data = await postOpenRouterTranscription(audio);
  const words = parseWhisperWords(data);
  const segments = wordsToCaptionSegments(words);

  console.info(
    "[openRouter/whisper] ok",
    words.length,
    "words →",
    segments.length,
    "cues",
  );
  for (const s of segments.slice(0, 8)) {
    console.info(
      `[openRouter/whisper] ${s.startSec.toFixed(2)}-${s.endSec.toFixed(2)}: ${s.text}`,
    );
  }

  if (!segments.length) {
    throw new Error(
      "OpenRouter Whisper heard no speech in this clip. Try a clip with clearer talking audio.",
    );
  }
  return segments;
}
