import type { Metadata } from "next";
import { CaptionsFeature } from "@/components/CaptionsFeature";
import { Features } from "@/components/Features";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { AiEngineFeature } from "@/components/AiEngineFeature";
import { PlatformFeature } from "@/components/PlatformFeature";
import { ReframeFeature } from "@/components/ReframeFeature";
import { SoftContinuousBackground } from "@/components/SoftContinuousBackground";
import { BackgroundImage } from "@/components/ui/Image";
import { SOFT_PAGE_BASE } from "@/lib/softPageBg";

export const metadata: Metadata = {
  title: "Features — ClipForge",
  description:
    "AI-powered smart clipping: find hooks, rank viral scores, and auto-cut short-form clips with ClipForge.",
};

export default function FeaturesPage() {
  return (
    <>
      {/* Home hero — dark theme */}
      <div className="relative flex min-h-screen flex-1 flex-col overflow-hidden">
        <BackgroundImage src="/hero-bg.jpg" />

        <div className="relative z-10 flex min-h-screen flex-1 flex-col">
          <Header />
          <Hero />
        </div>
      </div>

      {/* One continuous light canvas — no per-section opaque washes / seams */}
      <div className="relative" style={{ background: SOFT_PAGE_BASE }}>
        <SoftContinuousBackground />

        <div className="relative z-10 flex flex-col">
          <Features />
          <CaptionsFeature />
          <ReframeFeature />
          <PlatformFeature />
          <AiEngineFeature />
        </div>
      </div>
    </>
  );
}
