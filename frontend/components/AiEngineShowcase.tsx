"use client";

import { Clock, Expand, Eye, Layers, Mic, Play, Video } from "lucide-react";
import { useEffect, useRef } from "react";
import { InstagramIcon, TikTokIcon, YouTubeIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

const LONG_VIDEO_SRC =
  "https://res.cloudinary.com/vbwjkfmd/video/upload/v1792583481/Man_speaking_into_microphone_20261021164533.mp4";

function LongVideoPreview() {
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

  return (
    <video
      ref={ref}
      className="absolute inset-0 z-0 h-full w-full object-cover object-[50%_22%]"
      src={LONG_VIDEO_SRC}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      controls={false}
      aria-label="Long video input preview"
    />
  );
}

type AiEngineShowcaseProps = {
  className?: string;
};

const viralClips = [
  {
    key: "mindset",
    views: "2.4M",
    hook: "Hook: Mindset",
    brand: "tiktok" as const,
    line1: "This mindset changed",
    line2: "everything...",
    highlight: true,
  },
  {
    key: "howto",
    views: "1.1M",
    hook: "Hook: How To",
    brand: "youtube" as const,
    line1: "3 simple steps to grow",
    line2: "on YouTube",
    highlight: false,
  },
  {
    key: "mistake",
    views: "890K",
    hook: "Hook: Mistake",
    brand: "instagram" as const,
    line1: "Don't make",
    line2: "this mistake!",
    highlight: true,
  },
  {
    key: "controversy",
    views: "650K",
    hook: "Hook: Controversy",
    brand: null,
    line1: "Here's what nobody",
    line2: "tells you...",
    highlight: false,
  },
  {
    key: "strategy",
    views: "430K",
    hook: "Hook: Strategy",
    brand: null,
    line1: "The exact strategy",
    line2: "I use",
    highlight: false,
  },
  {
    key: "timesave",
    views: "320K",
    hook: "Hook: Time Save",
    brand: null,
    line1: "This will save you",
    line2: "hours...",
    highlight: false,
  },
] as const;

/** Sharp HTML — 6 Viral-Ready Clips (fills equal column height). */
function ViralClipsPanel() {
  return (
    <div
      className="flex h-full min-h-0 w-full flex-col rounded-[18px] border border-[#f0ecf9] bg-white p-3 shadow-[0_14px_40px_rgba(76,29,149,0.13),0_2px_8px_rgba(15,23,42,0.04)] sm:rounded-[20px] sm:p-3.5"
      aria-hidden
    >
      {/* Header */}
      <div className="mb-2 flex shrink-0 items-center justify-between gap-1.5 sm:mb-2.5">
        <div className="flex min-w-0 items-center gap-1.5">
          <Layers className="h-3.5 w-3.5 shrink-0 text-[#7c3aed] sm:h-4 sm:w-4" strokeWidth={2.2} />
          <span className="truncate font-sans text-[11px] font-bold text-[#0f172a] sm:text-[12px]">
            6 Viral-Ready Clips Generated
          </span>
        </div>
        <span className="shrink-0 rounded-full border border-[#ddd6fe] bg-[#f5f3ff] px-1.5 py-0.5 font-sans text-[7px] font-semibold whitespace-nowrap text-[#7c3aed] sm:px-2 sm:text-[8px]">
          5–10 clips per video
        </span>
      </div>

      {/* 2×3 grid — equal cells, no overflow into neighbors */}
      <div className="grid min-h-0 flex-1 grid-cols-3 grid-rows-2 gap-1.5 sm:gap-2">
        {viralClips.map((clip) => (
          <div key={clip.key} className="flex min-h-0 min-w-0 flex-col">
            <div className="relative min-h-0 flex-1 overflow-hidden rounded-[8px] sm:rounded-[10px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/features/reframe-speaker-vert.jpg?v=hq7"
                alt=""
                width={2160}
                height={3840}
                className="absolute inset-0 h-full w-full object-cover object-[50%_14%]"
                decoding="async"
                draggable={false}
              />

              {clip.brand === "tiktok" && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-[4px] bg-[#111113] shadow-sm ring-1 ring-white/80">
                  <TikTokIcon className="h-2 w-2" />
                </span>
              )}
              {clip.brand === "youtube" && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-[4px] bg-white shadow-sm">
                  <YouTubeIcon className="h-2 w-2" />
                </span>
              )}
              {clip.brand === "instagram" && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-[4px] bg-white shadow-sm">
                  <InstagramIcon className="h-2 w-2" />
                </span>
              )}

              <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

              <div className="absolute inset-x-0.5 top-[40%] z-10 flex flex-col items-center gap-0.5 px-0.5">
                <span className="rounded-[3px] bg-black/55 px-0.5 py-px text-center font-sans text-[5.5px] leading-tight font-extrabold text-white sm:text-[6.5px]">
                  {clip.line1}
                </span>
                <span
                  className={cn(
                    "rounded-[3px] px-0.5 py-px text-center font-sans text-[5.5px] leading-tight font-extrabold text-white sm:text-[6.5px]",
                    clip.highlight ? "bg-[#7c3aed]" : "bg-black/55",
                  )}
                >
                  {clip.line2}
                </span>
              </div>

              <div className="absolute inset-x-1 bottom-1 z-10 flex items-center justify-between text-white">
                <span className="inline-flex items-center gap-0.5">
                  <Eye className="h-2 w-2" strokeWidth={2.4} />
                  <span className="font-sans text-[6px] font-bold tabular-nums sm:text-[7px]">
                    {clip.views}
                  </span>
                </span>
                <span className="flex h-2 items-end gap-px">
                  {[3, 5, 4, 6].map((barH, i) => (
                    <span
                      key={i}
                      className="w-[1.5px] rounded-full bg-white/90"
                      style={{ height: `${barH}px` }}
                    />
                  ))}
                </span>
              </div>
            </div>
            <p className="mt-1 shrink-0 text-center">
              <span className="inline-block max-w-full truncate rounded-full border border-[#e9e0ff] bg-[#f5f3ff] px-1 py-px font-sans text-[6px] font-semibold text-[#7c3aed] sm:text-[7px]">
                {clip.hook}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Sharp HTML Long Video Input — fills equal column height. */
function LongVideoInputCard() {
  return (
    <div
      className="flex h-full min-h-0 w-full flex-col rounded-[18px] border border-[#f0ecf9] bg-white p-3 shadow-[0_14px_40px_rgba(76,29,149,0.13),0_2px_8px_rgba(15,23,42,0.04)] sm:rounded-[20px] sm:p-3.5"
      aria-hidden
    >
      {/* Header */}
      <div className="mb-2.5 flex shrink-0 items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-[#7c3aed] shadow-sm sm:h-8 sm:w-8 sm:rounded-[9px]">
            <Play className="h-3.5 w-3.5 fill-white text-white sm:h-4 sm:w-4" strokeWidth={0} />
          </span>
          <span className="truncate font-sans text-[13px] font-bold text-[#0f172a] sm:text-[14px]">
            Long Video Input
          </span>
        </div>
        <span className="shrink-0 font-sans text-[12px] font-medium tabular-nums text-slate-400 sm:text-[13px]">
          1:08:20
        </span>
      </div>

      {/* Video preview — muted autoplay */}
      <div className="relative min-h-0 flex-1 overflow-hidden rounded-[12px] sm:rounded-[14px]">
        <LongVideoPreview />
      </div>

      {/* Progress + controls */}
      <div className="mt-2.5 shrink-0">
        <div className="relative h-[3px] rounded-full bg-[#e8e4f0]">
          <div className="absolute inset-y-0 left-0 w-[18%] rounded-full bg-[#7c3aed]">
            <span className="absolute top-1/2 right-0 h-2.5 w-2.5 -translate-y-1/2 translate-x-1/2 rounded-full bg-[#7c3aed] ring-2 ring-white" />
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[#334155]">
            <Play className="h-3 w-3 fill-[#0f172a] text-[#0f172a]" strokeWidth={0} />
            <span className="font-sans text-[10px] font-medium tabular-nums text-slate-500 sm:text-[11px]">
              00:12:34 / 1:08:20
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            <span className="font-sans text-[10px] font-semibold sm:text-[11px]">1x</span>
            <Expand className="h-3.5 w-3.5" strokeWidth={2.2} />
          </div>
        </div>
      </div>

      {/* Episode title */}
      <p className="mt-2.5 shrink-0 font-sans text-[11px] leading-snug text-[#0f172a] sm:text-[12px]">
        <span className="font-bold">Podcast Episode:</span>{" "}
        <span className="font-medium">Building a Personal Brand in 2024</span>
      </p>

      {/* Tags */}
      <div className="mt-2.5 flex shrink-0 flex-wrap gap-1.5">
        {[
          { icon: Mic, label: "Podcast" },
          { icon: Clock, label: "1h 8m" },
          { icon: Video, label: "1080p" },
        ].map(({ icon: Icon, label }) => (
          <span
            key={label}
            className="inline-flex items-center gap-1 rounded-full border border-[#e9e0ff] bg-[#f5f3ff] px-2 py-1 font-sans text-[9px] font-semibold text-[#7c3aed] sm:text-[10px]"
          >
            <Icon className="h-3 w-3" strokeWidth={2.2} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}


export function AiEngineShowcase({ className }: AiEngineShowcaseProps) {
  return (
    <div
      className={cn(
        "relative mx-auto grid w-full grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-3 lg:items-stretch lg:gap-4 xl:gap-5",
        className,
      )}
    >
      <div className="relative min-h-[18rem] min-w-0 overflow-visible bg-transparent lg:min-h-[20rem] xl:min-h-[22rem]">
        <LongVideoInputCard />
      </div>

      {/* Exact reference paste — full ClipForge AI hub */}
      <div className="relative flex min-h-[18rem] min-w-0 items-center justify-center overflow-visible bg-transparent px-1 lg:min-h-[20rem] xl:min-h-[22rem]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/features/clipforge-ai-node.png?v=nobg2"
          alt="ClipForge AI — analyzes video and creates viral-ready clips"
          width={950}
          height={966}
          className="max-h-full w-auto max-w-full object-contain"
          decoding="async"
          draggable={false}
        />
      </div>

      <div className="relative min-h-[18rem] min-w-0 overflow-visible bg-transparent lg:min-h-[20rem] xl:min-h-[22rem]">
        <ViralClipsPanel />
      </div>
    </div>
  );
}
