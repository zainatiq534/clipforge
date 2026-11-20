"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Link2, Share2, Sparkles, UploadCloud, X } from "lucide-react";
import { useState } from "react";
import { GradientButton } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const ease = [0.16, 1, 0.3, 1] as const;

type UploadIntakePanelProps = {
  busy?: boolean;
  onClose: () => void;
  onBrowse: () => void;
  onDropFiles: (files: FileList | null) => void;
  onPasteLink: (url: string) => void;
};

export function UploadIntakePanel({
  busy,
  onClose,
  onBrowse,
  onDropFiles,
  onPasteLink,
}: UploadIntakePanelProps) {
  const reduce = useReducedMotion();
  const [dragging, setDragging] = useState(false);
  const [link, setLink] = useState("");

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Upload video"
      initial={reduce ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease }}
      className="relative overflow-hidden rounded-[18px] bg-gradient-to-br from-[#f5f3ff] via-white to-[#eff6ff] ring-1 ring-[#ddd6fe]/80"
    >
      <div className="pointer-events-none absolute -top-12 -right-8 h-36 w-36 rounded-full bg-[#a78bfa]/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-6 h-32 w-32 rounded-full bg-[#3b82f6]/15 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-3 p-3.5 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="inline-flex items-center gap-1.5 font-sans text-[10px] font-bold tracking-wide text-[#7c3aed] uppercase">
              <Sparkles className="h-3 w-3" />
              New upload
            </p>
            <h3 className="mt-0.5 font-sans text-[14px] font-extrabold tracking-[-0.02em] text-[#111827]">
              Bring your long-form video
            </h3>
            <p className="mt-0.5 font-sans text-[11px] text-[#6b6680]">
              Drop a file or paste a link — ClipForge finds the viral moments
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[12px] bg-white text-[#6b6680] shadow-sm ring-1 ring-[#ddd6fe] transition hover:text-[#111827]"
            aria-label="Close upload panel"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div
          role="button"
          tabIndex={0}
          aria-label="Upload files"
          onClick={() => {
            if (!busy) onBrowse();
          }}
          onKeyDown={(e) => {
            if (busy) return;
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              onBrowse();
            }
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            setDragging(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            onDropFiles(e.dataTransfer.files);
          }}
          className={cn(
            "flex cursor-pointer flex-col items-center justify-center rounded-[16px] border-[1.5px] border-dashed px-4 py-6 text-center outline-none transition duration-300 focus-visible:ring-2 focus-visible:ring-[#8b5cf6]/40",
            dragging
              ? "border-[#8b5cf6] bg-[#ede9fe]"
              : "border-[#c4b5fd] bg-white/75 hover:border-[#8b5cf6] hover:bg-[#faf5ff]",
            busy && "pointer-events-none opacity-70",
          )}
        >
          <span
            className={cn(
              "inline-flex h-12 w-12 items-center justify-center rounded-[16px] bg-gradient-to-br from-[#a78bfa] via-[#8b5cf6] to-[#3b82f6] text-white shadow-[0_10px_24px_rgba(99,102,241,0.35)] transition",
              dragging && "scale-105",
            )}
          >
            {dragging ? (
              <UploadCloud className="h-5 w-5" strokeWidth={1.75} />
            ) : (
              <Share2 className="h-5 w-5" strokeWidth={1.75} />
            )}
          </span>

          <p className="mt-3 font-sans text-[14px] font-bold tracking-[-0.02em] text-[#111827]">
            {dragging ? "Drop to upload" : "Upload files"}
          </p>
          <p className="mt-1 max-w-[17rem] font-sans text-[11px] leading-relaxed text-[#6b6680]">
            Drag & drop your video here, or click to browse from your device
          </p>
          <p className="mt-1.5 font-sans text-[10px] font-medium text-[#8b5cf6]">
            MP4 · MOV · MKV · WEBM
          </p>

          <div
            className="mt-3"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <GradientButton size="sm" disabled={busy} onClick={onBrowse}>
              Choose video
            </GradientButton>
          </div>
        </div>

        {/* Always visible paste link — not clipped */}
        <div className="shrink-0 rounded-[14px] bg-white p-2.5 shadow-[0_6px_18px_rgba(91,33,182,0.08)] ring-1 ring-[#ddd6fe]/90">
          <label className="mb-1.5 flex items-center gap-1.5 px-0.5 font-sans text-[10px] font-bold tracking-wide text-[#7c3aed] uppercase">
            <Link2 className="h-3 w-3" />
            Paste video link
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={link}
              disabled={busy}
              placeholder="Paste YouTube or direct MP4 URL"
              onChange={(e) => setLink(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  const value = link.trim();
                  if (value) {
                    onPasteLink(value);
                    setLink("");
                  }
                }
              }}
              className="min-w-0 flex-1 rounded-[12px] border border-[#e9e4ff] bg-[#faf5ff] px-3 py-2.5 font-sans text-[12px] text-[#111827] outline-none placeholder:text-[#9ca3af] focus:border-[#8b5cf6] focus:bg-white focus:ring-2 focus:ring-[#8b5cf6]/20"
            />
            <GradientButton
              size="sm"
              disabled={busy || !link.trim()}
              onClick={() => {
                const value = link.trim();
                if (value) {
                  onPasteLink(value);
                  setLink("");
                }
              }}
              className="shrink-0"
            >
              Import
            </GradientButton>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
