import { cn } from "@/lib/cn";

type UploadBadgeIconProps = {
  className?: string;
};

/** Crisp vector upload badge — lavender squircle + purple upload arrow (matches feature icon). */
export function UploadBadgeIcon({ className }: UploadBadgeIconProps) {
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
      <g
        fill="none"
        stroke="#7c3aed"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* upward arrow */}
        <path d="M24 14.5v16" />
        <path d="M17.5 21 24 14.5 30.5 21" />
        {/* tray */}
        <path d="M15.5 31.5v4h17v-4" />
      </g>
    </svg>
  );
}
