import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "gradient" | "outline" | "ghost";
type ButtonSize = "md" | "lg" | "sm";

type ButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
  className?: string;
  href?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
};

const variantClass: Record<ButtonVariant, string> = {
  gradient:
    "border-0 bg-gradient-to-r from-[#8b5cf6] via-[#7c5cff] to-[#3b82f6] text-white shadow-[0_10px_40px_rgba(99,102,241,0.35)] hover:brightness-110 hover:shadow-[0_14px_48px_rgba(99,102,241,0.45)]",
  outline:
    "border border-white/35 bg-white/5 text-white backdrop-blur-sm hover:border-white/55 hover:bg-white/10",
  ghost: "border-0 bg-transparent text-white/90 hover:text-white",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "h-9 gap-1.5 rounded-full px-4 text-sm",
  md: "h-11 gap-2 rounded-full px-5 text-sm",
  lg: "h-12 gap-2.5 rounded-full px-6 text-base sm:h-[3.25rem] sm:px-7",
};

export function Button({
  variant = "gradient",
  size = "md",
  leftIcon,
  rightIcon,
  children,
  className,
  href,
  type = "button",
  disabled,
  onClick,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center font-sans font-semibold transition-colors duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a78bfa] disabled:pointer-events-none disabled:opacity-50",
    variantClass[variant],
    sizeClass[size],
    className,
  );

  const content = (
    <>
      {leftIcon ? <span className="inline-flex shrink-0">{leftIcon}</span> : null}
      <span>{children}</span>
      {rightIcon ? <span className="inline-flex shrink-0">{rightIcon}</span> : null}
    </>
  );

  if (href) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled} onClick={onClick}>
      {content}
    </button>
  );
}
