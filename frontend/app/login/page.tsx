import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { LoginForm } from "@/components/LoginForm";
import { LoginSideVideo } from "@/components/LoginSideVideo";
import { cloudinaryHqVideo } from "@/lib/cloudinaryVideo";

export const metadata: Metadata = {
  title: "Sign in — ClipForge AI",
  description: "Sign in to your ClipForge workspace and keep creating scroll-stopping clips.",
};

const LOGIN_VIDEO_SRC = cloudinaryHqVideo(
  "https://res.cloudinary.com/vbwjkfmd/video/upload/v1792495786/Man_speaking_into_microphone_20261020162259.mp4",
  { width: 1080 },
);

export default function LoginPage() {
  return (
    <div className="relative isolate min-h-screen bg-[#fbf9ff] text-[#171126]">
      {/* Soft lavender background — covers full viewport (no dark body strip) */}
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse at 12% 10%, rgba(196,160,255,0.32), transparent 34%), radial-gradient(ellipse at 88% 82%, rgba(223,202,255,0.46), transparent 33%), #fbf9ff",
        }}
      />
      <div
        className="pointer-events-none fixed -top-[245px] -right-[100px] -z-10 h-[420px] w-[420px] rounded-full border border-[rgba(151,91,255,0.13)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed -bottom-[300px] -left-[140px] -z-10 h-[540px] w-[540px] rounded-full border border-[rgba(151,91,255,0.13)]"
        aria-hidden
      />

      <div className="relative z-10">
        <Header tone="light" />

        <main className="mx-auto mt-2 mb-14 grid w-[min(960px,calc(100%-2rem))] grid-cols-1 items-start gap-8 sm:mt-6 sm:mb-[58px] sm:w-[min(960px,calc(100%-2.5rem))] lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-10">
          <section
            className="relative mx-auto mt-0 aspect-[9/16] w-full max-w-[300px] overflow-hidden rounded-[22px] border border-white/95 bg-[#171126] shadow-[0_18px_50px_rgba(74,37,128,0.14)] sm:max-w-[320px] lg:mt-1"
            aria-label="ClipForge preview video"
          >
            <LoginSideVideo src={LOGIN_VIDEO_SRC} />
          </section>

          <div id="create-account" className="mx-auto w-full max-w-[480px] lg:mx-0 lg:max-w-none">
            <LoginForm />
          </div>
        </main>

        <footer className="pb-6 text-center font-sans text-[11px] text-[#aaa2b5]">
          © 2026 ClipForge AI · Made for creators
        </footer>
      </div>
    </div>
  );
}
