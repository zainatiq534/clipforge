import { cn } from "@/lib/cn";

type DevicesFrameIconProps = {
  className?: string;
  strokeWidth?: number;
};

/**
 * Exact devices tile from reference:
 * lavender rounded square + purple border + tablet with phone overlapping bottom-right.
 */
export function DevicesFrameIcon({
  className,
  strokeWidth = 1.85,
}: DevicesFrameIconProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={cn("h-12 w-12", className)}
      aria-hidden
    >
      <rect x="1" y="1" width="46" height="46" rx="13" fill="#F5F3FF" />
      <rect
        x="1"
        y="1"
        width="46"
        height="46"
        rx="13"
        stroke="#7C3AED"
        strokeWidth="1.5"
      />

      {/* Larger device (tablet / monitor) — left */}
      <rect
        x="11"
        y="12"
        width="20"
        height="17"
        rx="2.5"
        stroke="#7C3AED"
        strokeWidth={strokeWidth}
      />

      {/* Phone overlapping bottom-right of tablet */}
      <rect
        x="26"
        y="20"
        width="11"
        height="16"
        rx="2.25"
        fill="#F5F3FF"
        stroke="#7C3AED"
        strokeWidth={strokeWidth}
      />
      {/* Phone home indicator */}
      <path
        d="M29.5 33.5h4"
        stroke="#7C3AED"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}
