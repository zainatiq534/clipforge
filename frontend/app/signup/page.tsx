import type { Metadata } from "next";
import { Clapperboard, ShieldCheck, Sparkles, Star } from "lucide-react";
import {
  LOGIN_VIDEO_BOTTOM,
  LOGIN_VIDEO_TOP,
  LoginClipCard,
} from "@/components/auth/LoginClipVideos";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Get Started — ClipForge AI",
  description: "Create your ClipForge account and start making scroll-stopping clips.",
};

export default function SignupPage() {
  return (
    <div className="relative isolate min-h-screen bg-[#fbf9ff] text-[#171126]">
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse at 12% 10%, rgba(196,160,255,0.28), transparent 34%), radial-gradient(ellipse at 88% 82%, rgba(223,202,255,0.4), transparent 33%), #fbf9ff",
        }}
      />
      <div
        className="pointer-events-none fixed -top-[200px] -right-[80px] -z-10 h-[340px] w-[340px] rounded-full border border-[rgba(151,91,255,0.12)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed -bottom-[220px] -left-[100px] -z-10 h-[400px] w-[400px] rounded-full border border-[rgba(151,91,255,0.12)]"
        aria-hidden
      />

      <div className="relative z-10 pt-20">
        <main className="mx-auto mt-1 mb-8 grid w-[min(980px,calc(100%-2rem))] grid-cols-1 items-center gap-5 sm:mt-3 sm:mb-10 sm:w-[min(980px,calc(100%-2.5rem))] lg:grid-cols-[1fr_0.95fr] lg:gap-8">
          {/* Left: diagonal videos + text (kal wala signup layout) */}
          <section
            className="relative flex flex-col justify-center px-1 py-3 sm:py-4"
            aria-labelledby="intro-title"
          >
            <div className="relative z-20 mb-2 flex justify-start pl-1">
              <LoginClipCard
                src={LOGIN_VIDEO_TOP}
                label="Clip preview 1"
                rotate="-rotate-[7deg]"
                badgeStart={0}
              />
            </div>

            <div className="relative z-10 max-w-[400px]">
              <div className="inline-flex items-center gap-1.5 self-start rounded-full border border-[#e6d5ff] bg-white/74 px-2.5 py-1.5 font-sans text-[10px] font-extrabold tracking-[0.08em] text-[#7c35df] uppercase">
                <Sparkles className="h-3 w-3" strokeWidth={2.2} aria-hidden />
                Your Creative Workspace
              </div>

              <h1
                id="intro-title"
                className="mt-3 max-w-[420px] font-display text-[clamp(1.85rem,3.8vw,2.55rem)] leading-[1.05] font-black tracking-[-0.05em] text-[#171126]"
              >
                Welcome back.
                <br />
                Make something{" "}
                <span className="bg-gradient-to-r from-[#9b4dff] via-[#6f2be5] to-[#c052eb] bg-clip-text text-transparent">
                  brilliant.
                </span>
              </h1>

              <p className="mt-3 max-w-[380px] font-sans text-[13.5px] leading-[1.65] text-[#6e687b]">
                Sign in to your workspace and keep turning your videos into
                scroll-stopping content. Your next great clip is just a few clicks
                away.
              </p>

              <ul className="mt-4 hidden max-w-[380px] flex-col gap-2.5 lg:flex">
                {[
                  {
                    icon: Clapperboard,
                    text: "Create clips faster with AI-powered tools",
                  },
                  {
                    icon: Star,
                    text: "Keep your projects and edits in one place",
                  },
                  {
                    icon: ShieldCheck,
                    text: "Your creative workspace, ready when you are",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <li
                      key={item.text}
                      className="flex items-center gap-2.5 font-sans text-[12.5px] font-semibold text-[#494254]"
                    >
                      <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[#f0e5ff] text-[#8538ee]">
                        <Icon className="h-3.5 w-3.5" strokeWidth={1.9} aria-hidden />
                      </span>
                      {item.text}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="relative z-20 mt-2 flex justify-end pr-1 sm:pr-4 lg:pr-6">
              <LoginClipCard
                src={LOGIN_VIDEO_BOTTOM}
                label="Clip preview 2"
                rotate="rotate-[6deg]"
                badgeStart={1}
              />
            </div>
          </section>

          <div
            id="create-account"
            className="w-full max-w-[460px] justify-self-center lg:max-w-none lg:justify-self-stretch"
          >
            <SignupForm />
          </div>
        </main>

        <footer className="pb-5 text-center font-sans text-[11px] text-[#aaa2b5]">
          © 2026 ClipForge AI · Made for creators
        </footer>
      </div>
    </div>
  );
}
