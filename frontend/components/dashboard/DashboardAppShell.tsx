"use client";

import type { ReactNode } from "react";
import { DashboardMotion } from "@/components/dashboard/DashboardMotion";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

type DashboardAppShellProps = {
  children: ReactNode;
};

export function DashboardAppShell({ children }: DashboardAppShellProps) {
  return (
    <div className="min-h-dvh w-full bg-white text-[#1a1a1f]">
      <div className="flex min-h-dvh w-full items-stretch gap-3 p-3 sm:gap-4 sm:p-4">
        <DashboardMotion direction="left" delay={0.05} className="self-stretch">
          <DashboardSidebar />
        </DashboardMotion>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
