export type PlanId = "free" | "creator" | "studio";

export type PlanDefinition = {
  id: PlanId;
  label: string;
  storageBytesLimit: number;
  maxUploads: number;
  priceLabel: string;
  blurb: string;
};

export const PLAN_CATALOG: Record<PlanId, PlanDefinition> = {
  free: {
    id: "free",
    label: "Free",
    storageBytesLimit: 2 * 1024 ** 3, // 2 GB
    maxUploads: 25,
    priceLabel: "$0",
    blurb: "Starter quota for trying ClipForge.",
  },
  creator: {
    id: "creator",
    label: "Creator",
    storageBytesLimit: 25 * 1024 ** 3, // 25 GB
    maxUploads: 200,
    priceLabel: "$19/mo",
    blurb: "More room for weekly long-form uploads.",
  },
  studio: {
    id: "studio",
    label: "Studio",
    storageBytesLimit: 100 * 1024 ** 3, // 100 GB
    maxUploads: 1000,
    priceLabel: "$60/mo",
    blurb: "High quota for teams and heavy clipping.",
  },
};

export const DEFAULT_PLAN_ID: PlanId = "free";

export function resolvePlan(planId?: string | null): PlanDefinition {
  if (planId && planId in PLAN_CATALOG) {
    return PLAN_CATALOG[planId as PlanId];
  }
  return PLAN_CATALOG[DEFAULT_PLAN_ID];
}
