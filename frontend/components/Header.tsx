import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import {
  GhostButton,
  GhostInkButton,
  GradientButton,
} from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";

const navLinks = [
  { label: "Features", href: "/#features" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Testimonials", href: "/#testimonials" },
] as const;

type HeaderProps = {
  className?: string;
  /** Dark sits on the navy hero. Light sits on white/lavender pages. */
  tone?: "dark" | "light";
};

export function Header({ className, tone = "dark" }: HeaderProps) {
  const isLight = tone === "light";

  return (
    <header
      className={cn(
        "relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8",
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
          <GhostInkButton size="sm" href="/#login">
            Log In
          </GhostInkButton>
        ) : (
          <GhostButton size="sm" href="/#login" className="hidden sm:inline-flex">
            Log In
          </GhostButton>
        )}
        <GradientButton
          size="sm"
          href="/#start"
          rightIcon={<Icon icon={ArrowRight} size="md" />}
        >
          <span className="hidden sm:inline">Get Started Free</span>
          <span className="sm:hidden">Start</span>
        </GradientButton>
      </div>
    </header>
  );
}
