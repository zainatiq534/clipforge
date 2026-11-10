"use client";

import { useEffect, useMemo } from "react";
import {
  applyTextCase,
  captionLineCss,
  emphasizeWordCss,
  getCaptionPack,
  lineEnterClass,
  normalWordCss,
  pickEmphasizeWordIndex,
  styleFromPack,
  wordEnterClass,
  type CaptionPack,
} from "@/lib/caption";
import { ensureGoogleFont } from "@/lib/google-fonts";
import { cn } from "@/lib/cn";

type Props = {
  text: string;
  packId: string;
  /** Re-trigger line enter animation when the active cue changes */
  cueKey?: string;
  className?: string;
};

export function CaptionStyledText({
  text,
  packId,
  cueKey,
  className,
}: Props) {
  const pack = getCaptionPack(packId) ?? getCaptionPack("ali-abdaal");
  const style = useMemo(
    () => (pack ? styleFromPack(pack) : null),
    [pack],
  );

  useEffect(() => {
    if (style?.fontFamily) ensureGoogleFont(style.fontFamily);
  }, [style?.fontFamily]);

  const words = text.trim().split(/\s+/).filter(Boolean);

  if (!pack || !style) {
    return (
      <p
        className={cn(
          "font-sans leading-snug font-extrabold break-words whitespace-normal text-white",
          className,
        )}
      >
        {text}
      </p>
    );
  }

  const emphasizeIdx = pickEmphasizeWordIndex(words.length);
  const lineClass = lineEnterClass(style.transition);
  const wordMotion = wordEnterClass(pack.motion?.wordEnter);
  // Omit absolute fontSize so VideoOverlayBox scale (corner drag) controls size
  const { fontSize: _packFontSize, ...lineCss } = captionLineCss(style);
  void _packFontSize;
  const backdrop = pack.design?.backdrop;

  return (
    <p
      key={cueKey ?? text}
      className={cn(
        "leading-snug break-words whitespace-normal",
        lineClass,
        backdrop && "rounded-xl px-3 py-1.5",
        className,
      )}
      style={{
        ...lineCss,
        fontSize: "1em",
        ...(backdrop
          ? { backgroundColor: pack.design?.backdropColor ?? "rgba(0,0,0,0.55)" }
          : null),
      }}
    >
      {words.map((word, i) => {
        const display = applyTextCase(word, style.textCase);
        const emphasized = i === emphasizeIdx;
        const css = emphasized
          ? emphasizeWordCss(
              style,
              pack.design,
              pack.motion?.emphasizeEffect,
              style.highlight ?? "#8B5CF6",
              { compact: true },
            )
          : normalWordCss(style, pack.design);
        return (
          <span
            key={`${i}-${display}`}
            className={cn(wordMotion, "mr-[0.28em] inline last:mr-0")}
            style={css}
          >
            {display}
          </span>
        );
      })}
    </p>
  );
}

export function CaptionPackPreviewCard({
  pack,
  selected,
  onSelect,
}: {
  pack: CaptionPack;
  selected: boolean;
  onSelect: () => void;
}) {
  const style = styleFromPack(pack);
  useEffect(() => {
    ensureGoogleFont(style.fontFamily);
  }, [style.fontFamily]);
  const words = pack.previewWords ?? ["TO", "GET", "STARTED"];
  const emphasizeIdx = pickEmphasizeWordIndex(words.length);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group relative w-full overflow-hidden rounded-[12px] p-2.5 text-left transition duration-150",
        selected
          ? "ring-2 ring-[#8b5cf6] ring-offset-1 ring-offset-[#f5f3ff]"
          : "ring-1 ring-[#ddd6fe] hover:ring-[#c4b5fd]",
      )}
      style={{ background: pack.previewBg ?? "#1f1f23" }}
    >
      {pack.design?.badge === "new" ? (
        <span className="absolute top-1.5 right-1.5 rounded-full bg-[#8b5cf6] px-1.5 py-0.5 font-sans text-[8px] font-bold tracking-wide text-white uppercase">
          New
        </span>
      ) : null}
      <div
        className="flex min-h-[52px] flex-wrap items-center justify-center gap-x-1 px-1"
        style={captionLineCss({ ...style, fontSize: Math.min(style.fontSize, 28) })}
      >
        {words.map((w, i) => {
          const display = applyTextCase(w, style.textCase);
          const css =
            i === emphasizeIdx
              ? emphasizeWordCss(
                  style,
                  pack.design,
                  pack.motion?.emphasizeEffect,
                  style.highlight ?? "#8B5CF6",
                  { compact: true },
                )
              : normalWordCss(style, pack.design);
          return (
            <span key={`${pack.id}-${i}`} style={css}>
              {display}
            </span>
          );
        })}
      </div>
      <p className="mt-1.5 truncate font-sans text-[10px] font-bold text-white/90">
        {pack.name}
      </p>
      <p className="truncate font-sans text-[9px] text-white/55">
        {pack.tags.slice(0, 3).join(" · ")}
      </p>
    </button>
  );
}
