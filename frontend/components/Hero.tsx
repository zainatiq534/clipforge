"use client";

import { ArrowRight, Play, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { PlatformPills } from "@/components/PlatformPills";
import { StatsRow } from "@/components/StatsRow";
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/FadeIn";
import { cn } from "@/lib/cn";

type HeroProps = {
  className?: string;
};

export function Hero({ className }: HeroProps) {
  return (
    <section
      className={cn(
        "relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-5 pb-16 pt-6 text-center sm:px-8 sm:pb-20 sm:pt-10",
        className,
      )}
    >
      <Stagger className="flex flex-col items-center" delay={0.15} stagger={0.1}>
        <StaggerItem>
          <Badge icon={<Sparkles className="h-3.5 w-3.5" strokeWidth={2} />}>
            AI-Powered Video Repurposing
          </Badge>
        </StaggerItem>

        <StaggerItem>
          <Typography
            as="h1"
            size="display"
            tone="white"
            className="mt-6 max-w-3xl text-balance"
          >
            Turn Long Videos Into{" "}
            <span className="relative inline-block">
              <Typography as="span" size="display" tone="gradient">
                Viral-Ready Clips
              </Typography>
              <motion.span
                className="pointer-events-none absolute -bottom-1 left-0 right-0 h-[0.35rem] origin-left rounded-full bg-gradient-to-r from-[#b56cff] via-[#9b6bff] to-transparent opacity-90"
                aria-hidden
                initial={{ scaleX: 0.2, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 0.95 }}
                transition={{ delay: 0.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
          </Typography>
        </StaggerItem>

        <StaggerItem>
          <Typography
            as="p"
            size="body"
            tone="muted"
            className="mt-5 max-w-2xl text-pretty"
          >
            Upload your long videos and let ClipForge turn them into{" "}
            <Typography as="span" size="body" tone="white" weight="semibold">
              5–10 engaging, captioned, vertical clips
            </Typography>{" "}
            — ready to post on TikTok, Instagram Reels, and YouTube Shorts.
          </Typography>
        </StaggerItem>

        <StaggerItem>
          <PlatformPills className="mt-7" />
        </StaggerItem>

        <StaggerItem>
          <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
            <Button
              variant="gradient"
              size="lg"
              href="#start"
              leftIcon={<Sparkles className="h-4 w-4" strokeWidth={2.25} />}
              rightIcon={<ArrowRight className="h-4 w-4" strokeWidth={2.25} />}
              className="w-full sm:w-auto"
            >
              Start Creating Clips
            </Button>
            <Button
              variant="outline"
              size="lg"
              href="#demo"
              leftIcon={
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-white/40">
                  <Play className="h-3 w-3 fill-white" strokeWidth={0} />
                </span>
              }
              className="w-full sm:w-auto"
            >
              Watch Demo
            </Button>
          </div>
        </StaggerItem>
      </Stagger>

      <FadeIn delay={0.85} className="mt-14 w-full sm:mt-16">
        <StatsRow />
      </FadeIn>
    </section>
  );
}
