"use client";

import { MoreHorizontal, Play, Settings2, Sparkles, Upload } from "lucide-react";
import { useEffect, useRef } from "react";
import { InstagramIcon, TikTokIcon, YouTubeIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

type PlatformShowcaseProps = {
  className?: string;
};

const PLATFORM_PHONE_VIDEO =
  "https://res.cloudinary.com/vbwjkfmd/video/upload/v1792587778/Man_speaking_into_podcast_microp__20261021174359.mp4";

function PlatformPhoneVideo({ label }: { label: string }) {
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
      className="absolute inset-0 z-0 h-full w-full object-cover object-[50%_12%]"
      src={PLATFORM_PHONE_VIDEO}
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

const phones = [
  {
    key: "tiktok",
    views: "2.4M",
    exportLabel: "Export for TikTok",
    glow: "0 0 0 1.5px rgba(147,197,253,0.9), 0 0 22px rgba(96,165,250,0.45), 0 0 36px rgba(139,92,246,0.28)",
    btn: "linear-gradient(90deg,#5b21b6 0%,#7c3aed 50%,#8b5cf6 100%)",
    icon: TikTokIcon,
    iconWrap: "bg-[#111113]",
  },
  {
    key: "instagram",
    views: "1.1M",
    exportLabel: "Export for Reels",
    glow: "0 0 0 1.5px rgba(244,114,182,0.9), 0 0 22px rgba(236,72,153,0.45), 0 0 36px rgba(219,39,119,0.25)",
    btn: "linear-gradient(90deg,#db2777 0%,#ec4899 55%,#f472b6 100%)",
    icon: InstagramIcon,
    iconWrap: "bg-white",
  },
  {
    key: "youtube",
    views: "890K",
    exportLabel: "Export for Shorts",
    glow: "0 0 0 1.5px rgba(252,165,165,0.9), 0 0 22px rgba(239,68,68,0.45), 0 0 36px rgba(220,38,38,0.28)",
    btn: "linear-gradient(90deg,#dc2626 0%,#ef4444 55%,#f87171 100%)",
    icon: YouTubeIcon,
    iconWrap: "bg-white",
  },
] as const;

const presets = [
  {
    name: "TikTok",
    meta: "9:16 · 1080×1920",
    tags: ["Captions", "Trendy style", "High quality"],
    icon: TikTokIcon,
    iconWrap: "bg-[#111113]",
  },
  {
    name: "Instagram Reels",
    meta: "9:16 · 1080×1920",
    tags: ["Captions", "Brand colors", "High quality"],
    icon: InstagramIcon,
    iconWrap: "bg-white",
  },
  {
    name: "YouTube Shorts",
    meta: "9:16 · 1080×1920",
    tags: ["Captions", "Clean style", "High quality"],
    icon: YouTubeIcon,
    iconWrap: "bg-white",
  },
] as const;

/**
 * Right column — matches reference #2:
 * top hand-note → 3 phones → wide Export Presets with left annotation.
 */
export function PlatformShowcase({ className }: PlatformShowcaseProps) {
  return (
    <div
      className={cn(
        "relative mx-auto flex w-full max-w-[600px] flex-col bg-transparent select-none lg:ml-auto lg:mr-0 lg:max-w-none",
        className,
      )}
      aria-hidden
    >
      <div className="relative lg:pl-[5.75rem]">
        {/* Left handwritten annotation beside Export Presets */}
        <div className="font-hand pointer-events-none absolute top-[78%] left-0 z-30 hidden w-[5.5rem] -translate-y-1/2 flex-col items-end gap-0.5 pr-1 text-[#7c3aed] lg:flex">
          <p className="w-full text-right text-[1rem] leading-tight font-bold -rotate-[7deg]">
            Pre-configured for maximum reach.
          </p>
          <svg className="h-7 w-9 text-[#a78bfa]" viewBox="0 0 40 28" fill="none">
            <path
              d="M4 8C14 10 24 14 34 18"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
            <path
              d="M27 12l8 6-7 2"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Top handwritten note */}
        <div className="font-hand mb-1.5 flex flex-col items-center text-center text-[#7c3aed]">
          <p className="text-[1.25rem] leading-none font-bold -rotate-[1deg] sm:text-[1.45rem]">
            One clip. Optimized for every platform.
          </p>
          <div className="mt-2 flex w-full max-w-[92%] justify-between px-[8%] sm:max-w-none sm:px-[10%]">
            {[0, 1, 2].map((i) => (
              <svg
                key={i}
                className="h-6 w-5 text-[#a78bfa] sm:h-7 sm:w-5"
                viewBox="0 0 16 24"
                fill="none"
              >
                <path
                  d="M8 1v16"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
                <path
                  d="M3.5 13.5 8 20l4.5-6.5"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ))}
          </div>
        </div>

        {/* Phones — slightly larger */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {phones.map((phone) => {
            const Brand = phone.icon;
            return (
              <div key={phone.key} className="relative min-w-0 pt-1">
                <div className="relative z-30 mx-auto mb-2 flex h-10 w-10 items-center justify-center sm:h-11 sm:w-11">
                  <span
                    className={cn(
                      "flex h-full w-full items-center justify-center rounded-[11px] shadow-[0_8px_18px_rgba(15,23,42,0.22)] ring-2 ring-white sm:rounded-[12px]",
                      phone.iconWrap,
                    )}
                  >
                    <Brand className="h-[1.125rem] w-[1.125rem] sm:h-5 sm:w-5" />
                  </span>
                </div>

                <div
                  className="relative overflow-hidden rounded-[20px] bg-white/40 p-[2px] sm:rounded-[22px]"
                  style={{ boxShadow: phone.glow }}
                >
                  <div className="relative overflow-hidden rounded-[18px] sm:rounded-[20px]">
                    <div className="relative aspect-[9/16] w-full overflow-hidden">
                      <PlatformPhoneVideo label={`${phone.exportLabel} preview`} />

                      <span className="absolute top-2.5 left-2 z-[1] rounded-md bg-[#d4d4d8]/92 px-1.5 py-[3px] font-sans text-[8px] font-bold text-[#18181b] sm:text-[9px]">
                        9:16
                      </span>
                      <span className="absolute top-2.5 right-2 z-[1] rounded-md bg-[#d4d4d8]/92 px-1.5 py-[3px] font-sans text-[8px] font-bold text-[#18181b] sm:text-[9px]">
                        1080×1920
                      </span>

                      <div className="pointer-events-none absolute inset-x-2.5 bottom-[3.35rem] z-10 flex items-center justify-between text-white sm:bottom-[3.55rem]">
                        <span className="inline-flex items-center gap-1">
                          <Play className="h-3 w-3 fill-white sm:h-3.5 sm:w-3.5" />
                          <span className="font-sans text-[10px] font-bold tabular-nums sm:text-[11px]">
                            {phone.views}
                          </span>
                        </span>
                        <span className="flex h-3.5 items-end gap-[1.5px]">
                          {[4, 6, 5, 8].map((barH, i) => (
                            <span
                              key={i}
                              className="w-[2.5px] rounded-full bg-white"
                              style={{ height: `${barH + 1}px` }}
                            />
                          ))}
                        </span>
                      </div>

                      <div className="absolute inset-x-2 bottom-2.5 z-10 sm:inset-x-2.5 sm:bottom-3">
                        <span
                          className="flex w-full items-center justify-center gap-1.5 rounded-full py-2 font-sans text-[8.5px] font-bold text-white shadow-lg sm:py-[9px] sm:text-[10px]"
                          style={{ background: phone.btn }}
                        >
                          <Upload className="h-3.5 w-3.5" strokeWidth={2.5} />
                          {phone.exportLabel}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile note */}
        <div className="font-hand mt-3 mb-2 flex items-end gap-2 text-[#7c3aed] lg:hidden">
          <p className="max-w-[11rem] text-[1.05rem] leading-tight font-bold -rotate-[2deg]">
            Pre-configured for maximum reach.
          </p>
          <svg className="mb-0.5 h-7 w-9 shrink-0 text-[#a78bfa]" viewBox="0 0 40 28" fill="none">
            <path
              d="M2 10C14 6 24 8 34 20"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
            <path
              d="M28 14l7 6-6 2"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Export Presets — still attached, nudged lower */}
        <div className="relative z-20 -mt-2 sm:-mt-1 lg:mt-2">
          <div className="rounded-[22px] border border-[#ebe7f5] bg-white p-3.5 shadow-[0_20px_50px_rgba(76,29,149,0.14)] sm:rounded-[24px] sm:p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="flex min-w-0 items-center gap-1.5">
                <Settings2 className="h-[1.125rem] w-[1.125rem] shrink-0 text-[#64748b]" strokeWidth={2.2} />
                <span className="truncate font-sans text-[13px] font-bold text-[#1e1b4b] sm:text-[14px]">
                  Export Presets
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded-full border border-[#ddd6fe] bg-[#f5f3ff] px-2.5 py-1 font-sans text-[9px] font-semibold text-[#7c3aed] sm:text-[10px]">
                  <Sparkles className="h-3.5 w-3.5" strokeWidth={2.2} />
                  Optimize for each platform
                </span>
                <MoreHorizontal className="h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {presets.map((row) => {
                const Brand = row.icon;
                return (
                  <div
                    key={row.name}
                    className="flex items-center gap-2.5 rounded-[14px] border border-[#efeaf8] bg-[#faf9fd] px-2.5 py-2.5 sm:gap-3 sm:rounded-[15px] sm:px-3 sm:py-3"
                  >
                    <span
                      className={cn(
                        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] shadow-sm ring-1 ring-slate-100 sm:h-10 sm:w-10 sm:rounded-[11px]",
                        row.iconWrap,
                      )}
                    >
                      <Brand className="h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]" />
                    </span>

                    <div className="min-w-0 shrink-0 basis-[7.75rem] sm:basis-[9rem]">
                      <p className="truncate font-sans text-[12px] font-bold leading-tight text-[#1e1b4b] sm:text-[13px]">
                        {row.name}
                      </p>
                      <p className="mt-0.5 truncate font-sans text-[9px] font-medium text-slate-400 sm:text-[10px]">
                        {row.meta}
                      </p>
                    </div>

                    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1">
                      {row.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-white px-2 py-[3px] font-sans text-[8px] font-semibold whitespace-nowrap text-slate-500 ring-1 ring-slate-200 sm:text-[9px]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <span className="relative ml-auto h-[22px] w-10 shrink-0 rounded-full bg-[#7c3aed] sm:h-6 sm:w-11">
                      <span className="absolute top-[3px] right-[3px] h-4 w-4 rounded-full bg-white shadow sm:top-[3.5px] sm:right-[3.5px] sm:h-[17px] sm:w-[17px]" />
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
