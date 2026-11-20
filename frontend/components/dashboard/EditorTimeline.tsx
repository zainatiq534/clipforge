"use client";

import { Minus, Plus, Redo2, StretchHorizontal, Undo2 } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { cn } from "@/lib/cn";
import { VideoFilmstrip } from "@/components/dashboard/VideoFilmstrip";
import { useVideoFrameStrip } from "@/lib/useVideoFrameStrip";

export const TEXT_STYLE_MIME = "application/x-clipforge-text-style";
export const TEXT_BLOCK_MIME = "application/x-clipforge-text-block";

export type TimelineBlock = {
  id: string;
  label: string;
  startSec: number;
  endSec: number;
  color?: string;
};

type EditorTimelineProps = {
  durationSec: number;
  playheadSec: number;
  onSeek: (sec: number) => void;
  cloudName?: string;
  publicId?: string;
  /** Playable clip URL (R2) — used to paint timeline frames when Cloudinary is gone */
  mediaUrl?: string;
  /** Absolute source offset when frames come from the long-form video */
  sourceOffsetSec?: number;
  textBlocks: TimelineBlock[];
  captionBlocks: TimelineBlock[];
  onSelectBlock?: (id: string | null) => void;
  selectedBlockId?: string | null;
  /** Drop a text style preset onto the text track at a time */
  onDropTextStyle?: (styleId: string, atSec: number) => void;
  /** Move an existing text block by its new start time */
  onMoveTextBlock?: (blockId: string, startSec: number) => void;
  /** Trim/extend text or caption duration from timeline edges */
  onResizeBlock?: (
    track: "text" | "caption",
    blockId: string,
    next: { startSec: number; endSec: number },
  ) => void;
  /** Called once when a trim/move gesture starts (for undo history) */
  onBlockGestureStart?: () => void;
  /** Delete selected text/caption clip */
  onDeleteBlock?: (blockId: string) => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  /** Flat chrome for nesting inside the preview card */
  embedded?: boolean;
  /** Dark studio chrome (Lykhaari-style editor) */
  tone?: "light" | "dark";
  /** Optional: click empty Caps track to generate captions */
  onGenerateCaptions?: () => void;
  generatingCaptions?: boolean;
  className?: string;
};

const MIN_ZOOM = 2;
const MAX_ZOOM = 28;
const DEFAULT_ZOOM = 8;
const DEFAULT_TEXT_LEN = 2.5;
const MIN_BLOCK_SEC = 0.4;

type EdgeDrag = {
  kind: "start" | "end" | "move";
  track: "text" | "caption";
  id: string;
  startSec: number;
  endSec: number;
  originX: number;
  historyPushed: boolean;
};

