import type { ReactNode } from "react";
import {
  ArrowRight,
  Check,
  Mail,
} from "lucide-react";
import { BeforeAfterDemo } from "@/components/BeforeAfterDemo";
import { FAQ } from "@/components/FAQ";
import { Features } from "@/components/Features";
import { FloatingClips } from "@/components/FloatingClips";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Logo } from "@/components/Logo";
import { Pricing } from "@/components/Pricing";
import { Testimonials } from "@/components/Testimonials";
import { TrustedBy } from "@/components/TrustedBy";
import { Badge } from "@/components/ui/Badge";
import { GradientButton } from "@/components/ui/Button";
import { BackgroundImage } from "@/components/ui/Image";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

const productLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Templates", href: "#templates" },
  { label: "Changelog", href: "#changelog" },
] as const;

const companyLinks = [
  { label: "About Us", href: "#about" },
  { label: "Careers", href: "#careers" },
  { label: "Blog", href: "#blog" },
  { label: "Affiliates", href: "#affiliates" },
  { label: "Contact", href: "#contact" },
] as const;

const legalLinks = [
  { label: "Terms of Service", href: "#terms" },
  { label: "Privacy Policy", href: "#privacy" },
  { label: "Cookie Policy", href: "#cookies" },
  { label: "Acceptable Use", href: "#acceptable-use" },
  { label: "Brand Guidelines", href: "#brand" },
] as const;

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

        <footer className="relative overflow-hidden border-t border-transparent bg-[#07102a] px-5 pt-14 pb-8 sm:px-8 sm:pt-16 lg:pt-20">
          {/* Attractive purple → blue atmosphere matching CTA */}
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden
            style={{
              background: [
                "linear-gradient(180deg, rgba(99,102,241,0.16) 0%, transparent 28%)",
                "radial-gradient(ellipse 70% 55% at 0% 15%, rgba(139,92,246,0.28) 0%, transparent 55%)",
                "radial-gradient(ellipse 65% 50% at 100% 10%, rgba(59,130,246,0.26) 0%, transparent 55%)",
                "radial-gradient(ellipse 50% 40% at 50% 0%, rgba(167,139,250,0.14) 0%, transparent 50%)",
                "radial-gradient(ellipse 80% 45% at 50% 100%, rgba(37,99,235,0.12) 0%, transparent 55%)",
              ].join(", "),
            }}
          />
          {/* Top gradient hairline */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px"
            aria-hidden
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(167,139,250,0.55) 25%, rgba(96,165,250,0.55) 50%, rgba(167,139,250,0.55) 75%, transparent 100%)",
            }}
          />
          <Reveal className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.35fr_repeat(3,0.75fr)_1.25fr] lg:gap-8">
            <div className="max-w-xs">
              <Logo />
              <p className="mt-4 font-sans text-sm leading-relaxed text-[#9ca3af]">
                Turn long videos into viral-ready clips with the power of AI.
                Create, edit, and share in seconds.
              </p>
              <div className="mt-5 flex items-center gap-2.5">
                <SocialButton label="YouTube" href="#youtube">
                  <YouTubeGlyph />
                </SocialButton>
                <SocialButton label="TikTok" href="#tiktok">
                  <TikTokGlyph />
                </SocialButton>
                <SocialButton label="Instagram" href="#instagram">
                  <InstagramGlyph />
                </SocialButton>
                <SocialButton label="X" href="#x">
                  <XGlyph />
                </SocialButton>
                <SocialButton label="LinkedIn" href="#linkedin">
                  <LinkedInGlyph />
                </SocialButton>
              </div>
            </div>

            <FooterColumn title="Product" links={productLinks} />
            <FooterColumn title="Company" links={companyLinks} />
            <FooterColumn title="Legal" links={legalLinks} />

            <div>
              <h3 className="font-sans text-[0.7rem] font-semibold tracking-[0.14em] text-[#9ca3af] uppercase">
                Stay in the Loop
              </h3>
              <p className="mt-3 font-sans text-sm leading-relaxed text-[#9ca3af]">
                Get the latest updates, tips, and creator resources delivered to
                your inbox.
              </p>
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 p-1.5 pl-3">
                <Mail
                  className="h-4 w-4 shrink-0 text-[#9ca3af]"
                  strokeWidth={1.75}
                  aria-hidden
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  className="min-w-0 flex-1 bg-transparent font-sans text-sm text-white outline-none placeholder:text-[#6b7280]"
                  aria-label="Email address"
                />
                <button
                  type="button"
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-[#a78bfa] via-[#8b5cf6] to-[#3b82f6] text-white transition-[filter] hover:brightness-110"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="h-4 w-4" strokeWidth={2.25} />
                </button>
              </div>
              <p className="mt-2.5 font-sans text-xs text-[#6b7280]">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="relative z-10 mx-auto mt-12 flex w-full max-w-6xl items-center justify-center border-t border-white/10 pt-6 sm:mt-14">
            <p className="font-sans text-xs text-[#6b7280] sm:text-sm">
              © 2026 ClipForge. All rights reserved.
            </p>
          </Reveal>
        </footer>
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

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="font-sans text-[0.7rem] font-semibold tracking-[0.14em] text-[#9ca3af] uppercase">
        {title}
      </h3>
      <ul className="mt-4 flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <a
              href={link.href}
              className="font-sans text-sm text-white/85 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialButton({
  label,
  href,
  children,
}: {
  label: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/[0.07] text-white transition-colors hover:border-white/30 hover:bg-white/15"
    >
      {children}
    </a>
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

function YouTubeGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8ZM9.75 15.5v-7l6.5 3.5-6.5 3.5Z" />
    </svg>
  );
}

function TikTokGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M16.6 5.82A4.43 4.43 0 0 1 15.2 3h-3.12v12.4a2.42 2.42 0 1 1-1.72-2.32V9.85a5.54 5.54 0 1 0 4.8 5.5V9.4a7.5 7.5 0 0 0 4.33 1.37V7.66a4.45 4.45 0 0 1-2.89-1.84Z" />
    </svg>
  );
}

function InstagramGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" />
    </svg>
  );
}

function XGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M17.5 3h3.1l-6.8 7.8L22 21h-5.9l-4.6-6-5.3 6H3.1l7.3-8.3L2 3h6l4.2 5.5L17.5 3Zm-1.1 16.2h1.7L7.7 4.7H5.9l10.5 14.5Z" />
    </svg>
  );
}

function LinkedInGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 7.05a1.96 1.96 0 1 0 0-3.92 1.96 1.96 0 0 0 0 3.92ZM20.44 20h-3.37v-5.6c0-1.33-.02-3.05-1.86-3.05-1.86 0-2.15 1.45-2.15 2.95V20H9.69V8.5h3.24v1.57h.05c.45-.85 1.55-1.75 3.19-1.75 3.41 0 4.04 2.25 4.04 5.17V20Z" />
    </svg>
  );
}
