import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type TypographyVariant =
  | "display"
  | "h1"
  | "h2"
  | "h3"
  | "body"
  | "bodySm"
  | "nav"
  | "label"
  | "stat"
  | "caption";

export type TypographyTone =
  | "white"
  | "muted"
  | "purple"
  | "gradient"
  | "ink"
  | "mutedInk"
  | "brand";
export type TypographyWeight = "normal" | "medium" | "semibold" | "bold";

const variantClass: Record<TypographyVariant, string> = {
  display:
    "font-display text-[2.5rem] leading-[1.1] font-bold tracking-tight sm:text-5xl lg:text-[3.5rem]",
  h1: "font-display text-4xl font-bold tracking-tight sm:text-5xl",
  h2: "font-display text-3xl font-bold tracking-tight sm:text-4xl",
  h3: "font-display text-xl font-semibold tracking-tight sm:text-2xl",
  body: "font-sans text-base leading-relaxed sm:text-lg",
  bodySm: "font-sans text-sm leading-relaxed sm:text-base",
  nav: "font-sans text-sm font-medium tracking-wide",
  label: "font-sans text-xs font-semibold tracking-[0.14em] uppercase",
  stat: "font-display text-lg font-bold tracking-tight sm:text-xl",
  caption: "font-sans text-sm text-white/65",
};

const toneClass: Record<TypographyTone, string> = {
  white: "text-white",
  muted: "text-white/70",
  purple: "text-[#c4a1ff]",
  gradient:
    "bg-gradient-to-r from-[#b56cff] via-[#9b6bff] to-[#6ea8ff] bg-clip-text text-transparent",
  ink: "text-[#1f2937]",
  mutedInk: "text-[#6b7280]",
  brand: "text-[#7c3aed]",
};

const weightClass: Record<TypographyWeight, string> = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

type TypographyProps = {
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  variant?: TypographyVariant;
  /** @deprecated use `variant` */
  size?: TypographyVariant;
  tone?: TypographyTone;
  weight?: TypographyWeight;
  children: ReactNode;
  className?: string;
} & Omit<HTMLAttributes<HTMLElement>, "children" | "className">;

export function Typography({
  as: Tag = "p",
  variant,
  size,
  tone = "white",
  weight,
  children,
  className,
  ...props
}: TypographyProps) {
  const resolvedVariant = variant ?? size ?? "body";

  return (
    <Tag
      className={cn(
        variantClass[resolvedVariant],
        toneClass[tone],
        weight && weightClass[weight],
        className,
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
