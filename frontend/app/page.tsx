import { Check } from "lucide-react";
import { BeforeAfterDemo } from "@/components/home/BeforeAfterDemo";
import { FAQ } from "@/components/home/FAQ";
import { FloatingClips } from "@/components/home/FloatingClips";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { Pricing } from "@/components/home/Pricing";
import { Testimonials } from "@/components/home/Testimonials";
import { TrustedBy } from "@/components/home/TrustedBy";
import { UploadFilesPill } from "@/components/home/UploadFilesPill";
import { Badge } from "@/components/ui/Badge";
import { BackgroundImage } from "@/components/ui/Image";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import { FeaturesHome } from "@/components/home/FeaturesHome";

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

        <div className="relative z-10 flex min-h-dvh flex-col pt-20">
          <Hero />
        </div>
      </div>

      {/* Single continuous light canvas — seamless between all sections */}
      <div className="relative w-full overflow-x-clip bg-[#faf9fc]">
        <SharedLightAtmosphere />
        <TrustedBy />
        <HowItWorks />
        <FeaturesHome />
        <BeforeAfterDemo />
        <Testimonials />
        <Pricing />
        <FAQ />
      </div>

      {/* Final CTA + Footer — dark navy matching footer mock */}
      <div className="relative w-full overflow-x-clip bg-[#07102a]">
        <section id="start" className="relative w-full bg-[#07102a]">
          <div className="relative w-full">
            {/* Mobile: image as background band; content stacks below so it never clips */}
            <div
              className="relative flex min-h-[22rem] flex-col items-center justify-center px-5 py-12 text-center sm:hidden"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(7,16,42,0.55) 0%, rgba(7,16,42,0.72) 100%), url(/cta-bg.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <CtaContent />
            </div>

            {/* md+: image sets height, content overlays */}
            <div className="relative hidden w-full sm:block">
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
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-8 pb-8 text-center lg:px-16">
                <CtaContent />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function CtaContent() {
  return (
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
          Join thousands of creators, marketers, and businesses turning long
          videos into viral-ready clips with ClipForge.
        </p>
      </Reveal>

      <Reveal delay={0.18}>
        <UploadFilesPill className="mt-5 sm:mt-6" />

        <ul className="mt-4 flex flex-col items-center gap-2.5 sm:mt-5 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-5 sm:gap-y-2">
          {trustItems.map((item) => (
            <li
              key={item}
              className="inline-flex items-center gap-2 font-sans text-sm text-white/90 sm:text-[0.95rem]"
            >
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-[4px] bg-[#7c3aed]">
                <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
              </span>
              {item}
            </li>
          ))}
        </ul>
      </Reveal>
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


