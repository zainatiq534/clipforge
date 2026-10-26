import { Crop, Layers, Palette } from "lucide-react";
import { PlatformShowcase } from "@/components/PlatformShowcase";
import { Icon } from "@/components/ui/Icon";
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

type PlatformFeatureProps = {
  className?: string;
};

export function PlatformFeature({ className }: PlatformFeatureProps) {
  return (
    <section
      id="platform-optimization"
      className={cn("relative isolate w-full overflow-hidden", className)}
    >
      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-start gap-8 px-5 py-10 sm:px-8 sm:py-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:gap-8 lg:py-14 xl:gap-10">
        <div className="relative z-10 max-w-[30rem] lg:max-w-[32rem]">
          {/* Headline */}
          <h2 className="font-sans text-[1.9rem] leading-[1.08] font-extrabold tracking-[-0.03em] text-[#0a0a1a] sm:text-[2.25rem] lg:text-[2.5rem]">
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
        </div>

        {/* Right — phones stay in column (don't overlap left text) */}
        <div className="relative z-0 min-w-0 overflow-visible">
          <PlatformShowcase />
        </div>
      </div>
    </section>
  );
}
