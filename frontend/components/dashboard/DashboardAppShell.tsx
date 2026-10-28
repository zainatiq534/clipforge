"use client";

import { Menu, X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { DashboardMotion } from "@/components/dashboard/DashboardMotion";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

type DashboardAppShellProps = {
  children: ReactNode;
};

export function DashboardAppShell({ children }: DashboardAppShellProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="flex min-h-dvh w-full flex-col bg-white text-[#1a1a1f]">
      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-[#efeaf8] bg-white/95 px-3 py-2.5 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#f5f0ff] text-[#7c3aed]"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <p className="font-sans text-[13px] font-bold text-[#1a1a1f]">ClipForge</p>
        <span className="w-10" aria-hidden />
      </div>

      <div className="flex w-full flex-1 items-stretch gap-3 p-3 sm:gap-4 sm:p-4">
        {/* Desktop sidebar */}
        <DashboardMotion
          direction="left"
          delay={0.05}
          className="hidden self-stretch lg:block"
        >
          <DashboardSidebar />
        </DashboardMotion>

        {/* Mobile drawer */}
        {open ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-[#050814]/40"
              aria-label="Close menu overlay"
              onClick={() => setOpen(false)}
            />
            <div className="absolute top-3 bottom-3 left-3 flex w-[72px] flex-col">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mb-2 inline-flex h-9 w-9 self-end items-center justify-center rounded-full bg-white text-[#1a1a1f] shadow"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
              <div className="min-h-0 flex-1" onClick={() => setOpen(false)}>
                <DashboardSidebar />
              </div>
            </div>
          </div>
        ) : null}

        <div className="min-w-0 flex-1 overflow-x-hidden pb-2 sm:pb-4">{children}</div>
      </div>
    </div>
  );
}
