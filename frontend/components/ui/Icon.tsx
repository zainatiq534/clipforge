import type { ReactNode } from "react";
import type { LucideIcon, LucideProps } from "lucide-react";
import { cn } from "@/lib/cn";

export type IconSize = "xs" | "sm" | "md" | "lg";

const sizeClass: Record<IconSize, string> = {
  xs: "h-3 w-3",
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

type IconProps = LucideProps & {
  icon: LucideIcon;
  size?: IconSize;
  className?: string;
};

/** Lucide icon wrapper with shared sizes. */
export function Icon({
  icon: Lucide,
  size = "md",
  className,
  strokeWidth = 2.25,
  ...props
}: IconProps) {
  return (
    <Lucide
      className={cn(sizeClass[size], "shrink-0", className)}
      strokeWidth={strokeWidth}
      aria-hidden
      {...props}
    />
  );
}

type IconBadgeProps = {
  children: ReactNode;
  className?: string;
};

/** Circular tinted wrapper used around small icons (stats, demo play). */
export function IconBadge({ children, className }: IconBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#8b5cf6]/20 text-[#c4a1ff]",
        className,
      )}
    >
      {children}
    </span>
  );
}

type PlayCircleProps = {
  className?: string;
};

export function PlayCircleIcon({ className }: PlayCircleProps) {
  return (
    <span
      className={cn(
        "inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/40",
        className,
      )}
    >
      <svg viewBox="0 0 12 12" className="h-3 w-3 fill-white" aria-hidden>
        <path d="M3 1.5v9l8-4.5-8-4.5z" />
      </svg>
    </span>
  );
}
