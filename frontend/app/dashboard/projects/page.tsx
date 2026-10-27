import type { Metadata } from "next";
import { ProjectsPage } from "@/components/dashboard/pages/ProjectsPage";

export const metadata: Metadata = {
  title: "Projects — ClipForge",
  description: "ClipForge projects and videos",
};

export default function Page() {
  return <ProjectsPage />;
}
