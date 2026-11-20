import {
  fetchMe,
  fetchStorageQuota,
  type StorageQuotaSnapshot,
  type UserProfile,
} from "@/lib/api";
import {
  listClips,
  listUploads,
  type VideoUpload,
  type ViralClip,
} from "@/lib/uploads";

export type DashboardBundle = {
  user: UserProfile | null;
  storage: StorageQuotaSnapshot | null;
  uploads: VideoUpload[];
  clips: ViralClip[];
  fetchedAt: number;
};

const TTL_MS = 45_000;
const STORAGE_KEY = "clipforge.dashboardBundle.v1";

let cache: DashboardBundle | null = null;
let inflight: Promise<DashboardBundle> | null = null;

function readSessionCache(): DashboardBundle | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DashboardBundle;
    if (!parsed || typeof parsed.fetchedAt !== "number") return null;
    if (!Array.isArray(parsed.uploads) || !Array.isArray(parsed.clips)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeSessionCache(bundle: DashboardBundle) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(bundle));
  } catch {
    /* quota / private mode */
  }
}

function ensureMemoryCache() {
  if (cache) return cache;
  cache = readSessionCache();
  return cache;
}

/** Fresh hit only (within TTL). */
export function peekDashboardCache(): DashboardBundle | null {
  const hit = ensureMemoryCache();
  if (!hit) return null;
  if (Date.now() - hit.fetchedAt > TTL_MS) return null;
  return hit;
}

/** Any remembered data — for instant paint even when stale. */
export function peekDashboardCacheStale(): DashboardBundle | null {
  return ensureMemoryCache();
}

export function invalidateDashboardCache() {
  cache = null;
  inflight = null;
  if (typeof window !== "undefined") {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }
}

export function patchDashboardCache(
  patch: Partial<Omit<DashboardBundle, "fetchedAt">>,
) {
  const base = ensureMemoryCache();
  if (!base) return;
  cache = { ...base, ...patch, fetchedAt: Date.now() };
  writeSessionCache(cache);
}

/** Shared uploads/clips/profile fetch — deduped across dashboard routes. */
export async function loadDashboardBundle(options?: {
  force?: boolean;
  idToken?: string;
}): Promise<DashboardBundle> {
  const force = options?.force === true;
  if (!force) {
    const hit = peekDashboardCache();
    if (hit) return hit;
    if (inflight) return inflight;
  } else if (inflight) {
    return inflight;
  }

  inflight = (async () => {
    const prev = ensureMemoryCache();
    const [meRes, storageRes, uploadsRes, clipsRes] = await Promise.all([
      options?.idToken
        ? fetchMe(options.idToken).catch(() => null)
        : Promise.resolve(null),
      options?.idToken
        ? fetchStorageQuota(options.idToken).catch(() => null)
        : Promise.resolve(null),
      listUploads().catch(() => ({ uploads: [] as VideoUpload[] })),
      listClips().catch(() => ({ clips: [] as ViralClip[] })),
    ]);

    const next: DashboardBundle = {
      user: meRes?.user ?? prev?.user ?? null,
      storage: storageRes?.storage ?? prev?.storage ?? null,
      uploads: uploadsRes.uploads,
      clips: clipsRes.clips,
      fetchedAt: Date.now(),
    };
    cache = next;
    writeSessionCache(next);
    return next;
  })();

  try {
    return await inflight;
  } finally {
    inflight = null;
  }
}
