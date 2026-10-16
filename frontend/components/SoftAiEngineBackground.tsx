import { cn } from "@/lib/cn";

type SoftAiEngineBackgroundProps = {
  className?: string;
};

/**
 * ClipForge AI Engine section background only —
 * clean white / pale lavender base, soft purple–pink fluid waves
 * in the corners, soft center purple glow (from reference). Background only.
 */
export function SoftAiEngineBackground({ className }: SoftAiEngineBackgroundProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      {/* Base — bright white / pale lavender */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, #F8F7FF 0%, #FAFAFE 30%, #FFFFFF 58%, #FBF9FF 100%)",
        }}
      />

      {/* Soft lavender wave — top left */}
      <div
        className="absolute -left-[22%] -top-[28%] h-[85%] w-[85%] rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(216,200,255,0.55) 0%, rgba(237,233,254,0.3) 42%, transparent 72%)",
          filter: "blur(56px)",
        }}
      />

      {/* Soft lavender / pink wave — top right */}
      <div
        className="absolute -right-[18%] -top-[20%] h-[80%] w-[75%] rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(232,200,255,0.5) 0%, rgba(243,232,255,0.28) 40%, transparent 70%)",
          filter: "blur(58px)",
        }}
      />

      {/* Soft pink whisper — mid left / bottom left */}
      <div
        className="absolute -bottom-[25%] -left-[15%] h-[70%] w-[70%] rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(244,180,230,0.28) 0%, rgba(233,213,255,0.2) 45%, transparent 72%)",
          filter: "blur(64px)",
        }}
      />

      {/* Soft purple — bottom right */}
      <div
        className="absolute -bottom-[30%] -right-[12%] h-[65%] w-[65%] rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(196,181,253,0.38) 0%, rgba(237,233,254,0.2) 42%, transparent 72%)",
          filter: "blur(60px)",
        }}
      />

      {/* Central soft purple glow — behind AI core */}
      <div
        className="absolute left-1/2 top-[42%] h-[45%] w-[50%] -translate-x-1/2 -translate-y-1/2 rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(167,139,250,0.28) 0%, rgba(216,180,254,0.14) 45%, transparent 72%)",
          filter: "blur(48px)",
        }}
      />

      {/* Center white lift — keeps middle airy */}
      <div
        className="absolute left-1/2 top-1/2 h-[50%] w-[60%] -translate-x-1/2 -translate-y-1/2 rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.9) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />
    </div>
  );
}
