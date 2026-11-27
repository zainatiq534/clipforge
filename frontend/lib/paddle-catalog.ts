/**
 * Maps ClipForge paid plans ↔ Paddle price IDs.
 * Sandbox IDs below; override with NEXT_PUBLIC_PADDLE_PRICE_* in .env.local for live.
 */
export type PaidPlanId = "creator" | "studio";

const PRICE_IDS: Record<PaidPlanId, string> = {
  creator:
    process.env.NEXT_PUBLIC_PADDLE_PRICE_CREATOR ??
    "pri_01m8ee8xeby9jsfacn088y2jw2",
  studio:
    process.env.NEXT_PUBLIC_PADDLE_PRICE_STUDIO ??
    "pri_01m8eeerccdbmthwg4dv3zrb73",
};

export function priceIdFor(plan: PaidPlanId): string | null {
  return PRICE_IDS[plan] || null;
}

export function planForPriceId(
  priceId: string | null | undefined,
): PaidPlanId | null {
  if (!priceId) return null;
  for (const plan of Object.keys(PRICE_IDS) as PaidPlanId[]) {
    if (PRICE_IDS[plan] === priceId) return plan;
  }
  return null;
}

export const PADDLE_ENV =
  process.env.NEXT_PUBLIC_PADDLE_ENV === "production"
    ? "production"
    : "sandbox";

export const PADDLE_CLIENT_TOKEN =
  process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN ?? "";

export function isPaddleCheckoutReady() {
  return Boolean(PADDLE_CLIENT_TOKEN && PRICE_IDS.creator && PRICE_IDS.studio);
}
