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
      <span
        className="relative isolate block h-11 w-11 shrink-0 overflow-hidden rounded-[13px] shadow-[0_8px_24px_rgba(124,58,237,0.45)]"
        aria-hidden
      >
        <AppImage
          src="/clipforge-icon.png"
          alt=""
          width={88}
          height={88}
          className="absolute inset-0 h-full w-full max-w-none object-cover object-center"
        />
      </span>
      <Typography as="span" variant="nav" tone="white" weight="bold" className="text-lg">
        ClipForge
      </Typography>
    </a>
  );
}
