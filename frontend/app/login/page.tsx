import type { Metadata } from "next";
import { BarChart3, Bolt, Zap } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { AppImage } from "@/components/ui/Image";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Sign in — ClipForge AI",
  description: "Sign in to your ClipForge workspace and keep creating scroll-stopping clips.",
};

const avatars = [
  "/features/avatar-1.jpg",
  "/features/avatar-2.jpg",
  "/features/avatar-3.jpg",
];

export default function LoginPage() {
  return (
    <div className="relative isolate min-h-screen bg-[#fbf9ff] text-[#171126]">
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse at 8% 0%, rgba(196,160,255,0.22), transparent 42%), radial-gradient(ellipse at 92% 100%, rgba(167,139,250,0.18), transparent 40%), #fbf9ff",
        }}
      />

      <div className="relative z-10 flex min-h-screen flex-col pt-20">
        <main className="mx-auto grid w-[min(1040px,calc(100%-2rem))] flex-1 grid-cols-1 items-center gap-10 py-6 sm:py-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 xl:gap-16">
          {/* Left — brand / value */}
          <section className="max-w-[480px]" aria-labelledby="intro-title">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#efe6ff] px-3 py-1.5 font-sans text-[10px] font-extrabold tracking-[0.08em] text-[#7c3aed] uppercase">
              <Zap className="h-3 w-3" strokeWidth={2.4} aria-hidden fill="currentColor" />
              Welcome back
            </div>

            <h1
              id="intro-title"
              className="mt-5 font-display text-[clamp(2.1rem,4.2vw,3.15rem)] leading-[1.08] font-black tracking-[-0.045em] text-[#171126]"
            >
              Log in to
              <br />
              <span className="bg-gradient-to-r from-[#8b5cf6] via-[#7c3aed] to-[#4f46e5] bg-clip-text text-transparent">
                your ClipForge
              </span>
            </h1>

            <p className="mt-4 max-w-[400px] font-sans text-[15px] leading-[1.7] text-[#5b5568]">
              Pick up where you left off and turn your long videos into
              viral-ready short clips.
            </p>

            <ul className="mt-7 space-y-4">
              <li className="flex items-start gap-3">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#efe6ff] text-[#7c3aed]">
                  <Bolt className="h-4 w-4" strokeWidth={2.2} aria-hidden />
                </span>
                <div>
                  <p className="font-sans text-[14px] font-bold text-[#171126]">
                    Find hooks instantly
                  </p>
                  <p className="mt-0.5 font-sans text-[13px] text-[#6e687b]">
                    AI detects your best moments.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#efe6ff] text-[#7c3aed]">
                  <BarChart3 className="h-4 w-4" strokeWidth={2.2} aria-hidden />
                </span>
                <div>
                  <p className="font-sans text-[14px] font-bold text-[#171126]">
                    Rank by viral potential
                  </p>
                  <p className="mt-0.5 font-sans text-[13px] text-[#6e687b]">
                    An AI score for every moment.
                  </p>
                </div>
              </li>
            </ul>

            <div className="mt-8 flex items-center gap-3">
              <div className="flex items-center">
                {avatars.map((src, i) => (
                  <span
                    key={src}
                    className={cn(
                      "relative h-9 w-9 overflow-hidden rounded-full border-2 border-white",
                      i > 0 && "-ml-2.5",
                    )}
                  >
                    <AppImage src={src} alt="" fill className="object-cover" sizes="36px" />
                  </span>
                ))}
                <span className="-ml-2.5 inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#7c3aed] text-[0.58rem] font-bold text-white">
                  +10K
                </span>
              </div>
              <p className="font-sans text-[13px] font-medium text-[#6e687b]">
                Trusted by 10,000+ creators
              </p>
            </div>
          </section>

          {/* Right — sign in card */}
          <div id="create-account" className="mx-auto w-full max-w-[420px] lg:mx-0 lg:justify-self-end">
            <LoginForm />
          </div>
        </main>
      </div>
    </div>
  );
}
