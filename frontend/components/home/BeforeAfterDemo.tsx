"use client";

import { useEffect, useRef, useState } from "react";
import { Play, Scissors, Video } from "lucide-react";
import {
  InstagramBadgeIcon,
  TikTokBadgeIcon,
  YouTubeShortsIcon,
} from "@/components/icons";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";

/** Original Cloudinary encodes — no extra compression for max quality. */
const clips = [
  {
    platform: "tiktok" as const,
    videoSrc:
      "https://res.cloudinary.com/vbwjkfmd/video/upload/v1792498617/Bearded_man_speaking_to_camera_20261020171424.mp4",
    viewsOverlay: "1.2M",
    duration: "0:38",
    title: "The Mindset Shift",
    clipLabel: "Clip 1",
    stats: "1.2M views • 0:38",
    icon: "chart" as const,
  },
  {
    platform: "youtube" as const,
    videoSrc:
      "https://res.cloudinary.com/vbwjkfmd/video/upload/v1792498610/Man_speaking_to_camera_20261020171432.mp4",
    viewsOverlay: "892K",
    duration: "0:52",
    title: "Top 3 Tools",
    clipLabel: "Clip 2",
    stats: "892K views • 0:52",
    icon: "zap" as const,
  },
  {
    platform: "instagram" as const,
    videoSrc:
      "https://res.cloudinary.com/vbwjkfmd/video/upload/v1792498594/Bearded_man_talking_in_video_20261020171439.mp4",
    viewsOverlay: "643K",
    duration: "0:41",
    title: "Game Changing Tip",
    clipLabel: "Clip 3",
    stats: "643K views • 0:41",
    icon: "star" as const,
  },
] as const;

type BeforeAfterDemoProps = {
  className?: string;
};

export function BeforeAfterDemo({ className }: BeforeAfterDemoProps) {
  return (
    <section
      id="before-after"
      className={cn(
        "relative px-5 py-10 sm:px-8 sm:py-12 lg:py-14",
        className,
      )}
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <SectionLabel>Before & After Demo</SectionLabel>
          </Reveal>

          <Reveal delay={0.06}>
            <h2
              className={cn(
                "mt-6 max-w-4xl text-center font-display font-bold tracking-[-0.03em]",
                "text-[2.15rem] leading-[1.15] sm:text-[2.85rem] md:text-[3.35rem] lg:text-[3.75rem]",
              )}
            >
              <span className="relative inline-flex items-center justify-center gap-5 sm:gap-7 md:gap-8">
                <AccentLines side="left" size="lg" />
                <span style={{ color: "#111827" }}>
                  Turn This{" "}
                  <span className="bg-gradient-to-r from-[#8b5cf6] via-[#a855f7] to-[#6366f1] bg-clip-text text-transparent">
                    Long Video
                  </span>
                </span>
                <AccentLines side="right" size="lg" />
              </span>
              <span className="mt-0.5 block sm:mt-1" style={{ color: "#111827" }}>
                Into Viral Clips
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p
              className="mt-5 max-w-2xl text-center font-sans text-base leading-relaxed sm:mt-6 sm:text-lg"
              style={{ color: "#6b7280" }}
            >
              Upload a single video, and let ClipForge automatically find the best
              moments, add captions, reframe, and create multiple viral-ready clips
              in seconds.
            </p>
          </Reveal>
        </div>

        <div className="relative mt-12 lg:mt-16">
          <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:justify-center lg:gap-0">
            {/* Original long video */}
            <Reveal from="left" className="relative z-0 w-full max-w-xl shrink-0 lg:max-w-[27rem] xl:max-w-[29rem]">
              <OriginalVideoCard />
            </Reveal>

            {/* Icon + arrows centered in the gutter — no overlap on either video */}
            <Reveal
              delay={0.08}
              from="none"
              className="relative z-20 -my-2 flex shrink-0 items-center justify-center lg:my-0"
            >
              <TransformHub />
            </Reveal>

            {/* Viral clips */}
            <Reveal
              from="right"
              delay={0.12}
              className="relative z-0 w-full min-w-0 flex-1 lg:max-w-[27rem] xl:max-w-[29rem]"
            >
              <ViralClipsColumn />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

const ORIGINAL_LONG_VIDEO =
  "https://res.cloudinary.com/vbwjkfmd/video/upload/v1792500586/Man_speaking_into_microphone_20261020174816.mp4";

function formatVideoTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function OriginalVideoCard() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);
  const durationLabel = formatVideoTime(duration);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    forceMute(video);

    let inView = false;

    const tryPlay = () => {
      if (!inView) return;
      forceMute(video);
      void video.play().catch(() => {});
    };

    const onMeta = () => setDuration(video.duration || 0);
    const keepMuted = () => forceMute(video);

    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("durationchange", onMeta);
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
      { threshold: 0.4 },
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("durationchange", onMeta);
      video.removeEventListener("canplay", tryPlay);
      video.removeEventListener("volumechange", keepMuted);
      video.removeEventListener("play", keepMuted);
    };
  }, []);

  return (
    <div className="w-full">
      <div
        className={cn(
          "relative overflow-hidden rounded-[1.15rem] bg-[#0b0d14] sm:rounded-[1.35rem]",
          "shadow-[0_22px_50px_-18px_rgba(76,29,149,0.35)]",
          "ring-1 ring-[#c4b5fd]/35",
        )}
      >
        <div className="relative aspect-[16/10] overflow-hidden">
          <video
            ref={videoRef}
            src={ORIGINAL_LONG_VIDEO}
            className="absolute inset-0 h-full w-full object-cover object-[50%_28%]"
            muted
            playsInline
            preload="auto"
            loop
            controls={false}
          />

          <div className="absolute top-2.5 left-2.5 z-10 sm:top-3 sm:left-3">
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full py-1 pr-3 pl-1",
                "bg-[#1a1b26] text-[0.65rem] font-semibold tracking-wide text-white sm:text-[0.7rem]",
                "border border-[#8b7bb8]/70",
                "shadow-[0_0_0_0.5px_rgba(139,123,184,0.35)]",
              )}
            >
              <span
                className={cn(
                  "flex h-[1.35rem] w-[1.35rem] shrink-0 items-center justify-center",
                  "rounded-[0.55rem] bg-[#6d4aff] sm:h-6 sm:w-6 sm:rounded-[0.65rem]",
                )}
              >
                <Video
                  className="h-3 w-3 text-white sm:h-3.5 sm:w-3.5"
                  strokeWidth={2.4}
                />
              </span>
              Original Long Video
            </span>
          </div>

          <div className="absolute top-2.5 right-2.5 z-10 sm:top-3 sm:right-3">
            <span className="rounded-md bg-black/70 px-2 py-0.5 text-[0.65rem] font-medium text-white sm:rounded-lg sm:text-[0.7rem]">
              {durationLabel}
            </span>
          </div>
        </div>
      </div>

      <h3
        className="mt-3.5 font-display text-[0.95rem] font-semibold tracking-tight sm:text-[1.05rem]"
        style={{ color: "#111827" }}
      >
        Podcast Episode: Building a Creator Business in 2024
      </h3>
      <p className="mt-1 text-sm" style={{ color: "#6b7280" }}>
        {duration > 0 ? `${durationLabel.replace(":", " min ")} sec` : "Loading…"} • High quality
      </p>
    </div>
  );
}

