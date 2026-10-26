import { ArrowRight, Sparkles } from "lucide-react";
import { HeroVisual } from "@/components/HeroVisual";
import { PlatformPills } from "@/components/PlatformPills";
import { Badge } from "@/components/ui/Badge";
import { GradientButton, OutlineButton } from "@/components/ui/Button";
import { Icon, PlayCircleIcon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
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
      <div className="flex flex-col items-center">
        <Reveal immediate delay={0.05}>
          <Badge icon={<Icon icon={Sparkles} size="sm" strokeWidth={2} />}>
            AI-Powered Video Repurposing
          </Badge>
        </Reveal>

        <Reveal immediate delay={0.12}>
          <Typography
            as="h1"
            variant="display"
            tone="white"
            className="mt-6 max-w-3xl text-balance"
          >
            Turn Long Videos Into{" "}
            <span className="relative inline-block">
              <Typography as="span" variant="display" tone="gradient">
                Viral-Ready Clips
              </Typography>
              <span
                className="pointer-events-none absolute right-0 -bottom-1 left-0 h-[0.35rem] rounded-full bg-gradient-to-r from-[#b56cff] via-[#9b6bff] to-transparent opacity-90"
                aria-hidden
              />
            </span>
          </Typography>
        </Reveal>

        <Reveal immediate delay={0.2}>
          <Typography
            as="p"
            variant="body"
            tone="muted"
            className="mt-5 max-w-2xl text-pretty"
          >
            Upload your long videos and let ClipForge turn them into{" "}
            <Typography as="span" variant="body" tone="white" weight="semibold">
              5–10 engaging, captioned, vertical clips
            </Typography>{" "}
            — ready to post on TikTok, Instagram Reels, and YouTube Shorts.
          </Typography>
        </Reveal>

        <Reveal immediate delay={0.28}>
          <PlatformPills className="mt-7" />
        </Reveal>

        <Reveal immediate delay={0.36}>
          <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row sm:gap-4">
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
        </Reveal>
      </div>
    </section>
  );
}
