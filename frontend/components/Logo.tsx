import Image from "next/image";
import { cn } from "@/lib/cn";
import { Typography } from "@/components/ui/Typography";

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
        className="relative block h-11 w-11 shrink-0 overflow-hidden rounded-[0.85rem] shadow-[0_8px_24px_rgba(124,58,237,0.45)]"
        aria-hidden
      >
        <Image
          src="/clipforge-icon.png"
          alt=""
          fill
          sizes="44px"
          className="object-cover object-center"
        />
      </span>
      <Typography as="span" size="nav" tone="white" weight="bold" className="text-lg">
        ClipForge
      </Typography>
    </a>
  );
}
