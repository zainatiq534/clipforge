import type { Metadata } from "next";
import { Zap } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupScatterVideos } from "@/components/auth/SignupScatterVideos";

export const metadata: Metadata = {
  title: "Sign in — ClipForge AI",
  description: "Sign in to your ClipForge workspace and keep creating scroll-stopping clips.",
};

export default function LoginPage() {
  return (
    <div className="relative isolate min-h-dvh w-full bg-[#fbf9ff] text-[#171126]">
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-[#fbf9ff]"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse at 8% 0%, rgba(196,160,255,0.22), transparent 42%), radial-gradient(ellipse at 92% 100%, rgba(167,139,250,0.18), transparent 40%), #fbf9ff",
        }}
      />

      <div className="relative z-10 flex min-h-dvh w-full flex-col pt-16 pb-5 sm:pt-[4.5rem] lg:pt-20">
        <main className="grid w-full flex-1 grid-cols-1 content-start items-start gap-8 px-4 pt-2 sm:gap-10 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-10 lg:px-12 lg:pt-4 xl:px-16">
          {/* Left — login form */}
          <div
            id="create-account"
            className="order-2 w-full max-w-[520px] justify-self-center lg:order-1 lg:max-w-[480px] lg:justify-self-start xl:ml-4"
          >
            <LoginForm />
          </div>

          {/* Right — bigger text + 4 videos outside corners */}
          <section
            className="relative order-1 w-full overflow-visible pt-20 pb-[8rem] pl-2 pr-4 sm:pt-24 sm:pb-36 sm:pr-10 lg:order-2 lg:pt-16 lg:pr-14 lg:pl-6 xl:pr-20"
            aria-labelledby="intro-title"
          >
            <div className="relative mx-auto w-fit min-w-[min(100%,22rem)] max-w-[min(100%,34rem)] overflow-visible sm:min-w-[26rem] lg:mx-0 lg:ml-4 xl:ml-8">
              <SignupScatterVideos topCloser />

              <div className="relative z-30 flex flex-col items-center overflow-visible bg-transparent px-3 py-4 text-center sm:px-5 sm:py-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#e6d5ff] bg-white/90 px-3.5 py-1.5 font-sans text-[12px] font-extrabold tracking-[0.08em] text-[#7c35df] uppercase sm:px-4 sm:text-[13px]">
                  <Zap
                    className="h-3.5 w-3.5"
                    strokeWidth={2.4}
                    aria-hidden
                    fill="currentColor"
                  />
                  Welcome back
                </div>

                <h1
                  id="intro-title"
                  className="mt-4 overflow-visible font-display text-[clamp(2.75rem,5.2vw,4.1rem)] leading-[1.08] font-black tracking-[-0.04em] text-[#171126]"
                >
                  <span className="block">Log in to</span>
                  <span className="mt-1 inline-block overflow-visible pr-2 pb-1 whitespace-nowrap bg-gradient-to-r from-[#8b5cf6] via-[#7c3aed] to-[#4f46e5] bg-clip-text text-transparent">
                     ClipForge
                  </span>
                </h1>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
