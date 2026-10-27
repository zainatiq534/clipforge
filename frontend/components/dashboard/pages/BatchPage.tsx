"use client";

import { Layers, Loader2 } from "lucide-react";
import { AppPageHero } from "@/components/dashboard/AppPageHero";
import { DashboardMotion } from "@/components/dashboard/DashboardMotion";
import { GradientButton } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const jobs = [
  {
    name: "Podcast Ep.14 — 12 clips",
    progress: 100,
    status: "Done",
    eta: "Finished",
  },
  {
    name: "Launch webinar batch",
    progress: 68,
    status: "Running",
    eta: "~4 min left",
  },
  {
    name: "Customer interviews set",
    progress: 22,
    status: "Queued",
    eta: "Waiting",
  },
  {
    name: "Weekly shorts pack",
    progress: 0,
    status: "Queued",
    eta: "Waiting",
  },
];

export function BatchPage() {
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <DashboardMotion delay={0.08}>
        <AppPageHero
          title="Batch clips"
          description="Process multiple videos at once — highlights, captions, reframes, and scores in a single queue."
          action="+ New batch"
        />
      </DashboardMotion>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: "Active jobs", value: "2" },
          { label: "Clips today", value: "38" },
          { label: "Queue", value: "2" },
        ].map((stat, i) => (
          <DashboardMotion key={stat.label} delay={0.12 + i * 0.05}>
            <section className="rounded-[22px] bg-white p-3.5 shadow-[0_10px_28px_rgba(20,20,40,0.06)]">
              <h2 className="font-sans text-[13px] font-bold text-[#111827]">{stat.label}</h2>
              <p className="mt-3 font-display text-[1.85rem] leading-none font-extrabold tracking-tight text-[#111827]">
                {stat.value}
              </p>
            </section>
          </DashboardMotion>
        ))}
      </div>

      <DashboardMotion delay={0.26}>
        <section className="rounded-[22px] bg-white p-3.5 shadow-[0_10px_28px_rgba(20,20,40,0.06)] sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-sans text-[13px] font-bold text-[#111827]">Batch queue</h2>
            <Layers className="h-4 w-4 text-[#8b5cf6]" strokeWidth={1.8} />
          </div>

          <div className="mt-3 space-y-2.5">
            {jobs.map((job) => (
              <article key={job.name} className="rounded-[18px] bg-[#faf5ff] p-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-sans text-[12px] font-semibold text-[#111827]">{job.name}</p>
                    <p className="mt-0.5 font-sans text-[11px] text-[#7a738c]">{job.eta}</p>
                  </div>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-[10px] px-2.5 py-1 font-sans text-[10px] font-semibold",
                      job.status === "Done" && "bg-[#dcfce7] text-[#15803d]",
                      job.status === "Running" && "bg-[#ede9fe] text-[#7c3aed]",
                      job.status === "Queued" && "bg-white text-[#6b6680]",
                    )}
                  >
                    {job.status === "Running" ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : null}
                    {job.status}
                  </span>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#ede9fe]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#a78bfa] via-[#8b5cf6] to-[#3b82f6]"
                    style={{ width: `${job.progress}%` }}
                  />
                </div>
              </article>
            ))}
          </div>

          <GradientButton size="sm" className="mt-4 w-full sm:w-auto">
            Start next batch
          </GradientButton>
        </section>
      </DashboardMotion>
    </div>
  );
}
