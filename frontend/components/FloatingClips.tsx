import type { ReactNode } from "react";
import { Play } from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { TikTokIcon } from "@/components/icons/TikTokIcon";
import { AppImage } from "@/components/ui/Image";
import { cn } from "@/lib/cn";

type FloatingClipsProps = {
  className?: string;
};

export function FloatingClips({ className }: FloatingClipsProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-[5] hidden overflow-visible lg:block",
        className,
      )}
      aria-hidden
    >
      {/* Left — Instagram */}
      <div
        className={cn(
          "absolute top-[28%] left-[5%] xl:left-[8%]",
          "w-[8.25rem] xl:w-[9.5rem]",
          "origin-center -rotate-[6deg]",
          "animate-float-left",
        )}
      >
        <ClipCard
          src="/clip-preview-instagram.png"
          caption="3 habits for massive growth"
          views="1.8M"
          badge={
            <div className="flex h-7 w-7 items-center justify-center rounded-[0.55rem] bg-black shadow-sm">
              <InstagramIcon className="h-4 w-4" />
            </div>
          }
        />
      </div>

      {/* Right — TikTok */}
      <div
        className={cn(
          "absolute top-[26%] right-[5%] xl:right-[8%]",
          "w-[8.25rem] xl:w-[9.5rem]",
          "origin-center rotate-[6deg]",
          "animate-float",
        )}
      >
        <ClipCard
          src="/clip-preview-photo.png"
          caption="This mindset changed everything..."
          views="2.4M"
          badge={
            <div className="flex h-7 w-7 items-center justify-center rounded-[0.55rem] bg-black shadow-sm">
              <TikTokIcon className="h-4 w-4 text-white" />
            </div>
          }
        />
      </div>
    </div>
  );
}

type ClipCardProps = {
  src: string;
  caption: string;
  views: string;
  badge: ReactNode;
};

function ClipCard({ src, caption, views, badge }: ClipCardProps) {
  return (
    <div
      className={cn(
        "relative aspect-[9/16] w-full overflow-hidden rounded-[1.15rem]",
        "bg-[#0b0e1a]",
        "shadow-[0_18px_40px_-10px_rgba(0,0,0,0.75),0_0_24px_rgba(90,120,255,0.28)]",
        "ring-1 ring-[#7aa0ff]/70",
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 z-10 rounded-[1.15rem] ring-1 ring-inset ring-[#9bb6ff]/50"
        aria-hidden
      />

      <AppImage
        src={src}
        alt=""
        width={720}
        height={1280}
        quality={100}
        priority
        sizes="152px"
        className="absolute inset-0 h-full w-full object-cover object-[center_18%]"
      />

      <div className="absolute top-3 left-3 z-20 shrink-0">{badge}</div>

      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/85 via-black/45 to-transparent px-2.5 pt-10 pb-2.5">
        <p className="text-center text-[0.7rem] leading-tight font-bold tracking-tight text-white drop-shadow-sm xl:text-[0.78rem]">
          {caption}
        </p>
        <div className="mt-1.5 flex items-center gap-1 text-[0.65rem] font-semibold text-white">
          <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white text-[#050814]">
            <Play className="h-2 w-2 fill-current" strokeWidth={0} />
          </span>
          <span>{views}</span>
        </div>
      </div>
    </div>
  );
}
