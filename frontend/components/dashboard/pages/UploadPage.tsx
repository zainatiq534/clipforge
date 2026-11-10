"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus, Scissors, Sparkles, Upload, X } from "lucide-react";
import { UploadIntakePanel } from "@/components/dashboard/UploadIntakePanel";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import { CapCutTrimBar } from "@/components/dashboard/CapCutTrimBar";
import { AppPageHero } from "@/components/dashboard/AppPageHero";
import { DashboardMotion } from "@/components/dashboard/DashboardMotion";
import { GradientButton } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import {
  buildCloudinaryClipUrl,
  createManualClips,
  createViralClips,
  deleteUpload,
  fetchPeakWindow,
  listClips,
  listUploads,
  stashClipsForEditor,
  uploadVideoToCloudinary,
  type ExportRatio,
  type PeakWindow,
  type VideoUpload,
  type ViralClip,
} from "@/lib/uploads";

type ClipMode = "ai" | "manual";

type RowItem = {
  id: string;
  name: string;
  size: string;
  status: "Ready" | "Uploading" | "Failed" | "Queued" | "Processing";
  progress?: number;
  secureUrl?: string;
  durationSec?: number;
  clipUrl?: string;
  clipTitle?: string;
  viralScore?: number;
};

type DraftCrop = {
  id: string;
  startRel: number;
  endRel: number;
  startSec: number;
  endSec: number;
  clipUrl: string;
  title: string;
};

const ease = [0.16, 1, 0.3, 1] as const;

