"use client";

import { useEffect, type DragEvent } from "react";
import {
  applyTextCase,
  getTextStylePack,
  resolveTextStyle,
  textOverlayCss,
  textPreviewCss,
  type TextStylePack,
} from "@/lib/textStyles";
import { ensureGoogleFont } from "@/lib/google-fonts";
import { cn } from "@/lib/cn";

type OverlayProps = {
  text: string;
  styleId: string;
  className?: string;
};

export function TextStyledOverlay({
  text,
  styleId,
  className,
}: OverlayProps) {
  const pack = getTextStylePack(styleId) ?? getTextStylePack("plain");
  const style = pack ? resolveTextStyle(pack) : null;

  useEffect(() => {
    if (style?.fontFamily) ensureGoogleFont(style.fontFamily);
  }, [style?.fontFamily]);

  if (!pack || !style) {
    return (
      <p
        className={cn(
          "text-center font-sans text-[1em] font-semibold break-words whitespace-normal text-white",
          className,
        )}
      >
        {text}
      </p>
    );
  }

  const display = applyTextCase(text, style.textCase);

  return (
    <p
      className={cn("text-center", className)}
      style={textOverlayCss(style, pack.design)}
    >
      {display}
    </p>
  );
}

export function TextStylePreviewCard({
  pack,
  selected,
  onSelect,
  onDragStart,
}: {
  pack: TextStylePack;
  selected: boolean;
  onSelect: () => void;
  onDragStart?: (e: DragEvent) => void;
}) {
  const style = resolveTextStyle(pack);

  useEffect(() => {
    ensureGoogleFont(style.fontFamily);
  }, [style.fontFamily]);

  const sample = applyTextCase(pack.preview, style.textCase);

  return (
    <button
      type="button"
      draggable
      onDragStart={onDragStart}
      onClick={onSelect}
      className={cn(
        "flex aspect-[4/3] cursor-grab flex-col items-center justify-center rounded-[14px] border px-2 text-center transition active:cursor-grabbing",
        selected
          ? "border-[#8b5cf6] ring-2 ring-[#8b5cf6]/35"
          : "border-[#ddd6fe] hover:border-[#c4b5fd]",
      )}
      style={{ background: pack.tileBg }}
      title={pack.label}
    >
      <span style={textPreviewCss(style, pack.design)}>{sample}</span>
      <span className="mt-1.5 font-sans text-[9px] font-semibold tracking-wide text-white/80 drop-shadow">
        {pack.label}
      </span>
    </button>
  );
}
