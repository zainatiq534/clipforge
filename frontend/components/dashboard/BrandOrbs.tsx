import { cn } from "@/lib/cn";

type BrandOrbsProps = {
  className?: string;
};

/**
 * Soft overlapping orbs — brand kit: #a78bfa → #8b5cf6 → #7c3aed → #3b82f6.
 * Matches the dashboard banner diagram look (glass / translucent circles).
 */
export function BrandOrbs({ className }: BrandOrbsProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute -top-4 -right-2 h-24 w-24 scale-90 opacity-80 sm:top-0 sm:right-3 sm:h-40 sm:w-40 sm:scale-100 sm:opacity-100",
        className,
      )}
      aria-hidden
    >
      {/* Soft glow base */}
      <div className="absolute top-6 left-4 h-24 w-24 rounded-full bg-[#a78bfa]/25 blur-2xl" />

      {/* Light lavender — bottom left of cluster */}
      <div className="absolute top-14 left-2 h-[4.25rem] w-[4.25rem] rounded-full bg-[#c4b5fd]/75 blur-[1.5px] sm:h-[4.75rem] sm:w-[4.75rem]" />

      {/* Mid violet */}
      <div className="absolute top-8 left-8 h-[3.6rem] w-[3.6rem] rounded-full bg-[#a78bfa]/70 blur-[0.5px] sm:h-16 sm:w-16" />

      {/* Deep brand violet */}
      <div className="absolute top-4 left-14 h-14 w-14 rounded-full bg-[#8b5cf6]/65 blur-[0.5px] sm:h-[3.75rem] sm:w-[3.75rem]" />

      {/* Brand blue accent — bottom right */}
      <div className="absolute top-[4.25rem] left-[4.5rem] h-12 w-12 rounded-full bg-[#3b82f6]/45 blur-[1px] sm:h-14 sm:w-14" />

      {/* Small deep center accent */}
      <div className="absolute top-12 left-12 h-8 w-8 rounded-full bg-[#7c3aed]/50 blur-[0.5px]" />

      {/* Soft sky highlight */}
      <div className="absolute top-6 left-[5.5rem] h-9 w-9 rounded-full bg-[#60a5fa]/35 blur-[1px]" />
    </div>
  );
}
