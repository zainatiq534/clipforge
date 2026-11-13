"use client";

import {
  Eye,
  Film,
  MoreHorizontal,
  Play,
  Scissors,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppPageHero } from "@/components/dashboard/AppPageHero";
import { DashboardMotion } from "@/components/dashboard/DashboardMotion";
import { cn } from "@/lib/cn";
import {
  deleteUpload,
  listClips,
  listUploads,
  stashClipsForEditor,
  type VideoUpload,
  type ViralClip,
} from "@/lib/uploads";

type ProjectFilter = "All" | "Ready" | "Processing" | "Failed";

type ProjectCard = {
  id: string;
  title: string;
  status: ProjectFilter | "Uploading";
  filterKey: ProjectFilter;
  clipCount: number;
  viralScore?: number;
  durationLabel: string;
  updatedLabel: string;
  thumbUrl?: string;
  clips: ViralClip[];
};

const FILTERS: ProjectFilter[] = ["All", "Ready", "Processing", "Failed"];

const filterPillSpring = {
  type: "spring" as const,
  stiffness: 380,
  damping: 32,
  mass: 0.55,
};

const GRADIENTS = [
  "from-[#a78bfa] via-[#8b5cf6] to-[#3b82f6]",
  "from-[#c4b5fd] via-[#a78bfa] to-[#7c3aed]",
  "from-[#8b5cf6] via-[#7c3aed] to-[#3b82f6]",
  "from-[#ddd6fe] via-[#a78bfa] to-[#60a5fa]",
  "from-[#a78bfa] via-[#8b5cf6] to-[#6366f1]",
  "from-[#8b5cf6] via-[#6366f1] to-[#3b82f6]",
];

function formatDuration(sec?: number) {
  if (!sec || !Number.isFinite(sec) || sec <= 0) return "—";
  const s = Math.round(sec);
  const m = Math.floor(s / 60);
  const r = s % 60;
  if (m >= 60) {
    const h = Math.floor(m / 60);
    return `${h}h ${m % 60}m`;
  }
  return `${m}:${String(r).padStart(2, "0")}`;
}

