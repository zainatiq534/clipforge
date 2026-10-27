"use client";

import { Eye, Heart, MoreHorizontal, Play } from "lucide-react";
import { AppPageHero } from "@/components/dashboard/AppPageHero";
import { DashboardMotion } from "@/components/dashboard/DashboardMotion";
import { cn } from "@/lib/cn";

const projects = [
  {
    title: "Brand Workshop Recap",
    clips: 12,
    views: "2.4k",
    likes: "840",
    status: "Published",
    gradient: "from-[#a78bfa] via-[#8b5cf6] to-[#3b82f6]",
  },
  {
    title: "Product Launch Teaser",
    clips: 8,
    views: "1.8k",
    likes: "612",
    status: "Draft",
    gradient: "from-[#c4b5fd] via-[#a78bfa] to-[#7c3aed]",
  },
  {
    title: "Founder AMA Highlights",
    clips: 15,
    views: "4.1k",
    likes: "1.2k",
    status: "Published",
    gradient: "from-[#8b5cf6] via-[#7c3aed] to-[#3b82f6]",
  },
  {
    title: "Weekly Podcast Ep. 14",
    clips: 6,
    views: "980",
    likes: "301",
    status: "Processing",
    gradient: "from-[#ddd6fe] via-[#a78bfa] to-[#60a5fa]",
  },
  {
    title: "Customer Story Cutdowns",
    clips: 9,
    views: "3.2k",
    likes: "924",
    status: "Published",
    gradient: "from-[#a78bfa] via-[#8b5cf6] to-[#6366f1]",
  },
  {
    title: "Behind the Scenes",
    clips: 4,
    views: "640",
    likes: "188",
    status: "Draft",
    gradient: "from-[#8b5cf6] via-[#6366f1] to-[#3b82f6]",
  },
];

export function ProjectsPage() {
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <DashboardMotion delay={0.08}>
        <AppPageHero
          title="Projects & videos"
          description="All your long-form uploads and generated clip sets in one place. Open any project to edit, caption, or export."
          action="+ New project"
        />
      </DashboardMotion>

      <DashboardMotion delay={0.14}>
        <div className="flex flex-wrap items-center gap-2">
          {["All", "Published", "Draft", "Processing"].map((filter, i) => (
            <button
              key={filter}
              type="button"
              className={cn(
                "rounded-[14px] px-3.5 py-1.5 font-sans text-[11px] font-semibold transition",
                i === 0
                  ? "bg-gradient-to-r from-[#a78bfa] via-[#8b5cf6] to-[#3b82f6] text-white shadow-[0_8px_20px_rgba(99,102,241,0.28)]"
                  : "bg-[#ede9fe] text-[#6b6680] hover:text-[#111827]",
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </DashboardMotion>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {projects.map((project, i) => (
          <DashboardMotion key={project.title} delay={0.16 + i * 0.05}>
            <article className="rounded-[22px] bg-white p-3 shadow-[0_10px_28px_rgba(20,20,40,0.06)]">
              <div
                className={`relative flex h-36 items-center justify-center overflow-hidden rounded-[18px] bg-gradient-to-br ${project.gradient}`}
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-[14px] bg-white/90 text-[#7c3aed] shadow">
                  <Play className="h-4 w-4 fill-current" />
                </span>
                <button
                  type="button"
                  className="absolute top-2.5 right-2.5 inline-flex h-8 w-8 items-center justify-center rounded-[12px] bg-black/25 text-white backdrop-blur-sm"
                  aria-label="More"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 px-1 pb-1">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-sans text-[13px] font-bold text-[#111827]">
                    {project.title}
                  </h2>
                  <span className="shrink-0 rounded-[10px] bg-[#ede9fe] px-2 py-0.5 font-sans text-[10px] font-semibold text-[#7c3aed]">
                    {project.status}
                  </span>
                </div>
                <p className="mt-1 font-sans text-[11px] text-[#7a738c]">
                  {project.clips} clips
                </p>
                <div className="mt-2.5 flex items-center gap-3 font-sans text-[10px] text-[#7a738c]">
                  <span className="inline-flex items-center gap-1">
                    <Eye className="h-3 w-3" /> {project.views}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Heart className="h-3 w-3" /> {project.likes}
                  </span>
                </div>
              </div>
            </article>
          </DashboardMotion>
        ))}
      </div>
    </div>
  );
}
