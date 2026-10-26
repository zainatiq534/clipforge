import { AppImage } from "@/components/ui/Image";
import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";

type LogoProps = {
  className?: string;
  href?: string;
  /** Dark = white wordmark (home hero). Light = ink wordmark (inner pages). */
  tone?: "dark" | "light";
};

export function Logo({ className, href = "/", tone = "dark" }: LogoProps) {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-center gap-2.5 transition-opacity hover:opacity-90",
        className,
      )}
      aria-label="ClipForge home"
    >
      <AppImage
        src="/clipforge-icon.png"
        alt=""
        width={64}
        height={64}
        priority
        unoptimized
        className="h-8 w-8 shrink-0 object-contain"
        aria-hidden
      />
      <Typography
        as="span"
        variant="nav"
        tone={tone === "light" ? "ink" : "white"}
        weight="bold"
        className="text-[1.125rem] leading-none tracking-tight"
      >
        ClipForge
      </Typography>
    </a>
  );
}
