import type { Metadata } from "next";
import { ReframePage } from "@/components/dashboard/pages/ReframePage";

export const metadata: Metadata = {
  title: "AI Reframe — ClipForge",
  description: "AI vertical reframe for short-form clips",
};

export default function Page() {
  return <ReframePage />;
}
