"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";
import { Logo } from "@/components/Logo";
import { GradientButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "Blogs", href: "/blog" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Pricing", href: "/#pricing" },
];

type BlogLightHeaderProps = {
  className?: string;
};

/** Light-theme header for blog article pages (matches reference). */
export function BlogLightHeader({ className }: BlogLightHeaderProps) {
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8",
        className,
      )}
    >
      <Logo href="/" tone="light" />

      <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
        {navLinks.map((link) => {
          const active =
            (link.href === "/blog" &&
              (pathname === "/blog" || pathname.startsWith("/blog/"))) ||
            (link.href === "/features" && pathname === "/features") ||
            (link.href === "/" && pathname === "/");

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative font-sans text-sm font-semibold transition-colors",
                active ? "text-[#7c3aed]" : "text-[#475569] hover:text-[#1e1b4b]",
              )}
            >
              {link.label}
              {active ? (
                <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-[#7c3aed]" />
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#64748b] transition-colors hover:bg-[#f3e8ff] hover:text-[#7c3aed]"
          aria-label="Search"
        >
          <Search className="h-4 w-4" strokeWidth={2.2} />
        </button>
        <Link
          href="/login"
          className="hidden h-9 items-center justify-center rounded-full border border-[#7c3aed]/40 px-4 font-sans text-sm font-semibold text-[#7c3aed] transition-colors hover:bg-[#f3e8ff] sm:inline-flex"
        >
          Login
        </Link>
        <GradientButton
          size="sm"
          href="#start"
          rightIcon={<Icon icon={ArrowRight} size="md" />}
        >
          <span className="hidden sm:inline">Get Started</span>
          <span className="sm:hidden">Start</span>
        </GradientButton>
      </div>
    </header>
  );
}
