import { BrandOrbs } from "@/components/dashboard/BrandOrbs";
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

      <BrandOrbs />
    </section>
  );
}
