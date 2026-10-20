import { ArrowRight } from "lucide-react";
import {
  PlayBadgeIcon,
  ScissorsBadgeIcon,
  TypeBadgeIcon,
  UploadBadgeIcon,
} from "@/components/icons";
import { GradientButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/cn";

const featureItems: {
  badge: "scissors" | "type" | "play" | "upload";
  title: string;
  description: string;
}[] = [
  {
    badge: "scissors",
    title: "Trim with precision",
    description: "Cut and refine clips down to the exact second.",
  },
  {
    badge: "type",
    title: "Edit captions",
    description: "Adjust wording, timing, and style in one place.",
  },
  {
    badge: "play",
    title: "Preview instantly",
    description: "See changes live before you export.",
  },
  {
    badge: "upload",
    title: "Export in one click",
    description: "Download platform-ready files without rework.",
  },
];

const badgeIcons = {
  scissors: ScissorsBadgeIcon,
  type: TypeBadgeIcon,
  play: PlayBadgeIcon,
  upload: UploadBadgeIcon,
} as const;

type EditingExportFeatureProps = {
  className?: string;
};

/** Exact reference picture — editor + Export Your Clip (same-to-same). */
function EditorExportCompose() {
  return (
    <div className="relative w-full min-w-0 overflow-visible bg-transparent">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/features/editor-export-paste.png?v=as-was"
        alt="ClipForge editor and export — captions, timeline, and platform export"
        width={2340}
        height={1784}
        className="h-auto w-full max-w-full object-contain"
        decoding="async"
        draggable={false}
      />
    </div>
  );
}

/** Exact reference picture — ready-to-publish strip (outer page bg removed). */
function PublishStrip() {
  return (
    <div className="relative mt-10 w-full min-w-0 overflow-visible bg-transparent sm:mt-12">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/features/ready-to-publish-strip.png?v=hq1"
        alt="Ready to publish in minutes — clips for YouTube, TikTok, Instagram, LinkedIn and more"
        width={4096}
        height={500}
        className="h-auto w-full max-w-full object-contain"
        decoding="async"
        draggable={false}
      />
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
            <h2 className="font-sans text-[2.35rem] leading-[1.08] font-extrabold tracking-[-0.03em] text-[#0a0a1a] sm:text-[2.65rem] lg:text-[3rem]">
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
                const BadgeIcon = badgeIcons[item.badge];
                return (
                  <li key={item.title} className="flex items-start gap-3.5">
                    <BadgeIcon className="h-11 w-11" />
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

          {/* Right visuals — exact reference picture */}
          <div className="relative min-w-0">
            <EditorExportCompose />
          </div>
        </div>

        <PublishStrip />
      </div>
    </section>
  );
}
