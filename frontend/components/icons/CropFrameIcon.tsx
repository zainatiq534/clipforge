import { cn } from "@/lib/cn";

type CropFrameIconProps = {
  className?: string;
  strokeWidth?: number;
};

/**
 * Same-to-same crop tile from reference:
 * lavender rounded square + purple border + classic crop with corner overhangs.
 */
export function CropFrameIcon({ className, strokeWidth = 2.35 }: CropFrameIconProps) {
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

      {/*
        Exact crop geometry (Lucide-style, scaled into tile):
        - Left/bottom piece: vertical stub ABOVE top edge, then down, then right along bottom
        - Right/top piece: vertical stub BELOW bottom edge, then up, then left along top
        Overhangs on all 4 corners — same layout as the picture.
      */}
      <g
        transform="translate(12 12)"
        stroke="#7C3AED"
        strokeWidth={strokeWidth}
        strokeLinecap="butt"
        strokeLinejoin="round"
      >
        {/* M6 2v14a2 2 0 0 0 2 2h14  → left stub + bottom edge */}
        <path d="M6 2v14a2 2 0 0 0 2 2h14" />
        {/* M18 22V8a2 2 0 0 0-2-2H2 → right stub + top edge */}
        <path d="M18 22V8a2 2 0 0 0-2-2H2" />
      </g>
    </svg>
  );
}
