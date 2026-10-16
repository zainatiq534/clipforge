import { cn } from "@/lib/cn";

type CaptionsShowcaseProps = {
  className?: string;
};

/** Left mockup — Captions section showcase image. */
export function CaptionsShowcase({ className }: CaptionsShowcaseProps) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[560px] bg-transparent lg:mx-0 lg:max-w-none",
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/features/captions-mockup.png"
        alt="ClipForge captions editor with styles, transcript, and timeline"
        width={467}
        height={567}
        className="h-auto w-full object-contain object-top"
        decoding="async"
        fetchPriority="high"
      />
    </div>
  );
}
