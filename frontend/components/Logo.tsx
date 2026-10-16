import { AppImage } from "@/components/ui/Image";
import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";

type LogoProps = {
  className?: string;
  href?: string;
};

export function Logo({ className, href = "#" }: LogoProps) {
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
        src="/clipforge-mark.png"
        alt=""
        width={64}
        height={64}
        priority
        className="h-8 w-8 shrink-0"
        aria-hidden
      />
      <Typography
        as="span"
        variant="nav"
        tone="white"
        weight="bold"
        className="text-[1.125rem] leading-none tracking-tight"
      >
        ClipForge
      </Typography>
    </a>
  );
}
