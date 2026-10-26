import { cn } from "@/lib/cn";

type BrandIconProps = {
  className?: string;
};

/** Apple Podcasts–style mark: purple person + wave rings on white squircle. */
export function PodcastsIcon({ className }: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn("h-9 w-9", className)}
      aria-hidden
    >
      <rect width="48" height="48" rx="12" fill="#FFFFFF" />
      <g fill="none" stroke="#8B5CF6" strokeWidth="2.4">
        <circle cx="24" cy="23" r="11.5" />
        <circle cx="24" cy="23" r="7.4" />
      </g>
      <circle cx="24" cy="18.2" r="3.1" fill="#8B5CF6" />
      <rect x="21.35" y="21.4" width="5.3" height="9.2" rx="2.65" fill="#8B5CF6" />
    </svg>
  );
}
