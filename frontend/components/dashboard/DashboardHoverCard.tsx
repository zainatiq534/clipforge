"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const spring = {
  type: "spring" as const,
  stiffness: 420,
  damping: 28,
  mass: 0.5,
};

type DashboardHoverCardProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Smooth “pop” on hover: lifts, soft scales, and strengthens the card shadow.
 */
export function DashboardHoverCard({
  children,
  className,
}: DashboardHoverCardProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={cn(
        "group relative h-full will-change-transform [&>*]:h-full [&>*]:transition-[box-shadow,background-color] [&>*]:duration-300 [&>*]:ease-out",
        "[&>*]:hover:bg-white [&>*]:hover:shadow-[0_22px_50px_rgba(15,15,25,0.12)]",
        className,
      )}
      whileHover={
        reduce
          ? undefined
          : {
              y: -8,
              scale: 1.03,
              zIndex: 24,
            }
      }
      transition={spring}
    >
      {children}
    </motion.div>
  );
}
