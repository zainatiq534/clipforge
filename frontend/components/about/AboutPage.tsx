"use client";

import Link from "next/link";
import {
  ArrowRight,
  Clapperboard,
  HeartHandshake,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";
import { MarketingAtmosphere } from "@/components/marketing/MarketingAtmosphere";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { cn } from "@/lib/cn";

const glassCard =
  "h-full rounded-[1.5rem] border border-[#ddd6fe]/80 bg-gradient-to-br from-white/75 via-[#faf5ff]/80 to-[#ede9fe]/55 p-5 shadow-[0_10px_32px_rgba(124,58,237,0.08)] backdrop-blur-xl transition-[transform,box-shadow,border-color,background-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-[#c4b5fd] hover:from-white/85 hover:via-[#f5f3ff]/90 hover:to-[#ede9fe]/70 hover:shadow-[0_18px_42px_rgba(124,58,237,0.14)] motion-reduce:transform-none sm:rounded-[1.65rem] sm:p-6";

const VALUES = [
  {
    title: "Creators first",
    body: "Every feature starts with how editors, founders, and social teams actually ship content — not with fancy demos.",
    icon: HeartHandshake,
  },
  {
    title: "Speed without chaos",
    body: "ClipForge finds hooks, cuts shorts, and keeps your studio organized so you publish more without burning out.",
    icon: Zap,
  },
  {
    title: "Trust by design",
    body: "Your uploads stay in your workspace. Export clean clips on paid plans, delete anytime, and stay in control.",
    icon: ShieldCheck,
  },
  {
    title: "Built to scale",
    body: "From a first upload to agency volume — storage, batching, and export tools grow with your channel.",
    icon: Rocket,
  },
] as const;

const STATS = [
  { label: "Focus", value: "Viral clips" },
  { label: "Formats", value: "TikTok · Reels · Shorts" },
  { label: "Promise", value: "Minutes, not hours" },
] as const;

export function AboutPage() {
  return (
    <MarketingAtmosphere>
      <section className="mx-auto w-full max-w-6xl px-5 pb-10 pt-8 sm:px-8 sm:pb-12 sm:pt-12">
        <div className="flex flex-col items-center text-center">
          <Reveal immediate>
            <p className="font-display text-[0.95rem] font-bold tracking-tight text-[#7c3aed] sm:text-base">
              ClipForge
            </p>
          </Reveal>
          <Reveal immediate delay={0.06}>
            <h1
              className={cn(
                "mt-2 max-w-3xl font-display font-bold tracking-[-0.03em]",
                "text-[2.35rem] leading-[1.12] sm:text-[3.1rem] md:text-[3.55rem]",
              )}
            >
              <span style={{ color: "#111827" }}>We turn long videos into </span>
              <span className="text-[#7c3aed]">moments that travel.</span>
            </h1>
          </Reveal>
          <Reveal immediate delay={0.12}>
            <p
              className="mt-4 max-w-2xl font-sans text-base leading-relaxed sm:mt-5 sm:text-lg"
              style={{ color: "#6b7280" }}
            >
              ClipForge helps creators and teams find the hooks that perform,
              cut vertical clips with captions, and export ready-to-post shorts
              for TikTok, Instagram Reels, and YouTube Shorts.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <Stagger
          className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4"
          stagger={0.05}
        >
          {STATS.map((stat) => (
            <StaggerItem key={stat.label}>
              <div className={glassCard}>
                <p className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#7c3aed]">
                  {stat.label}
                </p>
                <p className="mt-2 font-display text-[1.2rem] font-bold tracking-tight text-[#111827]">
                  {stat.value}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.95fr)] lg:gap-8">
          <Reveal>
            <div className={cn(glassCard, "p-6 sm:p-8")}>
              <p className="inline-flex items-center gap-1.5 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#7c3aed]">
                <Target className="h-3.5 w-3.5" />
                Our mission
              </p>
              <h2 className="mt-3 font-display text-[1.65rem] font-bold tracking-tight text-[#111827] sm:text-[1.9rem]">
                Make short-form production feel effortless
              </h2>
              <p className="mt-3 font-sans text-[15px] leading-relaxed text-[#6b7280]">
                Long-form creators already have the gold — interviews, tutorials,
                podcasts, livestreams. The hard part is finding the punchy
                moments, reframing for vertical, captioning, and exporting
                without living in a timeline for hours.
              </p>
              <p className="mt-3 font-sans text-[15px] leading-relaxed text-[#6b7280]">
                ClipForge was built to close that gap: upload or import a video,
                let AI surface viral-ready windows, refine in a familiar editor,
                and ship clips that actually fit the platforms you care about.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {[
                  "AI viral picks",
                  "Caption styles",
                  "9:16 export",
                  "Studio workspace",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gradient-to-r from-[#f5f3ff] to-[#ede9fe] px-3 py-1.5 font-sans text-[12px] font-semibold text-[#5b21b6] ring-1 ring-[#ddd6fe]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal from="right" delay={0.08}>
            <div
              className={cn(
                glassCard,
                "flex flex-col justify-between from-[#ede9fe]/90 via-[#f5f3ff]/85 to-[#dbeafe]/50 p-6 sm:p-8",
              )}
            >
              <div>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-[16px] bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] text-white shadow-[0_10px_24px_rgba(124,58,237,0.3)]">
                  <Clapperboard className="h-5 w-5" strokeWidth={2.1} />
                </span>
                <h3 className="mt-5 font-display text-[1.45rem] font-bold tracking-tight text-[#111827]">
                  What we believe
                </h3>
                <p className="mt-2 font-sans text-[14px] leading-relaxed text-[#6b7280]">
                  Great content shouldn&apos;t die in a hard drive. If you
                  recorded it once, ClipForge helps you remix it into the clips
                  your audience will actually watch.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-3 rounded-[16px] border border-white/80 bg-white/70 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-md">
                <Sparkles className="h-5 w-5 shrink-0 text-[#7c3aed]" />
                <p className="font-sans text-[13px] font-medium text-[#374151]">
                  Upload → viral moments → edit → export. That&apos;s the loop.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 pb-6 sm:px-8">
        <Reveal>
          <div className="mb-8 flex flex-col items-center text-center">
            <SectionLabel className="justify-center">Values</SectionLabel>
            <h2 className="mt-5 font-display text-[1.85rem] font-bold tracking-tight text-[#111827] sm:text-[2.25rem]">
              How we build ClipForge
            </h2>
          </div>
        </Reveal>
        <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2" stagger={0.05}>
          {VALUES.map((value) => {
            const Icon = value.icon;
            return (
              <StaggerItem key={value.title}>
                <div className={glassCard}>
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] text-white shadow-[0_8px_20px_rgba(124,58,237,0.28)]">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </span>
                  <h3 className="mt-4 font-display text-[1.2rem] font-bold text-[#111827]">
                    {value.title}
                  </h3>
                  <p className="mt-2 font-sans text-[14px] leading-relaxed text-[#6b7280]">
                    {value.body}
                  </p>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <Reveal>
          <div className={cn(glassCard, "px-6 py-10 text-center sm:px-10 sm:py-12")}>
            <h2 className="font-display text-[1.75rem] font-bold tracking-tight text-[#111827] sm:text-[2.1rem]">
              Ready to forge your next clip?
            </h2>
            <p className="mx-auto mt-3 max-w-lg font-sans text-[15px] leading-relaxed text-[#6b7280]">
              Start free, upload a long video, and see viral-ready shorts in
              minutes — or talk to us if you&apos;re building for a team.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/signup"
                prefetch
                className="inline-flex h-12 items-center gap-2 rounded-[16px] bg-gradient-to-r from-[#8b5cf6] via-[#7c3aed] to-[#6d28d9] px-6 font-sans text-sm font-semibold text-white shadow-[0_12px_32px_rgba(124,58,237,0.35)] transition hover:brightness-110"
              >
                Get started free
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                prefetch
                className="inline-flex h-12 items-center gap-2 rounded-[16px] bg-[#f5f3ff] px-6 font-sans text-sm font-semibold text-[#5b21b6] ring-1 ring-[#ddd6fe] transition hover:bg-[#ede9fe]"
              >
                Contact the team
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </MarketingAtmosphere>
  );
}
