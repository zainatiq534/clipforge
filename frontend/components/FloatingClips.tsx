import { AppImage } from "@/components/ui/Image";
import { cn } from "@/lib/cn";

type FloatingClipsProps = {
  className?: string;
};

export function FloatingClips({ className }: FloatingClipsProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-[5] hidden overflow-hidden lg:block",
        className,
      )}
      aria-hidden
    >
      <div
        className={cn(
          "absolute top-[24%] right-[4%] xl:right-[7%]",
          "w-[7.5rem] xl:w-[8.5rem]",
          "rotate-[7deg]",
          "animate-float",
        )}
      >
        <div
          className={cn(
            "relative aspect-[9/16] overflow-hidden rounded-2xl",
            "shadow-[0_18px_40px_-10px_rgba(0,0,0,0.7),0_0_0_1px_rgba(120,140,255,0.4),0_0_24px_rgba(90,120,255,0.22)]",
          )}
        >
          <AppImage
            src="/clip-preview-tiktok.png"
            alt=""
            width={384}
            height={876}
            quality={100}
            priority
            sizes="136px"
            className="h-full w-full object-cover object-center"
          />
        </div>
      </div>
    </div>
  );
}
