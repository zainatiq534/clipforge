"use client";

import { useEffect, useRef, useState } from "react";
import { InstagramIcon, TikTokIcon, YouTubeIcon } from "@/components/icons";
import { cloudinaryHqVideo } from "@/lib/cloudinaryVideo";
import { cn } from "@/lib/cn";

export const LOGIN_VIDEO_TOP = cloudinaryHqVideo(
  "https://res.cloudinary.com/vbwjkfmd/video/upload/v1792495786/Man_speaking_into_microphone_20261020162259.mp4",
  { width: 720 },
);

export const LOGIN_VIDEO_BOTTOM = cloudinaryHqVideo(
  "https://res.cloudinary.com/vbwjkfmd/video/upload/v1792495799/Man_speaking_into_microphone_20261020161903.mp4",
  { width: 720 },
);

const platforms = [
  { key: "tiktok", label: "TikTok", Icon: TikTokIcon },
  { key: "instagram", label: "Instagram", Icon: InstagramIcon },
  { key: "youtube", label: "YouTube", Icon: YouTubeIcon },
] as const;

function AutoVideo({ src, label }: { src: string; label: string }) {
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
      className="absolute inset-0 h-full w-full object-cover object-[50%_22%]"
      src={src}
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

function CyclingPlatformBadge({ startIndex = 0 }: { startIndex?: number }) {
  const [index, setIndex] = useState(startIndex % platforms.length);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % platforms.length);
    }, 2200);
    return () => window.clearInterval(id);
  }, []);

  const platform = platforms[index];
  const Icon = platform.Icon;

  return (
    <span
      className="absolute top-1.5 left-1.5 z-10 inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/25 bg-[#0d1020]/78 shadow-sm backdrop-blur-sm"
      aria-label={platform.label}
    >
      <Icon className="h-3 w-3" />
    </span>
  );
}

type LoginClipCardProps = {
  src: string;
  label: string;
  rotate?: string;
  className?: string;
  badgeStart?: number;
};

/** Single tilted phone clip for signup diagonal layout. */
export function LoginClipCard({
  src,
  label,
  rotate = "",
  className,
  badgeStart = 0,
}: LoginClipCardProps) {
  return (
    <div
      className={cn(
        "relative aspect-[9/16] w-[88px] overflow-hidden rounded-[14px] border-2 border-white/90 bg-[#171126]",
        "shadow-[0_12px_28px_rgba(74,37,128,0.18),0_0_0_1px_rgba(196,160,255,0.22)]",
        "sm:w-[96px]",
        rotate,
        className,
      )}
    >
      <AutoVideo src={src} label={label} />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050814]/55 via-transparent to-[#050814]/15" />
      <CyclingPlatformBadge startIndex={badgeStart} />
    </div>
  );
}
