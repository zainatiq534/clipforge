"use client";

import {
  ChevronRight,
  LayoutGrid,
  Palette,
  Play,
  Sparkles,
  Type,
} from "lucide-react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

const CAPTIONS_VIDEO =
  "https://res.cloudinary.com/vbwjkfmd/video/upload/v1792587778/Man_speaking_into_podcast_microp__20261021174359.mp4";

function CaptionsPreviewVideo() {
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
      className="absolute inset-0 z-0 h-full w-full object-cover object-[50%_18%]"
      src={CAPTIONS_VIDEO}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      controls={false}
      aria-label="ClipForge captions preview"
    />
  );
}

type CaptionsShowcaseProps = {
  className?: string;
};

function CcIcon({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-sans text-[9px] leading-none font-extrabold tracking-tight",
        className,
      )}
    >
      CC
    </span>
  );
}

function KeywordsIcon({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-flex", className)}>
      <Sparkles className="h-3.5 w-3.5" strokeWidth={2.1} />
      <span className="absolute -top-0.5 -right-1 text-[8px] leading-none font-bold">
        +
      </span>
    </span>
  );
}

const navItems = [
  { label: "Captions", kind: "cc" as const, active: true },
  { label: "Styles", kind: "palette" as const, active: false },
  { label: "Templates", kind: "grid" as const, active: false },
  { label: "Keywords", kind: "keywords" as const, active: false },
  { label: "Edit Text", kind: "type" as const, active: false },
];

const captionRows = [
  { time: "00:00 – 00:03", text: "This simple mindset", active: false },
  { time: "00:03 – 00:06", text: "changed everything", active: true },
  { time: "00:06 – 00:09", text: "for my channel.", active: false },
  { time: "00:09 – 00:12", text: "Here are 3 things", active: false },
  { time: "00:12 – 00:15", text: "you can apply today.", active: false },
];

const keywords = ["mindset", "everything", "channel"];

const styles = [
  {
    name: "Modern",
    active: true,
    preview: (
      <p className="text-[10px] leading-tight font-extrabold tracking-wide text-[#1e1b4b] uppercase sm:text-[11px]">
        THE QUICK{" "}
        <span className="rounded-[3px] bg-[#7c3aed] px-1 py-px text-white">
          BROWN
        </span>
      </p>
    ),
  },
  {
    name: "Clean",
    active: false,
    preview: (
      <p className="text-[10px] leading-tight font-medium text-[#1e1b4b] sm:text-[11px]">
        the quick brown
      </p>
    ),
  },
  {
    name: "Bold",
    active: false,
    preview: (
      <p className="text-[10px] leading-tight font-black tracking-wide text-[#0f172a] uppercase sm:text-[11px]">
        THE QUICK{" "}
        <span className="rounded-[3px] bg-[#facc15] px-1 text-[#0f172a]">
          BROWN
        </span>
      </p>
    ),
  },
  {
    name: "Highlight",
    active: false,
    preview: (
      <p className="text-[10px] leading-tight font-bold text-[#1e1b4b] sm:text-[11px]">
        the quick{" "}
        <span className="rounded-[3px] bg-[#7c3aed] px-1.5 py-px text-white">
          brown
        </span>
      </p>
    ),
  },
  {
    name: "Neon",
    active: false,
    preview: (
      <p
        className="text-[10px] leading-tight font-extrabold tracking-wider text-[#22d3ee] uppercase sm:text-[11px]"
        style={{ textShadow: "0 0 8px rgba(34,211,238,0.9)" }}
      >
        THE QUICK BROWN
      </p>
    ),
  },
] as const;

const panel =
  "rounded-[18px] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.12),0_2px_8px_rgba(15,23,42,0.04)]";

/**
 * Floating-panel captions editor — same block layout as the remove-bg reference,
 * transparent outer background, crisp HTML text (no blurry screenshot).
 */
