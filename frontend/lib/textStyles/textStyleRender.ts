import type { CSSProperties } from "react";
import type { TextStyleCore, TextStyleDesign, TextStylePack } from "./types";
import { DEFAULT_TEXT_STYLE } from "./types";

const FONT_FACE_WEIGHT: Record<string, number> = {
  Regular: 400,
  Medium: 500,
  "Semi Bold": 600,
  Bold: 700,
  "Extra Bold": 800,
  Black: 900,
};

export function applyTextCase(
  text: string,
  textCase: TextStyleCore["textCase"] | undefined,
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

export function fontWeightFromFace(
  fontFace: string | undefined,
  bold?: boolean,
): number {
  const base = FONT_FACE_WEIGHT[fontFace ?? ""] ?? 500;
  if (bold && base < 700) return 800;
  return base;
}

export function resolveTextStyle(pack: TextStylePack): TextStyleCore {
  return { ...DEFAULT_TEXT_STYLE, ...pack.style };
}

export function textOverlayCss(
  style: TextStyleCore,
  design: TextStyleDesign,
): CSSProperties {
  const weight = fontWeightFromFace(style.fontFace, style.bold);
  const css: CSSProperties = {
    fontFamily: `"${style.fontFamily}", system-ui, sans-serif`,
    fontSize: "1em",
    fontWeight: weight,
    fontStyle: style.italic ? "italic" : "normal",
    textDecoration: style.underline ? "underline" : "none",
    letterSpacing: design.letterSpacing,
    lineHeight: 1.15,
    textAlign: "center",
    color: style.fill,
    WebkitTextStroke: style.stroke ? `1.6px ${style.stroke}` : undefined,
    paintOrder: style.stroke ? "stroke fill" : undefined,
    textShadow: design.shadow,
    display: "inline-block",
    maxWidth: "100%",
    wordBreak: "break-word",
    whiteSpace: "pre-wrap",
  };

  if (style.gradient) {
    const [a, b] = style.gradient;
    css.backgroundImage = `linear-gradient(90deg, ${a}, ${b})`;
    css.WebkitBackgroundClip = "text";
    css.backgroundClip = "text";
    css.color = "transparent";
    css.WebkitTextFillColor = "transparent";
    // Keep a light stroke readable under gradient fills
    if (style.stroke) {
      css.WebkitTextStroke = `1px ${style.stroke}`;
    }
  }

  if (style.fill === "transparent" && style.stroke) {
    css.color = "transparent";
    css.WebkitTextFillColor = "transparent";
    css.WebkitTextStroke = `2.25px ${style.stroke}`;
  }

  const px = design.paddingX ?? 12;
  const py = design.paddingY ?? 6;

  switch (design.shape) {
    case "pill":
      css.backgroundColor = design.shapeBg ?? "rgba(255,255,255,0.95)";
      css.borderRadius = 999;
      css.padding = `${py}px ${px}px`;
      css.WebkitTextFillColor = style.gradient ? "transparent" : style.fill;
      break;
    case "rounded":
      css.backgroundColor = design.shapeBg ?? "rgba(0,0,0,0.7)";
      css.borderRadius = 14;
      css.padding = `${py}px ${px}px`;
      break;
    case "box":
      css.backgroundColor = design.shapeBg ?? "#111827";
      css.borderRadius = 4;
      css.padding = `${py}px ${px}px`;
      if (design.shapeBorder) css.border = design.shapeBorder;
      break;
    case "glass":
      css.backgroundColor = design.shapeBg ?? "rgba(255,255,255,0.18)";
      css.borderRadius = 16;
      css.padding = `${py}px ${px}px`;
      css.border = design.shapeBorder ?? "1px solid rgba(255,255,255,0.35)";
      css.backdropFilter = "blur(10px)";
      css.WebkitBackdropFilter = "blur(10px)";
      break;
    case "badge":
      css.backgroundColor = design.shapeBg ?? "#22C55E";
      css.borderRadius = 8;
      css.padding = `${py}px ${px}px`;
      break;
    case "underline":
      css.borderBottom = `3px solid ${style.fill}`;
      css.paddingBottom = 4;
      break;
    default:
      break;
  }

  return css;
}

/** Preview tile sample — absolute size for the gallery card */
export function textPreviewCss(
  style: TextStyleCore,
  design: TextStyleDesign,
): CSSProperties {
  const css = textOverlayCss(style, design);
  css.fontSize = Math.max(13, Math.min(22, style.fontSize * 0.42));
  return css;
}
