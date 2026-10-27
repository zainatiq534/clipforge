import type { Metadata } from "next";
import { ViralPage } from "@/components/dashboard/pages/ViralPage";

export const metadata: Metadata = {
  title: "Viral Score — ClipForge",
  description: "AI viral score ranking for your clips",
};

export default function Page() {
  return <ViralPage />;
}
