"use client";

import { useState, type ReactNode } from "react";
import { ArrowRight, Headphones, Minus, Plus } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";

const faqs = [
  {
    id: "formats",
    question: "What video formats are supported?",
    answer:
      "ClipForge supports all major video formats including MP4, MOV, AVI, MKV, and WEBM. You can upload videos directly or paste a link from platforms like YouTube, TikTok, Instagram, Facebook, and more.",
    icon: "video" as const,
  },
  {
    id: "processing",
    question: "How long does it take to process a video?",
    answer:
      "Most videos are processed in just a few minutes. Short clips finish even faster, while longer videos may take a bit more time depending on length and plan. Creator and Team plans get faster, priority processing.",
    icon: "zap" as const,
  },
  {
    id: "platforms",
    question: "Can I use videos from YouTube or other platforms?",
    answer:
      "Yes! Paste a link from YouTube, TikTok, Instagram, Facebook, and more — or upload your own file. ClipForge pulls the video and turns it into ready-to-post clips.",
    icon: "link" as const,
  },
  {
    id: "storage",
    question: "How is my content stored?",
    answer:
      "Your videos and clips are stored securely in encrypted cloud storage. Only you can access your projects, and you can delete your content anytime from your dashboard.",
    icon: "database" as const,
  },
  {
    id: "watermark",
    question: "Do the exported clips have a watermark?",
    answer:
      "Free plan exports include a small ClipForge watermark. Creator and Team / Agency plans export clean clips with no watermark — ready for publishing or commercial use.",
    icon: "shield" as const,
  },
  {
    id: "refund",
    question: "What is your refund policy?",
    answer:
      "If you're not satisfied within the first 14 days of a paid plan, contact support for a full refund. No questions asked — we want you to love ClipForge.",
    icon: "card" as const,
  },
] as const;

type FAQProps = {
  className?: string;
};

export function FAQ({ className }: FAQProps) {
  const [openId, setOpenId] = useState<string>(faqs[0].id);

  return (
    <section
      id="faq"
      className={cn(
        "relative px-5 py-16 sm:px-8 sm:py-20 lg:py-24",
        className,
      )}
    >
      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="flex flex-col items-center text-center">
          <Badge
            icon={<FAQBadgeIcon />}
            className="border-[#ddd6fe] bg-[#f3e8ff]/95 px-3.5 py-1.5 shadow-none backdrop-blur-sm"
          >
            <span className="font-sans text-[0.8rem] font-semibold tracking-normal text-[#6d4aff] normal-case sm:text-[0.85rem]">
              FAQ
            </span>
          </Badge>

          <h2
            className={cn(
              "mt-6 max-w-4xl text-center font-display font-bold tracking-[-0.03em]",
              "text-[2.15rem] leading-[1.15] sm:text-[2.85rem] md:text-[3.35rem] lg:text-[3.75rem]",
            )}
          >
            <span style={{ color: "#111827" }}>Got Questions? </span>
            <span className="text-[#7c3aed]">We&apos;ve Got Answers.</span>
          </h2>

          <p
            className="mt-5 max-w-2xl text-center font-sans text-base leading-relaxed sm:mt-6 sm:text-lg"
            style={{ color: "#6b7280" }}
          >
            Everything you need to know about ClipForge. Can&apos;t find what
            you&apos;re looking for? Our team is always here to help.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 items-start gap-6 lg:mt-14 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,0.85fr)] lg:gap-7 xl:gap-8">
          <div className="flex flex-col gap-3 sm:gap-3.5">
            {faqs.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className={cn(
                    "rounded-2xl border border-[#eceaf3] bg-white shadow-[0_4px_18px_rgba(17,24,39,0.04)] transition-shadow",
                    isOpen && "shadow-[0_8px_24px_rgba(124,58,237,0.08)]",
                  )}
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    onClick={() => setOpenId(isOpen ? "" : item.id)}
                    className="flex w-full items-start gap-3.5 px-4 py-4 text-left sm:gap-4 sm:px-5 sm:py-[1.15rem]"
                  >
                    <FAQItemIcon type={item.icon} />

                    <span className="min-w-0 flex-1 pt-1.5">
                      <span
                        className="block font-sans text-[0.95rem] font-semibold leading-snug sm:text-base"
                        style={{ color: "#111827" }}
                      >
                        {item.question}
                      </span>
                      {isOpen ? (
                        <span
                          className="mt-2.5 block font-sans text-sm leading-relaxed sm:text-[0.95rem]"
                          style={{ color: "#6b7280" }}
                        >
                          {item.answer}
                        </span>
                      ) : null}
                    </span>

                    <span
                      className={cn(
                        "mt-1.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full sm:h-8 sm:w-8",
                        isOpen
                          ? "bg-[#7c3aed] text-white"
                          : "bg-[#f3e8ff] text-[#7c3aed]",
                      )}
                      aria-hidden
                    >
                      {isOpen ? (
                        <Minus className="h-3.5 w-3.5" strokeWidth={2.75} />
                      ) : (
                        <Plus className="h-3.5 w-3.5" strokeWidth={2.75} />
                      )}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>

          <aside className="overflow-hidden rounded-[1.75rem] border border-[#eceaf3] bg-white shadow-[0_10px_36px_rgba(17,24,39,0.07)] sm:rounded-[2rem]">
            <div className="relative aspect-[5/4] w-full overflow-hidden bg-[#efe8ff]">
              <img
                src="/faq-support-hero.jpg"
                alt="Friendly ClipForge support agent"
                width={2000}
                height={1577}
                className="absolute inset-0 h-full w-full object-cover object-top"
                decoding="async"
                loading="eager"
                draggable={false}
              />
            </div>

            <div className="relative -mt-5 rounded-t-[1.75rem] bg-white px-5 pt-7 pb-6 text-center sm:-mt-6 sm:rounded-t-[2rem] sm:px-6 sm:pt-8 sm:pb-7">
              <h3
                className="font-display text-xl font-bold tracking-tight sm:text-[1.35rem]"
                style={{ color: "#111827" }}
              >
                Still have questions?
              </h3>
              <p className="mt-1 font-display text-xl font-bold tracking-tight text-[#7c3aed] sm:text-[1.35rem]">
                Contact Support
              </p>
              <p
                className="mx-auto mt-3 max-w-[16.5rem] font-sans text-sm leading-relaxed sm:text-[0.95rem]"
                style={{ color: "#6b7280" }}
              >
                Our friendly support team is here to help you with anything you
                need. We typically reply within a few hours.
              </p>

              <a
                href="#contact"
                className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-[#8b5cf6] via-[#7c3aed] to-[#6d28d9] px-4 font-sans text-sm font-semibold text-white shadow-[0_10px_28px_rgba(124,58,237,0.35)] transition-brightness hover:brightness-110 sm:h-[3.15rem] sm:text-[0.95rem]"
              >
                <Headphones className="h-4 w-4 shrink-0" strokeWidth={2.25} />
                <span>Contact Support</span>
                <ArrowRight className="h-4 w-4 shrink-0" strokeWidth={2.25} />
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function FAQBadgeIcon() {
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#7c3aed] sm:h-[1.35rem] sm:w-[1.35rem]">
      <span className="font-sans text-[0.7rem] font-bold leading-none text-white">
        ?
      </span>
    </span>
  );
}

type FAQIconType = (typeof faqs)[number]["icon"];

/** Soft lavender circle + crisp purple mark matching the FAQ mockup */
function FAQItemIcon({ type }: { type: FAQIconType }) {
  return (
    <span
      className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f3e8ff] sm:h-11 sm:w-11"
      aria-hidden
    >
      {faqIconMark[type]}
    </span>
  );
}

