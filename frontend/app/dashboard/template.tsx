import type { ReactNode } from "react";
import { PageEnter } from "@/components/motion/PageEnter";

/** Soft enter for dashboard route switches (sidebar / mobile nav). */
export default function DashboardTemplate({
  children,
}: {
  children: ReactNode;
}) {
  return <PageEnter tone="dashboard">{children}</PageEnter>;
}
