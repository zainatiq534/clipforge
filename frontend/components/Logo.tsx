import { AppImage } from "@/components/ui/Image";
import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";

type LogoProps = {
  className?: string;
  href?: string;
  /** `light` = dark navy wordmark for light page headers (blog article). */
  tone?: "dark" | "light";
};

export function Logo({ className, href = "#", tone = "dark" }: LogoProps) {
  const isLight = tone === "light";

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
        className={cn(
          "relative isolate block shrink-0 overflow-hidden bg-[#7c3aed]",
          isLight
            ? "h-9 w-9 rounded-[11px] shadow-[0_6px_18px_rgba(124,58,237,0.32)] sm:h-10 sm:w-10 sm:rounded-[12px]"
            : "h-11 w-11 rounded-[13px] shadow-[0_8px_24px_rgba(124,58,237,0.45)]",
        )}
        aria-hidden
      >
        <AppImage
          src="/clipforge-icon.png"
          alt=""
          width={88}
          height={88}
          className="absolute inset-0 h-full w-full max-w-none scale-[1.02] object-cover object-center"
        />
      </span>
      {isLight ? (
        <span className="font-sans text-lg font-bold tracking-tight text-[#1e1b4b]">
          ClipForge
        </span>
      ) : (
        <Typography as="span" variant="nav" tone="white" weight="bold" className="text-lg">
          ClipForge
        </Typography>
      )}
    </a>
  );
}
