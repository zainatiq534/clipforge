"use client";

import { Flame, TrendingUp } from "lucide-react";
import { AppPageHero } from "@/components/dashboard/AppPageHero";
import { DashboardMotion } from "@/components/dashboard/DashboardMotion";
import { GradientButton } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const rankings = [
  {
    rank: 1,
    title: "Hook: “Nobody talks about this…”",
    score: 96,
    reason: "Strong opening hook + emotion peak",
    views: "18.2k",
  },
  {
    rank: 2,
    title: "Product demo surprise reveal",
    score: 91,
    reason: "Clear payoff + high retention mid-clip",
    views: "12.6k",
  },
  {
    rank: 3,
    title: "Founder story 0:42–1:08",
    score: 87,
    reason: "Story tension + shareable punchline",
    views: "9.4k",
  },
  {
    rank: 4,
    title: "Myth vs fact segment",
    score: 82,
    reason: "Curiosity gap + fast cuts",
    views: "7.1k",
  },
  {
    rank: 5,
    title: "Q&A hot take #3",
    score: 78,
    reason: "Controversial angle + clean captions",
    views: "5.8k",
  },
  {
    rank: 6,
    title: "Behind-the-scenes tease",
    score: 71,
    reason: "Good pacing, weaker CTA",
    views: "3.2k",
  },
];

export function ViralPage() {
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <DashboardMotion delay={0.08}>
        <AppPageHero
          title="Viral score ranking"
          description="AI ranks every clip by predicted engagement and explains why — so you publish the winners first."
          action="Rescore project"
        />
      </DashboardMotion>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: "Top score", value: "96", icon: Flame },
          { label: "Avg score", value: "84", icon: TrendingUp },
          { label: "Clips scored", value: "42", icon: Flame },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <DashboardMotion key={stat.label} delay={0.12 + i * 0.06}>
              <section className="rounded-[22px] bg-white p-3.5 shadow-[0_10px_28px_rgba(20,20,40,0.06)]">
                <div className="flex items-center justify-between">
                  <h2 className="font-sans text-[13px] font-bold text-[#111827]">{stat.label}</h2>
                  <Icon className="h-4 w-4 text-[#8b5cf6]" strokeWidth={1.8} />
                </div>
                <p className="mt-3 font-display text-[1.85rem] leading-none font-extrabold tracking-tight text-[#111827]">
                  {stat.value}
                </p>
              </section>
            </DashboardMotion>
          );
        })}
      </div>

      <DashboardMotion delay={0.28}>
        <section className="rounded-[22px] bg-white p-3.5 shadow-[0_10px_28px_rgba(20,20,40,0.06)] sm:p-4">
          <h2 className="font-sans text-[13px] font-bold text-[#111827]">Ranked clips</h2>
          <div className="mt-3 space-y-2.5">
            {rankings.map((clip) => (
              <article
                key={clip.rank}
                className="flex flex-col gap-3 rounded-[18px] bg-[#faf5ff] p-3 sm:flex-row sm:items-center"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <span
                    className={cn(
                      "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] font-sans text-[12px] font-bold",
                      clip.rank <= 3
                        ? "bg-gradient-to-br from-[#a78bfa] via-[#8b5cf6] to-[#3b82f6] text-white"
                        : "bg-[#ede9fe] text-[#7c3aed]",
                    )}
                  >
                    #{clip.rank}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-sans text-[12px] font-semibold text-[#111827]">
                      {clip.title}
                    </p>
                    <p className="mt-0.5 font-sans text-[11px] text-[#7a738c]">{clip.reason}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:shrink-0">
                  <div className="min-w-[7rem]">
                    <div className="mb-1 flex items-center justify-between font-sans text-[10px] font-semibold">
                      <span className="text-[#6b6680]">Score</span>
                      <span className="text-[#111827]">{clip.score}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[#ede9fe]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#a78bfa] via-[#8b5cf6] to-[#3b82f6]"
                        style={{ width: `${clip.score}%` }}
                      />
                    </div>
                  </div>
                  <GradientButton size="sm">Open</GradientButton>
                </div>
              </article>
            ))}
          </div>
        </section>
      </DashboardMotion>
    </div>
  );
}
