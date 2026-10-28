import { CloudUpload } from "lucide-react";
import { cn } from "@/lib/cn";

type UploadFilesPillProps = {
  className?: string;
  href?: string;
};

/** Dark navy pill CTA — sized like GradientButton `lg` (Start Creating Clips). */
export function UploadFilesPill({
  className,
  href = "/dashboard/upload",
}: UploadFilesPillProps) {
  return (
    <a
      href={href}
      className={cn(
        "group relative inline-flex h-12 w-full items-center gap-2.5 overflow-hidden rounded-[18px] border border-white/45 px-5",
        "bg-[radial-gradient(120%_140%_at_50%_0%,#1a2748_0%,#0a1028_48%,#050814_100%)]",
        "shadow-[0_12px_36px_rgba(5,8,20,0.4)] transition-[border-color,box-shadow,filter] duration-200",
        "hover:border-white/70 hover:brightness-110",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a78bfa]",
        "sm:h-[3.25rem] sm:w-auto sm:rounded-[20px] sm:gap-3 sm:px-6",
        className,
      )}
    >
      <span
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(96,165,250,0.16),transparent_55%)]"
        aria-hidden
      />
      <span className="relative inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white sm:h-8 sm:w-8">
        <CloudUpload
          className="h-3.5 w-3.5 text-[#0a1028] sm:h-4 sm:w-4"
          strokeWidth={2}
          aria-hidden
        />
      </span>
      <span className="relative min-w-0 text-left leading-tight">
        <span className="block font-sans text-sm font-semibold text-white sm:text-base">
          Upload Your Files
        </span>
        <span className="block font-sans text-[10px] font-medium text-white/70 sm:text-[11px]">
          Drag and drop files here
        </span>
      </span>
    </a>
  );
}