function formatTs(sec: number) {
  const total = Math.max(0, sec);
  const m = Math.floor(total / 60);
  const s = Math.floor(total % 60);
  const cs = Math.floor((total % 1) * 100);
  return `${m}:${String(s).padStart(2, "0")}.${String(cs).padStart(2, "0")}`;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function EditorTimeline({
  durationSec,
  playheadSec,
  onSeek,
  cloudName,
  publicId,
  mediaUrl,
  sourceOffsetSec = 0,
  textBlocks,
  captionBlocks,
  onSelectBlock,
  selectedBlockId,
  onDropTextStyle,
  onMoveTextBlock,
  onResizeBlock,
  onBlockGestureStart,
  onDeleteBlock,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  embedded = false,
  tone = "light",
  onGenerateCaptions,
  generatingCaptions = false,
  className,
}: EditorTimelineProps) {
  const dark = tone === "dark";
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const textTrackRef = useRef<HTMLDivElement>(null);
  const captionTrackRef = useRef<HTMLDivElement>(null);
  const edgeDrag = useRef<EdgeDrag | null>(null);
  const zoomRef = useRef(DEFAULT_ZOOM);
  const userScrollUntil = useRef(0);
  const panGesture = useRef<{
    pointerId: number;
    startX: number;
    startScroll: number;
    moved: boolean;
  } | null>(null);
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [panning, setPanning] = useState(false);
  const [dropHintSec, setDropHintSec] = useState<number | null>(null);
  const [dragOverText, setDragOverText] = useState(false);
  const [trimming, setTrimming] = useState(false);
  const [trimTip, setTrimTip] = useState<{
    x: number;
    y: number;
    label: string;
  } | null>(null);

  const safeDuration = Math.max(0.1, durationSec);
  const frameCount = Math.min(
    240,
    Math.max(24, Math.round(safeDuration * (4 + zoom * 0.55))),
  );

  const useCanvasStrip = Boolean(
    mediaUrl && (!cloudName || cloudName === "r2"),
  );

  const frames = useVideoFrameStrip({
    durationSec: safeDuration,
    frameCount,
    cloudName,
    publicId,
    // Canvas path owns R2 painting — skip data-URL capture here
    mediaUrl: useCanvasStrip ? undefined : mediaUrl,
    sourceOffsetSec:
      cloudName && cloudName !== "r2" ? sourceOffsetSec : 0,
    width: 120,
    height: 68,
  });

  const tickCount = Math.min(64, Math.max(8, Math.round(6 + zoom * 1.8)));
  const ticks = useMemo(
    () =>
      Array.from(
        { length: tickCount },
        (_, i) => (safeDuration * i) / Math.max(1, tickCount - 1),
      ),
    [safeDuration, tickCount],
  );

  const relFromClientX = useCallback(
    (clientX: number, el?: HTMLElement | null) => {
      const target = el ?? trackRef.current;
      if (!target) return 0;
      const rect = target.getBoundingClientRect();
      const pct = clamp((clientX - rect.left) / rect.width, 0, 1);
      return pct * safeDuration;
    },
    [safeDuration],
  );

  const setZoomAroundCursor = useCallback((next: number, clientX?: number) => {
    const scroller = scrollRef.current;
    const prev = zoomRef.current;
    const z = clamp(next, MIN_ZOOM, MAX_ZOOM);
    if (Math.abs(z - prev) < 0.001) return;

    if (scroller) {
      const rect = scroller.getBoundingClientRect();
      const cursorX =
        clientX != null ? clientX - rect.left : rect.width / 2;
      const contentX = scroller.scrollLeft + cursorX;
      const ratio = contentX / Math.max(1, scroller.scrollWidth);
      zoomRef.current = z;
      setZoom(z);
      requestAnimationFrame(() => {
        scroller.scrollLeft = Math.max(
          0,
          ratio * scroller.scrollWidth - cursorX,
        );
      });
    } else {
      zoomRef.current = z;
      setZoom(z);
    }
  }, []);

  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;

    const markUserScroll = () => {
      userScrollUntil.current = Date.now() + 900;
    };

    const onWheel = (e: WheelEvent) => {
      // Ctrl/Cmd + wheel → zoom
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        e.stopPropagation();
        const direction = e.deltaY < 0 ? 1 : -1;
        setZoomAroundCursor(
          zoomRef.current * (1 + direction * 0.12),
          e.clientX,
        );
        return;
      }

      // Vertical / trackpad scroll → smooth horizontal pan (CapCut-style)
      const dx =
        Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (dx === 0) return;
      e.preventDefault();
      markUserScroll();
      scroller.scrollLeft += dx;
    };

    const onScroll = () => markUserScroll();

    scroller.addEventListener("wheel", onWheel, { passive: false });
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      scroller.removeEventListener("wheel", onWheel);
      scroller.removeEventListener("scroll", onScroll);
    };
  }, [setZoomAroundCursor]);

  // Keep playhead in view while playing — but never fight user pan/scroll
  useEffect(() => {
    if (Date.now() < userScrollUntil.current) return;
    if (panning) return;
    const scroller = scrollRef.current;
    const track = trackRef.current;
    if (!scroller || !track || safeDuration <= 0) return;
    const playX = (playheadSec / safeDuration) * track.scrollWidth;
    const left = scroller.scrollLeft;
    const right = left + scroller.clientWidth;
    const pad = 56;
    if (playX < left + pad) {
      scroller.scrollLeft = Math.max(0, playX - pad);
    } else if (playX > right - pad) {
      scroller.scrollLeft = playX - scroller.clientWidth + pad;
    }
  }, [playheadSec, safeDuration, zoom, panning]);

  const playPct = clamp((playheadSec / safeDuration) * 100, 0, 100);
  const dropPct =
    dropHintSec == null
      ? null
      : clamp((dropHintSec / safeDuration) * 100, 0, 100);

  const clearDropState = () => {
    setDropHintSec(null);
    setDragOverText(false);
  };

  const trackElFor = useCallback(
    (track: "text" | "caption") =>
      track === "text" ? textTrackRef.current : captionTrackRef.current,
    [],
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const drag = edgeDrag.current;
      if (!drag) return;
      const el = trackElFor(drag.track);
      if (!el) return;

      if (!drag.historyPushed) {
        drag.historyPushed = true;
        onBlockGestureStart?.();
      }

      const t = relFromClientX(e.clientX, el);
      const rounded = Math.round(t * 10) / 10;

      if (drag.kind === "start") {
        const startSec = clamp(
          rounded,
          0,
          drag.endSec - MIN_BLOCK_SEC,
        );
        onResizeBlock?.(drag.track, drag.id, {
          startSec,
          endSec: drag.endSec,
        });
        setTrimTip({
          x: e.clientX,
          y: e.clientY,
          label: `${formatTs(startSec)} → ${formatTs(drag.endSec)} · ${formatTs(drag.endSec - startSec)}`,
        });
        return;
      }

      if (drag.kind === "end") {
        const endSec = clamp(
          rounded,
          drag.startSec + MIN_BLOCK_SEC,
          safeDuration,
        );
        onResizeBlock?.(drag.track, drag.id, {
          startSec: drag.startSec,
          endSec,
        });
        setTrimTip({
          x: e.clientX,
          y: e.clientY,
          label: `${formatTs(drag.startSec)} → ${formatTs(endSec)} · ${formatTs(endSec - drag.startSec)}`,
        });
        return;
      }

      // move whole block
      const rect = el.getBoundingClientRect();
      const deltaSec =
        ((e.clientX - drag.originX) / rect.width) * safeDuration;
      const len = drag.endSec - drag.startSec;
      let startSec = drag.startSec + deltaSec;
      startSec = clamp(startSec, 0, Math.max(0, safeDuration - len));
      startSec = Math.round(startSec * 10) / 10;
      const endSec = Math.round((startSec + len) * 10) / 10;
      onResizeBlock?.(drag.track, drag.id, { startSec, endSec });
      setTrimTip({
        x: e.clientX,
        y: e.clientY,
        label: `${formatTs(startSec)} → ${formatTs(endSec)}`,
      });
    };

    const onUp = () => {
      if (!edgeDrag.current) return;
      edgeDrag.current = null;
      setTrimming(false);
      setTrimTip(null);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [
    onBlockGestureStart,
    onResizeBlock,
    relFromClientX,
    safeDuration,
    trackElFor,
  ]);

  const beginEdgeDrag = (
    kind: EdgeDrag["kind"],
    track: "text" | "caption",
    block: TimelineBlock,
    clientX: number,
  ) => {
    onSelectBlock?.(block.id);
    edgeDrag.current = {
      kind,
      track,
      id: block.id,
      startSec: block.startSec,
      endSec: block.endSec,
      originX: clientX,
      historyPushed: false,
    };
    setTrimming(true);
  };

  const handleTextDragOver = (e: DragEvent) => {
    const types = Array.from(e.dataTransfer.types);
    const ok =
      types.includes(TEXT_STYLE_MIME) ||
      types.includes(TEXT_BLOCK_MIME) ||
      types.includes("text/plain");
    if (!ok) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = types.includes(TEXT_BLOCK_MIME)
      ? "move"
      : "copy";
    setDragOverText(true);
    setDropHintSec(relFromClientX(e.clientX, textTrackRef.current));
  };

  const handleTextDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const at = relFromClientX(e.clientX, textTrackRef.current);
    const styleId =
      e.dataTransfer.getData(TEXT_STYLE_MIME) ||
      e.dataTransfer.getData("text/plain");
    const blockId = e.dataTransfer.getData(TEXT_BLOCK_MIME);

    if (blockId && onMoveTextBlock) {
      onMoveTextBlock(blockId, at);
      onSeek(at);
    } else if (styleId && onDropTextStyle) {
      onDropTextStyle(styleId, at);
      onSeek(at);
    }
    clearDropState();
  };

  const renderBlocks = (blocks: TimelineBlock[], track: "text" | "caption") =>
    blocks.map((b) => {
      const left = (b.startSec / safeDuration) * 100;
      const width = ((b.endSec - b.startSec) / safeDuration) * 100;
      const selected = selectedBlockId === b.id;
      return (
        <div
          key={b.id}
          title={`${b.label} · drag edges to trim`}
          className={cn(
            "absolute top-0.5 bottom-0.5 overflow-hidden rounded-[10px] text-left font-sans text-[11px] font-bold text-white shadow-sm transition duration-150",
            track === "text"
              ? "bg-gradient-to-r from-[#a78bfa] via-[#8b5cf6] to-[#6366f1]"
              : "z-[1] bg-gradient-to-r from-[#4f46e5] via-[#6366f1] to-[#2563eb]",
            selected &&
              "z-10 ring-2 ring-white shadow-[0_0_0_3px_rgba(139,92,246,0.35)]",
            trimming && selected && "cursor-ew-resize",
          )}
          style={{
            left: `${clamp(left, 0, 99)}%`,
            width: `${Math.max(track === "caption" ? 4 : 2.2, Math.min(width, 100 - left))}%`,
            background: b.color,
          }}
          onClick={(e) => {
            e.stopPropagation();
            onSelectBlock?.(b.id);
            onSeek(b.startSec);
          }}
        >
          {/* Left trim handle */}
          <button
            type="button"
            aria-label="Trim start"
            data-handle="start"
            className="absolute top-0 bottom-0 left-0 z-10 flex w-3 cursor-ew-resize items-center justify-center rounded-l-[9px] bg-black/30 hover:bg-black/50"
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              beginEdgeDrag("start", track, b, e.clientX);
            }}
          >
            <span className="flex gap-0.5">
              <span className="h-4 w-0.5 rounded-full bg-white" />
              <span className="h-4 w-0.5 rounded-full bg-white" />
            </span>
          </button>

          {/* Body — drag to move along the track */}
          <div
            className="absolute inset-y-0 right-3 left-3 cursor-grab truncate px-0.5 leading-[30px] active:cursor-grabbing"
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              beginEdgeDrag("move", track, b, e.clientX);
            }}
          >
            {track === "text" ? "T " : "CC "}
            {b.label}
          </div>

          {/* Right trim handle */}
          <button
            type="button"
            aria-label="Trim end"
            data-handle="end"
            className="absolute top-0 right-0 bottom-0 z-10 flex w-3 cursor-ew-resize items-center justify-center rounded-r-[9px] bg-black/30 hover:bg-black/50"
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              beginEdgeDrag("end", track, b, e.clientX);
            }}
          >
            <span className="flex gap-0.5">
              <span className="h-4 w-0.5 rounded-full bg-white" />
              <span className="h-4 w-0.5 rounded-full bg-white" />
            </span>
          </button>

          {selected && onDeleteBlock ? (
            <button
              type="button"
              aria-label="Delete clip"
              title="Delete"
              className="absolute top-0.5 right-3.5 z-20 rounded bg-black/55 px-1 py-0.5 font-sans text-[9px] font-bold text-white hover:bg-[#b91c1c]"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteBlock(b.id);
              }}
            >
              Del
            </button>
          ) : null}
        </div>
      );
    });

  const filmH = embedded ? 40 : 52;

  const btn = dark
    ? "inline-flex h-8 w-8 items-center justify-center rounded-[6px] bg-[#17171a] text-[#a0a0a8] transition duration-150 hover:text-[#f2f2f3] disabled:opacity-40"
    : "inline-flex h-8 w-8 items-center justify-center rounded-[10px] bg-[#ede9fe] text-[#5b21b6] transition duration-150 disabled:opacity-40";

  const beginPanOrSeek = (e: ReactPointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;
    if ((e.target as HTMLElement).closest("[data-text-track]")) return;
    if ((e.target as HTMLElement).closest("[data-caption-track]")) return;
    if ((e.target as HTMLElement).closest("[data-handle]")) return;

    const scroller = scrollRef.current;
    if (!scroller) return;

    panGesture.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startScroll: scroller.scrollLeft,
      moved: false,
    };
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
  };

  const movePanOrSeek = (e: ReactPointerEvent<HTMLDivElement>) => {
    const g = panGesture.current;
    const scroller = scrollRef.current;
    if (!g || !scroller || g.pointerId !== e.pointerId) return;

    const dx = e.clientX - g.startX;
    if (!g.moved && Math.abs(dx) < 6) return;

    if (!g.moved) {
      g.moved = true;
      setPanning(true);
      userScrollUntil.current = Date.now() + 1200;
    }
    // Drag right → reveal earlier timeline (classic editor pan)
    scroller.scrollLeft = g.startScroll - dx;
    userScrollUntil.current = Date.now() + 1200;
  };

  const endPanOrSeek = (e: ReactPointerEvent<HTMLDivElement>) => {
    const g = panGesture.current;
    if (!g || g.pointerId !== e.pointerId) return;
    panGesture.current = null;
    setPanning(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }

    if (!g.moved) {
      // Tap / click → seek
      onSeek(relFromClientX(e.clientX));
      onSelectBlock?.(null);
    }
  };

  return (
    <div
      className={cn(
        "relative flex h-full w-full flex-col overflow-hidden",
        dark
          ? "rounded-[10px] border-0 bg-[#101011]"
          : "rounded-[16px] border border-[#ddd6fe] bg-white shadow-[0_8px_24px_rgba(20,20,40,0.06)]",
        embedded && "shadow-none",
        className,
      )}
    >
      <div
        className={cn(
          "flex flex-wrap items-center justify-between gap-2 px-3 py-2",
          dark ? "border-b border-[#232326]" : "border-b border-[#ede9fe]",
        )}
      >
        <div>
          <p
            className={cn(
              "font-sans text-[12px] font-bold",
              dark ? "text-[#f2f2f3]" : "text-[#111827]",
            )}
          >
            Timeline
            <span
              className={cn(
                "ml-1.5 font-normal",
                dark ? "text-[#6c6c74]" : "text-[#7a738c]",
              )}
            >
              Drag to pan · click seek · Ctrl+scroll zoom
            </span>
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Undo"
            title="Undo (Ctrl+Z)"
            disabled={!canUndo || !onUndo}
            onClick={onUndo}
            className={btn}
          >
            <Undo2 className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="Redo"
            title="Redo (Ctrl+Y)"
            disabled={!canRedo || !onRedo}
            onClick={onRedo}
            className={btn}
          >
            <Redo2 className="h-3.5 w-3.5" />
          </button>
          <span
            className={cn(
              "mx-0.5 h-4 w-px",
              dark ? "bg-[#232326]" : "bg-[#ddd6fe]",
            )}
            aria-hidden
          />
          <button
            type="button"
            aria-label="Zoom out"
            className={btn}
            onClick={() => setZoomAroundCursor(zoomRef.current / 1.25)}
          >
            <Minus className="h-3.5 w-3.5" />
          </button>
          <input
            type="range"
            min={MIN_ZOOM * 10}
            max={MAX_ZOOM * 10}
            step={1}
            value={Math.round(zoom * 10)}
            aria-label="Timeline zoom"
            onChange={(e) =>
              setZoomAroundCursor(Number(e.target.value) / 10)
            }
            className={cn(
              "h-1.5 w-20 cursor-pointer sm:w-28",
              dark ? "accent-[#d5fb74]" : "accent-[#8b5cf6]",
            )}
          />
          <button
            type="button"
            aria-label="Zoom in"
            className={btn}
            onClick={() => setZoomAroundCursor(zoomRef.current * 1.25)}
          >
            <Plus className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label="Fit timeline"
            title="Fit"
            className={btn}
            onClick={() => setZoomAroundCursor(DEFAULT_ZOOM)}
          >
            <StretchHorizontal className="h-3.5 w-3.5" />
          </button>
          <span
            className={cn(
              "min-w-[2.25rem] text-right font-sans text-[11px] font-bold tabular-nums",
              dark ? "text-[#a0a0a8]" : "text-[#5b21b6]",
            )}
          >
            {zoom.toFixed(1)}x
          </span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* Sticky track labels */}
        <div
          className={cn(
            "z-10 flex w-[64px] shrink-0 flex-col pt-[20px] pb-3",
            dark
              ? "border-r border-[#232326] bg-[#17171a]"
              : "border-r border-[#ede9fe] bg-[#faf8ff]",
          )}
        >
          <div
            className={cn(
              "flex h-9 items-center px-2 font-sans text-[10px] font-bold tracking-wide uppercase",
              dark ? "text-[#6c6c74]" : "text-[#7c3aed]",
            )}
          >
            Text
          </div>
          <div
            className={cn(
              "flex h-11 items-center px-2 font-sans text-[10px] font-bold tracking-wide uppercase",
              dark ? "text-[#6c6c74]" : "text-[#7c3aed]",
            )}
          >
            Caps
            {captionBlocks.length > 0 ? (
              <span
                className={cn(
                  "ml-1 rounded-full px-1.5 py-0.5 text-[9px] font-extrabold normal-case",
                  dark
                    ? "bg-[#232326] text-[#d5fb74]"
                    : "bg-[#ddd6fe] text-[#5b21b6]",
                )}
              >
                {captionBlocks.length}
              </span>
            ) : null}
          </div>
          <div
            className={cn(
              "flex items-center px-2 font-sans text-[10px] font-bold tracking-wide uppercase",
              dark ? "text-[#6c6c74]" : "text-[#7c3aed]",
            )}
            style={{ height: filmH }}
          >
            Video
          </div>
        </div>

        <div
          ref={scrollRef}
          className={cn(
            "editor-timeline-scroll min-w-0 flex-1 overflow-x-auto overflow-y-hidden overscroll-x-contain px-2 pt-2 pb-1",
            panning ? "cursor-grabbing select-none" : "cursor-grab",
          )}
          style={{ touchAction: "pan-x", WebkitOverflowScrolling: "touch" }}
        >
          <div
            ref={trackRef}
            className="relative will-change-scroll pb-1"
            style={{
              width: `${zoom * 100}%`,
              minWidth: "100%",
            }}
            onPointerDown={beginPanOrSeek}
            onPointerMove={movePanOrSeek}
            onPointerUp={endPanOrSeek}
            onPointerCancel={endPanOrSeek}
          >
            {/* Ruler — click seeks; drag still pans via parent handlers */}
            <div className="relative mb-1.5 h-4">
              {ticks.map((t, i) => {
                const pct = (i / Math.max(1, tickCount - 1)) * 100;
                const align =
                  i === 0 ? "0%" : i === tickCount - 1 ? "-100%" : "-50%";
                return (
                  <span
                    key={i}
                    className="absolute font-sans text-[10px] tabular-nums text-[#8b7aa8]"
                    style={{
                      left: `${pct}%`,
                      transform: `translateX(${align})`,
                    }}
                  >
                    {formatTs(t)}
                  </span>
                );
              })}
            </div>

            {/* Text track */}
            <div className="mb-1">
              <div
                ref={textTrackRef}
                data-text-track
                onDragOver={handleTextDragOver}
                onDragLeave={(e) => {
                  if (
                    e.currentTarget.contains(e.relatedTarget as Node | null)
                  ) {
                    return;
                  }
                  clearDropState();
                }}
                onDrop={handleTextDrop}
                className={cn(
                  "relative h-9 overflow-hidden rounded-[10px] ring-1 transition duration-150",
                  dragOverText
                    ? "bg-[#ddd6fe] ring-2 ring-[#8b5cf6]"
                    : "bg-[#f5f3ff] ring-[#ddd6fe]",
                )}
              >
                {textBlocks.length === 0 && !dragOverText ? (
                  <p className="pointer-events-none absolute inset-0 flex items-center justify-center border border-dashed border-transparent font-sans text-[11px] text-[#8b7aa8]">
                    Add text
                  </p>
                ) : null}
                {renderBlocks(textBlocks, "text")}
                {dropPct != null ? (
                  <div
                    className="pointer-events-none absolute top-0 bottom-0 z-30 w-0.5 bg-[#7c3aed]"
                    style={{ left: `${dropPct}%` }}
                  >
                    <span
                      className="absolute top-1 h-8 rounded-[8px] bg-[#8b5cf6]/35 ring-1 ring-[#8b5cf6]"
                      style={{
                        width: `${Math.max(2, (DEFAULT_TEXT_LEN / safeDuration) * 100)}%`,
                      }}
                    />
                  </div>
                ) : null}
              </div>
            </div>

            {/* Captions track — generated speech lines */}
            <div className="mb-1">
              <div
                ref={captionTrackRef}
                data-caption-track
                className={cn(
                  "relative h-11 overflow-hidden rounded-[10px] ring-1",
                  captionBlocks.length
                    ? "bg-[#eef2ff] ring-[#c7d2fe]"
                    : "bg-[#f5f3ff] ring-[#ddd6fe]",
                )}
                onClick={(e) => {
                  if (captionBlocks.length > 0) return;
                  if ((e.target as HTMLElement).closest("button")) return;
                  onGenerateCaptions?.();
                }}
              >
                {captionBlocks.length === 0 ? (
                  <p className="pointer-events-none absolute inset-0 flex items-center justify-center font-sans text-[11px] font-semibold text-[#6d28d9]">
                    {generatingCaptions
                      ? "Transcribing audio…"
                      : onGenerateCaptions
                        ? "Click to generate captions on this track"
                        : "Generate captions"}
                  </p>
                ) : null}
                {renderBlocks(captionBlocks, "caption")}
              </div>
            </div>

            {/* Video filmstrip */}
            <div>
              <div
                className="relative overflow-hidden rounded-[10px] bg-[#1e1b4b] ring-1 ring-[#c4b5fd]/50"
                style={{ height: filmH }}
              >
                {useCanvasStrip && mediaUrl ? (
                  <VideoFilmstrip
                    mediaUrl={mediaUrl}
                    durationSec={safeDuration}
                    frameCount={Math.min(40, frameCount)}
                  />
                ) : (
                  <div className="pointer-events-none absolute inset-0 flex">
                    {frames.map((f, i) => (
                      <div
                        key={`${Math.round(f.t * 100)}-${i}`}
                        className="relative h-full min-w-0 flex-1 overflow-hidden border-r border-white/10"
                      >
                        {f.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={f.url}
                            alt=""
                            className="h-full w-full object-cover"
                            loading="lazy"
                            draggable={false}
                          />
                        ) : (
                          <div
                            className="h-full w-full"
                            style={{
                              background:
                                i % 2 === 0
                                  ? "linear-gradient(180deg,#312e81 0%,#1e1b4b 100%)"
                                  : "linear-gradient(180deg,#4338ca 0%,#312e81 100%)",
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Playhead */}
            <div
              className="pointer-events-none absolute top-0 bottom-0 z-20 w-0.5 bg-[#8b5cf6]"
              style={{ left: `${playPct}%` }}
            >
              <span className="absolute -top-0.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-white bg-[#8b5cf6] shadow" />
            </div>
          </div>
        </div>
      </div>

      {trimTip ? (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-[120%] rounded-[8px] bg-[#111827] px-2 py-1 font-sans text-[10px] font-semibold tabular-nums text-white shadow-lg"
          style={{ left: trimTip.x, top: trimTip.y }}
        >
          {trimTip.label}
        </div>
      ) : null}
    </div>
  );
}
