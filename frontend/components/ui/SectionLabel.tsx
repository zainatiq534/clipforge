import { cn } from "@/lib/cn";

type SectionLabelProps = {
  children: string;
  className?: string;
};

/** Centered all-caps label with hairlines — Trusted By / Pricing style */
export function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <div className={cn("flex items-center gap-3 sm:gap-4", className)}>
      <span className="h-px w-10 bg-[#9788d1] sm:w-14" aria-hidden />
      <span
        className="font-sans text-[0.7rem] font-semibold tracking-[0.18em] uppercase sm:text-xs"
        style={{ color: "#9788d1" }}
      >
        {children}
      </span>
      <span className="h-px w-10 bg-[#9788d1] sm:w-14" aria-hidden />
    </div>
  );
}
