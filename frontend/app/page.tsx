import { BeforeAfterDemo } from "@/components/BeforeAfterDemo";
import { FAQ } from "@/components/FAQ";
import { Features } from "@/components/Features";
import { FloatingClips } from "@/components/FloatingClips";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Pricing } from "@/components/Pricing";
import { Testimonials } from "@/components/Testimonials";
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

      {/* Single continuous light canvas — seamless between all sections */}
      <div className="relative w-full overflow-x-clip bg-[#faf9fc]">
        <SharedLightAtmosphere />
        <TrustedBy />
        <HowItWorks />
        <Features />
        <BeforeAfterDemo />
        <Testimonials />
        <Pricing />
        <FAQ />
      </div>
    </div>
  );
}

function SharedLightAtmosphere() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background: [
            "radial-gradient(ellipse 55% 35% at 12% 8%, rgba(243, 232, 255, 0.55) 0%, transparent 70%)",
            "radial-gradient(ellipse 50% 30% at 88% 18%, rgba(237, 233, 254, 0.45) 0%, transparent 70%)",
            "radial-gradient(ellipse 45% 28% at 80% 55%, rgba(252, 231, 243, 0.4) 0%, transparent 70%)",
            "radial-gradient(ellipse 50% 30% at 15% 72%, rgba(233, 213, 255, 0.4) 0%, transparent 70%)",
            "radial-gradient(ellipse 55% 32% at 70% 92%, rgba(245, 243, 255, 0.5) 0%, transparent 70%)",
          ].join(", "),
        }}
      />
      <div className="absolute top-[6%] left-[-6%] h-[28rem] w-[28rem] rounded-full bg-[#f3e8ff]/45 blur-[110px]" />
      <div className="absolute top-[40%] right-[-8%] h-[32rem] w-[32rem] rounded-full bg-[#ede9fe]/40 blur-[120px]" />
      <div className="absolute bottom-[8%] left-[20%] h-[26rem] w-[30rem] rounded-full bg-[#fce7f3]/35 blur-[110px]" />
    </div>
  );
}
