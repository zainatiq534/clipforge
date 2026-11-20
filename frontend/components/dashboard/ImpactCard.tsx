"use client";

import { useMemo } from "react";

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
      },
      {
        label: "Clips",
        value: clips,
        height: loading
          ? 35
          : Math.max(12, Math.round((clips / countMax) * 100)),
        color: "#c4b5fd",
      },
      {
        label: "Score",
        value: avgScore,
        height: loading ? 28 : Math.max(12, Math.round(avgScore)),
        color: "#a78bfa",
      },
    ] as const;
  }, [ready, clips, avgScore, loading]);

  return (
    <section className="rounded-[22px] bg-white p-3.5 shadow-[0_10px_28px_rgba(20,20,40,0.06)]">
      <h2 className="font-sans text-[13px] font-bold text-[#1a1a1f]">Impact</h2>
      <div className="mt-3 flex h-20 items-end justify-center gap-3 px-2">
        {bars.map((bar) => (
          <div key={bar.label} className="relative flex w-7 flex-col items-center">
            <div
              className="w-7 rounded-full transition-[height] duration-300 ease-out"
              style={{
                height: `${bar.height}%`,
                backgroundColor: bar.color,
              }}
              title={`${bar.label}: ${bar.value}`}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-center gap-4 font-sans text-[10px] font-semibold text-[#6b6680]">
        {bars.map((bar) => (
          <span key={bar.label}>
            {bar.label} · {loading ? "—" : bar.value}
          </span>
        ))}
      </div>
    </section>
  );
}
