import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type MarketingAtmosphereProps = {
  children: ReactNode;
  className?: string;
};

/** Shared light ClipForge canvas — purple glow + soft grid. */
export function MarketingAtmosphere({
  children,
  className,
}: MarketingAtmosphereProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-dvh flex-col overflow-x-clip bg-[#faf9fc] text-[#111827]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute -top-28 -left-24 h-[30rem] w-[30rem] rounded-full opacity-70 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(196,181,253,0.55) 0%, rgba(237,233,254,0.2) 55%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-[12%] right-[-10%] h-[34rem] w-[34rem] rounded-full opacity-75 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(167,139,250,0.32) 0%, rgba(221,214,254,0.22) 45%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-[-8%] left-[18%] h-[22rem] w-[42rem] rounded-full opacity-55 blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse, rgba(233,213,255,0.48) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(124,58,237,0.07) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
      </div>
      <div className="relative z-10 flex min-h-dvh flex-col pt-20">{children}</div>
    </div>
  );
}
