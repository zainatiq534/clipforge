import { createHmac, timingSafeEqual } from "node:crypto";
import { Router, type Request, type Response } from "express";
import { env } from "../config/env.js";
import {
  isPaddleBillingConfigured,
  planForPriceId,
} from "../services/paddleCatalog.js";
import { updateUserPlanFromPaddle } from "../services/users.js";

export const paddleRouter = Router();

/**
 * Paddle Billing webhook.
 * Configure URL: POST {API}/billing/paddle/webhook
 * Needs raw body (see index.ts).
 */
paddleRouter.post("/", async (req: Request, res: Response) => {
  try {
    if (!isPaddleBillingConfigured()) {
      res.status(500).json({ ok: false, error: "Paddle billing not configured" });
      return;
    }

    const signature = req.headers["paddle-signature"];
    if (typeof signature !== "string" || !signature) {
      res.status(401).json({ ok: false, error: "Missing paddle-signature" });
      return;
    }

    const raw =
      typeof req.body === "string"
        ? req.body
        : Buffer.isBuffer(req.body)
          ? req.body.toString("utf8")
          : "";

    if (!raw) {
      res.status(400).json({ ok: false, error: "Empty body" });
      return;
    }

    if (!verifyPaddleSignature(raw, signature, env.paddle.webhookSecret)) {
      res.status(401).json({ ok: false, error: "Invalid signature" });
      return;
    }

    const event = JSON.parse(raw) as {
      event_type?: string;
      data?: {
        id?: string;
        customer_id?: string;
        status?: string;
        custom_data?: { uid?: string } | null;
        items?: Array<{ price?: { id?: string } | null }>;
      };
    };

    const type = event.event_type ?? "";
    const handled =
      type.startsWith("subscription.") ||
      type === "transaction.completed";

    if (!handled || !event.data) {
      res.json({ ok: true, ignored: true });
      return;
    }

    const priceId =
      event.data.items?.map((i) => i.price?.id).find((id): id is string => !!id) ??
      null;
    const plan = planForPriceId(priceId);
    const uid =
      typeof event.data.custom_data?.uid === "string"
        ? event.data.custom_data.uid
        : null;

    const status = (event.data.status ?? "").toLowerCase();
    const entitled =
      status === "active" ||
      status === "trialing" ||
      type === "transaction.completed" ||
      type === "subscription.activated" ||
      type === "subscription.created" ||
      type === "subscription.resumed" ||
      type === "subscription.updated";

    const canceled =
      status === "canceled" ||
      status === "cancelled" ||
      type === "subscription.canceled" ||
      type === "subscription.paused";

    if (!uid) {
      console.warn("[paddle/webhook] missing custom_data.uid", type);
      res.json({ ok: true, skipped: "no_uid" });
      return;
    }

    if (canceled) {
      await updateUserPlanFromPaddle(uid, "free", {
        customerId: event.data.customer_id ?? null,
        subscriptionId: event.data.id ?? null,
        status: status || "canceled",
        priceId,
      });
      res.json({ ok: true, plan: "free" });
      return;
    }

    if (entitled && plan) {
      await updateUserPlanFromPaddle(uid, plan, {
        customerId: event.data.customer_id ?? null,
        subscriptionId: event.data.id ?? null,
        status: status || "active",
        priceId,
      });
      res.json({ ok: true, plan });
      return;
    }

    res.json({ ok: true, skipped: "no_plan_change" });
  } catch (error) {
    console.error("[paddle/webhook]", error);
    res.status(500).json({
      ok: false,
      error: error instanceof Error ? error.message : "Webhook failed",
    });
  }
});

/**
 * Paddle signature: `ts=...;h1=...`
 * https://developer.paddle.com/webhooks/signature-verification
 */
function verifyPaddleSignature(
  rawBody: string,
  header: string,
  secret: string,
): boolean {
  const parts = Object.fromEntries(
    header.split(";").map((p) => {
      const [k, ...rest] = p.trim().split("=");
      return [k, rest.join("=")];
    }),
  ) as { ts?: string; h1?: string };

  if (!parts.ts || !parts.h1) return false;

  const payload = `${parts.ts}:${rawBody}`;
  const computed = createHmac("sha256", secret).update(payload).digest("hex");

  try {
    const a = Buffer.from(computed, "hex");
    const b = Buffer.from(parts.h1, "hex");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
