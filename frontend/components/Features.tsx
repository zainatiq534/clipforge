import { Sparkles } from "lucide-react";
import { FeaturesProductMockup } from "@/components/FeaturesProductMockup";
import { Badge } from "@/components/ui/Badge";
import { AppImage } from "@/components/ui/Image";
import { Icon } from "@/components/ui/Icon";
import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";

const features = [
  {
    title: "AI Highlight Detection",
    description:
      "Automatically finds the most engaging moments in your videos using AI.",
    iconSrc: "/feature-icon-sparkles.png",
  },
  {
    title: "Auto Captions",
    description:
      "Accurate, stylish captions generated in seconds with multi-language support.",
    iconSrc: "/feature-icon-file.png",
  },
  {
    title: "Vertical Reframing",
    description:
      "Reframes your content automatically for TikTok, YouTube Shorts, and Instagram Reels.",
    iconSrc: "/feature-icon-scan.png",
  },
  {
    title: "Clip Scores & Reasons",
    description:
      "Get AI-powered engagement scores with clear reasons for each clip recommendation.",
    iconSrc: "/feature-icon-chart.png",
  },
  {
    title: "Suggested Titles",
    description:
      "Receive catchy, platform-optimized titles and hooks that drive more views.",
    iconSrc: "/feature-icon-bulb.png",
  },
  {
    title: "Multiple Export Options",
    description:
      "Export in different formats and aspect ratios, ready for all major platforms.",
    iconSrc: "/feature-icon-upload.png",
  },
] as const;

type FeaturesProps = {
  className?: string;
};

export function Features({ className }: FeaturesProps) {
  return (
    <section
      id="features"
      className={cn(
        "relative overflow-visible px-5 py-16 sm:px-8 sm:py-20 lg:py-24",
        className,
      )}
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <Badge
            icon={<Icon icon={Sparkles} size="sm" className="text-[#7c3aed]" />}
            className="border-[#ddd6fe] bg-[#f3e8ff]/90 shadow-none backdrop-blur-sm"
          >
            <Typography as="span" variant="label" tone="brand">
              Features
            </Typography>
          </Badge>

          <h2
            className={cn(
              "mt-6 max-w-4xl text-center font-display font-bold tracking-[-0.03em]",
              "text-[2.15rem] leading-[1.15] sm:text-[2.85rem] md:text-[3.35rem] lg:text-[3.75rem]",
            )}
          >
            <span className="block" style={{ color: "#111827" }}>
              Everything You Need to
            </span>
            <span className="mt-0.5 block sm:mt-1">
              <span style={{ color: "#111827" }}>Create </span>
              <span className="bg-gradient-to-r from-[#8b5cf6] via-[#a855f7] to-[#6366f1] bg-clip-text text-transparent">
                High-Performing Clips
              </span>
            </span>
          </h2>

          <Typography
            as="p"
            variant="body"
            tone="mutedInk"
            className="mt-4 max-w-2xl text-pretty"
          >
            Powerful AI tools to turn your long videos into viral-ready content,
            faster than ever.
          </Typography>
        </div>

        <div className="mt-12 grid grid-cols-1 items-center gap-8 lg:mt-14 lg:grid-cols-[1.05fr_1.2fr] lg:gap-5 xl:gap-7">
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-3 md:gap-3.5">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>

          <div className="overflow-visible py-2 lg:py-4">
            <FeaturesProductMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

type FeatureCardProps = {
  title: string;
  description: string;
  iconSrc: string;
};

function FeatureCard({ title, description, iconSrc }: FeatureCardProps) {
  return (
    <article
      className={cn(
        "group rounded-2xl border border-[#e9e4f5] bg-white p-4",
        "shadow-[0_10px_28px_-18px_rgba(124,58,237,0.2)]",
        "transition-[transform,box-shadow] duration-300 ease-out",
        "hover:-translate-y-1 hover:shadow-[0_22px_40px_-16px_rgba(124,58,237,0.32)]",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
      )}
    >
      <div
        className={cn(
          "relative mb-3 h-11 w-11 overflow-hidden rounded-[0.85rem]",
          "ring-1 ring-[#ddd6fe]/80",
          "shadow-[0_6px_16px_-10px_rgba(124,58,237,0.35)]",
          "transition-transform duration-300 group-hover:scale-105",
          "motion-reduce:transition-none motion-reduce:group-hover:scale-100",
        )}
      >
        <AppImage
          src={iconSrc}
          alt=""
          fill
          quality={100}
          sizes="44px"
          className="object-cover object-center"
        />
      </div>
      <Typography
        as="h3"
        variant="h3"
        tone="ink"
        className="text-[0.95rem] leading-snug sm:text-base"
      >
        {title}
      </Typography>
      <Typography
        as="p"
        variant="bodySm"
        tone="mutedInk"
        className="mt-1.5 text-[0.8rem] leading-relaxed sm:text-[0.85rem]"
      >
        {description}
      </Typography>
    </article>
  );
}
