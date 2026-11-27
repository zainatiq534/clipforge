"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { MarketingAtmosphere } from "@/components/marketing/MarketingAtmosphere";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

export type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

type LegalDocPageProps = {
  label: string;
  titleLead: string;
  titleAccent: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
  footerNote?: ReactNode;
};

export function LegalDocPage({
  titleLead,
  titleAccent,
  intro,
  updated,
  sections,
  footerNote,
}: LegalDocPageProps) {
  return (
    <MarketingAtmosphere>
      <section className="mx-auto w-full max-w-3xl px-5 pb-8 pt-8 sm:px-8 sm:pb-10 sm:pt-12">
        <div className="flex flex-col items-center text-center">
          <Reveal immediate>
            <h1
              className={cn(
                "max-w-3xl font-display font-bold tracking-[-0.03em]",
                "text-[2.25rem] leading-[1.12] sm:text-[3rem] md:text-[3.35rem]",
              )}
            >
              <span style={{ color: "#111827" }}>{titleLead} </span>
              <span className="text-[#7c3aed]">{titleAccent}</span>
            </h1>
          </Reveal>
          <Reveal immediate delay={0.08}>
            <p
              className="mt-4 max-w-2xl font-sans text-base leading-relaxed sm:text-lg"
              style={{ color: "#6b7280" }}
            >
              {intro}
            </p>
          </Reveal>
          <Reveal immediate delay={0.12}>
            <p className="mt-4 rounded-full bg-[#f5f3ff] px-4 py-1.5 font-sans text-[12px] font-semibold text-[#5b21b6]">
              Last updated · {updated}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto w-full max-w-3xl px-5 pb-16 sm:px-8 sm:pb-20">
        <div className="flex flex-col gap-4">
          {sections.map((section, i) => (
            <Reveal key={section.id} delay={0.04 * (i % 4)}>
              <article
                id={section.id}
                className="scroll-mt-28 rounded-[1.5rem] border border-[#ddd6fe]/80 bg-gradient-to-br from-white/80 via-[#faf5ff]/85 to-[#ede9fe]/45 p-5 shadow-[0_10px_32px_rgba(124,58,237,0.07)] backdrop-blur-xl transition-[transform,box-shadow,border-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-[#c4b5fd] hover:shadow-[0_16px_36px_rgba(124,58,237,0.12)] motion-reduce:transform-none sm:p-7"
              >
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] font-display text-[12px] font-bold text-white shadow-[0_8px_18px_rgba(124,58,237,0.28)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-display text-[1.25rem] font-bold tracking-tight text-[#111827] sm:text-[1.4rem]">
                      {section.title}
                    </h2>
                    <div className="mt-3 space-y-3">
                      {section.paragraphs.map((p) => (
                        <p
                          key={p.slice(0, 48)}
                          className="font-sans text-[14px] leading-relaxed text-[#6b7280] sm:text-[15px]"
                        >
                          {p}
                        </p>
                      ))}
                    </div>
                    {section.bullets?.length ? (
                      <ul className="mt-3 space-y-2">
                        {section.bullets.map((item) => (
                          <li
                            key={item}
                            className="flex gap-2.5 font-sans text-[14px] leading-relaxed text-[#374151]"
                          >
                            <span
                              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#7c3aed]"
                              aria-hidden
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}

          <Reveal>
            <div className="rounded-[1.5rem] border border-[#ddd6fe]/80 bg-gradient-to-r from-[#ede9fe]/80 via-[#faf5ff]/90 to-[#dbeafe]/45 px-5 py-6 text-center shadow-[0_10px_32px_rgba(124,58,237,0.07)] backdrop-blur-md sm:px-8">
              <p className="font-sans text-[14px] leading-relaxed text-[#5b21b6]">
                {footerNote ?? (
                  <>
                    Questions about this policy?{" "}
                    <Link
                      href="/contact"
                      prefetch
                      className="font-semibold underline-offset-2 hover:underline"
                    >
                      Contact support
                    </Link>{" "}
                    or email{" "}
                    <a
                      href="mailto:support@clipforge.app"
                      className="font-semibold underline-offset-2 hover:underline"
                    >
                      support@clipforge.app
                    </a>
                    .
                  </>
                )}
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </MarketingAtmosphere>
  );
}
