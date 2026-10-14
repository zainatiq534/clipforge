import type { Metadata } from "next";
import { Features } from "@/components/Features";
import { Header } from "@/components/Header";
import { BackgroundImage } from "@/components/ui/Image";

export const metadata: Metadata = {
  title: "Features — ClipForge",
  description:
    "AI-powered smart clipping: find hooks, rank viral scores, and auto-cut short-form clips with ClipForge.",
};

export default function FeaturesPage() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <BackgroundImage src="/hero-bg.jpg" />

      <div className="relative z-10 flex min-h-full flex-1 flex-col">
        <Header />
        <Features />
      </div>
    </div>
  );
}
