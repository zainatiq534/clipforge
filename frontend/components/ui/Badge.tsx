import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Typography } from "@/components/ui/Typography";

type BadgeProps = {
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Badge({ icon, children, className }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-[#9b7bff]/45 bg-[#1a1230]/70 px-3.5 py-1.5 shadow-[0_0_24px_rgba(139,92,246,0.18)] backdrop-blur-md",
        className,
      )}
    >
      {icon ? <span className="inline-flex text-[#d4b8ff]">{icon}</span> : null}
      <Typography as="span" size="label" tone="purple">
        {children}
      </Typography>
    </div>
  );
}
