import { Router } from "express";
import { ZodError, z } from "zod";
import { Readable } from "node:stream";
import { env } from "../config/env.js";
import {
  createPresignedUpload,
  objectKeyFromParts,
  storageIdFromParts,
} from "../config/r2.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import {
  createManualClipsForUpload,
  createViralClipsForUpload,
  getPeakWindowForUpload,
  listClipsForUser,
} from "../services/clipping.js";
import {
  completeUpload,
  createUploadRecord,
  deleteUploadRecord,
  listUploadsForUser,
  markUploadFailed,
} from "../services/uploads.js";
import { importVideoFromUrl } from "../services/urlImport.js";
import { transcribeClipCaptions } from "../services/agentRouter.js";

export const uploadsRouter = Router();

const transcribeClipSchema = z.object({
  mediaUrl: z.string().url(),
});

const fromUrlSchema = z.object({
  url: z.string().url().max(2000),
});

const signSchema = z.object({
  name: z.string().min(1).max(255),
  sizeBytes: z.number().int().positive().max(5 * 1024 * 1024 * 1024),
  contentType: z.string().min(1),
});

const completeSchema = z.object({
  secureUrl: z.string().url(),
  cloudinaryPublicId: z.string().min(1),
  bytes: z.number().int().positive().optional(),
  durationSec: z.number().positive().optional(),
});

const manualClipSchema = z.object({
  segments: z
    .array(
      z.object({
        startSec: z.number(),
        endSec: z.number(),
        title: z.string().max(120).optional(),
      }),
    )
    .min(1),
});

function routeUploadId(req: AuthedRequest): string {
  const id = req.params.id;
  return typeof id === "string" ? id : id[0]!;
}

function isAllowedMediaProxyUrl(raw: string): boolean {
  try {
    const u = new URL(raw);
    if (!/^https?:$/i.test(u.protocol)) return false;
    const host = u.hostname.toLowerCase();
    const publicHost = env.r2.publicUrl
      ? new URL(env.r2.publicUrl).hostname.toLowerCase()
      : "";
    if (publicHost && host === publicHost) return true;
    if (host.endsWith(".r2.dev")) return true;
    if (host.includes("res.cloudinary.com")) return true;
    return false;
  } catch {
    return false;
  }
}

/**
 * Same-origin media proxy so the browser can composite captions onto R2 clips
 * (avoids tainted-canvas / CORS blocks during export).
 */
uploadsRouter.get("/media-proxy", async (req, res) => {
  try {
    const raw = String(req.query.url ?? "").trim();
    if (!raw || !isAllowedMediaProxyUrl(raw)) {
      res.status(400).json({ error: "Media URL not allowed." });
      return;
    }
    const upstream = await fetch(raw, {
      signal: AbortSignal.timeout(10 * 60_000),
    });
    if (!upstream.ok || !upstream.body) {
      res.status(502).json({ error: `Upstream media failed (${upstream.status}).` });
      return;
    }
    const contentType =
      upstream.headers.get("content-type") || "video/mp4";
    const contentLength = upstream.headers.get("content-length");
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "private, max-age=300");
    if (contentLength) res.setHeader("Content-Length", contentLength);
    // Allow the editor origin to read this response for canvas export
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin || "*");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");

    const nodeStream = Readable.fromWeb(
      upstream.body as import("node:stream/web").ReadableStream,
    );
    nodeStream.pipe(res);
  } catch (error) {
    console.error("[uploads/media-proxy]", error);
    if (!res.headersSent) {
      res.status(502).json({ error: "Could not proxy media." });
    }
  }
});

uploadsRouter.use(requireAuth);

/** Import YouTube / direct video URL → R2 upload record. */
uploadsRouter.post("/from-url", async (req: AuthedRequest, res) => {
  try {
    const body = fromUrlSchema.parse(req.body);
    const upload = await importVideoFromUrl({
      uid: req.uid!,
      url: body.url,
    });
    res.status(201).json({ upload });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: "Enter a valid video URL." });
      return;
    }
    const status =
      typeof error === "object" &&
      error &&
      "status" in error &&
      typeof (error as { status: unknown }).status === "number"
        ? (error as { status: number }).status
        : 500;
    console.error("[uploads/from-url]", error);
    res.status(status).json({
      error:
        error instanceof Error
          ? error.message
          : "Could not import this video link.",
    });
  }
});

uploadsRouter.get("/", async (req: AuthedRequest, res) => {
  try {
    const uploads = await listUploadsForUser(req.uid!);
    res.json({ uploads });
  } catch (error) {
    console.error("[uploads/list]", error);
    res.status(500).json({ error: "Could not list uploads." });
  }
});

uploadsRouter.get("/clips/recent", async (req: AuthedRequest, res) => {
  try {
    const clips = await listClipsForUser(req.uid!);
    res.json({ clips });
  } catch (error) {
    console.error("[clips/list]", error);
    res.status(500).json({ error: "Could not list clips." });
  }
});

