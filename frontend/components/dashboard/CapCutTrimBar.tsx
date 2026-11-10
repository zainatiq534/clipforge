"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type CapCutTrimBarProps = {
  durationSec: number;
  startRel: number;
  endRel: number;
  playheadRel: number;
  onChange: (next: { startRel: number; endRel: number }) => void;
  onSeek: (rel: number) => void;
  onActivateTimeline?: () => void;
  cloudName?: string;
  publicId?: string;
  minClipSec?: number;
  className?: string;
  cropMarkers?: { startRel: number; endRel: number; color: string }[];
};

type DragKind = "start" | "end" | "range" | "playhead" | null;

const MIN_ZOOM = 1;
const MAX_ZOOM = 12;

function formatTs(sec: number) {
  const s = Math.max(0, Math.round(sec));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

function frameUrl(cloudName: string, publicId: string, atSec: number) {
  const so = Math.max(0, Math.floor(atSec * 10) / 10);
  return `https://res.cloudinary.com/${cloudName}/video/upload/so_${so},w_96,h_54,c_fill,q_auto,f_jpg/${publicId}.jpg`;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function CapCutTrimBar({
  durationSec,
  startRel,
  endRel,
  playheadRel,
  onChange,
  onSeek,
  onActivateTimeline,
  cloudName,
  publicId,
  minClipSec = 3,
  className,
  cropMarkers = [],
}: CapCutTrimBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragKind = useRef<DragKind>(null);
  const dragOrigin = useRef({ x: 0, start: 0, end: 0 });
  const zoomRef = useRef(1);
  const [dragging, setDragging] = useState(false);
  const [zoom, setZoom] = useState(1);

  const frameCount = Math.min(72, Math.max(14, Math.round(10 + zoom * 5.5)));

  const frames = useMemo(() => {
    if (!cloudName || !publicId || durationSec <= 0) {
      return Array.from({ length: frameCount }, (_, i) => ({
        t: (durationSec * i) / Math.max(1, frameCount - 1),
        url: null as string | null,
      }));
    }
    return Array.from({ length: frameCount }, (_, i) => {
      const t = (durationSec * i) / Math.max(1, frameCount - 1);
      return { t, url: frameUrl(cloudName, publicId, t) };
    });
  }, [cloudName, publicId, durationSec, frameCount]);

  const tickCount = Math.min(32, Math.max(6, Math.round(4 + zoom * 2.5)));
  const ticks = useMemo(
    () =>
      Array.from(
        { length: tickCount },
        (_, i) => (durationSec * i) / (tickCount - 1 || 1),
      ),
    [durationSec, tickCount],
  );

  const relFromClientX = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el || durationSec <= 0) return 0;
      const rect = el.getBoundingClientRect();
      const pct = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      return pct * durationSec;
    },
    [durationSec],
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const kind = dragKind.current;
      if (!kind) return;
      const t = relFromClientX(e.clientX);

      if (kind === "playhead") {
        onSeek(t);
        return;
      }

      if (kind === "start") {
        const nextStart = Math.min(t, endRel - minClipSec);
        onChange({
          startRel: Math.max(0, nextStart),
          endRel,
        });
        onSeek(Math.max(0, nextStart));
        return;
      }

      if (kind === "end") {
        const nextEnd = Math.max(t, startRel + minClipSec);
        onChange({
          startRel,
          endRel: Math.min(durationSec, nextEnd),
        });
        onSeek(Math.min(durationSec, nextEnd));
        return;
      }

      if (kind === "range") {
        const dx = e.clientX - dragOrigin.current.x;
        const el = trackRef.current;
        if (!el) return;
        const deltaSec = (dx / el.getBoundingClientRect().width) * durationSec;
        const len = dragOrigin.current.end - dragOrigin.current.start;
        let nextStart = dragOrigin.current.start + deltaSec;
        nextStart = Math.max(0, Math.min(durationSec - len, nextStart));
        onChange({
          startRel: nextStart,
          endRel: nextStart + len,
        });
      }
    };

    const onUp = () => {
      dragKind.current = null;
      setDragging(false);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [
    durationSec,
    endRel,
    minClipSec,
    onChange,
    onSeek,
    relFromClientX,
    startRel,
  ]);

  // Cursor-over-timeline wheel zoom — only this strip widens, page never zooms
  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const prev = zoomRef.current;
      const direction = e.deltaY < 0 ? 1 : -1;
      const next = clamp(prev * (1 + direction * 0.14), MIN_ZOOM, MAX_ZOOM);
      if (Math.abs(next - prev) < 0.001) return;

      const rect = scroller.getBoundingClientRect();
      const cursorX = e.clientX - rect.left;
      const contentX = scroller.scrollLeft + cursorX;
      const ratio = contentX / Math.max(1, scroller.scrollWidth);

      zoomRef.current = next;
      setZoom(next);

      requestAnimationFrame(() => {
        const newScroll =
          ratio * scroller.scrollWidth - cursorX;
        scroller.scrollLeft = Math.max(0, newScroll);
      });
    };

    scroller.addEventListener("wheel", onWheel, { passive: false });
    return () => scroller.removeEventListener("wheel", onWheel);
  }, []);

  const startPct = (startRel / durationSec) * 100;
  const endPct = (endRel / durationSec) * 100;
  const widthPct = Math.max(0.8, endPct - startPct);
  const playPct = (playheadRel / durationSec) * 100;

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-[14px] border border-[#ddd6fe] bg-gradient-to-b from-[#f5f3ff] to-[#ede9fe]",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 px-2.5 pt-2 pb-1">
        <p className="min-w-0 font-sans text-[10px] font-semibold text-[#5b21b6]">
          {formatTs(startRel)} – {formatTs(endRel)}
          <span className="ml-1 font-normal text-[#7a738c]">
            ({Math.round(endRel - startRel)}s)
          </span>
        </p>
        <p className="shrink-0 font-sans text-[10px] text-[#7a738c]">
          Hover timeline · scroll to zoom · {zoom.toFixed(1)}x
        </p>
      </div>

      <div
        ref={scrollRef}
        className="overflow-x-auto overscroll-contain px-2.5 pb-2.5"
        style={{ touchAction: "pan-x" }}
      >
        <div
          className="will-change-[width]"
          style={{
            width: `${zoom * 100}%`,
            minWidth: "100%",
            transition: "width 160ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <div className="relative mb-1 h-3.5">
            {ticks.map((t, i) => (
              <span
                key={i}
                className="absolute -translate-x-1/2 font-sans text-[8px] text-[#8b7aa8]"
                style={{
                  left: `${(i / Math.max(1, tickCount - 1)) * 100}%`,
                }}
              >
                {formatTs(t)}
              </span>
            ))}
          </div>

          <div
            ref={trackRef}
            className={cn(
              "relative h-14 w-full overflow-hidden rounded-[12px] bg-[#1e1b4b] ring-1 ring-[#c4b5fd]/50",
              dragging && "cursor-grabbing",
            )}
            onPointerDown={(e) => {
              if ((e.target as HTMLElement).dataset.handle) return;
              onActivateTimeline?.();
              const t = relFromClientX(e.clientX);
              if (t >= startRel && t <= endRel) {
                dragKind.current = "range";
                dragOrigin.current = {
                  x: e.clientX,
                  start: startRel,
                  end: endRel,
                };
                setDragging(true);
              } else {
                dragKind.current = "playhead";
                setDragging(true);
                onSeek(t);
              }
            }}
          >
            <div className="pointer-events-none absolute inset-0 flex">
              {frames.map((f, i) => (
                <div
                  key={`${Math.round(f.t * 10)}-${i}`}
                  className="relative h-full min-w-0 flex-1 overflow-hidden border-r border-white/10"
                >
                  {f.url ? (
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
                            ? "linear-gradient(180deg,#ddd6fe 0%,#e9e4ff 100%)"
                            : "linear-gradient(180deg,#e0e7ff 0%,#ede9fe 100%)",
                      }}
                    />
                  )}
                </div>
              ))}
            </div>

            {cropMarkers.map((m, i) => {
              const left = (m.startRel / durationSec) * 100;
              const width = ((m.endRel - m.startRel) / durationSec) * 100;
              return (
                <div
                  key={i}
                  className="pointer-events-none absolute top-1 h-1.5 rounded-full opacity-90"
                  style={{
                    left: `${left}%`,
                    width: `${Math.max(2, width)}%`,
                    background: m.color,
                  }}
                />
              );
            })}

            <div
              className="pointer-events-none absolute inset-y-0 left-0 bg-black/45"
              style={{ width: `${startPct}%` }}
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 bg-black/45"
              style={{ width: `${100 - endPct}%` }}
            />

            <div
              className="absolute inset-y-1 rounded-[10px] border-2 border-[#c4b5fd] bg-[#8b5cf6]/25 shadow-[0_4px_14px_rgba(139,92,246,0.3)]"
              style={{ left: `${startPct}%`, width: `${widthPct}%` }}
            >
              <button
                type="button"
                data-handle="start"
                aria-label="Trim start"
                className="absolute top-0 bottom-0 left-0 z-10 flex w-3 cursor-ew-resize items-center justify-center rounded-l-[8px] bg-[#8b5cf6]"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  onActivateTimeline?.();
                  dragKind.current = "start";
                  setDragging(true);
                }}
              >
                <span className="flex gap-0.5">
                  <span className="h-4 w-0.5 rounded-full bg-white" />
                  <span className="h-4 w-0.5 rounded-full bg-white" />
                </span>
              </button>
              <button
                type="button"
                data-handle="end"
                aria-label="Trim end"
                className="absolute top-0 right-0 bottom-0 z-10 flex w-3 cursor-ew-resize items-center justify-center rounded-r-[8px] bg-[#8b5cf6]"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  onActivateTimeline?.();
                  dragKind.current = "end";
                  setDragging(true);
                }}
              >
                <span className="flex gap-0.5">
                  <span className="h-4 w-0.5 rounded-full bg-white" />
                  <span className="h-4 w-0.5 rounded-full bg-white" />
                </span>
              </button>
            </div>

            <div
              className="pointer-events-none absolute top-0 bottom-0 z-20 w-0.5 bg-white"
              style={{ left: `${playPct}%` }}
            >
              <span className="absolute -top-0.5 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-white bg-[#8b5cf6]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
