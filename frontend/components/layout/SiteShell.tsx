"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

/** Routes whose top section is a dark hero — header uses white/muted nav. */
const DARK_HERO_ROUTES = new Set(["/", "/features", "/blog"]);

/** Light app pages under ClipForge chrome (header only, no marketing footer) */
const APP_PREFIXES = ["/dashboard"];

type SiteShellProps = {
  children: ReactNode;
};

/**
 * Global chrome: header overlays the top of the page; footer sits after content.
 * Pages should not render Header/Footer themselves.
 */
export function SiteShell({ children }: SiteShellProps) {
  const pathname = usePathname();
  const isApp = APP_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  const tone = DARK_HERO_ROUTES.has(pathname) ? "dark" : "light";

  return (
    <div className="relative flex min-h-dvh flex-col">
      {isApp ? null : (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30">
          <div className="pointer-events-auto">
            <Header tone={tone} />
          </div>
        </div>
      )}
      <div className="flex min-h-dvh flex-1 flex-col">{children}</div>
      {isApp ? null : <Footer />}
    </div>
  );
}
