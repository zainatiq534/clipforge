"use client";

import { Play, Sparkles } from "lucide-react";
import { useEffect, useRef } from "react";
import { InstagramIcon, TikTokIcon, YouTubeIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

const REFRAME_VIDEO =
  "https://res.cloudinary.com/vbwjkfmd/video/upload/v1792582328/Man_speaking_into_microphone_20261021163021.mp4";

const FIRST_CLIP_VIDEO =
  "https://res.cloudinary.com/vbwjkfmd/video/upload/v1792583481/Man_speaking_into_microphone_20261021164533.mp4";

function useMutedAutoplay() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.muted = true;
    el.defaultMuted = true;
    el.volume = 0;
    const play = () => void el.play().catch(() => {});
    play();
    el.addEventListener("canplay", play);
    return () => el.removeEventListener("canplay", play);
  }, []);

  return ref;
}

function ReframeBeforeVideo() {
  const ref = useMutedAutoplay();

  return (
    <video
      ref={ref}
      className="absolute inset-0 z-0 h-full w-full object-cover object-center"
      src={REFRAME_VIDEO}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      controls={false}
      aria-label="Smart video reframing preview"
    />
  );
}

function ClipVideo({ label }: { label: string }) {
  const ref = useMutedAutoplay();

  return (
    <video
      ref={ref}
      className="absolute inset-0 z-0 h-full w-full object-cover object-[50%_16%]"
      src={FIRST_CLIP_VIDEO}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      controls={false}
      aria-label={label}
    />
  );
}

type ReframeShowcaseProps = {
  className?: string;
};

