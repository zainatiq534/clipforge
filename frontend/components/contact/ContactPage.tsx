"use client";

import {
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Headphones,
  Mail,
  MessageSquareText,
  Send,
  Sparkles,
} from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Reveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { cn } from "@/lib/cn";

const TOPICS = [
  { id: "general", label: "General question" },
  { id: "billing", label: "Billing & plans" },
  { id: "technical", label: "Technical issue" },
  { id: "feature", label: "Feature request" },
  { id: "partnership", label: "Partnership" },
  { id: "other", label: "Something else" },
] as const;

const CHANNELS = [
  {
    id: "email",
    title: "Email us",
    detail: "support@clipforge.app",
    hint: "Best for detailed questions",
    icon: Mail,
  },
  {
    id: "hours",
    title: "Reply window",
    detail: "Within a few hours",
    hint: "Mon–Fri, often faster",
    icon: Clock3,
  },
  {
    id: "studio",
    title: "Account help",
    detail: "Dashboard & exports",
    hint: "Uploads, clips, billing",
    icon: Headphones,
  },
] as const;

type ContactPageProps = {
  className?: string;
};

export function ContactPage({ className }: ContactPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState<(typeof TOPICS)[number]["id"]>("general");
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMessage) {
      setError("Please fill in your name, email, and message.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Enter a valid email so we can reply.");
      return;
    }
    if (trimmedMessage.length < 12) {
      setError("Add a bit more detail so we can help faster.");
      return;
    }

    setPending(true);
    try {
      // Client-side handoff until a support API exists
      const subject = encodeURIComponent(
        `[ClipForge] ${TOPICS.find((t) => t.id === topic)?.label ?? "Contact"} — ${trimmedName}`,
      );
      const body = encodeURIComponent(
        `Name: ${trimmedName}\nEmail: ${trimmedEmail}\nTopic: ${
          TOPICS.find((t) => t.id === topic)?.label ?? topic
        }\n\n${trimmedMessage}`,
      );
      window.location.href = `mailto:support@clipforge.app?subject=${subject}&body=${body}`;
      setSent(true);
    } catch {
      setError("Could not open your mail app. Email support@clipforge.app instead.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div
      className={cn(
        "relative flex min-h-dvh flex-col overflow-x-clip bg-[#faf9fc] text-[#111827]",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div
          className="absolute -top-28 -left-24 h-[30rem] w-[30rem] rounded-full opacity-70 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(196,181,253,0.55) 0%, rgba(237,233,254,0.2) 55%, transparent 70%)",
          }}
        />
        <div
          className="absolute top-[12%] right-[-10%] h-[34rem] w-[34rem] rounded-full opacity-75 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(167,139,250,0.32) 0%, rgba(221,214,254,0.22) 45%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-[-8%] left-[18%] h-[22rem] w-[42rem] rounded-full opacity-55 blur-3xl"
          style={{
            background:
              "radial-gradient(ellipse, rgba(233,213,255,0.48) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(124,58,237,0.07) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-dvh flex-col pt-20">
        {/* Hero — brand first, one job */}
        <section className="mx-auto w-full max-w-6xl px-5 pb-10 pt-8 sm:px-8 sm:pb-12 sm:pt-12">
          <div className="flex flex-col items-center text-center">
            <Reveal immediate>
              <SectionLabel>Contact</SectionLabel>
            </Reveal>
            <Reveal immediate delay={0.05}>
              <p className="mt-5 font-display text-[0.95rem] font-bold tracking-tight text-[#7c3aed] sm:text-base">
                ClipForge
              </p>
            </Reveal>
            <Reveal immediate delay={0.1}>
              <h1
                className={cn(
                  "mt-2 max-w-3xl font-display font-bold tracking-[-0.03em]",
                  "text-[2.35rem] leading-[1.12] sm:text-[3.1rem] md:text-[3.55rem]",
                )}
              >
                <span style={{ color: "#111827" }}>We&apos;re here when </span>
                <span className="text-[#7c3aed]">you need us.</span>
              </h1>
            </Reveal>
            <Reveal immediate delay={0.16}>
              <p
                className="mt-4 max-w-xl font-sans text-base leading-relaxed sm:mt-5 sm:text-lg"
                style={{ color: "#6b7280" }}
              >
                Ask about clips, billing, exports, or partnerships — our support
                team typically replies within a few hours.
              </p>
            </Reveal>
          </div>
        </section>

        {/* Form + picture — directly under hero */}
        <section className="mx-auto w-full max-w-6xl px-5 pb-10 pt-2 sm:px-8 sm:pb-12 sm:pt-4">
          <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.9fr)] lg:gap-8">
            <Reveal>
              <div className="relative overflow-hidden rounded-[1.75rem] border border-[#ddd6fe]/80 bg-gradient-to-br from-white/80 via-[#faf5ff]/85 to-[#ede9fe]/50 p-5 shadow-[0_12px_40px_rgba(124,58,237,0.08)] backdrop-blur-xl sm:rounded-[2rem] sm:p-7">
                <div className="relative flex items-start justify-between gap-3">
                  <div>
                    <p className="inline-flex items-center gap-1.5 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#7c3aed]">
                      <MessageSquareText className="h-3.5 w-3.5" />
                      Send a message
                    </p>
                    <h2 className="mt-2 font-display text-[1.55rem] font-bold tracking-tight text-[#111827] sm:text-[1.75rem]">
                      Tell us what you need
                    </h2>
                    <p className="mt-1.5 max-w-md font-sans text-sm text-[#6b7280]">
                      Pick a topic, share a few details, and we&apos;ll get back
                      to you at the email you provide.
                    </p>
                  </div>
                  <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] text-white shadow-[0_10px_24px_rgba(124,58,237,0.35)] sm:inline-flex">
                    <Sparkles className="h-5 w-5" strokeWidth={2} />
                  </span>
                </div>

                {sent ? (
                  <div className="relative mt-8 flex flex-col items-center rounded-[1.35rem] bg-[#f5f3ff] px-5 py-10 text-center ring-1 ring-[#ddd6fe]">
                    <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] text-white shadow-[0_12px_28px_rgba(124,58,237,0.35)]">
                      <CheckCircle2 className="h-7 w-7" strokeWidth={2.2} />
                    </span>
                    <h3 className="mt-4 font-display text-xl font-bold text-[#111827]">
                      Message ready to send
                    </h3>
                    <p className="mt-2 max-w-sm font-sans text-sm leading-relaxed text-[#6b7280]">
                      Your mail app should open with your note to{" "}
                      <span className="font-semibold text-[#7c3aed]">
                        support@clipforge.app
                      </span>
                      . If it didn&apos;t, email us directly.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSent(false);
                        setMessage("");
                      }}
                      className="mt-5 inline-flex h-11 items-center gap-2 rounded-[14px] bg-white px-4 font-sans text-sm font-semibold text-[#7c3aed] ring-1 ring-[#ddd6fe] transition hover:bg-[#faf5ff]"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => void onSubmit(e)}
                    className="relative mt-6 flex flex-col gap-4"
                    noValidate
                  >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field label="Full name" htmlFor="contact-name">
                        <input
                          id="contact-name"
                          name="name"
                          autoComplete="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Alex Rivera"
                          className={fieldClass}
                        />
                      </Field>
                      <Field label="Work email" htmlFor="contact-email">
                        <input
                          id="contact-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@studio.com"
                          className={fieldClass}
                        />
                      </Field>
                    </div>

                    <div>
                      <p className="mb-2 font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-[#9b8bb8]">
                        Topic
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {TOPICS.map((item) => {
                          const active = topic === item.id;
                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setTopic(item.id)}
                              className={cn(
                                "rounded-full px-3 py-1.5 font-sans text-[12px] font-semibold transition duration-150",
                                active
                                  ? "bg-gradient-to-r from-[#a78bfa] via-[#8b5cf6] to-[#7c3aed] text-white shadow-[0_8px_20px_rgba(124,58,237,0.3)]"
                                  : "bg-[#f5f3ff] text-[#5b21b6] hover:bg-[#ede9fe]",
                              )}
                            >
                              {item.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <Field label="How can we help?" htmlFor="contact-message">
                      <textarea
                        id="contact-message"
                        name="message"
                        rows={5}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Share a bit about your project, issue, or idea…"
                        className={cn(fieldClass, "min-h-[8.5rem] resize-y py-3")}
                      />
                    </Field>

                    {error ? (
                      <p
                        className="rounded-[12px] bg-rose-50 px-3 py-2 font-sans text-sm font-medium text-rose-700 ring-1 ring-rose-200"
                        role="alert"
                      >
                        {error}
                      </p>
                    ) : null}

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="font-sans text-[12px] leading-relaxed text-[#8b7aa8]">
                        By sending, you agree we may reply to this email about
                        your request.
                      </p>
                      <button
                        type="submit"
                        disabled={pending}
                        className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-[16px] bg-gradient-to-r from-[#8b5cf6] via-[#7c3aed] to-[#6d28d9] px-5 font-sans text-sm font-semibold text-white shadow-[0_12px_32px_rgba(124,58,237,0.35)] transition hover:brightness-110 disabled:opacity-60"
                      >
                        <Send className="h-4 w-4" strokeWidth={2.2} />
                        {pending ? "Opening…" : "Send message"}
                        <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </Reveal>

            <Reveal from="right" delay={0.08}>
              <aside className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-[#ddd6fe]/80 bg-gradient-to-b from-white via-[#faf5ff] to-[#ede9fe]/40 shadow-[0_12px_40px_rgba(124,58,237,0.08)] sm:rounded-[2rem]">
                {/* Asset has its own rounded frame — scale past it so only the card edge shows */}
                <div className="relative aspect-[5/4] w-full overflow-hidden bg-[#efe8ff] sm:aspect-[4/3]">
                  <img
                    src="/faq-support-hero.jpg"
                    alt="Friendly ClipForge support"
                    width={2000}
                    height={1577}
                    className="absolute left-1/2 top-0 h-[108%] w-[112%] max-w-none -translate-x-1/2 object-cover object-[center_12%]"
                    decoding="async"
                    loading="eager"
                    draggable={false}
                  />
                  <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white via-white/80 to-transparent"
                    aria-hidden
                  />
                </div>

                <div className="relative flex flex-1 flex-col px-5 pb-6 pt-1 sm:px-6 sm:pb-7">
                  <h3 className="font-display text-xl font-bold tracking-tight text-[#111827] sm:text-[1.35rem]">
                    Prefer a direct line?
                  </h3>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-[#6b7280]">
                    Email{" "}
                    <a
                      href="mailto:support@clipforge.app"
                      className="font-semibold text-[#7c3aed] underline-offset-2 hover:underline"
                    >
                      support@clipforge.app
                    </a>{" "}
                    anytime. For account issues, include the email on your
                    ClipForge login.
                  </p>

                  <ul className="mt-5 flex flex-col gap-2.5">
                    {[
                      "Billing & plan upgrades",
                      "Upload / export troubleshooting",
                      "Feature ideas & feedback",
                      "Agency & partnership inquiries",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2.5 rounded-[12px] border border-[#ddd6fe]/70 bg-white/70 px-3 py-2.5 font-sans text-[13px] font-medium text-[#374151] backdrop-blur-sm"
                      >
                        <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] text-white">
                          <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2.4} />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/signup"
                    prefetch
                    className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[16px] bg-gradient-to-r from-[#8b5cf6] via-[#7c3aed] to-[#6d28d9] px-4 font-sans text-sm font-semibold text-white shadow-[0_10px_28px_rgba(124,58,237,0.35)] transition hover:brightness-110"
                  >
                    <Headphones className="h-4 w-4" strokeWidth={2.2} />
                    Start free — then ask from the app
                    <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
                  </Link>
                </div>
              </aside>
            </Reveal>
          </div>
        </section>

        {/* Channel cards — below form */}
        <section className="mx-auto w-full max-w-6xl px-5 pb-14 sm:px-8 sm:pb-20">
          <Stagger
            className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4"
            stagger={0.05}
          >
            {CHANNELS.map((channel) => {
              const Icon = channel.icon;
              return (
                <StaggerItem key={channel.id}>
                  <div className="relative overflow-hidden rounded-[1.35rem] border border-[#ddd6fe]/80 bg-gradient-to-br from-white/80 via-[#faf5ff]/85 to-[#ede9fe]/60 px-4 py-4 shadow-[0_10px_32px_rgba(124,58,237,0.08)] backdrop-blur-xl transition-[transform,box-shadow,border-color] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-[#c4b5fd] hover:shadow-[0_16px_36px_rgba(124,58,237,0.14)] sm:px-5 sm:py-5">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] text-white shadow-[0_8px_18px_rgba(124,58,237,0.28)]">
                      <Icon className="h-[1.125rem] w-[1.125rem]" strokeWidth={2.1} />
                    </span>
                    <p className="mt-3 font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-[#7c3aed]">
                      {channel.title}
                    </p>
                    <p className="mt-1 font-display text-[1.05rem] font-bold tracking-tight text-[#111827]">
                      {channel.detail}
                    </p>
                    <p className="mt-1 font-sans text-[13px] text-[#6b7280]">
                      {channel.hint}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </section>
      </div>
    </div>
  );
}

const fieldClass =
  "w-full rounded-[14px] border border-[#e9e4f5] bg-[#faf8ff] px-3.5 py-2.5 font-sans text-[14px] font-medium text-[#111827] outline-none transition placeholder:text-[#b7a9cf] focus:border-[#c4b5fd] focus:bg-white focus:ring-2 focus:ring-[#ddd6fe]";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: ReactNode;
}) {
  return (
    <label className="block" htmlFor={htmlFor}>
      <span className="mb-1.5 block font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-[#9b8bb8]">
        {label}
      </span>
      {children}
    </label>
  );
}
