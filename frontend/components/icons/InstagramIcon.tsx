import { AppImage } from "@/components/ui/Image";
import { cn } from "@/lib/cn";

type BrandIconProps = {
  className?: string;
};

/**
 * Official Instagram app mark (gradient squircle + white camera).
 * Same asset everywhere — hero pills and How It Works.
 */
export function InstagramIcon({ className }: BrandIconProps) {
  return (
    <span
      className={cn(
        "relative inline-flex h-3.5 w-3.5 shrink-0 overflow-hidden rounded-[0.3rem]",
        className,
      )}
      aria-hidden
    >
      <AppImage
        src="/instagram-icon.png"
        alt=""
        width={128}
        height={128}
        quality={100}
        className="h-full w-full object-cover object-center"
      />
    </span>
  );
}
