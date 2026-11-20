import type { ReactNode } from "react";

type DashboardMotionProps = {
  children: ReactNode;
  className?: string;
  /** Kept for call-site compatibility — ignored (no enter animation). */
  delay?: number;
  direction?: "up" | "left" | "right" | "fade";
};

/** Instant mount — no Framer Motion on dashboard chrome/pages. */
export function DashboardMotion({
  children,
  className,
}: DashboardMotionProps) {
  if (className) return <div className={className}>{children}</div>;
  return <>{children}</>;
}
