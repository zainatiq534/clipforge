import { AppImage } from "@/components/ui/Image";
import { cn } from "@/lib/cn";

type BrandIconProps = {
  className?: string;
};

/**
 * Exact YouTube Shorts mark from the provided reference —
 * white squircle + bold red slanted S. High-res asset keeps edges sharp.
 */
export function YouTubeShortsIcon({ className }: BrandIconProps) {
  return (
    <span
      className={cn(
        "relative inline-block h-3.5 w-3.5 shrink-0 overflow-hidden rounded-[0.3rem]",
        className,
      )}
      aria-hidden
    >
      <AppImage
        src="/youtube-shorts-icon.png"
        alt=""
        fill
        quality={100}
        sizes="48px"
        className="object-cover object-center"
      />
    </span>
  );
}
