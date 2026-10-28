"use client";

import { useEffect, useRef } from "react";
import { Download, Sparkles } from "lucide-react";
import { AppImage } from "@/components/ui/Image";
import { cn } from "@/lib/cn";

const HERO_VIDEO =
  "https://res.cloudinary.com/vbwjkfmd/video/upload/v1792500586/Man_speaking_into_microphone_20261020174816.mp4";

const generatedClips = [
  { src: "/hiw-man-0.jpg", time: "0:32" },
  { src: "/hiw-man-1.jpg", time: "0:28" },
  { src: "/hiw-man-2.jpg", time: "0:45" },
  { src: "/hiw-man-3.jpg", time: "0:37" },
] as const;

/** Exact user-provided frames — full scene (face + hands + mic), not face-cropped */
const timelineFrames = [
  "/hiw-man-0.jpg",
  "/hiw-man-1.jpg",
  "/hiw-man-2.jpg",
  "/hiw-man-3.jpg",
  "/hiw-man-4.jpg",
  "/hiw-man-5.jpg",
] as const;

type HowItWorksEditorMockupProps = {
  className?: string;
};

export function HowItWorksEditorMockup({ className }: HowItWorksEditorMockupProps) {
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
      { threshold: 0.25 },
    );

    observer.observe(video);
    inView = true;
    tryPlay();

    return () => {
      observer.disconnect();
      video.removeEventListener("canplay", tryPlay);
      video.removeEventListener("volumechange", keepMuted);
      video.removeEventListener("play", keepMuted);
    };
  }, []);

  return (
    <div className={cn("relative w-full", className)}>
      {/* Floating chips above the card */}
      <div className="absolute top-2 left-2 z-20 max-w-[45%] sm:-top-6 sm:left-5 sm:max-w-none">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2 py-[0.35rem] sm:px-2.5",
            "border border-[#d4d0e8] bg-[#f7f5fc]",
            "truncate text-[0.62rem] font-semibold tracking-tight text-[#1f2937] sm:text-[0.72rem]",
            "shadow-[0_6px_16px_-8px_rgba(124,58,237,0.28)]",
          )}
        >
          <AiPoweredBoltIcon />
          AI Powered
        </span>
      </div>

      <div className="absolute top-2 right-2 z-20 max-w-[52%] sm:-top-8 sm:right-3 sm:max-w-none">
        <div
          className={cn(
            "flex items-center gap-1.5 rounded-2xl px-2 py-1.5 sm:gap-2 sm:px-3 sm:py-2.5",
            "border border-[#d4c4f5] bg-[#f3f0ff]",
            "shadow-[0_10px_24px_-12px_rgba(124,58,237,0.35)]",
          )}
        >
          <CreateClipsBoltIcon />
          <span className="truncate pr-0.5 text-[0.62rem] leading-[1.2] font-semibold text-[#1f2937] sm:text-[0.78rem]">
            <span className="sm:hidden">Fast clips</span>
            <span className="hidden sm:inline">
              Create clips in
              <br />
              minutes
            </span>
          </span>
        </div>
      </div>

      {/* Main editor card — wide horizontal composition */}
      <div
        className={cn(
          "relative overflow-visible rounded-[1.5rem] bg-white sm:rounded-[1.75rem]",
          "border border-[#e5e0f0]",
          "shadow-[0_28px_60px_-18px_rgba(124,58,237,0.28),0_12px_28px_-16px_rgba(15,23,42,0.12)]",
        )}
      >
        {/* ClipForge brand header inside the card */}
        <div className="flex items-center gap-2 px-3.5 pt-3 pb-1.5 sm:px-4 sm:pt-3.5 sm:pb-2">
          <AppImage
            src="/clipforge-icon.png"
            alt=""
            width={28}
            height={28}
            unoptimized
            className="h-6 w-6 shrink-0 object-contain sm:h-7 sm:w-7"
            aria-hidden
          />
          <span className="font-sans text-[0.9rem] font-bold tracking-tight text-[#111827] sm:text-[0.95rem]">
            ClipForge
          </span>
        </div>

        {/* Wide row: player + filmstrip | generated clips */}
        <div className="relative grid grid-cols-1 gap-3 px-3 pb-3 sm:grid-cols-[minmax(0,1.7fr)_minmax(11.5rem,0.85fr)] sm:items-start sm:gap-5 sm:px-3.5 sm:pb-3.5 lg:gap-6">
          {/* Left: main video + horizontal filmstrip */}
          <div className="relative z-20 min-w-0">
            <div className="relative">
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-[#0b0d14] sm:rounded-[0.95rem]">
                <video
                  ref={videoRef}
                  className="absolute inset-0 h-full w-full object-cover object-[50%_28%]"
                  src={HERO_VIDEO}
                  muted
                  loop
                  playsInline
                  preload="auto"
                  controls={false}
                  aria-label="Long podcast video being clipped"
                />
              </div>

              {/* Spark between video and Generated Clips */}
              <span
                className={cn(
                  "absolute top-1/2 left-full z-30 hidden -translate-y-1/2 items-center justify-center sm:flex",
                  "h-8 w-8 sm:h-9 sm:w-9",
                  "translate-x-[calc(0.625rem-50%)] lg:translate-x-[calc(0.75rem-50%)]",
                  "rounded-[0.65rem] bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] text-white",
                  "shadow-[0_8px_20px_-6px_rgba(124,58,237,0.75)]",
                )}
                aria-hidden
              >
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4" strokeWidth={2.25} />
              </span>
            </div>

            {/* Filmstrip under player only — wide landscape frames */}
            <div className="mt-2.5 flex gap-1.5 sm:mt-3 sm:gap-2">
              {timelineFrames.map((src) => (
                <div
                  key={src}
                  className={cn(
                    "relative aspect-[16/10] min-w-0 flex-1 overflow-hidden",
                    "rounded-lg sm:rounded-xl",
                    "border-[2.5px] border-[#2a2d3a] bg-[#0b0d14]",
                    "shadow-[0_4px_12px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.12)]",
                  )}
                >
                  <AppImage
                    src={src}
                    alt=""
                    fill
                    quality={100}
                    sizes="120px"
                    className="object-cover object-center"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Generated Clips — sits beside video, ~30% width */}
          <div
            className={cn(
              "relative z-10 w-full rounded-[1rem] border border-[#e5e0f0] bg-white p-2.5 sm:rounded-[1.15rem] sm:p-3",
            )}
          >
            <p className="mb-2 text-[0.75rem] font-semibold tracking-tight text-[#111827] sm:mb-2.5 sm:text-[0.8rem]">
              Generated Clips
            </p>
            <div className="flex flex-col gap-2">
              {generatedClips.map((clip) => (
                <div
                  key={clip.time + clip.src}
                  className="flex items-center gap-2.5 rounded-xl border border-[#ebe6f5] bg-[#fcfbfe] px-2 py-1.5"
                >
                  <div
                    className={cn(
                      "relative h-11 w-[4.25rem] shrink-0 overflow-hidden sm:h-12 sm:w-[4.75rem]",
                      "rounded-lg border-[2px] border-[#2a2d3a] bg-[#0b0d14]",
                    )}
                  >
                    <AppImage
                      src={clip.src}
                      alt=""
                      fill
                      quality={100}
                      sizes="80px"
                      className="object-cover object-center"
                    />
                  </div>
                  <p className="min-w-0 flex-1 text-[0.72rem] font-semibold text-[#374151] sm:text-[0.76rem]">
                    {clip.time}
                  </p>
                  <Download
                    className="h-3.5 w-3.5 shrink-0 text-[#8b5cf6]"
                    strokeWidth={2.25}
                    aria-hidden
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Purple bolt — same mark as the reference chips. */
function AiPoweredBoltIcon() {
  return (
    <svg
      viewBox="0 0 14 18"
      className="h-3.5 w-2.5 shrink-0 sm:h-4 sm:w-3"
      aria-hidden
    >
      <path
        d="M8.1 1.2 2.4 9.6h3.55L4.6 16.8l7.05-10.1H8.2L8.1 1.2Z"
        fill="#a885f7"
        stroke="#7c3aed"
        strokeWidth="0.85"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Larger purple bolt for the Create clips chip — same color as reference. */
function CreateClipsBoltIcon() {
  return (
    <svg
      viewBox="0 0 14 18"
      className="h-7 w-5 shrink-0 sm:h-8 sm:w-[1.35rem]"
      aria-hidden
    >
      <path
        d="M8.1 1.2 2.4 9.6h3.55L4.6 16.8l7.05-10.1H8.2L8.1 1.2Z"
        fill="#a885f7"
        stroke="#7c3aed"
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
    </svg>
  );
}
