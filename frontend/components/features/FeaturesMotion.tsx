"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type FeaturesMotionDirection = "up" | "left" | "right" | "scale" | "fade";

type FeaturesMotionProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: FeaturesMotionDirection;
};

const ease = [0.22, 1, 0.36, 1] as const;

function sectionVariants(direction: FeaturesMotionDirection): Variants {
  const hidden =
    direction === "left"
      ? { opacity: 0, x: -48, y: 12, filter: "blur(6px)" }
      : direction === "right"
        ? { opacity: 0, x: 48, y: 12, filter: "blur(6px)" }
        : direction === "scale"
          ? { opacity: 0, scale: 0.96, y: 20, filter: "blur(6px)" }
          : direction === "fade"
            ? { opacity: 0, filter: "blur(8px)" }
            : { opacity: 0, y: 40, filter: "blur(6px)" };

  return {
    hidden,
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.75,
        ease,
        when: "beforeChildren",
        staggerChildren: 0.08,
      },
    },
  };
}

const childVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease },
  },
};

/** Scroll-in presence for each features section. */
export function FeaturesMotion({
  children,
  className,
  delay = 0,
  direction = "up",
}: FeaturesMotionProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn("will-change-transform", className)}
      variants={sectionVariants(direction)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.16, margin: "0px 0px -8% 0px" }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

type FeaturesMotionItemProps = {
  children: ReactNode;
  className?: string;
};

/** Nested reveal — works inside non-motion wrappers via whileInView. */
export function FeaturesMotionItem({
  children,
  className,
}: FeaturesMotionItemProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={childVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
