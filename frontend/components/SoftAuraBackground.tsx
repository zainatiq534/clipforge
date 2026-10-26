import { cn } from "@/lib/cn";
import { SOFT_PAGE_BASE } from "@/lib/softPageBg";

type SoftAuraBackgroundProps = {
  className?: string;
};

/**
 * Soft aurora background from the Features reference —
 * lavender / soft purple / sky blue on a shared continuous page base.
 */
export function SoftAuraBackground({ className }: SoftAuraBackgroundProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      {/* Shared base — same across all light sections (no seam) */}
      <div className="absolute inset-0" style={{ background: SOFT_PAGE_BASE }} />

      {/* Top lavender glow */}
      <div
        className="absolute left-1/2 top-[-25%] h-[75%] w-[130%] -translate-x-1/2 rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(196,181,253,0.65) 0%, rgba(221,214,254,0.35) 40%, transparent 70%)",
          filter: "blur(36px)",
        }}
      />

      {/* Left sky-blue wave */}
      <div
        className="absolute bottom-[-30%] left-[-15%] h-[70%] w-[75%] rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(147,197,253,0.55) 0%, rgba(191,219,254,0.3) 45%, transparent 72%)",
          filter: "blur(48px)",
        }}
      />

      {/* Right soft orchid / pink */}
      <div
        className="absolute bottom-[-15%] right-[-12%] h-[60%] w-[60%] rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(244,114,182,0.22) 0%, rgba(216,180,254,0.28) 40%, transparent 70%)",
          filter: "blur(44px)",
        }}
      />

      {/* Center soft white lift */}
      <div
        className="absolute left-1/2 top-[35%] h-[50%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.75) 0%, transparent 68%)",
          filter: "blur(28px)",
        }}
      />
    </div>
  );
}
