import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "Testimonials", href: "#testimonials" },
];

type HeaderProps = {
  className?: string;
};

export function Header({ className }: HeaderProps) {
  return (
    <header
      className={cn(
        "relative z-20 mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8",
        className,
      )}
    >
      <Logo />

      <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
        {navLinks.map((link) => (
          <a key={link.href} href={link.href} className="group">
            <Typography
              as="span"
              size="nav"
              tone="muted"
              className="transition-colors group-hover:text-white"
            >
              {link.label}
            </Typography>
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-2 sm:gap-3">
        <Button variant="ghost" size="sm" href="#login" className="hidden sm:inline-flex">
          Log In
        </Button>
        <Button
          variant="gradient"
          size="sm"
          href="#start"
          rightIcon={<ArrowRight className="h-4 w-4" strokeWidth={2.25} />}
          className="sm:size-auto"
        >
          <span className="hidden sm:inline">Start Creating Clips</span>
          <span className="sm:hidden">Start</span>
        </Button>
      </div>
    </header>
  );
}
