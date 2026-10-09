import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type TextTone = "white" | "muted" | "purple" | "gradient";

const toneClass: Record<TextTone, string> = {
  white: "text-white",
  muted: "text-white/70",
  purple: "text-[#c4a1ff]",
  gradient:
    "bg-gradient-to-r from-[#b56cff] via-[#9b6bff] to-[#6ea8ff] bg-clip-text text-transparent",
};

const sizeClass = {
  display:
    "font-display text-[2.5rem] leading-[1.1] font-bold tracking-tight sm:text-5xl lg:text-[3.5rem]",
  h2: "font-display text-3xl font-bold tracking-tight sm:text-4xl",
  h3: "font-display text-xl font-semibold tracking-tight sm:text-2xl",
  body: "font-sans text-base leading-relaxed sm:text-lg",
  bodySm: "font-sans text-sm leading-relaxed sm:text-base",
  nav: "font-sans text-sm font-medium tracking-wide",
  label: "font-sans text-xs font-semibold tracking-[0.14em] uppercase",
  stat: "font-display text-lg font-bold tracking-tight sm:text-xl",
  caption: "font-sans text-sm text-white/65",
} as const;

type Size = keyof typeof sizeClass;

type TypographyProps = {
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
  size?: Size;
  tone?: TextTone;
  weight?: "normal" | "medium" | "semibold" | "bold";
  children: ReactNode;
  className?: string;
} & Omit<HTMLAttributes<HTMLElement>, "children" | "className">;

const weightClass = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
};

export function Typography({
  as: Tag = "p",
  size = "body",
  tone = "white",
  weight,
  children,
  className,
  ...props
}: TypographyProps) {
  return (
    <Tag
      className={cn(
        sizeClass[size],
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
