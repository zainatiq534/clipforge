import { cn } from "@/lib/cn";

type BrandIconProps = {
  className?: string;
};

/**
 * Crisp TikTok badge — black rounded square + cyan/magenta/white note.
 * Vector paths keep edges sharp at any size.
 */
export function TikTokBadgeIcon({ className }: BrandIconProps) {
  // Centered musical-note / "d" mark in 24×24
  const note =
    "M17.2 6.2a3.4 3.4 0 0 1-2.65-3.05V2.8h-2.55v10.2a2.2 2.2 0 1 1-1.7-2.15V8.05a4.7 4.7 0 1 0 4.55 4.7V7.65c.78.5 1.7.8 2.7.8V6.3c-.45 0-.9-.04-1.35-.1z";

  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-3.5 w-3.5", className)}
      aria-hidden
      shapeRendering="geometricPrecision"
    >
      <rect width="24" height="24" rx="5.5" fill="#000000" />
      <path d={note} fill="#25F4EE" transform="translate(-0.55 0.4)" />
      <path d={note} fill="#FE2C55" transform="translate(0.55 -0.4)" />
      <path d={note} fill="#FFFFFF" />
    </svg>
  );
}
