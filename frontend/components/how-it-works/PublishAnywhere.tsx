import { AppImage } from "@/components/ui/Image";
import { Reveal } from "@/components/ui/Reveal";
import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";

/* -------------------------------------------------------------------------- */
/* Left-rail mini platform chips                                              */
/* -------------------------------------------------------------------------- */
const platforms = [
  {
    id: "youtube",
    label: "YouTube",
    border: "border-[#E53935]/60",
    glow: "shadow-[0_0_14px_rgba(229,57,53,0.22)]",
    icon: <YouTubeLogo />,
  },
  {
    id: "tiktok",
    label: "TikTok",
    border: "border-[#111827]/70",
    glow: "shadow-[0_0_14px_rgba(15,23,42,0.16)]",
    icon: <TikTokLogo />,
  },
  {
    id: "instagram",
    label: "Instagram",
    border: "border-[#e1306c]/55",
    glow: "shadow-[0_0_14px_rgba(225,48,108,0.2)]",
    icon: <InstagramLogo />,
  },
  {
    id: "x",
    label: "X",
    border: "border-[#111827]/65",
    glow: "shadow-[0_0_14px_rgba(15,23,42,0.14)]",
    icon: <XLogo />,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    border: "border-[#0A66C2]/55",
    glow: "shadow-[0_0_14px_rgba(10,102,194,0.2)]",
    icon: <LinkedInLogo />,
  },
  {
    id: "more",
    label: "and more...",
    border: "border-[#c4b5fd]/90",
    glow: "shadow-[0_0_14px_rgba(196,181,253,0.35)]",
    icon: <MoreDotsLogo />,
  },
] as const;

type PublishAnywhereProps = {
  className?: string;
};

export function PublishAnywhere({ className }: PublishAnywhereProps) {
  return (
    <section
      id="publish"
      className={cn(
        /* Same page bg as Smart AI Analysis — no white band / seam between sections */
        "relative overflow-x-clip bg-transparent px-5 pt-8 pb-14 sm:px-8 sm:pt-10 sm:pb-16 lg:pt-12 lg:pb-20",
        className,
      )}
    >
      <div className="relative z-10 mx-auto grid w-full max-w-7xl items-center gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.25fr)] lg:gap-4 xl:gap-6">
        {/* LEFT — copy stays above the artwork */}
        <div className="relative z-20 flex max-w-xl flex-col items-start pl-2 text-left sm:pl-4 lg:max-w-none lg:pl-6">
          <Reveal>
            <Typography
              as="h2"
              variant="display"
              tone="ink"
              className="max-w-lg text-balance"
            >
              Publish{" "}
              <Typography as="span" variant="display" tone="gradient">
                Anywhere
              </Typography>
            </Typography>
          </Reveal>

          <Reveal delay={0.08}>
            <Typography
              as="p"
              variant="body"
              tone="mutedInk"
              className="mt-4 max-w-md text-pretty sm:mt-5"
            >
              Share your clips directly to all major platforms and grow your
              audience faster. Save time, reach more people, and get more views.
            </Typography>
          </Reveal>

          <Reveal delay={0.14}>
            <ul className="mt-8 flex w-full max-w-xl flex-nowrap items-start justify-between gap-1.5 sm:mt-9 sm:gap-2.5">
              {platforms.map((p) => (
                <li
                  key={p.id}
                  className="flex w-[3.55rem] shrink-0 flex-col items-center gap-1 sm:w-[4rem]"
                >
                  <span
                    className={cn(
                      "inline-flex h-9 w-9 items-center justify-center rounded-[0.75rem] border-2 bg-white sm:h-10 sm:w-10 sm:rounded-[0.85rem]",
                      p.border,
                      p.glow,
                    )}
                  >
                    {p.icon}
                  </span>
                  <span className="text-center text-[0.58rem] leading-tight font-bold text-[#0f172a] sm:text-[0.65rem]">
                    {p.label}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* RIGHT — pre-feathered PNG (soft transparent edges baked in; logos stay opaque) */}
        <Reveal from="right" delay={0.1} className="relative z-0 w-full overflow-visible">
          <div
            className={cn(
              "relative w-full max-w-[820px] sm:max-w-[900px] overflow-visible",
              /* pull social-hub artwork much further left */
              "mx-auto -translate-x-8 sm:-translate-x-14 lg:-translate-x-24 xl:-translate-x-32 2xl:-translate-x-36",
              "-mt-1 sm:-mt-2",
            )}
          >
            <div
              className="pointer-events-none absolute top-1/2 left-[40%] h-[50%] w-[50%] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(183,156,255,0.2) 0%, transparent 70%)",
                filter: "blur(52px)",
              }}
              aria-hidden
            />
            <AppImage
              src="/publish-anywhere-hub.png"
              alt="Share clips to YouTube, TikTok, Instagram, X, LinkedIn, and more platforms"
              width={1024}
              height={576}
              quality={100}
              unoptimized
              sizes="(max-width: 1024px) 100vw, 900px"
              className="relative z-[1] h-auto w-full scale-[1.1] origin-left select-none object-contain sm:scale-[1.14]"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Brand logos for left-rail chips                                            */
/* -------------------------------------------------------------------------- */

function YouTubeLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        fill="#FF0000"
        d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8Z"
      />
      <path fill="#fff" d="M9.75 15.5v-7l6.5 3.5-6.5 3.5Z" />
    </svg>
  );
}