function TransformHub() {
  return (
    <div
      className="relative flex h-[11rem] w-[8.25rem] shrink-0 items-center justify-center sm:h-[12.5rem] sm:w-[9.25rem] lg:h-[14rem] lg:w-[10.5rem]"
      aria-hidden
    >
      <svg
        viewBox="0 0 160 220"
        className="h-full w-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient
            id="baTopArrow"
            x1="8"
            y1="86"
            x2="152"
            y2="44"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#c4b5fd" stopOpacity="0.18" />
            <stop offset="40%" stopColor="#a78bfa" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="1" />
          </linearGradient>
          <linearGradient
            id="baBotArrow"
            x1="8"
            y1="134"
            x2="152"
            y2="176"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#e9d5ff" stopOpacity="0.2" />
            <stop offset="40%" stopColor="#c084fc" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#d946ef" stopOpacity="1" />
          </linearGradient>
          <linearGradient
            id="baSparkFill"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop offset="0%" stopColor="#9f7aea" />
            <stop offset="55%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#6d28d9" />
          </linearGradient>
          <filter
            id="baCardShadow"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feDropShadow
              dx="0"
              dy="5"
              stdDeviation="6"
              floodColor="#7c3aed"
              floodOpacity="0.32"
            />
          </filter>
          <marker
            id="baCapTop"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path
              d="M1.5 1.5L8 5L1.5 8.5"
              fill="none"
              stroke="#7c3aed"
              strokeWidth="1.35"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </marker>
          <marker
            id="baCapBot"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path
              d="M1.5 1.5L8 5L1.5 8.5"
              fill="none"
              stroke="#d946ef"
              strokeWidth="1.35"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </marker>
        </defs>

        <path
          d="M8 88C38 42 110 28 152 58"
          stroke="url(#baTopArrow)"
          strokeWidth="2.4"
          strokeLinecap="round"
          markerEnd="url(#baCapTop)"
        />
        <path
          d="M8 132C38 178 110 192 152 162"
          stroke="url(#baBotArrow)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeDasharray="6 4.5"
          markerEnd="url(#baCapBot)"
        />

        <rect
          x="50"
          y="82"
          width="60"
          height="60"
          rx="17"
          fill="#ffffff"
          stroke="#e9e4f5"
          strokeWidth="1.25"
          filter="url(#baCardShadow)"
        />

        <g transform="translate(56 90)">
          <path
            fill="url(#baSparkFill)"
            d="M18 2C18.7 10.2 22.2 16.2 30.5 19.2 22.2 22.2 18.7 28.2 18 36.4 17.3 28.2 13.8 22.2 5.5 19.2 13.8 16.2 17.3 10.2 18 2Z"
          />
          <path
            fill="#7c3aed"
            d="M38 4C38.35 8.2 40.1 11.2 44.4 12.7 40.1 14.2 38.35 17.2 38 21.4 37.65 17.2 35.9 14.2 31.6 12.7 35.9 11.2 37.65 8.2 38 4Z"
          />
          <path
            fill="#8b5cf6"
            d="M36 22C36.28 25.4 37.7 27.85 41.15 29.05 37.7 30.25 36.28 32.7 36 36.1 35.72 32.7 34.3 30.25 30.85 29.05 34.3 27.85 35.72 25.4 36 22Z"
          />
        </g>
      </svg>
    </div>
  );
}

