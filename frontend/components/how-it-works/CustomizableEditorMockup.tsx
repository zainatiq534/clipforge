"use client";

import { useEffect, useRef, type ReactNode } from "react";
import {
  Captions,
  Fullscreen,
  Image as ImageIcon,
  Music2,
  Play,
  Settings,
  Smile,
  Type,
} from "lucide-react";
import { AppImage } from "@/components/ui/Image";
import { cn } from "@/lib/cn";

const EDITOR_DEMO_VIDEO =
  "https://res.cloudinary.com/vbwjkfmd/video/upload/v1792994864/Man_speaking_into_studio_microphone_20261026110656.mp4";

/** Same man as the main player — varied crops so frames feel like a scrub strip */
const timelineThumbs = [
  { src: "/customizable-editor-man.jpg", pos: "object-[42%_18%]" },
  { src: "/customizable-editor-man.jpg", pos: "object-[50%_22%]" },
  { src: "/customizable-editor-man.jpg", pos: "object-[58%_20%]" },
  { src: "/customizable-editor-man.jpg", pos: "object-[46%_28%]" },
  { src: "/customizable-editor-man.jpg", pos: "object-[54%_16%]" },
] as const;

const textStyles = [
  { id: "sans", label: "Aa", active: true, font: "font-sans font-semibold" },
  { id: "serif", label: "Aa", active: false, font: "font-serif font-medium" },
  { id: "display", label: "Aa", active: false, font: "font-display font-bold" },
] as const;

const templates = [
  { name: "Ben", style: "Modern", className: "font-sans font-medium tracking-tight" },
  { name: "BOLDT", style: "Bold", className: "font-sans font-black tracking-tight uppercase" },
  { name: "Minimal", style: "Minimal", className: "font-sans font-light tracking-wide" },
  { name: "Vlog", style: "Vlog", className: "font-display font-bold italic" },
] as const;

const ratios = [
  { id: "16:9", label: "16:9", active: true },
  { id: "9:16", label: "9:16", active: false },
  { id: "1:1", label: "1:1", active: false },
  { id: "4:5", label: "4:5", active: false },
] as const;

type CustomizableEditorMockupProps = {
  className?: string;
};

