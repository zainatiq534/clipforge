import type { Metadata } from "next";
import { Suspense } from "react";
import { SettingsPage } from "@/components/dashboard/pages/SettingsPage";

export const metadata: Metadata = {
  title: "Settings — ClipForge",
  description: "ClipForge workspace settings",
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center font-sans text-sm text-[#6b21a8]">
          Loading settings…
        </div>
      }
    >
      <SettingsPage />
    </Suspense>
  );
}
