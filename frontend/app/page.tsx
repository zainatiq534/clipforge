import { Features } from "@/components/Features";
import { FloatingClips } from "@/components/FloatingClips";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { TrustedBy } from "@/components/TrustedBy";
import { BackgroundImage } from "@/components/ui/Image";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col overflow-x-clip">
      <div className="relative flex min-h-dvh flex-col overflow-x-clip">
        <div className="absolute inset-0 overflow-hidden" aria-hidden>
          <BackgroundImage src="/hero-bg.jpg" />
        </div>
        <FloatingClips />

        <div className="relative z-10 flex min-h-dvh flex-col">
          <Header />
          <Hero />
        </div>
      </div>

      <TrustedBy />
      <HowItWorks />
      <Features />
    </div>
  );
}
