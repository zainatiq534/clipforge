import { cn } from "@/lib/cn";

type SoftPlatformBackgroundProps = {
  className?: string;
};

/**
 * Multi-Platform Video Optimization section background only —
 * pale sky blue (top-left), lavender / soft magenta (right),
 * bright off-white center (from reference). Background only.
 */
export function SoftPlatformBackground({ className }: SoftPlatformBackgroundProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      {/* Base — cool off-white / mist */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(155deg, #F5F8FF 0%, #F8F6FC 28%, #FAF9FF 55%, #FFFFFF 100%)",
        }}
      />

      {/* Pale sky blue — top left */}
      <div
        className="absolute -left-[18%] -top-[20%] h-[75%] w-[70%] rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(186,220,255,0.55) 0%, rgba(224,242,255,0.3) 42%, transparent 72%)",
          filter: "blur(54px)",
        }}
      />

      {/* Lavender — top right (dominant) */}
      <div
        className="absolute -right-[20%] -top-[15%] h-[85%] w-[80%] rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(216,200,255,0.58) 0%, rgba(232,219,255,0.32) 40%, transparent 70%)",
          filter: "blur(56px)",
        }}
      />

      {/* Soft magenta / pink blend — mid right */}
      <div
        className="absolute -right-[10%] top-[25%] h-[70%] w-[65%] rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(244,180,230,0.32) 0%, rgba(233,213,255,0.22) 45%, transparent 72%)",
          filter: "blur(62px)",
        }}
      />

      {/* Soft purple — bottom right */}
      <div
        className="absolute -bottom-[30%] right-[-5%] h-[70%] w-[75%] rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(196,181,253,0.45) 0%, rgba(237,233,254,0.25) 42%, transparent 72%)",
          filter: "blur(60px)",
        }}
      />

      {/* Bright center-left lift — airy text area */}
      <div
        className="absolute left-[15%] top-[35%] h-[55%] w-[55%] -translate-y-1/2 rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.92) 0%, transparent 70%)",
          filter: "blur(32px)",
        }}
      />
    </div>
  );
}
