"use client";

import {
  ArrowRight,
  Bolt,
  MoreHorizontal,
  Play,
  Scissors,
  Type,
  Upload,
} from "lucide-react";
import { useState } from "react";
import { InstagramIcon, TikTokIcon, YouTubeIcon } from "@/components/icons";
import { GradientButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

const featureItems = [
  {
    icon: Scissors,
    title: "Trim with precision",
    description: "Cut and refine clips down to the exact second.",
  },
  {
    icon: Type,
    title: "Edit captions",
    description: "Adjust wording, timing, and style in one place.",
  },
  {
    icon: Play,
    title: "Preview instantly",
    description: "See changes live before you export.",
  },
  {
    icon: Upload,
    title: "Export in one click",
    description: "Download platform-ready files without rework.",
  },
] as const;

type EditingExportFeatureProps = {
  className?: string;
};

function LinkedInGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="currentColor">
      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V23h-4V8.5zM8.5 8.5h3.84v1.98h.06c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.67 4.8 6.14V23h-4v-6.57c0-1.57-.03-3.58-2.18-3.58-2.18 0-2.51 1.7-2.51 3.46V23h-4V8.5z" />
    </svg>
  );
}

function EditorMockup() {
  return (
    <div className="relative w-full min-w-0 overflow-visible bg-transparent">
      {/* Exact reference paste */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/features/editor-mockup.png?v=exact1"
        alt="ClipForge editor — edit captions, preview, and timeline"
        width={2505}
        height={3329}
        className="h-auto w-full max-w-full object-contain drop-shadow-[0_16px_40px_rgba(76,29,149,0.14)]"
        decoding="async"
        draggable={false}
      />
    </div>
  );
}

function ExportPanel() {
  const [format, setFormat] = useState<"MP4" | "MOV">("MP4");
  const [resolution, setResolution] = useState<"1080p" | "720p" | "4K">("1080p");
  const [aspect, setAspect] = useState<"vertical" | "square" | "wide">("vertical");
  const [watermark, setWatermark] = useState(false);

  return (
    <div className="w-full rounded-[18px] border border-[#ebe6f8] bg-white p-3.5 shadow-[0_16px_44px_rgba(76,29,149,0.12)] sm:rounded-[20px] sm:p-4">
      <div className="mb-3.5 flex items-center gap-1.5">
        <Upload className="h-4 w-4 text-[#7c3aed]" strokeWidth={2.3} />
        <span className="font-sans text-[13px] font-bold text-[#0f172a] sm:text-[14px]">
          Export Your Clip
        </span>
      </div>

      <p className="mb-1.5 font-sans text-[11px] font-semibold text-[#64748b]">Format</p>
      <div className="mb-3 flex gap-1.5">
        {(["MP4", "MOV"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFormat(f)}
            className={cn(
              "flex-1 rounded-full py-1.5 font-sans text-[11px] font-bold transition",
              format === f
                ? "bg-[#7c3aed] text-white"
                : "bg-[#f5f3ff] text-[#7c3aed] ring-1 ring-[#e9e0ff]",
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <p className="mb-1.5 font-sans text-[11px] font-semibold text-[#64748b]">Resolution</p>
      <div className="mb-3 flex gap-1.5">
        {(["1080p", "720p", "4K"] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setResolution(r)}
            className={cn(
              "flex-1 rounded-full py-1.5 font-sans text-[11px] font-bold transition",
              resolution === r
                ? "bg-[#7c3aed] text-white"
                : "bg-[#f5f3ff] text-[#7c3aed] ring-1 ring-[#e9e0ff]",
            )}
          >
            {r}
          </button>
        ))}
      </div>

      <p className="mb-1.5 font-sans text-[11px] font-semibold text-[#64748b]">Aspect Ratio</p>
      <div className="mb-3.5 grid grid-cols-3 gap-1.5">
        {(
          [
            { key: "vertical" as const, label: "Vertical", sub: "Shorts, Reels", box: "h-8 w-5" },
            { key: "square" as const, label: "1:1", sub: "Social", box: "h-6 w-6" },
            { key: "wide" as const, label: "16:9", sub: "YouTube", box: "h-5 w-8" },
          ] as const
        ).map((a) => (
          <button
            key={a.key}
            type="button"
            onClick={() => setAspect(a.key)}
            className={cn(
              "flex flex-col items-center gap-1 rounded-[12px] border px-1 py-2 transition",
              aspect === a.key
                ? "border-[#7c3aed] bg-[#f5f3ff]"
                : "border-[#efeaf8] bg-white",
            )}
          >
            <span
              className={cn(
                "rounded-[3px] border-2",
                a.box,
                aspect === a.key ? "border-[#7c3aed] bg-[#ede9fe]" : "border-slate-300",
              )}
            />
            <span className="font-sans text-[8px] font-bold text-[#334155]">{a.label}</span>
            <span className="font-sans text-[7px] leading-tight text-slate-400">{a.sub}</span>
          </button>
        ))}
      </div>

      <p className="mb-1.5 font-sans text-[11px] font-semibold text-[#64748b]">
        Platform Optimization
      </p>
      <div className="mb-3.5 flex flex-wrap items-start gap-2">
        {[
          { label: "YouTube Shorts", node: <YouTubeIcon className="h-3.5 w-3.5" />, wrap: "bg-white" },
          {
            label: "TikTok",
            node: <TikTokIcon className="h-3 w-3" />,
            wrap: "bg-[#111113]",
          },
          {
            label: "Instagram Reels",
            node: <InstagramIcon className="h-3.5 w-3.5" />,
            wrap: "bg-white",
          },
          {
            label: "LinkedIn",
            node: <LinkedInGlyph className="h-3 w-3 text-white" />,
            wrap: "bg-[#0a66c2]",
          },
          {
            label: "More",
            node: <MoreHorizontal className="h-3.5 w-3.5 text-[#7c3aed]" />,
            wrap: "bg-[#f5f3ff]",
          },
        ].map((p) => (
          <div key={p.label} className="flex w-11 flex-col items-center gap-1">
            <span
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full ring-1 ring-slate-200",
                p.wrap,
              )}
            >
              {p.node}
            </span>
            <span className="text-center font-sans text-[6.5px] leading-tight font-semibold text-slate-500">
              {p.label}
            </span>
          </div>
        ))}
      </div>

      <div className="mb-4 flex items-center justify-between gap-3 rounded-[12px] border border-[#efeaf8] bg-[#faf9fd] px-3 py-2.5">
        <div>
          <p className="font-sans text-[12px] font-bold text-[#0f172a]">Add watermark</p>
          <p className="font-sans text-[10px] text-slate-400">Include ClipForge branding.</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={watermark}
          onClick={() => setWatermark((v) => !v)}
          className={cn(
            "relative h-[22px] w-10 shrink-0 rounded-full transition",
            watermark ? "bg-[#7c3aed]" : "bg-slate-300",
          )}
        >
          <span
            className={cn(
              "absolute top-[3px] h-4 w-4 rounded-full bg-white shadow transition",
              watermark ? "right-[3px]" : "left-[3px]",
            )}
          />
        </button>
      </div>

      <button
        type="button"
        className="flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-[#a78bfa] via-[#8b5cf6] to-[#6366f1] py-2.5 font-sans text-[13px] font-bold text-white shadow-[0_10px_28px_rgba(124,58,237,0.35)]"
      >
        Export Clip
        <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
      </button>
    </div>
  );
}

function PublishStrip() {
  return (
    <div className="mt-10 rounded-[20px] border border-[#ebe6f8] bg-white px-5 py-5 shadow-[0_10px_32px_rgba(76,29,149,0.08)] sm:mt-12 sm:px-7 sm:py-6">
      <div className="flex flex-col items-center gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
        <div className="max-w-xl text-center lg:text-left">
          <h3 className="font-sans text-[1.35rem] font-extrabold tracking-[-0.02em] text-[#0a0a1a] sm:text-[1.55rem]">
            Ready to{" "}
            <span className="bg-gradient-to-r from-[#a855f7] to-[#7c3aed] bg-clip-text text-transparent">
              publish in minutes.
            </span>
          </h3>
          <p className="mt-1.5 font-sans text-[0.875rem] leading-relaxed text-[#4b5563] sm:text-[0.9375rem]">
            Edit, perfect, and export your clips for every platform — all in one place with
            ClipForge.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
          {[
            { label: "YouTube Shorts", icon: YouTubeIcon, wrap: "bg-white" },
            { label: "TikTok", icon: TikTokIcon, wrap: "bg-[#111]" },
            { label: "Instagram Reels", icon: InstagramIcon, wrap: "bg-white" },
            { label: "LinkedIn", icon: null, wrap: "bg-[#0a66c2]" },
            { label: "More Platforms", icon: null, wrap: "bg-[#f5f3ff]" },
          ].map((p) => (
            <div key={p.label} className="flex w-[4.25rem] flex-col items-center gap-1.5">
              <span
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full shadow-sm ring-1 ring-slate-200 sm:h-11 sm:w-11",
                  p.wrap,
                )}
              >
                {p.label === "LinkedIn" && <LinkedInGlyph className="h-4 w-4 text-white" />}
                {p.label === "More Platforms" && (
                  <MoreHorizontal className="h-5 w-5 text-[#7c3aed]" />
                )}
                {p.icon && <p.icon className="h-4 w-4" />}
              </span>
              <span className="text-center font-sans text-[8px] font-semibold leading-tight text-[#475569] sm:text-[9px]">
                {p.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function EditingExportFeature({ className }: EditingExportFeatureProps) {
  return (
    <section
      id="editing-export"
      className={cn("relative isolate w-full overflow-hidden", className)}
    >
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:py-20">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.35fr)] lg:gap-8 xl:gap-10">
          {/* Left copy */}
          <div className="max-w-[28rem]">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#d8b4fe] bg-[#f5f3ff] px-3 py-[6px]">
              <Icon icon={Bolt} size="sm" className="text-[#8b5cf6]" />
              <span className="font-sans text-[11px] font-bold tracking-[0.12em] text-[#7c3aed] uppercase">
                Powerful Feature
              </span>
            </div>

            <h2 className="font-sans mt-5 text-[2.35rem] leading-[1.08] font-extrabold tracking-[-0.03em] text-[#0a0a1a] sm:text-[2.65rem] lg:text-[3rem]">
              Easy Editing
              <br />
              <span className="bg-gradient-to-r from-[#a855f7] via-[#8b5cf6] to-[#6366f1] bg-clip-text text-transparent">
                &amp; Export
              </span>
            </h2>

            <p className="mt-4 font-sans text-[0.9375rem] leading-[1.65] text-[#4b5563] sm:text-base">
              Fine-tune every clip in a simple editor — trim, captions, preview — then export
              ready-to-post files for every platform.
            </p>
            <p className="mt-3 font-sans text-[0.9375rem] leading-[1.65] text-[#4b5563] sm:text-base">
              No complicated timelines. Just the controls creators actually use, with
              one-click exports that keep quality high.
            </p>

            <ul className="mt-7 space-y-4">
              {featureItems.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <li key={item.title} className="flex items-start gap-3.5">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[#f5f3ff] text-[#7c3aed] ring-1 ring-[#e9e0ff]">
                      <ItemIcon className="h-5 w-5" strokeWidth={2.2} />
                    </span>
                    <div className="pt-0.5">
                      <p className="font-sans text-[0.95rem] font-bold text-[#0a0a1a] sm:text-base">
                        {item.title}
                      </p>
                      <p className="mt-0.5 font-sans text-[0.8125rem] leading-snug text-[#6b7280] sm:text-sm">
                        {item.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-8">
              <GradientButton
                size="lg"
                href="#start"
                rightIcon={<Icon icon={ArrowRight} size="md" />}
                className="min-w-[15rem]"
              >
                Start Creating Clips
              </GradientButton>
            </div>
          </div>

          {/* Right visuals: editor paste + export — side by side, no overlap */}
          <div className="relative min-w-0">
            <div className="flex flex-col items-stretch gap-5 lg:flex-row lg:items-start lg:gap-4 xl:gap-5">
              <div className="min-w-0 flex-1">
                <EditorMockup />
              </div>
              <div className="w-full shrink-0 lg:w-[14.5rem] xl:w-[15.5rem]">
                <p className="font-hand mb-1.5 text-right text-[0.95rem] font-bold text-[#7c3aed]">
                  Export polished clips for every platform
                </p>
                <ExportPanel />
              </div>
            </div>
          </div>
        </div>

        <PublishStrip />
      </div>
    </section>
  );
}
