import {
  ArrowRight,
  AudioLines,
  Pencil,
  Sparkles,
  TrendingUp,
  Type,
} from "lucide-react";
import { CaptionsShowcase } from "@/components/CaptionsShowcase";
import { AppImage } from "@/components/ui/Image";
import { GradientButton } from "@/components/ui/Button";
import { Icon, PlayCircleIcon } from "@/components/ui/Icon";
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

const avatars = [
  "/features/avatar-1.jpg",
  "/features/avatar-2.jpg",
  "/features/avatar-3.jpg",
  "/features/avatar-4.jpg",
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
            <a
              href="#demo"
              className="inline-flex h-12 w-full items-center justify-center gap-2.5 rounded-full border border-slate-200 bg-white px-6 text-base font-semibold text-[#1e1b4b] shadow-sm transition-colors hover:bg-slate-50 sm:h-[3.25rem] sm:w-auto sm:px-7"
            >
              <PlayCircleIcon className="border-slate-300 [&_svg]:fill-[#1e1b4b]" />
              See It In Action
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <div className="flex items-start gap-2">
              <Icon icon={TrendingUp} size="md" className="mt-1 text-[#7c3aed]" />
              <div>
                <p className="font-display text-2xl font-bold text-[#1e1b4b]">2.3x</p>
                <p className="max-w-[12rem] font-sans text-sm leading-snug text-slate-500">
                  Average watch time increase with captions.
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center">
                {avatars.map((src, i) => (
                  <span
                    key={src}
                    className={cn(
                      "relative h-9 w-9 overflow-hidden rounded-full border-2 border-white",
                      i > 0 && "-ml-2",
                    )}
                  >
                    <AppImage src={src} alt="" fill className="object-cover" sizes="36px" />
                  </span>
                ))}
                <span className="-ml-2 inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#7c3aed] text-[0.6rem] font-bold text-white">
                  +10K
                </span>
              </div>
              <p className="mt-2 max-w-[14rem] font-sans text-sm leading-snug text-slate-500">
                Used by 10,000+ creators, podcasters and agencies.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
