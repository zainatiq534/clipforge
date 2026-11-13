"use client";

import {
  Captions,
  Crop,
  Pause,
  Play,
  Redo2,
  SkipBack,
  SkipForward,
  Sparkles,
  Trash2,
  Type,
  Undo2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  EditorTimeline,
  TEXT_STYLE_MIME,
  type TimelineBlock,
} from "@/components/dashboard/EditorTimeline";
import { EditorLayoutSkeleton } from "@/components/dashboard/editor-layout-skeleton/EditorLayoutSkeleton";
import {
  EDITOR_BTN_ACCENT,
  EDITOR_BTN_GHOST,
} from "@/components/dashboard/editor/editorUi";
import {
  VideoOverlayBox,
  type OverlayTransform,
} from "@/components/dashboard/VideoOverlayBox";
import {
  CaptionPackPreviewCard,
  CaptionStyledText,
} from "@/components/dashboard/editor/CaptionStyledText";
import {
  TextStylePreviewCard,
  TextStyledOverlay,
} from "@/components/dashboard/editor/TextStyledOverlay";
import { GradientButton } from "@/components/ui/Button";
import {
  CAPTION_PACKS,
  CAPTION_PACK_FILTER_TAGS,
  filterCaptionPacks,
  getCaptionPack,
  styleFromPack,
} from "@/lib/caption";
import { ensureGoogleFont } from "@/lib/google-fonts";
import { cn } from "@/lib/cn";
import {
  TEXT_STYLE_FILTER_TAGS,
  TEXT_STYLE_PACKS,
  filterTextStylePacks,
  getTextStylePack,
} from "@/lib/textStyles";
import {
  exportCompositedClip,
  type ExportTextLayer,
} from "@/lib/exportCompositedClip";
import {
  EDITOR_CLIPS_KEY,
  downloadClipToDevice,
  generateEnglishCaptions,
  stashClipsForEditor,
  type ExportRatio,
  type ViralClip,
} from "@/lib/uploads";

const PLAYER_GHOST =
  "inline-flex h-8 w-8 items-center justify-center rounded-[10px] border border-white/20 bg-white/10 text-white transition hover:bg-white/20";
const PLAYER_ACCENT =
  "inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#a78bfa] via-[#8b5cf6] to-[#3b82f6] text-white shadow-[0_8px_18px_rgba(99,102,241,0.35)]";

type EditorTool = "text" | "captions" | "reframe";
type CaptionAlign = "left" | "center";

type CaptionLine = {
  id: string;
  startSec: number;
  endSec: number;
  text: string;
  xPct: number;
  yPct: number;
  scale: number;
  /** % of video width — side-handle drag controls wrap */
  widthPct: number;
};

type TextOverlay = {
  id: string;
  styleId: string;
  label: string;
  text: string;
  startSec: number;
  endSec: number;
  xPct: number;
  yPct: number;
  scale: number;
  widthPct: number;
};

type LayerSnapshot = {
  textOverlays: TextOverlay[];
  captions: CaptionLine[];
};

const HISTORY_LIMIT = 40;

const TOOLS: {
  id: EditorTool;
  label: string;
  icon: typeof Type;
}[] = [
  { id: "text", label: "Text", icon: Type },
  { id: "captions", label: "Captions", icon: Captions },
  { id: "reframe", label: "Crop", icon: Crop },
];

const RATIO_LABEL: Record<ExportRatio, string> = {
  natural: "Natural",
  "yt-shorts": "YT Shorts 9:16",
  instagram: "Insta Reel 9:16",
  tiktok: "TikTok 9:16",
};

