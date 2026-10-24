"use client";

import { BarChart3, Bolt, Scissors, TrendingUp } from "lucide-react";
import { FeatureShowcase } from "@/components/FeatureShowcase";
import { FeaturesMotionItem } from "@/components/FeaturesMotion";
import { AppImage } from "@/components/ui/Image";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

const avatars = [
  "/features/avatar-1.jpg",
  "/features/avatar-2.jpg",
  "/features/avatar-3.jpg",
  "/features/avatar-4.jpg",
];

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

type FeaturesProps = {
  className?: string;
};

/** Layout unchanged — text colors only adjusted for light aurora background readability */
export function Features({ className }: FeaturesProps) {
  return (
    <section
      className={cn(
        "relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 py-10 sm:px-8 sm:py-12 lg:py-14",
        className,
      )}
    >
      <div className="grid w-full items-center gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-8 xl:gap-10">
        <FeaturesMotionItem className="max-w-xl text-left lg:max-w-none">
          <h1 className="font-display max-w-xl text-balance text-[1.85rem] leading-[1.12] font-bold tracking-tight text-[#0f172a] sm:text-4xl lg:text-[2.5rem]">
            AI-Powered{" "}
            <span className="bg-gradient-to-r from-[#8b5cf6] via-[#7c3aed] to-[#3b82f6] bg-clip-text text-transparent">
              Smart Clipping
            </span>
          </h1>

          <p className="mt-4 font-sans text-[0.9375rem] leading-relaxed text-slate-600 sm:text-base">
            ClipForge analyzes your long-form video, finds the highest-performing moments,
            and turns them into short, scroll-stopping clips — automatically.
          </p>
          <p className="mt-2.5 font-sans text-[0.9375rem] leading-relaxed text-slate-600 sm:text-base">
            Built for creators, podcasters, YouTubers, and agencies who want{" "}
            <span className="font-semibold text-slate-900">viral-ready content</span> without
            hours of manual editing.
          </p>

          <ul className="mt-6 space-y-3.5">
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

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <div className="flex items-start gap-2">
              <Icon icon={TrendingUp} size="md" className="mt-1 text-[#7c3aed]" />
              <div>
                <p className="font-display text-2xl font-bold text-[#1e1b4b]">2.3x</p>
                <p className="max-w-[12rem] font-sans text-sm leading-snug text-slate-500">
                  Average watch time increase with captions.
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center">
                {avatars.map((src, i) => (
                  <span
                    key={src}
                    className={cn(
                      "relative h-9 w-9 overflow-hidden rounded-full border-2 border-white",
                      i > 0 && "-ml-2",
                    )}
                  >
                    <AppImage src={src} alt="" fill className="object-cover" sizes="36px" />
                  </span>
                ))}
                <span className="-ml-2 inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#7c3aed] text-[0.6rem] font-bold text-white">
                  +10K
                </span>
              </div>
              <p className="mt-2 max-w-[14rem] font-sans text-sm leading-snug text-slate-500">
                Used by 10,000+ creators, podcasters and agencies.
              </p>
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
