"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { EDITOR_FOCUS, EDITOR_PANEL } from "@/components/dashboard/editor/editorUi";

export type EditorRailTool = {
  id: string;
  label: string;
  icon: LucideIcon;
};

type EditorToolRailProps = {
  tools: readonly EditorRailTool[];
  activeId: string;
  onSelect: (id: string) => void;
  className?: string;
};

/** Light vertical tool rail — CapCut-style ClipForge chrome. */
export function EditorToolRail({
  tools,
  activeId,
  onSelect,
  className,
}: EditorToolRailProps) {
  return (
    <aside
      className={cn(
        EDITOR_PANEL,
        "flex flex-row gap-1 p-1.5 lg:w-[72px] lg:flex-col lg:items-stretch",
        className,
      )}
      aria-label="Editor tools"
    >
      {tools.map((tool) => {
        const Icon = tool.icon;
        const active = activeId === tool.id;
        return (
          <button
            key={tool.id}
            type="button"
            title={tool.label}
            aria-label={tool.label}
            aria-pressed={active}
            onClick={() => onSelect(tool.id)}
            className={cn(
              EDITOR_FOCUS,
              "inline-flex min-h-[48px] flex-1 flex-col items-center justify-center gap-1 rounded-[12px] px-1 py-2 transition duration-150 lg:flex-none",
              active
                ? "bg-gradient-to-br from-[#a78bfa] via-[#8b5cf6] to-[#3b82f6] text-white shadow-[0_8px_18px_rgba(99,102,241,0.28)]"
                : "bg-[#f5f3ff] text-[#6b6680] hover:text-[#111827]",
            )}
          >
            <Icon className="h-4 w-4" strokeWidth={1.8} />
            <span className="font-sans text-[9px] font-semibold tracking-wide">
              {tool.label}
            </span>
          </button>
        );
      })}
    </aside>
  );
}
