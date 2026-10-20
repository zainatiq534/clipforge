"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";
import {
  BarChart3,
  ChevronDown,
  Play,
  Smile,
  Sparkles,
  Upload,
  Users,
  Zap,
} from "lucide-react";
import { AppImage } from "@/components/ui/Image";
import { cn } from "@/lib/cn";

const FEATURES_DEMO_VIDEO =
  "https://res.cloudinary.com/vbwjkfmd/video/upload/v1792503825/Woman_pointing_finger_upward_spe__20261020184321.mp4";

type FeaturesProductMockupProps = {
  className?: string;
};

function formatClock(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function FeaturesProductMockup({ className }: FeaturesProductMockupProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const progress = duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 0;
  // Selection window tracks the playhead (~34% wide, clamped to edges)
  const windowWidth = 0.34;
  const windowLeft = Math.min(
    1 - windowWidth,
    Math.max(0, progress - windowWidth / 2),
  );
  const windowRight = 1 - (windowLeft + windowWidth);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.volume = 0;

    let inView = false;
    let frameId = 0;

    const tryPlay = () => {
      if (!inView) return;
      video.muted = true;
      video.volume = 0;
      void video.play().catch(() => {});
    };

    // Smooth playhead: sample every frame instead of sparse timeupdate events
    const tick = () => {
      setCurrentTime(video.currentTime);
      frameId = requestAnimationFrame(tick);
    };

    const startTick = () => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(tick);
    };

    const stopTick = () => {
      cancelAnimationFrame(frameId);
    };

    const onMeta = () => setDuration(video.duration || 0);
    const onPlay = () => startTick();
    const onPause = () => {
      stopTick();
      setCurrentTime(video.currentTime);
    };

    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("durationchange", onMeta);
    video.addEventListener("canplay", tryPlay);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("seeking", () => setCurrentTime(video.currentTime));
    video.addEventListener("seeked", () => setCurrentTime(video.currentTime));

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
    if (!video.paused) startTick();

    return () => {
      stopTick();
      observer.disconnect();
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("durationchange", onMeta);
      video.removeEventListener("canplay", tryPlay);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, []);

  const seekFromClientX = useCallback(
    (clientX: number) => {
      const video = videoRef.current;
      const bar = timelineRef.current;
      if (!video || !bar || !duration) return;
      const rect = bar.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      video.currentTime = ratio * duration;
      setCurrentTime(video.currentTime);
    },
    [duration],
  );

  const onTimelineClick = (event: MouseEvent<HTMLDivElement>) => {
    seekFromClientX(event.clientX);
  };

  const onTimelineKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !duration) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      video.currentTime = Math.min(duration, video.currentTime + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      video.currentTime = Math.max(0, video.currentTime - 1);
    }
  };

  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[38rem] select-none lg:max-w-none",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] opacity-90 blur-3xl sm:-inset-8"
        style={{
          background:
            "radial-gradient(ellipse 78% 72% at 48% 48%, rgba(139,92,246,0.48) 0%, rgba(124,58,237,0.2) 42%, transparent 70%)",
        }}
      />

      <div className="relative py-10 pl-9 sm:py-12 sm:pl-11 lg:py-14 lg:pl-12">
        <div
          className={cn(
            "relative z-0 mr-[32%] flex flex-col sm:mr-[33%]",
            "rounded-[1.35rem] bg-[#0b0d14] sm:rounded-[1.5rem]",
            "shadow-[0_28px_60px_-16px_rgba(76,29,149,0.55)]",
            "ring-1 ring-white/[0.06]",
          )}
        >
          <div className="relative aspect-[16/10.5] overflow-hidden rounded-t-[1.35rem] bg-[#10121c] sm:rounded-t-[1.5rem]">
            <video
              ref={videoRef}
              src={FEATURES_DEMO_VIDEO}
              className="absolute inset-0 h-full w-full object-cover object-[50%_22%]"
              muted
              loop
              playsInline
              preload="auto"
              controls={false}
            />

            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-full bg-black/75 px-2 py-[0.28rem] text-[0.6rem] font-medium tracking-wide text-white sm:top-3 sm:left-3 sm:px-2.5 sm:text-[0.66rem]">
              <Play className="h-2.5 w-2.5 fill-white" strokeWidth={0} />
              <span>
                {formatClock(currentTime)} / {formatClock(duration)}
              </span>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center px-3 sm:bottom-3.5 sm:px-4">
              <div
                className={cn(
                  "rounded-2xl bg-[#0a0c14]/88 px-3.5 py-2 backdrop-blur-md sm:px-4 sm:py-2.5",
                  "shadow-[0_0_28px_rgba(139,92,246,0.45),0_0_0_1px_rgba(167,139,250,0.35)]",
                )}
              >
                <p className="text-center text-[0.7rem] font-semibold text-white sm:text-[0.8rem]">
                  This tool is a{" "}
                  <span className="bg-gradient-to-r from-[#e879f9] via-[#c084fc] to-[#818cf8] bg-clip-text text-transparent [filter:drop-shadow(0_0_10px_rgba(192,132,252,0.85))]">
                    game changer!
                  </span>{" "}
                  <span aria-hidden>✨</span>
                </p>
              </div>
            </div>
          </div>

          {/* Interactive timeline — animates with playback, click to seek */}
          <div
            ref={timelineRef}
            role="slider"
            aria-label="Video timeline"
            aria-valuemin={0}
            aria-valuemax={Math.floor(duration)}
            aria-valuenow={Math.floor(currentTime)}
            tabIndex={0}
            onClick={onTimelineClick}
            onKeyDown={onTimelineKeyDown}
            className="relative mt-auto cursor-pointer rounded-b-[1.35rem] px-2.5 pt-2.5 pb-3 sm:rounded-b-[1.5rem] sm:px-3 sm:pt-3 sm:pb-3.5"
          >
            <NeonWaveform progress={progress} />

            <div className="relative mt-2">
              <div className="flex gap-[2px] overflow-hidden rounded-lg">
                {[0, 1, 2, 3, 4, 5].map((i) => {
                  const segmentStart = i / 6;
                  const segmentEnd = (i + 1) / 6;
                  const inSelection =
                    segmentEnd > windowLeft && segmentStart < windowLeft + windowWidth;
                  return (
                    <div
                      key={i}
                      className={cn(
                        "relative h-9 flex-1 overflow-hidden rounded-[0.35rem] sm:h-11",
                        "transition-[opacity,filter] duration-150",
                        !inSelection && "opacity-[0.72] brightness-[0.82]",
                      )}
                    >
                      <AppImage
                        src={`/features-thumb-${i}.jpg`}
                        alt=""
                        fill
                        quality={100}
                        sizes="120px"
                        className="object-cover object-center"
                      />
                    </div>
                  );
                })}
              </div>

              <div
                className={cn(
                  "pointer-events-none absolute inset-y-[-4px]",
                  "rounded-[0.65rem]",
                  "border-[2.5px] border-[#c4b5fd]",
                  "shadow-[0_0_0_1px_rgba(196,181,253,0.35),0_0_14px_rgba(168,85,247,0.95),0_0_28px_rgba(139,92,246,0.65)]",
                  "will-change-[left,right]",
                )}
                style={{
                  left: `${windowLeft * 100}%`,
                  right: `${windowRight * 100}%`,
                }}
              >
                <span className="absolute top-1/2 left-0 h-3.5 w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
                <span className="absolute top-1/2 right-0 h-3.5 w-[5px] translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
              </div>
            </div>

            <span
              className="pointer-events-none absolute top-1 bottom-2 z-10 w-px -translate-x-1/2 bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)] will-change-[left]"
              style={{ left: `${progress * 100}%` }}
              aria-hidden
            />
          </div>
        </div>

        <div
          className={cn(
            "absolute top-1/2 left-0 z-30 -translate-y-1/2",
            "rounded-[0.85rem] bg-[#0b0e16] px-2.5 py-2 sm:rounded-xl sm:px-3 sm:py-2.5",
            "shadow-[0_0_0_1.5px_rgba(96,165,250,0.7),0_0_22px_rgba(59,130,246,0.55)]",
          )}
        >
          <p className="text-[0.55rem] font-medium tracking-wide text-white/90 sm:text-[0.62rem]">
            Clip Score
          </p>
          <div className="mt-0.5 flex items-end gap-1.5">
            <span className="text-[1.4rem] leading-none font-bold text-white sm:text-[1.65rem]">
              92
            </span>
            <svg
              viewBox="0 0 12 14"
              className="mb-0.5 h-3.5 w-3 text-[#34d399] sm:h-4 sm:w-3.5"
              fill="currentColor"
              aria-hidden
            >
              <path d="M6 0L11.5 8H.5L6 0Z" />
              <rect x="4.2" y="7" width="3.6" height="6.5" rx="0.6" />
            </svg>
          </div>
        </div>

        <div
          className={cn(
            "absolute inset-y-0 right-0 z-20 flex w-[33%] max-w-[11.25rem] flex-col sm:w-[34%] sm:max-w-[12rem]",
            "overflow-hidden rounded-[0.9rem] bg-[#12141d] sm:rounded-[1rem]",
            "border border-[#3a3f4d]",
            "shadow-[-12px_0_32px_-10px_rgba(0,0,0,0.65),0_28px_60px_-16px_rgba(76,29,149,0.45)]",
          )}
        >
          <div className="flex items-center gap-1.5 px-2.5 pt-3 pb-2 sm:px-3 sm:pt-3.5">
            <Sparkles className="h-3.5 w-3.5 text-[#c084fc]" strokeWidth={2} />
            <span className="text-[0.75rem] font-semibold text-white sm:text-[0.8rem]">
              AI Insights
            </span>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-1.5 px-2 pb-1.5 sm:gap-2 sm:px-2.5">
            <InsightRow
              icon={
                <Zap className="h-3.5 w-3.5 text-amber-300" fill="currentColor" />
              }
              title="92/100"
              subtitle={
                <>
                  High engagement
                  <br />
                  potential
                </>
              }
            />
            <InsightRow
              icon={<Smile className="h-3.5 w-3.5 text-amber-300" />}
              title="Key Moment"
              subtitle={
                <>
                  Strong emotional
                  <br />
                  hook
                </>
              }
            />
            <InsightRow
              icon={<BarChart3 className="h-3.5 w-3.5 text-amber-300" />}
              title="Great Hook"
              subtitle={
                <>
                  Keeps viewers
                  <br />
                  watching
                </>
              }
            />
            <InsightRow
              icon={<Users className="h-3.5 w-3.5 text-slate-300" />}
              title="Vertical Ready"
              subtitle={
                <>
                  Optimized for all
                  <br />
                  platforms
                </>
              }
            />
          </div>

          <div className="shrink-0 px-2 pt-0.5 pb-3 sm:px-2.5 sm:pb-3.5">
            <button
              type="button"
              tabIndex={-1}
              className={cn(
                "flex w-full items-center justify-between gap-1 rounded-[0.65rem] px-2 py-2.5",
                "bg-gradient-to-r from-[#8b5cf6] via-[#7c3aed] to-[#4f46e5]",
                "text-[0.68rem] font-semibold text-white sm:text-[0.72rem]",
                "shadow-[0_12px_30px_-8px_rgba(124,58,237,0.85)]",
              )}
            >
              <span className="flex items-center gap-1.5">
                <Upload className="h-3.5 w-3.5" strokeWidth={2.25} />
                Export Clip
              </span>
              <ChevronDown className="h-3.5 w-3.5 opacity-90" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightRow({
  icon,
  title,
  subtitle,
}: {
  icon: ReactNode;
  title: string;
  subtitle: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 items-center gap-2 rounded-[0.55rem] px-2 py-1.5 sm:rounded-[0.65rem] sm:px-2.5 sm:py-2",
        "bg-[#161a24]",
        "border border-[#a78bfa]/45",
        "shadow-[inset_0_0_0_1px_rgba(167,139,250,0.12)]",
      )}
    >
      <span className="shrink-0 self-center">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[0.84rem] leading-tight font-semibold text-white sm:text-[0.9rem]">
          {title}
        </p>
        <p className="mt-0.5 text-[0.64rem] leading-[1.25] text-[#94a3b8] sm:text-[0.68rem]">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function NeonWaveform({ progress }: { progress: number }) {
  const bars = [
    34, 48, 40, 62, 52, 70, 44, 78, 64, 50, 74, 58, 42, 72, 56, 80, 48, 68, 38,
    74, 54, 62, 46, 66, 36, 58, 52, 70, 44, 60, 34, 56, 64, 48, 68, 42, 58, 52,
    66, 40, 55, 47, 63, 49, 71, 45, 59, 53,
  ];

  return (
    <div
      className="relative flex h-7 items-end gap-[1.5px] overflow-hidden rounded-md px-0.5 sm:h-8 sm:gap-[2px]"
      style={{
        filter:
          "drop-shadow(0 0 6px rgba(56,189,248,0.35)) drop-shadow(0 0 10px rgba(168,85,247,0.4))",
      }}
    >
      {bars.map((h, i) => {
        const t = i / (bars.length - 1);
        const top = lerpColor("#38bdf8", "#818cf8", t);
        const mid = lerpColor("#60a5fa", "#a78bfa", t);
        const bot = lerpColor("#7c3aed", "#c026d3", t);
        const nearPlayhead = Math.abs(t - progress) < 0.06;
        const pulse = nearPlayhead ? 1.12 : 1;

        return (
          <span
            key={i}
            className="min-w-0 flex-1 rounded-[1.5px]"
            style={{
              height: `${Math.min(100, h * pulse)}%`,
              opacity: t <= progress ? 1 : 0.45,
              background: `linear-gradient(180deg, ${top} 0%, ${mid} 48%, ${bot} 100%)`,
              boxShadow: `0 0 4px ${mid}88`,
            }}
          />
        );
      })}
    </div>
  );
}

function lerpColor(a: string, b: string, t: number) {
  const pa = hexToRgb(a);
  const pb = hexToRgb(b);
  const r = Math.round(pa.r + (pb.r - pa.r) * t);
  const g = Math.round(pa.g + (pb.g - pa.g) * t);
  const bl = Math.round(pa.b + (pb.b - pa.b) * t);
  return `rgb(${r},${g},${bl})`;
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}
