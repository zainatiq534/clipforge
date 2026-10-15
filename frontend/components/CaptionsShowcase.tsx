import { AppImage } from "@/components/ui/Image";
import { cn } from "@/lib/cn";

type CaptionsShowcaseProps = {
  className?: string;
};

/** Left mockup — editor UI image, contained in place (not full-screen). */
export function CaptionsShowcase({ className }: CaptionsShowcaseProps) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[520px] lg:mx-0 lg:max-w-none",
        className,
      )}
    >
      <AppImage
        src="/features/captions-mockup.png"
        alt="ClipForge captions editor"
        width={1200}
        height={1100}
        className="h-auto w-full object-contain object-top drop-shadow-[0_20px_50px_rgba(91,33,182,0.12)]"
        sizes="(max-width: 1024px) 90vw, 520px"
      />
    </div>
  );
}