export function CaptionsShowcase({ className }: CaptionsShowcaseProps) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[490px] bg-transparent select-none lg:mx-0 lg:max-w-[510px]",
        className,
      )}
      aria-hidden
    >
      {/* Aspect close to ref (~420×594) — floating blocks, no outer card */}
      <div className="grid grid-cols-1 grid-rows-[auto] items-stretch gap-2.5 bg-transparent sm:grid-cols-[64px_minmax(0,1.4fr)_148px] sm:grid-rows-[auto_auto] sm:gap-3">
        {/* LEFT — nav (same layout as reference: CC active pill + stacked icons) */}
        <aside
          className={cn(
            panel,
            "hidden h-full flex-col items-center justify-evenly px-1.5 py-2.5 sm:flex sm:px-2 sm:py-3",
          )}
        >
          {navItems.map((item) => {
            const icon = (() => {
              if (item.kind === "cc") {
                return (
                  <span
                    className={cn(
                      "inline-flex h-7 w-7 items-center justify-center rounded-[8px] sm:h-8 sm:w-8 sm:rounded-[9px]",
                      item.active
                        ? "bg-[#7c3aed] text-white"
                        : "bg-transparent text-[#2d2a4a]",
                    )}
                  >
                    <CcIcon className={item.active ? "text-white" : "text-[#2d2a4a]"} />
                  </span>
                );
              }
              if (item.kind === "palette") {
                return (
                  <Palette className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2} />
                );
              }
              if (item.kind === "grid") {
                return (
                  <LayoutGrid
                    className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                    strokeWidth={2}
                  />
                );
              }
              if (item.kind === "keywords") {
                return <KeywordsIcon className="text-inherit" />;
              }
              return (
                <Type className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.4} />
              );
            })();

            return (
              <div
                key={item.label}
                className={cn(
                  "flex w-full flex-col items-center gap-1 rounded-[14px] px-1 py-2",
                  item.active ? "bg-[#ebe4ff]" : "bg-transparent",
                )}
              >
                <span
                  className={cn(
                    "inline-flex items-center justify-center",
                    !item.active && "text-[#1f1b3d]",
                  )}
                >
                  {icon}
                </span>
                <span
                  className={cn(
                    "max-w-full text-center font-sans text-[8px] leading-[1.1] font-semibold sm:text-[9px]",
                    item.active ? "text-[#7c3aed]" : "text-[#1f1b3d]",
                  )}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </aside>

        {/* CENTER — video preview floating card */}
        <div className={cn(panel, "min-w-0 p-2.5 sm:p-3")}>
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-1.5">
              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-[8px] bg-gradient-to-br from-[#a855f7] to-[#6366f1] shadow-sm">
                <Play className="h-3 w-3 fill-white text-white" />
              </span>
              <span className="truncate font-sans text-[11px] font-bold tracking-tight text-[#1e1b4b] sm:text-xs">
                ClipForge
              </span>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-slate-200 bg-[#fafafa] px-2 py-0.5 font-sans text-[9px] font-semibold text-slate-600 sm:text-[10px]">
              1080 × 1920
              <span className="text-slate-400">▾</span>
            </span>
          </div>

          <div className="relative overflow-hidden rounded-[14px] bg-[#1e1b4b]">
            <div className="relative aspect-[9/11.8] w-full">
              <CaptionsPreviewVideo />
            </div>
          </div>
        </div>

        {/* RIGHT — Caption Styles floating card */}
        <aside className={cn(panel, "hidden flex-col p-2 sm:flex sm:p-2.5")}>
          <p className="mb-1.5 font-sans text-[10px] font-bold text-[#1e1b4b] sm:text-[11px]">
            Caption Styles
          </p>
          <div className="flex flex-1 flex-col gap-1.5">
            {styles.map((style) => (
              <div
                key={style.name}
                className={cn(
                  "rounded-[11px] border px-1.5 py-1.5 sm:px-2",
                  style.active
                    ? "border-[#7c3aed] bg-[#f5f3ff]"
                    : "border-slate-100 bg-[#fafafa]",
                )}
              >
                <p
                  className={cn(
                    "mb-0.5 font-sans text-[8px] font-semibold sm:text-[9px]",
                    style.active ? "text-[#7c3aed]" : "text-slate-500",
                  )}
                >
                  {style.name}
                </p>
                {style.preview}
              </div>
            ))}
          </div>
        </aside>

        {/* BOTTOM — captions + dual-track timeline (same layout as reference crop) */}
        <div className={cn(panel, "p-2.5 sm:col-span-3 sm:p-3")}>
          <div className="mb-2.5 flex items-center gap-3.5 border-b border-slate-100 pb-2 sm:gap-4">
            {["Transcript", "Captions", "Timeline"].map((tab) => (
              <span
                key={tab}
                className={cn(
                  "relative font-sans text-[10px] font-semibold sm:text-[11px]",
                  tab === "Captions"
                    ? "text-[#7c3aed] after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-[#7c3aed]"
                    : "text-slate-400",
                )}
              >
                {tab}
              </span>
            ))}
          </div>

          <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-sans text-[10px] font-bold text-[#1e1b4b] sm:text-[11px]">
                Highlight Keywords
              </span>
              <span className="relative h-4 w-7 shrink-0 rounded-full bg-[#7c3aed]">
                <span className="absolute top-0.5 right-0.5 h-3 w-3 rounded-full bg-white shadow" />
              </span>
              {keywords.map((word) => (
                <span
                  key={word}
                  className="rounded-full bg-[#ede9fe] px-2 py-0.5 font-sans text-[9px] font-semibold text-[#6d28d9] sm:text-[10px]"
                >
                  {word}
                </span>
              ))}
              <span className="rounded-full border border-dashed border-slate-300 px-2 py-0.5 font-sans text-[9px] font-semibold text-slate-500 sm:text-[10px]">
                + Add keyword
              </span>
            </div>
          </div>

          {/* Left captions | right video+audio tracks */}
          <div className="grid items-stretch gap-2.5 sm:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)] sm:gap-3">
            <div className="flex flex-col justify-center gap-1.5 py-0.5">
              {captionRows.map((row) => (
                <div
                  key={row.time}
                  className={cn(
                    "flex items-baseline gap-2 rounded-lg px-1.5 py-1",
                    row.active && "bg-[#f3e8ff]",
                  )}
                >
                  <span className="shrink-0 font-sans text-[8px] font-medium tracking-wide text-slate-400 tabular-nums sm:text-[9px]">
                    {row.time}
                  </span>
                  <span
                    className={cn(
                      "font-sans text-[10px] leading-snug sm:text-[11px]",
                      row.active
                        ? "font-semibold text-[#1e1b4b]"
                        : "font-medium text-[#1e1b4b]",
                    )}
                  >
                    {row.text}
                  </span>
                </div>
              ))}
            </div>

            <div className="relative min-w-0">
              {/* Video filmstrip */}
              <div className="relative mb-1.5 overflow-hidden rounded-[10px] bg-slate-100">
                <div className="flex h-11 gap-px sm:h-12">
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div key={i} className="relative h-full min-w-0 flex-1">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
                        src="/features/captions-speaker.jpg"
                        alt=""
                        className="h-full w-full object-cover"
                        style={{ objectPosition: `${14 + i * 10}% 20%` }}
        draggable={false}
      />
                    </div>
                  ))}
                </div>

                {/* Purple selection on video track */}
                <div className="pointer-events-none absolute inset-y-0.5 left-[28%] right-[18%] rounded-lg border-2 border-[#7c3aed] bg-[#7c3aed]/25">
                  <span className="absolute top-1/2 right-1 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-sm">
                    <ChevronRight className="h-3 w-3 text-[#7c3aed]" strokeWidth={2.5} />
                  </span>
                </div>
              </div>

              {/* Audio waveform track */}
              <div className="relative h-9 overflow-hidden rounded-[10px] bg-[#f3e8ff] sm:h-10">
                <svg
                  viewBox="0 0 360 40"
                  className="h-full w-full"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <path
                    d="M0 22 Q6 8 12 20 T24 18 T36 24 T48 12 T60 22 T72 10 T84 20 T96 14 T108 24 T120 9 T132 21 T144 15 T156 25 T168 11 T180 20 T192 16 T204 24 T216 10 T228 22 T240 14 T252 23 T264 12 T276 21 T288 15 T300 24 T312 11 T324 20 T336 16 T348 22 T360 18 V40 H0 Z"
                    fill="#a78bfa"
                  />
                </svg>

                {/* Purple selection on audio track */}
                <div className="pointer-events-none absolute inset-y-0.5 left-[28%] right-[18%] rounded-lg border-2 border-[#7c3aed] bg-[#7c3aed]/15" />
              </div>

              {/* Playhead across both tracks */}
              <span className="pointer-events-none absolute top-0 bottom-0 left-[42%] z-10 w-0.5 bg-[#7c3aed]">
                <span className="absolute -top-0.5 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#7c3aed] shadow-sm" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
