import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import wavefile from "wavefile";
import { env } from "../config/env.js";

export type CaptionSegment = {
  startSec: number;
  endSec: number;
  text: string;
};

const require = createRequire(import.meta.url);

type AsrChunk = {
  text?: string;
  timestamp?: [number | null, number | null];
};

type AsrResult = {
  text?: string;
  chunks?: AsrChunk[];
};

type TimedWord = {
  text: string;
  start: number;
  end: number;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AsrPipeline = (audio: Float32Array, options?: Record<string, unknown>) => Promise<AsrResult>;

let transcriberPromise: Promise<AsrPipeline> | null = null;
let loadedKey: string | null = null;

function resolveFfmpegPath(): string | null {
  try {
    const mod = require("ffmpeg-static") as string | null;
    return typeof mod === "string" && mod.length > 0 ? mod : null;
  } catch {
    return null;
  }
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function cleanText(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

async function getTranscriber(): Promise<AsrPipeline> {
  const model = env.localWhisper.model;
  const quantized = env.localWhisper.quantized;
  const key = `${model}::${quantized ? "q" : "full"}`;
  if (transcriberPromise && loadedKey === key) {
    return transcriberPromise;
  }
  transcriberPromise = (async () => {
    const { pipeline } = await import("@xenova/transformers");
    console.info(
      "[localWhisper] loading",
      model,
      quantized ? "(quantized)" : "(full precision, higher accuracy)",
    );
    const transcriber = await pipeline("automatic-speech-recognition", model, {
      quantized,
    });
    loadedKey = key;
    console.info("[localWhisper] model ready");
    return transcriber as unknown as AsrPipeline;
  })().catch((error) => {
    transcriberPromise = null;
    loadedKey = null;
    throw error;
  });
  return transcriberPromise;
}

async function extractClipAudioWavSafe(mediaUrl: string): Promise<Buffer> {
  const ffmpegPath = resolveFfmpegPath();
  if (!ffmpegPath) throw new Error("ffmpeg-static is not installed");
  const dir = await mkdtemp(join(tmpdir(), "clipforge-local-"));
  const outPath = join(dir, "clip-audio.wav");
  try {
    try {
      return await extractWithArgs(ffmpegPath, mediaUrl, outPath, true);
    } catch {
      return await extractWithArgs(ffmpegPath, mediaUrl, outPath, false);
    }
  } finally {
    await rm(dir, { recursive: true, force: true }).catch(() => undefined);
  }
}

function extractWithArgs(
  ffmpegPath: string,
  mediaUrl: string,
  outPath: string,
  loudnorm: boolean,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
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
      "-ar",
      "16000",
      "-ac",
      "1",
      ...(loudnorm ? ["-af", "loudnorm=I=-16:TP=-1.5:LRA=11"] : []),
      "-c:a",
      "pcm_s16le",
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
    child.on("close", async (code) => {
      clearTimeout(timer);
      if (code !== 0) {
        reject(new Error(stderr.trim().slice(0, 240) || `ffmpeg exited ${code}`));
        return;
      }
      try {
        const buf = await readFile(outPath);
        if (buf.byteLength < 256) {
          reject(new Error("Extracted audio is empty"));
          return;
        }
        resolve(buf);
      } catch (error) {
        reject(error);
      }
    });
  });
}

function wavToFloat32(wavBuffer: Buffer): Float32Array {
  const wav = new wavefile.WaveFile(new Uint8Array(wavBuffer));
  wav.toBitDepth("32f");
  wav.toSampleRate(16000);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let samples = (wav as any).getSamples() as Float32Array | Float32Array[];
  if (Array.isArray(samples)) {
    samples = samples[0] ?? new Float32Array();
  }
  if (!(samples instanceof Float32Array)) {
    samples = Float32Array.from(samples as ArrayLike<number>);
  }
  return samples;
}

function clampToDuration(
  segments: CaptionSegment[],
  durationSec: number,
): CaptionSegment[] {
  const dur = Math.max(0.5, durationSec);
  return segments
    .map((s) => {
      const startSec = Math.max(0, Math.min(s.startSec, Math.max(0, dur - 0.35)));
      const endSec = Math.max(startSec + 0.35, Math.min(s.endSec, dur));
      return {
        startSec: round2(startSec),
        endSec: round2(endSec),
        text: cleanText(s.text),
      };
    })
    .filter((s) => s.text.length > 0);
}

function parseTimedWords(result: AsrResult): TimedWord[] {
  const chunks = result.chunks ?? [];
  const words: TimedWord[] = [];
  for (let i = 0; i < chunks.length; i++) {
    const c = chunks[i]!;
    const text = cleanText(c.text ?? "");
    if (!text) continue;
    const start =
      typeof c.timestamp?.[0] === "number"
        ? c.timestamp[0]!
        : words[words.length - 1]?.end ?? 0;
    let end =
      typeof c.timestamp?.[1] === "number" ? c.timestamp[1]! : Number.NaN;
    if (!Number.isFinite(end)) {
      const next = chunks[i + 1];
      end =
        typeof next?.timestamp?.[0] === "number"
          ? next.timestamp[0]!
          : start + 0.28;
    }
    if (end <= start) end = start + 0.2;
    // Chunk may contain multiple tokens; keep exact text as Whisper emitted
    words.push({ text, start, end });
  }
  return words;
}

/**
 * Group timed words into complete sentence captions.
 * Sentence start/end = first/last word timestamps from Whisper (exact A/V sync).
 */
function sentencesFromWords(
  words: TimedWord[],
  durationSec: number,
): CaptionSegment[] {
  if (!words.length) return [];
  const out: CaptionSegment[] = [];
  let buf: TimedWord[] = [];

  const flush = () => {
    if (!buf.length) return;
    const text = cleanText(buf.map((w) => w.text).join(" "));
    if (!text) {
      buf = [];
      return;
    }
    const start = buf[0]!.start;
    const end = Math.max(start + 0.45, buf[buf.length - 1]!.end);
    out.push({
      startSec: round2(start),
      endSec: round2(end),
      text,
    });
    buf = [];
  };

  for (const w of words) {
    buf.push(w);
    if (/[.!?…]["']?$/.test(w.text)) {
      flush();
    }
  }
  flush(); // trailing sentence without period — still exact word times

  return clampToDuration(out, durationSec);
}

/** Segment-timestamp fallback: each Whisper chunk is already a phrase. */
function sentencesFromSegments(
  result: AsrResult,
  durationSec: number,
): CaptionSegment[] {
  const words = parseTimedWords(result);
  if (!words.length) {
    const whole = cleanText(result.text ?? "");
    if (!whole) return [];
    return clampToDuration(
      [
        {
          startSec: 0,
          endSec: Math.max(1, durationSec),
          text: whole,
        },
      ],
      durationSec,
    );
  }

  // Merge tiny adjacent fragments into sentences using punctuation
  const out: CaptionSegment[] = [];
  let buf: TimedWord[] = [];
  const flush = () => {
    if (!buf.length) return;
    const text = cleanText(buf.map((w) => w.text).join(" "));
    if (!text) {
      buf = [];
      return;
    }
    out.push({
      startSec: round2(buf[0]!.start),
      endSec: round2(Math.max(buf[0]!.start + 0.45, buf[buf.length - 1]!.end)),
      text,
    });
    buf = [];
  };

  for (const w of words) {
    buf.push(w);
    if (/[.!?…]["']?$/.test(w.text) || /[.!?…]["']?$/.test(cleanText(buf.map((x) => x.text).join(" ")))) {
      flush();
    }
  }
  flush();
  return clampToDuration(out, durationSec);
}

function looksLikeWordChunks(result: AsrResult): boolean {
  const chunks = result.chunks ?? [];
  if (chunks.length < 4) return false;
  const short = chunks.filter((c) => cleanText(c.text ?? "").split(" ").length <= 2).length;
  return short >= chunks.length * 0.55;
}

/**
 * High-accuracy local English captions:
 * - English Whisper model (exact wording)
 * - No chunk_length splitting when clip ≤ 30s (better WER)
 * - Word timestamps → sentence captions locked to real speech times
 */
export async function transcribeVerboseViaLocal(
  mediaUrl: string,
): Promise<CaptionSegment[]> {
  console.info("[localWhisper] extracting / normalizing wav…");
  const wavBuf = await extractClipAudioWavSafe(mediaUrl);
  const audio = wavToFloat32(wavBuf);
  const durationSec = audio.length / 16000;
  if (audio.length < 1600) {
    throw new Error("Clip audio too short for captioning");
  }

  const transcriber = await getTranscriber();
  const underWindow = durationSec <= 30;

  console.info(
    "[localWhisper] hard English transcribe",
    round2(durationSec),
    "sec",
    underWindow ? "(single-pass, no chunking)" : "(long-form)",
  );

  const isEnglishOnlyModel = /\.en$/i.test(env.localWhisper.model);
  const baseOpts: Record<string, unknown> = {
    // Avoid chunk_length_s on short clips — much better accuracy / sync
    ...(underWindow
      ? {}
      : { chunk_length_s: 30, stride_length_s: 5 }),
  };
  // .en models reject language/task — only set them on multilingual checkpoints
  if (!isEnglishOnlyModel) {
    baseOpts.language = "en";
    baseOpts.task = "transcribe";
  }

  let result: AsrResult;
  console.info("[localWhisper] pass 1: word timestamps…");
  try {
    result = await transcriber(audio, {
      ...baseOpts,
      return_timestamps: "word",
    });
  } catch (error) {
    console.warn(
      "[localWhisper] word timestamps failed, segment pass:",
      error instanceof Error ? error.message : error,
    );
    console.info("[localWhisper] pass 2: segment timestamps…");
    result = await transcriber(audio, {
      ...baseOpts,
      return_timestamps: true,
    });
  }

  if (!cleanText(result.text ?? "") || (result.chunks?.length ?? 0) < 1) {
    console.info("[localWhisper] pass 3: segment retry…");
    result = await transcriber(audio, {
      ...baseOpts,
      return_timestamps: true,
    });
  }

  const fullText = cleanText(result.text ?? "");
  console.info("[localWhisper] transcript:", fullText);
  console.info("[localWhisper] chunks:", result.chunks?.length ?? 0);

  let segments: CaptionSegment[];
  if (looksLikeWordChunks(result)) {
    const timedWords = parseTimedWords(result);
    segments = sentencesFromWords(timedWords, durationSec);
    console.info("[localWhisper] built from word timestamps", timedWords.length, "words");
  } else {
    segments = sentencesFromSegments(result, durationSec);
    console.info("[localWhisper] built from segment timestamps");
  }

  if (!segments.length && fullText) {
    segments = clampToDuration(
      [{ startSec: 0, endSec: durationSec, text: fullText }],
      durationSec,
    );
  }

  if (!segments.length) {
    throw new Error(
      "Local Whisper heard no speech in this clip. Try a clip with clearer talking audio.",
    );
  }

  for (const s of segments) {
    console.info(
      `[localWhisper] caption ${s.startSec.toFixed(2)}-${s.endSec.toFixed(2)}: ${s.text}`,
    );
  }

  return segments;
}
