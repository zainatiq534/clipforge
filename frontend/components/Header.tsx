"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { GhostButton, GradientButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";

const navLinks = [
  { label: "Features", href: "/features" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Testimonials", href: "/#testimonials" },
  { label: "Blogs", href: "/blog" },
];

type HeaderProps = {
  className?: string;
  /** `light` for light backgrounds (login, blog article). */
  tone?: "dark" | "light";
};

export function Header({ className, tone = "dark" }: HeaderProps) {
  const pathname = usePathname();
  const isLight = tone === "light";

  return (
    <header
      className={cn(
        "relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8",
        className,
      )}
    >
      <Logo href="/" tone={isLight ? "light" : "dark"} />

      <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
        {navLinks.map((link) => {
          const active =
            (link.href === "/features" && pathname === "/features") ||
            (link.href === "/blog" &&
              (pathname === "/blog" || pathname.startsWith("/blog/"))) ||
            (link.href === "/login" && pathname === "/login");

          return (
            <Link key={link.href} href={link.href} className="group">
              {isLight ? (
                <span
                  className={cn(
                    "relative font-sans text-sm font-semibold transition-colors",
                    active
                      ? "!text-[#7c3aed]"
                      : "!text-[#475569] group-hover:!text-[#1e1b4b]",
                  )}
                >
                  {link.label}
                  {active ? (
                    <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-[#7c3aed]" />
                  ) : null}
                </span>
              ) : (
                <Typography
                  as="span"
                  variant="nav"
                  tone={active ? "white" : "muted"}
                  className="transition-colors group-hover:text-white"
                >
                  {link.label}
                </Typography>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-2 sm:gap-3">
        {isLight ? (
          <Link
            href="/login"
            className="inline-flex h-9 items-center justify-center rounded-[14px] border border-[#7c3aed]/40 px-4 font-sans text-sm font-semibold text-[#7c3aed] transition-colors hover:bg-[#f3e8ff]"
          >
            Log In
          </Link>
        ) : (
          <GhostButton size="sm" href="/login" className="inline-flex">
            Log In
          </GhostButton>
        )}
        <GradientButton
          size="sm"
          href="#start"
          rightIcon={<Icon icon={ArrowRight} size="md" />}
        >
          Get Started
        </GradientButton>
      </div>
    </header>
  );
}
