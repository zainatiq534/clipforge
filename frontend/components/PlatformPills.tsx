import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";

function TikTokIcon() {
  const path =
    "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.3a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.18a8.16 8.16 0 0 0 4.76 1.52V7.25a4.85 4.85 0 0 1-1-.56z";

  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
      <path d={path} fill="#25F4EE" transform="translate(-0.6, 0.35)" />
      <path d={path} fill="#FE2C55" transform="translate(0.6, -0.35)" />
      <path d={path} fill="#FFFFFF" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
      <defs>
        <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F58529" />
          <stop offset="45%" stopColor="#DD2A7B" />
          <stop offset="100%" stopColor="#8134AF" />
        </linearGradient>
      </defs>
      <path
        fill="url(#instagram-gradient)"
        d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6m9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"
      />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
      <path
        fill="#FF0000"
        d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8z"
      />
      <path fill="#FFFFFF" d="M9.75 15.5v-7l6.5 3.5-6.5 3.5z" />
    </svg>
  );
}

const platforms = [
  { name: "TikTok", icon: <TikTokIcon /> },
  { name: "Instagram Reels", icon: <InstagramIcon /> },
  { name: "YouTube Shorts", icon: <YouTubeIcon /> },
];

type PlatformPillsProps = {
  className?: string;
};

export function PlatformPills({ className }: PlatformPillsProps) {
  return (
    <ul
      className={cn(
        "flex flex-wrap items-center justify-center gap-2.5",
        className,
      )}
    >
      {platforms.map((platform) => (
        <li key={platform.name}>
          <span className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-white/90 backdrop-blur-sm">
            {platform.icon}
            <Typography as="span" size="caption" tone="white" className="text-[0.8rem]">
              {platform.name}
            </Typography>
          </span>
        </li>
      ))}
    </ul>
  );
}
