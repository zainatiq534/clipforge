"use client";

import { type ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/cn";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Delay in seconds before this item animates */
  delay?: number;
  /** Slight horizontal drift instead of pure fade-up */
  from?: "up" | "left" | "right" | "none";
  /** Animate on first mount (hero) instead of on scroll */
  immediate?: boolean;
};

const ease = [0.22, 1, 0.36, 1] as const;

function makeVariants(from: RevealProps["from"], reduced: boolean): Variants {
  if (reduced) {
    return { hidden: { opacity: 1 }, show: { opacity: 1 } };
  }

  const offset =
    from === "left" ? { x: -18, y: 0 } : from === "right" ? { x: 18, y: 0 } : from === "none" ? { x: 0, y: 0 } : { x: 0, y: 18 };

  return {
    hidden: { opacity: 0, ...offset },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.55, ease },
    },
  };
}

/** Soft fade/slide reveal — neat, once-on-view, reduced-motion safe */
export function Reveal({
  children,
  className,
  delay = 0,
  from = "up",
  immediate = false,
}: RevealProps) {
  const reduced = useReducedMotion() ?? false;
  const variants = makeVariants(from, reduced);

  return (
    <motion.div
      className={cn(className)}
      variants={variants}
      initial="hidden"
      {...(immediate
        ? { animate: "show" }
        : { whileInView: "show", viewport: { once: true, amount: 0.2, margin: "0px 0px -8% 0px" } })}
      transition={{ delay, duration: 0.55, ease }}
    >
      {children}
    </motion.div>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  /** Stagger gap between children (seconds) */
  stagger?: number;
};

/** Parent that staggers child Reveal items (or any motion children with variants) */
export function Stagger({ children, className, stagger = 0.08 }: StaggerProps) {
  const reduced = useReducedMotion() ?? false;

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -6% 0px" }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: reduced ? 0 : stagger,
            delayChildren: reduced ? 0 : 0.04,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Child item for use inside Stagger */
export function StaggerItem({
  children,
  className,
  from = "up",
}: {
  children: ReactNode;
  className?: string;
  from?: RevealProps["from"];
}) {
  const reduced = useReducedMotion() ?? false;
  const variants = makeVariants(from, reduced);

  return (
    <motion.div className={cn(className)} variants={variants}>
      {children}
    </motion.div>
  );
}