/** English timed captions from a clip's audio (Whisper). */
uploadsRouter.post("/transcribe-clip", async (req: AuthedRequest, res) => {
  try {
    const body = transcribeClipSchema.parse(req.body);
    console.info(
      "[uploads/transcribe-clip] start",
      new Date().toISOString(),
      body.mediaUrl.slice(0, 120),
    );
    const captions = await transcribeClipCaptions(body.mediaUrl);
    console.info("[uploads/transcribe-clip] done", captions.length, "lines");
    res.json({ captions, language: "en" });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: "mediaUrl is required." });
      return;
    }
    const status =
      typeof error === "object" &&
      error &&
      "status" in error &&
      typeof (error as { status: unknown }).status === "number"
        ? (error as { status: number }).status
        : 500;
    console.error("[uploads/transcribe-clip]", error);
    res.status(status).json({
      error:
        error instanceof Error
          ? error.message
          : "Could not generate English captions.",
    });
  }
});

uploadsRouter.get("/:id/peak-window", async (req: AuthedRequest, res) => {
  try {
    const peakWindow = await getPeakWindowForUpload({
      uploadId: routeUploadId(req),
      uid: req.uid!,
    });
    res.json({ peakWindow });
  } catch (error) {
    const status =
      typeof error === "object" &&
      error &&
      "status" in error &&
      typeof (error as { status: unknown }).status === "number"
        ? (error as { status: number }).status
        : 500;
    console.error("[uploads/peak-window]", error);
    res.status(status).json({
      error:
        error instanceof Error
          ? error.message
          : "Could not load most-watched window.",
    });
  }
});

uploadsRouter.post("/:id/clip", async (req: AuthedRequest, res) => {
  try {
    const clips = await createViralClipsForUpload({
      uploadId: routeUploadId(req),
      uid: req.uid!,
    });
    res.status(201).json({ clips, clip: clips[0] });
  } catch (error) {
    const status =
      typeof error === "object" &&
      error &&
      "status" in error &&
      typeof (error as { status: unknown }).status === "number"
        ? (error as { status: number }).status
        : 500;
    console.error("[uploads/clip]", error);
    res.status(status).json({
      error:
        error instanceof Error
          ? error.message
          : "Could not create viral clips.",
    });
  }
});

uploadsRouter.post("/:id/clip/manual", async (req: AuthedRequest, res) => {
  try {
    const body = manualClipSchema.parse(req.body);
    const clips = await createManualClipsForUpload({
      uploadId: routeUploadId(req),
      uid: req.uid!,
      segments: body.segments,
    });
    res.status(201).json({ clips });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        error: "Provide at least one segment with startSec and endSec.",
        details: error.flatten(),
      });
      return;
    }
    const status =
      typeof error === "object" &&
      error &&
      "status" in error &&
      typeof (error as { status: unknown }).status === "number"
        ? (error as { status: number }).status
        : 500;
    console.error("[uploads/clip/manual]", error);
    res.status(status).json({
      error:
        error instanceof Error
          ? error.message
          : "Could not create manual clips.",
    });
  }
});

uploadsRouter.post("/sign", async (req: AuthedRequest, res) => {
  try {
    const body = signSchema.parse(req.body);
    const record = await createUploadRecord({
      uid: req.uid!,
      name: body.name,
      sizeBytes: body.sizeBytes,
      contentType: body.contentType,
    });

    const key = objectKeyFromParts(record.folder, record.publicId, "mp4");
    const storageId = storageIdFromParts(record.folder, record.publicId);
    const signed = await createPresignedUpload({
      key,
      contentType: body.contentType || "video/mp4",
    });

    res.status(201).json({
      upload: record,
      r2: {
        ...signed,
        storageId,
        folder: record.folder,
        publicId: record.publicId,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: "Validation failed", details: error.flatten() });
      return;
    }
    console.error("[uploads/sign]", error);
    const message =
      error instanceof Error ? error.message : "Could not prepare upload.";
    res.status(500).json({ error: message });
  }
});

uploadsRouter.post("/:id/complete", async (req: AuthedRequest, res) => {
  try {
    const body = completeSchema.parse(req.body);
    const upload = await completeUpload({
      id: routeUploadId(req),
      uid: req.uid!,
      secureUrl: body.secureUrl,
      cloudinaryPublicId: body.cloudinaryPublicId,
      bytes: body.bytes,
      durationSec: body.durationSec,
    });
    res.json({ upload });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: "Validation failed", details: error.flatten() });
      return;
    }
    const status =
      typeof error === "object" &&
      error &&
      "status" in error &&
      typeof (error as { status: unknown }).status === "number"
        ? (error as { status: number }).status
        : 500;
    console.error("[uploads/complete]", error);
    res.status(status).json({
      error: error instanceof Error ? error.message : "Could not complete upload.",
    });
  }
});

uploadsRouter.post("/:id/fail", async (req: AuthedRequest, res) => {
  try {
    const upload = await markUploadFailed(routeUploadId(req), req.uid!);
    if (!upload) {
      res.status(404).json({ error: "Upload not found." });
      return;
    }
    res.json({ upload });
  } catch (error) {
    console.error("[uploads/fail]", error);
    res.status(500).json({ error: "Could not update upload." });
  }
});

uploadsRouter.delete("/:id", async (req: AuthedRequest, res) => {
  try {
    await deleteUploadRecord(routeUploadId(req), req.uid!);
    res.status(204).send();
  } catch (error) {
    const status =
      typeof error === "object" &&
      error &&
      "status" in error &&
      typeof (error as { status: unknown }).status === "number"
        ? (error as { status: number }).status
        : 500;
    console.error("[uploads/delete]", error);
    res.status(status).json({
      error: error instanceof Error ? error.message : "Could not delete upload.",
    });
  }
});
