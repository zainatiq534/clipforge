import type { Metadata } from "next";
import { CaptionsFeature } from "@/components/CaptionsFeature";
import { Features } from "@/components/Features";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { AiEngineFeature } from "@/components/AiEngineFeature";
import { PlatformFeature } from "@/components/PlatformFeature";
import { ReframeFeature } from "@/components/ReframeFeature";
import { SoftAuraBackground } from "@/components/SoftAuraBackground";
import { BackgroundImage } from "@/components/ui/Image";

export const metadata: Metadata = {
  title: "Features — ClipForge",
  description:
    "AI-powered smart clipping: find hooks, rank viral scores, and auto-cut short-form clips with ClipForge.",
};

export default function FeaturesPage() {
  return (
    <>
      {/* Home hero — previous hero-bg theme */}
      <div className="relative flex min-h-screen flex-1 flex-col overflow-hidden">
        <BackgroundImage src="/hero-bg.jpg" />

        <div className="relative z-10 flex min-h-screen flex-1 flex-col">
          <Header />
          <Hero />
        </div>
      </div>

      {/* Features — smart clipping */}
      <div className="relative flex flex-col overflow-hidden">
        <SoftAuraBackground />

        <div className="relative z-10 flex flex-col">
          <Features />
        </div>
      </div>

      {/* Captions section */}
      <CaptionsFeature />

      {/* Smart Video Reframing */}
      <ReframeFeature />

      {/* Multi-Platform Video Optimization */}
      <PlatformFeature />

      {/* ClipForge AI Engine — background theme only */}
      <AiEngineFeature />
    </>
  );
}
