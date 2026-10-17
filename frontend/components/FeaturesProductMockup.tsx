import type { ReactNode } from "react";
import {
  BarChart3,
  ChevronDown,
  Play,
  Smile,
  Sparkles,
  Upload,
  Users,
  Zap,
} from "lucide-react";
import { AppImage } from "@/components/ui/Image";
import { cn } from "@/lib/cn";

type FeaturesProductMockupProps = {
  className?: string;
};

export function FeaturesProductMockup({ className }: FeaturesProductMockupProps) {
  return (
    <div
      className={cn(
        "relative mx-auto w-full max-w-[38rem] select-none lg:max-w-none",
        className,
      )}
      aria-hidden
    >
      <div
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] opacity-90 blur-3xl sm:-inset-8"
        style={{
          background:
            "radial-gradient(ellipse 78% 72% at 48% 48%, rgba(139,92,246,0.48) 0%, rgba(124,58,237,0.2) 42%, transparent 70%)",
        }}
      />

      {/* Outer py = how far Insights sticks out above/below the editor */}
      <div className="relative py-10 pl-9 sm:py-12 sm:pl-11 lg:py-14 lg:pl-12">
        {/* Editor — sits inside; Insights panel is taller on the outside */}
        <div
          className={cn(
            "relative z-0 mr-[32%] flex flex-col sm:mr-[33%]",
            "rounded-[1.35rem] bg-[#0b0d14] sm:rounded-[1.5rem]",
            "shadow-[0_28px_60px_-16px_rgba(76,29,149,0.55)]",
            "ring-1 ring-white/[0.06]",
          )}
        >
          <div className="relative aspect-[16/10.5] overflow-hidden rounded-t-[1.35rem] bg-[#10121c] sm:rounded-t-[1.5rem]">
            <AppImage
              src="/features-mockup-face.jpg"
              alt=""
              fill
              quality={100}
              sizes="(max-width: 1024px) 70vw, 440px"
              className="object-cover object-[50%_22%]"
            />

            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-full bg-black/75 px-2 py-[0.28rem] text-[0.6rem] font-medium tracking-wide text-white sm:top-3 sm:left-3 sm:px-2.5 sm:text-[0.66rem]">
              <Play className="h-2.5 w-2.5 fill-white" strokeWidth={0} />
              <span>00:28 / 01:12</span>
            </div>

            <div className="absolute inset-x-0 bottom-3 flex justify-center px-3 sm:bottom-3.5 sm:px-4">
              <div
                className={cn(
                  "rounded-2xl bg-[#0a0c14]/88 px-3.5 py-2 backdrop-blur-md sm:px-4 sm:py-2.5",
                  "shadow-[0_0_28px_rgba(139,92,246,0.45),0_0_0_1px_rgba(167,139,250,0.35)]",
                )}
              >
                <p className="text-center text-[0.7rem] font-semibold text-white sm:text-[0.8rem]">
                  This tool is a{" "}
                  <span className="bg-gradient-to-r from-[#e879f9] via-[#c084fc] to-[#818cf8] bg-clip-text text-transparent [filter:drop-shadow(0_0_10px_rgba(192,132,252,0.85))]">
                    game changer!
                  </span>{" "}
                  <span aria-hidden>✨</span>
                </p>
              </div>
            </div>
          </div>

          <div className="relative mt-auto rounded-b-[1.35rem] px-2.5 pt-2.5 pb-3 sm:rounded-b-[1.5rem] sm:px-3 sm:pt-3 sm:pb-3.5">
            <NeonWaveform />

            <div className="relative mt-2">
              <div className="flex gap-[2px] overflow-hidden rounded-lg">
                {[0, 1, 2, 3, 4, 5].map((i) => {
                  const inSelection = i >= 2 && i <= 3;
                  return (
                    <div
                      key={i}
                      className={cn(
                        "relative h-9 flex-1 overflow-hidden rounded-[0.35rem] sm:h-11",
                        !inSelection && "opacity-[0.72] brightness-[0.82]",
                      )}
                    >
                      <AppImage
                        src={`/features-thumb-${i}.jpg`}
                        alt=""
                        fill
                        quality={100}
                        sizes="120px"
                        className="object-cover object-center"
                      />
                    </div>
                  );
                })}
              </div>

              <div
                className={cn(
                  "pointer-events-none absolute inset-y-[-4px] left-[33%] right-[33%]",
                  "rounded-[0.65rem]",
                  "border-[2.5px] border-[#c4b5fd]",
                  "shadow-[0_0_0_1px_rgba(196,181,253,0.35),0_0_14px_rgba(168,85,247,0.95),0_0_28px_rgba(139,92,246,0.65)]",
                )}
              >
                <span className="absolute top-1/2 left-0 h-3.5 w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
                <span className="absolute top-1/2 right-0 h-3.5 w-[5px] translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
              </div>
            </div>

            <span
              className="pointer-events-none absolute top-1 bottom-2 left-1/2 z-10 w-px -translate-x-1/2 bg-white shadow-[0_0_6px_rgba(255,255,255,0.9)]"
              aria-hidden
            />
          </div>
        </div>

        {/* Clip Score — outside overflow, fully visible */}
        <div
          className={cn(
            "absolute top-1/2 left-0 z-30 -translate-y-1/2",
            "rounded-[0.85rem] bg-[#0b0e16] px-2.5 py-2 sm:rounded-xl sm:px-3 sm:py-2.5",
            "shadow-[0_0_0_1.5px_rgba(96,165,250,0.7),0_0_22px_rgba(59,130,246,0.55)]",
          )}
        >
          <p className="text-[0.55rem] font-medium tracking-wide text-white/90 sm:text-[0.62rem]">
            Clip Score
          </p>
          <div className="mt-0.5 flex items-end gap-1.5">
            <span className="text-[1.4rem] leading-none font-bold text-white sm:text-[1.65rem]">
              92
            </span>
            <svg
              viewBox="0 0 12 14"
              className="mb-0.5 h-3.5 w-3 text-[#34d399] sm:h-4 sm:w-3.5"
              fill="currentColor"
              aria-hidden
            >
              <path d="M6 0L11.5 8H.5L6 0Z" />
              <rect x="4.2" y="7" width="3.6" height="6.5" rx="0.6" />
            </svg>
          </div>
        </div>

        {/* AI Insights — boxy outer frame; taller outside (top + bottom) */}
        <div
          className={cn(
            "absolute inset-y-0 right-0 z-20 flex w-[33%] max-w-[11.25rem] flex-col sm:w-[34%] sm:max-w-[12rem]",
            "overflow-hidden rounded-[0.9rem] bg-[#12141d] sm:rounded-[1rem]",
            "border border-[#3a3f4d]",
            "shadow-[-12px_0_32px_-10px_rgba(0,0,0,0.65),0_28px_60px_-16px_rgba(76,29,149,0.45)]",
          )}
        >
          <div className="flex items-center gap-1.5 px-2.5 pt-3 pb-2 sm:px-3 sm:pt-3.5">
            <Sparkles className="h-3.5 w-3.5 text-[#c084fc]" strokeWidth={2} />
            <span className="text-[0.75rem] font-semibold text-white sm:text-[0.8rem]">
              AI Insights
            </span>
          </div>

          <div className="flex min-h-0 flex-1 flex-col gap-1.5 px-2 pb-1.5 sm:gap-2 sm:px-2.5">
            <InsightRow
              icon={
                <Zap className="h-3.5 w-3.5 text-amber-300" fill="currentColor" />
              }
              title="92/100"
              subtitle={
                <>
                  High engagement
                  <br />
                  potential
                </>
              }
            />
            <InsightRow
              icon={<Smile className="h-3.5 w-3.5 text-amber-300" />}
              title="Key Moment"
              subtitle={
                <>
                  Strong emotional
                  <br />
                  hook
                </>
              }
            />
            <InsightRow
              icon={<BarChart3 className="h-3.5 w-3.5 text-amber-300" />}
              title="Great Hook"
              subtitle={
                <>
                  Keeps viewers
                  <br />
                  watching
                </>
              }
            />
            <InsightRow
              icon={<Users className="h-3.5 w-3.5 text-slate-300" />}
              title="Vertical Ready"
              subtitle={
                <>
                  Optimized for all
                  <br />
                  platforms
                </>
              }
            />
          </div>

          <div className="shrink-0 px-2 pt-0.5 pb-3 sm:px-2.5 sm:pb-3.5">
            <button
              type="button"
              tabIndex={-1}
              className={cn(
                "flex w-full items-center justify-between gap-1 rounded-[0.65rem] px-2 py-2.5",
                "bg-gradient-to-r from-[#8b5cf6] via-[#7c3aed] to-[#4f46e5]",
                "text-[0.68rem] font-semibold text-white sm:text-[0.72rem]",
                "shadow-[0_12px_30px_-8px_rgba(124,58,237,0.85)]",
              )}
            >
              <span className="flex items-center gap-1.5">
                <Upload className="h-3.5 w-3.5" strokeWidth={2.25} />
                Export Clip
              </span>
              <ChevronDown className="h-3.5 w-3.5 opacity-90" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightRow({
  icon,
  title,
  subtitle,
}: {
  icon: ReactNode;
  title: string;
  subtitle: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 items-center gap-2 rounded-[0.55rem] px-2 py-1.5 sm:rounded-[0.65rem] sm:px-2.5 sm:py-2",
        "bg-[#161a24]",
        "border border-[#a78bfa]/45",
        "shadow-[inset_0_0_0_1px_rgba(167,139,250,0.12)]",
      )}
    >
      <span className="shrink-0 self-center">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[0.84rem] leading-tight font-semibold text-white sm:text-[0.9rem]">
          {title}
        </p>
        <p className="mt-0.5 text-[0.64rem] leading-[1.25] text-[#94a3b8] sm:text-[0.68rem]">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function NeonWaveform() {
  const bars = [
    34, 48, 40, 62, 52, 70, 44, 78, 64, 50, 74, 58, 42, 72, 56, 80, 48, 68, 38,
    74, 54, 62, 46, 66, 36, 58, 52, 70, 44, 60, 34, 56, 64, 48, 68, 42, 58, 52,
    66, 40, 55, 47, 63, 49, 71, 45, 59, 53,
  ];

  return (
    <div
      className="relative flex h-7 items-end gap-[1.5px] overflow-hidden rounded-md px-0.5 sm:h-8 sm:gap-[2px]"
      style={{
        filter:
          "drop-shadow(0 0 6px rgba(56,189,248,0.35)) drop-shadow(0 0 10px rgba(168,85,247,0.4))",
      }}
    >
      {bars.map((h, i) => {
        const t = i / (bars.length - 1);
        const top = lerpColor("#38bdf8", "#818cf8", t);
        const mid = lerpColor("#60a5fa", "#a78bfa", t);
        const bot = lerpColor("#7c3aed", "#c026d3", t);

        return (
          <span
            key={i}
            className="min-w-0 flex-1 rounded-[1.5px]"
            style={{
              height: `${h}%`,
              background: `linear-gradient(180deg, ${top} 0%, ${mid} 48%, ${bot} 100%)`,
              boxShadow: `0 0 4px ${mid}88`,
            }}
          />
        );
      })}
    </div>
  );
}

function lerpColor(a: string, b: string, t: number) {
  const pa = hexToRgb(a);
  const pb = hexToRgb(b);
  const r = Math.round(pa.r + (pb.r - pa.r) * t);
  const g = Math.round(pa.g + (pb.g - pa.g) * t);
  const bl = Math.round(pa.b + (pb.b - pa.b) * t);
  return `rgb(${r},${g},${bl})`;
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}
