export type TextCase = "none" | "upper" | "lower" | "title";

export type TextShape =
  | "none"
  | "pill"
  | "rounded"
  | "box"
  | "glass"
  | "badge"
  | "underline";

export interface TextStyleCore {
  fontFamily: string;
  fontFace: string;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  textCase: TextCase;
  fill: string;
  stroke?: string;
  /** When set, fill becomes a clipped gradient */
  gradient?: [string, string];
}

export interface TextStyleDesign {
  shape: TextShape;
  shapeBg?: string;
  shapeBorder?: string;
  shadow?: string;
  letterSpacing?: string;
  paddingX?: number;
  paddingY?: number;
}

export interface TextStylePack {
  id: string;
  label: string;
  preview: string;
  tags: string[];
  tileBg: string;
  style: TextStyleCore;
  design: TextStyleDesign;
}

export const DEFAULT_TEXT_STYLE: TextStyleCore = {
  fontFamily: "Montserrat",
  fontFace: "Extra Bold",
  fontSize: 40,
  bold: true,
  italic: false,
  underline: false,
  textCase: "none",
  fill: "#FFFFFF",
  stroke: undefined,
};
