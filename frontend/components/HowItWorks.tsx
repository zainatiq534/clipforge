import { Zap } from "lucide-react";
import {
  InstagramIcon,
  TikTokIcon,
  YouTubeIcon,
} from "@/components/icons";
import { Badge } from "@/components/ui/Badge";
import { AppImage } from "@/components/ui/Image";
import { Icon } from "@/components/ui/Icon";
import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";

const steps = [
  {
    number: 1,
    title: "Upload Video",
    description: "Paste a YouTube link or upload your video in seconds.",
    icon: "/step-upload.png",
  },
  {
    number: 2,
    title: "AI Analyzes",
    description:
      "Our AI finds the most engaging moments, adds captions, and optimizes for each platform.",
    icon: "/step-analyze.png",
  },
  {
    number: 3,
    title: "Review & Edit",
    description: "Preview clips, make quick edits, and choose your favorites.",
    icon: "/step-review.png",
  },
  {
    number: 4,
    title: "Export & Share",
    description:
      "Export high-quality clips and share directly to TikTok, YouTube, Instagram and more.",
    icon: "/step-share.png",
    showSocials: true,
  },
];

type HowItWorksProps = {
  className?: string;
};

export function HowItWorks({ className }: HowItWorksProps) {
  return (
    <section
      id="how-it-works"
      className={cn(
        "relative isolate overflow-hidden px-5 py-16 sm:px-8 sm:py-20 lg:py-24",
        className,
      )}
      style={{
        background:
          "linear-gradient(180deg, #faf9fc 0%, #f7f4fb 42%, #faf8fc 100%)",
      }}
    >
      <LightSectionBackdrop />

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <DotGrid className="absolute top-1/2 -left-16 hidden -translate-y-1/2 sm:block lg:-left-24" />
            <DotGrid className="absolute top-1/2 -right-16 hidden -translate-y-1/2 sm:block lg:-right-24" />

            <Badge
              icon={<Icon icon={Zap} size="sm" className="text-[#7c3aed]" />}
              className="border-[#ddd6fe] bg-[#f3e8ff]/90 shadow-none backdrop-blur-sm"
            >
              <Typography as="span" variant="label" tone="brand">
                How It Works
              </Typography>
            </Badge>
          </div>

          <h2
            className={cn(
              "mt-6 max-w-4xl text-center font-display font-bold tracking-[-0.03em]",
              "text-[2.15rem] leading-[1.15] sm:text-[2.85rem] md:text-[3.35rem] lg:text-[3.75rem]",
            )}
          >
            <span className="block" style={{ color: "#111827" }}>
              From Long Video to
            </span>
            <span className="mt-0.5 block sm:mt-1">
              <span style={{ color: "#111827" }}>Viral Clips in </span>
              <span
                className="bg-gradient-to-r from-[#8b5cf6] via-[#a855f7] to-[#6366f1] bg-clip-text text-transparent"
              >
                4 Simple Steps
              </span>
            </span>
          </h2>

          <p
            className="mt-5 max-w-2xl text-center font-sans text-base leading-relaxed sm:mt-6 sm:text-lg"
            style={{ color: "#6b7280" }}
          >
            <span className="block">
              Turn hours of content into scroll-stopping clips in minutes.
            </span>
            <span className="block">No editing skills needed.</span>
          </p>
        </div>

        <div className="relative mt-12 lg:mt-16">
          <div className="grid grid-cols-1 items-stretch gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {steps.map((step, index) => (
              <div key={step.number} className="relative min-w-0 w-full">
                <StepCard {...step} />
                {index < steps.length - 1 ? (
                  <FlowArrow className="pointer-events-none absolute top-[36%] -right-3 z-20 hidden lg:block xl:-right-3.5" />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

type StepCardProps = {
  number: number;
  title: string;
  description: string;
  icon: string;
  showSocials?: boolean;
};

function StepCard({
  number,
  title,
  description,
  icon,
  showSocials = false,
}: StepCardProps) {
  return (
    <article
      className={cn(
        "group relative flex h-full min-h-[17.5rem] w-full flex-col rounded-[1.5rem] bg-white px-4 pt-8 pb-6 sm:px-5",
        "shadow-[0_18px_40px_-18px_rgba(124,58,237,0.22)]",
        "transition-[transform,box-shadow] duration-300 ease-out",
        "hover:-translate-y-1.5 hover:shadow-[0_28px_55px_-16px_rgba(124,58,237,0.38)]",
        "motion-reduce:transition-none motion-reduce:hover:translate-y-0",
      )}
    >
      <span
        className={cn(
          "absolute -top-3.5 left-5 flex h-8 w-8 items-center justify-center",
          "rounded-full bg-[#7c3aed] text-sm font-bold text-white",
          "shadow-[0_8px_18px_-6px_rgba(124,58,237,0.65)]",
        )}
      >
        {number}
      </span>

      <div
        className={cn(
          "relative mb-5 h-[6.5rem] w-[6.5rem] shrink-0 overflow-hidden rounded-[1.25rem]",
          "bg-[#e6ebfc]",
          "transition-transform duration-300 ease-out",
          "group-hover:scale-[1.05]",
          "motion-reduce:transition-none motion-reduce:group-hover:scale-100",
        )}
      >
        <AppImage
          src={icon}
          alt=""
          width={320}
          height={320}
          quality={100}
          sizes="140px"
          className="block h-full w-full object-cover object-center"
        />

        {showSocials ? (
          <div className="absolute right-0.5 bottom-1.5 flex items-center gap-1 rounded-full bg-white px-1.5 py-1 shadow-sm">
            <TikTokIcon className="h-[1.15rem] w-[1.15rem] text-black" />
            <InstagramIcon className="h-[1.15rem] w-[1.15rem]" />
            <YouTubeIcon className="h-[1.15rem] w-[1.15rem]" />
          </div>
        ) : null}
      </div>

      <h3
        className="font-display text-[1.15rem] font-semibold tracking-tight"
        style={{ color: "#111827" }}
      >
        {title}
      </h3>
      <p
        className="mt-2 flex-1 text-sm leading-relaxed sm:text-[0.95rem]"
        style={{ color: "#6b7280" }}
      >
        {description}
      </p>
    </article>
  );
}

function LightSectionBackdrop() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background: [
            "radial-gradient(ellipse 70% 55% at 88% 8%, rgba(243, 232, 255, 0.85) 0%, transparent 70%)",
            "radial-gradient(ellipse 55% 50% at 12% 0%, rgba(237, 233, 254, 0.7) 0%, transparent 65%)",
            "radial-gradient(ellipse 75% 60% at 92% 92%, rgba(252, 231, 243, 0.75) 0%, transparent 68%)",
            "radial-gradient(ellipse 60% 45% at 70% 100%, rgba(233, 213, 255, 0.55) 0%, transparent 70%)",
            "radial-gradient(ellipse 50% 40% at 20% 85%, rgba(245, 243, 255, 0.65) 0%, transparent 70%)",
          ].join(", "),
        }}
      />
      <div
        className="pointer-events-none absolute -top-20 right-[-4%] h-[22rem] w-[22rem] rounded-full bg-[#f3e8ff]/70 blur-[90px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-[-2%] -bottom-24 h-[26rem] w-[28rem] rounded-full bg-[#fce7f3]/55 blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-[-10%] left-[18%] h-72 w-96 rounded-full bg-[#ede9fe]/50 blur-[90px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-[8%] right-[12%] h-56 w-56 rounded-full border border-[#c4b5fd]/25"
        aria-hidden
      />
    </>
  );
}

function DotGrid({ className }: { className?: string }) {
  return (
    <div
      className={cn("grid grid-cols-4 gap-1.5 opacity-40", className)}
      aria-hidden
    >
      {Array.from({ length: 16 }).map((_, i) => (
        <span key={i} className="h-1 w-1 rounded-full bg-[#9ca3af]" />
      ))}
    </div>
  );
}

function FlowArrow({ className }: { className?: string }) {
  return (
    <AppImage
      src="/how-it-works-arrow.png"
      alt=""
      width={280}
      height={152}
      quality={100}
      unoptimized
      className={cn(
        "h-5 w-auto max-w-[2.75rem] select-none object-contain xl:h-6 xl:max-w-[3.25rem]",
        className,
      )}
      aria-hidden
    />
  );
}
