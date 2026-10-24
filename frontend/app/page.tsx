import {
  ArrowRight,
  Check,
} from "lucide-react";
import { BeforeAfterDemo } from "@/components/BeforeAfterDemo";
import { FAQ } from "@/components/FAQ";
import { Features } from "@/components/Features";
import { FloatingClips } from "@/components/FloatingClips";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Pricing } from "@/components/Pricing";
import { Testimonials } from "@/components/Testimonials";
import { TrustedBy } from "@/components/TrustedBy";
import { Badge } from "@/components/ui/Badge";
import { GradientButton } from "@/components/ui/Button";
import { BackgroundImage } from "@/components/ui/Image";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

const trustItems = [
  "No credit card required",
  "Setup in seconds",
  "Join 10,000+ creators",
] as const;

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

      {/* Final CTA + Footer — dark navy matching footer mock */}
      <div className="relative w-full overflow-x-clip bg-[#07102a]">
        <section id="start" className="relative w-full bg-[#07102a]">
          {/* Image sets the height — no object-cover crop, all faces stay visible */}
          <div className="relative w-full">
            <img
              src="/cta-bg.png"
              alt=""
              width={2048}
              height={798}
              className="block h-auto w-full"
              decoding="async"
              loading="eager"
              draggable={false}
            />

            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-5 pb-6 text-center sm:px-8 sm:pb-8 lg:px-16">
              <div className="mx-auto flex w-full max-w-[34rem] flex-col items-center lg:max-w-[38rem]">
                <Reveal>
                  <Badge
                    icon={<FilledZapIcon />}
                    className="border-[#9b7bff]/40 bg-[#1a1230]/75 shadow-[0_0_24px_rgba(139,92,246,0.22)]"
                  >
                    <span className="font-sans text-[0.8rem] font-medium tracking-normal text-white normal-case sm:text-[0.85rem]">
                      Turn Ideas Into Impact
                    </span>
                  </Badge>
                </Reveal>

                <Reveal delay={0.06}>
                  <h2
                    className={cn(
                      "mt-4 max-w-3xl font-display font-bold tracking-[-0.03em] text-white sm:mt-5",
                      "text-[1.85rem] leading-[1.12] sm:text-[2.5rem] md:text-[3rem] lg:text-[3.4rem]",
                    )}
                  >
                    Your Next Great Clip
                  </h2>
                  <p
                    className={cn(
                      "mt-1 font-display font-bold tracking-[-0.03em]",
                      "bg-gradient-to-r from-[#c084fc] via-[#a78bfa] to-[#60a5fa] bg-clip-text text-transparent",
                      "text-[2rem] leading-[1.08] sm:text-[2.75rem] md:text-[3.25rem] lg:text-[3.6rem]",
                      "drop-shadow-[0_0_40px_rgba(167,139,250,0.45)]",
                    )}
                  >
                    Starts Here
                  </p>
                </Reveal>

                <Reveal delay={0.12}>
                  <p className="mt-3 max-w-lg font-sans text-sm leading-relaxed text-white/90 sm:mt-4 sm:text-base md:text-lg">
                    Join thousands of creators, marketers, and businesses turning
                    long videos into viral-ready clips with ClipForge.
                  </p>
                </Reveal>

                <Reveal delay={0.18}>
                  <GradientButton
                    size="lg"
                    href="#start"
                    leftIcon={<FilledSparklesIcon />}
                    rightIcon={<Icon icon={ArrowRight} size="md" />}
                    className="mt-5 w-full shadow-[0_12px_40px_rgba(99,102,241,0.45)] sm:mt-6 sm:w-auto"
                  >
                    Start for Free
                  </GradientButton>

                  <ul className="mt-4 flex flex-col items-center gap-2.5 sm:mt-5 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-5 sm:gap-y-2">
                    {trustItems.map((item) => (
                      <li
                        key={item}
                        className="inline-flex items-center gap-2 font-sans text-sm text-white/90 sm:text-[0.95rem]"
                      >
                        <span className="inline-flex h-4 w-4 items-center justify-center rounded-[4px] bg-[#7c3aed]">
                          <Check
                            className="h-2.5 w-2.5 text-white"
                            strokeWidth={3}
                          />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        <Footer />
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

function FilledZapIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5 sm:h-4 sm:w-4"
      aria-hidden
      fill="#b5afff"
    >
      <path d="M13.2 2.5 6.8 13.2h4.6L9.6 21.5l8.2-12.1h-4.8L13.2 2.5Z" />
    </svg>
  );
}

function FilledSparklesIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4 shrink-0 text-white"
      aria-hidden
      fill="currentColor"
    >
      {/* Main 4-point sparkle */}
      <path d="M12 2.2 13.85 9.15 20.8 11 13.85 12.85 12 19.8 10.15 12.85 3.2 11 10.15 9.15 12 2.2Z" />
      {/* Small sparkle top-right */}
      <path d="M19.2 3.2 19.85 5.55 22.2 6.2 19.85 6.85 19.2 9.2 18.55 6.85 16.2 6.2 18.55 5.55 19.2 3.2Z" />
      {/* Small sparkle bottom-left */}
      <path d="M5.4 15.4 5.9 17.15 7.65 17.65 5.9 18.15 5.4 19.9 4.9 18.15 3.15 17.65 4.9 17.15 5.4 15.4Z" />
    </svg>
  );
}

