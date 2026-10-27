"use client";

import { animate, motion, useMotionValue, useReducedMotion, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

const stats = {
  weekly: {
    left: 47,
    right: 77,
    complete: 37,
    progress: 12,
    bars: [42, 58, 35, 72, 64, 88, 51],
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  monthly: {
    left: 186,
    right: 312,
    complete: 154,
    progress: 28,
    bars: [48, 62, 55, 70, 78, 66, 84, 91, 73, 68, 80, 95],
    labels: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  },
} as const;

const ease = [0.16, 1, 0.3, 1] as const;

function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const reduce = useReducedMotion();
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      return;
    }
    const controls = animate(motionValue, value, {
      duration: 0.85,
      ease: [0.16, 1, 0.3, 1],
    });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [value, motionValue, rounded, reduce]);

  return <span className={className}>{display}</span>;
}

export function StatisticsCard() {
  const [range, setRange] = useState<"weekly" | "monthly">("weekly");
  const reduce = useReducedMotion();
  const data = stats[range];

  return (
    <section className="rounded-[22px] bg-white p-3.5 shadow-[0_10px_28px_rgba(20,20,40,0.06)] sm:p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-sans text-[13px] font-bold text-[#1a1a1f]">Statistics</h2>
        <div className="inline-flex rounded-full bg-[#f3f1f8] p-1">
          {(["weekly", "monthly"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setRange(key)}
              className={cn(
                "relative rounded-full px-3 py-1 font-sans text-[11px] font-semibold transition-colors",
                range === key ? "text-white" : "text-[#6b6680] hover:text-[#1a1a1f]",
              )}
            >
              {range === key ? (
                <motion.span
                  layoutId="stats-range-pill"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-[#a78bfa] via-[#8b5cf6] to-[#3b82f6]"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              ) : null}
              <span className="relative z-10">
                {key === "weekly" ? "Weekly" : "Monthly"}
              </span>
            </button>
          ))}
        </div>
      </div>

      <motion.div
        key={`nums-${range}`}
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease }}
        className="mt-3 flex items-end gap-3 font-display text-[2rem] leading-none font-extrabold tracking-tight text-[#1a1a1f]"
      >
        <AnimatedNumber value={data.left} />
        <span className="pb-1 text-[#c4b5fd]">|</span>
        <AnimatedNumber value={data.right} />
      </motion.div>
      <p className="mt-1.5 font-sans text-[11px] text-[#8b849c]">
        {range === "weekly"
          ? "Clips published | Exports this week"
          : "Clips published | Exports this month"}
      </p>

      {/* Animated graph - weekly days / monthly months */}
      <motion.div
        key={`graph-${range}`}
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="mt-3 flex h-16 items-end gap-1.5 sm:gap-2"
      >
        {data.bars.map((h, i) => (
          <div key={`${range}-${i}`} className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
            <div className="flex h-16 w-full items-end justify-center">
              <motion.div
                className="w-full max-w-[18px] rounded-full bg-gradient-to-t from-[#a78bfa] to-[#ddd6fe]"
                initial={reduce ? false : { height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{
                  duration: 0.75,
                  ease,
                  delay: reduce ? 0 : 0.05 + i * 0.05,
                }}
              />
            </div>
            <span className="font-sans text-[9px] font-medium text-[#9a93a8]">
              {data.labels[i]}
            </span>
          </div>
        ))}
      </motion.div>

      <div className="mt-3 grid grid-cols-2 gap-2.5">
        <motion.div
          key={`c-${range}`}
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease, delay: 0.1 }}
          className="rounded-[18px] bg-[#f6f4fb] px-4 py-3"
        >
          <p className="font-sans text-[11px] text-[#6b6680]">Project complete</p>
          <p className="mt-1 font-display text-[1.5rem] font-bold text-[#1a1a1f]">
            <AnimatedNumber value={data.complete} />
          </p>
        </motion.div>
        <motion.div
          key={`p-${range}`}
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease, delay: 0.18 }}
          className="rounded-[18px] bg-[#f6f4fb] px-4 py-3"
        >
          <p className="font-sans text-[11px] text-[#6b6680]">Project in progress</p>
          <p className="mt-1 font-display text-[1.5rem] font-bold text-[#1a1a1f]">
            <AnimatedNumber value={data.progress} />
          </p>
        </motion.div>
      </div>
    </section>
  );
}
