"use client";

import { Crop, Smartphone } from "lucide-react";
import { AppPageHero } from "@/components/dashboard/AppPageHero";
import { DashboardMotion } from "@/components/dashboard/DashboardMotion";
import { GradientButton } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const ratios = [
  { label: "9:16", desc: "TikTok / Reels / Shorts", active: true },
  { label: "1:1", desc: "Feed square" },
  { label: "16:9", desc: "Landscape / YouTube" },
];

export function ReframePage() {
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <DashboardMotion delay={0.08}>
        <AppPageHero
          title="AI reframe (9:16)"
          description="Keep the speaker in frame automatically. Perfect vertical crops for every short-form platform."
          action="Auto reframe"
        />
      </DashboardMotion>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <DashboardMotion delay={0.14}>
          <section className="rounded-[22px] bg-white p-3.5 shadow-[0_10px_28px_rgba(20,20,40,0.06)] sm:p-4">
            <div className="grid grid-cols-[1.2fr_0.7fr] gap-3">
              <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-[18px] bg-gradient-to-br from-[#ede9fe] via-[#a78bfa] to-[#3b82f6]">
                <div className="absolute inset-y-3 left-1/2 w-[38%] -translate-x-1/2 rounded-[14px] border-2 border-white/90 shadow-[0_0_0_9999px_rgba(5,8,20,0.28)]" />
                <span className="relative z-10 inline-flex items-center gap-1.5 rounded-[12px] bg-gradient-to-r from-[#a78bfa] via-[#8b5cf6] to-[#3b82f6] px-3 py-1.5 font-sans text-[11px] font-semibold text-white shadow-[0_8px_20px_rgba(99,102,241,0.3)]">
                  <Crop className="h-3.5 w-3.5" /> Active crop
                </span>
              </div>
              <div className="mx-auto flex aspect-[9/16] max-h-[280px] w-full items-end justify-center self-center overflow-hidden rounded-[22px] bg-gradient-to-br from-[#050814] via-[#7c3aed] to-[#3b82f6]">
                <div className="mb-6 rounded-xl bg-black/30 px-3 py-2 backdrop-blur-sm">
                  <Smartphone className="mx-auto h-4 w-4 text-white" />
                  <p className="mt-1 font-sans text-[10px] font-semibold text-white">9:16 preview</p>
                </div>
              </div>
            </div>
          </section>
        </DashboardMotion>

        <div className="flex flex-col gap-3">
          <DashboardMotion direction="right" delay={0.18}>
            <section className="rounded-[22px] bg-white p-3.5 shadow-[0_10px_28px_rgba(20,20,40,0.06)]">
              <h2 className="font-sans text-[13px] font-bold text-[#111827]">Aspect ratio</h2>
              <div className="mt-3 space-y-2">
                {ratios.map((ratio) => (
                  <button
                    key={ratio.label}
                    type="button"
                    className={cn(
                      "flex w-full items-center justify-between rounded-[16px] px-3.5 py-3 text-left transition",
                      ratio.active
                        ? "bg-gradient-to-r from-[#a78bfa] via-[#8b5cf6] to-[#3b82f6] text-white shadow-[0_8px_20px_rgba(99,102,241,0.28)]"
                        : "bg-[#faf5ff] text-[#111827] hover:bg-[#ede9fe]",
                    )}
                  >
                    <span>
                      <span className="block font-sans text-[12px] font-bold">{ratio.label}</span>
                      <span
                        className={cn(
                          "block font-sans text-[11px]",
                          ratio.active ? "text-white/75" : "text-[#7a738c]",
                        )}
                      >
                        {ratio.desc}
                      </span>
                    </span>
                    {ratio.active ? (
                      <span className="rounded-[10px] bg-white/20 px-2.5 py-1 font-sans text-[10px] font-bold text-white">
                        Active
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            </section>
          </DashboardMotion>

          <DashboardMotion direction="right" delay={0.24}>
            <section className="relative overflow-hidden rounded-[22px] bg-[#ede9fe] p-3.5 shadow-[0_8px_22px_rgba(124,58,237,0.12)]">
              <h2 className="relative z-10 max-w-[12rem] font-sans text-[1.05rem] leading-snug font-extrabold text-[#111827]">
                Track faces automatically
              </h2>
              <p className="relative z-10 mt-1.5 font-sans text-[12px] text-[#5b21b6]/75">
                AI keeps the subject centered as they move.
              </p>
              <GradientButton size="sm" className="relative z-10 mt-4">
                Apply to all clips
              </GradientButton>
            </section>
          </DashboardMotion>
        </div>
      </div>
    </div>
  );
}
