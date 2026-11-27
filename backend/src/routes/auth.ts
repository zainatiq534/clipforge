import { Router } from "express";
import { ZodError, z } from "zod";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { getStorageQuotaForUser } from "../services/storage.js";
import {
  createUserWithProfile,
  ensureUserProfile,
  getUserProfile,
  updateUserPlan,
  updateUserSettings,
} from "../services/users.js";

export const authRouter = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  address: z.string().min(1),
  phone: z
    .string()
    .min(7)
    .max(20)
    .refine((v) => {
      const digits = v.replace(/\D/g, "");
      return digits.length >= 7 && digits.length <= 15;
    }, "Invalid phone number"),
});

const settingsSchema = z.object({
  displayName: z.string().max(80).optional(),
  address: z.string().max(200).optional(),
  phone: z
    .string()
    .max(20)
    .refine((v) => {
      if (!v.trim()) return true;
      const digits = v.replace(/\D/g, "");
      return digits.length >= 7 && digits.length <= 15;
    }, "Invalid phone number")
    .optional(),
  workspaceName: z.string().max(80).optional(),
  preferences: z
    .object({
      defaultAspect: z.enum(["9:16", "1:1", "16:9", "4:5"]).optional(),
      defaultCaptionPackId: z.string().min(1).max(64).optional(),
      autoCaptionsOnClip: z.boolean().optional(),
      notifications: z
        .object({
          clipReady: z.boolean().optional(),
          weeklyReport: z.boolean().optional(),
          marketingEmails: z.boolean().optional(),
        })
        .optional(),
    })
    .optional(),
});

authRouter.post("/register", async (req, res) => {
  try {
    const body = registerSchema.parse(req.body);
    const profile = await createUserWithProfile(body);
    res.status(201).json({
      user: profile,
      message: "Account created. Sign in with your email and password.",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        error: "Validation failed",
        details: error.flatten(),
      });
      return;
    }

    const code =
      typeof error === "object" &&
      error &&
      "code" in error &&
      typeof (error as { code: unknown }).code === "string"
        ? (error as { code: string }).code
        : null;

    if (code === "auth/email-already-exists") {
      res.status(409).json({ error: "An account with this email already exists." });
      return;
    }

    console.error("[auth/register]", error);
    res.status(500).json({ error: "Could not create account." });
  }
});

authRouter.get("/me", requireAuth, async (req: AuthedRequest, res) => {
  try {
    if (!req.uid) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const profile = await getUserProfile(req.uid);
    if (!profile) {
      res.status(404).json({ error: "User profile not found." });
      return;
    }

    res.json({ user: profile });
  } catch (error) {
    console.error("[auth/me]", error);
    res.status(500).json({ error: "Could not load profile." });
  }
});

/** Update profile + workspace preferences from the Settings page. */
authRouter.patch("/me", requireAuth, async (req: AuthedRequest, res) => {
  try {
    if (!req.uid) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const body = settingsSchema.parse(req.body ?? {});
    const profile = await updateUserSettings(req.uid, body);
    res.json({ user: profile });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        error: "Validation failed",
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
    console.error("[auth/me PATCH]", error);
    res.status(status).json({
      error:
        error instanceof Error ? error.message : "Could not save settings.",
    });
  }
});

authRouter.get("/storage", requireAuth, async (req: AuthedRequest, res) => {
  try {
    if (!req.uid) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const storage = await getStorageQuotaForUser(req.uid);
    res.json({ storage });
  } catch (error) {
    const status =
      typeof error === "object" &&
      error &&
      "status" in error &&
      typeof (error as { status: unknown }).status === "number"
        ? (error as { status: number }).status
        : 500;
    console.error("[auth/storage]", error);
    res.status(status).json({
      error:
        error instanceof Error ? error.message : "Could not load storage quota.",
    });
  }
});

const planSchema = z.object({
  planId: z.enum(["free", "creator", "studio"]),
});

authRouter.post("/storage/plan", requireAuth, async (req: AuthedRequest, res) => {
  try {
    if (!req.uid) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const body = planSchema.parse(req.body ?? {});
    // Paid plans must come from Paddle webhook — clients can only move to Free.
    if (body.planId !== "free") {
      res.status(400).json({
        error:
          "Paid plans are unlocked via Paddle checkout. Use Upgrade to open payment.",
      });
      return;
    }
    const user = await updateUserPlan(req.uid, body.planId);
    const storage = await getStorageQuotaForUser(req.uid);
    res.json({ user, storage });
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        error: "Validation failed",
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
    console.error("[auth/storage/plan]", error);
    res.status(status).json({
      error:
        error instanceof Error ? error.message : "Could not update storage plan.",
    });
  }
});

/** Upsert Firestore profile after client Auth (email or Google). */
authRouter.post("/sync", requireAuth, async (req: AuthedRequest, res) => {
  try {
    if (!req.uid || !req.email) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const displayName =
      typeof req.body?.displayName === "string" ? req.body.displayName : undefined;
    const photoURL =
      typeof req.body?.photoURL === "string" ? req.body.photoURL : undefined;
    const provider =
      typeof req.body?.provider === "string" ? req.body.provider : undefined;

    const profile = await ensureUserProfile({
      uid: req.uid,
      email: req.email,
      displayName,
      photoURL,
      provider,
    });

    res.json({ user: profile });
  } catch (error) {
    console.error("[auth/sync]", error);
    res.status(500).json({ error: "Could not sync profile." });
  }
});
