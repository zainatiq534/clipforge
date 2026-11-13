"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { cn } from "@/lib/cn";

const tabs = ["Overview", "Clips", "Uploads"] as const;

export type ActivityItem = {
  id: string;
  name: string;
  text: string;
  time: string;
  tag: string;
};

type NotificationsCardProps = {
  items: ActivityItem[];
  initials: string;
  loading?: boolean;
};

export function NotificationsCard({
  items,
  initials,
  loading,
}: NotificationsCardProps) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Overview");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = items;
    if (tab === "Clips") {
      list = list.filter(
        (i) => i.tag === "Clip" || i.tag === "Manual",
      );
    } else if (tab === "Uploads") {
      list = list.filter(
        (i) =>
          i.tag === "Upload" || i.tag === "Ready" || i.tag === "Failed",
      );
    }
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (i) =>
          i.text.toLowerCase().includes(q) ||
          i.name.toLowerCase().includes(q) ||
          i.tag.toLowerCase().includes(q),
      );
    }
    return list.slice(0, 6);
  }, [items, tab, query]);

  return (
    <section className="rounded-[22px] bg-white p-3.5 shadow-[0_10px_28px_rgba(20,20,40,0.06)]">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-sans text-[13px] font-bold text-[#1a1a1f]">
          Activity
        </h2>
        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#8b849c] hover:bg-[#f3f1f8]"
          aria-label="Search activity"
          onClick={() => setSearchOpen((v) => !v)}
        >
          <Search className="h-4 w-4" strokeWidth={1.8} />
        </button>
      </div>

      {searchOpen ? (
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search activity…"
          className="mt-2 w-full rounded-[12px] border-0 bg-[#f7f5fb] px-3 py-2 font-sans text-[12px] text-[#1a1a1f] outline-none ring-1 ring-[#ede9fe] focus:ring-[#c4b5fd]"
        />
      ) : null}

      <div className="mt-3 flex gap-1 border-b border-[#efeaf8]">
        {tabs.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={cn(
              "relative px-2.5 pb-2.5 font-sans text-[12px] font-semibold transition",
              tab === item
                ? "text-[#1a1a1f]"
                : "text-[#8b849c] hover:text-[#1a1a1f]",
            )}
          >
            {item}
            {tab === item ? (
              <span className="absolute right-2 bottom-0 left-2 h-0.5 rounded-full bg-gradient-to-r from-[#a78bfa] to-[#3b82f6]" />
            ) : null}
          </button>
        ))}
      </div>

      <ul className="mt-3 space-y-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <li
              key={i}
              className="h-12 animate-pulse rounded-[14px] bg-[#f7f5fb]"
            />
          ))
        ) : filtered.length === 0 ? (
          <li className="rounded-[14px] bg-[#f7f5fb] px-3 py-5 text-center font-sans text-[11px] text-[#7a738c]">
            No activity yet. Upload a video to get started.
            <div className="mt-2">
              <Link
                href="/dashboard/upload"
                className="font-semibold text-[#7c3aed] hover:underline"
              >
                Go to Upload
              </Link>
            </div>
          </li>
        ) : (
          filtered.map((item) => (
            <li key={item.id} className="flex items-start gap-2.5">
              <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#a78bfa] to-[#7c3aed] font-sans text-[10px] font-bold text-white">
                {initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-sans text-[12px] leading-snug text-[#3d3558]">
                  <span className="font-semibold text-[#1a1a1f]">
                    {item.name}
                  </span>{" "}
                  {item.text}
                </p>
                <p className="mt-1 font-sans text-[10px] text-[#9a93a8]">
                  {item.time}
                </p>
              </div>
              <span className="shrink-0 rounded-[10px] bg-gradient-to-r from-[#a78bfa] via-[#8b5cf6] to-[#3b82f6] px-2.5 py-1 font-sans text-[9px] font-semibold text-white">
                {item.tag}
              </span>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
