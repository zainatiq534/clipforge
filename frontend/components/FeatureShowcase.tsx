import { MoreHorizontal } from "lucide-react";
import { FloatingClipCards } from "@/components/FloatingClipCards";
import { ShowcaseVideoPlayer } from "@/components/ShowcaseVideoPlayer";
import { AppImage } from "@/components/ui/Image";
import { Icon } from "@/components/ui/Icon";
import { Typography } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";

const moments = [
  {
    time: "02:14 – 02:41",
    score: 96,
    quote: '"Don\'t make this mistake..."',
    tag: "High Viral Potential",
    tagClass: "bg-[#db2777]/25 text-[#f9a8d4] border-[#db2777]/35",
    scoreClass: "bg-[#db2777]/30 text-[#f9a8d4]",
  },
  {
    time: "05:02 – 05:28",
    score: 92,
    quote: '"Here\'s what nobody tells you"',
    tag: "Strong Hook",
    tagClass: "bg-[#8b5cf6]/25 text-[#d4b8ff] border-[#9b7bff]/35",
    scoreClass: "bg-[#8b5cf6]/30 text-[#d4b8ff]",
  },
  {
    time: "08:41 – 09:05",
    score: 88,
    quote: '"This changed everything"',
    tag: "High Retention",
    tagClass: "bg-[#3b82f6]/25 text-[#93c5fd] border-[#3b82f6]/35",
    scoreClass: "bg-[#3b82f6]/30 text-[#93c5fd]",
  },
];

type FeatureShowcaseProps = {
  className?: string;
};

export function FeatureShowcase({ className }: FeatureShowcaseProps) {
  return (
    <div className={cn("relative mx-auto w-full max-w-[560px] lg:max-w-none", className)}>
      {/* Dark glass app window — hero theme */}
      <div className="relative z-10 overflow-hidden rounded-[22px] border border-white/15 bg-[#0d1020]/85 shadow-[0_24px_80px_rgba(99,102,241,0.28)] backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <AppImage
              src="/clipforge-icon.png"
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 rounded-lg object-cover"
            />
            <Typography as="span" variant="nav" tone="white" weight="bold">
              ClipForge
            </Typography>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 items-center rounded-xl bg-gradient-to-r from-[#a78bfa] via-[#8b5cf6] to-[#3b82f6] px-3 text-xs font-semibold text-white shadow-[0_8px_24px_rgba(99,102,241,0.35)]">
              Export Clips
            </span>
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl text-white/50">
              <Icon icon={MoreHorizontal} size="md" />
            </span>
          </div>
        </div>

        <div className="grid gap-3 p-3 sm:grid-cols-[1.35fr_1fr] sm:p-4">
          <div className="min-w-0">
            <ShowcaseVideoPlayer />

            <div className="mt-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 backdrop-blur-sm">
              <div className="flex h-10 items-end gap-[2px]">
                {Array.from({ length: 48 }).map((_, i) => {
                  const h = 20 + ((i * 17) % 55);
                  const band =
                    i < 14
                      ? "bg-[#a78bfa]"
                      : i < 28
                        ? "bg-[#60a5fa]"
                        : i < 40
                          ? "bg-[#f472b6]"
                          : "bg-white/25";
                  return (
                    <span
                      key={i}
                      className={cn("w-full rounded-sm opacity-85", band)}
                      style={{ height: `${h}%` }}
                    />
                  );
                })}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="rounded-md border border-[#9b7bff]/35 bg-[#8b5cf6]/25 px-2 py-0.5 text-[10px] font-semibold text-[#d4b8ff]">
                  Hook Score 92
                </span>
                <span className="rounded-md border border-[#3b82f6]/35 bg-[#3b82f6]/25 px-2 py-0.5 text-[10px] font-semibold text-[#93c5fd]">
                  Engaging Score 78
                </span>
                <span className="rounded-md border border-[#db2777]/35 bg-[#db2777]/25 px-2 py-0.5 text-[10px] font-semibold text-[#f9a8d4]">
                  Viral Moment Score 96
                </span>
              </div>
            </div>
          </div>

          <div className="min-w-0 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
            <Typography as="p" variant="label" tone="purple" className="tracking-wide">
              Best Moments Found
            </Typography>
            <ul className="mt-2.5 space-y-2.5">
              {moments.map((m) => (
                <li
                  key={m.time}
                  className="relative rounded-xl border border-white/10 bg-[#0d1020]/70 p-2 shadow-[0_8px_24px_rgba(5,8,20,0.35)]"
                >
                  <span
                    className={cn(
                      "absolute right-2 top-2 rounded-md px-1.5 py-0.5 text-[10px] font-bold",
                      m.scoreClass,
                    )}
                  >
                    {m.score}
                  </span>
                  <div className="flex gap-2 pr-8">
                    <div className="relative h-11 w-9 shrink-0 overflow-hidden rounded-md border border-[#c4b5fd]/60 bg-white/10 shadow-[0_0_10px_rgba(139,92,246,0.25)]">
                      <AppImage
                        src="/features/speaker.jpg"
                        alt=""
                        fill
                        className="object-cover"
                        sizes="36px"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-medium text-white/50">{m.time}</p>
                      <p className="truncate text-xs font-semibold text-white">{m.quote}</p>
                      <span
                        className={cn(
                          "mt-1 inline-flex rounded-full border px-2 py-0.5 text-[9px] font-semibold",
                          m.tagClass,
                        )}
                      >
                        {m.tag}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <FloatingClipCards />
    </div>
  );
}