const clips = [
  {
    name: "TikTok",
    sub: "9:16 Vertical",
    time: "0:58",
    icon: TikTokIcon,
    iconWrap: "bg-[#0f0f12]",
    caption: (
      <p className="rounded-md bg-black/55 px-2 py-1.5 text-center font-sans text-[11px] leading-snug font-bold text-white sm:text-[12px]">
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
    iconWrap: "bg-white",
    caption: (
      <p className="rounded-md bg-black/55 px-2 py-1.5 text-center font-sans text-[11px] leading-snug font-bold text-white sm:text-[12px]">
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
    iconWrap: "bg-white",
    caption: (
      <p className="rounded-md bg-black/55 px-2 py-1.5 text-center font-sans text-[11px] leading-snug font-bold text-white sm:text-[12px]">
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
        "relative mx-auto w-full max-w-[400px] bg-transparent select-none lg:ml-auto lg:mr-0 lg:max-w-[440px] xl:max-w-[480px]",
        className,
      )}
    >
      {/* BEFORE — wide 16:9 muted autoplay video */}
      <div className="relative overflow-hidden rounded-[18px] bg-white p-2 shadow-[0_0_0_1.5px_rgba(167,139,250,0.65),0_0_28px_rgba(139,92,246,0.35),0_12px_32px_rgba(15,23,42,0.08)] sm:rounded-[20px] sm:p-2.5">
        <div className="relative overflow-hidden rounded-[12px] bg-[#1e1b4b]">
          <div className="relative aspect-video w-full overflow-hidden">
            <ReframeBeforeVideo />
          </div>
        </div>
      </div>

      {/* Flow: video → pill → 3 clips (same layout as reference) */}
      <div className="relative z-10 flex w-full flex-col items-center">
        {/* 1) Arrow from video down to pill */}
        <svg className="h-6 w-9 shrink-0 text-[#8b5cf6] sm:h-7" viewBox="0 0 40 36" fill="none" aria-hidden>
          <defs>
            <filter id="rfGlowTop" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="1.6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g filter="url(#rfGlowTop)">
            <path d="M20 2 V24" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" />
            <path d="M20 2 V24" stroke="#f5f3ff" strokeWidth="1.1" strokeLinecap="round" opacity="0.95" />
            <path d="M12 18 L20 30 L28 18" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </g>
        </svg>

        {/* 2) Center pill */}
        <div className="inline-flex max-w-full items-center gap-1.5 rounded-full border-[1.5px] border-[#7c3aed] bg-gradient-to-b from-white to-[#f5f3ff] px-3 py-2 shadow-[0_0_0_1px_rgba(167,139,250,0.4),0_0_22px_rgba(139,92,246,0.4)] sm:gap-2.5 sm:px-5 sm:py-2.5">
          <Sparkles
            className="h-3.5 w-3.5 shrink-0 text-[#7c3aed] sm:h-4 sm:w-4"
            strokeWidth={2.4}
            fill="currentColor"
          />
          <span className="text-center font-sans text-[9px] font-extrabold tracking-[0.06em] text-[#6d28d9] uppercase sm:text-[12px] sm:tracking-[0.08em]">
            <span className="sm:hidden">AI Vertical Clips</span>
            <span className="hidden sm:inline">AI Reframes & Creates Vertical Clips</span>
          </span>
        </div>

        {/* 3) Arrows — exact reference style: horizontal then 90° curve + V head + glow */}
        <svg
          className="-mb-0.5 mt-0.5 h-11 w-full sm:h-12"
          viewBox="0 0 360 64"
          fill="none"
          aria-hidden
          preserveAspectRatio="xMidYMin meet"
        >
          <defs>
            <filter id="rfGlowBranch" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="2.4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g filter="url(#rfGlowBranch)" stroke="#7c3aed" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round">
            {/* Left: go left horizontally, then quarter-circle down (same as your arrow pic) */}
            <path d="M155 6 H78 Q52 6 52 48" />
            <path d="M44 40 L52 54 L60 40" fill="none" />

            {/* Middle: straight down */}
            <path d="M180 6 V48" />
            <path d="M172 40 L180 54 L188 40" fill="none" />

            {/* Right: mirrored quarter-circle */}
            <path d="M205 6 H282 Q308 6 308 48" />
            <path d="M300 40 L308 54 L316 40" fill="none" />
          </g>
        </svg>
      </div>

      {/* AFTER — three vertical clips (1st = muted autoplay video) */}
      <div className="relative z-10 -mt-1 grid grid-cols-3 gap-2 sm:gap-2.5">
        {clips.map((clip) => {
          const Brand = clip.icon;
          return (
            <div key={clip.name} className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "relative w-full overflow-hidden rounded-[14px] bg-white p-1 sm:rounded-[16px]",
                  "shadow-[0_0_0_1.5px_rgba(167,139,250,0.7),0_0_24px_rgba(139,92,246,0.45),0_10px_28px_rgba(15,23,42,0.08)]",
                )}
              >
                <div className="relative aspect-[9/13] overflow-hidden rounded-[10px] bg-[#1e1b4b]">
                  <ClipVideo label={`${clip.name} vertical clip preview`} />

                  {/* Platform badge — sized to match TikTok icon reference */}
                  <span
                    className={cn(
                      "absolute top-2 left-2 z-20 inline-flex h-8 w-8 items-center justify-center rounded-[10px] shadow-[0_4px_12px_rgba(0,0,0,0.35)] ring-1 ring-white/25 sm:h-9 sm:w-9 sm:rounded-[11px]",
                      clip.iconWrap,
                    )}
                  >
                    <Brand className="h-[18px] w-[18px] sm:h-5 sm:w-5" />
                  </span>

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

              {/* Platform label — matched to reference pill card */}
              <div className="flex w-full items-center justify-center gap-2 rounded-[14px] border border-[#e4e0f0] bg-[#faf9fd] px-2 py-2 min-[380px]:justify-start min-[380px]:gap-2.5 min-[380px]:px-2.5 sm:gap-3 sm:rounded-[16px] sm:px-3 sm:py-2.5">
                <span
                  className={cn(
                    "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] sm:h-10 sm:w-10 sm:rounded-[11px]",
                    clip.iconWrap,
                  )}
                >
                  <Brand className="h-4 w-4 sm:h-[22px] sm:w-[22px]" />
                </span>
                <div className="hidden min-w-0 flex-col justify-center gap-0.5 min-[380px]:flex">
                  <p className="truncate font-sans text-[11px] leading-none font-bold tracking-tight text-[#1a1a1a] sm:text-[14px]">
                    {clip.name}
                  </p>
                  <p className="truncate font-sans text-[10px] leading-none text-[#8b8b9a] sm:text-[12px]">
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
