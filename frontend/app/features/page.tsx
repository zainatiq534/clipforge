import type { Metadata } from "next";
import { CaptionsFeature } from "@/components/features/CaptionsFeature";
import { Features } from "@/components/features/Features";
import { FeaturesLightCanvas } from "@/components/features/FeaturesLightCanvas";
import { FeaturesMotion } from "@/components/features/FeaturesMotion";
import { Hero } from "@/components/home/Hero";
import { AiEngineFeature } from "@/components/features/AiEngineFeature";
import { EditingExportFeature } from "@/components/features/EditingExportFeature";
import { PlatformFeature } from "@/components/features/PlatformFeature";
import { ReframeFeature } from "@/components/features/ReframeFeature";
import { BackgroundImage } from "@/components/ui/Image";
import { FloatingClips } from "@/components/home/FloatingClips";

export const metadata: Metadata = {
  title: "Features — ClipForge",
  description:
    "AI-powered smart clipping: find hooks, rank viral scores, and auto-cut short-form clips with ClipForge.",
};

export default function FeaturesPage() {
  return (
    <>
      {/* Home hero — dark theme */}
      <div className="relative flex min-h-dvh flex-col overflow-x-clip">
        <div className="absolute inset-0 overflow-hidden" aria-hidden>
          <BackgroundImage src="/hero-bg.jpg" />
        </div>
        <FloatingClips />

        <div className="relative z-10 flex min-h-dvh flex-col pt-20">
          <Hero />
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
