"use client";

import { motion } from "framer-motion";
import { InstagramIcon, TikTokIcon, YouTubeIcon } from "@/components/icons";
import { cloudinaryHqVideo } from "@/lib/cloudinaryVideo";
import { cn } from "@/lib/cn";

type Clip = {
  caption: string;
  views: string;
  icon: React.ReactNode;
  rotate: number;
  y: number;
  videoSrc: string;
};

const clips: Clip[] = [
  {
    caption: "Don't make this mistake!",
    views: "2.4M views",
    icon: <TikTokIcon className="h-3.5 w-3.5" />,
    rotate: -7,
    y: 8,
    videoSrc: cloudinaryHqVideo(
      "https://res.cloudinary.com/vbwjkfmd/video/upload/v1792498617/Bearded_man_speaking_to_camera_20261020171424.mp4",
      { width: 1080 },
    ),
  },
  {
    caption: "Here's what nobody tells you",
    views: "1.8M views",
    icon: <YouTubeIcon className="h-3.5 w-3.5" />,
    rotate: 0,
    y: -4,
    videoSrc: cloudinaryHqVideo(
      "https://res.cloudinary.com/vbwjkfmd/video/upload/v1792498610/Man_speaking_to_camera_20261020171432.mp4",
      { width: 1080 },
    ),
  },
  {
    caption: "This changed everything",
    views: "3.1M views",
    icon: <InstagramIcon className="h-3.5 w-3.5" />,
    rotate: 7,
    y: 12,
    videoSrc: cloudinaryHqVideo(
      "https://res.cloudinary.com/vbwjkfmd/video/upload/v1792498594/Bearded_man_talking_in_video_20261020171439.mp4",
      { width: 1080 },
    ),
  },
];

type FloatingClipCardsProps = {
  className?: string;
};

/** Three tilted social clip phones — HQ Cloudinary videos, autoplay. */
export function FloatingClipCards({ className }: FloatingClipCardsProps) {
  return (
    <div
      className={cn(
        "relative z-20 -mt-8 flex items-end justify-center gap-3.5 px-2 sm:-mt-10 sm:gap-5 lg:justify-end lg:pr-4",
        className,
      )}
    >
      {clips.map((clip, index) => (
        <motion.div
          key={clip.caption}
          className={cn(
            "relative w-[104px] shrink-0 overflow-hidden rounded-[18px] border-2 border-[#c4b5fd]/80 sm:w-[128px]",
            "aspect-[9/16] shadow-[0_0_22px_rgba(139,92,246,0.4),0_18px_48px_rgba(5,8,20,0.55)]",
          )}
          style={{ rotate: clip.rotate }}
          initial={{ opacity: 0, y: 80 + clip.y }}
          whileInView={{ opacity: 1, y: clip.y }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            type: "spring",
            stiffness: 120,
            damping: 18,
            delay: 0.1 + index * 0.12,
          }}
        >
          <video
            className="absolute inset-0 h-full w-full object-cover object-[50%_18%] [transform:translateZ(0)]"
            src={clip.videoSrc}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-label={clip.caption}
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050814]/88 via-[#050814]/18 to-transparent" />
          <span className="absolute right-1.5 top-1.5 z-10 inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-[#0d1020]/75 backdrop-blur-sm">
            {clip.icon}
          </span>
          <div className="absolute inset-x-0 bottom-0 z-10 p-2.5">
            <p className="text-[10px] font-bold leading-tight text-white sm:text-[11px]">
              {clip.caption}
            </p>
            <p className="mt-1 text-[9px] font-medium text-white/75">{clip.views}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
