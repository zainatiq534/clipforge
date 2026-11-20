import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import OpenAI from "openai";
import { env } from "../config/env.js";

const require = createRequire(import.meta.url);
const AI_TIMEOUT_MS = 25_000;

function agentRouterChatClient() {
  const apiKey = env.agentRouter.apiKey;
  if (!apiKey) {
    throw new Error(
      "Missing AGENT_ROUTER_API_KEY in backend/.env (AgentRouter key).",
    );
  }
  return new OpenAI({
    apiKey,
    baseURL: env.agentRouter.baseUrl,
    timeout: AI_TIMEOUT_MS,
    maxRetries: 1,
    defaultHeaders: {
      Authorization: `Bearer ${apiKey}`,
      "x-api-key": apiKey,
    },
  });
}

function openRouterChatClient() {
  const apiKey = env.openRouter.apiKey;
  if (!apiKey) {
    throw new Error("Missing OPEN_ROUTER_API_KEY in backend/.env.");
  }
  return new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
    timeout: AI_TIMEOUT_MS,
    maxRetries: 1,
    defaultHeaders: {
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": env.openRouter.referer,
      "X-Title": env.openRouter.appTitle,
    },
  });
}

type ChatProvider = {
  label: string;
  model: string;
  client: OpenAI;
};

function viralChatProviders(): ChatProvider[] {
  const providers: ChatProvider[] = [];
  // Prefer OpenRouter — AgentRouter currently returns 401 for this account
  if (env.openRouter.apiKey) {
    providers.push({
      label: "openrouter",
      model: env.openRouter.chatModel,
      client: openRouterChatClient(),
    });
  }
  if (env.agentRouter.apiKey) {
    providers.push({
      label: "agentrouter",
      model: env.agentRouter.model,
      client: agentRouterChatClient(),
    });
  }
  return providers;
}

/** AgentRouter OpenAI-compatible client (chat + optional audio). */
function agentRouterClient(timeoutMs = AI_TIMEOUT_MS) {
  const apiKey = env.agentRouter.apiKey;
  if (!apiKey) {
    throw Object.assign(
      new Error("Missing AGENT_ROUTER_API_KEY in backend/.env."),
      { status: 503 },
    );
  }
  return new OpenAI({
    apiKey,
    baseURL: env.agentRouter.baseUrl.replace(/\/$/, ""),
    timeout: timeoutMs,
    maxRetries: 1,
    defaultHeaders: {
      // Some AgentRouter gateways accept either style
      Authorization: `Bearer ${apiKey}`,
      "x-api-key": apiKey,
    },
  });
}

function isUnauthorizedAiError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const status =
    "status" in error
      ? (error as { status?: number }).status
      : "statusCode" in error
        ? (error as { statusCode?: number }).statusCode
        : undefined;
  const msg = error instanceof Error ? error.message : String(error);
  return (
    status === 401 ||
    /401|unauthorized client|unauthorized|UNAUTHENTICATED/i.test(msg)
  );
}

function agentRouterBaseCandidates(): string[] {
  const configured = (env.agentRouter.baseUrl || "https://agentrouter.org/v1")
    .trim()
    .replace(/\/$/, "");
  const alts = [
    configured,
    "https://agentrouter.org/v1",
    "https://co.agentrouter.org/v1",
  ];
  return Array.from(new Set(alts));
}

export type ViralSegment = {
  startSec: number;
  endSec: number;
  title: string;
  hook: string;
  viralScore: number;
  reason: string;
};

