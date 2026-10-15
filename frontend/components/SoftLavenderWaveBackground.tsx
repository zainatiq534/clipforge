import { cn } from "@/lib/cn";

type SoftLavenderWaveBackgroundProps = {
  className?: string;
};

/**
 * Captions section background — pale lavender / off-white soft waves
 * (from the Automatic Captions reference picture). Background only.
 */
export function SoftLavenderWaveBackground({
  className,
}: SoftLavenderWaveBackgroundProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      {/* Soft off-white / lavender base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(155deg, #F8F6FC 0%, #F3F0FA 28%, #FAF9FC 55%, #FFFFFF 100%)",
        }}
      />

      {/* Upper soft purple wave */}
      <div
        className="absolute -left-[15%] top-[-20%] h-[70%] w-[90%] rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(216,200,255,0.45) 0%, rgba(237,233,254,0.25) 45%, transparent 72%)",
          filter: "blur(48px)",
        }}
      />

      {/* Top-right lilac flow */}
      <div
        className="absolute -right-[25%] top-[-10%] h-[80%] w-[80%] rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(196,181,253,0.4) 0%, rgba(221,214,254,0.22) 40%, transparent 70%)",
          filter: "blur(56px)",
        }}
      />

      {/* Bottom soft wave */}
      <div
        className="absolute -bottom-[40%] left-[10%] h-[85%] w-[100%] rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(233,213,255,0.5) 0%, rgba(243,232,255,0.28) 42%, transparent 72%)",
          filter: "blur(60px)",
        }}
      />

      {/* Center lift — keeps middle airy for content */}
      <div
        className="absolute left-1/2 top-1/2 h-[55%] w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(255,255,255,0.85) 0%, transparent 70%)",
          filter: "blur(28px)",
        }}
      />
    </div>
  );
}
