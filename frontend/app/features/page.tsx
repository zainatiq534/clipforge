import type { Metadata } from "next";
import { CaptionsFeature } from "@/components/CaptionsFeature";
import { Features } from "@/components/Features";
import { FeaturesLightCanvas } from "@/components/FeaturesLightCanvas";
import { FeaturesMotion } from "@/components/FeaturesMotion";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HeroMotion } from "@/components/HeroMotion";
import { AiEngineFeature } from "@/components/AiEngineFeature";
import { EditingExportFeature } from "@/components/EditingExportFeature";
import { PlatformFeature } from "@/components/PlatformFeature";
import { ReframeFeature } from "@/components/ReframeFeature";
import { BackgroundImage } from "@/components/ui/Image";

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
          <HeroMotion>
            <Hero />
          </HeroMotion>
        </div>
      </div>

      <FeaturesLightCanvas>
        <FeaturesMotion direction="up">
          <Features />
        </FeaturesMotion>
        <FeaturesMotion direction="left">
          <CaptionsFeature />
        </FeaturesMotion>
        <FeaturesMotion direction="right">
          <ReframeFeature />
        </FeaturesMotion>
        <FeaturesMotion direction="scale">
          <PlatformFeature />
        </FeaturesMotion>
        <FeaturesMotion direction="left">
          <AiEngineFeature />
        </FeaturesMotion>
        <FeaturesMotion direction="up">
          <EditingExportFeature />
        </FeaturesMotion>
      </FeaturesLightCanvas>
    </>
  );
}
