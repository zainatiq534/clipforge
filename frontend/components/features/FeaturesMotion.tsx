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

/** Soft ease-out — less snap, more glide */
const ease = [0.16, 1, 0.3, 1] as const;

function sectionVariants(direction: FeaturesMotionDirection): Variants {
  const hidden =
    direction === "left"
      ? { opacity: 0, x: -28, y: 6 }
      : direction === "right"
        ? { opacity: 0, x: 28, y: 6 }
        : direction === "scale"
          ? { opacity: 0, scale: 0.98, y: 14 }
          : direction === "fade"
            ? { opacity: 0 }
            : { opacity: 0, y: 28 };

  return {
    hidden,
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.95,
        ease,
        when: "beforeChildren",
        staggerChildren: 0.1,
        delayChildren: 0.06,
      },
    },
  };
}

const childVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease },
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
      viewport={{ once: true, amount: 0.12, margin: "0px 0px -6% 0px" }}
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
      viewport={{ once: true, amount: 0.15 }}
    >
      {children}
    </motion.div>
  );
}
