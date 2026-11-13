import {
  Film,
  Flame,
  LayoutDashboard,
  Scissors,
  Settings,
  UploadCloud,
  type LucideIcon,
} from "lucide-react";

export type DashboardNavItem = {
  key: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  href: string;
};

export const DASHBOARD_NAV: DashboardNavItem[] = [
  {
    key: "home",
    label: "Home",
    shortLabel: "Home",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    key: "upload",
    label: "Upload",
    shortLabel: "Upload",
    icon: UploadCloud,
    href: "/dashboard/upload",
  },
  {
    key: "projects",
    label: "Projects",
    shortLabel: "Projects",
    icon: Film,
    href: "/dashboard/projects",
  },
  {
    key: "viral",
    label: "Viral Score",
    shortLabel: "Viral",
    icon: Flame,
    href: "/dashboard/viral",
  },
  {
    key: "editor",
    label: "Clip Editor",
    shortLabel: "Editor",
    icon: Scissors,
    href: "/dashboard/editor",
  },
  {
    key: "settings",
    label: "Settings",
    shortLabel: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
];

export function isDashboardNavActive(pathname: string, href: string) {
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}
