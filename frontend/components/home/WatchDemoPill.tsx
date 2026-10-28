import { Play } from "lucide-react";
import { cn } from "@/lib/cn";

type WatchDemoPillProps = {
  className?: string;
  href?: string;
};

/** Dark navy outline pill — same style family as the upload CTA mock. */
export function WatchDemoPill({
  className,
  href = "#demo",
}: WatchDemoPillProps) {
  return (
    <a
      href={href}
      className={cn(
        "group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-white/50",
        "bg-[radial-gradient(120%_140%_at_50%_0%,#1a2748_0%,#0a1028_55%,#050814_100%)]",
        "px-5 py-3 shadow-[0_12px_36px_rgba(5,8,20,0.4)] transition-[border-color,box-shadow,filter] duration-200",
        "hover:border-white/75 hover:brightness-110",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a78bfa]",
        "sm:px-6 sm:py-3.5",
        className,
      )}
    >
      <span
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_15%,rgba(96,165,250,0.16),transparent_50%)]"
        aria-hidden
      />
      <span className="relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white sm:h-9 sm:w-9">
        <Play
          className="h-3.5 w-3.5 fill-[#0a1028] text-[#0a1028] sm:h-4 sm:w-4"
          strokeWidth={0}
          aria-hidden
        />
      </span>
      <span className="relative font-sans text-[0.95rem] font-bold tracking-[-0.01em] text-white sm:text-[1rem]">
        Watch Demo
      </span>
    </a>
  );
}
