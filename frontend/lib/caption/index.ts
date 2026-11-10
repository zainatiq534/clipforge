export type {
  CaptionPack,
  CaptionPackDesign,
  CaptionPackMotion,
  CaptionStyle,
  EmphasizeEffect,
  LayoutPresetId,
  TransitionType,
  WordEnterMotion,
} from "./types";
export { DEFAULT_CAPTION_STYLE } from "./types";
export { BUILT_IN_CAPTION_PACKS } from "./captionPacks";
export {
  applyTextCase,
  captionLineCss,
  emphasizeWordCss,
  fontWeightFromFace,
  lineEnterClass,
  normalWordCss,
  pickEmphasizeWordIndex,
  styleFromPack,
  wordEnterClass,
} from "./captionRender";

import { BUILT_IN_CAPTION_PACKS } from "./captionPacks";
import type { CaptionPack } from "./types";

export const CAPTION_PACKS: CaptionPack[] = [...BUILT_IN_CAPTION_PACKS];

export const CAPTION_PACK_FILTER_TAGS = [
  "All",
  "Simple",
  "Minimal",
  "Clean",
  "Subtitle",
  "Bold",
  "Viral",
  "Outline",
  "Color",
  "Glow",
  "Fun",
  "Podcast",
  "Desi",
  "Business",
  "Tech",
  "Premium",
  "Motion",
] as const;

export function getCaptionPack(id: string): CaptionPack | undefined {
  return CAPTION_PACKS.find((p) => p.id === id);
}

export function filterCaptionPacks(
  packs: CaptionPack[],
  query: string,
  tag: string,
): CaptionPack[] {
  const q = query.trim().toLowerCase();
  return packs.filter((p) => {
    const tagOk =
      tag === "All" || p.tags.some((t) => t.toLowerCase() === tag.toLowerCase());
    if (!tagOk) return false;
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.id.includes(q)
    );
  });
}