/** Local picker used when AgentRouter is blocked, slow, or offline. */
export function heuristicViralSegment(input: {
  fileName: string;
  durationSec: number;
  /** Prefer this window when peak-energy / most-watched scan succeeded. */
  mostWatched?: {
    startSec: number;
    endSec: number;
    peakSec: number;
    viralScore: number;
  };
}): ViralSegment {
  const duration = Math.max(8, input.durationSec);
  const base = cleanTitle(input.fileName);

  if (input.mostWatched) {
    const peakLabel = formatTimestamp(input.mostWatched.peakSec);
    return {
      startSec: round1(input.mostWatched.startSec),
      endSec: round1(input.mostWatched.endSec),
      title: `${base} — most watched @ ${peakLabel}`.slice(0, 120),
      hook: `Most-watched moment (~${peakLabel}) — the peak people replay.`.slice(
        0,
        200,
      ),
      viralScore: input.mostWatched.viralScore,
      reason: `Cut around the peak-energy / most-watched point at ${peakLabel} (YouTube-style heat-map proxy from the audio).`,
    };
  }

  const clipLen = clamp(
    Math.round(Math.min(60, Math.max(30, duration * 0.1))),
    30,
    60,
  );
  // Skip cold open; land near first “energy” window (~28–40% in).
  const idealStart = duration * 0.32;
  let startSec = clamp(idealStart, 5, Math.max(5, duration - clipLen - 5));
  let endSec = Math.min(duration - 2, startSec + clipLen);
  if (endSec - startSec < 30) {
    startSec = Math.max(0, duration - 45);
    endSec = duration;
  }

  return {
    startSec: round1(startSec),
    endSec: round1(endSec),
    title: `${base} — viral cut`.slice(0, 120),
    hook: "This is the moment people rewind.".slice(0, 200),
    viralScore: 78,
    reason:
      "Peak scan unavailable — used a high-retention mid-video window (skip intro/outro).",
  };
}

/**
 * Ask AgentRouter for the best viral window. Falls back to a local heuristic
 * if the gateway times out, WAF-blocks Node clients, or returns bad JSON.
 */
export async function pickViralSegment(input: {
  fileName: string;
  durationSec: number;
  transcript: string;
  mostWatched?: {
    startSec: number;
    endSec: number;
    peakSec: number;
    viralScore: number;
  };
}): Promise<ViralSegment> {
  // Real heat-map / peak-energy wins over LLM guesswork when we have it.
  if (input.mostWatched) {
    return heuristicViralSegment(input);
  }

  if (!env.agentRouter.apiKey) {
    console.warn("[agentRouter] no API key — using heuristic segment");
    return heuristicViralSegment(input);
  }

  try {
    return await withTimeout(
      pickViralSegmentViaAi(input),
      AI_TIMEOUT_MS,
      "AgentRouter chat timed out",
    );
  } catch (error) {
    console.warn(
      "[agentRouter/pickViralSegment] falling back to heuristic",
      error instanceof Error ? error.message : error,
    );
    return heuristicViralSegment(input);
  }
}

async function pickViralSegmentViaAi(input: {
  fileName: string;
  durationSec: number;
  transcript: string;
}): Promise<ViralSegment> {
  const providers = viralChatProviders();
  for (const provider of providers) {
    try {
      const [first] = await pickViralSegmentsViaAi({
        ...input,
        count: 1,
        occupied: [],
        peakHints: [],
        provider,
      });
      if (first) return first;
    } catch (error) {
      console.warn(
        `[viral] single-clip ${provider.label} failed`,
        error instanceof Error ? error.message : error,
      );
    }
  }
  return heuristicViralSegment(input);
}

/**
 * AI viral picks: moments the model thinks will perform on Shorts/Reels/TikTok.
 * Uses OpenRouter first (AgentRouter often 401s), then AgentRouter, then heuristic.
 * Each clip is 30–60 seconds.
 */
export async function pickViralSegments(input: {
  fileName: string;
  durationSec: number;
  transcript?: string;
  count: number;
  occupied: Array<{ startSec: number; endSec: number }>;
  /** Peak-energy hotspots — hints for the model, not hard exclusions. */
  peakHints?: Array<{
    startSec: number;
    endSec: number;
    peakSec: number;
    viralScore: number;
  }>;
}): Promise<ViralSegment[]> {
  if (input.count < 1) return [];

  const providers = viralChatProviders();
  if (providers.length === 0) {
    console.warn("[viral] no chat API key — using heuristic segments");
    return heuristicViralSegments(input);
  }

  let lastError: unknown;
  for (const provider of providers) {
    try {
      const ai = await withTimeout(
        pickViralSegmentsViaAi({
          fileName: input.fileName,
          durationSec: input.durationSec,
          transcript: input.transcript ?? "",
          count: input.count,
          occupied: input.occupied,
          peakHints: input.peakHints ?? [],
          provider,
        }),
        AI_TIMEOUT_MS,
        `${provider.label} multi-clip timed out`,
      );
      if (ai.length > 0) {
        console.info(
          `[viral] ${provider.label} returned ${ai.length}/${input.count} picks`,
        );
        if (ai.length >= input.count) return ai;
        const extra = heuristicViralSegments({
          ...input,
          count: input.count - ai.length,
          occupied: [...input.occupied, ...ai],
        });
        return [...ai, ...extra].slice(0, input.count);
      }
    } catch (error) {
      lastError = error;
      console.warn(
        `[viral] ${provider.label} failed`,
        error instanceof Error ? error.message : error,
      );
    }
  }

  console.warn(
    "[viral] all chat providers failed — heuristic fallback",
    lastError instanceof Error ? lastError.message : lastError,
  );
  return heuristicViralSegments(input);
}

