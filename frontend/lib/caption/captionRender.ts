import type { CSSProperties } from "react";
import type {
  CaptionPack,
  CaptionPackDesign,
  CaptionStyle,
  EmphasizeEffect,
  WordEnterMotion,
} from "./types";
import { DEFAULT_CAPTION_STYLE } from "./types";

export function applyTextCase(
  text: string,
  textCase: CaptionStyle["textCase"] | undefined,
): string {
  if (!textCase || textCase === "none") return text;
  if (textCase === "upper") return text.toUpperCase();
  if (textCase === "lower") return text.toLowerCase();
  if (textCase === "title") {
    return text.replace(
      /\w\S*/g,
      (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
    );
  }
  return text;
}

export function styleFromPack(pack: CaptionPack): CaptionStyle {
  return {
    ...DEFAULT_CAPTION_STYLE,
    ...pack.style,
    transition:
      pack.motion?.lineEnter ??
      pack.style.transition ??
      DEFAULT_CAPTION_STYLE.transition,
  };
}

const FONT_FACE_WEIGHT: Record<string, number> = {
  Regular: 400,
  Medium: 500,
  "Semi Bold": 600,
  Bold: 700,
  "Extra Bold": 800,
  Black: 900,
};

export function fontWeightFromFace(
  fontFace: string | undefined,
  bold?: boolean,
): number {
  const base = FONT_FACE_WEIGHT[fontFace ?? ""] ?? 500;
  if (bold && base < 700) return 800;
  return base;
}

export function captionLineCss(style: CaptionStyle): CSSProperties {
  return {
    fontFamily: `"${style.fontFamily}", system-ui, sans-serif`,
    fontSize: Math.max(14, style.fontSize * 0.7),
    color: style.fill,
    fontWeight: fontWeightFromFace(style.fontFace, style.bold),
    fontStyle: style.italic ? "italic" : "normal",
    textDecoration: style.underline ? "underline" : "none",
    textAlign: style.align === "justify" ? "center" : style.align,
    lineHeight: 1.15,
  };
}

export function normalWordCss(
  style: CaptionStyle,
  design?: CaptionPackDesign,
): CSSProperties {
  return {
    display: "inline-block",
    color: style.fill,
    fontWeight: fontWeightFromFace(style.fontFace, style.bold),
    WebkitTextStroke: style.stroke ? `1.25px ${style.stroke}` : undefined,
    paintOrder: style.stroke ? "stroke fill" : undefined,
    textShadow:
      design?.normalShadow ??
      (style.stroke ? undefined : "0 1px 2px rgba(0,0,0,0.45)"),
  };
}

export function emphasizeWordCss(
  base: CaptionStyle,
  design: CaptionPackDesign | undefined,
  effect: EmphasizeEffect | undefined,
  highlightFallback: string,
  opts?: { compact?: boolean },
): CSSProperties {
  const highlight = base.highlight || highlightFallback;
  const rawScale = design?.emphasizeScale ?? 1.08;
  const scale = opts?.compact ? Math.min(rawScale, 1.12) : rawScale;
  const effectMode = effect ?? "glow";

  const css: CSSProperties = {
    display: "inline-block",
    fontWeight: 800,
    color: highlight,
    WebkitTextStroke: base.stroke ? `1.35px ${base.stroke}` : "0",
    paintOrder: base.stroke ? "stroke fill" : "normal",
  };

  if (design?.emphasizeGradient) {
    const [a, b] = design.emphasizeGradient;
    css.backgroundImage = `linear-gradient(180deg, ${a}, ${b})`;
    css.WebkitBackgroundClip = "text";
    css.backgroundClip = "text";
    css.color = "transparent";
    css.WebkitTextFillColor = "transparent";
    css.WebkitTextStroke = "0";
  }

  if (effectMode === "glow" || design?.emphasizeShadow) {
    css.textShadow = design?.emphasizeShadow ?? `0 0 12px ${highlight}`;
  } else if (effectMode === "color-pop") {
    css.textShadow = "0 1px 2px rgba(0,0,0,0.4)";
  }

  if (effectMode === "scale" || design?.emphasizeScale) {
    css.transform = `scale(${scale})`;
  } else if (effectMode === "glow") {
    css.transform = `scale(${Math.min(scale, 1.1)})`;
  }

  if (effectMode === "color-pop" && !design?.emphasizeGradient) {
    css.color = highlight;
  }

  if (design?.highlightBackdrop) {
    css.backgroundColor = design.highlightBackdropColor ?? "#7C3AED";
    css.padding = opts?.compact ? "2px 8px" : "4px 12px";
    css.borderRadius = 999;
    css.color = base.fill || "#FFFFFF";
    css.textShadow = "none";
    css.WebkitTextStroke = base.stroke ? `1px ${base.stroke}` : "0";
    css.WebkitTextFillColor = undefined;
    css.backgroundImage = undefined;
    css.WebkitBackgroundClip = undefined;
    css.backgroundClip = undefined;
  }

  return css;
}

export function wordEnterClass(motion: WordEnterMotion | undefined): string {
  if (motion === "pop") return "cap-word-pop";
  if (motion === "typewriter") return "cap-word-typewriter";
  if (motion === "fade") return "cap-word-fade";
  return "";
}

export function lineEnterClass(transition: string | undefined): string {
  if (!transition || transition === "none") return "";
  return `cap-motion-${transition}`;
}

export function pickEmphasizeWordIndex(wordCount: number): number {
  if (wordCount <= 0) return 0;
  if (wordCount === 1) return 0;
  return Math.floor(wordCount / 2);
}
