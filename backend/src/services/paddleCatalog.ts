import type { PlanId } from "../types/plan.js";
import { env } from "../config/env.js";

export type PaidPlanId = "creator" | "studio";

const PRICE_IDS: Record<PaidPlanId, string> = {
  creator: env.paddle.priceCreator,
  studio: env.paddle.priceStudio,
};

export function planForPriceId(priceId: string | null | undefined): PaidPlanId | null {
  if (!priceId) return null;
  for (const plan of Object.keys(PRICE_IDS) as PaidPlanId[]) {
    if (PRICE_IDS[plan] === priceId) return plan;
  }
  return null;
}

export function isPaidPlanId(plan: PlanId): plan is PaidPlanId {
  return plan === "creator" || plan === "studio";
}

export function isPaddleBillingConfigured() {
  return Boolean(
    env.paddle.apiKey &&
      env.paddle.webhookSecret &&
      env.paddle.priceCreator &&
      env.paddle.priceStudio,
  );
}
