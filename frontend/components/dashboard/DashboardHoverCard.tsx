"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type DashboardHoverCardProps = {
  children: ReactNode;
  className?: string;
};

/**
 * CSS hover lift — avoids Framer spring work on every card.
 */
export function DashboardHoverCard({
  children,
  className,
}: DashboardHoverCardProps) {
  return (
    <div
      className={cn(
        "group relative h-full transition-transform duration-200 ease-out will-change-transform hover:-translate-y-1 hover:z-20",
        "[&>*]:h-full [&>*]:transition-[box-shadow,background-color] [&>*]:duration-200 [&>*]:ease-out",
        "[&>*]:hover:bg-white [&>*]:hover:shadow-[0_18px_40px_rgba(15,15,25,0.1)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
