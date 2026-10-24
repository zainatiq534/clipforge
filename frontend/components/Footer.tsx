import type { ReactNode } from "react";
import { ArrowRight, Mail } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Reveal } from "@/components/ui/Reveal";

const productLinks = [
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Templates", href: "/#templates" },
  { label: "Changelog", href: "/#changelog" },
] as const;

const companyLinks = [
  { label: "About Us", href: "/#about" },
  { label: "Careers", href: "/#careers" },
  { label: "Blog", href: "/#blog" },
  { label: "Affiliates", href: "/#affiliates" },
  { label: "Contact", href: "/#contact" },
] as const;

const legalLinks = [
  { label: "Terms of Service", href: "/#terms" },
  { label: "Privacy Policy", href: "/#privacy" },
  { label: "Cookie Policy", href: "/#cookies" },
  { label: "Acceptable Use", href: "/#acceptable-use" },
  { label: "Brand Guidelines", href: "/#brand" },
] as const;

/** Site footer — shared by home and how-it-works (same as home). */
export function Footer() {
  return (
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
            Turn long videos into viral-ready clips with the power of AI. Create,
            edit, and share in seconds.
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
            Get the latest updates, tips, and creator resources delivered to your
            inbox.
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

      <Reveal
        delay={0.08}
        className="relative z-10 mx-auto mt-12 flex w-full max-w-6xl items-center justify-center border-t border-white/10 pt-6 sm:mt-14"
      >
        <p className="font-sans text-xs text-[#6b7280] sm:text-sm">
          © 2026 ClipForge. All rights reserved.
        </p>
      </Reveal>
    </footer>
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