export function CustomizableEditorMockup({ className }: CustomizableEditorMockupProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;

    let inView = false;

    const tryPlay = () => {
      if (!inView) return;
      video.muted = true;
      video.volume = 0;
      void video.play().catch(() => {});
    };

    const keepMuted = () => {
      video.muted = true;
      video.volume = 0;
    };

    video.addEventListener("canplay", tryPlay);
    video.addEventListener("loadeddata", tryPlay);
    video.addEventListener("volumechange", keepMuted);
    video.addEventListener("play", keepMuted);

    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = Boolean(entry?.isIntersecting);
        if (inView) {
          tryPlay();
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
      video.removeEventListener("canplay", tryPlay);
      video.removeEventListener("loadeddata", tryPlay);
      video.removeEventListener("volumechange", keepMuted);
      video.removeEventListener("play", keepMuted);
    };
  }, []);

  return (
    /* Perspective stage — left recedes, right comes toward the viewer */
    <div
      className={cn(
        "relative mx-auto w-full max-w-[34rem] sm:max-w-none",
        "[perspective:1400px] sm:[perspective:1600px]",
        className,
      )}
    >
      <div
        className={cn(
          "relative origin-center overflow-hidden rounded-[1.35rem] bg-white sm:rounded-[1.6rem]",
          "border border-[#e8e4f0]",
          "shadow-[0_30px_70px_-20px_rgba(91,80,160,0.35),0_14px_32px_-18px_rgba(15,23,42,0.14)]",
          "[transform-style:preserve-3d]",
          /* Pure Y perspective — left back, right toward screen; kept level on the page */
          "[transform:rotateY(-11deg)]",
          "sm:[transform:rotateY(-13deg)]",
        )}
      >
        <div className="flex min-h-0">
          {/* Left toolbar */}
          <nav
            className="flex w-[3.35rem] shrink-0 flex-col items-center gap-1 border-r border-[#eeeaf5] bg-[#fbfafe] px-1.5 py-3 sm:w-[3.75rem] sm:gap-1.5 sm:px-2 sm:py-4"
            aria-label="Editor tools"
          >
            <ToolItem icon={<Type className="h-3.5 w-3.5" strokeWidth={2.25} />} label="Text" active />
            <ToolItem icon={<Captions className="h-3.5 w-3.5" strokeWidth={2} />} label="Captions" />
            <ToolItem icon={<Smile className="h-3.5 w-3.5" strokeWidth={2} />} label="Stickers" />
            <ToolItem icon={<ImageIcon className="h-3.5 w-3.5" strokeWidth={2} />} label="Templates" />
            <ToolItem icon={<Music2 className="h-3.5 w-3.5" strokeWidth={2} />} label="Music" />
          </nav>

          {/* Center: video + timeline */}
          <div className="min-w-0 flex-1 px-2.5 pt-2.5 pb-2.5 sm:px-3 sm:pt-3 sm:pb-3">
            <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-[#0f1219] sm:rounded-[0.9rem]">
              <video
                ref={videoRef}
                src={EDITOR_DEMO_VIDEO}
                className="absolute inset-0 h-full w-full object-cover object-center"
                muted
                loop
                playsInline
                preload="auto"
                controls={false}
                aria-label="Creator editing a clip with captions"
              />

              {/* Editable caption overlay */}
              <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center px-3 sm:bottom-3.5">
                <div className="relative rounded-md bg-[#111827]/78 px-2.5 py-1.5 ring-1 ring-white/70 sm:px-3 sm:py-2">
                  {/* Selection handles */}
                  <span className="absolute -top-1 -left-1 h-2 w-2 rounded-full bg-white shadow" />
                  <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-white shadow" />
                  <span className="absolute -bottom-1 -left-1 h-2 w-2 rounded-full bg-white shadow" />
                  <span className="absolute -right-1 -bottom-1 h-2 w-2 rounded-full bg-white shadow" />
                  <p className="text-center text-[0.62rem] leading-snug font-semibold text-white sm:text-[0.72rem]">
                    Great ideas can change{" "}
                    <span className="rounded-[0.35rem] bg-[#8b5cf6] px-1.5 py-[0.1rem] text-white">
                      everything
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Transport controls */}
            <div className="mt-2 flex items-center gap-2 px-0.5 sm:mt-2.5">
              <Play className="h-3 w-3 shrink-0 fill-[#111827] text-[#111827]" strokeWidth={0} />
              <span className="shrink-0 text-[0.58rem] font-medium text-[#4b5563] sm:text-[0.62rem]">
                0:10 / 4:00
              </span>
              <div className="relative mx-0.5 h-[3px] min-w-0 flex-1 rounded-full bg-[#e5e7eb]">
                <div className="absolute inset-y-0 left-0 w-[18%] rounded-full bg-[#8b5cf6]" />
                <span className="absolute top-1/2 left-[18%] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white ring-2 ring-[#8b5cf6]" />
              </div>
              <Captions className="h-3 w-3 text-[#6b7280]" strokeWidth={2} />
              <Settings className="h-3 w-3 text-[#6b7280]" strokeWidth={2} />
              <Fullscreen className="h-3 w-3 text-[#6b7280]" strokeWidth={2} />
            </div>

            {/* Multi-track timeline */}
            <div className="relative mt-2 overflow-hidden rounded-lg border border-[#ebe7f3] bg-[#faf9fc] p-1.5 sm:mt-2.5 sm:p-2">
              {/* Playhead */}
              <div
                className="pointer-events-none absolute top-1 bottom-1 left-[28%] z-10 w-px bg-[#312e81]"
                aria-hidden
              >
                <span className="absolute -top-0.5 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 rounded-[1px] bg-[#312e81]" />
              </div>

              <div className="flex gap-1">
                {timelineThumbs.map((thumb, i) => (
                  <div
                    key={`${thumb.src}-${i}`}
                    className="relative h-7 min-w-0 flex-1 overflow-hidden rounded-md border border-[#2a2d3a] bg-[#12141c] sm:h-8"
                  >
                    <AppImage
                      src={thumb.src}
                      alt=""
                      fill
                      quality={100}
                      sizes="64px"
                      className={cn("object-cover", thumb.pos)}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-1 h-2.5 overflow-hidden rounded-md bg-[#ede9fe]">
                <div className="h-full w-[42%] rounded-md bg-gradient-to-r from-[#a78bfa] to-[#8b5cf6]" />
              </div>
              <div className="mt-1 flex h-3.5 items-center gap-[2px] overflow-hidden rounded-md bg-[#eef0f4] px-1">
                {Array.from({ length: 28 }).map((_, i) => (
                  <span
                    key={i}
                    className="w-[2px] shrink-0 rounded-full bg-[#9ca3af]"
                    style={{ height: `${30 + ((i * 37) % 70)}%` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right panel */}
          <aside className="w-[7.75rem] shrink-0 border-l border-[#eeeaf5] bg-white px-2 py-2.5 sm:w-[9rem] sm:px-2.5 sm:py-3">
            <p className="text-[0.68rem] font-extrabold tracking-tight text-[#0f172a] sm:text-[0.72rem]">
              Text Styles
            </p>
            <div className="mt-1.5 grid grid-cols-3 gap-1 sm:mt-2 sm:gap-1.5">
              {textStyles.map((style) => (
                <button
                  key={style.id}
                  type="button"
                  className={cn(
                    "flex aspect-square items-center justify-center rounded-lg border text-[0.85rem] font-bold sm:rounded-xl sm:text-[0.95rem]",
                    style.font,
                    style.active
                      ? "border-[#a78bfa] bg-[#f3eefe] text-[#4c1d95] shadow-[0_0_10px_rgba(167,139,250,0.45)]"
                      : "border-[#c4b5fd]/80 bg-[#fcfbfe] text-[#0f172a] shadow-[0_0_8px_rgba(196,181,253,0.28)]",
                  )}
                  aria-pressed={style.active}
                >
                  {style.label}
                </button>
              ))}
            </div>

            <div className="mt-2.5 space-y-2 sm:mt-3">
              <ToggleRow label="Captions" on />
              <ToggleRow label="Emojis" on />
            </div>

            <p className="mt-3 text-[0.68rem] font-extrabold tracking-tight text-[#0f172a] sm:mt-3.5 sm:text-[0.72rem]">
              Templates
            </p>
            <div className="mt-1.5 grid grid-cols-2 gap-1 sm:mt-2 sm:gap-1.5">
              {templates.map((tpl) => (
                <button
                  key={tpl.name}
                  type="button"
                  className="flex flex-col items-center justify-center rounded-lg border border-[#c4b5fd]/80 bg-[#fcfbfe] px-1 py-1.5 text-center shadow-[0_0_8px_rgba(196,181,253,0.28)] sm:rounded-xl sm:py-2"
                >
                  <span className={cn("text-[0.58rem] font-bold text-[#0f172a] sm:text-[0.62rem]", tpl.className)}>
                    {tpl.name}
                  </span>
                  <span className="mt-0.5 text-[0.48rem] font-semibold text-[#475569] sm:text-[0.52rem]">
                    {tpl.style}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-2.5 rounded-xl border border-[#c4b5fd]/80 bg-[#fcfbfe] p-1.5 shadow-[0_0_10px_rgba(196,181,253,0.28)] sm:mt-3 sm:p-2">
              <div className="grid grid-cols-4 gap-1">
                {ratios.map((ratio) => (
                  <button
                    key={ratio.id}
                    type="button"
                    className={cn(
                      "flex flex-col items-center gap-0.5 rounded-lg border px-0.5 py-1",
                      ratio.active
                        ? "border-[#a78bfa] bg-[#f3eefe] shadow-[0_0_8px_rgba(167,139,250,0.4)]"
                        : "border-[#ddd6fe]/70 bg-white",
                    )}
                    aria-pressed={ratio.active}
                  >
                    <RatioGlyph id={ratio.id} active={ratio.active} />
                    <span
                      className={cn(
                        "text-[0.42rem] font-bold sm:text-[0.48rem]",
                        ratio.active ? "text-[#4c1d95]" : "text-[#334155]",
                      )}
                    >
                      {ratio.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function ToolItem({
  icon,
  label,
  active = false,
}: {
  icon: ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center gap-0.5 rounded-xl px-0.5 py-1.5",
        active ? "bg-[#efe9ff]" : "bg-transparent",
      )}
    >
      <span
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-lg sm:h-8 sm:w-8",
          active
            ? "bg-[#8b5cf6] text-white shadow-[0_0_12px_rgba(167,139,250,0.65),0_4px_10px_-2px_rgba(139,92,246,0.55)] ring-1 ring-[#c4b5fd]"
            : "bg-white text-[#1e293b] ring-1 ring-[#c4b5fd]/90 shadow-[0_0_8px_rgba(196,181,253,0.35)]",
        )}
      >
        {icon}
      </span>
      <span
        className={cn(
          "text-[0.48rem] font-bold sm:text-[0.52rem]",
          active ? "text-[#4c1d95]" : "text-[#0f172a]",
        )}
      >
        {label}
      </span>
    </div>
  );
}

function ToggleRow({ label, on }: { label: string; on?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[0.62rem] font-bold text-[#0f172a] sm:text-[0.68rem]">{label}</span>
      <span
        className={cn(
          "relative h-3.5 w-6 rounded-full sm:h-4 sm:w-7",
          on ? "bg-[#8b5cf6]" : "bg-[#d1d5db]",
        )}
        aria-hidden
      >
        <span
          className={cn(
            "absolute top-0.5 h-2.5 w-2.5 rounded-full bg-white shadow sm:h-3 sm:w-3",
            on ? "right-0.5" : "left-0.5",
          )}
        />
      </span>
    </div>
  );
}

function RatioGlyph({ id, active }: { id: string; active: boolean }) {
  const stroke = active ? "#6d28d9" : "#334155";
  if (id === "16:9") {
    return <span className="block h-2 w-3.5 rounded-[2px] border-2" style={{ borderColor: stroke }} />;
  }
  if (id === "9:16") {
    return <span className="block h-3.5 w-2 rounded-[2px] border-2" style={{ borderColor: stroke }} />;
  }
  if (id === "1:1") {
    return <span className="block h-2.5 w-2.5 rounded-[2px] border-2" style={{ borderColor: stroke }} />;
  }
  return <span className="block h-3 w-2.5 rounded-[2px] border-2" style={{ borderColor: stroke }} />;
}
