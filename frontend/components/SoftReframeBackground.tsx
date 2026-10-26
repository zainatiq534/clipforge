import { cn } from "@/lib/cn";
import { SOFT_PAGE_BASE } from "@/lib/softPageBg";

type SoftReframeBackgroundProps = {
  className?: string;
};

/**
 * Smart Video Reframing section — silk waves on shared continuous page base.
 */
export function SoftReframeBackground({ className }: SoftReframeBackgroundProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      <div className="absolute inset-0" style={{ background: SOFT_PAGE_BASE }} />

      {/* Silk wave — top left */}
      <div
        className="absolute -left-[20%] -top-[25%] h-[80%] w-[90%] rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(216,200,255,0.5) 0%, rgba(237,233,254,0.28) 42%, transparent 72%)",
          filter: "blur(52px)",
        }}
      />

      {/* Silk wave — top right / mid */}
      <div
        className="absolute -right-[22%] top-[-5%] h-[75%] w-[75%] rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(196,181,253,0.42) 0%, rgba(221,214,254,0.2) 40%, transparent 70%)",
          filter: "blur(58px)",
        }}
      />

      {/* Soft magenta/purple glow — bottom center (behind clips area) */}
      <div
        className="absolute bottom-[-35%] left-1/2 h-[70%] w-[95%] -translate-x-1/2 rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(192,132,252,0.35) 0%, rgba(233,213,255,0.22) 40%, transparent 72%)",
          filter: "blur(64px)",
        }}
      />

      {/* Pale blue whisper — mid left */}
      <div
        className="absolute bottom-[10%] left-[-10%] h-[50%] w-[55%] rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(191,219,254,0.35) 0%, transparent 68%)",
          filter: "blur(48px)",
        }}
      />

      {/* Center white lift */}
      <div
        className="absolute left-1/2 top-[40%] h-[50%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.88) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />
    </div>
  );
}
