import { ArrowRight, Sparkles } from "lucide-react";
import { PlatformPills } from "@/components/home/PlatformPills";
import { UploadFilesPill } from "@/components/home/UploadFilesPill";
import { Badge } from "@/components/ui/Badge";
import { GradientButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
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
        "relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 pb-14 pt-4 sm:px-8 sm:pb-20 sm:pt-10",
        className,
      )}
    >
      <div className="flex w-full flex-col items-center">
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
            className="mt-5 max-w-3xl text-center text-balance text-[2rem] leading-[1.12] sm:mt-6 sm:text-5xl lg:text-[3.5rem]"
          >
            Turn Long Videos Into{" "}
            <span className="relative inline-block">
              <Typography
                as="span"
                variant="display"
                tone="gradient"
                className="text-[2rem] leading-[1.12] sm:text-5xl lg:text-[3.5rem]"
              >
                Viral-Ready Clips
              </Typography>
              <span
                className="pointer-events-none absolute right-0 -bottom-1 left-0 h-[0.28rem] rounded-full bg-gradient-to-r from-[#b56cff] via-[#9b6bff] to-transparent opacity-90 sm:h-[0.35rem]"
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
            className="mt-4 max-w-2xl px-1 text-center text-pretty text-[0.95rem] sm:mt-5 sm:text-lg"
          >
            Upload your long videos and let ClipForge turn them into{" "}
            <Typography as="span" variant="body" tone="white" weight="semibold">
              5–10 engaging, captioned, vertical clips
            </Typography>{" "}
            — ready to post on TikTok, Instagram Reels, and YouTube Shorts.
          </Typography>
        </Reveal>

        <Reveal immediate delay={0.28}>
          <PlatformPills className="mt-6 sm:mt-7" />
        </Reveal>

        <Reveal immediate delay={0.36}>
          <div className="mt-7 flex w-full max-w-md flex-col items-stretch justify-center gap-3 sm:mt-8 sm:max-w-none sm:w-auto sm:flex-row sm:items-center sm:gap-4">
            <GradientButton
              size="lg"
              href="#start"
              leftIcon={<Icon icon={Sparkles} size="md" />}
              rightIcon={<Icon icon={ArrowRight} size="md" />}
              className="w-full justify-center sm:w-auto"
            >
              Start Creating Clips
            </GradientButton>
            <UploadFilesPill className="w-full sm:w-auto" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
