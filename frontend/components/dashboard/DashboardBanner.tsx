import { GradientButton } from "@/components/ui/Button";

export function DashboardBanner() {
  return (
    <section className="relative overflow-hidden rounded-[22px] bg-[#ede9fe] px-5 py-5 shadow-[0_10px_28px_rgba(124,58,237,0.12)] sm:px-6 sm:py-6">
      <div className="relative z-10 max-w-[30rem]">
        <h1 className="font-sans text-[1.25rem] leading-[1.15] font-extrabold tracking-[-0.03em] text-[#111827] sm:text-[1.45rem]">
          Work&apos;s always better together
        </h1>
        <p className="mt-1.5 max-w-[26rem] font-sans text-[12px] leading-relaxed text-[#5b21b6]/75">
          Invite your teammates and start collaborating on projects in one shared
          workspace.
        </p>
        <GradientButton size="sm" className="mt-4">
          + Add member
        </GradientButton>
      </div>

      <div
        className="pointer-events-none absolute -top-5 -right-3 h-28 w-28 sm:top-[-6px] sm:right-4 sm:h-36 sm:w-36"
        aria-hidden
      >
        <div className="absolute top-7 left-7 h-14 w-14 rounded-full bg-[#a78bfa]/70 blur-[1px]" />
        <div className="absolute top-3 left-12 h-12 w-12 rounded-full bg-[#8b5cf6]/55" />
        <div className="absolute top-12 left-3 h-12 w-12 rounded-full bg-[#c4b5fd]/90" />
        <div className="absolute top-14 left-14 h-10 w-10 rounded-full bg-[#3b82f6]/40" />
        <div className="absolute top-12 left-9 h-7 w-7 rounded-full bg-[#7c3aed]/40" />
      </div>
    </section>
  );
}
