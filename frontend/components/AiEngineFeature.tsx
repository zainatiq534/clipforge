import {
  ArrowRight,
  ArrowUpRight,
  Bolt,
  Layers,
  Scissors,
  Sparkles,
} from "lucide-react";
import { AiEngineShowcase } from "@/components/AiEngineShowcase";
import { GradientButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

const featureCards = [
  {
    icon: Scissors,
    title: "5–10 clips per video",
    description: "Get multiple ready-to-post clips from every recording.",
  },
  {
    icon: Layers,
    title: "Batch generation",
    description: "Process multiple videos at once.",
  },
  {
    icon: Bolt,
    title: "More content, less effort",
    description: "Save hours of editing time with AI.",
  },
  {
    icon: Sparkles,
    title: "Multiple hook variations",
    description: "Different angles, captions and hooks for every clip.",
  },
];

const clipThumbs = [
  "/features/clip-thumb-1.jpg?v=hq2",
  "/features/clip-thumb-2.jpg?v=hq2",
  "/features/clip-thumb-3.jpg?v=hq2",
  "/features/clip-thumb-4.jpg?v=hq2",
] as const;

/** Crisp isometric stacked-layers icon (same as reference). */
function LayersStackIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* Top diamond */}
      <path
        d="M16 2.5 L28.5 9.5 L16 16.5 L3.5 9.5 Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Middle chevron */}
      <path
        d="M3.5 15.5 L16 22.5 L28.5 15.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* Bottom chevron */}
      <path
        d="M3.5 21.5 L16 28.5 L28.5 21.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

type AiEngineFeatureProps = {
  className?: string;
};