function formatClock(sec: number) {
  const total = Math.max(0, sec);
  const m = Math.floor(total / 60);
  const s = Math.floor(total % 60);
  const cs = Math.floor((total % 1) * 100);
  return `${m}:${String(s).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
}

function parseCloudinary(clipUrl: string, sourcePublicId?: string) {
  try {
    const u = new URL(clipUrl);
    const parts = u.pathname.split("/").filter(Boolean);
    // /cloudName/video/upload/.../publicId.ext
    const cloudName = parts[0];
    const uploadIdx = parts.findIndex((p) => p === "upload");
    let publicId = sourcePublicId;
    if (!publicId && uploadIdx >= 0) {
      const after = parts.slice(uploadIdx + 1);
      const file = after[after.length - 1] ?? "";
      const maybeTransforms = after.length > 1 && after[0]?.includes(",");
      const idParts = maybeTransforms ? after.slice(1) : after;
      publicId = idParts.join("/").replace(/\.[^.]+$/, "");
    }
    if (cloudName && publicId) return { cloudName, publicId };
  } catch {
    // ignore
  }
  return { cloudName: undefined as string | undefined, publicId: sourcePublicId };
}

export function EditorPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [clips, setClips] = useState<ViralClip[]>([]);
  const [uploadId, setUploadId] = useState<string | undefined>();
  const [draftRatio, setDraftRatio] = useState<ExportRatio>("natural");
  const [appliedRatio, setAppliedRatio] = useState<ExportRatio>("natural");
  const [ratioFlash, setRatioFlash] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<EditorTool>("text");
  const [captionAlign, setCaptionAlign] = useState<CaptionAlign>("center");
  const [captions, setCaptions] = useState<CaptionLine[]>([]);
  const [captionsVisible, setCaptionsVisible] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [captionError, setCaptionError] = useState<string | null>(null);
  const [activeCaptionPackId, setActiveCaptionPackId] = useState("ali-abdaal");
  const [captionPackTag, setCaptionPackTag] = useState<string>("All");

  const visibleCaptionPacks = useMemo(
    () => filterCaptionPacks(CAPTION_PACKS, "", captionPackTag),
    [captionPackTag],
  );
  const [textStyleTag, setTextStyleTag] = useState<string>("All");
  const visibleTextStyles = useMemo(
    () => filterTextStylePacks(TEXT_STYLE_PACKS, "", textStyleTag),
    [textStyleTag],
  );
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [activeTextStyle, setActiveTextStyle] = useState<string>("creator");
  const [past, setPast] = useState<LayerSnapshot[]>([]);
  const [future, setFuture] = useState<LayerSnapshot[]>([]);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [exportProgress, setExportProgress] = useState(0);

  const layersRef = useRef<LayerSnapshot>({ textOverlays: [], captions: [] });
  layersRef.current = { textOverlays, captions };
  const editHistoryArmed = useRef(false);

  useEffect(() => {
    if (activeTool !== "text") return;
    for (const pack of visibleTextStyles.slice(0, 24)) {
      ensureGoogleFont(pack.style.fontFamily);
    }
  }, [activeTool, visibleTextStyles]);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(EDITOR_CLIPS_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        clips?: ViralClip[];
        ratio?: ExportRatio;
        uploadId?: string;
      };
      if (parsed.clips?.length) {
        setClips(parsed.clips);
        setActiveId(parsed.clips[0]?.id ?? null);
      }
      if (parsed.ratio) {
        setDraftRatio(parsed.ratio);
        setAppliedRatio(parsed.ratio);
      }
      if (parsed.uploadId) setUploadId(parsed.uploadId);
    } catch {
      // ignore
    }
  }, []);

  const active = useMemo(
    () => clips.find((c) => c.id === activeId) ?? clips[0] ?? null,
    [clips, activeId],
  );

  const cloud = useMemo(() => {
    if (!active?.clipUrl) return { cloudName: undefined, publicId: undefined };
    return parseCloudinary(active.clipUrl, active.sourcePublicId);
  }, [active]);

  const vertical = appliedRatio !== "natural";
  const clipDuration =
    duration ||
    Math.max(1, (active?.endSec ?? 12) - (active?.startSec ?? 0));

  const snapshotLayers = useCallback(
    (): LayerSnapshot => ({
      textOverlays: layersRef.current.textOverlays.map((t) => ({ ...t })),
      captions: layersRef.current.captions.map((c) => ({ ...c })),
    }),
    [],
  );

  const pushHistory = useCallback(() => {
    setPast((p) => [...p.slice(-(HISTORY_LIMIT - 1)), snapshotLayers()]);
    setFuture([]);
  }, [snapshotLayers]);

  const applySnapshot = useCallback((snap: LayerSnapshot) => {
    setTextOverlays(snap.textOverlays.map((t) => ({ ...t })));
    setCaptions(snap.captions.map((c) => ({ ...c })));
    setSelectedBlockId(null);
  }, []);

  const undo = useCallback(() => {
    setPast((p) => {
      if (!p.length) return p;
      const prev = p[p.length - 1]!;
      setFuture((f) => [snapshotLayers(), ...f].slice(0, HISTORY_LIMIT));
      applySnapshot(prev);
      return p.slice(0, -1);
    });
  }, [applySnapshot, snapshotLayers]);

  const redo = useCallback(() => {
    setFuture((f) => {
      if (!f.length) return f;
      const next = f[0]!;
      setPast((p) => [...p, snapshotLayers()].slice(-HISTORY_LIMIT));
      applySnapshot(next);
      return f.slice(1);
    });
  }, [applySnapshot, snapshotLayers]);

  const deleteSelected = useCallback(
    (id?: string) => {
      const targetId = id ?? selectedBlockId;
      if (!targetId) return;
      const isText = textOverlays.some((t) => t.id === targetId);
      const isCap = captions.some((c) => c.id === targetId);
      if (!isText && !isCap) return;
      pushHistory();
      if (isText) {
        setTextOverlays((prev) => prev.filter((t) => t.id !== targetId));
      }
      if (isCap) {
        setCaptions((prev) => prev.filter((c) => c.id !== targetId));
      }
      setSelectedBlockId(null);
    },
    [captions, pushHistory, selectedBlockId, textOverlays],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === "z" && !e.shiftKey) {
        if (typing) return;
        e.preventDefault();
        undo();
        return;
      }
      if (
        (mod && e.key.toLowerCase() === "y") ||
        (mod && e.shiftKey && e.key.toLowerCase() === "z")
      ) {
        if (typing) return;
        e.preventDefault();
        redo();
        return;
      }
      if ((e.key === "Delete" || e.key === "Backspace") && selectedBlockId) {
        if (typing) return;
        e.preventDefault();
        deleteSelected();
      }
      if (e.key === " " || e.code === "Space") {
        if (typing) return;
        e.preventDefault();
        const v = videoRef.current;
        if (!v) return;
        if (v.paused) void v.play();
        else v.pause();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [deleteSelected, redo, selectedBlockId, undo]);

  const persistEditor = useCallback(
    (nextRatio: ExportRatio) => {
      if (!clips.length) return;
      stashClipsForEditor({ clips, ratio: nextRatio, uploadId });
    },
    [clips, uploadId],
  );

  const applyRatio = () => {
    setAppliedRatio(draftRatio);
    persistEditor(draftRatio);
    setRatioFlash(true);
    window.setTimeout(() => setRatioFlash(false), 1400);
  };

  const selectClip = (id: string) => {
    setActiveId(id);
    setCurrentTime(0);
    setCaptions([]);
    setTextOverlays([]);
    setSelectedBlockId(null);
    setPast([]);
    setFuture([]);
    setPlaying(false);
  };

  const exportClip = useCallback(async () => {
    if (!active?.clipUrl) {
      setExportError("Select a clip with video before exporting.");
      return;
    }
    setExporting(true);
    setExportProgress(0);
    setExportError(null);
    const wasPlaying = !videoRef.current?.paused;
    try {
      // Prefer the ratio currently selected in Crop; fall back to applied preview.
      const exportRatio = draftRatio || appliedRatio;
      if (exportRatio !== appliedRatio) {
        setAppliedRatio(exportRatio);
        persistEditor(exportRatio);
      }

      const layers: ExportTextLayer[] = [
        ...textOverlays.map((t) => ({
          kind: "text" as const,
          startSec: t.startSec,
          endSec: t.endSec,
          text: t.text,
          xPct: t.xPct,
          yPct: t.yPct,
          scale: t.scale,
          widthPct: t.widthPct,
          styleId: t.styleId,
        })),
        ...captions.map((c) => ({
          kind: "caption" as const,
          startSec: c.startSec,
          endSec: c.endSec,
          text: c.text,
          xPct: c.xPct,
          yPct: c.yPct,
          scale: c.scale,
          widthPct: c.widthPct,
          captionPackId: activeCaptionPackId,
          align: captionAlign,
        })),
      ];

      const label =
        active.title?.trim() ||
        active.hook?.trim() ||
        `clipforge-short-${clips.findIndex((c) => c.id === active.id) + 1 || 1}`;

      // Pause editor preview while we composite a separate export player.
      videoRef.current?.pause();
      setSelectedBlockId(null);

      try {
        await exportCompositedClip({
          videoUrl: active.clipUrl,
          fileName: label,
          ratio: exportRatio,
          durationSec: clipDuration,
          layers,
          onProgress: setExportProgress,
        });
      } catch (compositeErr) {
        // CORS / codec fallback: still export ratio-baked file without overlays.
        if (layers.length) {
          setExportError(
            "Could not burn captions/text into the file (browser security). Downloading ratio-only version…",
          );
        }
        await downloadClipToDevice({
          url: active.clipUrl,
          fileName: label,
          ratio: exportRatio,
        });
        if (!layers.length) {
          throw compositeErr;
        }
      }
    } catch (err) {
      setExportError(
        err instanceof Error ? err.message : "Could not export this clip.",
      );
    } finally {
      setExporting(false);
      setExportProgress(0);
      if (wasPlaying) void videoRef.current?.play().catch(() => undefined);
    }
  }, [
    active,
    clips,
    draftRatio,
    appliedRatio,
    persistEditor,
    textOverlays,
    captions,
    activeCaptionPackId,
    captionAlign,
    clipDuration,
  ]);

  const generateCaptions = async () => {
    if (!active?.clipUrl) {
      setCaptionError("Select a clip with video before generating captions.");
      return;
    }
    setGenerating(true);
    setCaptionError(null);
    setActiveTool("captions");
    try {
      const { captions: lines } = await generateEnglishCaptions(active.clipUrl);
      if (!lines.length) {
        setCaptions([]);
        setCaptionError(
          "No speech detected in this clip's audio. Try another clip with clearer talking.",
        );
        return;
      }
      const dur = Math.max(
        1,
        videoRef.current?.duration && Number.isFinite(videoRef.current.duration)
          ? videoRef.current.duration
          : clipDuration,
      );
      const stamp = Date.now();
      const pack = getCaptionPack(activeCaptionPackId);
      const packStyle = pack ? styleFromPack(pack) : null;
      const yPct = packStyle?.yPercent ?? 78;
      const xPct = packStyle?.xPercent ?? 50;
      // Backend already returns short timed English lines — map 1:1 onto video + Caps track
      const packed: CaptionLine[] = lines
        .map((line, i) => {
          const text = line.text.trim();
          if (!text) return null;
          const startSec = Math.max(
            0,
            Math.min(Math.round(line.startSec * 10) / 10, Math.max(0, dur - 0.4)),
          );
          const endSec = Math.max(
            startSec + 0.4,
            Math.min(Math.round(line.endSec * 10) / 10, dur),
          );
          return {
            id: `cap-${i}-${stamp}`,
            startSec,
            endSec,
            text,
            xPct,
            yPct,
            scale: 1,
            widthPct: 72,
          };
        })
        .filter((c): c is CaptionLine => Boolean(c));
      if (!packed.length) {
        setCaptions([]);
        setCaptionError(
          "No English speech lines returned. Try another clip with clearer audio.",
        );
        return;
      }
      pushHistory();
      setCaptions(packed);
      setCaptionsVisible(true);
      setActiveTool("captions");
      setSelectedBlockId(packed[0]?.id ?? null);
      setCurrentTime(0);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        void videoRef.current.play().catch(() => undefined);
      }
    } catch (err) {
      setCaptionError(
        err instanceof Error
          ? err.message
          : "Could not generate English captions.",
      );
    } finally {
      setGenerating(false);
    }
  };

  const addTextStyle = (styleId: string, atSec?: number) => {
    const pack = getTextStylePack(styleId) ?? getTextStylePack("plain");
    if (!pack) return;
    ensureGoogleFont(pack.style.fontFamily);
    setActiveTextStyle(pack.id);
    const len = 2.5;
    const rawStart =
      atSec != null
        ? atSec
        : Math.min(currentTime, Math.max(0, clipDuration - 1));
    const start =
      Math.round(
        Math.min(Math.max(0, rawStart), Math.max(0, clipDuration - 0.5)) * 10,
      ) / 10;
    const end = Math.round(Math.min(clipDuration, start + len) * 10) / 10;
    const overlay: TextOverlay = {
      id: `txt-${Date.now()}`,
      styleId: pack.id,
      label: pack.label,
      text: pack.label,
      startSec: start,
      endSec: Math.max(start + 0.4, end),
      xPct: 50,
      yPct: 28,
      scale: 1,
      widthPct: 70,
    };
    pushHistory();
    // Replace previous text — only the newest style stays on screen
    setTextOverlays([overlay]);
    setSelectedBlockId(overlay.id);
    setActiveTool("text");
  };

  const updateOverlayTransform = (
    kind: "text" | "caption",
    id: string,
    next: OverlayTransform,
  ) => {
    if (kind === "text") {
      setTextOverlays((prev) =>
        prev.map((t) =>
          t.id === id
            ? {
                ...t,
                xPct: next.xPct,
                yPct: next.yPct,
                scale: next.scale,
                widthPct: next.widthPct,
              }
            : t,
        ),
      );
    } else {
      // Captions share place + size + wrap width; timing stays per line
      setCaptions((prev) =>
        prev.map((c) => ({
          ...c,
          xPct: next.xPct,
          yPct: next.yPct,
          scale: next.scale,
          widthPct: next.widthPct,
        })),
      );
    }
  };

  const moveTextBlock = (blockId: string, startSec: number) => {
    pushHistory();
    setTextOverlays((prev) =>
      prev.map((t) => {
        if (t.id !== blockId) return t;
        const len = Math.max(0.4, t.endSec - t.startSec);
        const start =
          Math.round(
            Math.min(Math.max(0, startSec), Math.max(0, clipDuration - 0.4)) *
              10,
          ) / 10;
        const end = Math.round(Math.min(clipDuration, start + len) * 10) / 10;
        return { ...t, startSec: start, endSec: Math.max(start + 0.4, end) };
      }),
    );
    setSelectedBlockId(blockId);
  };

  const resizeTimelineBlock = (
    track: "text" | "caption",
    blockId: string,
    next: { startSec: number; endSec: number },
  ) => {
    if (track === "text") {
      setTextOverlays((prev) =>
        prev.map((t) =>
          t.id === blockId
            ? { ...t, startSec: next.startSec, endSec: next.endSec }
            : t,
        ),
      );
    } else {
      setCaptions((prev) =>
        prev.map((c) =>
          c.id === blockId
            ? { ...c, startSec: next.startSec, endSec: next.endSec }
            : c,
        ),
      );
    }
    setSelectedBlockId(blockId);
  };

  const armEditHistory = () => {
    editHistoryArmed.current = false;
  };

  const updateTextContent = (id: string, text: string) => {
    if (!editHistoryArmed.current) {
      pushHistory();
      editHistoryArmed.current = true;
    }
    setTextOverlays((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text } : t)),
    );
  };

  const updateCaptionContent = (id: string, text: string) => {
    if (!editHistoryArmed.current) {
      pushHistory();
      editHistoryArmed.current = true;
    }
    setCaptions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, text } : c)),
    );
  };

  const selectedText = textOverlays.find((t) => t.id === selectedBlockId);
  const selectedCaption = captions.find((c) => c.id === selectedBlockId);
  const hasSelection = Boolean(selectedText || selectedCaption);
  const canUndo = past.length > 0;
  const canRedo = future.length > 0;
  const selectTimelineBlock = (id: string | null) => {
    setSelectedBlockId(id);
    if (!id) return;
    videoRef.current?.pause();
    const cap = captions.find((c) => c.id === id);
    if (cap) {
      setActiveTool("captions");
      onSeek(cap.startSec + 0.05);
      return;
    }
    const txt = textOverlays.find((t) => t.id === id);
    if (txt) {
      setActiveTool("text");
      onSeek(txt.startSec + 0.05);
    }
  };

  const liveCaption = useMemo(() => {
    if (!captionsVisible || !captions.length) return null;
    // Only show the sentence that matches the current audio time
    return (
      captions.find(
        (l) => currentTime >= l.startSec && currentTime <= l.endSec + 0.12,
      ) ?? null
    );
  }, [captions, captionsVisible, currentTime]);

  /** While paused, keep the selected caption on-screen for move/resize */
  const overlayCaption = useMemo(() => {
    if (!captionsVisible) return null;
    if (playing) return liveCaption;
    if (selectedCaption) return selectedCaption;
    return liveCaption;
  }, [captionsVisible, playing, selectedCaption, liveCaption]);

  const liveText = useMemo(() => {
    return (
      textOverlays.find(
        (t) => currentTime >= t.startSec && currentTime < t.endSec,
      ) ?? null
    );
  }, [textOverlays, currentTime]);

  const liveTextPack = liveText
    ? getTextStylePack(liveText.styleId)
    : undefined;

  const textBlocks: TimelineBlock[] = textOverlays.map((t) => ({
    id: t.id,
    label: t.text || t.label,
    startSec: t.startSec,
    endSec: t.endSec,
  }));

  const captionBlocks: TimelineBlock[] = captions.map((c) => {
    const startSec = Math.max(0, Math.min(c.startSec, clipDuration));
    const endSec = Math.max(
      startSec + 0.4,
      Math.min(c.endSec, clipDuration),
    );
    return {
      id: c.id,
      label: c.text.trim(),
      startSec,
      endSec,
    };
  });

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  };

  const seekBy = (delta: number) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.max(0, Math.min(clipDuration, v.currentTime + delta));
  };

  const onSeek = (sec: number) => {
    const v = videoRef.current;
    if (v) v.currentTime = sec;
    setCurrentTime(sec);
  };

  const placeholderClips: Array<{
    id: string;
    title: string;
    startSec: number;
    endSec: number;
    clipUrl: string;
  }> = [
    { id: "A", title: "Clip A", startSec: 12, endSec: 38, clipUrl: "" },
    { id: "B", title: "Clip B", startSec: 62, endSec: 87, clipUrl: "" },
    { id: "C", title: "Clip C", startSec: 134, endSec: 161, clipUrl: "" },
  ];

  const clipCards = clips.length ? clips : placeholderClips;

  return (
    <EditorLayoutSkeleton
      landscape={!vertical}
      title={
        <div className="min-w-0">
          <p className="ed-panel-label">Studio</p>
          <h1 className="truncate font-sans text-[15px] font-bold text-[var(--ed-text-1)]">
            Clip editor
          </h1>
        </div>
      }
      headerRight={
        <>
          <div className="flex max-w-[min(100%,28rem)] flex-wrap items-center justify-end gap-1.5 overflow-y-auto">
            {clipCards.map((clip, index) => {
              const selected = active?.id === clip.id;
              return (
                <button
                  key={clip.id}
                  type="button"
                  onClick={() => {
                    if ("clipUrl" in clip && clip.clipUrl) selectClip(clip.id);
                  }}
                  className={cn(
                    "rounded-[10px] px-2.5 py-1.5 font-sans text-[11px] font-semibold transition",
                    selected
                      ? "bg-gradient-to-r from-[#a78bfa] via-[#8b5cf6] to-[#3b82f6] text-white"
                      : "bg-[#f5f3ff] text-[#5b21b6] hover:bg-[#ede9fe]",
                  )}
                >
                  Short {index + 1}
                </button>
              );
            })}
          </div>
          <div className="flex flex-col items-end gap-1">
            <GradientButton
              size="sm"
              disabled={exporting || !active?.clipUrl}
              onClick={() => void exportClip()}
              title={`Export as ${RATIO_LABEL[draftRatio || appliedRatio]} with captions/text`}
            >
              {exporting
                ? `Exporting ${exportProgress || 1}%…`
                : "Export clip"}
            </GradientButton>
            {exportError ? (
              <p className="max-w-[14rem] text-right font-sans text-[10px] font-medium text-red-600">
                {exportError}
              </p>
            ) : null}
          </div>
        </>
      }
      modeTabs={TOOLS.map((tool) => (
        <button
          key={tool.id}
          type="button"
          className="editor-mode-tab"
          data-active={activeTool === tool.id}
          onClick={() => setActiveTool(tool.id)}
        >
          {tool.label}
        </button>
      ))}
      work={
        <>
          <div className="flex h-10 shrink-0 items-center border-b border-[var(--ed-line)] px-3">
            <h2 className="ed-panel-label">{TOOLS.find((t) => t.id === activeTool)?.label}</h2>
          </div>
          <div className="silk-scroll min-h-0 flex-1 overflow-y-auto p-3">
            {activeTool === "text" && (
              <>
                <h2 className="font-sans text-[14px] font-extrabold text-[var(--ed-text-1)]">
                  Text styles
                </h2>
                <p className="mt-1 font-sans text-[11px] text-[var(--ed-text-2)]">
                  Lykhaari-style fonts · sizes · shapes · colors. Drag onto the
                  Text track or click to add at the playhead.
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {TEXT_STYLE_FILTER_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setTextStyleTag(tag)}
                      className={cn(
                        "rounded-full px-2 py-0.5 font-sans text-[10px] font-semibold transition",
                        textStyleTag === tag
                          ? "bg-[#8b5cf6] text-white"
                          : "bg-white/80 text-[#5b21b6]",
                      )}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 pr-0.5">
                  {visibleTextStyles.map((pack) => (
                    <TextStylePreviewCard
                      key={pack.id}
                      pack={pack}
                      selected={activeTextStyle === pack.id}
                      onSelect={() => addTextStyle(pack.id)}
                      onDragStart={(e) => {
                        e.dataTransfer.setData(TEXT_STYLE_MIME, pack.id);
                        e.dataTransfer.setData("text/plain", pack.id);
                        e.dataTransfer.effectAllowed = "copy";
                        setActiveTextStyle(pack.id);
                        ensureGoogleFont(pack.style.fontFamily);
                      }}
                    />
                  ))}
                </div>
                {selectedText ? (
                  <div className="mt-3 rounded-[14px] bg-[var(--ed-raised)] p-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-sans text-[10px] font-bold text-[var(--ed-accent)]">
                        {getTextStylePack(selectedText.styleId)?.label ??
                          "Selected text"}
                      </p>
                      <button
                        type="button"
                        onClick={() => deleteSelected()}
                        className="inline-flex items-center gap-1 rounded-[10px] bg-[#fee2e2] px-2 py-1 font-sans text-[10px] font-bold text-[#b91c1c]"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    </div>
                    <input
                      value={selectedText.text}
                      onFocus={armEditHistory}
                      onChange={(e) =>
                        updateTextContent(selectedText.id, e.target.value)
                      }
                      className="mt-1.5 w-full rounded-[10px] border border-[var(--ed-line)] bg-[var(--ed-field)] px-2.5 py-2 font-sans text-[12px] font-semibold text-[var(--ed-text-1)] outline-none focus:border-[#8b5cf6]"
                    />
                  </div>
                ) : null}
              </>
            )}

            {activeTool === "captions" && (
              <>
                <h2 className="font-sans text-[16px] font-extrabold text-[var(--ed-text-1)]">
                  Captions
                </h2>
                <p className="mt-1 font-sans text-[12px] text-[var(--ed-text-2)]">
                  Generate with Whisper · pick a caption pack · drag Caps to
                  crop.
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCaptionAlign("left")}
                    className={cn(
                      "rounded-[10px] px-2.5 py-1.5 font-sans text-[11px] font-semibold transition duration-150",
                      captionAlign === "left"
                        ? "bg-[var(--ed-field)] text-[var(--ed-text-2)] shadow-sm"
                        : "bg-[var(--ed-raised)] text-[var(--ed-text-2)]/80",
                    )}
                  >
                    Left
                  </button>
                  <button
                    type="button"
                    onClick={() => setCaptionAlign("center")}
                    className={cn(
                      "rounded-[10px] px-2.5 py-1.5 font-sans text-[11px] font-semibold transition duration-150",
                      captionAlign === "center"
                        ? "bg-[var(--ed-field)] text-[var(--ed-text-2)] shadow-sm"
                        : "bg-[var(--ed-raised)] text-[var(--ed-text-2)]/80",
                    )}
                  >
                    Center
                  </button>
                  <button
                    type="button"
                    onClick={() => setCaptionsVisible((v) => !v)}
                    className="rounded-[10px] bg-[var(--ed-field)] px-2.5 py-1.5 font-sans text-[11px] font-semibold text-[var(--ed-text-2)] shadow-sm"
                  >
                    {captionsVisible ? "Visible" : "Hidden"}
                  </button>
                </div>

                <div className="mt-4">
                  <p className="font-sans text-[10px] font-bold tracking-wide text-[var(--ed-accent)] uppercase">
                    Caption styles
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {CAPTION_PACK_FILTER_TAGS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setCaptionPackTag(tag)}
                        className={cn(
                          "rounded-full px-2 py-0.5 font-sans text-[10px] font-semibold transition",
                          captionPackTag === tag
                            ? "bg-[#8b5cf6] text-white"
                            : "bg-[var(--ed-raised)] text-[var(--ed-text-2)]",
                        )}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 grid max-h-[220px] grid-cols-2 gap-1.5 overflow-y-auto pr-0.5">
                    {visibleCaptionPacks.map((pack) => (
                      <CaptionPackPreviewCard
                        key={pack.id}
                        pack={pack}
                        selected={activeCaptionPackId === pack.id}
                        onSelect={() => {
                          setActiveCaptionPackId(pack.id);
                          const next = styleFromPack(pack);
                          setCaptionAlign(
                            next.align === "left" ? "left" : "center",
                          );
                          setCaptions((prev) =>
                            prev.map((c) => ({
                              ...c,
                              xPct: next.xPercent ?? c.xPct,
                              yPct: next.yPercent ?? c.yPct,
                            })),
                          );
                        }}
                      />
                    ))}
                  </div>
                </div>
                {selectedCaption ? (
                  <div className="mt-3 rounded-[12px] bg-[var(--ed-raised)] p-2.5 shadow-sm ring-1 ring-[#ddd6fe]">
                    <p className="font-sans text-[10px] font-bold tracking-wide text-[var(--ed-accent)] uppercase">
                      Selected caption
                    </p>
                    <p className="mt-1.5 font-sans text-[11px] leading-snug text-[var(--ed-text-2)]/80">
                      On video: corner dots resize · side dots widen/narrow to
                      keep one line or wrap to two.
                    </p>
                  </div>
                ) : null}
                <div className="mt-3 space-y-2">
                  {captions.length === 0 ? (
                    <p className="rounded-[12px] border border-dashed border-[var(--ed-line-strong)] bg-[var(--ed-raised)] px-3 py-4 text-center font-sans text-[12px] font-semibold text-[var(--ed-text-2)]">
                      No captions yet — generate to fill the track.
                    </p>
                  ) : (
                    captions.map((line) => {
                      const selected = selectedBlockId === line.id;
                      return (
                        <div
                          key={line.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => selectTimelineBlock(line.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              selectTimelineBlock(line.id);
                            }
                          }}
                          className={cn(
                            "group rounded-[12px] bg-[var(--ed-field)] px-2.5 py-2 shadow-sm transition duration-150",
                            selected
                              ? "ring-2 ring-[var(--ed-accent)] shadow-[0_0_0_3px_rgba(139,92,246,0.2)]"
                              : "hover:bg-[var(--ed-field)]",
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="rounded-md bg-[var(--ed-raised)] px-1.5 py-0.5 font-sans text-[11px] font-bold tabular-nums text-[var(--ed-accent)]">
                              {formatClock(line.startSec)} –{" "}
                              {formatClock(line.endSec)}
                            </span>
                            <button
                              type="button"
                              aria-label="Delete caption"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteSelected(line.id);
                              }}
                              className={cn(
                                "inline-flex items-center gap-1 rounded-[8px] bg-[#fee2e2] px-2 py-1 font-sans text-[10px] font-bold text-[#b91c1c] transition duration-150",
                                selected
                                  ? "opacity-100"
                                  : "opacity-0 group-hover:opacity-100",
                              )}
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </button>
                          </div>
                          <textarea
                            rows={1}
                            value={line.text}
                            onFocus={() => {
                              selectTimelineBlock(line.id);
                              armEditHistory();
                            }}
                            onChange={(e) => {
                              updateCaptionContent(line.id, e.target.value);
                              const el = e.currentTarget;
                              el.style.height = "auto";
                              el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
                            }}
                            ref={(el) => {
                              if (!el) return;
                              el.style.height = "auto";
                              el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="mt-1.5 max-h-[120px] w-full overflow-hidden rounded-[10px] border border-[var(--ed-line)] bg-[#faf8ff] px-2 py-1.5 font-sans text-[14px] leading-snug font-semibold text-[var(--ed-text-1)] outline-none focus:border-[#8b5cf6]"
                          />
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}

            {activeTool === "reframe" && (
              <>
                <h2 className="font-sans text-[16px] font-extrabold text-[var(--ed-text-1)]">
                  Crop · Ratio
                </h2>
                <p className="mt-1 font-sans text-[12px] text-[var(--ed-text-2)]">
                  Select a ratio, then Apply. Letterbox only — never cropped.
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(
                    [
                      "yt-shorts",
                      "instagram",
                      "tiktok",
                      "natural",
                    ] as ExportRatio[]
                  ).map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setDraftRatio(id)}
                      className={cn(
                        "rounded-[10px] px-2.5 py-1.5 font-sans text-[11px] font-semibold",
                        draftRatio === id
                          ? "bg-[var(--ed-field)] text-[var(--ed-text-2)] shadow-sm"
                          : "bg-[var(--ed-raised)]/60 text-[var(--ed-text-2)]/80",
                      )}
                    >
                      {RATIO_LABEL[id].split(" ")[0]}
                    </button>
                  ))}
                </div>
                {draftRatio !== appliedRatio ? (
                  <p className="mt-2 font-sans text-[11px] font-semibold text-[var(--ed-accent)]">
                    Pending: {RATIO_LABEL[draftRatio]}
                  </p>
                ) : ratioFlash ? (
                  <p className="mt-2 font-sans text-[11px] font-semibold text-[var(--ed-text-2)]">
                    Applied {RATIO_LABEL[appliedRatio]}
                  </p>
                ) : null}
                <button
                  type="button"
                  className={cn(EDITOR_BTN_ACCENT, "mt-3 w-full")}
                  disabled={draftRatio === appliedRatio}
                  onClick={applyRatio}
                >
                  {draftRatio === appliedRatio
                    ? "Ratio applied"
                    : "Apply reframe"}
                </button>
              </>
            )}
            </div>
            {activeTool === "captions" ? (
              <div className="shrink-0 border-t border-[#ddd6fe] bg-white/70 p-3">
                {captionError ? (
                  <p className="mb-2 font-sans text-[11px] font-semibold text-[#b91c1c]">
                    {captionError}
                  </p>
                ) : null}
                <button
                  type="button"
                  className={cn(EDITOR_BTN_ACCENT, "w-full")}
                  disabled={generating || !active?.clipUrl}
                  onClick={() => void generateCaptions()}
                >
                  {generating ? null : <Sparkles className="h-3.5 w-3.5" />}
                  {generating
                    ? "Transcribing…"
                    : "Generate English captions"}
                </button>
              </div>
            ) : null}
          </>
      }
      inspector={
        <div className="editor-inspector-body silk-scroll">
          <p className="ed-panel-label mb-2">Media</p>
          <p className="mb-2 font-sans text-[11px] text-[var(--ed-text-3)]">
            Select a short to load the preview.
          </p>
          <div className="mb-4 space-y-2">
            {clipCards.map((clip, i) => (
              <button
                key={clip.id}
                type="button"
                onClick={() => {
                  if ("clipUrl" in clip && clip.clipUrl) selectClip(clip.id);
                }}
                className={cn(
                  "w-full rounded-[12px] px-3 py-2.5 text-left font-sans text-[12px] font-semibold",
                  active?.id === clip.id
                    ? "bg-[var(--ed-accent)] text-[var(--ed-accent-ink)]"
                    : "bg-[var(--ed-raised)] text-[var(--ed-text-2)]",
                )}
              >
                Short {i + 1}
                <span className="mt-0.5 block truncate text-[10px] font-normal opacity-80">
                  {clip.title}
                </span>
              </button>
            ))}
          </div>

          {selectedText ? (
            <div className="rounded-[12px] bg-[var(--ed-raised)] p-2.5">
              <div className="flex items-center justify-between gap-2">
                <p className="font-sans text-[10px] font-bold text-[var(--ed-accent)]">
                  {getTextStylePack(selectedText.styleId)?.label ?? "Text"}
                </p>
                <button
                  type="button"
                  onClick={() => deleteSelected()}
                  className="inline-flex items-center gap-1 rounded-[8px] bg-[#fee2e2] px-2 py-1 font-sans text-[10px] font-bold text-[#b91c1c]"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </button>
              </div>
              <input
                value={selectedText.text}
                onFocus={armEditHistory}
                onChange={(e) =>
                  updateTextContent(selectedText.id, e.target.value)
                }
                className="mt-1.5 w-full rounded-[10px] border border-[var(--ed-line)] bg-[var(--ed-field)] px-2.5 py-2 font-sans text-[12px] font-semibold text-[var(--ed-text-1)] outline-none focus:border-[#8b5cf6]"
              />
            </div>
          ) : selectedCaption ? (
            <div className="rounded-[12px] bg-[var(--ed-raised)] p-2.5">
              <p className="font-sans text-[10px] font-bold text-[var(--ed-accent)]">
                Selected caption
              </p>
              <p className="mt-1 font-sans text-[11px] text-[var(--ed-text-2)]">
                Corner dots resize · side dots wrap lines.
              </p>
            </div>
          ) : null}
        </div>
      }
      previewHeader={
        <>
          <button
            type="button"
            aria-label="Undo"
            title="Undo (Ctrl+Z)"
            disabled={!canUndo}
            onClick={undo}
            className={cn(PLAYER_GHOST, "disabled:opacity-40")}
          >
            <Undo2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="Redo"
            title="Redo (Ctrl+Y)"
            disabled={!canRedo}
            onClick={redo}
            className={cn(PLAYER_GHOST, "disabled:opacity-40")}
          >
            <Redo2 className="h-3.5 w-3.5" />
          </button>
          {hasSelection ? (
            <button
              type="button"
              onClick={() => deleteSelected()}
              className="ml-auto inline-flex items-center gap-1 rounded-[8px] bg-[#3f1212] px-2.5 py-1 font-sans text-[10px] font-bold text-[#fca5a5]"
            >
              <Trash2 className="h-3 w-3" />
              Delete
            </button>
          ) : (
            <span className="ml-auto font-sans text-[10px] text-white/45">
              {RATIO_LABEL[appliedRatio]}
            </span>
          )}
        </>
      }
      previewStage={
        active?.clipUrl ? (
          <>
            <video
              key={`${active.clipUrl}-${appliedRatio}`}
              ref={videoRef}
              className="pointer-events-none h-full w-full object-contain"
              src={active.clipUrl}
              playsInline
              preload="auto"
              onTimeUpdate={() =>
                setCurrentTime(videoRef.current?.currentTime ?? 0)
              }
              onLoadedMetadata={() => {
                setDuration(videoRef.current?.duration || clipDuration);
                setCurrentTime(videoRef.current?.currentTime ?? 0);
              }}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            />
            {liveText && liveTextPack ? (
              <VideoOverlayBox
                id={liveText.id}
                selected={selectedBlockId === liveText.id}
                basePx={Math.max(
                  18,
                  Math.round((liveTextPack.style.fontSize ?? 36) * 0.55),
                )}
                transform={{
                  xPct: liveText.xPct,
                  yPct: liveText.yPct,
                  scale: liveText.scale,
                  widthPct: liveText.widthPct ?? 70,
                }}
                onSelect={() => {
                  setSelectedBlockId(liveText.id);
                  setActiveTool("text");
                }}
                onTransformStart={pushHistory}
                onTransform={(next) =>
                  updateOverlayTransform("text", liveText.id, next)
                }
              >
                <TextStyledOverlay
                  text={liveText.text}
                  styleId={liveText.styleId}
                />
              </VideoOverlayBox>
            ) : null}
            {overlayCaption ? (
              <VideoOverlayBox
                id={overlayCaption.id}
                selected={selectedBlockId === overlayCaption.id}
                basePx={Math.max(
                  16,
                  Math.round(
                    ((getCaptionPack(activeCaptionPackId)?.style.fontSize ??
                      36) *
                      0.7),
                  ),
                )}
                transform={{
                  xPct: overlayCaption.xPct,
                  yPct: overlayCaption.yPct,
                  scale: overlayCaption.scale,
                  widthPct: overlayCaption.widthPct ?? 72,
                }}
                onSelect={() => {
                  setSelectedBlockId(overlayCaption.id);
                  setActiveTool("captions");
                }}
                onTransformStart={pushHistory}
                onTransform={(next) =>
                  updateOverlayTransform(
                    "caption",
                    overlayCaption.id,
                    next,
                  )
                }
                chrome="caption"
                contentClassName={
                  captionAlign === "center" ? "text-center" : "text-left"
                }
              >
                <CaptionStyledText
                  text={overlayCaption.text}
                  packId={activeCaptionPackId}
                  cueKey={overlayCaption.id}
                />
              </VideoOverlayBox>
            ) : null}
          </>
        ) : (
          <p className="px-4 text-center font-sans text-[12px] text-white/70">
            Continue from Upload with 3 shorts to edit here
          </p>
        )
      }
      playerBar={
        <>
          <button
            type="button"
            aria-label="Back 1s"
            onClick={() => seekBy(-1)}
            className={PLAYER_GHOST}
          >
            <SkipBack className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label={playing ? "Pause" : "Play"}
            onClick={togglePlay}
            className={PLAYER_ACCENT}
          >
            {playing ? (
              <Pause className="h-3.5 w-3.5 fill-current" />
            ) : (
              <Play className="h-3.5 w-3.5 fill-current" />
            )}
          </button>
          <button
            type="button"
            aria-label="Forward 1s"
            onClick={() => seekBy(1)}
            className={PLAYER_GHOST}
          >
            <SkipForward className="h-3.5 w-3.5" />
          </button>
          <span className="ml-2 font-sans text-[11px] font-semibold tabular-nums text-white/80">
            {formatClock(currentTime)} / {formatClock(clipDuration)}
          </span>
        </>
      }
      timeline={
        <EditorTimeline
          embedded
          durationSec={clipDuration}
          playheadSec={currentTime}
          onSeek={onSeek}
          cloudName={cloud.cloudName}
          publicId={cloud.publicId}
          sourceOffsetSec={active?.startSec ?? 0}
          textBlocks={textBlocks}
          captionBlocks={captionBlocks}
          selectedBlockId={selectedBlockId}
          onSelectBlock={selectTimelineBlock}
          onDropTextStyle={addTextStyle}
          onMoveTextBlock={moveTextBlock}
          onResizeBlock={resizeTimelineBlock}
          onBlockGestureStart={pushHistory}
          onDeleteBlock={(id) => deleteSelected(id)}
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
          onGenerateCaptions={() => void generateCaptions()}
          generatingCaptions={generating}
        />
      }
    />
  );
}
