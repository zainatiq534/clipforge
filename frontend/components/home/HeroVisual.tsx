import { InstagramIcon, TikTokIcon, YouTubeIcon } from "@/components/icons";
import { AppImage } from "@/components/ui/Image";
import { cn } from "@/lib/cn";

const clips = [
  {
    caption: "3 habits for massive growth",
    views: "2.4M",
    icon: <TikTokIcon className="h-3.5 w-3.5" />,
    rotate: "-rotate-6",
    offset: "translate-y-3",
  },
  {
    caption: "Stop doing this on Shorts",
    views: "1.8M",
    icon: <InstagramIcon className="h-3.5 w-3.5" />,
    rotate: "rotate-0",
    offset: "-translate-y-1",
  },
  {
    caption: "This hook gets 10x views",
    views: "3.1M",
    icon: <YouTubeIcon className="h-3.5 w-3.5" />,
    rotate: "rotate-6",
    offset: "translate-y-4",
  },
];

type HeroVisualProps = {
  className?: string;
};

export function HeroVisual({ className }: HeroVisualProps) {
  return (
    <div className={cn("relative mx-auto w-full max-w-xl lg:max-w-none", className)}>
      <p
        className="pointer-events-none absolute -top-2 right-0 z-20 hidden max-w-[10rem] text-right text-[0.9rem] font-semibold leading-snug text-white/90 sm:block"
        style={{ fontFamily: "var(--font-caveat), cursive" }}
      >
        Automatically finds the best moments with AI
      </p>

      {/* Long video */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-[#c4b5fd]/50 bg-[#0d1020]/80 shadow-[0_0_32px_rgba(139,92,246,0.35),0_24px_80px_rgba(99,102,241,0.35)] backdrop-blur-sm">
        <div className="relative aspect-[16/10] w-full">
          <AppImage
            src="/features/speaker.jpg"
            alt=""
            fill
            className="object-cover object-[50%_20%]"
            sizes="(max-width: 1024px) 90vw, 480px"
          />
          <div className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 font-sans text-[10px] font-semibold text-white backdrop-blur-sm">
            Long Video 45:12
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2.5 pt-8">
            <div className="h-1 overflow-hidden rounded-full bg-white/25">
              <div className="h-full w-[38%] rounded-full bg-gradient-to-r from-[#a78bfa] to-[#3b82f6]" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating vertical clips */}
      <div className="relative z-10 -mt-10 flex items-end justify-end gap-2.5 pr-1 sm:-mt-14 sm:gap-3">
        {clips.map((clip) => (
          <div
            key={clip.caption}
            className={cn(
              "relative w-[78px] shrink-0 overflow-hidden rounded-2xl border-2 border-[#c4b5fd]/75 shadow-[0_0_20px_rgba(139,92,246,0.4),0_16px_40px_rgba(5,8,20,0.55)] sm:w-[96px]",
              "aspect-[9/16]",
              clip.rotate,
              clip.offset,
            )}
          >
            <AppImage
              src="/features/speaker.jpg"
              alt=""
              fill
              className="object-cover object-[50%_15%]"
              sizes="96px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050814]/90 via-[#050814]/15 to-black/20" />
            <span className="absolute right-1.5 top-1.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-[#1a1230]/75 backdrop-blur-sm">
              {clip.icon}
            </span>
            <div className="absolute inset-x-0 bottom-0 p-2">
              <p className="text-[9px] font-bold leading-tight text-white sm:text-[10px]">
                {clip.caption}
              </p>
              <p className="mt-1 text-[9px] font-semibold text-white/75">{clip.views} views</p>
            </div>
          </div>
        ))}
      </div>

      <p
        className="pointer-events-none mt-3 hidden max-w-[12rem] text-right text-[0.9rem] font-semibold leading-snug text-white/90 sm:ml-auto sm:block"
        style={{ fontFamily: "var(--font-caveat), cursive" }}
      >
        5–10 engaging vertical clips, ready to post
      </p>
    </div>
  );
}