/** Spread mid-video 30–60s windows that avoid already-covered peaks. */
export function heuristicViralSegments(input: {
  fileName: string;
  durationSec: number;
  count: number;
  occupied: Array<{ startSec: number; endSec: number }>;
}): ViralSegment[] {
  const duration = Math.max(35, input.durationSec);
  const clipLen = clamp(
    Math.round(Math.min(60, Math.max(30, duration * 0.08))),
    30,
    60,
  );
  const base = cleanTitle(input.fileName);
  const out: ViralSegment[] = [];
  const ratios = [0.22, 0.38, 0.52, 0.66, 0.78, 0.3, 0.45, 0.6, 0.72, 0.18];

  for (const ratio of ratios) {
    if (out.length >= input.count) break;
    let startSec = clamp(
      duration * ratio - clipLen * 0.35,
      0,
      Math.max(0, duration - clipLen),
    );
    let endSec = Math.min(duration, startSec + clipLen);
    if (endSec - startSec < 30) continue;

    const overlaps = [...input.occupied, ...out].some(
      (o) =>
        Math.min(endSec, o.endSec) - Math.max(startSec, o.startSec) >
        clipLen * 0.35,
    );
    if (overlaps) continue;

    out.push({
      startSec: round1(startSec),
      endSec: round1(endSec),
      title: `${base} — viral pick`.slice(0, 120),
      hook: "AI-style viral window — strong mid-video beat.".slice(0, 200),
      viralScore: 74 - out.length,
      reason:
        "Predicted viral moment (heuristic): spaced away from most-watched peaks, 30–60s.",
    });
  }
  return out;
}

