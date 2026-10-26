import {
  ArrowRight,
  AudioLines,
  Pencil,
  Sparkles,
  Type,
} from "lucide-react";
import { CaptionsShowcase } from "@/components/CaptionsShowcase";
import { GradientButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

const items = [
  {
    icon: AudioLines,
    title: "Auto-sync captions",
    description: "Captions lock to speech timing automatically — no manual scrubbing.",
  },
  {
    icon: Type,
    title: "Stylish templates",
    description: "Pick Modern, Bold, Neon, and more — built for short-form retention.",
  },
  {
    icon: Sparkles,
    title: "Highlight keywords",
    description: "Emphasize the words that sell the hook with one-click highlights.",
  },
  {
    icon: Pencil,
    title: "Quick text editing",
    description: "Fix typos and tweak lines in seconds without leaving the timeline.",
  },
];

type CaptionsFeatureProps = {
  className?: string;
};

export function CaptionsFeature({ className }: CaptionsFeatureProps) {
  return (
    <section
      id="captions"
      className={cn("relative w-full", className)}
    >
      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-8 px-5 py-10 sm:px-8 sm:py-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-10 lg:py-14">
        <CaptionsShowcase />

        <div className="max-w-xl lg:max-w-none">
          <h2 className="font-display text-[1.85rem] leading-[1.12] font-bold tracking-tight text-[#1e1b4b] sm:text-[2.15rem] lg:text-[2.35rem]">
            Automatic{" "}
            <span className="text-[#7c3aed]">Captions & Subtitles</span>
          </h2>

          <p className="mt-4 font-sans text-[0.9375rem] leading-relaxed text-slate-600 sm:text-base">
            ClipForge turns speech into clean, on-brand captions so every short is
            readable on mute — and ready to post in minutes.
          </p>
          <p className="mt-2.5 font-sans text-[0.9375rem] leading-relaxed text-slate-600 sm:text-base">
            Sync, style, highlight keywords, and edit text in one place. No separate
            captioning tools. No timeline chaos.
          </p>

          <ul className="mt-6 space-y-3.5">
            {items.map((item) => (
              <li key={item.title} className="flex items-start gap-3.5">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#f3e8ff] text-[#7c3aed]">
                  <Icon icon={item.icon} size="md" />
                </span>
                <div>
                  <p className="font-sans text-base font-bold text-[#1e1b4b]">
                    {item.title}
                  </p>
                  <p className="mt-0.5 font-sans text-sm leading-relaxed text-slate-500">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
            <GradientButton
              size="lg"
              href="#start"
              rightIcon={<Icon icon={ArrowRight} size="md" />}
              className="w-full rounded-full sm:w-auto"
            >
              Start Creating Clips
            </GradientButton>
          </div>
        </div>
      </div>
    </section>
  );
}
