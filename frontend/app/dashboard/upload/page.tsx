import type { Metadata } from "next";
import { UploadPage } from "@/components/dashboard/pages/UploadPage";

export const metadata: Metadata = {
  title: "Upload — ClipForge",
  description: "Upload long-form video to ClipForge",
};

export default function Page() {
  return <UploadPage />;
}
