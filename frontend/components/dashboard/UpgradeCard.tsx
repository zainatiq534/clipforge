import { GradientButton } from "@/components/ui/Button";

export function UpgradeCard() {
  return (
    <section className="relative overflow-hidden rounded-[22px] bg-[#ede9fe] p-3.5 shadow-[0_8px_22px_rgba(124,58,237,0.12)]">
      <h2 className="relative z-10 max-w-[9rem] font-sans text-[1.05rem] leading-snug font-extrabold text-[#111827]">
        Unleash Your Potential
      </h2>
      <GradientButton size="sm" className="relative z-10 mt-4">
        Upgrade plan
      </GradientButton>

      <div className="pointer-events-none absolute -right-3 -bottom-4 h-20 w-20" aria-hidden>
        <div className="absolute inset-0 rounded-full border-[10px] border-[#a78bfa]/55" />
        <div className="absolute inset-4 rounded-full border-[8px] border-[#8b5cf6]/45" />
        <div className="absolute inset-9 rounded-full bg-gradient-to-br from-[#8b5cf6]/40 to-[#3b82f6]/35" />
      </div>
    </section>
  );
}
