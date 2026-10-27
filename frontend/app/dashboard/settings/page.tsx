import type { Metadata } from "next";
import { SettingsPage } from "@/components/dashboard/pages/SettingsPage";

export const metadata: Metadata = {
  title: "Settings — ClipForge",
  description: "ClipForge workspace settings",
};

export default function Page() {
  return <SettingsPage />;
}