function TikTokLogo() {
  const path =
    "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.3a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.18a8.16 8.16 0 0 0 4.76 1.52V7.25a4.85 4.85 0 0 1-1-.56z";
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path d={path} fill="#25F4EE" transform="translate(-0.55, 0.35)" />
      <path d={path} fill="#FE2C55" transform="translate(0.55, -0.35)" />
      <path d={path} fill="#111827" />
    </svg>
  );
}

function InstagramLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <defs>
        <linearGradient id="ig-chip" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f58529" />
          <stop offset="45%" stopColor="#dd2a7b" />
          <stop offset="100%" stopColor="#8134af" />
        </linearGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#ig-chip)" />
      <rect
        x="5.2"
        y="5.2"
        width="13.6"
        height="13.6"
        rx="4"
        fill="none"
        stroke="#fff"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="12" r="3.2" fill="none" stroke="#fff" strokeWidth="1.6" />
      <circle cx="16.4" cy="7.7" r="1" fill="#fff" />
    </svg>
  );
}

function XLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        fill="#111827"
        d="M17.5 3h3.1l-6.8 7.8L22 21h-5.9l-4.6-6-5.3 6H3.1l7.3-8.3L2 3h6l4.2 5.5L17.5 3Zm-1.1 16.2h1.7L7.7 4.7H5.9l10.5 14.5Z"
      />
    </svg>
  );
}

function LinkedInLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <rect width="24" height="24" rx="4" fill="#0A66C2" />
      <path
        fill="#fff"
        d="M8.2 9.3H5.7V18h2.5V9.3ZM6.95 8.2a1.45 1.45 0 1 0 0-2.9 1.45 1.45 0 0 0 0 2.9ZM18.3 18h-2.5v-4.15c0-.98-.02-2.24-1.37-2.24-1.37 0-1.58 1.07-1.58 2.17V18h-2.5V9.3h2.4v1.16h.03c.33-.63 1.14-1.29 2.35-1.29 2.51 0 2.97 1.65 2.97 3.8V18Z"
      />
    </svg>
  );
}

function MoreDotsLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <circle cx="6" cy="12" r="1.8" fill="#64748b" />
      <circle cx="12" cy="12" r="1.8" fill="#64748b" />
      <circle cx="18" cy="12" r="1.8" fill="#64748b" />
    </svg>
  );
}
