"use client";

import { ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/layout/Logo";
import {
  GhostButton,
  GhostInkButton,
  GradientButton,
} from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";

const navLinks = [
  { label: "Features", href: "/features" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "Blogs", href: "/blog" },
];

type HeaderProps = {
  className?: string;
  /** `light` for light backgrounds (login, how-it-works, blog article). */
  tone?: "dark" | "light";
};

export function Header({ className, tone = "dark" }: HeaderProps) {
  const isLight = tone === "light";
  const [open, setOpen] = useState(false);

  return (
    <header
      className={cn(
        "relative z-20 mx-auto w-full max-w-6xl px-4 py-4 sm:px-8 sm:py-5",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <Logo tone={tone} href="/" />

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              prefetch
              className="group"
            >
              <Typography
                as="span"
                variant="nav"
                tone={isLight ? "mutedInk" : "muted"}
                className={cn(
                  "transition-colors duration-150",
                  isLight
                    ? "group-hover:text-[#111827]"
                    : "group-hover:text-white",
                )}
              >
                {link.label}
              </Typography>
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {isLight ? (
            <GhostInkButton size="sm" href="/login" className="hidden sm:inline-flex">
              Log In
            </GhostInkButton>
          ) : (
            <GhostButton
              size="sm"
              href="/login"
              className="hidden sm:inline-flex"
            >
              Log In
            </GhostButton>
          )}
          <GradientButton
            size="sm"
            href="/signup"
            rightIcon={<Icon icon={ArrowRight} size="md" />}
            className="hidden sm:inline-flex"
          >
            Get Started
          </GradientButton>
          <button
            type="button"
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-150 md:hidden",
              isLight
                ? "bg-black/5 text-[#111827]"
                : "bg-white/10 text-white",
            )}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X className="h-5 w-5" strokeWidth={2} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={2} />
            )}
          </button>
        </div>
      </div>

      {open ? (
        <div
          className={cn(
            "mt-3 overflow-hidden rounded-[18px] border p-3 shadow-lg md:hidden",
            "animate-[cf-page-enter_200ms_cubic-bezier(0.16,1,0.3,1)_both]",
            isLight
              ? "border-[#e9e4f5] bg-white"
              : "border-white/15 bg-[#0b1020]/95 backdrop-blur-xl",
          )}
        >
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                prefetch
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-[12px] px-3 py-2.5 font-sans text-[14px] font-semibold transition-colors duration-150",
                  isLight
                    ? "text-[#374151] hover:bg-[#f5f3ff]"
                    : "text-white/85 hover:bg-white/10",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-2 flex flex-col gap-2 border-t border-white/10 pt-3">
            <GhostButton
              size="sm"
              href="/login"
              className={cn(
                "w-full justify-center",
                isLight ? "text-[#111827]" : undefined,
              )}
            >
              Log In
            </GhostButton>
            <GradientButton
              size="sm"
              href="/signup"
              className="w-full justify-center"
              rightIcon={<Icon icon={ArrowRight} size="md" />}
            >
              Get Started
            </GradientButton>
          </div>
        </div>
      ) : null}
    </header>
  );
}
