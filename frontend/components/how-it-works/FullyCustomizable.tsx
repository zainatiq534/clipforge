import { CustomizableEditorMockup } from "@/components/how-it-works/CustomizableEditorMockup";
import { Reveal } from "@/components/ui/Reveal";
import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";

/** Same lavender tile as How It Works step icons */
const FEATURE_WRAP =
  "border border-[#d9d4f5]/80 bg-[#e6ebfc] shadow-[0_8px_20px_-10px_rgba(124,58,237,0.28)]";

const features = [
  {
    label: "Auto captions & subtitles",
    icon: <CaptionsLogo />,
  },
  {
    label: "Text & emojis",
    icon: <TextLogo />,
  },
  {
    label: "Custom templates",
    icon: <TemplatesLogo />,
  },
  {
    label: "Multiple aspect ratios",
    icon: <RatiosLogo />,
  },
] as const;

type FullyCustomizableProps = {
  className?: string;
};

export function FullyCustomizable({ className }: FullyCustomizableProps) {
  return (
    <section
      id="customize"
      className={cn(
        "relative overflow-hidden px-5 py-14 sm:px-8 sm:py-16 lg:py-20",
        className,
      )}
    >
      {/* Soft circular line atmosphere — matches mockup */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div
          className="absolute top-1/2 left-[55%] h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40"
          style={{
            background:
              "radial-gradient(circle, transparent 42%, rgba(167,139,250,0.12) 43%, transparent 44%), radial-gradient(circle, transparent 58%, rgba(147,197,253,0.1) 59%, transparent 60%)",
          }}
        />
        <div
          className="absolute -top-10 right-[8%] h-72 w-72 rounded-full opacity-70 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(196,181,253,0.45) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:gap-10 xl:gap-14">
        {/* Copy — nudged right for balance with the tilted card */}
        <div className="flex max-w-xl flex-col items-start pl-3 text-left sm:pl-5 lg:max-w-none lg:pl-8 xl:pl-10">
          <Reveal delay={0.08}>
            <Typography
              as="h2"
              variant="display"
              tone="ink"
              className="max-w-lg text-balance"
            >
              Edit, Personalize,{" "}
              <Typography as="span" variant="display" tone="gradient">
                Make It Yours
              </Typography>
            </Typography>
          </Reveal>

          <Reveal delay={0.14}>
            <Typography
              as="p"
              variant="body"
              tone="mutedInk"
              className="mt-4 max-w-md text-pretty sm:mt-5"
            >
              Your brand, your style. Customize your clips with captions, text,
              emojis, and more. Make every video match your unique voice and
              audience.
            </Typography>
          </Reveal>

          <Reveal delay={0.2}>
            <ul className="mt-8 grid w-full max-w-xl grid-cols-2 gap-4 sm:mt-9 sm:grid-cols-4 sm:gap-4">
              {features.map((feature) => (
                <li
                  key={feature.label}
                  className="flex min-w-0 flex-col items-start gap-2.5 sm:gap-3"
                >
                  <span
                    className={cn(
                      "inline-flex h-12 w-12 items-center justify-center rounded-[1.05rem] sm:h-16 sm:w-16 sm:rounded-[1.25rem]",
                      FEATURE_WRAP,
                    )}
                  >
                    {feature.icon}
                  </span>
                  <span className="max-w-[8rem] text-[0.8rem] leading-snug font-semibold text-[#1e293b] sm:text-[0.92rem]">
                    {feature.label}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Tilted editor card */}
        <Reveal from="right" delay={0.12} className="w-full">
          <div className="px-2 pt-4 pb-6 sm:px-4 sm:pt-6 sm:pb-8">
            <CustomizableEditorMockup />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Shared purple→blue gradient used by How It Works step icons */
function IconGrad({ id }: { id: string }) {
  return (
    <linearGradient id={id} x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stopColor="#7c3aed" />
      <stop offset="55%" stopColor="#8b5cf6" />
      <stop offset="100%" stopColor="#6366f1" />
    </linearGradient>
  );
}

/** CC in rounded square — bold purple gradient */
function CaptionsLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-9 w-9 sm:h-10 sm:w-10" aria-hidden>
      <defs>
        <IconGrad id="featCaptionsGrad" />
      </defs>
      <rect
        x="2.5"
        y="4.5"
        width="19"
        height="15"
        rx="2.8"
        fill="none"
        stroke="url(#featCaptionsGrad)"
        strokeWidth="2.4"
      />
      <text
        x="12"
        y="15.2"
        textAnchor="middle"
        fill="url(#featCaptionsGrad)"
        fontSize="10"
        fontWeight="800"
        fontFamily="system-ui, sans-serif"
      >
        CC
      </text>
    </svg>
  );
}

/** Bold T — purple gradient */
function TextLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-9 w-9 sm:h-10 sm:w-10" aria-hidden>
      <defs>
        <IconGrad id="featTextGrad" />
      </defs>
      <text
        x="12"
        y="18"
        textAnchor="middle"
        fill="url(#featTextGrad)"
        fontSize="18"
        fontWeight="800"
        fontFamily="system-ui, sans-serif"
      >
        T
      </text>
    </svg>
  );
}

/** 2×2 grid — bold purple gradient strokes */
function TemplatesLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-9 w-9 sm:h-10 sm:w-10" aria-hidden>
      <defs>
        <IconGrad id="featTemplatesGrad" />
      </defs>
      {[
        [2.6, 2.6],
        [13.0, 2.6],
        [2.6, 13.0],
        [13.0, 13.0],
      ].map(([x, y]) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width="8.4"
          height="8.4"
          rx="2.2"
          fill="none"
          stroke="url(#featTemplatesGrad)"
          strokeWidth="2.5"
        />
      ))}
    </svg>
  );
}

/** Dashed frame — bold purple gradient */
function RatiosLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-9 w-9 sm:h-10 sm:w-10" aria-hidden>
      <defs>
        <IconGrad id="featRatiosGrad" />
      </defs>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="2.4"
        fill="none"
        stroke="url(#featRatiosGrad)"
        strokeWidth="2.4"
        strokeDasharray="3.6 2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
