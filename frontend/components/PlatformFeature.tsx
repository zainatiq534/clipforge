import { ArrowRight, Bolt, Crop, Layers, Palette, Star } from "lucide-react";
import { PlatformShowcase } from "@/components/PlatformShowcase";
import { AppImage } from "@/components/ui/Image";
import { GradientButton } from "@/components/ui/Button";
import { Icon, PlayCircleIcon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

const cards = [
  {
    icon: Layers,
    title: "Platform presets",
    description: "Auto-optimizes for TikTok, Reels & Shorts with one click.",
  },
  {
    icon: Crop,
    title: "Ready-to-post sizing",
    description: "Perfect aspect ratios, safe zones and formatting done for you.",
  },
  {
    icon: Palette,
    title: "Brand-consistent formatting",
    description: "Keep your fonts, colors, logos and style across all platforms.",
  },
  {
    icon: "hd" as const,
    title: "High-quality exports",
    description: "Crisp, professional videos optimized for every platform.",
  },
];

const avatars = [
  "/features/avatar-1.jpg",
  "/features/avatar-2.jpg",
  "/features/avatar-3.jpg",
  "/features/avatar-4.jpg",
];

type PlatformFeatureProps = {
  className?: string;
};

export function PlatformFeature({ className }: PlatformFeatureProps) {
  return (
    <section
      id="platform-optimization"
      className={cn("relative isolate w-full overflow-hidden", className)}
    >
      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-start gap-12 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10 lg:py-20 xl:gap-14">
        <div className="max-w-[34rem] pt-1 lg:max-w-[36rem] lg:pt-2">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#d8b4fe] bg-[#f5f3ff] px-3 py-[6px]">
            <Icon icon={Bolt} size="sm" className="text-[#8b5cf6]" />
            <span className="font-sans text-[11px] font-bold tracking-[0.12em] text-[#7c3aed] uppercase">
              Powerful Feature
            </span>
          </div>

          {/* Headline */}
          <h2 className="font-sans mt-5 text-[2.35rem] leading-[1.08] font-extrabold tracking-[-0.03em] text-[#0a0a1a] sm:text-[2.65rem] lg:text-[3rem]">
            Multi-Platform
            <br />
            <span className="bg-gradient-to-r from-[#a855f7] via-[#8b5cf6] to-[#6366f1] bg-clip-text text-transparent">
              Video Optimization
            </span>
          </h2>

          {/* Bold subhead */}
          <p className="mt-5 font-sans text-[1.05rem] font-bold leading-[1.45] tracking-[-0.01em] text-[#0f172a] sm:text-[1.125rem]">
            Automatic sizing, formatting, and export presets for TikTok, Reels, and
            YouTube Shorts.
          </p>

          {/* Body */}
          <p className="mt-3.5 font-sans text-[0.9375rem] leading-[1.65] text-[#4b5563] sm:text-base">
            ClipForge is built for creators, podcasters, coaches and agencies who want to
            repurpose long-form videos into engaging short-form content — ready for every
            platform without re-exporting.
          </p>

          {/* 2×2 feature cards */}
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5">
            {cards.map((card) => (
              <div
                key={card.title}
                className="rounded-[16px] border border-[#e8e4f5] bg-white px-3.5 py-3.5 shadow-[0_4px_18px_rgba(15,23,42,0.04)] sm:px-4 sm:py-4"
              >
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#f3e8ff] text-[#8b5cf6]">
                    {card.icon === "hd" ? (
                      <span className="font-sans text-[11px] font-extrabold tracking-tight text-[#8b5cf6]">
                        HD
                      </span>
                    ) : (
                      <Icon icon={card.icon} size="md" />
                    )}
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className="font-sans text-[0.9rem] font-bold leading-snug tracking-[-0.01em] text-[#0a0a1a]">
                      {card.title}
                    </p>
                    <p className="mt-1 font-sans text-[0.78rem] leading-snug text-[#6b7280] sm:text-[0.8125rem]">
                      {card.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-3.5">
            <GradientButton
              size="lg"
              href="#start"
              rightIcon={<Icon icon={ArrowRight} size="md" />}
              className="w-full sm:w-auto"
            >
              Start Creating Clips
            </GradientButton>
            <a
              href="#demo"
              className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-[18px] border border-slate-200 bg-white px-6 font-sans text-base font-semibold text-[#0f172a] shadow-sm transition-colors hover:bg-slate-50 sm:h-[3.25rem] sm:w-auto sm:rounded-[20px] sm:px-7"
            >
              <PlayCircleIcon className="border-slate-300 [&_svg]:fill-[#0f172a]" />
              Watch Demo
            </a>
          </div>

          {/* Social proof */}
          <div className="mt-9 flex flex-wrap items-center gap-5 sm:gap-6">
            <div className="flex items-center">
              {avatars.map((src, i) => (
                <span
                  key={src}
                  className={cn(
                    "relative h-10 w-10 overflow-hidden rounded-full border-2 border-white shadow-sm",
                    i > 0 && "-ml-2.5",
                  )}
                >
                  <AppImage src={src} alt="" fill className="object-cover" sizes="40px" />
                </span>
              ))}
              <span className="-ml-2.5 inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-[#ede9fe] text-[0.65rem] font-bold text-[#7c3aed] shadow-sm">
                +10K
              </span>
            </div>

            <div className="hidden h-10 w-px bg-slate-200 sm:block" aria-hidden />

            <div>
              <div className="flex items-center gap-0.5 text-[#f59e0b]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icon key={i} icon={Star} size="sm" fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="mt-0.5 font-sans text-sm leading-snug text-[#0f172a]">
                <span className="font-bold">Publish everywhere</span>
                <br />
                <span className="font-medium text-[#4b5563]">from one dashboard.</span>
              </p>
            </div>
          </div>
        </div>

        <PlatformShowcase />
      </div>
    </section>
  );
}
