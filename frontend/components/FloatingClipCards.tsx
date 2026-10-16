"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { InstagramIcon, TikTokIcon, YouTubeIcon } from "@/components/icons";
import { AppImage } from "@/components/ui/Image";
import { cn } from "@/lib/cn";

type Clip = {
  caption: string;
  views: string;
  icon: React.ReactNode;
  rotate: number;
  y: number;
  perrySrc: string;
};

const clips: Clip[] = [
  {
    caption: "Don't make this mistake!",
    views: "2.4M views",
    icon: <TikTokIcon className="h-3.5 w-3.5" />,
    rotate: -7,
    y: 8,
    perrySrc: "/features/perry-0.png",
  },
  {
    caption: "Here's what nobody tells you",
    views: "1.8M views",
    icon: <YouTubeIcon className="h-3.5 w-3.5" />,
    rotate: 0,
    y: -4,
    perrySrc: "/features/perry-1.png",
  },
  {
    caption: "This changed everything",
    views: "3.1M views",
    icon: <InstagramIcon className="h-3.5 w-3.5" />,
    rotate: 7,
    y: 12,
    perrySrc: "/features/perry-2.png",
  },
];

type FloatingClipCardsProps = {
  className?: string;
};

/** 0 = perry cards from reference, 1 = alternate speaker frames */
export function FloatingClipCards({ className }: FloatingClipCardsProps) {
  const [setIndex, setSetIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSetIndex((v) => (v + 1) % 2);
    }, 3400);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className={cn(
        "relative z-20 -mt-8 flex items-end justify-center gap-3 px-2 sm:-mt-10 sm:gap-4 lg:justify-end lg:pr-4",
        className,
      )}
    >
      {clips.map((clip, index) => (
        <motion.div
          key={clip.caption}
          className={cn(
            "relative w-[92px] shrink-0 overflow-hidden rounded-[18px] border-2 border-[#c4b5fd]/80 sm:w-[112px]",
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
          <div className="absolute inset-0 overflow-hidden">
            <AnimatePresence initial={false} mode="sync">
              <motion.div
                key={setIndex === 0 ? clip.perrySrc : `alt-${clip.caption}`}
                className="absolute inset-0"
                initial={{ y: "-105%" }}
                animate={{ y: "0%" }}
                exit={{ y: "105%" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {setIndex === 0 ? (
                  <AppImage
                    src={clip.perrySrc}
                    alt=""
                    fill
                    sizes="112px"
                    className="object-cover object-center"
                  />
                ) : (
                  <>
                    <AppImage
                      src="/features/speaker.jpg"
                      alt=""
                      fill
                      sizes="112px"
                      className="object-cover object-[50%_18%]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050814]/92 via-[#050814]/20 to-transparent" />
                    <span className="absolute right-1.5 top-1.5 z-10 inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-[#0d1020]/75 backdrop-blur-sm">
                      {clip.icon}
                    </span>
                    <div className="absolute inset-x-0 bottom-0 z-10 p-2.5">
                      <p className="text-[10px] font-bold leading-tight text-white sm:text-[11px]">
                        {clip.caption}
                      </p>
                      <p className="mt-1 text-[9px] font-medium text-white/75">
                        {clip.views}
                      </p>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