function formatUpdated(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function toFilterKey(status: VideoUpload["status"]): ProjectFilter {
  if (status === "ready") return "Ready";
  if (status === "failed") return "Failed";
  return "Processing";
}

function toStatusLabel(status: VideoUpload["status"]): ProjectCard["status"] {
  if (status === "ready") return "Ready";
  if (status === "failed") return "Failed";
  if (status === "uploading") return "Uploading";
  return "Processing";
}

function buildCards(
  uploads: VideoUpload[],
  clips: ViralClip[],
): ProjectCard[] {
  const byUpload = new Map<string, ViralClip[]>();
  for (const clip of clips) {
    const list = byUpload.get(clip.uploadId) ?? [];
    list.push(clip);
    byUpload.set(clip.uploadId, list);
  }

  return uploads.map((upload) => {
    const projectClips = byUpload.get(upload.id) ?? [];
    const topScore =
      upload.latestViralScore ??
      projectClips.reduce(
        (max, c) => Math.max(max, Number(c.viralScore) || 0),
        0,
      );

    return {
      id: upload.id,
      title: upload.name || "Untitled upload",
      status: toStatusLabel(upload.status),
      filterKey: toFilterKey(upload.status),
      clipCount: Math.max(
        projectClips.length,
        upload.latestClipIds?.length ?? 0,
      ),
      viralScore: topScore > 0 ? Math.round(topScore) : undefined,
      durationLabel: formatDuration(upload.durationSec),
      updatedLabel: formatUpdated(upload.updatedAt || upload.createdAt),
      thumbUrl: upload.latestClipUrl || upload.secureUrl,
      clips: projectClips,
    };
  });
}

export function ProjectsPage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [cards, setCards] = useState<ProjectCard[]>([]);
  const [filter, setFilter] = useState<ProjectFilter>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [menuId, setMenuId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [{ uploads }, clipsRes] = await Promise.all([
        listUploads(),
        listClips().catch(() => ({ clips: [] as ViralClip[] })),
      ]);
      setCards(buildCards(uploads, clipsRes.clips));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load projects.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!menuId) return;
    const onPointer = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuId(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuId(null);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuId]);

  const visible = useMemo(() => {
    if (filter === "All") return cards;
    return cards.filter((c) => c.filterKey === filter);
  }, [cards, filter]);

  const openUpload = (id: string) => {
    router.push(`/dashboard/upload?upload=${encodeURIComponent(id)}`);
  };

  const openEditor = (card: ProjectCard) => {
    if (!card.clips.length) {
      openUpload(card.id);
      return;
    }
    stashClipsForEditor({
      clips: card.clips,
      ratio: "natural",
      uploadId: card.id,
    });
    router.push("/dashboard/editor");
  };

  const removeProject = async (id: string) => {
    setBusyId(id);
    setMenuId(null);
    try {
      await deleteUpload(id);
      setCards((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete project.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <DashboardMotion delay={0.08}>
        <AppPageHero
          title="Projects & videos"
          description="All your long-form uploads and generated clip sets in one place. Open any project to clip, edit, or delete."
          actions={[
            {
              label: "+ New project",
              onClick: () => router.push("/dashboard/upload"),
            },
          ]}
        />
      </DashboardMotion>

      <DashboardMotion delay={0.14}>
        <div
          className="inline-flex max-w-full flex-wrap items-center gap-1 rounded-[18px] border border-white/50 bg-white/35 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.65),0_10px_28px_rgba(124,58,237,0.08)] backdrop-blur-xl"
          role="tablist"
          aria-label="Project status filters"
        >
          {FILTERS.map((item) => {
            const active = filter === item;
            return (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(item)}
                className={cn(
                  "relative rounded-[14px] px-3.5 py-1.5 font-sans text-[11px] font-semibold transition-colors duration-300",
                  active
                    ? "text-[#5b21b6]"
                    : "text-[#6b6680] hover:text-[#111827]",
                )}
              >
                {active ? (
                  <motion.span
                    layoutId="projects-filter-glass"
                    className="pointer-events-none absolute inset-0 z-0 rounded-[14px] border border-white/70 bg-white/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_8px_22px_rgba(124,58,237,0.16)] backdrop-blur-xl"
                    transition={
                      reduceMotion ? { duration: 0 } : filterPillSpring
                    }
                  />
                ) : null}
                <span className="relative z-10">{item}</span>
              </button>
            );
          })}
        </div>
      </DashboardMotion>

      {error ? (
        <p className="rounded-[14px] bg-red-50 px-3 py-2 font-sans text-[12px] text-red-700">
          {error}
        </p>
      ) : null}

      {loading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-56 animate-pulse rounded-[22px] bg-white/80 shadow-[0_10px_28px_rgba(20,20,40,0.06)]"
            />
          ))}
        </div>
      ) : null}

      {!loading && visible.length === 0 ? (
        <DashboardMotion delay={0.16}>
          <section className="flex flex-col items-center justify-center gap-3 rounded-[22px] bg-white px-4 py-12 text-center shadow-[0_10px_28px_rgba(20,20,40,0.06)]">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#ede9fe] text-[#7c3aed]">
              <Film className="h-5 w-5" />
            </span>
            <h2 className="font-sans text-[14px] font-bold text-[#111827]">
              {filter === "All" ? "No projects yet" : `No ${filter.toLowerCase()} projects`}
            </h2>
            <p className="max-w-sm font-sans text-[12px] text-[#7a738c]">
              Upload a long-form video to create your first project, then generate
              clips from Upload or open them in the Clip Editor.
            </p>
            <Link
              href="/dashboard/upload"
              className="mt-1 inline-flex items-center gap-2 rounded-[14px] bg-gradient-to-r from-[#a78bfa] via-[#8b5cf6] to-[#3b82f6] px-4 py-2 font-sans text-[12px] font-semibold text-white shadow-[0_8px_20px_rgba(99,102,241,0.28)]"
            >
              <UploadCloud className="h-3.5 w-3.5" />
              Go to Upload
            </Link>
          </section>
        </DashboardMotion>
      ) : null}

      {!loading && visible.length > 0 ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((project, i) => (
            <DashboardMotion key={project.id} delay={0.16 + i * 0.04}>
              <motion.article
                className="group overflow-hidden rounded-[22px] bg-white p-3 shadow-[0_8px_24px_rgba(15,15,25,0.06)] outline-none ring-0"
                whileHover={
                  reduceMotion
                    ? undefined
                    : { y: -6, scale: 1.02, boxShadow: "0 18px 40px rgba(15,15,25,0.10)" }
                }
                transition={filterPillSpring}
              >
                <button
                  type="button"
                  onClick={() => openUpload(project.id)}
                  className="relative isolate flex h-36 w-full items-center justify-center overflow-hidden rounded-[18px] bg-[#1a1a1f] text-left"
                >
                  <div
                    className={cn(
                      "absolute inset-0 bg-gradient-to-br",
                      GRADIENTS[i % GRADIENTS.length],
                    )}
                    aria-hidden
                  />
                  {project.thumbUrl ? (
                    <video
                      src={project.thumbUrl}
                      muted
                      playsInline
                      preload="metadata"
                      className="pointer-events-none absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  ) : null}
                  <span className="relative z-10 inline-flex h-11 w-11 items-center justify-center rounded-[14px] bg-white/90 text-[#7c3aed] shadow transition-transform duration-300 group-hover:scale-110">
                    <Play className="h-4 w-4 fill-current" />
                  </span>
                </button>

                <div className="relative mt-3 px-1 pb-1" ref={menuId === project.id ? menuRef : undefined}>
                  <div className="flex items-start justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => openUpload(project.id)}
                      className="min-w-0 text-left"
                    >
                      <h2 className="truncate font-sans text-[13px] font-bold text-[#111827]">
                        {project.title}
                      </h2>
                    </button>
                    <div className="flex shrink-0 items-center gap-1">
                      <span className="rounded-[10px] bg-[#ede9fe] px-2 py-0.5 font-sans text-[10px] font-semibold text-[#7c3aed]">
                        {project.status}
                      </span>
                      <button
                        type="button"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-[10px] text-[#7a738c] hover:bg-[#f5f3ff] hover:text-[#111827]"
                        aria-label="More"
                        disabled={busyId === project.id}
                        onClick={() =>
                          setMenuId((prev) =>
                            prev === project.id ? null : project.id,
                          )
                        }
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {menuId === project.id ? (
                    <div className="absolute top-8 right-0 z-20 min-w-[10.5rem] overflow-hidden rounded-[14px] border border-[#ede9fe] bg-white py-1 shadow-[0_12px_30px_rgba(20,20,40,0.14)]">
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 px-3 py-2 font-sans text-[11px] font-semibold text-[#111827] hover:bg-[#f5f3ff]"
                        onClick={() => {
                          setMenuId(null);
                          openUpload(project.id);
                        }}
                      >
                        <UploadCloud className="h-3.5 w-3.5 text-[#7c3aed]" />
                        Open in Upload
                      </button>
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 px-3 py-2 font-sans text-[11px] font-semibold text-[#111827] hover:bg-[#f5f3ff]"
                        onClick={() => {
                          setMenuId(null);
                          openEditor(project);
                        }}
                      >
                        <Scissors className="h-3.5 w-3.5 text-[#7c3aed]" />
                        {project.clips.length ? "Open in Editor" : "Clip first"}
                      </button>
                      <button
                        type="button"
                        className="flex w-full items-center gap-2 px-3 py-2 font-sans text-[11px] font-semibold text-red-600 hover:bg-red-50"
                        onClick={() => void removeProject(project.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Delete
                      </button>
                    </div>
                  ) : null}

                  <p className="mt-1 font-sans text-[11px] text-[#7a738c]">
                    {project.clipCount} clip{project.clipCount === 1 ? "" : "s"}
                    {" · "}
                    {project.durationLabel}
                    {project.updatedLabel ? ` · ${project.updatedLabel}` : ""}
                  </p>
                  <div className="mt-2.5 flex items-center gap-3 font-sans text-[10px] text-[#7a738c]">
                    {project.viralScore != null ? (
                      <span className="inline-flex items-center gap-1">
                        <Eye className="h-3 w-3" /> Viral {project.viralScore}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1">
                        <Eye className="h-3 w-3" /> Not scored yet
                      </span>
                    )}
                  </div>
                </div>
              </motion.article>
            </DashboardMotion>
          ))}
        </div>
      ) : null}
    </div>
  );
}
