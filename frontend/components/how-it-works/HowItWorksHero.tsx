import { ArrowRight, Sparkles } from "lucide-react";
import { HowItWorksEditorMockup } from "@/components/how-it-works/HowItWorksEditorMockup";
import { GradientButton, OutlineInkButton } from "@/components/ui/Button";
import { Icon, PlayCircleIcon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";

/** Light pill + purple play disc — matches the How It Works badge reference. */
function HowItWorksLabel() {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5",
        "border border-[#d4d0e8] bg-[#f3f0ff]",
      )}
    >
      <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#8b5cf6] sm:h-[1.1rem] sm:w-[1.1rem]">
        <svg
          viewBox="0 0 12 12"
          className="ml-px h-2 w-2 fill-white sm:h-2.5 sm:w-2.5"
          aria-hidden
        >
          <path d="M3.2 1.6v8.8l7.2-4.4-7.2-4.4z" />
        </svg>
      </span>
      <span className="font-sans text-xs font-semibold tracking-[0.14em] text-[#5b5278] uppercase">
        How It Works
      </span>
    </span>
  );
}

type HowItWorksHeroProps = {
  className?: string;
};

export function HowItWorksHero({ className }: HowItWorksHeroProps) {
  return (
    <section
      className={cn(
        "relative z-10 mx-auto w-full max-w-7xl px-5 pb-16 pt-6 sm:px-8 sm:pb-20 sm:pt-10 lg:pb-24",
        className,
      )}
    >
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.25fr)] lg:gap-8 xl:gap-12">
        {/* Copy — left */}
        <div className="flex max-w-xl flex-col items-start text-left lg:max-w-none">
          <Reveal immediate delay={0.05}>
            <HowItWorksLabel />
          </Reveal>

          <Reveal immediate delay={0.12}>
            <Typography
              as="h1"
              variant="display"
              tone="ink"
              className="mt-6 max-w-xl text-balance"
            >
              Unlock Viral Potential with AI{" "}
              <span className="relative inline-block">
                <Typography as="span" variant="display" tone="gradient">
                  Viral-Ready Clips
                </Typography>
                <span
                  className="pointer-events-none absolute right-0 -bottom-1 left-0 h-[0.35rem] rounded-full bg-gradient-to-r from-[#b56cff] via-[#9b6bff] to-transparent opacity-90"
                  aria-hidden
                />
              </span>{" "}
              in Minutes
            </Typography>
          </Reveal>

          <Reveal immediate delay={0.2}>
            <Typography
              as="p"
              variant="body"
              tone="mutedInk"
              className="mt-5 max-w-lg text-pretty"
            >
              ClipForge simplifies the process. It takes your long videos,
              identifies key engaging moments, and automatically creates
              high-performing shorts ready for TikTok, Reels, and Shorts.
            </Typography>
          </Reveal>

          <Reveal immediate delay={0.28}>
            <div className="mt-8 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
              <GradientButton
                size="lg"
                href="/#start"
                leftIcon={<Icon icon={Sparkles} size="md" />}
                rightIcon={<Icon icon={ArrowRight} size="md" />}
                className="w-full sm:w-auto"
              >
                Get Started Free
              </GradientButton>
              <OutlineInkButton
                size="lg"
                href="#watch"
                leftIcon={<PlayCircleIcon tone="ink" />}
                className="w-full sm:w-auto"
              >
                Watch How It Works
              </OutlineInkButton>
            </div>
          </Reveal>
        </div>

        {/* Editor mockup — right */}
        <Reveal immediate delay={0.18} from="right" className="w-full">
          <HowItWorksEditorMockup />
        </Reveal>
      </div>
    </section>
  );
}
