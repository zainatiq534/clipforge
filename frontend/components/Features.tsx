"use client";

import { ArrowRight, BarChart3, Bolt, Scissors, Star } from "lucide-react";
import { FeatureShowcase } from "@/components/FeatureShowcase";
import { FeaturesMotionItem } from "@/components/FeaturesMotion";
import { AppImage } from "@/components/ui/Image";
import { GradientButton } from "@/components/ui/Button";
import { Icon, PlayCircleIcon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

const featureItems = [
  {
    icon: Bolt,
    title: "Find hooks instantly",
    description: "AI detects the strongest opening moments in seconds.",
  },
  {
    icon: BarChart3,
    title: "Rank clips by viral score",
    description: "Every moment gets a score so you know what to publish first.",
  },
  {
    icon: Scissors,
    title: "Auto-cut into short clips",
    description: "One long video becomes 5–10 vertical, captioned shorts.",
  },
];

const avatars = [
  "/features/avatar-1.jpg",
  "/features/avatar-2.jpg",
  "/features/avatar-3.jpg",
  "/features/avatar-4.jpg",
];

type FeaturesProps = {
  className?: string;
};

/** Layout unchanged — text colors only adjusted for light aurora background readability */
export function Features({ className }: FeaturesProps) {
  return (
    <section
      className={cn(
        "relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 py-12 sm:px-8 sm:py-16 lg:py-20",
        className,
      )}
    >
      <div className="grid w-full items-center gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-10 xl:gap-14">
        <FeaturesMotionItem className="max-w-xl text-left lg:max-w-none">
          <h1 className="font-display max-w-xl text-balance text-[2.15rem] leading-[1.12] font-bold tracking-tight text-[#0f172a] sm:text-5xl lg:text-[3.15rem]">
            AI-Powered{" "}
            <span className="bg-gradient-to-r from-[#8b5cf6] via-[#7c3aed] to-[#3b82f6] bg-clip-text text-transparent">
              Smart Clipping
            </span>
          </h1>

          <p className="mt-5 font-sans text-base leading-relaxed text-slate-600 sm:text-lg">
            ClipForge analyzes your long-form video, finds the highest-performing moments,
            and turns them into short, scroll-stopping clips — automatically.
          </p>
          <p className="mt-3 font-sans text-base leading-relaxed text-slate-600 sm:text-lg">
            Built for creators, podcasters, YouTubers, and agencies who want{" "}
            <span className="font-semibold text-slate-900">viral-ready content</span> without
            hours of manual editing.
          </p>

          <ul className="mt-8 space-y-4">
            {featureItems.map((item) => (
              <FeaturesMotionItem key={item.title}>
                <li className="flex items-start gap-3.5">
                  <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#ede9fe] text-[#7c3aed] shadow-sm">
                    <Icon icon={item.icon} size="md" />
                  </span>
                  <div>
                    <p className="font-sans text-base font-bold text-slate-900 sm:text-lg">
                      {item.title}
                    </p>
                    <p className="mt-0.5 font-sans text-sm leading-relaxed text-slate-500 sm:text-[0.95rem]">
                      {item.description}
                    </p>
                  </div>
                </li>
              </FeaturesMotionItem>
            ))}
          </ul>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
            <GradientButton
              size="lg"
              href="#start"
              rightIcon={<Icon icon={ArrowRight} size="md" />}
              className="w-full sm:w-auto"
            >
              Start Creating Clips
            </GradientButton>
            <a
              href="/#how-it-works"
              className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-[18px] border border-[#c7d2fe] bg-white/90 px-6 text-base font-semibold text-[#6d28d9] shadow-sm backdrop-blur-sm transition-colors hover:bg-white sm:h-[3.25rem] sm:w-auto sm:rounded-[20px] sm:px-7"
            >
              <PlayCircleIcon className="border-[#a78bfa] [&_svg]:fill-[#7c3aed]" />
              See How It Works
            </a>
          </div>

          <div className="mt-10">
            <p className="font-sans text-[0.7rem] font-bold tracking-[0.16em] text-slate-500 uppercase">
              Used by creators, podcasters & agencies
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-4">
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
                <span className="-ml-2.5 inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-[#a78bfa] to-[#3b82f6] text-[0.65rem] font-bold text-white shadow-sm">
                  +10K
                </span>
              </div>

              <div>
                <div className="flex items-center gap-0.5 text-[#f59e0b]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon key={i} icon={Star} size="sm" fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <p className="mt-0.5 font-sans text-sm text-slate-500">
                  Trusted by 10,000+ creators worldwide
                </p>
              </div>
            </div>
          </div>
        </FeaturesMotionItem>

        <FeaturesMotionItem>
          <FeatureShowcase />
        </FeaturesMotionItem>
      </div>
    </section>
  );
}
