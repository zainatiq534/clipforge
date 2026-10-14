import { ArrowRight, BarChart3, Bolt, Scissors, Star } from "lucide-react";
import { FeatureShowcase } from "@/components/FeatureShowcase";
import { AppImage } from "@/components/ui/Image";
import { Badge } from "@/components/ui/Badge";
import { GradientButton, OutlineButton } from "@/components/ui/Button";
import { Icon, PlayCircleIcon } from "@/components/ui/Icon";
import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";

const featureItems = [
  {
    icon: Bolt,
    title: "Find hooks instantly",
    description: "AI detects the strongest opening moments in seconds.",
  },
  {
    icon: BarChart3,
    title: "Rank clips by viral score",
    description: "Every moment gets a score so you know what to publish first.",
  },
  {
    icon: Scissors,
    title: "Auto-cut into short clips",
    description: "One long video becomes 5–10 vertical, captioned shorts.",
  },
];

const avatars = [
  "/features/avatar-1.jpg",
  "/features/avatar-2.jpg",
  "/features/avatar-3.jpg",
  "/features/avatar-4.jpg",
];

type FeaturesProps = {
  className?: string;
};

export function Features({ className }: FeaturesProps) {
  return (
    <section
      className={cn(
        "relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 py-12 sm:px-8 sm:py-16 lg:py-20",
        className,
      )}
    >
      <div className="grid w-full items-center gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-10 xl:gap-14">
        <div className="max-w-xl text-left lg:max-w-none">
          <Badge icon={<Icon icon={Bolt} size="sm" strokeWidth={2} />}>
            Powerful Feature
          </Badge>

          <Typography
            as="h1"
            variant="h2"
            tone="white"
            className="mt-5 max-w-xl text-balance text-[2.15rem] sm:text-5xl lg:text-[3.15rem]"
          >
            AI-Powered{" "}
            <span className="relative inline-block">
              <Typography as="span" variant="h2" tone="gradient" className="text-[inherit]">
                Smart Clipping
              </Typography>
              <span
                className="pointer-events-none absolute -bottom-1 left-0 right-0 h-[0.3rem] rounded-full bg-gradient-to-r from-[#b56cff] via-[#9b6bff] to-transparent opacity-90"
                aria-hidden
              />
            </span>
          </Typography>

          <Typography as="p" variant="body" tone="muted" className="mt-5 text-pretty">
            ClipForge analyzes your long-form video, finds the highest-performing moments,
            and turns them into short, scroll-stopping clips — automatically.
          </Typography>
          <Typography as="p" variant="body" tone="muted" className="mt-3 text-pretty">
            Built for creators, podcasters, YouTubers, and agencies who want{" "}
            <Typography as="span" variant="body" tone="white" weight="semibold">
              viral-ready content
            </Typography>{" "}
            without hours of manual editing.
          </Typography>

          <ul className="mt-8 space-y-4">
            {featureItems.map((item) => (
              <li key={item.title} className="flex items-start gap-3.5">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#9b7bff]/35 bg-[#8b5cf6]/20 text-[#c4a1ff] shadow-[0_0_24px_rgba(139,92,246,0.18)] backdrop-blur-sm">
                  <Icon icon={item.icon} size="md" />
                </span>
                <div>
                  <Typography as="p" variant="body" tone="white" weight="bold" className="leading-tight">
                    {item.title}
                  </Typography>
                  <Typography as="p" variant="bodySm" tone="muted" className="mt-0.5">
                    {item.description}
                  </Typography>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
            <GradientButton
              size="lg"
              href="#start"
              rightIcon={<Icon icon={ArrowRight} size="md" />}
              className="w-full sm:w-auto"
            >
              Start Creating Clips
            </GradientButton>
            <OutlineButton
              size="lg"
              href="/#how-it-works"
              leftIcon={<PlayCircleIcon />}
              className="w-full sm:w-auto"
            >
              See How It Works
            </OutlineButton>
          </div>

          <div className="mt-10">
            <Typography as="p" variant="label" tone="muted">
              Used by creators, podcasters & agencies
            </Typography>

            <div className="mt-3 flex flex-wrap items-center gap-4">
              <div className="flex items-center">
                {avatars.map((src, i) => (
                  <span
                    key={src}
                    className={cn(
                      "relative h-10 w-10 overflow-hidden rounded-full border-2 border-[#1a1230] shadow-[0_0_16px_rgba(139,92,246,0.25)]",
                      i > 0 && "-ml-2.5",
                    )}
                  >
                    <AppImage src={src} alt="" fill className="object-cover" sizes="40px" />
                  </span>
                ))}
                <span className="-ml-2.5 inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#1a1230] bg-gradient-to-br from-[#a78bfa] to-[#3b82f6] text-[0.65rem] font-bold text-white shadow-[0_0_16px_rgba(99,102,241,0.4)]">
                  +10K
                </span>
              </div>

              <div>
                <div className="flex items-center gap-0.5 text-[#fbbf24]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon key={i} icon={Star} size="sm" fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <Typography as="p" variant="caption" tone="muted" className="mt-0.5">
                  Trusted by 10,000+ creators worldwide
                </Typography>
              </div>
            </div>
          </div>
        </div>

        <FeatureShowcase />
      </div>
    </section>
  );
}
