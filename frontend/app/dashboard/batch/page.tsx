import type { Metadata } from "next";
import { BatchPage } from "@/components/dashboard/pages/BatchPage";

export const metadata: Metadata = {
  title: "Batch Clips — ClipForge",
  description: "Batch process multiple videos in ClipForge",
};

export default function Page() {
  return <BatchPage />;
}
