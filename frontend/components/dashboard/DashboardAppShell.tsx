"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { DashboardMotion } from "@/components/dashboard/DashboardMotion";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { cn } from "@/lib/cn";

type DashboardAppShellProps = {
  children: ReactNode;
};

export function DashboardAppShell({ children }: DashboardAppShellProps) {
  const pathname = usePathname();
  const isEditor = pathname?.startsWith("/dashboard/editor");

  if (isEditor) {
    return (
      <div className="flex h-dvh w-full overflow-hidden bg-[#f7f5fc] text-[#1a1a1f]">
        <DashboardMotion
          direction="left"
          delay={0.02}
          className="hidden h-full shrink-0 self-stretch p-2 md:block"
        >
          <DashboardSidebar />
        </DashboardMotion>
        <div className="min-h-0 min-w-0 flex-1 overflow-hidden p-2">
          {children}
        </div>
      </div>
    );
  }

  const isSettings = pathname?.startsWith("/dashboard/settings");

  return (
    <div
      className={cn(
        "min-h-dvh w-full text-[#1a1a1f]",
        isSettings ? "bg-transparent" : "bg-white",
      )}
    >
      <div className="flex min-h-dvh w-full items-start gap-3 p-3 sm:gap-4 sm:p-4">
        <DashboardMotion
          direction="left"
          delay={0.05}
          className="sticky top-3 z-20 h-[calc(100dvh-1.5rem)] shrink-0 self-start sm:top-4 sm:h-[calc(100dvh-2rem)] [&>*]:h-full"
        >
          <DashboardSidebar />
        </DashboardMotion>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
