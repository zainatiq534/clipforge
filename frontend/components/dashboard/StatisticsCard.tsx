"use client";

import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

const ease = [0.16, 1, 0.3, 1] as const;

function AnimatedNumber({
  value,
  className,
  delay = 0,
}: {
  value: number;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      return;
    }
    motionValue.set(0);
    setDisplay(0);
    const controls = animate(motionValue, value, {
      duration: 1.2,
      delay,
      ease,
    });
    const unsub = rounded.on("change", (v) => setDisplay(v));
    return () => {
      controls.stop();
      unsub();
    };
  }, [value, motionValue, rounded, reduce, delay]);

  return <span className={className}>{display}</span>;
}

export type StatsRangeData = {
  left: number;
  right: number;
  complete: number;
  progress: number;
  bars: number[];
  labels: string[];
};

type StatisticsCardProps = {
  week: StatsRangeData;
  month: StatsRangeData;
  loading?: boolean;
};

export function StatisticsCard({ week, month, loading }: StatisticsCardProps) {
  const [range, setRange] = useState<"weekly" | "monthly">("weekly");
  const reduce = useReducedMotion();
  const data = range === "weekly" ? week : month;

  return (
    <section className="rounded-[22px] bg-white p-3.5 shadow-[0_10px_28px_rgba(20,20,40,0.06)] sm:p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-sans text-[13px] font-bold text-[#1a1a1f]">
          Statistics
        </h2>
        <div className="inline-flex rounded-full bg-[#f3f1f8] p-1">
          {(["weekly", "monthly"] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setRange(key)}
              className={cn(
                "relative rounded-full px-3 py-1 font-sans text-[11px] font-semibold transition-colors",
                range === key
                  ? "text-white"
                  : "text-[#6b6680] hover:text-[#1a1a1f]",
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
        key={`nums-${range}-${data.left}-${data.right}`}
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease }}
        className="mt-3 flex flex-wrap items-end gap-2 font-display text-[1.55rem] leading-none font-extrabold tracking-tight text-[#1a1a1f] sm:gap-3 sm:text-[2rem]"
      >
        <AnimatedNumber value={loading ? 0 : data.left} delay={0.12} />
        <span className="pb-1 text-[#c4b5fd]">|</span>
        <AnimatedNumber value={loading ? 0 : data.right} delay={0.22} />
      </motion.div>
      <p className="mt-1.5 font-sans text-[11px] text-[#8b849c]">
        {range === "weekly"
          ? "Clips created | Uploads this week"
          : "Clips created | Uploads this month"}
      </p>

      <motion.div
        key={`graph-${range}`}
        className="mt-3 flex h-14 items-end gap-1 overflow-x-auto sm:h-16 sm:gap-2"
      >
        {data.bars.map((h, i) => (
          <div
            key={`${range}-${i}`}
            className="flex min-w-[1.1rem] flex-1 flex-col items-center gap-1 sm:min-w-0 sm:gap-1.5"
          >
            <div className="flex h-14 w-full items-end justify-center sm:h-16">
              <motion.div
                className="w-full max-w-[18px] origin-bottom rounded-full bg-gradient-to-t from-[#a78bfa] to-[#ddd6fe]"
                initial={reduce ? false : { height: "0%", opacity: 0.4 }}
                animate={{ height: `${loading ? 8 : h}%`, opacity: 1 }}
                transition={{
                  duration: 1.05,
                  ease,
                  delay: reduce ? 0 : 0.2 + i * 0.06,
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
          key={`c-${range}-${data.complete}`}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.35 }}
          className="rounded-[18px] bg-[#f6f4fb] px-4 py-3"
        >
          <p className="font-sans text-[11px] text-[#6b6680]">Projects ready</p>
          <p className="mt-1 font-display text-[1.5rem] font-bold text-[#1a1a1f]">
            <AnimatedNumber value={loading ? 0 : data.complete} delay={0.4} />
          </p>
        </motion.div>
        <motion.div
          key={`p-${range}-${data.progress}`}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: 0.45 }}
          className="rounded-[18px] bg-[#f6f4fb] px-4 py-3"
        >
          <p className="font-sans text-[11px] text-[#6b6680]">
            In progress
          </p>
          <p className="mt-1 font-display text-[1.5rem] font-bold text-[#1a1a1f]">
            <AnimatedNumber value={loading ? 0 : data.progress} delay={0.5} />
          </p>
        </motion.div>
      </div>
    </section>
  );
}
