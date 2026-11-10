import "dotenv/config";

function optional(name: string): string | undefined {
  const value = process.env[name]?.trim();
  return value || undefined;
}

function required(name: string): string {
  const value = optional(name);
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

const openRouterApiKey =
  optional("OPEN_ROUTER_API_KEY") ?? optional("OPENROUTER_API_KEY");

const captionsProviderRaw = (
  optional("CAPTIONS_PROVIDER") ??
  (openRouterApiKey ? "openrouter" : "local")
).toLowerCase();

/** Comma-separated CORS allowlist; defaults cover Next on 3000/3001. */
function parseCorsOrigins(): string[] {
  const raw =
    optional("CORS_ORIGIN") ??
    "http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000,http://127.0.0.1:3001";
  return raw
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  corsOrigins: parseCorsOrigins(),
  /** @deprecated use corsOrigins — kept for OpenRouter referer fallback */
  corsOrigin:
    parseCorsOrigins()[0] ?? "http://localhost:3000",
  firebase: {
    projectId: optional("FIREBASE_PROJECT_ID") ?? "clipforge-8a74e",
    clientEmail: optional("FIREBASE_CLIENT_EMAIL"),
    privateKey: optional("FIREBASE_PRIVATE_KEY")?.replace(/\\n/g, "\n"),
    serviceAccountPath:
      optional("FIREBASE_SERVICE_ACCOUNT_PATH") ??
      optional("GOOGLE_APPLICATION_CREDENTIALS"),
  },
  cloudinary: {
    cloudName: optional("CLOUDINARY_CLOUD_NAME"),
    apiKey: optional("CLOUDINARY_API_KEY"),
    apiSecret: optional("CLOUDINARY_API_SECRET"),
  },
  agentRouter: {
    apiKey: optional("AGENT_ROUTER_API_KEY"),
    model: optional("AGENT_ROUTER_MODEL") ?? "deepseek-v4-flash",
    baseUrl:
      optional("AGENT_ROUTER_BASE_URL") ?? "https://agentrouter.org/v1",
  },
  /** OpenRouter Whisper — same path as Lykhaari (openai/whisper-1) */
  openRouter: {
    apiKey: openRouterApiKey,
    model:
      optional("OPEN_ROUTER_API_MODEL") ??
      optional("OPENROUTER_STT_MODEL") ??
      "openai/whisper-1",
    referer:
      optional("OPENROUTER_HTTP_REFERER") ??
      optional("CORS_ORIGIN") ??
      "http://localhost:3000",
    appTitle: optional("OPENROUTER_APP_TITLE") ?? "ClipForge",
  },
  /** Free-tier Whisper captions — https://console.groq.com/keys */
  groq: {
    apiKey: optional("GROQ_API_KEY"),
    model: optional("GROQ_WHISPER_MODEL") ?? "whisper-large-v3",
    baseUrl: optional("GROQ_BASE_URL") ?? "https://api.groq.com/openai/v1",
  },
  /**
   * Captions provider: openrouter | local | groq
   * Defaults to openrouter when OPEN_ROUTER_API_KEY is set.
   */
  captionsProvider: captionsProviderRaw as "openrouter" | "local" | "groq" | string,
  localWhisper: {
    enabled: captionsProviderRaw === "local",
    model: optional("LOCAL_WHISPER_MODEL") ?? "Xenova/whisper-base.en",
    quantized:
      (optional("LOCAL_WHISPER_QUANTIZED") ?? "true").toLowerCase() !== "false",
  },
};

export function requireCloudinary() {
  return {
    cloudName: required("CLOUDINARY_CLOUD_NAME"),
    apiKey: required("CLOUDINARY_API_KEY"),
    apiSecret: required("CLOUDINARY_API_SECRET"),
  };
}
