import { cn } from "@/lib/cn";

const aiLabels = [
  { text: "Finds key moments", pos: "left-0 top-0 -translate-x-[15%] -translate-y-[20%]" },
  { text: "Detects hooks", pos: "right-0 top-0 translate-x-[10%] -translate-y-[20%]" },
  {
    text: "Auto captions & reframing",
    pos: "left-0 bottom-0 -translate-x-[20%] translate-y-[15%]",
  },
  {
    text: "Creates multiple variations",
    pos: "right-0 bottom-0 translate-x-[8%] translate-y-[15%]",
  },
];

type AiEngineShowcaseProps = {
  className?: string;
};

export function AiEngineShowcase({ className }: AiEngineShowcaseProps) {
  return (
    <div
      className={cn(
        "relative mx-auto grid w-full items-center gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,0.7fr)_minmax(0,1.15fr)] lg:gap-4 xl:gap-6",
        className,
      )}
    >
      {/* ── Long Video Input ── */}
      <div className="relative w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/features/long-video-input.png"
          alt="Long Video Input — podcast episode ready for ClipForge AI"
          width={316}
          height={281}
          className="h-auto w-full object-contain drop-shadow-[0_0_24px_rgba(139,92,246,0.28)]"
          decoding="async"
        />
      </div>

      {/* ── ClipForge AI node ── */}
      <div className="relative mx-auto flex w-full max-w-[220px] flex-col items-center justify-center py-8 lg:max-w-none lg:py-4">
        <svg
          className="pointer-events-none absolute inset-x-[-20%] top-1/2 hidden h-8 -translate-y-1/2 text-[#a78bfa] lg:block"
          viewBox="0 0 200 32"
          fill="none"
          aria-hidden
        >
          <path
            d="M8 16 H78 M122 16 H192"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="4 4"
            opacity="0.7"
          />
          <path
            d="M72 10l8 6-8 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M186 10l8 6-8 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <div className="relative z-10">
          {aiLabels.map((label) => (
            <span
              key={label.text}
              className={cn(
                "absolute z-20 hidden whitespace-nowrap rounded-full border border-[#ddd6fe] bg-white px-2 py-1 font-sans text-[9px] font-bold text-[#7c3aed] shadow-sm xl:inline-flex",
                label.pos,
              )}
            >
              {label.text}
            </span>
          ))}

          <div className="relative flex h-[7.5rem] w-[7.5rem] flex-col items-center justify-center rounded-[22px] bg-gradient-to-br from-[#a78bfa] via-[#8b5cf6] to-[#6d28d9] shadow-[0_0_0_6px_rgba(196,181,253,0.35),0_16px_40px_rgba(109,40,217,0.4)] sm:h-[8.5rem] sm:w-[8.5rem]">
            <div
              className="pointer-events-none absolute inset-2 rounded-full border border-dashed border-white/50"
              aria-hidden
            />
            <span className="font-sans text-[1.65rem] font-extrabold tracking-tight text-white sm:text-[1.85rem]">
              AI
            </span>
            <span className="mt-0.5 font-sans text-[9px] font-bold tracking-[0.08em] text-white/90 uppercase sm:text-[10px]">
              ClipForge AI
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-1.5 xl:hidden">
          {aiLabels.map((label) => (
            <span
              key={label.text}
              className="rounded-full border border-[#ddd6fe] bg-white px-2 py-1 font-sans text-[9px] font-bold text-[#7c3aed]"
            >
              {label.text}
            </span>
          ))}
        </div>
      </div>

      {/* ── 6 Viral-Ready Clips (exact mockup — unchanged) ── */}
      <div className="relative w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/features/viral-clips-panel.png"
          alt="6 viral-ready clips generated from one long video"
          width={284}
          height={286}
          className="h-auto w-full object-contain drop-shadow-[0_0_24px_rgba(139,92,246,0.28)]"
          decoding="async"
        />
      </div>
    </div>
  );
}
