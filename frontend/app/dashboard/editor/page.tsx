import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { EditorLayoutSkeleton } from "@/components/dashboard/editor-layout-skeleton/EditorLayoutSkeleton";

export const metadata: Metadata = {
  title: "Clip Editor — ClipForge",
  description: "Edit and polish ClipForge clips",
};

const EditorPage = dynamic(
  () =>
    import("@/components/dashboard/pages/EditorPage").then(
      (m) => m.EditorPage,
    ),
  {
    loading: () => <EditorLayoutSkeleton />,
  },
);

export default function Page() {
  return <EditorPage />;
}
