import { HowItWorksEditorMockup } from "@/components/how-it-works/HowItWorksEditorMockup";
import { Reveal } from "@/components/ui/Reveal";
import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";

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
          <Reveal immediate delay={0.12}>
            <Typography
              as="h1"
              variant="display"
              tone="ink"
              className="max-w-xl text-balance"
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
        </div>

        {/* Editor mockup — right */}
        <Reveal immediate delay={0.18} from="right" className="w-full">
          <HowItWorksEditorMockup />
        </Reveal>
      </div>
    </section>
  );
}
