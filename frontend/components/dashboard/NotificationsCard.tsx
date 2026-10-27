"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { AppImage } from "@/components/ui/Image";
import { cn } from "@/lib/cn";

const tabs = ["Overview", "Shared", "Comments"] as const;

const items = [
  {
    name: "Jennifer Campbell",
    text: "invites you to a brainstorm session",
    time: "30 mins ago",
    tag: "Invite",
    src: "/features/avatar-1.jpg",
  },
  {
    name: "Marcus Lee",
    text: "shared a new project board with you",
    time: "1 hour ago",
    tag: "Shared",
    src: "/features/avatar-2.jpg",
  },
  {
    name: "Ava Martinez",
    text: "commented on your latest video draft",
    time: "2 hours ago",
    tag: "Comment",
    src: "/features/avatar-3.jpg",
  },
];

export function NotificationsCard() {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Overview");

  return (
    <section className="rounded-[22px] bg-white p-3.5 shadow-[0_10px_28px_rgba(20,20,40,0.06)]">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-sans text-[13px] font-bold text-[#1a1a1f]">Notifications</h2>
        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#8b849c] hover:bg-[#f3f1f8]"
          aria-label="Search notifications"
        >
          <Search className="h-4 w-4" strokeWidth={1.8} />
        </button>
      </div>

      <div className="mt-3 flex gap-1 border-b border-[#efeaf8]">
        {tabs.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={cn(
              "relative px-2.5 pb-2.5 font-sans text-[12px] font-semibold transition",
              tab === item ? "text-[#1a1a1f]" : "text-[#8b849c] hover:text-[#1a1a1f]",
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
        {items.map((item) => (
          <li key={item.name} className="flex items-start gap-2.5">
            <span className="relative mt-0.5 h-9 w-9 shrink-0 overflow-hidden rounded-full">
              <AppImage src={item.src} alt="" fill className="object-cover" sizes="36px" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-sans text-[12px] leading-snug text-[#3d3558]">
                <span className="font-semibold text-[#1a1a1f]">{item.name}</span>{" "}
                {item.text}
              </p>
              <p className="mt-1 font-sans text-[10px] text-[#9a93a8]">{item.time}</p>
            </div>
            <span className="shrink-0 rounded-[10px] bg-gradient-to-r from-[#a78bfa] via-[#8b5cf6] to-[#3b82f6] px-2.5 py-1 font-sans text-[9px] font-semibold text-white">
              {item.tag}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
