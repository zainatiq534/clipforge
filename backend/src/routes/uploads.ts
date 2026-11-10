import { Router } from "express";
import { ZodError, z } from "zod";
import { createVideoUploadSignature } from "../config/cloudinary.js";
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
import { transcribeClipCaptions } from "../services/agentRouter.js";

export const uploadsRouter = Router();

const transcribeClipSchema = z.object({
  mediaUrl: z.string().url(),
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

uploadsRouter.use(requireAuth);

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

    const timestamp = Math.floor(Date.now() / 1000);
    const signed = createVideoUploadSignature({
      folder: record.folder,
      publicId: record.publicId,
      timestamp,
    });

    res.status(201).json({
      upload: record,
      cloudinary: signed,
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
