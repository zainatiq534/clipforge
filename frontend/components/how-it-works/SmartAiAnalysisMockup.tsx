import {
  Captions,
  Fullscreen,
  Pause,
  Play,
  Scissors,
  Sparkles,
  Volume2,
} from "lucide-react";
import { AppImage } from "@/components/ui/Image";
import { cn } from "@/lib/cn";

const analysisSteps = [
  "Analyzing video...",
  "Finding key moments...",
  "Creating clips...",
] as const;

const parameters = [
  {
    title: "Engagement Hotspot",
    meta: "Score: 94%",
    icon: <EngagementHotspotIcon />,
  },
  {
    title: "Topic Tagging: Tech",
    meta: "Tag Accuracy: 98%",
    icon: <TopicTaggingIcon />,
  },
  {
    title: "Speaker Shift",
    meta: "Dynamic Flow+",
    icon: <SpeakerShiftIcon />,
  },
  {
    title: "Pacing Shift",
    meta: "Optimal Pace+",
    icon: <PacingShiftIcon />,
  },
] as const;

const actions = [
  { label: "Trim End", icon: <Scissors className="h-3.5 w-3.5" strokeWidth={2.25} /> },
  { label: "Extend Moment", icon: <ExtendMomentIcon /> },
  { label: "Add Transition", icon: <AddTransitionIcon /> },
] as const;

/** Exact badges cropped/matched from the user reference */
const segmentMarks = [
  {
    label: "Trim",
    fill: "#8b5cf6",
    bar: "bg-[#8b5cf6]",
    src: "/seg-badge-0.png",
  },
  {
    label: "Link",
    fill: "#38bdf8",
    bar: "bg-[#38bdf8]",
    src: "/seg-badge-1.png",
  },
  {
    label: "Flow",
    fill: "#34d399",
    bar: "bg-[#34d399]",
    src: "/seg-badge-2.png",
  },
  {
    label: "Rewind",
    fill: "#a78bfa",
    bar: "bg-[#a78bfa]",
    src: "/seg-badge-3.png",
  },
] as const;

type SmartAiAnalysisMockupProps = {
  className?: string;
};

