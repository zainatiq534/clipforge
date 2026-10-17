import { ArrowRight, Bolt, Crop, MonitorSmartphone, ScanFace } from "lucide-react";
import { ReframeShowcase } from "@/components/ReframeShowcase";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

const items = [
  {
    icon: ScanFace,
    title: "AI face tracking",
    description: "Automatically keeps the speaker centered in every frame.",
  },
  {
    icon: Crop,
    title: "9:16 auto-crop",
    description: "Intelligently reframes your video from 16:9 to vertical.",
  },
  {
    icon: MonitorSmartphone,
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
      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-start gap-12 px-5 py-14 sm:px-8 sm:py-16 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-10 lg:py-20 xl:gap-14">
        {/* Left column — pixel-matched to design */}
        <div className="max-w-[28rem] pt-1 lg:max-w-[30rem] lg:pt-2">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#d8b4fe] bg-[#f5f3ff] px-3 py-[6px]">
            <Icon icon={Bolt} size="sm" className="text-[#8b5cf6]" />
            <span className="font-sans text-[11px] font-bold tracking-[0.12em] text-[#7c3aed] uppercase">
              Powerful Feature
            </span>
          </div>

          {/* Headline — same geometric sans as body (Plus Jakarta), heavy weight */}
          <h2 className="font-sans mt-5 text-[2.5rem] leading-[1.05] font-extrabold tracking-[-0.03em] text-[#0a0a1a] sm:text-[2.85rem] lg:text-[3.25rem]">
            Smart Video
            <br />
            <span className="bg-gradient-to-r from-[#c084fc] via-[#a855f7] to-[#7c3aed] bg-clip-text text-transparent">
              Reframing
            </span>
          </h2>

          {/* Bold subhead */}
          <p className="mt-5 font-sans text-[1.05rem] font-bold leading-[1.45] tracking-[-0.01em] text-[#0f172a] sm:text-[1.125rem]">
            Convert your wide videos into vertical social-ready clips while keeping the
            subject centered.
          </p>

          {/* Body */}
          <p className="mt-3.5 font-sans text-[0.9375rem] leading-[1.65] text-[#4b5563] sm:text-base">
            ClipForge is built for creators, podcasters, coaches and agencies who want to
            repurpose long-form videos into engaging short-form content — automatically
            reframed for TikTok, Instagram Reels, YouTube Shorts and more.
          </p>

          {/* Feature rows */}
          <ul className="mt-8 space-y-[1.35rem]">
            {items.map((item) => (
              <li key={item.title} className="flex items-start gap-3.5">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] border border-[#c4b5fd] bg-white text-[#8b5cf6] shadow-[0_0_0_3px_rgba(196,181,253,0.35),0_4px_14px_rgba(139,92,246,0.1)]">
                  <Icon icon={item.icon} size="md" />
                </span>
                <div className="pt-0.5">
                  <p className="font-sans text-[0.95rem] font-bold leading-snug tracking-[-0.01em] text-[#0a0a1a] sm:text-base">
                    {item.title}
                  </p>
                  <p className="mt-0.5 font-sans text-[0.8125rem] leading-snug text-[#6b7280] sm:text-sm">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          {/* CTA — purple-only gradient, wide, soft-rounded */}
          <div className="mt-9">
            <a
              href="#start"
              className="inline-flex h-[3.25rem] w-full max-w-[22rem] items-center justify-center gap-2.5 rounded-[16px] bg-gradient-to-r from-[#a78bfa] via-[#8b5cf6] to-[#6d28d9] px-7 font-sans text-[0.95rem] font-bold text-white shadow-[0_10px_28px_rgba(109,40,217,0.35)] transition-[filter,box-shadow] hover:brightness-110 hover:shadow-[0_14px_36px_rgba(109,40,217,0.45)] sm:w-auto sm:min-w-[16.5rem]"
            >
              Start Creating Clips
              <Icon icon={ArrowRight} size="md" className="text-white" />
            </a>
          </div>
        </div>

        {/* Right column — before → after visual */}
        <ReframeShowcase />
      </div>
    </section>
  );
}
