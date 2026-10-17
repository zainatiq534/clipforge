import {
  ArrowRight,
  Bolt,
  Layers,
  Scissors,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { AiEngineShowcase } from "@/components/AiEngineShowcase";
import { AppImage } from "@/components/ui/Image";
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

const thumbAvatars = [
  "/features/avatar-1.jpg",
  "/features/avatar-2.jpg",
  "/features/avatar-3.jpg",
  "/features/avatar-4.jpg",
];

type AiEngineFeatureProps = {
  className?: string;
};

export function AiEngineFeature({ className }: AiEngineFeatureProps) {
  return (
    <section
      id="ai-engine"
      className={cn("relative w-full", className)}
    >
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-5 py-14 sm:px-8 sm:py-16 lg:py-20">
        {/* Header — centered */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#d8b4fe] bg-[#f5f3ff] px-3 py-[6px]">
            <Icon icon={Bolt} size="sm" className="text-[#8b5cf6]" />
            <span className="font-sans text-[11px] font-bold tracking-[0.12em] text-[#7c3aed] uppercase">
              Powerful Feature
            </span>
          </div>

          <h2 className="font-sans mt-5 text-[2.35rem] leading-[1.1] font-extrabold tracking-[-0.03em] text-[#0a0a1a] sm:text-[2.75rem] lg:text-[3.25rem]">
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
        <div className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
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
        <div className="mt-10 lg:mt-12">
          <AiEngineShowcase />
        </div>

        {/* Stats bar */}
        <div className="mt-8 flex flex-col gap-4 rounded-[18px] border border-[#e8e4f5] bg-white px-4 py-4 shadow-[0_8px_28px_rgba(15,23,42,0.05)] sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-5 sm:py-4">
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-sans text-sm font-bold text-[#0f172a]">5 clips generated</p>
            <div className="flex items-center">
              {thumbAvatars.map((src, i) => (
                <span
                  key={src}
                  className={cn(
                    "relative h-8 w-8 overflow-hidden rounded-full border-2 border-white shadow-sm",
                    i > 0 && "-ml-2",
                  )}
                >
                  <AppImage src={src} alt="" fill className="object-cover" sizes="32px" />
                </span>
              ))}
              <span className="-ml-2 inline-flex h-8 items-center rounded-full border-2 border-white bg-[#f3e8ff] px-2 font-sans text-[10px] font-bold text-[#7c3aed]">
                +3 more
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="font-sans text-sm text-slate-500">Estimated total reach</span>
            <span className="font-sans text-2xl font-extrabold tracking-tight text-[#7c3aed] sm:text-[1.75rem]">
              5.2M+
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#f0fdf4] px-3 py-1.5">
            <Icon icon={TrendingUp} size="sm" className="text-emerald-600" />
            <p className="font-sans text-[12px] font-semibold text-emerald-700 sm:text-[13px]">
              +420% more reach than a single video
            </p>
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