async function pickViralSegmentsViaAi(input: {
  fileName: string;
  durationSec: number;
  transcript: string;
  count: number;
  occupied: Array<{ startSec: number; endSec: number }>;
  peakHints: Array<{
    startSec: number;
    endSec: number;
    peakSec: number;
    viralScore: number;
  }>;
  provider: ChatProvider;
}): Promise<ViralSegment[]> {
  const minClip = 30;
  const maxClip = 60;
  const duration = Math.max(minClip + 5, input.durationSec);
  const occupiedText =
    input.occupied.length > 0
      ? input.occupied
          .map(
            (o, i) =>
              `#${i + 1}: ${o.startSec.toFixed(1)}s–${o.endSec.toFixed(1)}s`,
          )
          .join("; ")
      : "(none)";
  const peakText =
    input.peakHints.length > 0
      ? input.peakHints
          .map(
            (p, i) =>
              `#${i + 1}: peak@${p.peakSec.toFixed(1)}s window ${p.startSec.toFixed(1)}–${p.endSec.toFixed(1)}s (energy ${p.viralScore})`,
          )
          .join("\n")
      : "(no audio peaks available)";

  const system = `You are ClipForge, an expert short-form editor for TikTok / Reels / YouTube Shorts.
Pick the MOST VIRAL ${input.count} clip windows from a long-form video — moments that make people stop scrolling, comment, and share.
Optimize for: strong hook in first 3s, punchlines, hot takes, emotional peaks, surprising reveals, quotable lines, story payoffs.
Rules:
- Exactly prefer ${input.count} distinct clips (or as many as clearly viral)
- Each clip MUST be ${minClip}–${maxClip} seconds
- Spread across the runtime — do not cluster near one chapter
- Skip cold opens, outros, ads, silence, and low-stakes filler
- You MAY bias toward audio peak-energy hints when they align with a strong story beat
- startSec/endSec within 0..durationSec; avoid heavy overlap with occupied windows or each other
- Return ONLY valid JSON (no markdown): array of objects with keys
  startSec, endSec, title, hook, viralScore (0-100), reason`;

  const user = `Video: ${input.fileName}
Duration: ${duration} seconds

Audio peak-energy hotspots (optional hints — use if they feel viral, ignore if not):
${peakText}

Occupied windows to avoid overlapping:
${occupiedText}

Transcript / content notes:
${input.transcript || "(No transcript — infer from typical long-form structure: skip intro, prioritize mid-video hooks, debates, reveals, and climax beats. Bias toward peak-energy timestamps when choosing.)"}

Return a JSON array of up to ${input.count} viral clips, ranked best-first.`;

  const response = await input.provider.client.chat.completions.create({
    model: input.provider.model,
    temperature: 0.4,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  const raw = response.choices[0]?.message?.content?.trim() ?? "";
  const jsonText = extractJson(raw);
  const parsed = JSON.parse(jsonText) as unknown;
  const list = Array.isArray(parsed)
    ? parsed
    : parsed &&
        typeof parsed === "object" &&
        Array.isArray((parsed as { clips?: unknown }).clips)
      ? ((parsed as { clips: unknown[] }).clips)
      : [parsed];

  const out: ViralSegment[] = [];
  for (const item of list) {
    if (!item || typeof item !== "object") continue;
    const row = item as Partial<ViralSegment>;
    let startSec = Number(row.startSec);
    let endSec = Number(row.endSec);
    if (!Number.isFinite(startSec) || !Number.isFinite(endSec)) continue;

    startSec = clamp(startSec, 0, Math.max(0, duration - minClip));
    endSec = clamp(endSec, startSec + minClip, duration);
    if (endSec - startSec > maxClip) endSec = startSec + maxClip;
    if (endSec - startSec < minClip - 0.5) continue;

    const overlaps = [...input.occupied, ...out].some(
      (o) =>
        Math.min(endSec, o.endSec) - Math.max(startSec, o.startSec) >
        minClip * 0.35,
    );
    if (overlaps) continue;

    out.push({
      startSec: round1(startSec),
      endSec: round1(endSec),
      title: String(row.title ?? "Viral clip").slice(0, 120),
      hook: String(row.hook ?? "Watch this moment").slice(0, 200),
      viralScore: clamp(Number(row.viralScore ?? 76), 0, 100),
      reason: String(row.reason ?? "AI viral potential").slice(0, 400),
    });
    if (out.length >= input.count) break;
  }
  return out;
}

/**
 * Whisper via AgentRouter is often blocked (WAF) and downloading 4+ min of
 * audio times out — keep a short optional attempt only when explicitly useful.
 */
export async function transcribeAudioFromUrl(audioUrl: string): Promise<string> {
  if (!env.agentRouter.apiKey) return "";
  try {
    return await withTimeout(
      transcribeOnce(audioUrl),
      12_000,
      "Transcription timed out",
    );
  } catch (error) {
    console.warn(
      "[agentRouter/transcribe] skipped",
      error instanceof Error ? error.message : error,
    );
    return "";
  }
}

export type CaptionSegment = {
  startSec: number;
  endSec: number;
  text: string;
};

/**
 * English captions from clip audio.
 * Prefer OpenRouter Whisper when OPEN_ROUTER_API_KEY is set (Lykhaari path).
 * CAPTIONS_PROVIDER=local|groq|openrouter overrides.
 */
export async function transcribeClipCaptions(
  mediaUrl: string,
): Promise<CaptionSegment[]> {
  const provider = env.captionsProvider;

  const openRouterPreferred =
    provider === "openrouter" ||
    (provider !== "local" && provider !== "groq" && Boolean(env.openRouter.apiKey));

  if (openRouterPreferred) {
    if (!env.openRouter.apiKey) {
      throw Object.assign(
        new Error(
          "Missing OPEN_ROUTER_API_KEY in backend/.env (needed for OpenRouter Whisper captions).",
        ),
        { status: 503 },
      );
    }
    try {
      console.info("[captions] using OpenRouter Whisper…", env.openRouter.model);
      const { transcribeVerboseViaOpenRouter } = await import(
        "./openRouterWhisper.js"
      );
      return await withTimeout(
        transcribeVerboseViaOpenRouter(mediaUrl),
        300_000,
        "OpenRouter caption transcription timed out",
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const status =
        typeof error === "object" &&
        error &&
        "status" in error &&
        typeof (error as { status: unknown }).status === "number"
          ? (error as { status: number }).status
          : 0;
      const creditIssue =
        status === 402 ||
        /credits|budget|payment|billing/i.test(message);

      console.error("[captions] OpenRouter Whisper failed", message);

      // Auto-fallback so captions still work when OpenRouter is out of credits
      if (creditIssue && env.groq.apiKey) {
        console.warn("[captions] OpenRouter credits exhausted — falling back to Groq…");
        try {
          return await withTimeout(
            transcribeVerboseViaGroq(mediaUrl),
            90_000,
            "Caption transcription timed out",
          );
        } catch (groqErr) {
          console.error(
            "[captions] Groq fallback failed",
            groqErr instanceof Error ? groqErr.message : groqErr,
          );
          throw Object.assign(
            new Error(
              "OpenRouter is out of credits, and Groq fallback also failed. Add OpenRouter credits or check GROQ_API_KEY.",
            ),
            { status: 402 },
          );
        }
      }

      throw Object.assign(
        new Error(
          creditIssue
            ? "OpenRouter is out of credits for captions. Add credits at openrouter.ai/settings/credits, or set CAPTIONS_PROVIDER=groq in backend/.env."
            : message,
        ),
        { status: status || 500 },
      );
    }
  }

  if (provider === "local" || env.localWhisper.enabled) {
    try {
      console.info("[captions] using local Whisper…");
      const { transcribeVerboseViaLocal } = await import("./localWhisper.js");
      return await withTimeout(
        transcribeVerboseViaLocal(mediaUrl),
        600_000,
        "Local caption transcription timed out (first run downloads the model; wait a few minutes)",
      );
    } catch (error) {
      console.error(
        "[captions] local Whisper failed",
        error instanceof Error ? error.message : error,
      );
      throw error;
    }
  }

  if (provider === "groq" || env.groq.apiKey) {
    try {
      console.info("[captions] using Groq Whisper…");
      return await withTimeout(
        transcribeVerboseViaGroq(mediaUrl),
        90_000,
        "Caption transcription timed out",
      );
    } catch (error) {
      if (isUnauthorizedAiError(error)) {
        throw Object.assign(
          new Error(
            "Groq returned 401. Check GROQ_API_KEY in backend/.env.",
          ),
          { status: 401 },
        );
      }
      throw error;
    }
  }

  if (env.agentRouter.apiKey) {
    return await withTimeout(
      transcribeVerboseViaAgentRouter(mediaUrl),
      90_000,
      "Caption transcription timed out",
    );
  }

  throw Object.assign(
    new Error(
      "No caption engine available. Set OPEN_ROUTER_API_KEY (openai/whisper-1) in backend/.env.",
    ),
    { status: 503 },
  );
}

/**
 * Build a Cloudinary audio URL from a video clip URL.
 * Clip URLs look like: .../upload/so_12,du_30,f_mp4,q_auto/folder/id.mp4
 * We must replace f_mp4 (not prepend another f_mp3) or Cloudinary returns 400.
 */
function preferAudioUrl(url: string): string {
  try {
    if (!url.includes("res.cloudinary.com") || !url.includes("/video/upload/")) {
      return url;
    }
    const marker = "/video/upload/";
    const idx = url.indexOf(marker);
    if (idx < 0) return url;
    const after = url.slice(idx + marker.length);
    const slash = after.indexOf("/");
    if (slash < 0) return url;
    const transforms = after.slice(0, slash);
    const rest = after.slice(slash + 1); // publicId.ext?...

    // Keep so_/du_ and similar; drop format/quality that conflict with mp3
    const kept = transforms
      .split(",")
      .map((p) => p.trim())
      .filter(
        (p) =>
          p &&
          !p.startsWith("f_") &&
          !p.startsWith("q_") &&
          !p.startsWith("vc_") &&
          !p.startsWith("ac_"),
      );
    kept.push("f_mp3", "q_auto:low");
    const file = rest.replace(/\.(mp4|mov|webm)(\?|$)/i, ".mp3$2");
    return `${url.slice(0, idx + marker.length)}${kept.join(",")}/${file}`;
  } catch {
    return url;
  }
}

async function fetchMediaFile(primaryUrl: string): Promise<File> {
  // Prefer the original clip MP4 (real A/V) — Cloudinary f_mp3 rewrites often 400
  const candidates = Array.from(
    new Set(
      [primaryUrl, preferAudioUrl(primaryUrl)].filter(
        (u) => typeof u === "string" && u.length > 0,
      ),
    ),
  );

  let lastError = "Audio fetch failed";
  for (const candidate of candidates) {
    try {
      const audioRes = await fetch(candidate, {
        signal: AbortSignal.timeout(25_000),
        headers: { Accept: "*/*", "User-Agent": "ClipForge/1.0" },
        redirect: "follow",
      });
      if (!audioRes.ok) {
        lastError = `Audio fetch failed (${audioRes.status})`;
        console.warn("[transcribe] fetch failed", audioRes.status, candidate);
        continue;
      }
      const mime = audioRes.headers.get("content-type") ?? "audio/mpeg";
      const buf = Buffer.from(await audioRes.arrayBuffer());
      if (buf.byteLength < 256) {
        lastError = "Audio fetch returned empty body";
        continue;
      }
      if (buf.byteLength > 8_000_000) {
        throw new Error("Clip audio too large for captioning");
      }
      const isVideo =
        mime.includes("mp4") ||
        mime.includes("video") ||
        candidate.toLowerCase().endsWith(".mp4");
      const ext = isVideo ? "mp4" : "mp3";
      const type = isVideo
        ? mime.includes("video")
          ? mime
          : "video/mp4"
        : mime.includes("audio")
          ? mime
          : "audio/mpeg";
      return new File([buf], `clip.${ext}`, { type });
    } catch (error) {
      if (error instanceof Error && error.message.includes("too large")) {
        throw error;
      }
      lastError =
        error instanceof Error ? error.message : "Audio fetch failed";
      console.warn("[transcribe] fetch error", lastError, candidate);
    }
  }
  throw new Error(lastError);
}

async function transcribeOnce(audioUrl: string): Promise<string> {
  const openai = agentRouterClient();
  const file = await fetchMediaFile(audioUrl);
  const result = await openai.audio.transcriptions.create({
    file,
    model: "whisper-1",
  });
  return result.text?.trim() ?? "";
}

type WhisperVerbose = {
  segments?: Array<{
    start?: number;
    end?: number;
    text?: string;
    no_speech_prob?: number;
  }>;
  words?: Array<{
    word?: string;
    start?: number;
    end?: number;
  }>;
  text?: string;
};

const VERBATIM_PROMPT =
  "Transcribe the spoken English word for word. Keep every word exactly as said. Do not summarize, paraphrase, or invent dialogue.";

function resolveFfmpegPath(): string | null {
  try {
    const mod = require("ffmpeg-static") as string | null;
    return typeof mod === "string" && mod.length > 0 ? mod : null;
  } catch {
    return null;
  }
}

/**
 * Pull the clip's real audio track (16 kHz mono FLAC) via ffmpeg.
 * Uses the Cloudinary MP4 clip URL so captions match what you hear in the editor.
 */
async function extractClipAudioFlac(mediaUrl: string): Promise<File> {
  const ffmpegPath = resolveFfmpegPath();
  if (!ffmpegPath) {
    throw new Error("ffmpeg-static is not installed");
  }

  const dir = await mkdtemp(join(tmpdir(), "clipforge-cap-"));
  const outPath = join(dir, "clip-audio.flac");

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
        "-ar",
        "16000",
        "-ac",
        "1",
        "-c:a",
        "flac",
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
      }, 60_000);
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
            new Error(
              stderr.trim().slice(0, 240) || `ffmpeg exited ${code}`,
            ),
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
    if (buf.byteLength > 24_000_000) {
      throw new Error("Extracted audio too large for captioning");
    }
    return new File([new Uint8Array(buf)], "clip-audio.flac", {
      type: "audio/flac",
    });
  } finally {
    await rm(dir, { recursive: true, force: true }).catch(() => undefined);
  }
}

