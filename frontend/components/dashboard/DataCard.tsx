"use client";

import { motion, useReducedMotion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

/** Smooth wave path across the chart */
const LINE =
  "M4 40 C18 38, 24 22, 38 24 S56 42, 70 30 S94 10, 116 16";
const AREA =
  "M4 40 C18 38, 24 22, 38 24 S56 42, 70 30 S94 10, 116 16 V52 H4 Z";

const points = [
  { cx: 38, cy: 24 },
  { cx: 70, cy: 30 },
  { cx: 116, cy: 16 },
];

const percents = [
  { label: "+80%", color: "text-[#22c55e]" },
  { label: "+50%", color: "text-[#22c55e]" },
  { label: "-0%", color: "text-[#94a3b8]" },
];

export function DataCard() {
  const reduce = useReducedMotion();

  return (
    <section className="rounded-[22px] bg-white p-3.5 shadow-[0_10px_28px_rgba(20,20,40,0.06)]">
      <h2 className="font-sans text-[13px] font-bold text-[#1a1a1f]">Dsta</h2>
      <motion.p
        className="mt-3 font-display text-[1.85rem] leading-none font-extrabold tracking-tight text-[#1a1a1f]"
        initial={reduce ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease }}
      >
        10,3h
      </motion.p>

      <div className="mt-4 flex items-end gap-3">
        <div className="relative min-w-0 flex-1">
          <svg
            viewBox="0 0 120 52"
            className="h-14 w-full overflow-visible"
            aria-hidden
          >
            <defs>
              <linearGradient id="dataAreaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.45" />
                <stop offset="55%" stopColor="#c4b5fd" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="dataStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#c4b5fd" />
                <stop offset="50%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
              <filter id="dataGlow" x="-20%" y="-40%" width="140%" height="180%">
                <feGaussianBlur stdDeviation="1.6" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Soft grid hints */}
            {[16, 28, 40].map((y) => (
              <line
                key={y}
                x1="0"
                x2="120"
                y1={y}
                y2={y}
                stroke="#efeaf8"
                strokeWidth="1"
              />
            ))}

            {/* Area fill draws in */}
            <motion.path
              d={AREA}
              fill="url(#dataAreaFill)"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.45, ease }}
            />

            {/* Line draws left ? right */}
            <motion.path
              d={LINE}
              fill="none"
              stroke="url(#dataStroke)"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#dataGlow)"
              initial={reduce ? false : { pathLength: 0, opacity: 0.4 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.35, ease, delay: 0.15 }}
            />

            {/* Animated dots on peaks */}
            {points.map((p, i) => (
              <motion.circle
                key={`${p.cx}-${p.cy}`}
                cx={p.cx}
                cy={p.cy}
                r="3.2"
                fill="#fff"
                stroke="#8b5cf6"
                strokeWidth="2"
                initial={reduce ? false : { scale: 0, opacity: 0 }}
                animate={{
                  scale: [1, 1.25, 1],
                  opacity: 1,
                }}
                transition={{
                  scale: {
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1 + i * 0.25,
                  },
                  opacity: { duration: 0.35, delay: 0.9 + i * 0.15 },
                }}
              />
            ))}
          </svg>
        </div>

        <div className="space-y-1.5 font-sans text-[10px] font-semibold">
          {percents.map((item, i) => (
            <motion.p
              key={item.label}
              className={item.color}
              initial={reduce ? false : { opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, delay: 0.55 + i * 0.12, ease }}
            >
              {item.label}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}