function ViralClipsColumn() {
  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-center gap-4 sm:gap-5">
        <AccentLines side="left" size="sm" />
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5",
            "border border-[#ddd6fe] bg-[#f3e8ff]/95",
            "text-[0.68rem] font-semibold tracking-[0.04em] text-[#7c3aed] uppercase sm:text-[0.72rem]",
          )}
        >
          <Scissors className="h-3.5 w-3.5" strokeWidth={2.25} />
          3 Viral Clips Generated
        </span>
        <AccentLines side="right" size="sm" />
      </div>

      <div className="grid grid-cols-3 items-start gap-2.5 sm:gap-3">
        {clips.map((clip) => (
          <ViralClipCard key={clip.clipLabel} {...clip} />
        ))}
      </div>
    </div>
  );
}

function ViralClipCard({
  platform,
  videoSrc,
  viewsOverlay,
  duration,
  title,
  clipLabel,
  stats,
  icon,
}: (typeof clips)[number]) {
  return (
    <article className="flex min-w-0 flex-col">
      <div
        className={cn(
          "relative overflow-hidden rounded-[0.85rem] sm:rounded-[1rem]",
          "ring-1 ring-[#d8b4fe]/70",
          "shadow-[0_14px_32px_-14px_rgba(124,58,237,0.35)]",
        )}
      >
        <div className="relative aspect-[9/14] overflow-hidden bg-[#1a1c24]">
          <InViewAutoPlayVideo videoSrc={videoSrc} />

          <div className="absolute top-1.5 right-1.5 h-5 w-5 overflow-hidden rounded-[0.35rem] shadow-sm ring-1 ring-black/10 sm:h-6 sm:w-6 sm:rounded-[0.4rem]">
            <PlatformMark platform={platform} />
          </div>

          <div className="absolute inset-x-1.5 bottom-1.5 flex items-center justify-between gap-1 sm:inset-x-2 sm:bottom-2">
            <span className="inline-flex items-center gap-0.5 rounded-full bg-black/65 px-1.5 py-0.5 text-[0.5rem] font-medium text-white sm:text-[0.55rem]">
              <Play className="h-2 w-2 fill-white" strokeWidth={0} />
              {viewsOverlay}
            </span>
            <span className="rounded-full bg-black/65 px-1.5 py-0.5 text-[0.5rem] font-medium text-white sm:text-[0.55rem]">
              {duration}
            </span>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "mt-1 rounded-[0.75rem] border border-[#e9e4f5] bg-white px-2 py-2.5 sm:mt-1 sm:rounded-[0.85rem] sm:px-2.5 sm:py-3",
          "shadow-[0_8px_20px_-14px_rgba(124,58,237,0.28)]",
        )}
      >
        <div className="flex items-start gap-2">
          <ClipMetaIcon type={icon} />
          <div className="min-w-0 flex-1">
            <p className="text-[0.58rem] font-semibold leading-tight text-[#7c3aed] sm:text-[0.62rem]">
              {clipLabel}
            </p>
            <p
              className="mt-0.5 truncate text-[0.68rem] font-semibold leading-snug sm:text-[0.75rem]"
              style={{ color: "#111827" }}
            >
              {title}
            </p>
            <p
              className="mt-1 text-[0.52rem] leading-tight sm:text-[0.58rem]"
              style={{ color: "#6b7280" }}
            >
              {stats}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}