/** Keep Whisper's exact wording; only pack timings for on-screen captions. */
function segmentsFromWhisper(result: WhisperVerbose): CaptionSegment[] {
  // Prefer word timings → short caption lines with the exact spoken words
  const words = (result.words ?? [])
    .map((w) => ({
      word: (w.word ?? "").trim(),
      start: typeof w.start === "number" ? w.start : 0,
      end: typeof w.end === "number" ? w.end : 0,
    }))
    .filter((w) => w.word.length > 0);
  if (words.length) {
    const lines: CaptionSegment[] = [];
    const maxWords = 8;
    for (let i = 0; i < words.length; ) {
      const chunk = words.slice(i, i + maxWords);
      i += chunk.length;
      const text = chunk.map((w) => w.word).join(" ").replace(/\s+/g, " ").trim();
      if (!text) continue;
      const startSec = Math.max(0, Math.round(chunk[0]!.start * 10) / 10);
      const endSec = Math.max(
        startSec + 0.35,
        Math.round(chunk[chunk.length - 1]!.end * 10) / 10,
      );
      lines.push({ startSec, endSec, text });
    }
    if (lines.length) return lines;
  }

  if (result.segments?.length) {
    const fromSegs = result.segments
      .map((s) => {
        // Preserve Whisper text exactly (only trim edges)
        const text = (s.text ?? "").replace(/^\s+|\s+$/g, "");
        if (!text) return null;
        if (
          typeof s.no_speech_prob === "number" &&
          s.no_speech_prob > 0.9 &&
          text.length < 3
        ) {
          return null;
        }
        const startSec = Math.max(0, Math.round((s.start ?? 0) * 10) / 10);
        const endSec = Math.max(
          startSec + 0.4,
          Math.round((s.end ?? startSec + 1.5) * 10) / 10,
        );
        return { startSec, endSec, text };
      })
      .filter((s): s is CaptionSegment => Boolean(s));
    if (fromSegs.length) return fromSegs;
  }

  // Last resort: full transcript text as one/few lines — still exact words
  const whole = (result.text ?? "").replace(/^\s+|\s+$/g, "");
  if (!whole) return [];
  const parts = whole.split(/(?<=[.!?])\s+/).filter(Boolean);
  if (!parts.length) return [{ startSec: 0, endSec: 3, text: whole }];
  let t = 0;
  return parts.map((text) => {
    const wordsApprox = Math.max(2, text.split(/\s+/).length);
    const dur = Math.min(6, Math.max(1.2, wordsApprox * 0.35));
    const startSec = Math.round(t * 10) / 10;
    const endSec = Math.round((t + dur) * 10) / 10;
    t = endSec;
    return { startSec, endSec, text };
  });
}

