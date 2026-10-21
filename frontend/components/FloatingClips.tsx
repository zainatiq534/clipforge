"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Play } from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { TikTokIcon } from "@/components/icons/TikTokIcon";
import { cn } from "@/lib/cn";

/** Original Cloudinary encodes — no extra compression for max quality. */
const INSTAGRAM_VIDEO =
  "https://res.cloudinary.com/vbwjkfmd/video/upload/v1792495799/Man_speaking_into_microphone_20261020161903.mp4";
const TIKTOK_VIDEO =
  "https://res.cloudinary.com/vbwjkfmd/video/upload/v1792495786/Man_speaking_into_microphone_20261020162259.mp4";

type FloatingClipsProps = {
  className?: string;
};

export function FloatingClips({ className }: FloatingClipsProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-[5] hidden overflow-visible lg:block",
        className,
      )}
      aria-hidden
    >
      {/* Left — Instagram */}
      <div
        className={cn(
          "absolute top-[28%] left-[5%] xl:left-[8%]",
          "w-[8.25rem] xl:w-[9.5rem]",
          "origin-center -rotate-[6deg]",
          "animate-float-left",
        )}
      >
        <ClipCard
          videoSrc={INSTAGRAM_VIDEO}
          views="1.8M"
          badge={
            <div className="flex h-7 w-7 items-center justify-center rounded-[0.55rem] bg-black shadow-sm">
              <InstagramIcon className="h-4 w-4" />
            </div>
          }
        />
      </div>

      {/* Right — TikTok */}
      <div
        className={cn(
          "absolute top-[26%] right-[5%] xl:right-[8%]",
          "w-[8.25rem] xl:w-[9.5rem]",
          "origin-center rotate-[6deg]",
          "animate-float",
        )}
      >
        <ClipCard
          videoSrc={TIKTOK_VIDEO}
          views="2.4M"
          badge={
            <div className="flex h-7 w-7 items-center justify-center rounded-[0.55rem] bg-black shadow-sm">
              <TikTokIcon className="h-4 w-4 text-white" />
            </div>
          }
        />
      </div>
    </div>
  );
}

type ClipCardProps = {
  videoSrc: string;
  views: string;
  badge: ReactNode;
};

function ClipCard({ videoSrc, views, badge }: ClipCardProps) {
  return (
    <div
      className={cn(
        "relative aspect-[9/16] w-full overflow-hidden rounded-[1.15rem]",
        "bg-[#0b0e1a]",
        "shadow-[0_18px_40px_-10px_rgba(0,0,0,0.75),0_0_24px_rgba(90,120,255,0.28)]",
        "ring-1 ring-[#7aa0ff]/70",
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 z-10 rounded-[1.15rem] ring-1 ring-inset ring-[#9bb6ff]/50"
        aria-hidden
      />

      <AutoPlayClip videoSrc={videoSrc} />

      <div className="absolute top-3 left-3 z-20 shrink-0">{badge}</div>

      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-2.5 pt-8 pb-2.5">
        <div className="flex items-center gap-1 text-[0.65rem] font-semibold text-white">
          <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white text-[#050814]">
            <Play className="h-2 w-2 fill-current" strokeWidth={0} />
          </span>
          <span>{views}</span>
        </div>
      </div>
    </div>
  );
}

function forceMute(video: HTMLVideoElement) {
  video.muted = true;
  video.defaultMuted = true;
  video.volume = 0;
}

function AutoPlayClip({ videoSrc }: { videoSrc: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    forceMute(video);

    const tryPlay = () => {
      forceMute(video);
      void video.play().catch(() => {
        // Browsers may block until the next user gesture; attributes still cover most cases.
      });
    };

    const keepMuted = () => forceMute(video);

    tryPlay();
    video.addEventListener("loadeddata", tryPlay);
    video.addEventListener("canplay", tryPlay);
    video.addEventListener("volumechange", keepMuted);
    video.addEventListener("play", keepMuted);

    return () => {
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
      className="absolute inset-0 h-full w-full object-cover object-[center_18%]"
      autoPlay
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