export function AiEngineFeature({ className }: AiEngineFeatureProps) {
  return (
    <section
      id="ai-engine"
      className={cn("relative w-full", className)}
    >
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col px-5 py-10 sm:px-8 sm:py-12 lg:py-14">
        {/* Header — centered */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-sans text-[1.9rem] leading-[1.1] font-extrabold tracking-[-0.03em] text-[#0a0a1a] sm:text-[2.25rem] lg:text-[2.5rem]">
            One Video,{" "}
            <span className="bg-gradient-to-r from-[#a855f7] via-[#8b5cf6] to-[#6366f1] bg-clip-text text-transparent">
              Multiple Clips
            </span>
          </h2>

          <p className="mt-4 font-sans text-[1.05rem] font-bold leading-snug text-[#0f172a] sm:text-[1.125rem]">
            Multiply your content output from every recording
          </p>

          <p className="mx-auto mt-3 max-w-2xl font-sans text-[0.9375rem] leading-[1.65] text-[#4b5563] sm:text-base">
            ClipForge AI analyzes your long-form video, finds the highest-performing
            moments, and generates multiple viral-ready clips — so one recording becomes
            a full week of content.
          </p>
        </div>

        {/* 4 feature cards — solid purple icons + soft glow (matched to reference) */}
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
          {featureCards.map((card) => (
            <div
              key={card.title}
              className="rounded-[18px] bg-white px-4 py-4 shadow-[0_8px_28px_rgba(15,23,42,0.06)] sm:px-5 sm:py-5"
            >
              <div className="flex items-start gap-3.5">
                <span
                  className="relative inline-flex h-12 w-12 shrink-0 items-center justify-center text-[#8A3FFC]"
                  style={{
                    background:
                      "radial-gradient(circle at center, rgba(138,63,252,0.22) 0%, rgba(243,232,255,0.45) 42%, transparent 72%)",
                  }}
                >
                  <Icon
                    icon={card.icon}
                    size="lg"
                    fill="currentColor"
                    strokeWidth={1.5}
                    className="relative z-10 h-6 w-6"
                  />
                </span>
                <div className="min-w-0 pt-0.5">
                  <p className="font-sans text-[0.95rem] font-bold leading-snug tracking-[-0.01em] text-[#161616]">
                    {card.title}
                  </p>
                  <p className="mt-1 font-sans text-[0.8125rem] leading-snug text-[#666666] sm:text-sm">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Workflow visual */}
        <div className="mt-8 lg:mt-10">
          <AiEngineShowcase />
        </div>

        {/* Stats bar — same as reference */}
        <div className="mt-8 rounded-[22px] border border-[#ebe6f8] bg-white px-4 py-4 shadow-[0_0_0_1px_rgba(196,181,253,0.25),0_12px_36px_rgba(124,58,237,0.1)] sm:mt-10 sm:rounded-[26px] sm:px-6 sm:py-5">
          <div className="flex flex-col items-stretch gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-5">
            {/* Left — clips generated + thumbs */}
            <div className="flex min-w-0 flex-wrap items-center gap-3 sm:gap-4">
              <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
                <LayersStackIcon className="h-8 w-7 shrink-0 text-[#7c3aed] sm:h-9 sm:w-8" />
                <div className="min-w-0">
                  <p className="font-sans text-[14px] leading-tight font-bold text-[#1a1c4e] sm:text-[15px]">
                    5 clips generated
                  </p>
                  <p className="mt-0.5 font-sans text-[12px] leading-tight text-[#707490] sm:text-[13px]">
                    from 1 long video
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-2.5">
                {clipThumbs.map((src) => (
                  <span
                    key={src}
                    className="relative h-[3.35rem] w-[3.35rem] shrink-0 overflow-hidden rounded-[11px] ring-[1.5px] ring-[#d8b4fe] sm:h-14 sm:w-14 sm:rounded-[12px]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt=""
                      width={1024}
                      height={1024}
                      className="absolute inset-0 h-full w-full object-cover object-[50%_28%]"
                      decoding="async"
                      fetchPriority="high"
                      draggable={false}
                    />
                  </span>
                ))}
                <span className="inline-flex h-[3.35rem] w-[3.35rem] shrink-0 flex-col items-center justify-center rounded-full border-[1.5px] border-[#c4b5fd] bg-[#f5f3ff] sm:h-14 sm:w-14">
                  <span className="font-sans text-[12px] leading-none font-extrabold text-[#7c3aed] sm:text-[13px]">
                    +3
                  </span>
                  <span className="mt-0.5 font-sans text-[9px] leading-none font-semibold text-[#a78bfa]">
                    more
                  </span>
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden h-10 w-px shrink-0 bg-[#e5e0f0] lg:block" />

            {/* Right — reach */}
            <div className="flex min-w-0 flex-wrap items-center gap-3 sm:gap-4 lg:gap-5">
              <div className="flex items-center gap-2.5">
                <svg
                  className="h-6 w-7 shrink-0 sm:h-7 sm:w-8"
                  viewBox="0 0 32 28"
                  fill="none"
                  aria-hidden
                >
                  <defs>
                    <linearGradient id="reachBars" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#c4b5fd" />
                      <stop offset="100%" stopColor="#6d28d9" />
                    </linearGradient>
                  </defs>
                  {[8, 14, 20, 26].map((barH, i) => (
                    <rect
                      key={i}
                      x={2 + i * 7.5}
                      y={28 - barH}
                      width="5"
                      height={barH}
                      rx="1.5"
                      fill="url(#reachBars)"
                    />
                  ))}
                </svg>
                <p className="max-w-[5.5rem] font-sans text-[12px] leading-snug font-semibold text-[#1a1c4e] sm:text-[13px]">
                  Estimated total reach
                </p>
              </div>

              <span
                className="bg-gradient-to-b from-[#a78bfa] to-[#6d28d9] bg-clip-text font-sans text-[1.85rem] leading-none font-extrabold tracking-tight text-transparent sm:text-[2.15rem]"
              >
                5.2M+
              </span>

              <div className="flex items-start gap-1.5 sm:gap-2">
                <ArrowUpRight
                  className="mt-0.5 h-5 w-5 shrink-0 text-[#7c3aed] sm:h-6 sm:w-6"
                  strokeWidth={2.8}
                />
                <div>
                  <p className="font-sans text-[15px] leading-none font-extrabold text-[#7c3aed] sm:text-[16px]">
                    +420%
                  </p>
                  <p className="mt-1 max-w-[7.5rem] font-sans text-[10px] leading-snug text-[#707490] sm:text-[11px]">
                    more reach than a single video
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8 flex justify-center sm:mt-9">
          <GradientButton
            size="lg"
            href="#start"
            rightIcon={<Icon icon={ArrowRight} size="md" />}
            className="min-w-[16rem]"
          >
            Start Creating Clips
          </GradientButton>
        </div>
      </div>
    </section>
  );
}
