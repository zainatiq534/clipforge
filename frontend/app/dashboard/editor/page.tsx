import type { Metadata } from "next";
import { EditorPage } from "@/components/dashboard/pages/EditorPage";

export const metadata: Metadata = {
  title: "Clip Editor — ClipForge",
  description: "Edit and polish ClipForge clips",
};

export default function Page() {
  return <EditorPage />;
}
