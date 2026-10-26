import { InstagramIcon, TikTokIcon, YouTubeIcon } from "@/components/icons";
import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";

const platforms = [
  { name: "TikTok", icon: <TikTokIcon className="text-white" /> },
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
            <Typography as="span" variant="caption" tone="white" className="text-[0.8rem]">
              {platform.name}
            </Typography>
          </span>
        </li>
      ))}
    </ul>
  );
}