/**
 * Groq Whisper on the clip's actual soundtrack (ffmpeg FLAC → file upload).
 */
async function transcribeVerboseViaGroq(
  mediaUrl: string,
): Promise<CaptionSegment[]> {
  const apiKey = env.groq.apiKey!;
  // large-v3 first = best word accuracy; turbo only as fallback
  const models = Array.from(
    new Set([
      "whisper-large-v3",
      env.groq.model,
      "whisper-large-v3-turbo",
    ]),
  );

  let lastError: Error | null = null;

  // 1) Extract real audio from the video clip the editor plays
  let audioFile: File | null = null;
  try {
    console.info("[groq/transcribe] extracting audio via ffmpeg…");
    audioFile = await extractClipAudioFlac(mediaUrl);
    console.info(
      "[groq/transcribe] extracted flac",
      Math.round(audioFile.size / 1024),
      "KB",
    );
  } catch (error) {
    lastError = error instanceof Error ? error : new Error(String(error));
    console.warn("[groq/transcribe] ffmpeg extract failed", lastError.message);
  }

  // 2) Fallback: download mp4/mp3 bytes if ffmpeg failed
  if (!audioFile) {
    try {
      audioFile = await fetchMediaFile(mediaUrl);
      console.info("[groq/transcribe] using downloaded media file");
    } catch (error) {
      throw lastError ??
        (error instanceof Error ? error : new Error(String(error)));
    }
  }

  for (const model of models) {
    try {
      const result = await postCompatibleTranscription({
        baseUrl: env.groq.baseUrl,
        apiKey,
        model,
        file: audioFile,
        label: "Groq",
        groq: true,
      });
      const segments = segmentsFromWhisper(result);
      if (segments.length) {
        console.info(
          "[groq/transcribe] ok",
          model,
          segments.length,
          "segments",
        );
        return segments;
      }
      lastError = new Error(
        "Groq heard no speech in this clip. Try a clip with clearer talking audio.",
      );
      console.warn("[groq/transcribe] empty transcript", model, result.text?.slice(0, 80));
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(
        "[groq/transcribe] failed",
        model,
        lastError.message.slice(0, 220),
      );
      if (isUnauthorizedAiError(error)) throw lastError;
    }
  }

  throw lastError ?? new Error("Groq transcription failed.");
}