export function SmartAiAnalysisMockup({ className }: SmartAiAnalysisMockupProps) {
  return (
    <div className={cn("relative w-full", className)}>
      {/* Best moments chip */}
      <div className="absolute -top-3 right-4 z-20 sm:-top-4 sm:right-6">
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5",
            "border border-[#c4b5fd] bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa]",
            "text-[0.68rem] font-bold text-white shadow-[0_8px_20px_-8px_rgba(139,92,246,0.7)] sm:text-[0.72rem]",
          )}
        >
          <Sparkles className="h-3 w-3" strokeWidth={2.5} />
          Best moments found
        </span>
      </div>

      {/* Main card — tight around video + equal side panels */}
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl bg-white sm:rounded-[1.25rem]",
          "border border-[#e8e4f0]",
          "shadow-[0_28px_60px_-18px_rgba(124,58,237,0.28),0_12px_28px_-16px_rgba(15,23,42,0.12)]",
        )}
      >
        <div className="grid grid-cols-1 overflow-hidden lg:grid-cols-[11.25rem_minmax(0,1fr)_12.25rem] lg:items-stretch">
          {/* Left — AI Analysis */}
          <aside className="flex min-w-0 border-b border-[#eeeaf5] p-1.5 sm:p-2 lg:border-r lg:border-b-0">
            <div
              className={cn(
                "flex w-full flex-col rounded-xl border border-[#c4b5fd]/80 bg-[#fcfbfe] p-2",
                "shadow-[0_0_10px_rgba(196,181,253,0.28)]",
              )}
            >
              <div className="mt-2.5 flex items-center gap-2 sm:mt-3">
                <span className="relative inline-flex h-8 w-8 shrink-0 overflow-hidden rounded-full shadow-[0_0_12px_rgba(167,139,250,0.45)] ring-2 ring-[#ddd6fe]">
                  <AppImage
                    src="/ai-analysis-brain.png"
                    alt=""
                    fill
                    quality={100}
                    sizes="32px"
                    className="object-cover object-center"
                  />
                </span>
                <p className="text-[0.74rem] font-extrabold tracking-tight text-[#0f172a]">
                  AI Analysis
                </p>
              </div>

              <ul className="mt-auto mb-auto flex flex-1 flex-col justify-center space-y-2.5 pt-3 pb-1">
                {analysisSteps.map((step) => (
                  <li key={step} className="flex items-center gap-2">
                    <span className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-[#8b5cf6] text-white shadow-[0_0_8px_rgba(139,92,246,0.45)]">
                      <svg viewBox="0 0 12 12" className="h-2 w-2" aria-hidden>
                        <path
                          d="M2.5 6.2 4.8 8.5 9.5 3.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    <span className="text-[0.66rem] leading-snug font-bold text-[#0f172a]">
                      {step}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mb-2.5 pt-1 sm:mb-3">
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[0.58rem] font-bold text-[#475569]">Progress</span>
                  <span className="text-[0.58rem] font-extrabold text-[#6d28d9]">80%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#ede9fe] ring-1 ring-[#c4b5fd]/50">
                  <div className="h-full w-[80%] rounded-full bg-gradient-to-r from-[#a78bfa] to-[#8b5cf6] shadow-[0_0_10px_rgba(167,139,250,0.55)]" />
                </div>
              </div>
            </div>
          </aside>

          {/* Center — video nudged slightly down / vertically centered in column */}
          <div className="flex min-w-0 max-w-full items-center overflow-hidden border-b border-[#eeeaf5] p-1.5 sm:p-2 lg:border-b-0">
            <div className="relative mt-2 w-full max-w-full aspect-[16/11] overflow-hidden rounded-sm bg-[#0f1219] ring-1 ring-[#1f2430] sm:mt-2.5">
              <AppImage
                src="/ai-analysis-man-hq.jpg"
                alt="AI analyzing a long-form video"
                fill
                quality={100}
                priority
                sizes="(max-width: 1024px) 80vw, 420px"
                className="object-cover object-[50%_20%]"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent px-2 pt-7 pb-1.5 sm:px-2.5 sm:pb-2">
                <div className="flex items-center gap-2">
                  <Pause className="h-3 w-3 shrink-0 fill-white text-white" strokeWidth={0} />
                  <span className="shrink-0 text-[0.62rem] font-semibold text-white">
                    0:32 / 44:00
                  </span>
                  <div className="relative mx-0.5 h-[3px] min-w-0 flex-1 rounded-full bg-white/25">
                    <div className="absolute inset-y-0 left-0 w-[22%] rounded-full bg-[#a78bfa]" />
                    <span className="absolute top-1/2 left-[22%] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
                  </div>
                  <Volume2 className="h-3 w-3 text-white/90" strokeWidth={2} />
                  <Captions className="h-3 w-3 text-white/90" strokeWidth={2} />
                  <Fullscreen className="h-3 w-3 text-white/90" strokeWidth={2} />
                </div>
              </div>
            </div>
          </div>

          {/* Right — AI-detected Parameters (matched text scale) */}
          <aside className="relative z-10 flex min-w-0 p-1.5 sm:p-2">
            <div
              className={cn(
                "flex w-full flex-col rounded-xl border border-[#c4b5fd]/80 bg-[#fcfbfe] p-2",
                "shadow-[0_0_10px_rgba(196,181,253,0.28)]",
              )}
            >
              <p className="text-[0.74rem] font-extrabold tracking-tight text-[#0f172a]">
                AI-detected Parameters
              </p>

              <ul className="mt-2 flex-1 space-y-0">
                {parameters.map((param) => (
                  <li
                    key={param.title}
                    className="border-b border-[#e9e2f8] py-1.5 last:border-b-0"
                  >
                    <div className="flex items-start gap-2">
                      <span
                        className={cn(
                          "mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                          "border border-[#c4b5fd]/90 bg-white text-[#8b5cf6]",
                          "shadow-[0_0_8px_rgba(167,139,250,0.35)]",
                        )}
                      >
                        {param.icon}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-[0.66rem] leading-snug font-extrabold text-[#0f172a]">
                          {param.title}
                        </p>
                        <p className="mt-0.5 text-[0.58rem] font-semibold text-[#475569]">
                          {param.meta}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-auto rounded-lg border border-[#ddd6fe] bg-white px-2 py-1.5 shadow-[0_0_8px_rgba(196,181,253,0.22)]">
                <p className="text-[0.58rem] font-bold text-[#334155]">
                  Keyword Heatmap
                </p>
                <p className="mt-0.5 text-[0.66rem] font-extrabold text-[#6d28d9]">
                  Best Heat %: 88
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Outside center under the card — actions + segments */}
      <div className="mx-auto mt-4 flex w-full max-w-xl flex-col items-center sm:mt-5">
        <div className="flex w-full flex-row flex-wrap items-center justify-center gap-2 sm:gap-2.5">
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl px-3 py-2 sm:rounded-2xl sm:px-3.5",
                "border border-[#c4b5fd] bg-white",
                "text-[0.72rem] font-bold text-[#0f172a] sm:text-[0.78rem]",
                "shadow-[0_0_10px_rgba(196,181,253,0.32)]",
              )}
            >
              <span className="text-[#7c3aed]">{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>

        <div className="mt-4 w-full sm:mt-5">
          <div className="flex items-end gap-2">
            <span className="mb-[0.35rem] w-3.5 shrink-0" aria-hidden />
            <div className="grid min-w-0 flex-1 grid-cols-4 gap-1">
              {segmentMarks.map((mark) => (
                <div key={mark.label} className="flex flex-col items-center">
                  <span
                    className="relative block h-9 w-9 bg-transparent"
                    title={mark.label}
                  >
                    {/* unoptimized keeps PNG alpha (no white plate from image optimizer) */}
                    <AppImage
                      src={mark.src}
                      alt={mark.label}
                      fill
                      unoptimized
                      quality={100}
                      sizes="48px"
                      className="bg-transparent object-contain object-center"
                    />
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-0.5 flex items-center gap-2">
            <Play
              className="h-3.5 w-3.5 shrink-0 fill-[#0f172a] text-[#0f172a]"
              strokeWidth={0}
              aria-hidden
            />
            <div className="flex h-3.5 min-w-0 flex-1 gap-1">
              {segmentMarks.map((seg, i) => (
                <div
                  key={seg.label}
                  className={cn(
                    "h-full min-w-0 flex-1",
                    seg.bar,
                    i === 0 && "rounded-l-full",
                    i === segmentMarks.length - 1 && "rounded-r-full",
                    i > 0 && i < segmentMarks.length - 1 && "rounded-sm",
                  )}
                />
              ))}
            </div>
          </div>

          {/* Bracket label under middle segments — same as reference */}
          <div className="mt-1.5 flex items-start gap-2">
            <span className="w-3.5 shrink-0" aria-hidden />
            <div className="grid min-w-0 flex-1 grid-cols-4 gap-1">
              <span />
              <div className="col-span-2 flex flex-col items-center">
                <div className="h-2 w-full rounded-b-md border-x border-b border-[#c4b5fd]" />
                <p className="mt-1 text-center text-[0.68rem] font-extrabold tracking-tight text-[#6d28d9] sm:text-[0.72rem]">
                  AI Suggested Segments
                </p>
              </div>
              <span />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Heart + pulse — Engagement Hotspot */
function EngagementHotspotIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        d="M12 20s-6.2-3.9-8.2-7.2C2.3 10.2 3.1 7 6 6.2c1.7-.5 3.3.3 4 1.5.7-1.2 2.3-2 4-1.5 2.9.8 3.7 4 2.2 6.6C18.2 16.1 12 20 12 20Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 12.2h2.2l1.2-2.4 1.6 4.2 1.1-1.8H16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Brain with nodes — Topic Tagging */
function TopicTaggingIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        d="M9.5 5.2a3 3 0 0 0-2.8 4.1A2.7 2.7 0 0 0 5 12.1c0 1.5 1.1 2.7 2.5 2.9v1.5c0 1.3 1 2.3 2.3 2.3h.5c.4.9 1.3 1.5 2.3 1.5s1.9-.6 2.3-1.5h.5c1.3 0 2.3-1 2.3-2.3v-1.4A2.7 2.7 0 0 0 19 12.2a2.7 2.7 0 0 0-1.9-2.6 3 3 0 0 0-2.5-4.4 2.9 2.9 0 0 0-2.4 1.2A2.9 2.9 0 0 0 9.5 5.2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.45"
        strokeLinejoin="round"
      />
      <circle cx="9.2" cy="11" r="0.85" fill="currentColor" />
      <circle cx="14.8" cy="11" r="0.85" fill="currentColor" />
      <circle cx="12" cy="14.2" r="0.85" fill="currentColor" />
      <path
        d="M9.2 11h5.6M12 11v3.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Two users + swap arrow — Speaker Shift */
function SpeakerShiftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <circle cx="8" cy="8" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M4.4 16.2c.4-2 2-3.2 3.6-3.2s3.2 1.2 3.6 3.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle cx="16.2" cy="8" r="2.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12.6 16.2c.4-2 2-3.2 3.6-3.2s3.2 1.2 3.6 3.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M10.2 11.6h3.6m0 0-1.1-1.1m1.1 1.1-1.1 1.1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Rising bars — Pacing Shift */
function PacingShiftIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
      <path
        d="M5 17.5V13m4.5 4.5V10m4.5 7.5V7.5M18.5 17.5V5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M4.5 18.5h15"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ExtendMomentIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
      <rect
        x="2.5"
        y="3.5"
        width="11"
        height="9"
        rx="1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M6 8h4M10 8l-1.2-1.2M10 8l-1.2 1.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AddTransitionIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
      <path d="M3 3.5v9l4.2-4.5L3 3.5Z" fill="currentColor" />
      <path d="M9 3.5h1.4v9H9V3.5Zm2.6 0H13v9h-1.4V3.5Z" fill="currentColor" />
    </svg>
  );
}

