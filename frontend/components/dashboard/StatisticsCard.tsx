"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";

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
                "rounded-full px-3 py-1 font-sans text-[11px] font-semibold transition-colors",
                range === key
                  ? "bg-gradient-to-r from-[#a78bfa] via-[#8b5cf6] to-[#3b82f6] text-white"
                  : "text-[#6b6680] hover:text-[#1a1a1f]",
              )}
            >
              {key === "weekly" ? "Weekly" : "Monthly"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-end gap-2 font-display text-[1.55rem] leading-none font-extrabold tracking-tight text-[#1a1a1f] sm:gap-3 sm:text-[2rem]">
        <span>{loading ? "—" : data.left}</span>
        <span className="pb-1 text-[#c4b5fd]">|</span>
        <span>{loading ? "—" : data.right}</span>
      </div>
      <p className="mt-1.5 font-sans text-[11px] text-[#8b849c]">
        {range === "weekly"
          ? "Clips created | Uploads this week"
          : "Clips created | Uploads this month"}
      </p>

      <div className="mt-3 flex h-14 items-end gap-1 overflow-x-auto sm:h-16 sm:gap-2">
        {data.bars.map((h, i) => (
          <div
            key={`${range}-${i}`}
            className="flex min-w-[1.1rem] flex-1 flex-col items-center gap-1 sm:min-w-0 sm:gap-1.5"
          >
            <div className="flex h-14 w-full items-end justify-center sm:h-16">
              <div
                className="w-full max-w-[18px] rounded-full bg-gradient-to-t from-[#a78bfa] to-[#ddd6fe] transition-[height] duration-300 ease-out"
                style={{ height: `${loading ? 8 : h}%` }}
              />
            </div>
            <span className="font-sans text-[9px] font-medium text-[#9a93a8]">
              {data.labels[i]}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2.5">
        <div className="rounded-[18px] bg-[#f6f4fb] px-4 py-3">
          <p className="font-sans text-[11px] text-[#6b6680]">Projects ready</p>
          <p className="mt-1 font-display text-[1.5rem] font-bold text-[#1a1a1f]">
            {loading ? "—" : data.complete}
          </p>
        </div>
        <div className="rounded-[18px] bg-[#f6f4fb] px-4 py-3">
          <p className="font-sans text-[11px] text-[#6b6680]">In progress</p>
          <p className="mt-1 font-display text-[1.5rem] font-bold text-[#1a1a1f]">
            {loading ? "—" : data.progress}
          </p>
        </div>
      </div>
    </section>
  );
}
