import { User } from "lucide-react";

export function BrainstormCard() {
  return (
    <section className="flex items-center gap-3 rounded-[18px] bg-gradient-to-r from-[#a78bfa] via-[#8b5cf6] to-[#3b82f6] px-4 py-3 shadow-[0_10px_28px_rgba(99,102,241,0.28)]">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-[12px] bg-white/20 text-white">
        <User className="h-4 w-4" strokeWidth={1.8} />
      </span>
      <p className="font-sans text-[12px] font-semibold text-white">
        Unleashhigh Brainstorm
      </p>
    </section>
  );
}
