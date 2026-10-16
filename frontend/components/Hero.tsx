import { ArrowRight, Sparkles } from "lucide-react";
import { HeroVisual } from "@/components/HeroVisual";
import { PlatformPills } from "@/components/PlatformPills";
import { StatsRow } from "@/components/StatsRow";
import { Badge } from "@/components/ui/Badge";
import { GradientButton, OutlineButton } from "@/components/ui/Button";
import { Icon, PlayCircleIcon } from "@/components/ui/Icon";
import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";

type HeroProps = {
  className?: string;
};

export function Hero({ className }: HeroProps) {
  return (
    <section
      className={cn(
        "relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 pb-16 pt-6 sm:px-8 sm:pb-20 sm:pt-10",
        className,
      )}
    >
      <div className="grid w-full items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-10 xl:gap-14">
        {/* Left — copy */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <Badge icon={<Icon icon={Sparkles} size="sm" strokeWidth={2} />}>
            AI-Powered Video Repurposing
          </Badge>

          <Typography
            as="h1"
            variant="display"
            tone="white"
            className="mt-6 max-w-xl text-balance"
          >
            Turn Long Videos Into{" "}
            <span className="relative inline-block">
              <Typography as="span" variant="display" tone="gradient">
                Viral-Ready Clips
              </Typography>
              <span
                className="pointer-events-none absolute -bottom-1 left-0 right-0 h-[0.35rem] rounded-full bg-gradient-to-r from-[#b56cff] via-[#9b6bff] to-transparent opacity-90"
                aria-hidden
              />
            </span>
          </Typography>

          <Typography
            as="p"
            variant="body"
            tone="muted"
            className="mt-5 max-w-lg text-pretty"
          >
            Upload your long videos and let ClipForge turn them into{" "}
            <Typography as="span" variant="body" tone="white" weight="semibold">
              5–10 engaging, captioned, vertical clips
            </Typography>{" "}
            — ready to post on TikTok, Instagram Reels, and YouTube Shorts.
          </Typography>

          <PlatformPills className="mt-7 lg:justify-start" />

          <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4 lg:justify-start">
            <GradientButton
              size="lg"
              href="#start"
              leftIcon={<Icon icon={Sparkles} size="md" />}
              rightIcon={<Icon icon={ArrowRight} size="md" />}
              className="w-full sm:w-auto"
            >
              Start Creating Clips
            </GradientButton>
            <OutlineButton
              size="lg"
              href="#demo"
              leftIcon={<PlayCircleIcon />}
              className="w-full sm:w-auto"
            >
              Watch Demo
            </OutlineButton>
          </div>

          <StatsRow className="mt-12 w-full sm:mt-14 lg:mx-0 lg:items-start lg:justify-start" />
        </div>

        {/* Right — visual */}
        <HeroVisual />
      </div>
    </section>
  );
}
