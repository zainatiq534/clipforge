import type { ReactNode } from "react";
import { AuthGate } from "@/components/auth/AuthGate";
import { DashboardAppShell } from "@/components/dashboard/DashboardAppShell";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGate>
      <DashboardAppShell>{children}</DashboardAppShell>
    </AuthGate>
  );
}
