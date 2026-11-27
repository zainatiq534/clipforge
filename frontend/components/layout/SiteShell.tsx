"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

/** Routes whose top section is a dark hero — header uses white/muted nav. */
const DARK_HERO_ROUTES = new Set(["/", "/features", "/blog"]);

/** App routes skip marketing chrome entirely. */
const APP_PREFIXES = ["/dashboard"];

const MARKETING_PREFETCH = [
  "/",
  "/features",
  "/how-it-works",
  "/blog",
  "/contact",
  "/about",
  "/privacy",
  "/terms",
  "/login",
  "/signup",
  "/dashboard",
  "/dashboard/upload",
  "/dashboard/projects",
  "/dashboard/viral",
];

const Header = dynamic(
  () =>
    import("@/components/layout/Header").then((m) => m.Header),
  { ssr: true },
);
const Footer = dynamic(
  () =>
    import("@/components/layout/Footer").then((m) => m.Footer),
  { ssr: true },
);

type SiteShellProps = {
  children: ReactNode;
};

/**
 * Global chrome: header overlays marketing pages only.
 * Dashboard never pays for Header/Footer render work.
 */
export function SiteShell({ children }: SiteShellProps) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const isApp = APP_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  useEffect(() => {
    for (const href of MARKETING_PREFETCH) {
      router.prefetch(href);
    }
  }, [router]);

  if (isApp) {
    return <>{children}</>;
  }

  const tone = DARK_HERO_ROUTES.has(pathname) ? "dark" : "light";

  return (
    <div className="relative flex min-h-dvh flex-col">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30">
        <div className="pointer-events-auto">
          <Header tone={tone} />
        </div>
      </div>
      <div className="flex min-h-dvh flex-1 flex-col">{children}</div>
      <Footer />
    </div>
  );
}
