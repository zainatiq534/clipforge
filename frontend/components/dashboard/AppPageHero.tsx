import { BrandOrbs } from "@/components/dashboard/BrandOrbs";
import { GradientButton } from "@/components/ui/Button";

type AppPageHeroProps = {
  title: string;
  description: string;
  action?: string;
  onAction?: () => void;
};

export function AppPageHero({ title, description, action, onAction }: AppPageHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-[22px] bg-[#ede9fe] px-5 py-5 shadow-[0_10px_28px_rgba(124,58,237,0.12)] sm:px-6 sm:py-6">
      <div className="relative z-10 max-w-[32rem]">
        <h1 className="font-sans text-[1.25rem] leading-[1.15] font-extrabold tracking-[-0.03em] text-[#111827] sm:text-[1.45rem]">
          {title}
        </h1>
        <p className="mt-1.5 max-w-[28rem] font-sans text-[12px] leading-relaxed text-[#5b21b6]/75">
          {description}
        </p>
        {action ? (
          <GradientButton size="sm" className="mt-4" onClick={onAction}>
            {action}
          </GradientButton>
        ) : null}
      </div>

      <BrandOrbs />
    </section>
  );
}
