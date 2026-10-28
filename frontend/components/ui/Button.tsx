import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant =
  | "gradient"
  | "outline"
  | "outlineInk"
  | "ghost"
  | "ghostInk"
  | "secondary"
  | "soft"
  | "danger";

export type ButtonSize = "sm" | "md" | "lg";

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
  fullWidth?: boolean;
};

const variantClass: Record<ButtonVariant, string> = {
  gradient:
    "border border-transparent bg-gradient-to-r from-[#a78bfa] via-[#8b5cf6] to-[#3b82f6] text-white shadow-[0_10px_40px_rgba(99,102,241,0.35)] hover:brightness-110 hover:shadow-[0_14px_48px_rgba(99,102,241,0.45)]",
  outline:
    "border border-white/40 bg-transparent text-white backdrop-blur-sm hover:border-white/70 hover:bg-white/5",
  /** Dark border + ink text for light backgrounds (How It Works, etc.) */
  outlineInk:
    "border border-[#111827] bg-transparent text-[#111827] hover:border-[#111827] hover:bg-[#111827]/5",
  ghost:
    "border border-transparent bg-transparent text-white/90 hover:text-white hover:bg-white/5",
  /** Dark text for light backgrounds (How It Works header Log In, etc.) */
  ghostInk:
    "border border-transparent bg-transparent text-[#4b5563] hover:bg-[#7c3aed]/8 hover:text-[#111827]",
  secondary:
    "border border-white/15 bg-white/10 text-white hover:bg-white/15",
  soft:
    "border border-transparent bg-[#8b5cf6]/20 text-[#e9d5ff] hover:bg-[#8b5cf6]/30",
  danger:
    "border border-transparent bg-red-500/90 text-white hover:bg-red-500",
};

/**
 * Soft rounded rectangle (not a full pill).
 * Matches the reference CTAs / media cards (~16–20px), not capsule ends.
 */
const sizeClass: Record<ButtonSize, string> = {
  sm: "h-9 gap-1.5 rounded-[14px] px-4 text-sm",
  md: "h-11 gap-2 rounded-[16px] px-5 text-sm",
  lg: "h-12 gap-2.5 rounded-[18px] px-6 text-base sm:h-[3.25rem] sm:rounded-[20px] sm:px-7",
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
  fullWidth = false,
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center overflow-hidden font-sans font-semibold transition-colors duration-200 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a78bfa] disabled:pointer-events-none disabled:opacity-50",
    variantClass[variant],
    sizeClass[size],
    fullWidth && "w-full",
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
      <a href={href} className={classes} onClick={onClick}>
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

/** Named variant helpers so call sites stay clear and unmerged. */
export function GradientButton(props: Omit<ButtonProps, "variant">) {
  return <Button {...props} variant="gradient" />;
}

export function OutlineButton(props: Omit<ButtonProps, "variant">) {
  return <Button {...props} variant="outline" />;
}

export function OutlineInkButton(props: Omit<ButtonProps, "variant">) {
  return <Button {...props} variant="outlineInk" />;
}

export function GhostButton(props: Omit<ButtonProps, "variant">) {
  return <Button {...props} variant="ghost" />;
}

export function GhostInkButton(props: Omit<ButtonProps, "variant">) {
  return <Button {...props} variant="ghostInk" />;
}

export function SecondaryButton(props: Omit<ButtonProps, "variant">) {
  return <Button {...props} variant="secondary" />;
}

export function SoftButton(props: Omit<ButtonProps, "variant">) {
  return <Button {...props} variant="soft" />;
}

export function DangerButton(props: Omit<ButtonProps, "variant">) {
  return <Button {...props} variant="danger" />;
}
