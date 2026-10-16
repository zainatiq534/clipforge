import { cn } from "@/lib/cn";

type PlatformShowcaseProps = {
  className?: string;
};

export function PlatformShowcase({ className }: PlatformShowcaseProps) {
  return (
    <div
      className={cn(
        "relative mx-auto mt-8 w-full max-w-[560px] sm:mt-10 lg:mt-14 lg:max-w-none",
        className,
      )}
    >
      {/* plain img keeps PNG alpha + platform glow outlines intact */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/features/platform-showcase-clean.png"
        alt="One clip optimized for TikTok, Instagram Reels, and YouTube Shorts with export presets"
        width={475}
        height={576}
        className="h-auto w-full object-contain drop-shadow-[0_0_28px_rgba(139,92,246,0.3)]"
        decoding="async"
      />
    </div>
  );
}