/**
 * AgentRouter Whisper via raw multipart (more reliable than SDK against WAF),
 * trying file upload then remote URL field across known base URLs.
 */
async function transcribeVerboseViaAgentRouter(
  mediaUrl: string,
): Promise<CaptionSegment[]> {
  const apiKey = env.agentRouter.apiKey!;
  const file = await fetchMediaFile(mediaUrl);
  const audioUrl = preferAudioUrl(mediaUrl);
  const models = ["whisper-1", "openai/whisper-1"];
  const bases = agentRouterBaseCandidates();

  let lastError: Error | null = null;

  for (const base of bases) {
    for (const model of models) {
      try {
        const result = await postCompatibleTranscription({
          baseUrl: base,
          apiKey,
          model,
          file,
          label: "AgentRouter",
        });
        const segments = segmentsFromWhisper(result);
        if (segments.length) return segments;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(
          "[agentRouter/transcribe] file attempt failed",
          base,
          model,
          lastError.message,
        );
      }

      try {
        const result = await postCompatibleTranscription({
          baseUrl: base,
          apiKey,
          model,
          remoteUrl: audioUrl !== mediaUrl ? audioUrl : mediaUrl,
          label: "AgentRouter",
        });
        const segments = segmentsFromWhisper(result);
        if (segments.length) return segments;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(
          "[agentRouter/transcribe] url attempt failed",
          base,
          model,
          lastError.message,
        );
      }
    }
  }

  throw lastError ?? new Error("AgentRouter transcription failed.");
}

