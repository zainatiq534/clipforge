"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { softPush } from "@/lib/softNavigate";
import { usePaddle } from "@/lib/usePaddle";
import { getFirebaseAuth } from "@/lib/firebase";
import { cn } from "@/lib/cn";
import type { PaidPlanId } from "@/lib/paddle-catalog";

type PricingCtaProps = {
  planId: "free" | "creator" | "team";
  label: string;
  featured?: boolean;
};

export function PricingCta({ planId, label, featured }: PricingCtaProps) {
  const router = useRouter();
  const { openCheckout, configured } = usePaddle();
  const [busy, setBusy] = useState(false);

  const classes = cn(
    "mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl font-sans text-sm font-semibold transition-colors duration-200 sm:h-[3.15rem] sm:text-[0.95rem]",
    featured
      ? "bg-[#7c3aed] text-white shadow-[0_10px_28px_rgba(124,58,237,0.35)] hover:bg-[#6d28d9]"
      : "border border-[#111827] bg-white text-[#111827] hover:bg-[#f9fafb]",
  );

  if (planId === "free") {
    return (
      <Link href="/signup" prefetch className={classes}>
        {label}
        <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
      </Link>
    );
  }

  const paidPlan: PaidPlanId = planId === "team" ? "studio" : "creator";

  return (
    <button
      type="button"
      disabled={busy}
      className={classes}
      onClick={() => {
        const user = getFirebaseAuth().currentUser;
        if (!user) {
          softPush(router, `/login?next=${encodeURIComponent("/#pricing")}`);
          return;
        }
        if (!configured) {
          softPush(router, "/dashboard/settings?tab=storage");
          return;
        }
        setBusy(true);
        const ok = openCheckout({
          plan: paidPlan,
          uid: user.uid,
          email: user.email ?? undefined,
          onCompleted: () => {
            softPush(router, "/dashboard/settings?tab=storage&paid=1");
          },
        });
        if (!ok) {
          setBusy(false);
          softPush(router, "/dashboard/settings?tab=storage");
        } else {
          window.setTimeout(() => setBusy(false), 1500);
        }
      }}
    >
      {busy ? "Opening checkout…" : label}
      <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
    </button>
  );
}
