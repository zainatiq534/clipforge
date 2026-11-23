"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

type PageEnterProps = {
  children: ReactNode;
  className?: string;
  /** Softer enter for dense dashboard pages */
  tone?: "site" | "dashboard";
};

/**
 * Lightweight route enter — GPU opacity/transform only.
 * Dashboard must keep `h-full min-h-0` so editor / full-height shells
 * still get a bounded height (otherwise overflow-y never activates).
 */
export function PageEnter({
  children,
  className,
  tone = "site",
}: PageEnterProps) {
  const pathname = usePathname() || "/";
  const isEditor =
    pathname === "/dashboard/editor" ||
    pathname.startsWith("/dashboard/editor/");

  // Editor is a fixed h-dvh workspace — no enter animation / transform
  // (transform would break nested overflow scrolling).
  if (tone === "dashboard" && isEditor) {
    return (
      <div className={cn("h-full min-h-0", className)}>{children}</div>
    );
  }

  return (
    <div
      className={cn(
        tone === "dashboard"
          ? "cf-page-enter-dashboard h-full min-h-0"
          : "cf-page-enter",
        className,
      )}
    >
      {children}
    </div>
  );
}
