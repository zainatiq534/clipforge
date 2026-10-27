"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const ease = [0.16, 1, 0.3, 1] as const;

type DashboardMotionProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "fade";
};

export function DashboardMotion({
  children,
  className,
  delay = 0,
  direction = "up",
}: DashboardMotionProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  const initial =
    direction === "left"
      ? { opacity: 0, x: -24 }
      : direction === "right"
        ? { opacity: 0, x: 24 }
        : direction === "fade"
          ? { opacity: 0 }
          : { opacity: 0, y: 20 };

  return (
    <motion.div
      className={cn("will-change-transform", className)}
      initial={initial}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.7, ease, delay }}
    >
      {children}
    </motion.div>
  );
}
