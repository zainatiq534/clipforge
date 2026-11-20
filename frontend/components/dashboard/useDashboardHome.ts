"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { StorageQuotaSnapshot, UserProfile } from "@/lib/api";
import {
  loadDashboardBundle,
  peekDashboardCache,
  peekDashboardCacheStale,
} from "@/lib/dashboardCache";
import { getFirebaseAuth } from "@/lib/firebase";
import type { VideoUpload, ViralClip } from "@/lib/uploads";

export type DashboardHomeData = {
  user: UserProfile | null;
  storage: StorageQuotaSnapshot | null;
  uploads: VideoUpload[];
  clips: ViralClip[];
  /** True only on first visit with no remembered data. */
  loading: boolean;
  /** Soft background refresh — keep showing current numbers. */
  refreshing: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function daysAgo(n: number) {
  const d = startOfDay(new Date());
  d.setDate(d.getDate() - n);
  return d;
}

function inRange(iso: string | undefined, from: Date, to?: Date) {
  if (!iso) return false;
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return false;
  if (t < from.getTime()) return false;
  if (to && t > to.getTime()) return false;
  return true;
}

function applyBundle(
  bundle: {
    user: UserProfile | null;
    storage: StorageQuotaSnapshot | null;
    uploads: VideoUpload[];
    clips: ViralClip[];
  },
  setters: {
    setUser: (u: UserProfile | null) => void;
    setStorage: (s: StorageQuotaSnapshot | null) => void;
    setUploads: (u: VideoUpload[]) => void;
    setClips: (c: ViralClip[]) => void;
  },
) {
  setters.setUser(bundle.user);
  setters.setStorage(bundle.storage);
  setters.setUploads(bundle.uploads);
  setters.setClips(bundle.clips);
}

export function useDashboardHome(): DashboardHomeData {
  const stale = peekDashboardCacheStale();
  const [user, setUser] = useState<UserProfile | null>(stale?.user ?? null);
  const [storage, setStorage] = useState<StorageQuotaSnapshot | null>(
    stale?.storage ?? null,
  );
  const [uploads, setUploads] = useState<VideoUpload[]>(stale?.uploads ?? []);
  const [clips, setClips] = useState<ViralClip[]>(stale?.clips ?? []);
  const [loading, setLoading] = useState(!stale);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const refresh = useCallback(async (force = false) => {
    const authUser = getFirebaseAuth().currentUser;
    if (!authUser) {
      if (!mounted.current) return;
      setUser(null);
      setStorage(null);
      setUploads([]);
      setClips([]);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    const warm = peekDashboardCache();
    const remembered = peekDashboardCacheStale();
    const hasPaint = Boolean(remembered);

    const revalidateQuietly = async () => {
      setRefreshing(true);
      try {
        const idToken = await authUser.getIdToken();
        const bundle = await loadDashboardBundle({ force: true, idToken });
        if (!mounted.current) return;
        applyBundle(bundle, { setUser, setStorage, setUploads, setClips });
        setError(null);
      } catch {
        /* keep painted data */
      } finally {
        if (mounted.current) setRefreshing(false);
      }
    };

    if (!force && (warm || remembered)) {
      if (!mounted.current) return;
      applyBundle((warm ?? remembered)!, {
        setUser,
        setStorage,
        setUploads,
        setClips,
      });
      setLoading(false);
      await revalidateQuietly();
      return;
    }

    // Cold start only — show skeleton once
    if (!hasPaint) setLoading(true);
    else setRefreshing(true);

    try {
      const idToken = await authUser.getIdToken();
      const bundle = await loadDashboardBundle({ force: true, idToken });
      if (!mounted.current) return;
      applyBundle(bundle, { setUser, setStorage, setUploads, setClips });
      setError(null);
    } catch (err) {
      if (!mounted.current) return;
      setError(
        err instanceof Error ? err.message : "Could not load dashboard data.",
      );
    } finally {
      if (!mounted.current) return;
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const auth = getFirebaseAuth();
    // Paint from session immediately, then sync
    if (auth.currentUser) {
      void refresh(false);
    }
    const unsub = onAuthStateChanged(auth, (nextUser) => {
      if (!nextUser) {
        setUser(null);
        setStorage(null);
        setUploads([]);
        setClips([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }
      void refresh(false);
    });
    return () => unsub();
    // Intentionally once on mount — refresh is stable enough via auth events
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    user,
    storage,
    uploads,
    clips,
    loading,
    refreshing,
    error,
    refresh: () => refresh(true),
  };
}

export function computeDashboardStats(
  uploads: VideoUpload[],
  clips: ViralClip[],
) {
  const now = new Date();
  const weekFrom = daysAgo(6);
  const monthFrom = daysAgo(29);

  const weekClips = clips.filter((c) => inRange(c.createdAt, weekFrom, now));
  const monthClips = clips.filter((c) => inRange(c.createdAt, monthFrom, now));
  const weekUploads = uploads.filter((u) =>
    inRange(u.createdAt, weekFrom, now),
  );
  const monthUploads = uploads.filter((u) =>
    inRange(u.createdAt, monthFrom, now),
  );

  const ready = uploads.filter((u) => u.status === "ready").length;
  const processing = uploads.filter(
    (u) =>
      u.status === "processing" ||
      u.status === "queued" ||
      u.status === "uploading",
  ).length;
  const failed = uploads.filter((u) => u.status === "failed").length;

  const totalDurationSec = uploads.reduce(
    (sum, u) => sum + (Number(u.durationSec) || 0),
    0,
  );
  const hours = Math.round((totalDurationSec / 3600) * 10) / 10;

  const scored = clips
    .map((c) => Number(c.viralScore) || 0)
    .filter((n) => n > 0);
  const avgScore = scored.length
    ? Math.round(scored.reduce((a, b) => a + b, 0) / scored.length)
    : 0;
  const topScore = scored.length ? Math.max(...scored) : 0;

  const weekBars = Array.from({ length: 7 }, (_, i) => {
    const day = daysAgo(6 - i);
    const next = daysAgo(5 - i);
    const end = i === 6 ? now : next;
    const count = clips.filter((c) => inRange(c.createdAt, day, end)).length;
    return count;
  });

  const monthBars = Array.from({ length: 12 }, (_, monthIdx) => {
    const year = now.getFullYear();
    return clips.filter((c) => {
      const d = new Date(c.createdAt);
      return (
        !Number.isNaN(d.getTime()) &&
        d.getFullYear() === year &&
        d.getMonth() === monthIdx
      );
    }).length;
  });

  const toPercents = (values: number[]) => {
    const max = Math.max(1, ...values);
    return values.map((v) =>
      Math.max(v === 0 ? 8 : Math.round((v / max) * 100), 8),
    );
  };

  return {
    hours,
    ready,
    processing,
    failed,
    uploadCount: uploads.length,
    clipCount: clips.length,
    avgScore,
    topScore,
    week: {
      left: weekClips.length,
      right: weekUploads.length,
      complete: ready,
      progress: processing,
      bars: toPercents(weekBars),
      rawBars: weekBars,
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((_, i) => {
        const d = daysAgo(6 - i);
        return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()]!;
      }),
    },
    month: {
      left: monthClips.length,
      right: monthUploads.length,
      complete: ready,
      progress: processing,
      bars: toPercents(monthBars),
      rawBars: monthBars,
      labels: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
    },
  };
}

export function buildActivityFeed(
  uploads: VideoUpload[],
  clips: ViralClip[],
  userName: string,
) {
  type Item = {
    id: string;
    name: string;
    text: string;
    time: string;
    tag: string;
    at: number;
  };

  const items: Item[] = [];

  for (const clip of clips.slice(0, 20)) {
    const at = new Date(clip.createdAt).getTime();
    if (Number.isNaN(at)) continue;
    items.push({
      id: `clip-${clip.id}`,
      name: userName,
      text:
        clip.source === "manual"
          ? `created a manual clip “${clip.title || "Untitled"}”`
          : `scored a viral clip “${clip.title || "Untitled"}” (${Math.round(Number(clip.viralScore) || 0)})`,
      time: relativeTime(at),
      tag: clip.source === "manual" ? "Manual" : "Clip",
      at,
    });
  }

  for (const upload of uploads.slice(0, 20)) {
    const at = new Date(upload.updatedAt || upload.createdAt).getTime();
    if (Number.isNaN(at)) continue;
    const statusText =
      upload.status === "ready"
        ? "finished uploading"
        : upload.status === "failed"
          ? "failed to upload"
          : upload.status === "processing"
            ? "is processing"
            : "started uploading";
    items.push({
      id: `upload-${upload.id}`,
      name: userName,
      text: `${statusText} “${upload.name || "Untitled"}”`,
      time: relativeTime(at),
      tag:
        upload.status === "ready"
          ? "Ready"
          : upload.status === "failed"
            ? "Failed"
            : "Upload",
      at,
    });
  }

  return items.sort((a, b) => b.at - a.at).slice(0, 8);
}

function relativeTime(at: number) {
  const diff = Math.max(0, Date.now() - at);
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(at).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function formatBytesShort(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function userInitials(user: UserProfile | null) {
  const name = user?.displayName?.trim() || user?.email?.trim() || "CF";
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function useDashboardDerived(
  uploads: VideoUpload[],
  clips: ViralClip[],
  user: UserProfile | null,
) {
  return useMemo(() => {
    const stats = computeDashboardStats(uploads, clips);
    const displayName =
      user?.displayName?.trim() ||
      user?.email?.split("@")[0] ||
      "Creator";
    const activity = buildActivityFeed(uploads, clips, displayName);
    const recentUploads = [...uploads]
      .sort((a, b) =>
        (b.updatedAt || b.createdAt).localeCompare(a.updatedAt || a.createdAt),
      )
      .slice(0, 4);
    return { stats, activity, recentUploads, displayName };
  }, [uploads, clips, user]);
}
