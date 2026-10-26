import { cn } from "@/lib/cn";

type FaceTrackIconProps = {
  className?: string;
  strokeWidth?: number;
};

/**
 * Full icon tile matched to reference:
 * rounded square + border + focus brackets + person (sharp SVG).
 */
export function FaceTrackIcon({ className, strokeWidth = 1.75 }: FaceTrackIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={cn("h-12 w-12", className)}
      aria-hidden
    >
      {/* Soft lavender fill */}
      <rect x="1" y="1" width="46" height="46" rx="13" fill="#F5F3FF" />
      {/* Outer border */}
      <rect
        x="1"
        y="1"
        width="46"
        height="46"
        rx="13"
        stroke="#7C3AED"
        strokeWidth="1.5"
      />

      {/* Focus brackets */}
      <path
        d="M12 18V13h5M36 18V13h-5M12 30v5h5M36 30v5h-5"
        stroke="#7C3AED"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Head */}
      <circle
        cx="24"
        cy="19.5"
        r="4.25"
        stroke="#7C3AED"
        strokeWidth={strokeWidth}
      />

      {/* Shoulders */}
      <path
        d="M15.5 32.5c2-3.4 4.7-5 8.5-5s6.5 1.6 8.5 5"
        stroke="#7C3AED"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}
