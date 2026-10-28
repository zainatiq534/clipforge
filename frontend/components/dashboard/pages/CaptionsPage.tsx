"use client";

import { AlignCenter, AlignLeft, Type } from "lucide-react";
import { AppPageHero } from "@/components/dashboard/AppPageHero";
import { DashboardMotion } from "@/components/dashboard/DashboardMotion";
import { GradientButton } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const styles = ["Bold Pop", "Clean Sans", "Neon Hook", "Soft Serif"];
const lines = [
  { time: "0:02", text: "Nobody talks about this part…" },
  { time: "0:06", text: "But this is where growth actually starts." },
  { time: "0:11", text: "Watch what happens next." },
];

export function CaptionsPage() {
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <DashboardMotion delay={0.08}>
        <AppPageHero
          title="Captions editor"
          description="Auto-generated, editable captions with styles built for TikTok, Shorts, and Reels."
          action="Generate captions"
        />
      </DashboardMotion>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.9fr)]">
        <DashboardMotion delay={0.14}>
          <section className="rounded-[22px] bg-white p-3.5 shadow-[0_10px_28px_rgba(20,20,40,0.06)] sm:p-4">
            <div className="relative mx-auto flex aspect-[9/14] max-h-[420px] w-full items-end justify-center overflow-hidden rounded-[18px] bg-gradient-to-br from-[#050814] via-[#4c1d95] to-[#3b82f6] sm:aspect-video sm:max-h-none">
              <div className="absolute inset-x-6 bottom-10 rounded-2xl bg-black/35 px-4 py-3 text-center backdrop-blur-sm">
                <p className="font-sans text-[15px] leading-snug font-extrabold text-white sm:text-[18px]">
                  Nobody talks about this part…
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <GradientButton size="sm" leftIcon={<Type className="h-3.5 w-3.5" />}>
                Style
              </GradientButton>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#ede9fe] text-[#6b6680]"
                aria-label="Align left"
              >
                <AlignLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-[12px] bg-gradient-to-br from-[#a78bfa] to-[#3b82f6] text-white"
                aria-label="Align center"
              >
                <AlignCenter className="h-4 w-4" />
              </button>
            </div>
          </section>
        </DashboardMotion>

        <div className="flex flex-col gap-3">
          <DashboardMotion direction="right" delay={0.18}>
            <section className="rounded-[22px] bg-white p-3.5 shadow-[0_10px_28px_rgba(20,20,40,0.06)]">
              <h2 className="font-sans text-[13px] font-bold text-[#111827]">Caption styles</h2>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {styles.map((style, i) => (
                  <button
                    key={style}
                    type="button"
                    className={cn(
                      "rounded-[14px] px-3 py-3 text-left font-sans text-[12px] font-semibold transition",
                      i === 0
                        ? "bg-gradient-to-r from-[#a78bfa] via-[#8b5cf6] to-[#3b82f6] text-white shadow-[0_8px_20px_rgba(99,102,241,0.28)]"
                        : "bg-[#ede9fe] text-[#6b6680] hover:text-[#111827]",
                    )}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </section>
          </DashboardMotion>

          <DashboardMotion direction="right" delay={0.24}>
            <section className="rounded-[22px] bg-white p-3.5 shadow-[0_10px_28px_rgba(20,20,40,0.06)]">
              <h2 className="font-sans text-[13px] font-bold text-[#111827]">Transcript</h2>
              <div className="mt-3 space-y-2">
                {lines.map((line) => (
                  <button
                    key={line.time}
                    type="button"
                    className="flex w-full items-start gap-3 rounded-[16px] bg-[#faf5ff] px-3 py-2.5 text-left transition hover:bg-[#ede9fe]"
                  >
                    <span className="shrink-0 rounded-[10px] bg-[#ede9fe] px-2 py-0.5 font-sans text-[10px] font-bold text-[#7c3aed]">
                      {line.time}
                    </span>
                    <span className="font-sans text-[12px] font-medium text-[#111827]">
                      {line.text}
                    </span>
                  </button>
                ))}
              </div>
              <GradientButton size="sm" fullWidth className="mt-4">
                Save captions
              </GradientButton>
            </section>
          </DashboardMotion>
        </div>
      </div>
    </div>
  );
}