async function postCompatibleTranscription(input: {
  baseUrl: string;
  apiKey: string;
  model: string;
  file?: File;
  remoteUrl?: string;
  label?: string;
  groq?: boolean;
}): Promise<WhisperVerbose> {
  const label = input.label ?? "STT";
  const endpoint = `${input.baseUrl.replace(/\/$/, "")}/audio/transcriptions`;
  const form = new FormData();
  form.append("model", input.model);
  form.append("language", "en");
  form.append("response_format", "verbose_json");
  form.append("temperature", "0");
  if (input.groq) {
    form.append("prompt", VERBATIM_PROMPT);
    form.append("timestamp_granularities[]", "word");
    form.append("timestamp_granularities[]", "segment");
  }
  if (input.file) {
    // Prefer Blob+filename — more reliable than File for Node fetch → Groq
    const bytes = new Uint8Array(await input.file.arrayBuffer());
    form.append(
      "file",
      new Blob([bytes], { type: input.file.type || "audio/mpeg" }),
      input.file.name || "clip.mp3",
    );
  } else if (input.remoteUrl) {
    form.append("url", input.remoteUrl);
  } else {
    throw new Error("No audio file or url for transcription");
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${input.apiKey}`,
    Accept: "application/json",
  };
  if (!input.groq) {
    // AgentRouter WAF — dual auth + browser UA
    headers["x-api-key"] = input.apiKey;
    headers["User-Agent"] =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers,
    body: form,
    signal: AbortSignal.timeout(75_000),
  });

  const raw = await res.text();
  if (!res.ok) {
    const err = new Error(
      raw.slice(0, 280) || `${label} transcription HTTP ${res.status}`,
    );
    (err as { status?: number }).status = res.status;
    throw err;
  }

  try {
    return JSON.parse(raw) as WhisperVerbose;
  } catch {
    return { text: raw.trim() };
  }
}

function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  label: string,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(label)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) return fenced[1].trim();
  const arrStart = text.indexOf("[");
  const arrEnd = text.lastIndexOf("]");
  const objStart = text.indexOf("{");
  const objEnd = text.lastIndexOf("}");
  // Prefer array payload for multi-clip viral picks
  if (
    arrStart >= 0 &&
    arrEnd > arrStart &&
    (objStart < 0 || arrStart <= objStart)
  ) {
    return text.slice(arrStart, arrEnd + 1);
  }
  if (objStart >= 0 && objEnd > objStart) {
    return text.slice(objStart, objEnd + 1);
  }
  throw new Error("Model did not return JSON for viral clip selection.");
}

function cleanTitle(fileName: string) {
  return fileName
    .replace(/\.[^.]+$/, "")
    .replace(/[_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 60) || "Clip";
}

function formatTimestamp(sec: number) {
  const s = Math.max(0, Math.round(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}
