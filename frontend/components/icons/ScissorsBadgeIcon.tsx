import { cn } from "@/lib/cn";

type ScissorsBadgeIconProps = {
  className?: string;
};

/** Crisp vector scissors badge — lavender squircle + purple scissors (matches feature icon). */
export function ScissorsBadgeIcon({ className }: ScissorsBadgeIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("h-11 w-11 shrink-0", className)}
      aria-hidden
    >
      <rect width="48" height="48" rx="12" fill="#f3e8ff" />
      <g
        fill="none"
        stroke="#7c3aed"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* blades */}
        <path d="M18.5 14.5 29.5 33.5" />
        <path d="M29.5 14.5 18.5 33.5" />
        {/* handles */}
        <circle cx="16.2" cy="36.2" r="4.2" />
        <circle cx="31.8" cy="36.2" r="4.2" />
      </g>
    </svg>
  );
}
