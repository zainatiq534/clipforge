import { cn } from "@/lib/cn";

type SoftAuraBackgroundProps = {
  className?: string;
};

/** Soft pastel mesh: lavender → blue → cream (features section) */
export function SoftAuraBackground({ className }: SoftAuraBackgroundProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(165deg, #E8D9FA 0%, #E4ECFB 28%, #F4F0FB 55%, #F7F5F2 100%)",
        }}
      />
      <div
        className="absolute left-1/2 top-[-20%] h-[70%] w-[120%] -translate-x-1/2 rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(186,170,245,0.55) 0%, transparent 68%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute bottom-[-25%] left-[-10%] h-[65%] w-[70%] rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(167,200,255,0.5) 0%, transparent 70%)",
          filter: "blur(48px)",
        }}
      />
      <div
        className="absolute bottom-[-10%] right-[-5%] h-[55%] w-[55%] rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(232,180,240,0.35) 0%, transparent 68%)",
          filter: "blur(44px)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
