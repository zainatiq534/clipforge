import { BrandOrbs } from "@/components/dashboard/BrandOrbs";
import { Button, GradientButton } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export type AppPageHeroAction = {
  label: string;
  onClick?: () => void;
  tone?: "primary" | "secondary";
  disabled?: boolean;
  icon?: ReactNode;
};

type AppPageHeroProps = {
  title: string;
  description: string;
  /** Single CTA (legacy). Prefer `actions` for multiple buttons. */
  action?: string;
  onAction?: () => void;
  actions?: AppPageHeroAction[];
};

export function AppPageHero({
  title,
  description,
  action,
  onAction,
  actions,
}: AppPageHeroProps) {
  const list =
    actions ??
    (action
      ? [{ label: action, onClick: onAction, tone: "primary" as const }]
      : []);

  return (
    <section className="relative overflow-hidden rounded-[18px] bg-[#ede9fe] px-3.5 py-3.5 shadow-[0_10px_28px_rgba(124,58,237,0.12)] sm:rounded-[22px] sm:px-6 sm:py-5">
      <div className="relative z-10 max-w-[40rem]">
        <h1 className="font-sans text-[1.15rem] leading-[1.15] font-extrabold tracking-[-0.03em] text-[#111827] sm:text-[1.45rem]">
          {title}
        </h1>
        <p className="mt-1.5 max-w-[32rem] font-sans text-[11px] leading-relaxed text-[#5b21b6]/75 sm:text-[12px]">
          {description}
        </p>
        {list.length ? (
          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            {list.map((item) =>
              item.tone === "secondary" ? (
                <Button
                  key={item.label}
                  size="sm"
                  variant="outlineInk"
                  disabled={item.disabled}
                  onClick={item.onClick}
                  leftIcon={item.icon}
                  className={cn(
                    "border-[#c4b5fd] bg-white/80 text-[#5b21b6] hover:bg-white hover:border-[#8b5cf6]",
                  )}
                >
                  {item.label}
                </Button>
              ) : (
                <GradientButton
                  key={item.label}
                  size="sm"
                  disabled={item.disabled}
                  onClick={item.onClick}
                  leftIcon={item.icon}
                >
                  {item.label}
                </GradientButton>
              ),
            )}
          </div>
        ) : null}
      </div>

      <BrandOrbs />
    </section>
  );
}
