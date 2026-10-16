import { cn } from "@/lib/cn";

type BrandIconProps = {
  className?: string;
};

export function TikTokIcon({ className }: BrandIconProps) {
  const path =
    "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.3a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.18a8.16 8.16 0 0 0 4.76 1.52V7.25a4.85 4.85 0 0 1-1-.56z";

  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-3.5 w-3.5", className)}
      aria-hidden
    >
      <path d={path} fill="#25F4EE" transform="translate(-0.6, 0.35)" />
      <path d={path} fill="#FE2C55" transform="translate(0.6, -0.35)" />
      <path d={path} className="fill-current" />
    </svg>
  );
}
