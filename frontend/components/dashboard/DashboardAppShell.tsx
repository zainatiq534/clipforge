"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { DashboardMobileNav } from "@/components/dashboard/DashboardMobileNav";
import { DashboardMotion } from "@/components/dashboard/DashboardMotion";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { cn } from "@/lib/cn";

type DashboardAppShellProps = {
  children: ReactNode;
};

export function DashboardAppShell({ children }: DashboardAppShellProps) {
  const pathname = usePathname();
  const isEditor = pathname?.startsWith("/dashboard/editor");
  const isSettings = pathname?.startsWith("/dashboard/settings");

  if (isEditor) {
    return (
      <div className="flex h-dvh w-full flex-col overflow-hidden bg-[#f7f5fc] text-[#1a1a1f] md:flex-row">
        <DashboardMotion
          direction="left"
          delay={0.02}
          className="hidden h-full shrink-0 self-stretch p-2 md:block"
        >
          <DashboardSidebar />
        </DashboardMotion>
        <div className="min-h-0 min-w-0 flex-1 overflow-hidden p-2 pb-[calc(4.25rem+env(safe-area-inset-bottom))] md:pb-2">
          {children}
        </div>
        <DashboardMobileNav />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative min-h-dvh w-full text-[#1a1a1f]",
        !isSettings && "bg-white",
      )}
    >
      {isSettings ? (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        >
          <img
            src="/settings-atmosphere.jpg"
            alt=""
            className="h-full w-full object-cover object-center"
          />
        </div>
      ) : null}

      <div
        className={cn(
          "relative z-10 flex min-h-dvh w-full items-start gap-2 sm:gap-3 md:gap-4",
          "p-2 pb-[calc(4.5rem+env(safe-area-inset-bottom))] sm:p-3 md:p-4 md:pb-4",
        )}
      >
        <DashboardMotion
          direction="left"
          delay={0.05}
          className="sticky top-3 z-20 hidden h-[calc(100dvh-1.5rem)] shrink-0 self-start sm:top-4 sm:h-[calc(100dvh-2rem)] md:block [&>*]:h-full"
        >
          <DashboardSidebar />
        </DashboardMotion>
        <div
          className={cn(
            "min-w-0 flex-1 overflow-x-hidden",
            isSettings && "bg-transparent",
          )}
        >
          {children}
        </div>
      </div>

      <DashboardMobileNav />
    </div>
  );
}