function forceMute(video: HTMLVideoElement) {
  video.muted = true;
  video.defaultMuted = true;
  video.volume = 0;
}

function InViewAutoPlayVideo({ videoSrc }: { videoSrc: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    forceMute(video);

    let inView = false;

    const tryPlay = () => {
      if (!inView) return;
      forceMute(video);
      void video.play().catch(() => {});
    };

    const keepMuted = () => forceMute(video);

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
    video.addEventListener("loadeddata", tryPlay);
    video.addEventListener("canplay", tryPlay);
    video.addEventListener("volumechange", keepMuted);
    video.addEventListener("play", keepMuted);

    return () => {
      observer.disconnect();
      video.removeEventListener("loadeddata", tryPlay);
      video.removeEventListener("canplay", tryPlay);
      video.removeEventListener("volumechange", keepMuted);
      video.removeEventListener("play", keepMuted);
    };
  }, [videoSrc]);

  return (
    <video
      ref={videoRef}
      src={videoSrc}
      className="absolute inset-0 h-full w-full object-cover object-[center_22%]"
      loop
      muted
      playsInline
      preload="auto"
      disablePictureInPicture
      controls={false}
      tabIndex={-1}
    />
  );
}

function PlatformMark({
  platform,
}: {
  platform: "tiktok" | "youtube" | "instagram";
}) {
  if (platform === "tiktok") {
    return <TikTokBadgeIcon className="h-full w-full" />;
  }
  if (platform === "youtube") {
    return <YouTubeShortsIcon className="h-full w-full" />;
  }
  return <InstagramBadgeIcon className="h-full w-full" />;
}

function ClipMetaIcon({ type }: { type: "chart" | "zap" | "star" }) {
  if (type === "chart") {
    return (
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center text-[#7c3aed] sm:h-7 sm:w-7">
        <svg
          viewBox="0 0 24 24"
          className="h-[1.15rem] w-[1.15rem] sm:h-5 sm:w-5"
          fill="none"
          aria-hidden
        >
          {/* Baseline */}
          <path
            d="M3 19.5h18"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Rising chart line */}
          <path
            d="M4.5 15.5 8 11.5l3.2 2.8L16.5 7"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Arrow head */}
          <path
            d="M13.2 7.2h3.6v3.6"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }
  if (type === "zap") {
    return (
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center text-[#60a5fa] sm:h-7 sm:w-7">
        <svg
          viewBox="0 0 24 24"
          className="h-[1.15rem] w-[1.15rem] sm:h-5 sm:w-5"
          fill="none"
          aria-hidden
        >
          <path
            d="M13 2 4.5 13.2h6.2L10.2 22 19.5 10.8H13.2L13 2Z"
            stroke="currentColor"
            strokeWidth="1.85"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }
  return (
    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center text-[#7c3aed] sm:h-7 sm:w-7">
      <svg
        viewBox="0 0 24 24"
        className="h-[1.15rem] w-[1.15rem] sm:h-5 sm:w-5"
        fill="none"
        aria-hidden
      >
        <path
          d="M12 3.2 14.4 9.2l6.4.6-4.9 4.2 1.5 6.2L12 16.8 6.6 20.2l1.5-6.2-4.9-4.2 6.4-.6L12 3.2Z"
          stroke="currentColor"
          strokeWidth="1.85"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

/**
 * Decorative purple pill accents — radiate OUTWARD (< text >).
 * Drawn as SVG so the open chevron clearly points away from the content.
 */
function AccentLines({
  side,
  size = "sm",
}: {
  side: "left" | "right";
  size?: "sm" | "lg";
}) {
  const box = size === "lg" ? "h-7 w-6 sm:h-8 sm:w-7" : "h-5 w-4";

  // Left-pointing open chevron (outward on the left of text).
  // Extra inset on the text-facing side (x≈20) so lines aren't flush to the end.
  // Right side mirrors via scale-x.
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn(
        box,
        "shrink-0 overflow-visible",
        side === "right" && "scale-x-[-1]",
      )}
      fill="none"
      aria-hidden
    >
      {/* Top stroke — angles up as it goes outward (left) */}
      <path
        d="M20 10 L3 3"
        stroke="#8b5cf6"
        strokeWidth={size === "lg" ? 3.2 : 2.6}
        strokeLinecap="round"
        style={{ filter: "drop-shadow(0 0 3px rgba(139,92,246,0.55))" }}
      />
      {/* Bottom stroke — nearly horizontal, outward */}
      <path
        d="M20 22 L2 24"
        stroke="#8b5cf6"
        strokeWidth={size === "lg" ? 3.2 : 2.6}
        strokeLinecap="round"
        style={{ filter: "drop-shadow(0 0 3px rgba(139,92,246,0.55))" }}
      />
    </svg>
  );
}
