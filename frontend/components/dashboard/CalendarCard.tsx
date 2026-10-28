"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, amount: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + amount);
  return d;
}

function addMonths(date: Date, amount: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + amount);
  return startOfDay(d);
}

function monthTitle(date: Date) {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isSameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function CalendarCard() {
  const today = useMemo(() => startOfDay(new Date()), []);
  // First day shown in the strip - starts at today, can go infinitely forward
  const [stripStart, setStripStart] = useState(() => startOfDay(new Date()));
  const [selected, setSelected] = useState(() => startOfDay(new Date()));

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(stripStart, i)),
    [stripStart],
  );

  const canGoBack =
    stripStart.getTime() > today.getTime() ||
    !isSameMonth(stripStart, today) ||
    selected.getTime() > today.getTime();

  function goPrev() {
    setStripStart((prev) => {
      const next = addDays(prev, -7);
      return next < today ? today : next;
    });
  }

  function goNext() {
    setStripStart((prev) => addDays(prev, 7));
  }

  function goPrevMonth() {
    setStripStart((prev) => {
      const next = addMonths(prev, -1);
      return next < today ? today : next;
    });
  }

  function goNextMonth() {
    setStripStart((prev) => addMonths(prev, 1));
  }

  return (
    <section className="rounded-[22px] bg-white p-3.5 shadow-[0_10px_28px_rgba(20,20,40,0.06)]">
      <div className="flex items-center justify-between">
        <h2 className="font-sans text-[13px] font-bold text-[#1a1a1f]">
          {monthTitle(stripStart)}
        </h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={goPrevMonth}
            disabled={isSameMonth(stripStart, today) && stripStart <= today}
            className={cn(
              "inline-flex h-7 w-7 items-center justify-center rounded-full",
              isSameMonth(stripStart, today) && stripStart <= today
                ? "cursor-not-allowed text-[#c5c0d0]"
                : "text-[#6b6680] hover:bg-[#f3f1f8]",
            )}
            aria-label="Previous month"
            title="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={goNextMonth}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-[#6b6680] hover:bg-[#f3f1f8]"
            aria-label="Next month"
            title="Next month (unlimited)"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {days.map((date) => {
          const active = isSameDay(date, selected);
          const isPast = date < today;
          return (
            <button
              key={date.toISOString()}
              type="button"
              disabled={isPast}
              onClick={() => setSelected(date)}
              className={cn(
                "flex min-w-[3.1rem] flex-col items-center rounded-[16px] px-2.5 py-2.5 transition",
                active
                  ? "bg-gradient-to-br from-[#a78bfa] via-[#8b5cf6] to-[#3b82f6] text-white shadow-[0_8px_18px_rgba(99,102,241,0.28)]"
                  : isPast
                    ? "cursor-not-allowed bg-[#f6f4fb] text-[#c5c0d0]"
                    : "bg-[#ede9fe] text-[#5b5568] hover:bg-[#ddd6fe]",
              )}
            >
              <span className="font-sans text-[10px] font-medium opacity-80">
                {DAY_LABELS[date.getDay()]}
              </span>
              <span className="mt-1 font-sans text-[14px] font-bold">
                {date.getDate()}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={goPrev}
          disabled={!canGoBack}
          className={cn(
            "font-sans text-[10px] font-semibold",
            canGoBack ? "text-[#6b6680] hover:text-[#1a1a1f]" : "text-[#c5c0d0]",
          )}
          aria-label="Previous week"
        >
          {"<"}
        </button>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#ece8f5]">
          <div className="h-full w-1/3 rounded-full bg-gradient-to-r from-[#a78bfa] to-[#3b82f6]" />
        </div>
        <button
          type="button"
          onClick={goNext}
          className="font-sans text-[10px] font-semibold text-[#6b6680] hover:text-[#1a1a1f]"
          aria-label="Next week"
        >
          {">"}
        </button>
      </div>
    </section>
  );
}
