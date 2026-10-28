"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  LOGIN_VIDEO_BOTTOM,
  LOGIN_VIDEO_TOP,
  LoginClipCard,
} from "@/components/auth/LoginClipVideos";
import { cn } from "@/lib/cn";

/**
 * Fully outside the text border — offsets ≈ video size so they never collapse in.
 */
const clips = [
  {
    key: "tl",
    src: LOGIN_VIDEO_TOP,
    label: "Clip preview 1",
    rotate: "-rotate-[8deg]",
    badgeStart: 0,
    place: "absolute -top-[5.75rem] -left-[5.75rem] z-20 sm:-top-[6.5rem] sm:-left-[6.5rem]",
    origin: "origin-bottom-right",
    from: { x: 90, y: 100, rotate: 22 },
    delay: 0.06,
  },
  {
    key: "tr",
    src: LOGIN_VIDEO_BOTTOM,
    label: "Clip preview 2",
    rotate: "rotate-[7deg]",
    badgeStart: 1,
    place: "absolute -top-[5.75rem] -right-[5.75rem] z-20 sm:-top-[6.5rem] sm:-right-[6.5rem]",
    origin: "origin-bottom-left",
    from: { x: -90, y: 100, rotate: -20 },
    delay: 0.14,
  },
  {
    key: "bl",
    src: LOGIN_VIDEO_BOTTOM,
    label: "Clip preview 3",
    rotate: "rotate-[5deg]",
    badgeStart: 2,
    place: "absolute -bottom-[5.75rem] -left-[5.75rem] z-20 sm:-bottom-[6.5rem] sm:-left-[6.5rem]",
    origin: "origin-top-right",
    from: { x: 90, y: -100, rotate: -18 },
    delay: 0.22,
  },
  {
    key: "br",
    src: LOGIN_VIDEO_TOP,
    label: "Clip preview 4",
    rotate: "-rotate-[6deg]",
    badgeStart: 0,
    place: "absolute -right-[5.75rem] -bottom-[5.75rem] z-20 sm:-right-[6.5rem] sm:-bottom-[6.5rem]",
    origin: "origin-top-left",
    from: { x: -90, y: -100, rotate: 20 },
    delay: 0.3,
  },
] as const;

/** Login: pull top two clips nearer the headline */
const topCloserPlace: Record<"tl" | "tr", string> = {
  tl: "absolute -top-[3.25rem] -left-[4.25rem] z-20 sm:-top-[3.75rem] sm:-left-[5rem]",
  tr: "absolute -top-[3.25rem] -right-[4.25rem] z-20 sm:-top-[3.75rem] sm:-right-[5rem]",
};

type SignupScatterVideosProps = {
  /** Bring the top-left & top-right videos closer to the text */
  topCloser?: boolean;
};

/** 4 clips sit in open space outside the text border corners. */
export function SignupScatterVideos({ topCloser = false }: SignupScatterVideosProps) {
  const reduce = useReducedMotion();

  return (
    <>
      {clips.map((clip) => (
        <motion.div
          key={clip.key}
          className={cn(
            topCloser && (clip.key === "tl" || clip.key === "tr")
              ? topCloserPlace[clip.key]
              : clip.place,
          )}
          initial={
            reduce
              ? false
              : {
                  opacity: 0,
                  x: clip.from.x,
                  y: clip.from.y,
                  rotate: clip.from.rotate,
                  scale: 0.45,
                }
          }
          animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
          transition={
            reduce
              ? { duration: 0 }
              : {
                  type: "spring",
                  stiffness: 160,
                  damping: 14,
                  mass: 0.85,
                  delay: clip.delay,
                }
          }
        >
          <motion.div
            className="will-change-transform"
            animate={
              reduce
                ? undefined
                : {
                    y: [0, -3, 0, 2, 0],
                    x: [0, 1.5, 0, -1.5, 0],
                  }
            }
            transition={
              reduce
                ? undefined
                : {
                    duration: 5.5 + clip.delay * 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.15 + clip.delay,
                  }
            }
          >
            <LoginClipCard
              src={clip.src}
              label={clip.label}
              rotate={clip.rotate}
              badgeStart={clip.badgeStart}
              className={cn("w-[72px] sm:w-[82px]", clip.origin)}
            />
          </motion.div>
        </motion.div>
      ))}
    </>
  );
}