const iconStroke = {
  fill: "none",
  stroke: "#6d28d9",
  strokeWidth: 1.85,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const faqIconMark: Record<FAQIconType, ReactNode> = {
  video: (
    <svg viewBox="0 0 24 24" className="h-[1.15rem] w-[1.15rem] sm:h-5 sm:w-5">
      <rect x="3.2" y="6.5" width="11.5" height="11" rx="2.4" {...iconStroke} />
      <path d="M14.7 10.2 20.2 7.4v9.2l-5.5-2.8Z" {...iconStroke} />
    </svg>
  ),
  zap: (
    <svg viewBox="0 0 24 24" className="h-[1.15rem] w-[1.15rem] sm:h-5 sm:w-5">
      <path
        d="M13.2 3.5 7.4 12.4h4.3L9.8 20.5l7.2-10.2h-4.4L13.2 3.5Z"
        {...iconStroke}
      />
    </svg>
  ),
  link: (
    <img
      src="/faq-icon-link.png"
      alt=""
      width={20}
      height={24}
      className="h-5 w-5 object-contain"
      draggable={false}
    />
  ),
  database: (
    <svg viewBox="0 0 24 24" className="h-[1.15rem] w-[1.15rem] sm:h-5 sm:w-5">
      <ellipse cx="12" cy="6.2" rx="6.4" ry="2.4" {...iconStroke} />
      <path
        d="M5.6 6.2v4c0 1.35 2.85 2.4 6.4 2.4s6.4-1.05 6.4-2.4v-4"
        {...iconStroke}
      />
      <path
        d="M5.6 10.2v4c0 1.35 2.85 2.4 6.4 2.4s6.4-1.05 6.4-2.4v-4"
        {...iconStroke}
      />
      <path
        d="M5.6 14.2v3.6c0 1.35 2.85 2.4 6.4 2.4s6.4-1.05 6.4-2.4V14.2"
        {...iconStroke}
      />
    </svg>
  ),
  shield: (
    <svg viewBox="0 0 24 24" className="h-[1.15rem] w-[1.15rem] sm:h-5 sm:w-5">
      <path
        d="M12 3.2 18.6 5.6v5.4c0 4.1-2.7 7.7-6.6 9-3.9-1.3-6.6-4.9-6.6-9V5.6L12 3.2Z"
        fill="#6d28d9"
      />
      <path
        d="M9.1 11.7 11 13.6l3.9-4"
        fill="none"
        stroke="#f3e8ff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  card: (
    <svg viewBox="0 0 24 24" className="h-[1.15rem] w-[1.15rem] sm:h-5 sm:w-5">
      <rect x="3.2" y="6.2" width="17.6" height="11.6" rx="2.2" {...iconStroke} />
      <path d="M3.2 10.2h17.6" {...iconStroke} />
      <path d="M7 15.2h3.4" {...iconStroke} />
    </svg>
  ),
};
