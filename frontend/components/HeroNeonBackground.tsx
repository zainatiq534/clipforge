import { cn } from "@/lib/cn";

type HeroNeonBackgroundProps = {
  className?: string;
};

/**
 * Hero theme from reference — deep navy/black with electric blue
 * + violet neon glows and soft light trails.
 */
export function HeroNeonBackground({ className }: HeroNeonBackgroundProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      {/* Base dark navy */}
      <div className="absolute inset-0 bg-[#050814]" />

      {/* Bottom-left electric blue glow */}
      <div
        className="absolute -bottom-[30%] -left-[20%] h-[90%] w-[80%] rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(59,130,246,0.45) 0%, rgba(37,99,235,0.2) 35%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Bottom-right / mid violet glow */}
      <div
        className="absolute -bottom-[20%] -right-[10%] h-[85%] w-[70%] rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(139,92,246,0.5) 0%, rgba(124,58,237,0.22) 40%, transparent 72%)",
          filter: "blur(44px)",
        }}
      />

      {/* Top-center soft purple wash */}
      <div
        className="absolute left-1/2 top-[-15%] h-[55%] w-[90%] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(167,139,250,0.22) 0%, transparent 65%)",
          filter: "blur(36px)",
        }}
      />

      {/* Neon light trails */}
      <svg
        className="absolute inset-0 h-full w-full opacity-70"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <path
          d="M-40 720C220 640 380 520 520 480C720 420 820 560 980 540C1120 524 1280 420 1500 360"
          stroke="url(#trail1)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M-20 780C260 700 420 600 580 560C780 500 900 640 1080 610C1220 586 1340 500 1520 440"
          stroke="url(#trail2)"
          strokeWidth="1.75"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M100 820C340 760 500 680 660 640C820 600 940 700 1100 680"
          stroke="url(#trail3)"
          strokeWidth="1.25"
          strokeLinecap="round"
          opacity="0.5"
        />
        <defs>
          <linearGradient id="trail1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0" />
            <stop offset="35%" stopColor="#3b82f6" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#a78bfa" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#c4b5fd" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="trail2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#93c5fd" stopOpacity="0" />
            <stop offset="50%" stopColor="#818cf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#e9d5ff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="trail3" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
            <stop offset="60%" stopColor="#8b5cf6" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Soft vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,8,20,0.35)_75%,rgba(5,8,20,0.65)_100%)]" />
    </div>
  );
}
