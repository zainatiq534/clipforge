"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import {
  DASHBOARD_NAV,
  isDashboardNavActive,
} from "@/components/dashboard/dashboardNav";
import { logout } from "@/lib/auth";
import { cn } from "@/lib/cn";

/** Fixed bottom navigation for phones / small tablets. */
export function DashboardMobileNav() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[#ddd6fe]/80 bg-white/95 px-1 pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-1 shadow-[0_-10px_30px_rgba(76,29,149,0.1)] backdrop-blur-xl md:hidden"
      aria-label="Dashboard mobile"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-between gap-0.5">
        {DASHBOARD_NAV.map((item) => {
          const Icon = item.icon;
          const active = isDashboardNavActive(pathname, item.href);
          return (
            <Link
              key={item.key}
              href={item.href}
              prefetch
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              onMouseEnter={() => router.prefetch(item.href)}
              onTouchStart={() => router.prefetch(item.href)}
              className={cn(
                "flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-[14px] px-1 py-1.5 transition-colors duration-150 active:scale-[0.97]",
                active
                  ? "bg-gradient-to-br from-[#ede9fe] to-[#dbeafe] text-[#6d28d9]"
                  : "text-[#7a738c] hover:text-[#111827]",
              )}
            >
              <Icon className="h-[17px] w-[17px] shrink-0" strokeWidth={1.8} />
              <span className="w-full truncate text-center font-sans text-[9px] font-semibold leading-tight">
                {item.shortLabel}
              </span>
            </Link>
          );
        })}
        <button
          type="button"
          aria-label="Log out"
          onClick={() => {
            void (async () => {
              try {
                await logout();
              } finally {
                router.replace("/login");
              }
            })();
          }}
          className="flex min-w-0 flex-[0.85] flex-col items-center gap-0.5 rounded-[14px] px-1 py-1.5 text-[#7a738c] transition-colors hover:text-[#111827]"
        >
          <LogOut className="h-[17px] w-[17px] shrink-0" strokeWidth={1.8} />
          <span className="w-full truncate text-center font-sans text-[9px] font-semibold leading-tight">
            Out
          </span>
        </button>
      </div>
    </nav>
  );
}
