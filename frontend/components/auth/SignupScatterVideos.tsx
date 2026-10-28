"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  LOGIN_VIDEO_BOTTOM,
  LOGIN_VIDEO_TOP,
  LoginClipCard,
} from "@/components/auth/LoginClipVideos";
import { cn } from "@/lib/cn";

const clips = [
  {
    key: "tl",
    src: LOGIN_VIDEO_TOP,
    label: "Clip preview 1",
    rotate: "-rotate-[8deg]",
    badgeStart: 0,
    place: "absolute -top-[3.5rem] -left-[3.25rem] z-20 md:-top-[6.5rem] md:-left-[6.5rem]",
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
    place: "absolute -top-[3.5rem] -right-[3.25rem] z-20 md:-top-[6.5rem] md:-right-[6.5rem]",
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
    place: "absolute -bottom-[3.5rem] -left-[3.25rem] z-20 md:-bottom-[6.5rem] md:-left-[6.5rem]",
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
    place: "absolute -right-[3.25rem] -bottom-[3.5rem] z-20 md:-right-[6.5rem] md:-bottom-[6.5rem]",
    origin: "origin-top-left",
    from: { x: -90, y: -100, rotate: 20 },
    delay: 0.3,
  },
] as const;

const topCloserPlace: Record<"tl" | "tr", string> = {
  tl: "absolute -top-[2.25rem] -left-[2.75rem] z-20 md:-top-[3.75rem] md:-left-[5rem]",
  tr: "absolute -top-[2.25rem] -right-[2.75rem] z-20 md:-top-[3.75rem] md:-right-[5rem]",
};

type SignupScatterVideosProps = {
  topCloser?: boolean;
};

/** 4 corner clips — hidden on small phones, shown from sm+ */
export function SignupScatterVideos({ topCloser = false }: SignupScatterVideosProps) {
  const reduce = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 hidden sm:block" aria-hidden>
      {clips.map((clip) => (
        <motion.div
          key={clip.key}
          className={cn(
            "pointer-events-auto",
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
              className={cn("w-[64px] md:w-[72px] lg:w-[82px]", clip.origin)}
            />
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
