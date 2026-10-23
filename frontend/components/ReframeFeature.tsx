import { ArrowRight } from "lucide-react";
import { CropFrameIcon } from "@/components/icons/CropFrameIcon";
import { DevicesFrameIcon } from "@/components/icons/DevicesFrameIcon";
import { FaceTrackIcon } from "@/components/icons/FaceTrackIcon";
import { ReframeShowcase } from "@/components/ReframeShowcase";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";
import type { ComponentType, SVGProps } from "react";

const items: {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
}[] = [
  {
    icon: FaceTrackIcon,
    title: "AI face tracking",
    description: "Automatically keeps the speaker centered in every frame.",
  },
  {
    icon: CropFrameIcon,
    title: "9:16 auto-crop",
    description: "Intelligently reframes your video from 16:9 to vertical.",
  },
  {
    icon: DevicesFrameIcon,
    title: "Perfect framing for every platform",
    description: "Optimized for TikTok, Instagram Reels, YouTube Shorts and more.",
  },
];

type ReframeFeatureProps = {
  className?: string;
};

export function ReframeFeature({ className }: ReframeFeatureProps) {
  return (
    <section
      id="reframing"
      className={cn("relative isolate w-full overflow-hidden", className)}
    >
      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-start gap-8 px-5 py-10 sm:px-8 sm:py-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10 lg:py-14 xl:gap-12">
        {/* Left — compact stack matching reference (no stretch gaps) */}
        <div className="max-w-[26rem] lg:max-w-[28rem]">
          {/* Headline */}
          <h2 className="font-display text-left text-[1.9rem] leading-[1.05] font-extrabold tracking-[-0.03em] sm:text-[2.25rem] lg:text-[2.5rem]">
            <span className="block w-fit text-[#050714]">Smart Video</span>
            <span
              className="block w-fit"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #CB7BF6 0%, #A64BF7 40%, #9124FB 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
              }}
            >
              Reframing
            </span>
          </h2>

          {/* Bold subhead */}
          <p className="mt-4 font-sans text-[1.05rem] font-bold leading-[1.45] tracking-[-0.01em] text-[#0f172a] sm:text-[1.125rem]">
            Convert your wide videos into vertical social-ready clips while keeping the
            subject centered.
          </p>

          {/* Body */}
          <p className="mt-3 font-sans text-[0.9375rem] leading-[1.65] text-[#4b5563] sm:text-base">
            ClipForge is built for creators, podcasters, coaches and agencies who want to
            repurpose long-form videos into engaging short-form content — automatically
            reframed for TikTok, Instagram Reels, YouTube Shorts and more.
          </p>

          {/* Feature rows — icons default size */}
          <ul className="mt-7 space-y-[1.15rem]">
            {items.map((item) => {
              const ItemIcon = item.icon;
              return (
                <li key={item.title} className="flex items-start gap-3.5">
                  <ItemIcon className="h-12 w-12 shrink-0" />
                  <div className="pt-0.5">
                    <p className="font-sans text-[0.95rem] font-bold leading-snug tracking-[-0.01em] text-[#0a0a1a] sm:text-base">
                      {item.title}
                    </p>
                    <p className="mt-0.5 font-sans text-[0.8125rem] leading-snug text-[#6b7280] sm:text-sm">
                      {item.description}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* CTA — same button as before */}
          <div className="mt-8">
            <a
              href="#start"
              className="inline-flex h-[42px] w-[265px] max-w-full items-center justify-center gap-2 rounded-[14px] px-7 font-sans text-[14px] font-semibold tracking-[-0.005em] text-white transition-[filter] hover:brightness-105"
              style={{
                backgroundImage:
                  "linear-gradient(105deg, #6910FC 0%, #7A20FB 35%, #8B45FB 100%)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.35), inset 1px 0 0 rgba(255,255,255,0.12), 0 0 0 1.5px rgba(228, 212, 255, 0.95), 0 0 30px 10px rgba(205, 180, 255, 0.55), 0 6px 18px rgba(110, 20, 251, 0.14)",
              }}
            >
              Start Creating Clips
              <Icon icon={ArrowRight} size="md" strokeWidth={2.25} className="text-white" />
            </a>
          </div>
        </div>

        <ReframeShowcase />
      </div>
    </section>
  );
}
