import { cn } from "@/lib/cn";
import { SOFT_PAGE_BASE } from "@/lib/softPageBg";

type SoftContinuousBackgroundProps = {
  className?: string;
};

/**
 * One continuous light-page backdrop for Features → AI Engine.
 * Soft auras only — no per-section opaque washes that create seams.
 */
export function SoftContinuousBackground({
  className,
}: SoftContinuousBackgroundProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      <div className="absolute inset-0" style={{ background: SOFT_PAGE_BASE }} />

      {/* Soft lavender — top */}
      <div
        className="absolute left-1/2 top-[-8%] h-[42%] w-[140%] -translate-x-1/2 rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(196,181,253,0.42) 0%, rgba(221,214,254,0.2) 45%, transparent 72%)",
          filter: "blur(48px)",
        }}
      />

      {/* Soft sky whisper — upper left (Features area) */}
      <div
        className="absolute top-[8%] left-[-20%] h-[28%] w-[70%] rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(186,220,255,0.28) 0%, transparent 70%)",
          filter: "blur(56px)",
        }}
      />

      {/* Lavender — mid (Captions / Reframe) */}
      <div
        className="absolute top-[32%] right-[-18%] h-[36%] w-[75%] rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(216,200,255,0.4) 0%, rgba(233,213,255,0.18) 48%, transparent 72%)",
          filter: "blur(60px)",
        }}
      />

      {/* Soft blue-lavender — mid-lower (Platform) */}
      <div
        className="absolute top-[55%] left-[-15%] h-[32%] w-[70%] rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(191,219,254,0.28) 0%, rgba(221,214,254,0.16) 50%, transparent 72%)",
          filter: "blur(58px)",
        }}
      />

      {/* Soft orchid — lower (AI Engine) */}
      <div
        className="absolute right-[-12%] bottom-[-5%] h-[38%] w-[70%] rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(232,200,255,0.35) 0%, rgba(244,180,230,0.12) 48%, transparent 72%)",
          filter: "blur(62px)",
        }}
      />

      {/* Center lift */}
      <div
        className="absolute left-1/2 top-[48%] h-[50%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.55) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
    </div>
  );
}