const RATIOS: { id: ExportRatio; label: string; hint: string }[] = [
  { id: "yt-shorts", label: "YT Shorts", hint: "9:16 letterbox" },
  { id: "instagram", label: "Insta Reel", hint: "9:16 letterbox" },
  { id: "tiktok", label: "TikTok", hint: "9:16 letterbox" },
  { id: "natural", label: "Natural", hint: "Original frame" },
];

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function formatTs(sec: number) {
  const s = Math.max(0, Math.round(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

function toRow(upload: VideoUpload): RowItem {
  const status =
    upload.status === "ready"
      ? "Ready"
      : upload.status === "failed"
        ? "Failed"
        : upload.status === "uploading"
          ? "Uploading"
          : upload.status === "processing"
            ? "Processing"
            : "Queued";

  return {
    id: upload.id,
    name: upload.name,
    size: formatBytes(upload.bytes ?? upload.sizeBytes),
    status,
    secureUrl: upload.secureUrl,
    durationSec: upload.durationSec,
    clipUrl: upload.latestClipUrl,
    clipTitle: upload.latestClipTitle,
    viralScore: upload.latestViralScore,
  };
}

function LetterboxPlayer({
  src,
  ratio,
  videoRef,
  className,
  controls = true,
  muted = false,
  autoPlay = false,
}: {
  src: string;
  ratio: ExportRatio;
  videoRef?: RefObject<HTMLVideoElement | null>;
  className?: string;
  controls?: boolean;
  muted?: boolean;
  autoPlay?: boolean;
}) {
  const vertical = ratio !== "natural";
  return (
    <div
      className={cn(
        "relative isolate overflow-hidden rounded-[16px] bg-black",
        vertical
          ? "mx-auto aspect-[9/16] h-auto max-h-[420px] w-[min(100%,240px)]"
          : "aspect-video w-full",
        className,
      )}
    >
      {/* Clip + inset keep landscape frames inside the 9:16 phone edges */}
      <div className="absolute inset-[2px] flex items-center justify-center overflow-hidden rounded-[14px]">
        <video
          key={`${src}-${ratio}`}
          ref={videoRef}
          className="max-h-full max-w-full object-contain"
          style={{ width: "100%", height: "100%" }}
          src={src}
          controls={controls}
          muted={muted}
          autoPlay={autoPlay}
          playsInline
          preload="auto"
        />
      </div>
    </div>
  );
}

const RATIO_LABEL: Record<ExportRatio, string> = {
  natural: "Natural",
  "yt-shorts": "YT Shorts 9:16",
  instagram: "Insta Reel 9:16",
  tiktok: "TikTok 9:16",
};

export function UploadPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const playerRef = useRef<HTMLVideoElement>(null);
  const manualVideoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();

  const [rows, setRows] = useState<RowItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [clipping, setClipping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<ClipMode>("ai");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [resultClips, setResultClips] = useState<ViralClip[]>([]);
  const [activeClip, setActiveClip] = useState<ViralClip | null>(null);
  const [ratio, setRatio] = useState<ExportRatio>("natural");
  const [floatBatch, setFloatBatch] = useState(0);

  const [peakWindow, setPeakWindow] = useState<PeakWindow | null>(null);
  const [peakLoading, setPeakLoading] = useState(false);
  const [trimStart, setTrimStart] = useState(4);
  const [trimEnd, setTrimEnd] = useState(16);
  const [playhead, setPlayhead] = useState(4);
  const [draftCrops, setDraftCrops] = useState<DraftCrop[]>([]);
  const [uploadPanelOpen, setUploadPanelOpen] = useState(false);
  const [pasteLinkHint, setPasteLinkHint] = useState<string | null>(null);
  /** Manual center player: full source video or a selected crop. */
  const [manualCenter, setManualCenter] = useState<"full" | string>("full");

  const selected = useMemo(
    () => rows.find((r) => r.id === selectedId) ?? null,
    [rows, selectedId],
  );

  const readyTarget = useMemo(() => {
    if (
      selected &&
      selected.status === "Ready" &&
      !selected.id.startsWith("local-")
    ) {
      return selected;
    }
    return (
      rows.find((r) => r.status === "Ready" && !r.id.startsWith("local-")) ??
      null
    );
  }, [rows, selected]);

  const playOnRight = useCallback((clip: ViralClip) => {
    setActiveClip(clip);
    requestAnimationFrame(() => {
      playerRef.current?.load();
      void playerRef.current?.play().catch(() => undefined);
    });
  }, []);

  const revealClips = useCallback(
    (clips: ViralClip[]) => {
      setResultClips(clips);
      setFloatBatch((n) => n + 1);
      if (clips[0]) playOnRight(clips[0]);
    },
    [playOnRight],
  );

  const refresh = useCallback(async () => {
    try {
      const [{ uploads }, clipsRes] = await Promise.all([
        listUploads(),
        listClips().catch(() => ({ clips: [] as ViralClip[] })),
      ]);
      const nextRows = uploads.map(toRow);
      setRows(nextRows);
      setError(null);

      setSelectedId((prev) => {
        if (prev && nextRows.some((r) => r.id === prev)) return prev;
        return nextRows.find((r) => r.status === "Ready")?.id ?? null;
      });

      setResultClips((prev) => {
        if (prev.length) return prev;
        const firstUpload = nextRows[0]?.id;
        if (!firstUpload) return prev;
        return clipsRes.clips.filter((c) => c.uploadId === firstUpload);
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load uploads.");
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const loadPeakEditor = useCallback(async (uploadId: string) => {
    setPeakLoading(true);
    setError(null);
    setDraftCrops([]);
    try {
      const { peakWindow: window } = await fetchPeakWindow(uploadId);
      setPeakWindow(window);
      setManualCenter("full");
      // Full video timeline — start with a short selection near ~20%
      const w = Math.max(8, window.durationSec || window.windowDurationSec);
      const len = Math.min(20, Math.max(10, Math.round(w * 0.05)));
      const start = Math.min(Math.max(5, Math.round(w * 0.2)), Math.max(0, w - len - 1));
      setTrimStart(start);
      setTrimEnd(Math.min(w, start + len));
      setPlayhead(start);
    } catch (err) {
      setPeakWindow(null);
      setError(
        err instanceof Error
          ? err.message
          : "Could not load the full video for manual cropping.",
      );
    } finally {
      setPeakLoading(false);
    }
  }, []);

  useEffect(() => {
    if (mode !== "manual" || !readyTarget) return;
    void loadPeakEditor(readyTarget.id);
  }, [mode, readyTarget?.id, loadPeakEditor]);

  const uploadFiles = useCallback(
    async (list: FileList | null) => {
      if (!list?.length) return;
      const videos = Array.from(list).filter(
        (f) =>
          f.type.startsWith("video/") ||
          /\.(mp4|mov|mkv|webm)$/i.test(f.name),
      );
      if (!videos.length) {
        setError("Please choose an MP4, MOV, MKV, or WEBM video.");
        return;
      }

      setBusy(true);
      setError(null);
      setUploadPanelOpen(false);
      setPasteLinkHint(null);

      for (const file of videos) {
        const tempId = `local-${file.name}-${file.lastModified}`;
        setRows((prev) => [
          {
            id: tempId,
            name: file.name,
            size: formatBytes(file.size),
            status: "Uploading",
            progress: 0,
          },
          ...prev.filter((r) => r.id !== tempId),
        ]);

        try {
          const uploaded = await uploadVideoToCloudinary(file, (pct) => {
            setRows((prev) =>
              prev.map((r) =>
                r.id === tempId
                  ? { ...r, progress: pct, status: "Uploading" as const }
                  : r,
              ),
            );
          });
          setRows((prev) => [
            toRow(uploaded),
            ...prev.filter((r) => r.id !== tempId && r.id !== uploaded.id),
          ]);
          setSelectedId(uploaded.id);
        } catch (err) {
          setRows((prev) =>
            prev.map((r) =>
              r.id === tempId
                ? { ...r, status: "Failed" as const, progress: undefined }
                : r,
            ),
          );
          setError(
            err instanceof Error ? err.message : "Upload failed. Try again.",
          );
        }
      }

      setBusy(false);
      void refresh();
    },
    [refresh],
  );

  const openPicker = () => inputRef.current?.click();
  const openUploadPanel = () => {
    setPasteLinkHint(null);
    setUploadPanelOpen(true);
  };
  const closeUploadPanel = () => {
    setUploadPanelOpen(false);
    setPasteLinkHint(null);
  };

  const handlePasteLink = (url: string) => {
    try {
      const parsed = new URL(url);
      if (!/^https?:$/i.test(parsed.protocol)) {
        throw new Error("invalid");
      }
      setPasteLinkHint(
        `Link saved: ${parsed.hostname} — direct link import is next; for now use Upload files.`,
      );
      setError(null);
    } catch {
      setError("Enter a valid video link (https://…).");
    }
  };

  useEffect(() => {
    if (!uploadPanelOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeUploadPanel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [uploadPanelOpen]);

  const removeFile = async (id: string) => {
    if (id.startsWith("local-")) {
      setRows((prev) => prev.filter((r) => r.id !== id));
      return;
    }
    try {
      await deleteUpload(id);
      setRows((prev) => prev.filter((r) => r.id !== id));
      if (selectedId === id) setSelectedId(null);
      if (activeClip?.uploadId === id) setActiveClip(null);
      setResultClips((prev) => prev.filter((c) => c.uploadId !== id));
      if (peakWindow?.uploadId === id) {
        setPeakWindow(null);
        setDraftCrops([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not remove upload.");
    }
  };

  const startAiClipping = async () => {
    if (!readyTarget) {
      setError("Upload a video and wait until Ready, then start AI clipping.");
      return;
    }

    setSelectedId(readyTarget.id);
    setClipping(true);
    setError(null);
    setRows((prev) =>
      prev.map((r) =>
        r.id === readyTarget.id ? { ...r, status: "Processing" as const } : r,
      ),
    );

    try {
      const { clips } = await createViralClips(readyTarget.id);
      setRows((prev) =>
        prev.map((r) =>
          r.id === readyTarget.id
            ? {
                ...r,
                status: "Ready",
                clipUrl: clips[0]?.clipUrl,
                clipTitle: clips[0]?.title,
                viralScore: clips[0]?.viralScore,
              }
            : r,
        ),
      );
      revealClips(clips);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "AI clipping failed. Try again.",
      );
      setRows((prev) =>
        prev.map((r) =>
          r.id === readyTarget.id ? { ...r, status: "Ready" as const } : r,
        ),
      );
    } finally {
      setClipping(false);
      void refresh();
    }
  };

  const addDraftCrop = () => {
    if (!peakWindow) return;
    if (trimEnd - trimStart < 3) {
      setError("Selection must be at least 3 seconds.");
      return;
    }

    const startSec = round1(peakWindow.windowStartSec + trimStart);
    const endSec = round1(peakWindow.windowStartSec + trimEnd);
    const clipUrl = buildCloudinaryClipUrl(
      peakWindow.cloudName,
      peakWindow.publicId,
      startSec,
      endSec,
    );
    const next: DraftCrop = {
      id: `draft-${Date.now()}-${draftCrops.length}`,
      startRel: trimStart,
      endRel: trimEnd,
      startSec,
      endSec,
      clipUrl,
      title: `Crop ${draftCrops.length + 1} · ${formatTs(startSec)}–${formatTs(endSec)}`,
    };
    setDraftCrops((prev) => [...prev, next]);
    setError(null);

    // Nudge trim for the next cut along the full timeline
    const w = peakWindow.durationSec || peakWindow.windowDurationSec;
    const len = trimEnd - trimStart;
    const nextStart = Math.min(w - len - 1, trimEnd + 1);
    setTrimStart(Math.max(0, nextStart));
    setTrimEnd(Math.min(w, nextStart + len));
  };

  const playDraftInCenter = (draft: DraftCrop) => {
    setManualCenter(draft.id);
    setActiveClip(null);
    requestAnimationFrame(() => {
      const el = manualVideoRef.current;
      if (!el) return;
      el.load();
      void el.play().catch(() => undefined);
    });
  };

  const showFullVideoInCenter = useCallback(() => {
    setManualCenter("full");
    setActiveClip(null);
  }, []);

  const centerVideoSrc = useMemo(() => {
    if (!peakWindow) return "";
    if (manualCenter === "full") return peakWindow.previewUrl;
    const draft = draftCrops.find((d) => d.id === manualCenter);
    return draft?.clipUrl ?? peakWindow.previewUrl;
  }, [peakWindow, manualCenter, draftCrops]);

  // Keep playhead synced while full source video plays in center
  useEffect(() => {
    if (mode !== "manual" || manualCenter !== "full") return;
    const el = manualVideoRef.current;
    if (!el) return;
    const onTime = () => setPlayhead(el.currentTime);
    el.addEventListener("timeupdate", onTime);
    return () => el.removeEventListener("timeupdate", onTime);
  }, [mode, manualCenter, centerVideoSrc]);

  const commitManualClips = async () => {
    if (!readyTarget || !peakWindow) {
      setError("Select a Ready upload and open Manual first.");
      return;
    }
    if (draftCrops.length < 1) {
      setError("Add at least one crop from the trim bar, then save clips.");
      return;
    }

    setClipping(true);
    setError(null);
    try {
      const segments = draftCrops.map((d) => ({
        startSec: d.startSec,
        endSec: d.endSec,
      }));
      const { clips } = await createManualClips(readyTarget.id, segments);
      setRows((prev) =>
        prev.map((r) =>
          r.id === readyTarget.id
            ? {
                ...r,
                status: "Ready",
                clipUrl: clips[0]?.clipUrl,
                clipTitle: clips[0]?.title,
              }
            : r,
        ),
      );
      // Keep drafts in sync with saved clips; stay in manual view
      setDraftCrops(
        clips.map((c, i) => ({
          id: c.id,
          startRel: Math.max(0, c.startSec - peakWindow.windowStartSec),
          endRel: Math.max(1, c.endSec - peakWindow.windowStartSec),
          startSec: c.startSec,
          endSec: c.endSec,
          clipUrl: c.clipUrl,
          title: c.title,
        })),
      );
      setResultClips(clips);
      if (clips[0]) playOnRight(clips[0]);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Manual clipping failed. Try again.",
      );
    } finally {
      setClipping(false);
      void refresh();
    }
  };

  const continueToEditor = () => {
    const clipsForEditor =
      mode === "manual" && draftCrops.length
        ? draftCrops.map((d, i) => ({
            id: d.id,
            uploadId: peakWindow?.uploadId ?? "",
            uid: "",
            title: d.title,
            hook: "Manual crop",
            reason: "",
            viralScore: 0,
            startSec: d.startSec,
            endSec: d.endSec,
            durationSec: round1(d.endSec - d.startSec),
            sourcePublicId: peakWindow?.publicId ?? "",
            clipUrl: d.clipUrl,
            status: "ready" as const,
            source: "manual" as const,
            rank: i + 1,
            createdAt: "",
            updatedAt: "",
          }))
        : resultClips;

    if (!clipsForEditor.length) {
      setError("Create clips first (AI or Manual), then continue to editor.");
      return;
    }
    stashClipsForEditor({
      clips: clipsForEditor,
      ratio,
      uploadId: clipsForEditor[0]?.uploadId,
    });
    router.push("/dashboard/editor");
  };

  const readyCount = rows.filter((r) => r.status === "Ready").length;
  const windowDur =
    peakWindow?.durationSec ?? peakWindow?.windowDurationSec ?? 45;

  const centerVideoLabel =
    manualCenter === "full"
      ? `Full video · ${RATIO_LABEL[ratio]} · ${formatTs(0)}–${formatTs(windowDur)} (${Math.round(windowDur)}s)`
      : (() => {
          const draft = draftCrops.find((d) => d.id === manualCenter);
          if (!draft) return `Crop · ${RATIO_LABEL[ratio]}`;
          const idx = draftCrops.findIndex((d) => d.id === draft.id) + 1;
          return `Crop ${idx} · ${RATIO_LABEL[ratio]} · ${formatTs(draft.startSec)}–${formatTs(draft.endSec)}`;
        })();

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <DashboardMotion delay={0.06}>
        <AppPageHero
          title="Upload your long-form video"
          description="Browse a file, then use AI (most-watched + viral moments, 30–60s clips) or Manual crop anywhere on your full Cloudinary video. Ratios letterbox — never crop."
          actions={[
            {
              label: "Browse files",
              onClick: openUploadPanel,
              tone: "primary",
              icon: <Upload className="h-3.5 w-3.5" />,
              disabled: busy || clipping,
            },
          ]}
        />
      </DashboardMotion>

      <input
        ref={inputRef}
        type="file"
        accept="video/*,.mp4,.mov,.mkv,.webm"
        multiple
        className="sr-only"
        onChange={(e) => {
          void uploadFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {error ? (
        <p
          role="alert"
          className="rounded-[14px] border border-[#ffd8e1] bg-[#fff0f3] px-3 py-2 font-sans text-xs text-[#9d2945]"
        >
          {error}
        </p>
      ) : null}
      {pasteLinkHint ? (
        <p
          role="status"
          className="rounded-[14px] border border-[#ddd6fe] bg-[#f5f3ff] px-3 py-2 font-sans text-xs text-[#5b21b6]"
        >
          {pasteLinkHint}
        </p>
      ) : null}

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.45fr)_minmax(260px,0.75fr)]">
        <div className="flex min-w-0 flex-col gap-3">
          <DashboardMotion delay={0.12}>
            <section className="relative overflow-hidden rounded-[22px] bg-white p-3.5 shadow-[0_10px_28px_rgba(20,20,40,0.06)] sm:p-4">
              {uploadPanelOpen ? (
                <UploadIntakePanel
                  busy={busy}
                  onClose={closeUploadPanel}
                  onBrowse={openPicker}
                  onDropFiles={(files) => void uploadFiles(files)}
                  onPasteLink={handlePasteLink}
                />
              ) : null}

              <div
                className={cn(
                  "flex flex-wrap items-center justify-between gap-2",
                  uploadPanelOpen && "hidden",
                )}
              >
                <div>
                  <h2 className="font-sans text-[13px] font-bold text-[#111827]">
                    {mode === "manual"
                      ? "Manual crop editor"
                      : resultClips.length
                        ? `Your ${resultClips.length} AI clips`
                        : "Your AI clips"}
                  </h2>
                  <p className="font-sans text-[10px] text-[#7a738c]">
                    {mode === "manual"
                      ? "Timeline shows video frames · crops go left · tap a crop to play in the center"
                      : resultClips.length
                        ? "Most-watched first, then AI viral picks · 30–60s each · tap to play"
                        : "Run AI clipping — covers all strong viral moments"}
                  </p>
                </div>
                <div className="inline-flex rounded-[12px] bg-[#f5f3ff] p-1">
                  <button
                    type="button"
                    onClick={() => setMode("ai")}
                    disabled={clipping}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-[10px] px-2.5 py-1.5 font-sans text-[11px] font-semibold transition",
                      mode === "ai"
                        ? "bg-white text-[#111827] shadow-sm"
                        : "text-[#6b6680]",
                    )}
                  >
                    <Sparkles className="h-3 w-3" />
                    AI
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("manual")}
                    disabled={clipping}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-[10px] px-2.5 py-1.5 font-sans text-[11px] font-semibold transition",
                      mode === "manual"
                        ? "bg-white text-[#111827] shadow-sm"
                        : "text-[#6b6680]",
                    )}
                  >
                    <Scissors className="h-3 w-3" />
                    Manual
                  </button>
                </div>
              </div>

              <div
                className={cn("mt-3", uploadPanelOpen && "hidden")}
                aria-hidden={uploadPanelOpen}
              >
              {/* AI: viral clip cards */}
              {mode === "ai" ? (
                <div className="mt-3 grid min-h-[148px] grid-cols-1 gap-2.5 sm:grid-cols-3">
                  <AnimatePresence mode="popLayout">
                    {resultClips.length ? (
                      resultClips.map((clip, index) => (
                        <motion.button
                          key={`${floatBatch}-${clip.id}`}
                          type="button"
                          initial={
                            reduceMotion
                              ? false
                              : { opacity: 0, y: -36 - index * 8 }
                          }
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.75,
                            ease,
                            delay: reduceMotion ? 0 : 0.08 + index * 0.1,
                          }}
                          onClick={() => playOnRight(clip)}
                          className={cn(
                            "overflow-hidden rounded-[16px] border bg-[#faf5ff] text-left transition hover:-translate-y-0.5",
                            activeClip?.id === clip.id
                              ? "border-[#8b5cf6] shadow-md"
                              : "border-transparent",
                          )}
                        >
                          <div className="aspect-video bg-black">
                            <video
                              className="h-full w-full object-contain"
                              src={clip.clipUrl}
                              muted
                              playsInline
                              preload="metadata"
                            />
                          </div>
                          <div className="p-2.5">
                            <p className="font-sans text-[9px] font-bold tracking-wide text-[#7c3aed] uppercase">
                              Viral · #{clip.rank ?? index + 1}
                              {clip.viralScore
                                ? ` · ${Math.round(clip.viralScore)}`
                                : ""}
                            </p>
                            <p className="mt-0.5 line-clamp-2 font-sans text-[11px] font-semibold text-[#111827]">
                              {clip.title}
                            </p>
                            <p className="mt-0.5 font-sans text-[9px] text-[#7a738c]">
                              {formatTs(clip.startSec)}–{formatTs(clip.endSec)}
                            </p>
                          </div>
                        </motion.button>
                      ))
                    ) : (
                      <div className="col-span-full flex items-center justify-center rounded-[16px] border border-dashed border-[#ddd6fe] bg-[#faf5ff]/70 px-4 py-10 text-center">
                        <p className="font-sans text-[12px] text-[#7a738c]">
                          {clipping
                            ? "Finding most-watched + viral clips…"
                            : "No AI clips yet — press Start AI clipping"}
                        </p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* Manual: Clipchamp-style — crops left-up, video, colorful timeline */
                <div className="mt-3 space-y-3">
                  {!readyTarget ? (
                    <div className="flex items-center justify-center rounded-[16px] border border-dashed border-[#ddd6fe] bg-[#faf5ff]/70 px-4 py-10 text-center">
                      <p className="font-sans text-[12px] text-[#7a738c]">
                        Select a Ready upload to open the full video editor.
                      </p>
                    </div>
                  ) : peakLoading ? (
                    <div className="flex items-center justify-center rounded-[16px] bg-gradient-to-br from-[#ede9fe] to-[#dbeafe] px-4 py-10">
                      <p className="font-sans text-[12px] text-[#5b21b6]">
                        Loading your full Cloudinary video…
                      </p>
                    </div>
                  ) : peakWindow ? (
                    <>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[108px_minmax(0,1fr)]">
                        {/* Left-upside crop bin */}
                        <div className="rounded-[16px] bg-gradient-to-b from-[#ede9fe] via-[#f5f3ff] to-[#dbeafe] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                          <p className="mb-1.5 px-0.5 font-sans text-[9px] font-bold tracking-wide text-[#7c3aed] uppercase">
                            Crops
                          </p>
                          <div className="flex max-h-[220px] flex-col gap-2 overflow-y-auto sm:max-h-[260px]">
                            <AnimatePresence initial={false}>
                              {draftCrops.length === 0 ? (
                                <motion.p
                                  key="empty"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="rounded-[12px] border border-dashed border-[#c4b5fd] bg-white/60 px-2 py-4 text-center font-sans text-[10px] leading-snug text-[#6b6680]"
                                >
                                  Crops float here after you add them
                                </motion.p>
                              ) : (
                                draftCrops.map((draft, index) => {
                                  return (
                                    <motion.button
                                      key={draft.id}
                                      type="button"
                                      layout
                                      initial={
                                        reduceMotion
                                          ? false
                                          : {
                                              opacity: 0,
                                              x: 40,
                                              y: 28,
                                              scale: 0.92,
                                            }
                                      }
                                      animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.9 }}
                                      transition={{ duration: 0.55, ease }}
                                      onClick={() => playDraftInCenter(draft)}
                                      className={cn(
                                        "overflow-hidden rounded-[12px] border-2 bg-white text-left shadow-sm transition",
                                        manualCenter === draft.id
                                          ? "border-[#8b5cf6] shadow-[0_8px_20px_rgba(139,92,246,0.35)]"
                                          : "border-white/80 hover:border-[#c4b5fd]",
                                      )}
                                    >
                                      <div className="relative overflow-hidden bg-black">
                                        <LetterboxPlayer
                                          src={draft.clipUrl}
                                          ratio={ratio}
                                          controls={false}
                                          muted
                                          className={
                                            ratio === "natural"
                                              ? "!rounded-none !max-h-none w-full"
                                              : "!rounded-none !max-h-[140px] !w-full !max-w-none"
                                          }
                                        />
                                        <span className="absolute top-1 left-1 z-10 rounded-[6px] bg-black/50 px-1.5 py-0.5 font-sans text-[8px] font-bold text-white">
                                          {index + 1}
                                        </span>
                                        <button
                                          type="button"
                                          className="absolute top-1 right-1 z-10 inline-flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
                                          aria-label="Remove crop"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setDraftCrops((prev) =>
                                              prev.filter(
                                                (d) => d.id !== draft.id,
                                              ),
                                            );
                                            setManualCenter((cur) =>
                                              cur === draft.id ? "full" : cur,
                                            );
                                          }}
                                        >
                                          <X className="h-3 w-3" />
                                        </button>
                                      </div>
                                      <div className="bg-white px-1.5 py-1">
                                        <p className="font-sans text-[9px] font-bold text-[#5b21b6]">
                                          Crop {index + 1}
                                        </p>
                                        <p className="font-sans text-[8px] text-[#7a738c]">
                                          {formatTs(draft.startSec)}–
                                          {formatTs(draft.endSec)}
                                        </p>
                                      </div>
                                    </motion.button>
                                  );
                                })
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        {/* Center player + filmstrip timeline */}
                        <div className="min-w-0">
                          <div
                            className={cn(
                              "overflow-hidden rounded-[16px] bg-[#0b0d14] ring-1 ring-[#c4b5fd]/40",
                              ratio !== "natural" && "flex justify-center p-3",
                            )}
                          >
                            <LetterboxPlayer
                              src={centerVideoSrc}
                              ratio={ratio}
                              videoRef={manualVideoRef}
                            />
                          </div>
                          <p className="mt-1.5 font-sans text-[10px] text-[#7a738c]">
                            {centerVideoLabel}
                            {ratio !== "natural"
                              ? " · letterbox (no crop)"
                              : ""}
                          </p>

                          <div className="mt-2 w-full">
                            <CapCutTrimBar
                              durationSec={windowDur}
                              startRel={trimStart}
                              endRel={trimEnd}
                              playheadRel={playhead}
                              cloudName={peakWindow.cloudName}
                              publicId={peakWindow.publicId}
                              onActivateTimeline={() => {
                                showFullVideoInCenter();
                              }}
                              cropMarkers={draftCrops.map((d, i) => ({
                                startRel: d.startRel,
                                endRel: d.endRel,
                                color:
                                  i === 0
                                    ? "#a78bfa"
                                    : i === 1
                                      ? "#8b5cf6"
                                      : "#818cf8",
                              }))}
                              onChange={({ startRel, endRel }) => {
                                setTrimStart(startRel);
                                setTrimEnd(endRel);
                              }}
                              onSeek={(rel) => {
                                showFullVideoInCenter();
                                setPlayhead(rel);
                                requestAnimationFrame(() => {
                                  const el = manualVideoRef.current;
                                  if (el) el.currentTime = rel;
                                });
                              }}
                            />
                          </div>

                          <div className="mt-2.5 flex flex-wrap gap-2">
                            <GradientButton
                              size="sm"
                              onClick={addDraftCrop}
                              leftIcon={<Plus className="h-3.5 w-3.5" />}
                            >
                              Add crop ({draftCrops.length})
                            </GradientButton>
                            <GradientButton
                              size="sm"
                              disabled={draftCrops.length < 1 || clipping}
                              onClick={() => void commitManualClips()}
                            >
                              {clipping
                                ? "Saving clips…"
                                : `Save ${draftCrops.length} clip${draftCrops.length === 1 ? "" : "s"}`}
                            </GradientButton>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="rounded-[14px] bg-[#fff0f3] px-3 py-3 font-sans text-[12px] text-[#9d2945]">
                      Full video unavailable. Re-select the upload or try again.
                    </div>
                  )}
                </div>
              )}

              {mode === "ai" ? (
                <div className="mt-3">
                  <GradientButton
                    size="sm"
                    disabled={!readyCount || busy || clipping}
                    onClick={() => void startAiClipping()}
                  >
                    {clipping
                      ? "Finding viral clips…"
                      : "Start AI clipping"}
                  </GradientButton>
                </div>
              ) : null}
              </div>
            </section>
          </DashboardMotion>
        </div>

        <DashboardMotion direction="right" delay={0.14}>
          <section className="rounded-[22px] bg-white p-3.5 shadow-[0_10px_28px_rgba(20,20,40,0.06)] sm:p-4">
            <h2 className="font-sans text-[13px] font-bold text-[#111827]">
              Recent uploads
            </h2>
            <div className="mt-2.5 max-h-[220px] space-y-2 overflow-y-auto pr-0.5">
              {rows.length === 0 ? (
                <p className="rounded-[14px] bg-[#faf5ff] px-3 py-3 font-sans text-[12px] text-[#7a738c]">
                  No uploads yet.
                </p>
              ) : (
                rows.map((item) => (
                  <article
                    key={item.id}
                    className={cn(
                      "flex cursor-pointer items-center justify-between gap-2 rounded-[14px] bg-[#faf5ff] px-2.5 py-2 transition",
                      selectedId === item.id &&
                        "bg-[#ede9fe]/90 ring-2 ring-[#8b5cf6]/45",
                    )}
                    onClick={() => {
                      if (item.id.startsWith("local-")) return;
                      setSelectedId(item.id);
                    }}
                  >
                    <div className="min-w-0">
                      <p className="truncate font-sans text-[11px] font-semibold text-[#111827]">
                        {item.name}
                      </p>
                      <p className="font-sans text-[9px] text-[#7a738c]">
                        {item.size}
                        {item.status === "Uploading" && item.progress != null
                          ? ` · ${item.progress}%`
                          : ""}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <span
                        className={
                          item.clipUrl
                            ? "rounded-[8px] bg-[#dcfce7] px-2 py-0.5 font-sans text-[9px] font-semibold text-[#15803d]"
                            : item.status === "Ready"
                              ? "rounded-[8px] bg-[#dcfce7] px-2 py-0.5 font-sans text-[9px] font-semibold text-[#15803d]"
                              : item.status === "Failed"
                                ? "rounded-[8px] bg-[#ffe4e6] px-2 py-0.5 font-sans text-[9px] font-semibold text-[#be123c]"
                                : "rounded-[8px] bg-[#ede9fe] px-2 py-0.5 font-sans text-[9px] font-semibold text-[#7c3aed]"
                        }
                      >
                        {item.clipUrl ? "Clips" : item.status}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          void removeFile(item.id);
                        }}
                        className="inline-flex h-6 w-6 items-center justify-center rounded-[8px] text-[#6b6680] hover:bg-white"
                        aria-label={`Remove ${item.name}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>

            {mode === "manual" ? (
              <div className="mt-3 rounded-[14px] bg-[#f5f3ff] px-3 py-3">
                <p className="font-sans text-[10px] font-bold tracking-wide text-[#7c3aed] uppercase">
                  Manual · {RATIO_LABEL[ratio]}
                </p>
                <p className="mt-1 font-sans text-[11px] text-[#6b6680]">
                  Center + crop cards follow your ratio (letterbox, never
                  cropped). Tap timeline for full video.
                </p>
              </div>
            ) : (
              <div className="mt-3">
                <p className="mb-2 font-sans text-[10px] font-bold tracking-wide text-[#7c3aed] uppercase">
                  Preview · {RATIOS.find((r) => r.id === ratio)?.label}
                </p>
                {activeClip?.clipUrl ? (
                  <>
                    <LetterboxPlayer
                      src={activeClip.clipUrl}
                      ratio={ratio}
                      videoRef={playerRef}
                    />
                    <p className="mt-2 line-clamp-2 font-sans text-[11px] font-semibold text-[#111827]">
                      {activeClip.title}
                    </p>
                  </>
                ) : (
                  <div className="flex aspect-video items-center justify-center rounded-[16px] bg-[#0b0d14] px-4 text-center">
                    <p className="font-sans text-[11px] text-white/55">
                      Tap an AI clip card to play here
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Export ratio + continue — bottom of Recent uploads */}
            <div className="mt-4 border-t border-[#ede9fe] pt-3">
              <p className="font-sans text-[11px] font-bold text-[#111827]">
                Export ratio
              </p>
              <p className="font-sans text-[10px] text-[#7a738c]">
                Black bars only — video is never cropped
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {RATIOS.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRatio(r.id)}
                    className={cn(
                      "rounded-[12px] px-2.5 py-1.5 font-sans text-[11px] font-semibold transition",
                      ratio === r.id
                        ? "bg-gradient-to-r from-[#a78bfa] via-[#8b5cf6] to-[#3b82f6] text-white"
                        : "bg-[#f5f3ff] text-[#5b21b6] hover:bg-[#ede9fe]",
                    )}
                    title={r.hint}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
              <GradientButton
                size="sm"
                fullWidth
                className="mt-3 from-[#6366f1] via-[#8b5cf6] to-[#a78bfa]"
                disabled={
                  mode === "ai" ? !resultClips.length : draftCrops.length === 0
                }
                onClick={continueToEditor}
              >
                Continue with editor
              </GradientButton>
            </div>
          </section>
        </DashboardMotion>
      </div>
    </div>
  );
}
