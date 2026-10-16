import { cn } from "@/lib/cn";

type BrandIconProps = {
  className?: string;
};

/** Purple three-person group mark on white squircle. */
export function AgenciesIcon({ className }: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("h-9 w-9", className)}
      aria-hidden
    >
      <rect width="48" height="48" rx="12" fill="#FFFFFF" />
      <g fill="#8B5CF6">
        {/* Back-left person */}
        <circle cx="15.2" cy="18.5" r="4" />
        <path d="M8.4 32.8c0-4.2 3-7.1 6.8-7.1s6.8 2.9 6.8 7.1v.6H8.4v-.6Z" />
        {/* Back-right person */}
        <circle cx="32.8" cy="18.5" r="4" />
        <path d="M26 32.8c0-4.2 3-7.1 6.8-7.1s6.8 2.9 6.8 7.1v.6H26v-.6Z" />
        {/* Front-center person */}
        <circle cx="24" cy="17.2" r="4.6" />
        <path d="M15.6 34.2c0-4.8 3.6-8.1 8.4-8.1s8.4 3.3 8.4 8.1v.8H15.6v-.8Z" />
      </g>
    </svg>
  );
}
