"use client";

import Link from "next/link";
import { Flame } from "lucide-react";

type BrainstormCardProps = {
  topScore?: number;
  clipCount?: number;
};

export function BrainstormCard({
  topScore = 0,
  clipCount = 0,
}: BrainstormCardProps) {
  return (
    <Link
      href="/dashboard/viral"
      className="flex items-center gap-3 rounded-[18px] bg-gradient-to-r from-[#a78bfa] via-[#8b5cf6] to-[#3b82f6] px-4 py-3 shadow-[0_10px_28px_rgba(99,102,241,0.28)] transition hover:brightness-105"
    >
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-[12px] bg-white/20 text-white">
        <Flame className="h-4 w-4" strokeWidth={1.8} />
      </span>
      <div className="min-w-0">
        <p className="font-sans text-[12px] font-semibold text-white">
          {clipCount
            ? `Top viral score ${topScore || "—"}`
            : "Generate viral scores"}
        </p>
        <p className="truncate font-sans text-[10px] text-white/80">
          {clipCount
            ? `${clipCount} clip${clipCount === 1 ? "" : "s"} ranked`
            : "Open Viral Score after clipping"}
        </p>
      </div>
    </Link>
  );
}
