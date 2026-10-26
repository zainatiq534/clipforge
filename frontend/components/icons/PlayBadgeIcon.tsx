import { cn } from "@/lib/cn";

type PlayBadgeIconProps = {
  className?: string;
};

/** Crisp vector play badge — lavender squircle + purple play triangle (matches feature icon). */
export function PlayBadgeIcon({ className }: PlayBadgeIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("h-11 w-11 shrink-0", className)}
      aria-hidden
    >
      <rect
        x="0.5"
        y="0.5"
        width="47"
        height="47"
        rx="12"
        fill="#f3e8ff"
        stroke="#e9e0ff"
        strokeWidth="1"
      />
      {/* Outlined play triangle — optically nudged right */}
      <path
        d="M19.5 15.5v17l14-8.5-14-8.5z"
        fill="none"
        stroke="#7c3aed"
        strokeWidth="2.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
