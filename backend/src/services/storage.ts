import { db } from "../config/firebase.js";
import { PLAN_CATALOG, resolvePlan, type PlanId } from "../types/plan.js";
import type { VideoUpload } from "../types/upload.js";
import { getUserProfile } from "./users.js";

const UPLOADS_COLLECTION = "uploads";
const CLIPS_COLLECTION = "clips";

export type StorageUsageBreakdown = {
  uploadsBytes: number;
  uploadCount: number;
  readyUploadCount: number;
  failedUploadCount: number;
  clipCount: number;
};

export type StorageQuotaSnapshot = {
  planId: PlanId;
  planLabel: string;
  storageBytesUsed: number;
  storageBytesLimit: number;
  storagePercent: number;
  uploadsUsed: number;
  uploadsLimit: number;
  breakdown: StorageUsageBreakdown;
  plans: Array<{
    id: PlanId;
    label: string;
    storageBytesLimit: number;
    maxUploads: number;
    priceLabel: string;
    blurb: string;
    current: boolean;
  }>;
};

export async function getStorageQuotaForUser(
  uid: string,
): Promise<StorageQuotaSnapshot> {
  const profile = await getUserProfile(uid);
  if (!profile) {
    throw Object.assign(new Error("User profile not found."), { status: 404 });
  }

  const plan = resolvePlan(profile.plan);

  const [uploadsSnap, clipsSnap] = await Promise.all([
    db.collection(UPLOADS_COLLECTION).where("uid", "==", uid).get(),
    db.collection(CLIPS_COLLECTION).where("uid", "==", uid).get(),
  ]);

  const uploads = uploadsSnap.docs.map((d) => d.data() as VideoUpload);
  let uploadsBytes = 0;
  let readyUploadCount = 0;
  let failedUploadCount = 0;

  for (const upload of uploads) {
    const size = Number(upload.bytes ?? upload.sizeBytes ?? 0);
    if (Number.isFinite(size) && size > 0) uploadsBytes += size;
    if (upload.status === "ready") readyUploadCount += 1;
    if (upload.status === "failed") failedUploadCount += 1;
  }

  const storagePercent =
    plan.storageBytesLimit > 0
      ? Math.min(
          100,
          Math.round((uploadsBytes / plan.storageBytesLimit) * 1000) / 10,
        )
      : 0;

  return {
    planId: plan.id,
    planLabel: plan.label,
    storageBytesUsed: uploadsBytes,
    storageBytesLimit: plan.storageBytesLimit,
    storagePercent,
    uploadsUsed: uploads.length,
    uploadsLimit: plan.maxUploads,
    breakdown: {
      uploadsBytes,
      uploadCount: uploads.length,
      readyUploadCount,
      failedUploadCount,
      clipCount: clipsSnap.size,
    },
    plans: (Object.keys(PLAN_CATALOG) as PlanId[]).map((id) => {
      const p = PLAN_CATALOG[id];
      return {
        id: p.id,
        label: p.label,
        storageBytesLimit: p.storageBytesLimit,
        maxUploads: p.maxUploads,
        priceLabel: p.priceLabel,
        blurb: p.blurb,
        current: p.id === plan.id,
      };
    }),
  };
}
