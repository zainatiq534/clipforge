export interface CaptionStyle {
  fontFamily: string;
  fontFace: string;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  textCase: "none" | "upper" | "lower" | "title";
  align: "left" | "center" | "right" | "justify";
  xPercent: number;
  yPercent: number;
  positionPinned?: boolean;
  colorMode: "solid" | "gradient";
  fill: string;
  stroke?: string;
  highlight?: string;
  transition?: string;
  wordReveal?: boolean;
}

export type TransitionType =
  | "none"
  | "fade"
  | "pop"
  | "zoom"
  | "scale"
  | "slide-left"
  | "slide-right"
  | "slide-up"
  | "slide-down";

export type WordEnterMotion = "none" | "pop" | "typewriter" | "fade";
export type EmphasizeEffect = "glow" | "scale" | "color-pop";
export type LayoutPresetId = "splash" | "center";

export interface CaptionPackMotion {
  lineEnter: TransitionType;
  wordEnter?: WordEnterMotion;
  emphasizeEffect?: EmphasizeEffect;
}

export interface CaptionPackDesign {
  emphasizeGradient?: [string, string];
  emphasizeShadow?: string;
  emphasizeScale?: number;
  normalShadow?: string;
  highlightBackdrop?: boolean;
  highlightBackdropColor?: string;
  backdrop?: boolean;
  backdropColor?: string;
  badge?: "new";
}

export interface CaptionPack {
  id: string;
  name: string;
  tags: string[];
  aspect?: "9:16" | "16:9" | "any";
  style: Partial<CaptionStyle>;
  motion?: CaptionPackMotion;
  layout?: LayoutPresetId;
  design?: CaptionPackDesign;
  previewBg?: string;
  previewLabel?: string;
  previewWords?: [string, string, string];
}

export const DEFAULT_CAPTION_STYLE: CaptionStyle = {
  fontFamily: "Montserrat",
  fontFace: "Extra Bold",
  fontSize: 44,
  bold: true,
  italic: false,
  underline: false,
  textCase: "upper",
  align: "center",
  xPercent: 50,
  yPercent: 72,
  colorMode: "solid",
  fill: "#FFFFFF",
  stroke: "#0F172A",
  highlight: "#8B5CF6",
  transition: "pop",
};
