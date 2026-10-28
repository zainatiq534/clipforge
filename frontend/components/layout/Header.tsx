"use client";

import { ArrowRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-4 py-4 sm:gap-4 sm:px-8 sm:py-5",
        className,
      )}
    >
      <Logo tone={tone} href="/" />

      <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} className="group">
            <Typography
              as="span"
              variant="nav"
              tone={isLight ? "mutedInk" : "muted"}
              className={cn(
                "transition-colors",
                isLight ? "group-hover:text-[#111827]" : "group-hover:text-white",
              )}
            >
              {link.label}
            </Typography>
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-2 sm:gap-3">
        {isLight ? (
          <GhostInkButton size="sm" href="/login" className="hidden md:inline-flex">
            Log In
          </GhostInkButton>
        ) : (
          <GhostButton size="sm" href="/login" className="hidden md:inline-flex">
            Log In
          </GhostButton>
        )}
        <GradientButton
          size="sm"
          href="/signup"
          rightIcon={<Icon icon={ArrowRight} size="md" />}
          className="hidden md:inline-flex"
        >
          Get Started
        </GradientButton>

        <button
          type="button"
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-[12px] md:hidden",
            isLight
              ? "text-[#111827] hover:bg-[#7c3aed]/10"
              : "text-white hover:bg-white/10",
          )}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-[#050814]/45 backdrop-blur-[2px]"
            aria-label="Close menu overlay"
            onClick={() => setOpen(false)}
          />
          <div
            className={cn(
              "absolute inset-x-4 top-[4.5rem] rounded-[20px] border p-4 shadow-[0_20px_50px_rgba(15,15,25,0.25)]",
              isLight
                ? "border-[#efeaf8] bg-white"
                : "border-white/10 bg-[#0d1020]/95",
            )}
          >
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-[12px] px-3 py-3 font-sans text-[15px] font-semibold transition",
                    isLight
                      ? "text-[#30283d] hover:bg-[#f5f0ff]"
                      : "text-white/90 hover:bg-white/10",
                  )}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="mt-3 flex flex-col gap-2 border-t border-[#efeaf8]/80 pt-3 dark:border-white/10">
              <a
                href="/login"
                onClick={() => setOpen(false)}
                className={cn(
                  "inline-flex h-11 items-center justify-center rounded-[14px] font-sans text-sm font-semibold",
                  isLight
                    ? "bg-[#f5f0ff] text-[#7c3aed]"
                    : "bg-white/10 text-white",
                )}
              >
                Log In
              </a>
              <GradientButton
                size="md"
                href="/signup"
                fullWidth
                rightIcon={<Icon icon={ArrowRight} size="md" />}
                onClick={() => setOpen(false)}
              >
                Get Started
              </GradientButton>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
