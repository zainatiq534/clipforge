import { Expand, Play, ScanFace, Sparkles } from "lucide-react";
import { InstagramIcon, TikTokIcon, YouTubeIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

type ReframeShowcaseProps = {
  className?: string;
};

const glow =
  "shadow-[0_0_0_1px_rgba(167,139,250,0.55),0_0_28px_rgba(139,92,246,0.28),0_12px_32px_rgba(15,23,42,0.08)]";

const clips = [
  {
    name: "TikTok",
    sub: "9:16 Vertical",
    time: "0:58",
    icon: TikTokIcon,
    caption: (
      <p className="rounded-md bg-black/55 px-1.5 py-1 text-center font-sans text-[8px] leading-snug font-bold text-white sm:text-[9px]">
        This mindset changed{" "}
        <span className="rounded-[3px] bg-[#7c3aed] px-1 py-px">everything</span>
        ...
      </p>
    ),
  },
  {
    name: "Instagram Reels",
    sub: "9:16 Vertical",
    time: "0:47",
    icon: InstagramIcon,
    caption: (
      <p className="rounded-md bg-black/55 px-1.5 py-1 text-center font-sans text-[8px] leading-snug font-bold text-white sm:text-[9px]">
        3 simple steps to grow on{" "}
        <span className="underline decoration-[#a855f7] decoration-2 underline-offset-2">
          YouTube
        </span>
      </p>
    ),
  },
  {
    name: "YouTube Shorts",
    sub: "9:16 Vertical",
    time: "0:52",
    icon: YouTubeIcon,
    caption: (
      <p className="rounded-md bg-black/55 px-1.5 py-1 text-center font-sans text-[8px] leading-snug font-bold text-white sm:text-[9px]">
        Don&apos;t make this{" "}
        <span className="rounded-[3px] bg-[#ef4444] px-1 py-px">mistake!</span>
      </p>
    ),
  },
] as const;

/**
 * Crisp HTML reframe diagram — transparent bg, sharp text/icons (no blurry PNG).
 */
export function ReframeShowcase({ className }: ReframeShowcaseProps) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[560px] bg-transparent select-none lg:mx-0 lg:max-w-none",
        className,
      )}
      aria-hidden
    >
      {/* BEFORE — wide 16:9 */}
      <div className={cn("relative overflow-hidden rounded-[18px] bg-white p-2 sm:p-2.5", glow)}>
        <div className="relative overflow-hidden rounded-[12px] bg-[#1e1b4b]">
          <div className="relative aspect-video w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/features/reframe-speaker-wide.jpg?v=hq2"
              alt=""
              width={2560}
              height={1440}
              className="absolute inset-0 h-full w-full object-cover object-[50%_22%]"
              decoding="async"
              fetchPriority="high"
              draggable={false}
            />

            {/* Crop guides */}
            <div className="pointer-events-none absolute inset-y-3 left-[28%] w-px border-l border-dashed border-white/80" />
            <div className="pointer-events-none absolute inset-y-3 right-[28%] w-px border-r border-dashed border-white/80" />
            <span className="pointer-events-none absolute top-1/2 left-[18%] -translate-y-1/2 text-[#a78bfa]">
              ▶
            </span>
            <span className="pointer-events-none absolute top-1/2 right-[18%] -translate-y-1/2 rotate-180 text-[#a78bfa]">
              ▶
            </span>

            {/* Face tracking box */}
            <div className="pointer-events-none absolute top-[14%] left-1/2 h-[38%] w-[22%] -translate-x-1/2 rounded-md border-2 border-[#a78bfa] shadow-[0_0_16px_rgba(167,139,250,0.55)]">
              <span className="absolute -top-0.5 -left-0.5 h-2.5 w-2.5 border-t-2 border-l-2 border-[#c4b5fd]" />
              <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 border-t-2 border-r-2 border-[#c4b5fd]" />
              <span className="absolute -bottom-0.5 -left-0.5 h-2.5 w-2.5 border-b-2 border-l-2 border-[#c4b5fd]" />
              <span className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 border-r-2 border-b-2 border-[#c4b5fd]" />
            </div>

            {/* BEFORE badge */}
            <div className="absolute top-2 left-2 rounded-md bg-white/95 px-2 py-1 shadow-sm">
              <p className="font-sans text-[9px] leading-none font-extrabold tracking-wide text-[#1e1b4b] uppercase sm:text-[10px]">
                Before
              </p>
              <p className="mt-0.5 font-sans text-[8px] leading-none text-slate-500 sm:text-[9px]">
                16:9 Wide Video
              </p>
            </div>

            {/* AI centered badge */}
            <div className="absolute top-2 right-2 flex max-w-[46%] items-center gap-1.5 rounded-lg border border-[#c4b5fd] bg-white/95 px-2 py-1 shadow-[0_0_14px_rgba(139,92,246,0.25)]">
              <ScanFace className="h-3 w-3 shrink-0 text-[#7c3aed]" strokeWidth={2.2} />
              <p className="font-sans text-[8px] leading-tight font-bold text-[#1e1b4b] sm:text-[9px]">
                AI Keeps the Speaker Centered
              </p>
            </div>

            {/* Controls */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2.5 pt-6 pb-2">
              <div className="mb-1.5 h-1 overflow-hidden rounded-full bg-white/25">
                <div className="relative h-full w-[18%] rounded-full bg-[#a78bfa]">
                  <span className="absolute top-1/2 right-0 h-2.5 w-2.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-white" />
                </div>
              </div>
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <Play className="h-3 w-3 fill-white" />
                  <span className="font-sans text-[8px] font-semibold tabular-nums sm:text-[9px]">
                    00:12:34 / 01:08:20
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[8px] font-bold sm:text-[9px]">
                  <span>1x</span>
                  <Expand className="h-3 w-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Connector */}
      <div className="relative z-10 -mt-1 mb-1 flex flex-col items-center">
        <span className="h-4 w-0.5 rounded-full bg-[#a78bfa]" />
        <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#a855f7] to-[#7c3aed] px-3 py-1.5 shadow-[0_10px_28px_rgba(124,58,237,0.35)]">
          <Sparkles className="h-3 w-3 text-white" strokeWidth={2.4} />
          <span className="font-sans text-[8px] font-extrabold tracking-[0.06em] text-white uppercase sm:text-[9px]">
            AI Reframes & Creates Vertical Clips
          </span>
        </div>
        <div className="mt-1 flex w-full max-w-[90%] justify-between px-[8%]">
          <span className="h-5 w-0.5 origin-top -rotate-[18deg] rounded-full bg-[#a78bfa]" />
          <span className="h-5 w-0.5 rounded-full bg-[#a78bfa]" />
          <span className="h-5 w-0.5 origin-top rotate-[18deg] rounded-full bg-[#a78bfa]" />
        </div>
      </div>

      {/* AFTER — three vertical clips */}
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
        {clips.map((clip) => {
          const Brand = clip.icon;
          return (
            <div key={clip.name} className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "relative w-full overflow-hidden rounded-[14px] bg-white p-1",
                  glow,
                )}
              >
                <div className="relative aspect-[9/14] overflow-hidden rounded-[10px] bg-[#1e1b4b]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/features/reframe-speaker-vert.jpg?v=hq2"
                    alt=""
                    width={1440}
                    height={2560}
                    className="absolute inset-0 h-full w-full object-cover object-[50%_16%]"
                    decoding="async"
                    draggable={false}
                  />
                  <div className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-black/75 via-black/25 to-transparent" />

                  <span className="absolute top-1.5 left-1.5 inline-flex h-5 w-5 items-center justify-center rounded-md bg-black/45 backdrop-blur-[2px]">
                    <Brand className="h-3 w-3" />
                  </span>

                  <div className="absolute inset-x-1 bottom-7 sm:bottom-8">
                    {clip.caption}
                  </div>

                  <div className="absolute inset-x-1.5 bottom-1.5 flex items-center justify-between text-white">
                    <span className="inline-flex items-center gap-1">
                      <Play className="h-2.5 w-2.5 fill-white" />
                      <span className="font-sans text-[7px] font-semibold tabular-nums sm:text-[8px]">
                        {clip.time}
                      </span>
                    </span>
                    <span className="flex h-2.5 items-end gap-px">
                      {[3, 5, 4, 6, 3].map((h, i) => (
                        <span
                          key={i}
                          className="w-[2px] rounded-full bg-white/80"
                          style={{ height: `${h}px` }}
                        />
                      ))}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex w-full items-center gap-1.5 rounded-lg border border-[#ede9fe] bg-white px-1.5 py-1 shadow-sm">
                <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] bg-[#f5f3ff]">
                  <Brand className="h-2.5 w-2.5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate font-sans text-[8px] leading-none font-bold text-[#1e1b4b] sm:text-[9px]">
                    {clip.name}
                  </p>
                  <p className="mt-0.5 truncate font-sans text-[7px] leading-none text-slate-500 sm:text-[8px]">
                    {clip.sub}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
