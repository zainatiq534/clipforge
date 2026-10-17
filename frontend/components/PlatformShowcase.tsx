import { MoreHorizontal, Play, Settings2, Sparkles, Upload } from "lucide-react";
import { InstagramIcon, TikTokIcon, YouTubeIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

type PlatformShowcaseProps = {
  className?: string;
};

const phones = [
  {
    key: "tiktok",
    views: "2.4M",
    exportLabel: "Export for TikTok",
    glow: "0 0 0 1.5px rgba(147,197,253,0.9), 0 0 26px rgba(96,165,250,0.5), 0 0 48px rgba(139,92,246,0.35)",
    btn: "linear-gradient(90deg,#6d28d9 0%,#7c3aed 50%,#8b5cf6 100%)",
    captionBg: "rgba(91,33,182,0.92)",
    icon: TikTokIcon,
    iconWrap: "bg-[#111113]",
    caption: "This mindset changed everything...",
  },
  {
    key: "instagram",
    views: "1.1M",
    exportLabel: "Export for Reels",
    glow: "0 0 0 1.5px rgba(251,146,190,0.95), 0 0 26px rgba(236,72,153,0.5), 0 0 48px rgba(249,115,22,0.28)",
    btn: "linear-gradient(90deg,#db2777 0%,#ec4899 55%,#f472b6 100%)",
    captionBg: "rgba(219,39,119,0.92)",
    icon: InstagramIcon,
    iconWrap: "bg-white",
    caption: "3 simple steps to grow on Instagram...",
  },
  {
    key: "youtube",
    views: "890K",
    exportLabel: "Export for Shorts",
    glow: "0 0 0 1.5px rgba(252,165,165,0.95), 0 0 26px rgba(239,68,68,0.5), 0 0 48px rgba(220,38,38,0.3)",
    btn: "linear-gradient(90deg,#dc2626 0%,#ef4444 55%,#f87171 100%)",
    captionBg: "rgba(220,38,38,0.92)",
    icon: YouTubeIcon,
    iconWrap: "bg-white",
    caption: "Don't make this mistake!",
  },
] as const;

const presets = [
  {
    name: "TikTok",
    meta: "9:16 · 1080×1920",
    tags: ["Captions", "Trendy style", "High quality"],
    icon: TikTokIcon,
  },
  {
    name: "Instagram Reels",
    meta: "9:16 · 1080×1920",
    tags: ["Captions", "Brand colors", "High quality"],
    icon: InstagramIcon,
  },
  {
    name: "YouTube Shorts",
    meta: "9:16 · 1080×1920",
    tags: ["Captions", "Clean style", "High quality"],
    icon: YouTubeIcon,
  },
] as const;

/**
 * Sharp HTML platform mockup (no PNG bg) — HD speaker stills + crisp UI.
 */
export function PlatformShowcase({ className }: PlatformShowcaseProps) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[580px] bg-transparent select-none lg:mx-0 lg:max-w-none",
        className,
      )}
      aria-hidden
    >
      {/* Annotation */}
      <div className="relative z-20 mb-0.5">
        <p className="font-hand max-w-[14rem] -rotate-[2deg] text-[1.3rem] leading-[1.05] font-bold text-[#7c3aed] sm:text-[1.45rem]">
          One clip. Optimized for every platform.
        </p>
        <svg
          className="pointer-events-none absolute top-7 left-[10rem] hidden h-12 w-[66%] text-[#a78bfa] sm:block"
          viewBox="0 0 260 48"
          fill="none"
        >
          <path d="M6 32C52 8 98 4 132 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M6 34C74 10 136 2 182 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M6 36C92 14 172 4 248 22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M128 16l5 7M128 16l8-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M178 18l5 7M178 18l8-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M244 22l4 7M244 22l8 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </div>

      {/* Phones */}
      <div className="relative z-0 grid grid-cols-3 gap-3 pt-5 sm:gap-3.5 sm:pt-6">
        {phones.map((phone) => {
          const Brand = phone.icon;
          return (
            <div key={phone.key} className="relative min-w-0">
              <span
                className={cn(
                  "absolute left-1/2 top-0 z-30 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[11px] shadow-[0_8px_18px_rgba(15,23,42,0.22)] ring-2 ring-white sm:h-10 sm:w-10 sm:rounded-[12px]",
                  phone.iconWrap,
                )}
              >
                <Brand className="h-4 w-4 sm:h-[1.125rem] sm:w-[1.125rem]" />
              </span>

              <div
                className="relative overflow-hidden rounded-[20px] bg-white/45 p-[2px] backdrop-blur-[8px] sm:rounded-[22px]"
                style={{ boxShadow: phone.glow }}
              >
                <div className="relative overflow-hidden rounded-[18px] sm:rounded-[20px]">
                  <div className="relative aspect-[9/15.6] w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/features/reframe-speaker-vert.jpg?v=hq2"
                      alt=""
                      width={1440}
                      height={2560}
                      className="absolute inset-0 h-full w-full object-cover object-[50%_12%]"
                      decoding="async"
                      fetchPriority="high"
                      draggable={false}
                    />

                    <span className="absolute top-2.5 left-2 rounded-md bg-[#d1d1d6]/90 px-1.5 py-[3px] font-sans text-[7.5px] font-bold text-black sm:text-[8.5px]">
                      9:16
                    </span>
                    <span className="absolute top-2.5 right-2 rounded-md bg-[#d1d1d6]/90 px-1.5 py-[3px] font-sans text-[7.5px] font-bold text-black sm:text-[8.5px]">
                      1080×1920
                    </span>

                    <div className="absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

                    <p
                      className="absolute inset-x-2 top-[46%] z-10 rounded-[9px] px-1.5 py-1.5 text-center font-sans text-[8px] leading-snug font-extrabold text-white sm:inset-x-2.5 sm:text-[9.5px]"
                      style={{ background: phone.captionBg }}
                    >
                      {phone.caption}
                    </p>

                    <div className="absolute inset-x-2.5 bottom-[3rem] z-10 flex items-center justify-between text-white sm:bottom-[3.2rem]">
                      <span className="inline-flex items-center gap-1">
                        <Play className="h-2.5 w-2.5 fill-white sm:h-3 sm:w-3" />
                        <span className="font-sans text-[9px] font-bold tabular-nums sm:text-[10px]">
                          {phone.views}
                        </span>
                      </span>
                      <span className="flex h-3 items-end gap-[1.5px]">
                        {[4, 6, 5, 8].map((barH, i) => (
                          <span
                            key={i}
                            className="w-[2.5px] rounded-full bg-white"
                            style={{ height: `${barH}px` }}
                          />
                        ))}
                      </span>
                    </div>

                    <div className="absolute inset-x-2 bottom-2.5 z-10 sm:inset-x-2.5 sm:bottom-3">
                      <span
                        className="flex w-full items-center justify-center gap-1.5 rounded-full py-[7px] font-sans text-[8px] font-bold text-white shadow-lg sm:py-2 sm:text-[9.5px]"
                        style={{ background: phone.btn }}
                      >
                        <Upload className="h-3 w-3" strokeWidth={2.5} />
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

      {/* Export Presets */}
      <div className="relative z-20 -mt-8 sm:-mt-9">
        <p className="font-hand mb-2 max-w-[10rem] text-[1.05rem] leading-tight font-bold text-[#7c3aed] lg:absolute lg:top-2 lg:mb-0 lg:max-w-[8.25rem] lg:-translate-x-[112%] lg:-rotate-[2deg]">
          Pre-configured for maximum reach.
        </p>
        <svg
          className="pointer-events-none absolute top-10 left-0 hidden h-9 w-12 text-[#a78bfa] lg:block lg:top-12 lg:-left-[5.5rem]"
          viewBox="0 0 48 36"
          fill="none"
        >
          <path d="M6 4C14 18 28 28 44 30" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M36 26l8 4-6 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <div className="rounded-[18px] border border-[#e9e5f5] bg-white p-3 shadow-[0_22px_48px_rgba(76,29,149,0.15)] sm:rounded-[20px] sm:p-3.5">
          <div className="mb-2.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Settings2 className="h-4 w-4 text-[#7c3aed]" strokeWidth={2.2} />
              <span className="font-sans text-[11px] font-bold text-[#1e1b4b] sm:text-[12px]">
                Export Presets
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full border border-[#ddd6fe] bg-[#f5f3ff] px-2.5 py-1 font-sans text-[8px] font-semibold text-[#7c3aed] sm:text-[9px]">
                <Sparkles className="h-3 w-3" />
                Optimize for each platform
              </span>
              <MoreHorizontal className="h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            {presets.map((row) => {
              const Brand = row.icon;
              return (
                <div
                  key={row.name}
                  className="flex items-center gap-2.5 rounded-[12px] bg-[#f8f7fc] px-2.5 py-2"
                >
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-white shadow-sm ring-1 ring-slate-100">
                    <Brand className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-sans text-[9px] font-bold text-[#1e1b4b] sm:text-[10px]">
                      {row.name}{" "}
                      <span className="font-medium text-slate-400">{row.meta}</span>
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {row.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-white px-2 py-[2px] font-sans text-[7.5px] font-semibold text-slate-500 ring-1 ring-slate-200 sm:text-[8px]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="relative h-[18px] w-8 shrink-0 rounded-full bg-[#7c3aed]">
                    <span className="absolute top-[3px] right-[3px] h-3 w-3 rounded-full bg-white shadow" />
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
