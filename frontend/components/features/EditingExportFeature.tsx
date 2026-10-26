"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useRef, type RefObject } from "react";
import {
  InstagramIcon,
  PlayBadgeIcon,
  ScissorsBadgeIcon,
  TikTokIcon,
  TypeBadgeIcon,
  UploadBadgeIcon,
  YouTubeIcon,
} from "@/components/icons";
import { GradientButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

const PUBLISH_STRIP_VIDEO =
  "https://res.cloudinary.com/vbwjkfmd/video/upload/v1792583481/Man_speaking_into_microphone_20261021164533.mp4";

const EDITOR_PREVIEW_VIDEO =
  "https://res.cloudinary.com/vbwjkfmd/video/upload/v1792751323/Man_speaking_into_microphone_20261023152159.mp4";

function useMutedAutoplay(ref: RefObject<HTMLVideoElement | null>) {
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
  }, [ref]);
}

function EditorPreviewVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  useMutedAutoplay(ref);

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-[108%] w-[108%] max-w-none -translate-x-[4%] -translate-y-[4%] object-cover object-[50%_16%]"
      src={EDITOR_PREVIEW_VIDEO}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      controls={false}
      aria-label="Editor clip preview"
    />
  );
}

function PublishPhoneVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  useMutedAutoplay(ref);

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover object-[50%_14%]"
      src={PUBLISH_STRIP_VIDEO}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      controls={false}
      aria-label="Ready to publish clip preview"
    />
  );
}

const publishPlatformIcons = [
  {
    label: "YouTube Shorts",
    src: "/features/publish-icon-youtube.svg",
  },
  {
    label: "TikTok",
    src: "/features/publish-icon-tiktok.svg",
  },
  {
    label: "Instagram Reels",
    src: "/features/publish-icon-instagram.svg",
  },
  {
    label: "LinkedIn",
    src: "/features/publish-icon-linkedin.svg",
  },
] as const;

const featureItems: {
  badge: "scissors" | "type" | "play" | "upload";
  title: string;
  description: string;
}[] = [
  {
    badge: "scissors",
    title: "Trim with precision",
    description: "Cut and refine clips down to the exact second.",
  },
  {
    badge: "type",
    title: "Edit captions",
    description: "Adjust wording, timing, and style in one place.",
  },
  {
    badge: "play",
    title: "Preview instantly",
    description: "See changes live before you export.",
  },
  {
    badge: "upload",
    title: "Export in one click",
    description: "Download platform-ready files without rework.",
  },
];

const badgeIcons = {
  scissors: ScissorsBadgeIcon,
  type: TypeBadgeIcon,
  play: PlayBadgeIcon,
  upload: UploadBadgeIcon,
} as const;

type EditingExportFeatureProps = {
  className?: string;
};

/** Exact reference picture — editor + Export Your Clip (same-to-same). */
function EditorExportCompose() {
  return (
    <div className="relative w-full min-w-0 overflow-visible bg-transparent">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/features/editor-export-paste.png?v=hq-tool1"
        alt="ClipForge editor and export — captions, timeline, and platform export"
        width={4608}
        height={3456}
        className="h-auto w-full max-w-full object-contain"
        decoding="async"
        draggable={false}
      />
      {/* Video covers preview + control strip so no static picture/white gap shows */}
      <div
        className="pointer-events-none absolute top-[17.2%] left-[14%] z-[1] h-[48.5%] w-[34%] overflow-hidden rounded-[8px] sm:rounded-[10px] lg:rounded-[12px]"
        aria-hidden
      >
        <EditorPreviewVideo />
      </div>
    </div>
  );
}

