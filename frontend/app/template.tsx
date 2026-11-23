"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { PageEnter } from "@/components/motion/PageEnter";

/**
 * Soft enter for marketing + auth. Dashboard has its own template —
 * skip here so we never double-animate app navigations.
 */
export default function RootTemplate({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/";
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
    return <>{children}</>;
  }
  return <PageEnter tone="site">{children}</PageEnter>;
}
