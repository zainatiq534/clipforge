"use client";

import { useRouter } from "next/navigation";
import { BrandOrbs } from "@/components/dashboard/BrandOrbs";
import { GradientButton } from "@/components/ui/Button";
import type { UserProfile } from "@/lib/api";

type DashboardBannerProps = {
  user: UserProfile | null;
  clipCount: number;
  uploadCount: number;
  loading?: boolean;
};

export function DashboardBanner({
  user,
  clipCount,
  uploadCount,
  loading,
}: DashboardBannerProps) {
  const router = useRouter();
  const firstName =
    user?.displayName?.trim()?.split(/\s+/)[0] ||
    user?.email?.split("@")[0] ||
    "there";

  return (
    <section className="relative overflow-hidden rounded-[18px] bg-[#ede9fe] px-3.5 py-4 shadow-[0_10px_28px_rgba(124,58,237,0.12)] sm:rounded-[22px] sm:px-6 sm:py-6">
      <div className="relative z-10 max-w-[30rem]">
        <h1 className="font-sans text-[1.15rem] leading-[1.15] font-extrabold tracking-[-0.03em] text-[#111827] sm:text-[1.45rem]">
          Welcome back{loading ? "" : `, ${firstName}`}
        </h1>
        <p className="mt-1.5 max-w-[26rem] font-sans text-[11px] leading-relaxed text-[#5b21b6]/75 sm:text-[12px]">
          {uploadCount || clipCount
            ? `You have ${uploadCount} project${uploadCount === 1 ? "" : "s"} and ${clipCount} clip${clipCount === 1 ? "" : "s"} in your studio. Keep clipping what performs.`
            : "Upload a long-form video to create your first project and generate viral clips."}
        </p>
        <GradientButton
          size="sm"
          className="mt-4"
          onClick={() => router.push("/dashboard/upload")}
        >
          {uploadCount ? "+ New upload" : "+ Upload video"}
        </GradientButton>
      </div>

      <BrandOrbs />
    </section>
  );
}