/** Ready-to-publish strip — phone pictures replaced with muted autoplay video. */
function PublishStrip() {
  return (
    <div
      className="relative mt-8 w-full min-w-0 overflow-visible bg-transparent sm:mt-10"
      aria-label="Ready to publish in minutes — clips for YouTube, TikTok, Instagram, LinkedIn and more"
    >
      <div className="relative overflow-hidden rounded-[22px] border border-[#ebe6f8] bg-white px-4 py-5 shadow-[0_10px_40px_rgba(76,29,149,0.08),0_2px_10px_rgba(15,23,42,0.04)] sm:rounded-[26px] sm:px-6 sm:py-6 lg:px-8 lg:py-7">
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:gap-5 xl:gap-8">
          {/* Left — 3 phones with video */}
          <div className="relative flex w-full max-w-[280px] shrink-0 items-end justify-center sm:max-w-[300px] lg:w-[270px] xl:w-[300px]">
            <div className="relative h-[168px] w-[220px] sm:h-[184px] sm:w-[240px]">
              <div className="absolute top-3 right-0 z-[1] w-[78px] rotate-[7deg] overflow-hidden rounded-[14px] border-[2.5px] border-white shadow-[0_8px_22px_rgba(15,23,42,0.18)] sm:w-[88px]">
                <div className="relative aspect-[9/16] bg-[#1e1b4b]">
                  <PublishPhoneVideo />
                  <span className="absolute top-1.5 right-1.5 z-[1] flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm">
                    <InstagramIcon className="h-3 w-3" />
                  </span>
                </div>
              </div>

              <div className="absolute top-1.5 left-[52px] z-[2] w-[86px] rotate-[3deg] overflow-hidden rounded-[14px] border-[2.5px] border-white shadow-[0_10px_24px_rgba(15,23,42,0.2)] sm:left-[58px] sm:w-[96px]">
                <div className="relative aspect-[9/16] bg-[#1e1b4b]">
                  <PublishPhoneVideo />
                  <span className="absolute top-1.5 right-1.5 z-[1] flex h-5 w-5 items-center justify-center rounded-full bg-[#0f0f12] shadow-sm">
                    <TikTokIcon className="h-3 w-3" />
                  </span>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 z-[3] w-[100px] overflow-hidden rounded-[15px] border-[2.5px] border-white shadow-[0_14px_30px_rgba(15,23,42,0.28)] sm:w-[112px]">
                <div className="relative aspect-[9/16] bg-[#1e1b4b]">
                  <PublishPhoneVideo />
                  <span className="absolute top-1.5 right-1.5 z-[1] flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm">
                    <YouTubeIcon className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </div>

            <svg
              className="pointer-events-none absolute top-[42%] -right-1 hidden h-10 w-12 text-[#7c3aed] sm:block lg:-right-3"
              viewBox="0 0 48 40"
              fill="none"
              aria-hidden
            >
              <path
                d="M4 28C14 10 28 6 40 12"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
              />
              <path
                d="M34 6l7 7-9 2"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Center copy */}
          <div className="min-w-0 flex-1 text-center lg:px-2 lg:text-left">
            <h3 className="font-sans text-[1.35rem] leading-[1.15] font-extrabold tracking-[-0.02em] text-[#0a0a1a] sm:text-[1.55rem] lg:text-[1.7rem] xl:text-[1.85rem]">
              Ready to publish{" "}
              <span className="text-[#7c3aed]">in minutes.</span>
            </h3>
            <p className="mx-auto mt-2 max-w-[28rem] font-sans text-[0.8125rem] leading-snug text-[#6b7280] sm:text-[0.875rem] lg:mx-0 lg:text-[0.9375rem]">
              Edit, perfect, and export your clips for every platform — all in one
              place with ClipForge.
            </p>
          </div>

          {/* Right — platforms */}
          <div className="flex w-full shrink-0 justify-center gap-3 sm:gap-4 lg:w-auto lg:justify-end lg:gap-3.5 xl:gap-4">
            {publishPlatformIcons.map((p) => (
              <div
                key={p.label}
                className="flex w-[3.6rem] flex-col items-center gap-1.5 sm:w-[4.1rem]"
              >
                <span className="relative h-10 w-10 overflow-hidden rounded-[12px] shadow-[0_6px_14px_rgba(15,23,42,0.16)] sm:h-11 sm:w-11 sm:rounded-[13px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.src}
                    alt=""
                    width={44}
                    height={44}
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </span>
                <span className="text-center font-sans text-[8px] leading-tight font-semibold text-[#6b7280] sm:text-[9px]">
                  {p.label}
                </span>
              </div>
            ))}
            <div className="flex w-[3.6rem] flex-col items-center gap-1.5 sm:w-[4.1rem]">
              <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#e8e8ec] shadow-[0_6px_14px_rgba(15,23,42,0.08)] sm:h-11 sm:w-11 sm:rounded-[13px]">
                <span className="flex gap-[3px]">
                  <span className="h-[3px] w-[3px] rounded-full bg-[#52525b]" />
                  <span className="h-[3px] w-[3px] rounded-full bg-[#52525b]" />
                  <span className="h-[3px] w-[3px] rounded-full bg-[#52525b]" />
                </span>
              </span>
              <span className="text-center font-sans text-[8px] leading-tight font-semibold text-[#6b7280] sm:text-[9px]">
                More Platforms
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EditingExportFeature({ className }: EditingExportFeatureProps) {
  return (
    <section
      id="editing-export"
      className={cn("relative isolate w-full overflow-hidden", className)}
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-12 lg:py-14">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.35fr)] lg:gap-8 xl:gap-10">
          {/* Left copy */}
          <div className="max-w-[26rem]">
            <h2 className="font-sans text-[1.9rem] leading-[1.08] font-extrabold tracking-[-0.03em] text-[#0a0a1a] sm:text-[2.25rem] lg:text-[2.5rem]">
              Easy Editing
              <br />
              <span className="bg-gradient-to-r from-[#a855f7] via-[#8b5cf6] to-[#6366f1] bg-clip-text text-transparent">
                &amp; Export
              </span>
            </h2>

            <p className="mt-4 font-sans text-[0.9375rem] leading-[1.65] text-[#4b5563] sm:text-base">
              Fine-tune every clip in a simple editor — trim, captions, preview — then export
              ready-to-post files for every platform.
            </p>
            <p className="mt-3 font-sans text-[0.9375rem] leading-[1.65] text-[#4b5563] sm:text-base">
              No complicated timelines. Just the controls creators actually use, with
              one-click exports that keep quality high.
            </p>

            <ul className="mt-7 space-y-4">
              {featureItems.map((item) => {
                const BadgeIcon = badgeIcons[item.badge];
                return (
                  <li key={item.title} className="flex items-start gap-3.5">
                    <BadgeIcon className="h-11 w-11" />
                    <div className="pt-0.5">
                      <p className="font-sans text-[0.95rem] font-bold text-[#0a0a1a] sm:text-base">
                        {item.title}
                      </p>
                      <p className="mt-0.5 font-sans text-[0.8125rem] leading-snug text-[#6b7280] sm:text-sm">
                        {item.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8">
              <GradientButton
                size="lg"
                href="#start"
                rightIcon={<Icon icon={ArrowRight} size="md" />}
                className="min-w-[15rem]"
              >
                Start Creating Clips
              </GradientButton>
            </div>
          </div>

          {/* Right visuals — exact reference picture */}
          <div className="relative min-w-0">
            <EditorExportCompose />
          </div>
        </div>

        <PublishStrip />
      </div>
    </section>
  );
}
