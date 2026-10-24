"use client";

import { useEffect, useRef } from "react";

type LoginSideVideoProps = {
  src: string;
};

export function LoginSideVideo({ src }: LoginSideVideoProps) {
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
      className="absolute inset-0 h-full w-full object-cover object-[50%_28%]"
      src={src}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      controls={false}
      aria-hidden
    />
  );
}
