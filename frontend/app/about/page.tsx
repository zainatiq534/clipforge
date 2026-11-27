import type { Metadata } from "next";
import { AboutPage } from "@/components/about/AboutPage";

export const metadata: Metadata = {
  title: "About Us — ClipForge",
  description:
    "Learn about ClipForge — the AI studio that turns long videos into viral-ready clips for TikTok, Reels, and Shorts.",
};

export default function Page() {
  return <AboutPage />;
}
