"use client";

import { Flame, Film, Scissors, TrendingUp, UploadCloud } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppPageHero } from "@/components/dashboard/AppPageHero";
import { DashboardHoverCard } from "@/components/dashboard/DashboardHoverCard";
import { DashboardMotion } from "@/components/dashboard/DashboardMotion";
import { GradientButton } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import {
  loadDashboardBundle,
  peekDashboardCacheStale,
} from "@/lib/dashboardCache";
import {
  stashClipsForEditor,
  type VideoUpload,
  type ViralClip,
} from "@/lib/uploads";

function formatTs(sec: number) {
  const s = Math.max(0, Math.round(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

function scoreOf(clip: ViralClip) {
  const n = Number(clip.viralScore);
  return Number.isFinite(n) ? Math.round(Math.max(0, Math.min(100, n))) : 0;
}

function tierLabel(score: number) {
  if (score >= 90) return "Hot";
  if (score >= 80) return "Strong";
  if (score >= 70) return "Good";
  if (score > 0) return "Okay";
  return "Unscored";
}

export function ViralPage() {
  const router = useRouter();

  const [clips, setClips] = useState<ViralClip[]>([]);
  const [uploads, setUploads] = useState<VideoUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async (force = false) => {
    const warm = peekDashboardCacheStale();
    if (!force && warm) {
      setClips(warm.clips);
      setUploads(warm.uploads);
      setLoading(false);
      void loadDashboardBundle({ force: true })
        .then((bundle) => {
          setClips(bundle.clips);
          setUploads(bundle.uploads);
        })
        .catch(() => undefined);
      return;
    }

    setLoading(true);
    try {
      const bundle = await loadDashboardBundle({ force });
      setClips(bundle.clips);
      setUploads(bundle.uploads);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load viral scores.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const uploadNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const u of uploads) map.set(u.id, u.name || "Untitled upload");
    return map;
  }, [uploads]);

  const ranked = useMemo(() => {
    return [...clips]
      .filter((c) => c.status !== "failed")
      .sort((a, b) => {
        const scoreDiff = scoreOf(b) - scoreOf(a);
        if (scoreDiff !== 0) return scoreDiff;
        return (b.createdAt || "").localeCompare(a.createdAt || "");
      })
      .map((clip, index) => ({
        clip,
        rank: index + 1,
        score: scoreOf(clip),
      }));
  }, [clips]);

  const stats = useMemo(() => {
    const scored = ranked.filter((r) => r.score > 0);
    const top = scored[0]?.score ?? 0;
    const avg = scored.length
      ? Math.round(
          scored.reduce((sum, r) => sum + r.score, 0) / scored.length,
        )
      : 0;
    return {
      top,
      avg,
      count: ranked.length,
      scoredCount: scored.length,
    };
  }, [ranked]);

  const openInEditor = (clip: ViralClip) => {
    const siblings = ranked
      .map((r) => r.clip)
      .filter((c) => c.uploadId === clip.uploadId);
    const pack = siblings.length ? siblings : [clip];
    stashClipsForEditor({
      clips: pack,
      ratio: "natural",
      uploadId: clip.uploadId,
    });
    router.push("/dashboard/editor");
  };

  const rescore = () => {
    const targetId =
      ranked[0]?.clip.uploadId ??
      uploads.find((u) => u.status === "ready")?.id;

    if (targetId) {
      router.push(`/dashboard/upload?upload=${encodeURIComponent(targetId)}`);
      return;
    }
    router.push("/dashboard/upload");
  };

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <DashboardMotion delay={0.08}>
        <AppPageHero
          title="Viral score ranking"
          description="Your clips ranked by predicted engagement — unique to your uploads. Open winners in the editor and publish the strongest first."
        />
      </DashboardMotion>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          {
            label: "Top score",
            value: loading ? "—" : String(stats.top || "—"),
            icon: Flame,
          },
          {
            label: "Avg score",
            value: loading ? "—" : String(stats.avg || "—"),
            icon: TrendingUp,
          },
          {
            label: "Clips scored",
            value: loading
              ? "—"
              : `${stats.scoredCount}${stats.count !== stats.scoredCount ? ` / ${stats.count}` : ""}`,
            icon: Flame,
          },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <DashboardMotion key={stat.label} delay={0.14 + i * 0.05}>
              <DashboardHoverCard>
                <section className="rounded-[22px] bg-white p-3.5 shadow-[0_10px_28px_rgba(20,20,40,0.06)]">
                  <div className="flex items-center justify-between">
                    <h2 className="font-sans text-[13px] font-bold text-[#111827]">
                      {stat.label}
                    </h2>
                    <Icon className="h-4 w-4 text-[#8b5cf6]" strokeWidth={1.8} />
                  </div>
                  <p className="mt-3 font-display text-[1.85rem] leading-none font-extrabold tracking-tight text-[#111827]">
                    {stat.value}
                  </p>
                </section>
              </DashboardHoverCard>
            </DashboardMotion>
          );
        })}
      </div>

      {error ? (
        <p className="rounded-[14px] bg-red-50 px-3 py-2 font-sans text-[12px] text-red-700">
          {error}
        </p>
      ) : null}

      <DashboardMotion delay={0.28}>
        <section className="rounded-[22px] bg-white p-3.5 shadow-[0_10px_28px_rgba(20,20,40,0.06)] sm:p-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="font-sans text-[13px] font-bold text-[#111827]">
              Ranked clips
            </h2>
            <GradientButton size="sm" onClick={rescore}>
              Rescore project
            </GradientButton>
          </div>

          {loading ? (
            <div className="mt-3 space-y-2.5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[4.5rem] animate-pulse rounded-[18px] bg-[#f5f3ff]"
                />
              ))}
            </div>
          ) : null}

          {!loading && ranked.length === 0 ? (
            <div className="mt-6 flex flex-col items-center gap-3 py-8 text-center">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#ede9fe] text-[#7c3aed]">
                <Film className="h-5 w-5" />
              </span>
              <h3 className="font-sans text-[14px] font-bold text-[#111827]">
                No scored clips yet
              </h3>
              <p className="max-w-sm font-sans text-[12px] text-[#7a738c]">
                Run AI clipping on an upload to generate viral scores unique to
                your video. Winners will rank here automatically.
              </p>
              <Link
                href="/dashboard/upload"
                className="mt-1 inline-flex items-center gap-2 rounded-[14px] bg-gradient-to-r from-[#a78bfa] via-[#8b5cf6] to-[#3b82f6] px-4 py-2 font-sans text-[12px] font-semibold text-white shadow-[0_8px_20px_rgba(99,102,241,0.28)]"
              >
                <UploadCloud className="h-3.5 w-3.5" />
                Go to Upload
              </Link>
            </div>
          ) : null}

          {!loading && ranked.length > 0 ? (
            <div className="mt-3 space-y-2.5">
              {ranked.map(({ clip, rank, score }) => {
                const projectName =
                  uploadNameById.get(clip.uploadId) ?? "Project";
                const source =
                  clip.source === "manual" ? "Manual" : "AI";
                return (
                  <DashboardHoverCard key={clip.id}>
                    <article className="flex flex-col gap-3 rounded-[18px] bg-[#faf5ff] p-3 sm:flex-row sm:items-center">
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <span
                          className={cn(
                            "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] font-sans text-[12px] font-bold",
                            rank <= 3
                              ? "bg-gradient-to-br from-[#a78bfa] via-[#8b5cf6] to-[#3b82f6] text-white"
                              : "bg-[#ede9fe] text-[#7c3aed]",
                          )}
                        >
                          #{rank}
                        </span>

                        {clip.clipUrl ? (
                          <div className="relative hidden h-12 w-12 shrink-0 overflow-hidden rounded-[12px] bg-[#111827] sm:block">
                            <video
                              src={clip.clipUrl}
                              muted
                              playsInline
                              preload="metadata"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : null}

                        <div className="min-w-0">
                          <p className="truncate font-sans text-[12px] font-semibold text-[#111827]">
                            {clip.title || clip.hook || "Untitled clip"}
                          </p>
                          <p className="mt-0.5 line-clamp-2 font-sans text-[11px] text-[#7a738c]">
                            {clip.reason ||
                              clip.hook ||
                              "No score explanation yet."}
                          </p>
                          <p className="mt-1 truncate font-sans text-[10px] text-[#9b93ad]">
                            {projectName}
                            {" · "}
                            {source}
                            {" · "}
                            {formatTs(clip.startSec)}–{formatTs(clip.endSec)}
                            {" · "}
                            {tierLabel(score)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:shrink-0">
                        <div className="min-w-[7.5rem] flex-1 sm:flex-none">
                          <div className="mb-1 flex items-center justify-between font-sans text-[10px] font-semibold">
                            <span className="text-[#6b6680]">Score</span>
                            <span className="text-[#111827]">
                              {score > 0 ? score : "—"}
                            </span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-[#ede9fe]">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#a78bfa] via-[#8b5cf6] to-[#3b82f6] transition-[width] duration-500"
                              style={{ width: `${score}%` }}
                            />
                          </div>
                        </div>
                        <GradientButton
                          size="sm"
                          leftIcon={<Scissors className="h-3.5 w-3.5" />}
                          onClick={() => openInEditor(clip)}
                        >
                          Open
                        </GradientButton>
                      </div>
                    </article>
                  </DashboardHoverCard>
                );
              })}
            </div>
          ) : null}
        </section>
      </DashboardMotion>
    </div>
  );
}
