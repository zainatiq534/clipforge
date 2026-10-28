"use client";

import { motion, useReducedMotion } from "framer-motion";

const bars = [
  { height: 58, color: "#ddd6fe", delay: 0.12 },
  { height: 88, color: "#c4b5fd", delay: 0.28 },
  { height: 42, color: "#a78bfa", delay: 0.44 },
] as const;

const ease = [0.16, 1, 0.3, 1] as const;

export function ImpactCard() {
  const reduce = useReducedMotion();

  return (
    <section className="rounded-[22px] bg-white p-3.5 shadow-[0_10px_28px_rgba(20,20,40,0.06)]">
      <h2 className="font-sans text-[13px] font-bold text-[#1a1a1f]">Impact</h2>
      <div className="mt-3 flex h-20 items-end justify-center gap-3 px-2">
        {bars.map((bar, index) =>
          reduce ? (
            <div
              key={bar.color}
              className="w-7 rounded-full"
              style={{ height: `${bar.height}%`, backgroundColor: bar.color }}
            />
          ) : (
            <motion.div
              key={bar.color}
              className="w-7 rounded-full will-change-transform"
              style={{ backgroundColor: bar.color }}
              initial={{ height: "0%" }}
              animate={{
                height: [
                  "0%",
                  `${bar.height}%`,
                  `${Math.min(bar.height + 8, 100)}%`,
                  `${Math.max(bar.height - 5, 18)}%`,
                  `${bar.height}%`,
                ],
              }}
              transition={{
                duration: 2.8,
                ease,
                delay: bar.delay,
                times: [0, 0.35, 0.55, 0.78, 1],
                repeat: Infinity,
                repeatDelay: 0.35 + index * 0.12,
              }}
            />
          ),
        )}
      </div>
    </section>
  );
}
