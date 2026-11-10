"use client";

import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/cn";

export type OverlayTransform = {
  xPct: number;
  yPct: number;
  scale: number;
  /** Box width as % of the video frame — drag side dots to change wrap */
  widthPct: number;
};

type DragKind = "move" | "scale" | "width-left" | "width-right";

type VideoOverlayBoxProps = {
  id: string;
  selected: boolean;
  transform: OverlayTransform;
  onSelect: () => void;
  onTransform: (next: OverlayTransform) => void;
  onTransformStart?: () => void;
  /** Base font size in px at scale=1 */
  basePx?: number;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
  chrome?: "none" | "caption";
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** Visible handle + large hit target, parked outside the text box */
function Handle({
  className,
  cursor,
  label,
  title,
  onPointerDown,
  shape = "corner",
}: {
  className: string;
  cursor: string;
  label: string;
  title: string;
  onPointerDown: (e: ReactPointerEvent) => void;
  shape?: "corner" | "side";
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={title}
      className={cn(
        "absolute z-40 flex items-center justify-center",
        shape === "side" ? "h-10 w-9" : "h-9 w-9",
        cursor,
        className,
      )}
      onPointerDown={onPointerDown}
    >
      <span
        className={cn(
          "pointer-events-none border-2 border-white bg-[#8b5cf6] shadow-md",
          shape === "side"
            ? "h-4 w-3.5 rounded-md"
            : "h-3.5 w-3.5 rounded-full",
        )}
      />
    </button>
  );
}

export function VideoOverlayBox({
  id,
  selected,
  transform,
  onSelect,
  onTransform,
  onTransformStart,
  basePx = 16,
  className,
  contentClassName,
  children,
  chrome = "none",
}: VideoOverlayBoxProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const dragKind = useRef<DragKind | null>(null);
  const historyPushed = useRef(false);
  const transformRef = useRef(transform);
  transformRef.current = transform;
  const onTransformRef = useRef(onTransform);
  onTransformRef.current = onTransform;
  const onTransformStartRef = useRef(onTransformStart);
  onTransformStartRef.current = onTransformStart;

  const origin = useRef({
    x: 0,
    y: 0,
    xPct: 50,
    yPct: 50,
    scale: 1,
    widthPct: 70,
  });
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const kind = dragKind.current;
      if (!kind) return;
      const parent = boxRef.current?.offsetParent as HTMLElement | null;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const moved =
        Math.hypot(e.clientX - origin.current.x, e.clientY - origin.current.y) >
        2;
      if (moved && !historyPushed.current) {
        historyPushed.current = true;
        onTransformStartRef.current?.();
      }
      if (!moved && kind === "move") return;

      if (kind === "move") {
        const dx = ((e.clientX - origin.current.x) / rect.width) * 100;
        const dy = ((e.clientY - origin.current.y) / rect.height) * 100;
        onTransformRef.current({
          xPct: clamp(origin.current.xPct + dx, 6, 94),
          yPct: clamp(origin.current.yPct + dy, 8, 92),
          scale: origin.current.scale,
          widthPct: origin.current.widthPct,
        });
        return;
      }

      if (kind === "scale") {
        // Scale from box center — corner drag distance
        const cx = rect.left + (origin.current.xPct / 100) * rect.width;
        const cy = rect.top + (origin.current.yPct / 100) * rect.height;
        const startDist = Math.max(
          8,
          Math.hypot(origin.current.x - cx, origin.current.y - cy),
        );
        const nowDist = Math.hypot(e.clientX - cx, e.clientY - cy);
        const ratio = nowDist / startDist;
        onTransformRef.current({
          xPct: origin.current.xPct,
          yPct: origin.current.yPct,
          scale: clamp(origin.current.scale * ratio, 0.35, 4.5),
          widthPct: origin.current.widthPct,
        });
        return;
      }

      const deltaPct = ((e.clientX - origin.current.x) / rect.width) * 100;
      const signed = kind === "width-right" ? deltaPct * 2 : -deltaPct * 2;
      onTransformRef.current({
        xPct: origin.current.xPct,
        yPct: origin.current.yPct,
        scale: origin.current.scale,
        widthPct: clamp(origin.current.widthPct + signed, 16, 94),
      });
    };

    const onUp = () => {
      if (!dragKind.current) return;
      dragKind.current = null;
      historyPushed.current = false;
      setDragging(false);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  const startDrag = (kind: DragKind, e: ReactPointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSelect();
    historyPushed.current = false;
    const t = transformRef.current;
    dragKind.current = kind;
    origin.current = {
      x: e.clientX,
      y: e.clientY,
      xPct: t.xPct,
      yPct: t.yPct,
      scale: t.scale,
      widthPct: t.widthPct,
    };
    setDragging(true);
  };

  const widthPct = clamp(transform.widthPct || 70, 16, 94);
  const fontPx = Math.max(10, Math.round(basePx * transform.scale));

  return (
    <div
      ref={boxRef}
      data-overlay-id={id}
      className={cn(
        "absolute z-20 -translate-x-1/2 -translate-y-1/2 touch-none select-none",
        selected ? "cursor-grab active:cursor-grabbing" : "cursor-pointer",
        dragging && "cursor-grabbing",
        className,
      )}
      style={{
        left: `${transform.xPct}%`,
        top: `${transform.yPct}%`,
        width: `${widthPct}%`,
        fontSize: `${fontPx}px`,
      }}
      onPointerDown={(e) => startDrag("move", e)}
    >
      <div
        className={cn(
          "relative w-full leading-tight",
          // Extra padding when selected so corner/side dots stay spaced apart
          selected ? "px-5 py-4" : "px-1.5 py-1",
          chrome === "caption" &&
            !selected &&
            "rounded-md bg-black/35 px-2 py-1 backdrop-blur-[2px]",
          selected && "rounded-md ring-1 ring-white/90",
          contentClassName,
        )}
      >
        <div
          className="w-full break-words [overflow-wrap:anywhere]"
          style={{ fontSize: "1em" }}
        >
          {children}
        </div>

        {selected ? (
          <>
            {/* Corners sit outside the ring so they don't cluster */}
            <Handle
              label="Scale top-left"
              title="Drag corner to resize text"
              cursor="cursor-nwse-resize"
              className="-top-2 -left-2"
              onPointerDown={(e) => startDrag("scale", e)}
            />
            <Handle
              label="Scale top-right"
              title="Drag corner to resize text"
              cursor="cursor-nesw-resize"
              className="-top-2 -right-2"
              onPointerDown={(e) => startDrag("scale", e)}
            />
            <Handle
              label="Scale bottom-left"
              title="Drag corner to resize text"
              cursor="cursor-nesw-resize"
              className="-bottom-2 -left-2"
              onPointerDown={(e) => startDrag("scale", e)}
            />
            <Handle
              label="Scale bottom-right"
              title="Drag corner to resize text"
              cursor="cursor-nwse-resize"
              className="-right-2 -bottom-2"
              onPointerDown={(e) => startDrag("scale", e)}
            />
            {/* Side handles farther out on the mid-edges */}
            <Handle
              shape="side"
              label="Width left"
              title="Drag out for one line · drag in to wrap"
              cursor="cursor-ew-resize"
              className="top-1/2 -left-3 -translate-y-1/2"
              onPointerDown={(e) => startDrag("width-left", e)}
            />
            <Handle
              shape="side"
              label="Width right"
              title="Drag out for one line · drag in to wrap"
              cursor="cursor-ew-resize"
              className="top-1/2 -right-3 -translate-y-1/2"
              onPointerDown={(e) => startDrag("width-right", e)}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}
