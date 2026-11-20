"use client";

import { useMemo } from "react";

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

  const hoursLabel = `${hours.toFixed(1).replace(".", ",")}h`;

  return (
    <section className="rounded-[22px] bg-white p-3.5 shadow-[0_10px_28px_rgba(20,20,40,0.06)]">
      <h2 className="font-sans text-[13px] font-bold text-[#1a1a1f]">Data</h2>
      <p className="mt-3 font-display text-[1.55rem] leading-none font-extrabold tracking-tight text-[#1a1a1f] tabular-nums transition-opacity duration-300 sm:text-[1.85rem]">
        {loading ? (
          <span className="inline-block h-[1.1em] w-16 animate-pulse rounded bg-[#f3f1f8]" />
        ) : (
          hoursLabel
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
            </defs>

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

            <path d={AREA} fill="url(#dataAreaFill)" />
            <path
              d={LINE}
              fill="none"
              stroke="url(#dataStroke)"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {points.map((p) => (
              <circle
                key={`${p.cx}-${p.cy}`}
                cx={p.cx}
                cy={p.cy}
                r="3.2"
                fill="#fff"
                stroke="#8b5cf6"
                strokeWidth="2"
              />
            ))}
          </svg>
        </div>

        <div className="space-y-1.5 font-sans text-[10px] font-semibold tabular-nums">
          {percents.map((item) => (
            <p key={item.suffix} className={item.color}>
              {loading ? (
                <span className="inline-block h-3 w-14 animate-pulse rounded bg-[#f3f1f8]" />
              ) : (
                <>
                  {item.prefix}
                  {item.value}
                  {item.suffix}
                </>
              )}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

const LINE =
  "M4 40 C18 38, 24 22, 38 24 S56 42, 70 30 S94 10, 116 16";
const AREA =
  "M4 40 C18 38, 24 22, 38 24 S56 42, 70 30 S94 10, 116 16 V52 H4 Z";

const points = [
  { cx: 38, cy: 24 },
  { cx: 70, cy: 30 },
  { cx: 116, cy: 16 },
];
