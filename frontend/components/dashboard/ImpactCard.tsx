"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

type ImpactCardProps = {
  ready: number;
  clips: number;
  avgScore: number;
  loading?: boolean;
};

export function ImpactCard({
  ready,
  clips,
  avgScore,
  loading,
}: ImpactCardProps) {
  const reduce = useReducedMotion();

  const bars = useMemo(() => {
    const countMax = Math.max(1, ready, clips);
    return [
      {
        label: "Ready",
        value: ready,
        height: loading
          ? 20
          : Math.max(12, Math.round((ready / countMax) * 100)),
        color: "#ddd6fe",
        delay: 0.15,
      },
      {
        label: "Clips",
        value: clips,
        height: loading
          ? 35
          : Math.max(12, Math.round((clips / countMax) * 100)),
        color: "#c4b5fd",
        delay: 0.32,
      },
      {
        label: "Score",
        value: avgScore,
        height: loading ? 28 : Math.max(12, Math.round(avgScore)),
        color: "#a78bfa",
        delay: 0.48,
      },
    ] as const;
  }, [ready, clips, avgScore, loading]);

  return (
    <section className="rounded-[22px] bg-white p-3.5 shadow-[0_10px_28px_rgba(20,20,40,0.06)]">
      <h2 className="font-sans text-[13px] font-bold text-[#1a1a1f]">Impact</h2>
      <div className="mt-3 flex h-20 items-end justify-center gap-3 px-2">
        {bars.map((bar, index) =>
          reduce ? (
            <div
              key={bar.label}
              className="relative flex w-7 flex-col items-center"
            >
              <div
                className="w-7 rounded-full"
                style={{
                  height: `${bar.height}%`,
                  backgroundColor: bar.color,
                }}
              />
            </div>
          ) : (
            <motion.div
              key={bar.label}
              className="relative w-7 origin-bottom rounded-full will-change-transform"
              style={{ backgroundColor: bar.color }}
              initial={{ height: "0%", opacity: 0.35 }}
              animate={{
                height: `${bar.height}%`,
                opacity: 1,
              }}
              transition={{
                height: {
                  duration: 1.15,
                  ease,
                  delay: bar.delay,
                },
                opacity: { duration: 0.4, delay: bar.delay },
              }}
              whileHover={{
                height: `${Math.min(bar.height + 10, 100)}%`,
                transition: { type: "spring", stiffness: 360, damping: 22 },
              }}
              title={`${bar.label}: ${bar.value}`}
            >
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 h-3 rounded-full bg-white/35"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.95 + index * 0.12, duration: 0.45 }}
                style={{ position: "relative", display: "block" }}
              />
            </motion.div>
          ),
        )}
      </div>
      <div className="mt-2 flex justify-center gap-4 font-sans text-[9px] font-semibold text-[#7a738c]">
        {bars.map((b) => (
          <span key={b.label}>
            {b.label} {loading ? "—" : b.value}
          </span>
        ))}
      </div>
    </section>
  );
}
