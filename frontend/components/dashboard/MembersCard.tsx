"use client";

import Link from "next/link";
import { Settings } from "lucide-react";
import type { StorageQuotaSnapshot, UserProfile } from "@/lib/api";
import { AppImage } from "@/components/ui/Image";
import {
  formatBytesShort,
  userInitials,
} from "@/components/dashboard/useDashboardHome";

type MembersCardProps = {
  user: UserProfile | null;
  storage: StorageQuotaSnapshot | null;
  loading?: boolean;
};

export function MembersCard({ user, storage, loading }: MembersCardProps) {
  const initials = userInitials(user);
  const name =
    user?.displayName?.trim() ||
    user?.email?.split("@")[0] ||
    (loading ? "Loading…" : "Your studio");
  const plan = storage?.planLabel ?? "Free";
  const used = formatBytesShort(storage?.storageBytesUsed ?? 0);
  const limit = formatBytesShort(storage?.storageBytesLimit ?? 0);
  const pct = storage?.storagePercent ?? 0;

  return (
    <section className="rounded-[22px] bg-white p-3.5 shadow-[0_10px_28px_rgba(20,20,40,0.06)]">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-sans text-[13px] font-bold text-[#1a1a1f]">
          Profile
        </h2>
        <Link
          href="/dashboard/settings"
          className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[#8b849c] hover:bg-[#f3f1f8] hover:text-[#7c3aed]"
          aria-label="Open settings"
          title="Settings"
        >
          <Settings className="h-3.5 w-3.5" strokeWidth={1.8} />
        </Link>
      </div>

      <div className="mt-4 flex flex-col items-center text-center">
        <span className="relative grid h-14 w-14 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-[#e879f9] via-[#a855f7] to-[#7c3aed] font-sans text-[15px] font-extrabold text-white shadow-[0_10px_24px_rgba(124,58,237,0.28)]">
          {user?.photoURL ? (
            <AppImage
              src={user.photoURL}
              alt=""
              fill
              className="object-cover"
              sizes="56px"
            />
          ) : (
            initials
          )}
        </span>
        <p className="mt-2.5 max-w-full truncate font-sans text-[12px] font-bold text-[#1a1a1f]">
          {name}
        </p>
        <p className="mt-0.5 max-w-full truncate font-sans text-[10px] text-[#7a738c]">
          {user?.email || (loading ? "…" : "Signed in")}
        </p>
        <span className="mt-2 rounded-[10px] bg-[#ede9fe] px-2 py-0.5 font-sans text-[10px] font-semibold text-[#7c3aed]">
          {plan} plan
        </span>
      </div>

      <div className="mt-4 rounded-[14px] bg-[#f7f5fb] px-3 py-2.5">
        <div className="flex items-center justify-between font-sans text-[10px] font-semibold">
          <span className="text-[#6b6680]">Storage</span>
          <span className="text-[#1a1a1f]">
            {used} / {limit}
          </span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#ede9fe]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#a78bfa] via-[#8b5cf6] to-[#3b82f6] transition-[width] duration-500"
            style={{ width: `${Math.min(100, pct)}%` }}
          />
        </div>
        <p className="mt-1.5 font-sans text-[9px] text-[#9a93a8]">
          {storage?.breakdown.uploadCount ?? 0} uploads ·{" "}
          {storage?.breakdown.clipCount ?? 0} clips
        </p>
      </div>
    </section>
  );
}
