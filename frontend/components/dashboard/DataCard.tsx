"use client";

import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useMemo, useState } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

const LINE =
  "M4 40 C18 38, 24 22, 38 24 S56 42, 70 30 S94 10, 116 16";
const AREA =
  "M4 40 C18 38, 24 22, 38 24 S56 42, 70 30 S94 10, 116 16 V52 H4 Z";

const points = [
  { cx: 38, cy: 24 },
  { cx: 70, cy: 30 },
  { cx: 116, cy: 16 },
];

function CountUp({
  to,
  duration = 1.2,
  delay = 0,
  decimals = 0,
  format,
  className,
}: {
  to: number;
  duration?: number;
  delay?: number;
  decimals?: number;
  format?: (n: number) => string;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState(reduce ? to : 0);

  useEffect(() => {
    if (reduce) {
      setDisplay(to);
      return;
    }
    motionValue.set(0);
    setDisplay(0);
    const controls = animate(motionValue, to, {
      duration,
      delay,
      ease,
    });
    const unsub = motionValue.on("change", (v) => {
      const next =
        decimals > 0 ? Number(v.toFixed(decimals)) : Math.round(v);
      setDisplay(next);
    });
    return () => {
      controls.stop();
      unsub();
    };
  }, [to, duration, delay, decimals, motionValue, reduce]);

  const text = format
    ? format(display)
    : decimals > 0
      ? display.toFixed(decimals).replace(".", ",")
      : String(display);

  return <span className={className}>{text}</span>;
}

type DataCardProps = {
  hours: number;
  clipCount: number;
  uploadCount: number;
  storagePercent: number;
  loading?: boolean;
};

export function DataCard({
  hours,
  clipCount,
  uploadCount,
  storagePercent,
  loading,
}: DataCardProps) {
  const reduce = useReducedMotion();

  const percents = useMemo(() => {
    const clipDelta = Math.min(99, clipCount * 8);
    const uploadDelta = Math.min(99, uploadCount * 10);
    const storageDelta = Math.round(storagePercent);
    return [
      {
        value: clipDelta,
        prefix: clipCount > 0 ? "+" : "",
        suffix: "% clips",
        color: clipCount > 0 ? "text-[#22c55e]" : "text-[#94a3b8]",
      },
      {
        value: uploadDelta,
        prefix: uploadCount > 0 ? "+" : "",
        suffix: "% uploads",
        color: uploadCount > 0 ? "text-[#22c55e]" : "text-[#94a3b8]",
      },
      {
        value: storageDelta,
        prefix: "",
        suffix: "% used",
        color: storageDelta > 80 ? "text-[#f59e0b]" : "text-[#94a3b8]",
      },
    ];
  }, [clipCount, uploadCount, storagePercent]);

  return (
    <section className="rounded-[22px] bg-white p-3.5 shadow-[0_10px_28px_rgba(20,20,40,0.06)]">
      <h2 className="font-sans text-[13px] font-bold text-[#1a1a1f]">Data</h2>
      <p className="mt-3 font-display text-[1.55rem] leading-none font-extrabold tracking-tight text-[#1a1a1f] sm:text-[1.85rem]">
        {loading ? (
          "—"
        ) : (
          <CountUp
            to={hours}
            decimals={1}
            duration={1.35}
            delay={0.1}
            format={(n) => `${n.toFixed(1).replace(".", ",")}h`}
          />
        )}
      </p>
      <p className="mt-1 font-sans text-[10px] text-[#8b849c]">
        Total uploaded video length
      </p>

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
              <clipPath id="dataAreaClip">
                <motion.rect
                  x="0"
                  y="0"
                  width="120"
                  height="52"
                  initial={reduce ? false : { scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  style={{ originX: 0, originY: 0.5 }}
                  transition={{ duration: 1.4, ease, delay: 0.2 }}
                />
              </clipPath>
            </defs>

            {[16, 28, 40].map((y, i) => (
              <motion.line
                key={y}
                x1="0"
                x2="120"
                y1={y}
                y2={y}
                stroke="#efeaf8"
                strokeWidth="1"
                initial={reduce ? false : { pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.05 + i * 0.08, ease }}
              />
            ))}

            <motion.path
              d={AREA}
              fill="url(#dataAreaFill)"
              clipPath="url(#dataAreaClip)"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.55, ease }}
            />

            <motion.path
              d={LINE}
              fill="none"
              stroke="url(#dataStroke)"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#dataGlow)"
              initial={reduce ? false : { pathLength: 0, opacity: 0.35 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.55, ease, delay: 0.18 }}
            />

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
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 380,
                  damping: 18,
                  delay: 1.05 + i * 0.18,
                }}
              />
            ))}
          </svg>
        </div>

        <div className="space-y-1.5 font-sans text-[10px] font-semibold">
          {percents.map((item, i) => (
            <motion.p
              key={`${item.suffix}`}
              className={item.color}
              initial={reduce ? false : { opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.85 + i * 0.12, ease }}
            >
              {item.prefix}
              <CountUp to={item.value} duration={1} delay={0.9 + i * 0.12} />
              {item.suffix}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}
