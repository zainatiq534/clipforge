export type {
  TextCase,
  TextShape,
  TextStyleCore,
  TextStyleDesign,
  TextStylePack,
} from "./types";
export { DEFAULT_TEXT_STYLE } from "./types";
export { BUILT_IN_TEXT_STYLE_PACKS } from "./textStylePacks";
export {
  applyTextCase,
  fontWeightFromFace,
  resolveTextStyle,
  textOverlayCss,
  textPreviewCss,
} from "./textStyleRender";

import { BUILT_IN_TEXT_STYLE_PACKS } from "./textStylePacks";
import type { TextStylePack } from "./types";

export const TEXT_STYLE_PACKS: TextStylePack[] = [...BUILT_IN_TEXT_STYLE_PACKS];

export const TEXT_STYLE_FILTER_TAGS = [
  "All",
  "Simple",
  "Clean",
  "Minimal",
  "Bold",
  "Viral",
  "Shape",
  "Color",
  "Gradient",
  "Glow",
  "Outline",
  "Fun",
  "Premium",
  "Tech",
  "Business",
  "Podcast",
  "Subtitle",
  "Desi",
] as const;

export function getTextStylePack(id: string): TextStylePack | undefined {
  return TEXT_STYLE_PACKS.find((p) => p.id === id);
}

export function filterTextStylePacks(
  packs: TextStylePack[],
  query: string,
  tag: string,
): TextStylePack[] {
  const q = query.trim().toLowerCase();
  return packs.filter((p) => {
    const tagOk =
      tag === "All" || p.tags.some((t) => t.toLowerCase() === tag.toLowerCase());
    if (!tagOk) return false;
    if (!q) return true;
    return (
      p.label.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.id.includes(q)
    );
  });
}
