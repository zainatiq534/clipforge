import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { HowItWorksHero } from "@/components/how-it-works/HowItWorksHero";
import { HowItWorks } from "@/components/HowItWorks";

export const metadata: Metadata = {
  title: "How It Works — ClipForge",
  description:
    "See how ClipForge turns long videos into viral-ready clips in minutes with AI.",
};

export default function HowItWorksPage() {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-clip bg-[#faf9fc] text-[#111827]">
      {/* Soft purple glow atmosphere */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute -top-24 -left-20 h-[28rem] w-[28rem] rounded-full opacity-70 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(196,181,253,0.55) 0%, rgba(237,233,254,0.2) 55%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-[18%] right-[-8%] h-[32rem] w-[32rem] rounded-full opacity-80 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(167,139,250,0.35) 0%, rgba(221,214,254,0.25) 45%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-[-10%] left-[20%] h-[24rem] w-[40rem] rounded-full opacity-60 blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse, rgba(233,213,255,0.5) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-dvh flex-col">
        <Header tone="light" />
        <HowItWorksHero />
        <HowItWorks />
      </div>
    </div>
  );
}
