"use client";

import {
  Crop,
  Film,
  Flame,
  Layers,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  Scissors,
  Settings,
  UploadCloud,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AppImage } from "@/components/ui/Image";
import { cn } from "@/lib/cn";

const navItems = [
  { key: "home", label: "Home / Overview", icon: LayoutDashboard, href: "/dashboard" },
  { key: "upload", label: "Upload Video", icon: UploadCloud, href: "/dashboard/upload" },
  { key: "projects", label: "Projects / Videos", icon: Film, href: "/dashboard/projects" },
  { key: "viral", label: "Viral Score Ranking", icon: Flame, href: "/dashboard/viral" },
  { key: "editor", label: "Clip Editor", icon: Scissors, href: "/dashboard/editor" },
  {
    key: "captions",
    label: "Captions Editor",
    icon: MessageSquareText,
    href: "/dashboard/captions",
  },
  { key: "reframe", label: "AI Reframe (9:16)", icon: Crop, href: "/dashboard/reframe" },
  { key: "batch", label: "Batch Clips", icon: Layers, href: "/dashboard/batch" },
  { key: "settings", label: "Settings", icon: Settings, href: "/dashboard/settings" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="flex h-full min-h-[calc(100dvh-5rem)] w-[64px] shrink-0 flex-col items-center rounded-[24px] bg-[#1a1a1f] py-5 shadow-[0_14px_32px_rgba(15,15,25,0.16)] lg:min-h-[calc(100dvh-2rem)]">
      <Link
        href="/"
        className="relative mb-6 block h-9 w-9 overflow-hidden rounded-xl bg-[#7c3aed]"
        aria-label="ClipForge home"
      >
        <AppImage
          src="/clipforge-icon.png"
          alt=""
          width={36}
          height={36}
          className="h-full w-full object-cover"
        />
      </Link>

      <nav className="flex flex-1 flex-col items-center justify-between gap-2 py-2" aria-label="Dashboard">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.key}
              href={item.href}
              title={item.label}
              aria-label={item.label}
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors",
                active
                  ? "bg-gradient-to-br from-[#a78bfa] via-[#8b5cf6] to-[#3b82f6] text-white shadow-[0_0_0_5px_rgba(139,92,246,0.28)]"
                  : "text-white/55 hover:bg-white/10 hover:text-white",
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-[17px] w-[17px]" strokeWidth={1.7} />
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={() => router.push("/login")}
        className="mt-4 inline-flex h-10 w-10 items-center justify-center rounded-full text-white/55 transition-colors hover:bg-white/10 hover:text-white"
        aria-label="Log out"
      >
        <LogOut className="h-[17px] w-[17px]" strokeWidth={1.7} />
      </button>
    </aside>
  );
}
