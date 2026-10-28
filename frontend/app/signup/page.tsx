import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { SignupScatterVideos } from "@/components/auth/SignupScatterVideos";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Get Started — ClipForge AI",
  description: "Create your ClipForge account and start making scroll-stopping clips.",
};

export default function SignupPage() {
  return (
    <div className="relative isolate min-h-dvh w-full bg-[#fbf9ff] text-[#171126]">
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[#fbf9ff]"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse at 12% 10%, rgba(196,160,255,0.28), transparent 34%), radial-gradient(ellipse at 88% 82%, rgba(223,202,255,0.4), transparent 33%), #fbf9ff",
        }}
      />
      <div className="relative z-10 flex min-h-dvh w-full flex-col pt-16 pb-5 sm:pt-[4.5rem] lg:pt-20">
        <main className="grid w-full flex-1 grid-cols-1 content-start items-start gap-8 px-4 pt-2 sm:gap-10 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:px-12 lg:pt-4 xl:px-16">
          {/* Extra margin so outside videos have room; block nudged right */}
          <section
            className="relative w-full overflow-visible pt-16 pb-[7rem] pl-4 pr-2 sm:pt-20 sm:pb-32 sm:pl-8 lg:pt-14 lg:pl-12 lg:pr-4 xl:pl-16"
            aria-labelledby="intro-title"
          >
            {/* Tight wrap around text — videos position against THIS box only */}
            <div className="relative ml-auto w-fit max-w-[min(100%,420px)] -translate-y-3 overflow-visible sm:max-w-[460px] sm:-translate-y-5 lg:mr-2 lg:-translate-y-6 xl:mr-6">
              <SignupScatterVideos />

              <div className="relative z-30 flex flex-col items-center bg-transparent px-5 py-4 text-center sm:px-7 sm:py-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#e6d5ff] bg-white/90 px-3.5 py-1.5 font-sans text-[12px] font-extrabold tracking-[0.08em] text-[#7c35df] uppercase sm:text-[13px]">
                  <Sparkles className="h-3.5 w-3.5" strokeWidth={2.2} aria-hidden />
                  Your Creative Workspace
                </div>

                <h1
                  id="intro-title"
                  className="mt-3.5 font-display text-[clamp(2.55rem,5vw,3.75rem)] leading-[1.04] font-black tracking-[-0.045em] text-[#171126]"
                >
                  Welcome back.
                  <br />
                  <span className="whitespace-nowrap">Make something</span>
                  <br />
                  <span className="bg-gradient-to-r from-[#9b4dff] via-[#6f2be5] to-[#c052eb] bg-clip-text text-transparent">
                    brilliant.
                  </span>
                </h1>
              </div>
            </div>
          </section>

          <div
            id="create-account"
            className="w-full max-w-[520px] justify-self-center lg:max-w-[480px] lg:justify-self-end xl:mr-4"
          >
            <SignupForm compact />
          </div>
        </main>
      </div>
    </div>
  );
}
