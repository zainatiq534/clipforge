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
];

type HeaderProps = {
  className?: string;
};

export function Header({ className }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8",
        className,
      )}
    >
      <Logo href="/" />

      <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
        {navLinks.map((link) => {
          const active = link.href === "/features" && pathname === "/features";

          return (
            <Link key={link.href} href={link.href} className="group">
              <Typography
                as="span"
                variant="nav"
                tone={active ? "white" : "muted"}
                className="transition-colors group-hover:text-white"
              >
                {link.label}
              </Typography>
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-2 sm:gap-3">
        <GhostButton size="sm" href="#login" className="hidden sm:inline-flex">
          Log In
        </GhostButton>
        <GradientButton
          size="sm"
          href="#start"
          rightIcon={<Icon icon={ArrowRight} size="md" />}
        >
          <span className="hidden sm:inline">Start Creating Clips</span>
          <span className="sm:hidden">Start</span>
        </GradientButton>
      </div>
    </header>
  );
}
