import type { Metadata } from "next";
import { CaptionsPage } from "@/components/dashboard/pages/CaptionsPage";

export const metadata: Metadata = {
  title: "Captions — ClipForge",
  description: "Edit auto-generated captions in ClipForge",
};

export default function Page() {
  return <CaptionsPage />;
}
