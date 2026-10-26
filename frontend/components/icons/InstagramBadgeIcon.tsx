import { cn } from "@/lib/cn";

type BrandIconProps = {
  className?: string;
};

/**
 * Crisp Instagram badge — official gradient + white camera outline.
 * Pure SVG so edges stay sharp (no raster blur).
 */
export function InstagramBadgeIcon({ className }: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-3.5 w-3.5", className)}
      aria-hidden
      shapeRendering="geometricPrecision"
    >
      <defs>
        <linearGradient
          id="igBadgeGradClip"
          x1="3"
          y1="21"
          x2="21"
          y2="3"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FCAF45" />
          <stop offset="25%" stopColor="#F77737" />
          <stop offset="50%" stopColor="#E1306C" />
          <stop offset="75%" stopColor="#C13584" />
          <stop offset="100%" stopColor="#833AB4" />
        </linearGradient>
      </defs>
      <rect width="24" height="24" rx="5.5" fill="url(#igBadgeGradClip)" />
      {/* Outer camera rounded square */}
      <rect
        x="5.25"
        y="5.25"
        width="13.5"
        height="13.5"
        rx="3.6"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.65"
      />
      {/* Lens */}
      <circle
        cx="12"
        cy="12"
        r="3.15"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="1.65"
      />
      {/* Flash dot */}
      <circle cx="16.35" cy="7.7" r="1.05" fill="#FFFFFF" />
    </svg>
  );
}
