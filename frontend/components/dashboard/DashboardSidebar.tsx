"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  DASHBOARD_NAV,
  isDashboardNavActive,
} from "@/components/dashboard/dashboardNav";
import { AppImage } from "@/components/ui/Image";
import { logout } from "@/lib/auth";
import { cn } from "@/lib/cn";

const SIDEBAR_EXPANDED_KEY = "clipforge.sidebarExpanded";

function GlassHover({
  active,
  rounded,
}: {
  active: boolean;
  rounded: string;
}) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute inset-0 z-0 transition-colors duration-150",
        rounded,
        "border border-white/30 bg-white/[0.14] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_8px_22px_rgba(0,0,0,0.28)]",
        active && "border-white/40 bg-white/[0.18]",
      )}
    />
  );
}

export function DashboardSidebar({ dark = false }: { dark?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    try {
      setExpanded(localStorage.getItem(SIDEBAR_EXPANDED_KEY) === "1");
    } catch {
      /* ignore */
    }
  }, []);

  const toggleExpanded = () => {
    setExpanded((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_EXPANDED_KEY, next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const itemRounded = expanded ? "rounded-[14px]" : "rounded-full";

  return (
    <aside
      className={cn(
        "flex h-full flex-col overflow-hidden py-4 transition-[width] duration-150 ease-out",
        expanded ? "w-[200px] items-stretch px-3" : "w-[64px] items-center px-0",
        dark
          ? "rounded-[10px] border border-[#232326] bg-[#101011]"
          : "rounded-[24px] bg-[#1a1a1f] shadow-[0_14px_32px_rgba(15,15,25,0.16)]",
      )}
    >
      <button
        type="button"
        onClick={toggleExpanded}
        className={cn(
          "relative mb-5 flex shrink-0 items-center overflow-hidden rounded-xl transition-colors",
          expanded ? "h-10 w-full gap-2.5 px-1.5 hover:bg-white/5" : "h-9 w-9",
          !expanded && (dark ? "bg-[#d5fb74]" : "bg-[#7c3aed]"),
        )}
        aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
        aria-expanded={expanded}
        title={expanded ? "Collapse menu" : "Expand menu"}
      >
        <span
          className={cn(
            "relative block h-9 w-9 shrink-0 overflow-hidden rounded-xl",
            dark ? "bg-[#d5fb74]" : "bg-[#7c3aed]",
          )}
        >
          <AppImage
            src="/clipforge-icon.png"
            alt=""
            width={36}
            height={36}
            className="h-full w-full object-cover"
          />
        </span>
        {expanded ? (
          <span className="truncate font-sans text-[13px] font-bold tracking-tight text-white">
            ClipForge
          </span>
        ) : null}
      </button>

      <nav
        className={cn(
          "flex min-h-0 flex-1 flex-col justify-between overflow-hidden py-2",
          expanded ? "items-stretch" : "items-center",
        )}
        aria-label="Dashboard"
        onMouseLeave={() => setHovered(null)}
      >
        {DASHBOARD_NAV.map((item) => {
          const Icon = item.icon;
          const active = isDashboardNavActive(pathname, item.href);
          const isHovered = hovered === item.key;

          return (
            <Link
              key={item.key}
              href={item.href}
              prefetch
              title={item.label}
              aria-label={item.label}
              onMouseEnter={() => {
                setHovered(item.key);
                router.prefetch(item.href);
              }}
              onFocus={() => setHovered(item.key)}
              className={cn(
                "relative inline-flex h-10 shrink-0 items-center transition-colors duration-150",
                expanded ? "w-full gap-3 px-2.5" : "w-10 justify-center",
                itemRounded,
                active || isHovered ? "text-white" : "text-white/55",
              )}
              aria-current={active ? "page" : undefined}
            >
              {active ? (
                <span
                  className={cn(
                    "absolute inset-0 z-0",
                    itemRounded,
                    dark
                      ? "bg-[#17171a] shadow-[inset_0_0_0_1px_#2f2f34]"
                      : "bg-gradient-to-br from-[#a78bfa] via-[#8b5cf6] to-[#3b82f6] shadow-[0_0_0_3px_rgba(139,92,246,0.22)]",
                  )}
                />
              ) : null}

              {isHovered ? (
                <GlassHover active={active} rounded={itemRounded} />
              ) : null}

              <span
                className={cn(
                  "relative z-10 inline-flex items-center gap-3 transition-transform duration-150",
                  isHovered && "scale-[1.04]",
                )}
              >
                <Icon className="h-[17px] w-[17px] shrink-0" strokeWidth={1.7} />
                {expanded ? (
                  <span className="truncate font-sans text-[12px] font-semibold">
                    {item.label}
                  </span>
                ) : null}
              </span>
            </Link>
          );
        })}

        <button
          type="button"
          onMouseEnter={() => setHovered("logout")}
          onFocus={() => setHovered("logout")}
          onClick={() => {
            void (async () => {
              try {
                await logout();
              } finally {
                router.replace("/login");
              }
            })();
          }}
          className={cn(
            "relative inline-flex h-10 shrink-0 items-center transition-colors duration-150",
            expanded ? "w-full gap-3 px-2.5" : "w-10 justify-center",
            itemRounded,
            hovered === "logout" ? "text-white" : "text-white/55",
          )}
          aria-label="Log out"
          title="Log out"
        >
          {hovered === "logout" ? (
            <GlassHover active={false} rounded={itemRounded} />
          ) : null}
          <span
            className={cn(
              "relative z-10 inline-flex items-center gap-3 transition-transform duration-150",
              hovered === "logout" && "scale-[1.04]",
            )}
          >
            <LogOut className="h-[17px] w-[17px] shrink-0" strokeWidth={1.7} />
            {expanded ? (
              <span className="truncate font-sans text-[12px] font-semibold">
                Log out
              </span>
            ) : null}
          </span>
        </button>
      </nav>
    </aside>
  );
}
