"use client";

import {
  Captions,
  Crop,
  Pause,
  Play,
  Scissors,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";
import { AppPageHero } from "@/components/dashboard/AppPageHero";
import { DashboardMotion } from "@/components/dashboard/DashboardMotion";
import { GradientButton } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const tools = [
  { label: "Trim", icon: Scissors, active: true },
  { label: "Captions", icon: Captions },
  { label: "Reframe", icon: Crop },
];

const clips = [
  { id: "A", color: "from-[#a78bfa] to-[#8b5cf6]", start: "0:12", end: "0:38" },
  { id: "B", color: "from-[#8b5cf6] to-[#6366f1]", start: "1:02", end: "1:27" },
  { id: "C", color: "from-[#6366f1] to-[#3b82f6]", start: "2:14", end: "2:41" },
];

export function EditorPage() {
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <DashboardMotion delay={0.08}>
        <AppPageHero
          title="Clip editor"
          description="Trim highlights, tighten pacing, and polish clips before export — same brand buttons and soft cards as your workspace."
          action="Export clip"
        />
      </DashboardMotion>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.55fr)_minmax(240px,0.7fr)]">
        <DashboardMotion delay={0.14}>
          <section className="rounded-[22px] bg-white p-3.5 shadow-[0_10px_28px_rgba(20,20,40,0.06)] sm:p-4">
            <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-[18px] bg-gradient-to-br from-[#050814] via-[#2a2240] to-[#3b82f6]">
              <button
                type="button"
                className="inline-flex h-14 w-14 items-center justify-center rounded-[16px] bg-gradient-to-br from-[#a78bfa] via-[#8b5cf6] to-[#3b82f6] text-white shadow-lg"
                aria-label="Play"
              >
                <Play className="h-5 w-5 fill-current" />
              </button>
              <div className="absolute inset-x-4 bottom-4 rounded-[16px] bg-black/35 px-3 py-2 backdrop-blur-sm">
                <div className="h-1.5 overflow-hidden rounded-full bg-white/20">
                  <div className="h-full w-[42%] rounded-full bg-gradient-to-r from-[#a78bfa] to-[#3b82f6]" />
                </div>
                <div className="mt-2 flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <SkipBack className="h-3.5 w-3.5" />
                    <Pause className="h-3.5 w-3.5" />
                    <SkipForward className="h-3.5 w-3.5" />
                  </div>
                  <span className="font-sans text-[10px]">0:18 / 0:42</span>
                  <Volume2 className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h2 className="font-sans text-[13px] font-bold text-[#111827]">Timeline</h2>
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                {clips.map((clip) => (
                  <div
                    key={clip.id}
                    className={cn(
                      "min-w-[7.5rem] rounded-[16px] bg-gradient-to-r px-3 py-3 text-white",
                      clip.color,
                    )}
                  >
                    <p className="font-sans text-[11px] font-bold">Clip {clip.id}</p>
                    <p className="mt-1 font-sans text-[10px] opacity-80">
                      {clip.start} – {clip.end}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </DashboardMotion>

        <div className="flex flex-col gap-3">
          <DashboardMotion direction="right" delay={0.18}>
            <section className="rounded-[22px] bg-white p-3.5 shadow-[0_10px_28px_rgba(20,20,40,0.06)]">
              <h2 className="font-sans text-[13px] font-bold text-[#111827]">Tools</h2>
              <div className="mt-3 space-y-2">
                {tools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <button
                      key={tool.label}
                      type="button"
                      className={cn(
                        "flex w-full items-center gap-3 rounded-[14px] px-3 py-2.5 font-sans text-[12px] font-semibold transition",
                        tool.active
                          ? "bg-gradient-to-r from-[#a78bfa] via-[#8b5cf6] to-[#3b82f6] text-white shadow-[0_8px_20px_rgba(99,102,241,0.28)]"
                          : "bg-[#ede9fe] text-[#6b6680] hover:text-[#111827]",
                      )}
                    >
                      <Icon className="h-4 w-4" strokeWidth={1.8} />
                      {tool.label}
                    </button>
                  );
                })}
              </div>
            </section>
          </DashboardMotion>

          <DashboardMotion direction="right" delay={0.26}>
            <section className="rounded-[22px] bg-[#ede9fe] p-3.5 shadow-[0_8px_22px_rgba(124,58,237,0.12)]">
              <h2 className="font-sans text-[1.05rem] leading-snug font-extrabold text-[#111827]">
                Auto-cut silence
              </h2>
              <p className="mt-1.5 font-sans text-[12px] text-[#5b21b6]/75">
                Remove dead air and keep only high-energy moments.
              </p>
              <GradientButton size="sm" className="mt-4">
                Run AI trim
              </GradientButton>
            </section>
          </DashboardMotion>
        </div>
      </div>
    </div>
  );
}
