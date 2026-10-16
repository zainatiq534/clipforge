import { cn } from "@/lib/cn";

type ReframeShowcaseProps = {
  className?: string;
};

export function ReframeShowcase({ className }: ReframeShowcaseProps) {
  return (
    <div className={cn("relative mx-auto w-full max-w-[560px] lg:max-w-none", className)}>
      {/* plain img keeps PNG alpha + purple glow outlines intact */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/features/reframe-showcase-clean.png"
        alt="AI reframes a wide 16:9 video into vertical TikTok, Instagram Reels, and YouTube Shorts clips"
        width={485}
        height={563}
        className="h-auto w-full object-contain drop-shadow-[0_0_28px_rgba(139,92,246,0.35)]"
        decoding="async"
      />
    </div>
  );
}
