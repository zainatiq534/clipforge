"use client";

import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { cloudinaryHqVideo } from "@/lib/cloudinaryVideo";
import { cn } from "@/lib/cn";

const VIDEO_SRC = cloudinaryHqVideo(
  "https://res.cloudinary.com/vbwjkfmd/video/upload/v1792500586/Man_speaking_into_microphone_20261020174816.mp4",
  { width: 1280 },
);

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

type ShowcaseVideoPlayerProps = {
  className?: string;
};

/** Autoplaying muted preview in FeatureShowcase (Smart Clipping section). */
export function ShowcaseVideoPlayer({ className }: ShowcaseVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [progress, setProgress] = useState(0.18);
  const [current, setCurrent] = useState("00:00");
  const [duration, setDuration] = useState("00:00");
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const tryPlay = () => {
      el.muted = true;
      void el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    };

    tryPlay();

    const onTime = () => {
      if (!el.duration) return;
      setProgress(el.currentTime / el.duration);
      setCurrent(formatTime(el.currentTime));
    };
    const onMeta = () => setDuration(formatTime(el.duration));
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);

    el.addEventListener("timeupdate", onTime);
    el.addEventListener("loadedmetadata", onMeta);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);

    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("loadedmetadata", onMeta);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
    };
  }, []);

  return (
    <div
      className={cn(
        "relative aspect-[16/10] overflow-hidden rounded-2xl border-2 border-[#c4b5fd]/70 bg-[#050814] shadow-[0_0_28px_rgba(139,92,246,0.35)]",
        className,
      )}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover object-[50%_20%] [transform:translateZ(0)]"
        src={VIDEO_SRC}
        poster="/features/showcase-video-poster.png"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-label="ClipForge preview video"
      />

      {!playing && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white shadow-[0_0_28px_rgba(139,92,246,0.35)] backdrop-blur-sm">
            <Icon icon={Play} size="lg" className="ml-0.5" fill="currentColor" />
          </span>
        </div>
      )}

      <div className="absolute inset-x-3 bottom-3 z-10">
        <div className="h-1 overflow-hidden rounded-full bg-white/25">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#a78bfa] to-[#3b82f6] transition-[width] duration-150"
            style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
          />
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[10px] font-medium text-white/85">
          <span>{current}</span>
          <span>1x</span>
          <span>{duration}</span>
        </div>
      </div>
    </div>
  );
}
