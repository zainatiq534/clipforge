"use client";

import { FileVideo, Link2, UploadCloud, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { AppPageHero } from "@/components/dashboard/AppPageHero";
import { DashboardMotion } from "@/components/dashboard/DashboardMotion";
import { GradientButton } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

type PickedFile = {
  id: string;
  name: string;
  size: string;
  status: "Ready" | "Queued";
};

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function UploadPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<PickedFile[]>([]);

  const addFiles = useCallback((list: FileList | null) => {
    if (!list?.length) return;
    const next = Array.from(list)
      .filter((f) => f.type.startsWith("video/") || /\.(mp4|mov|mkv|webm)$/i.test(f.name))
      .map((f) => ({
        id: `${f.name}-${f.size}-${f.lastModified}`,
        name: f.name,
        size: formatBytes(f.size),
        status: "Queued" as const,
      }));
    if (!next.length) return;
    setFiles((prev) => {
      const ids = new Set(prev.map((p) => p.id));
      return [...next.filter((f) => !ids.has(f.id)), ...prev];
    });
  }, []);

  const openPicker = () => inputRef.current?.click();

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <div className="flex min-w-0 flex-col gap-3">
      <DashboardMotion delay={0.08}>
        <AppPageHero
          title="Upload your long-form video"
          description="Drop a file or browse from your device. ClipForge will detect highlights, captions, and clip scores automatically."
          action="Browse files"
          onAction={openPicker}
        />
      </DashboardMotion>

      <input
        ref={inputRef}
        type="file"
        accept="video/*,.mp4,.mov,.mkv,.webm"
        multiple
        className="sr-only"
        onChange={(e) => {
          addFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.85fr)]">
        <DashboardMotion delay={0.16}>
          <section className="rounded-[22px] bg-white p-4 shadow-[0_10px_28px_rgba(20,20,40,0.06)] sm:p-5">
            <div
              role="button"
              tabIndex={0}
              onClick={openPicker}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openPicker();
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
                addFiles(e.dataTransfer.files);
              }}
              className={cn(
                "flex min-h-[220px] cursor-pointer flex-col items-center justify-center rounded-[18px] border border-dashed px-6 py-10 text-center transition",
                dragging
                  ? "border-[#8b5cf6] bg-[#ede9fe]"
                  : "border-[#c4b5fd] bg-[#ede9fe]/70 hover:border-[#8b5cf6] hover:bg-[#ede9fe]",
              )}
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-[14px] bg-gradient-to-br from-[#a78bfa] via-[#8b5cf6] to-[#3b82f6] text-white">
                <UploadCloud className="h-5 w-5" strokeWidth={1.8} />
              </span>
              <p className="mt-3 font-sans text-[14px] font-bold text-[#111827]">
                {dragging ? "Drop video to upload" : "Drag & drop video here"}
              </p>
              <p className="mt-1 font-sans text-[12px] text-[#6b6680]">
                MP4, MOV, MKV, WEBM up to 5 GB
              </p>
              <span className="mt-4 inline-flex" onClick={(e) => e.stopPropagation()}>
                <GradientButton size="sm" onClick={openPicker}>
                  Select video
                </GradientButton>
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={openPicker}
                className="flex items-center gap-3 rounded-[18px] bg-[#faf5ff] p-3.5 text-left transition hover:bg-[#ede9fe]"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#ede9fe] text-[#7c3aed]">
                  <FileVideo className="h-4 w-4" />
                </span>
                <span>
                  <span className="block font-sans text-[12px] font-bold text-[#111827]">
                    Browse device
                  </span>
                  <span className="block font-sans text-[11px] text-[#6b6680]">
                    Choose video from computer
                  </span>
                </span>
              </button>
              <button
                type="button"
                className="flex items-center gap-3 rounded-[18px] bg-[#faf5ff] p-3.5 text-left transition hover:bg-[#ede9fe]"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#ede9fe] text-[#7c3aed]">
                  <Link2 className="h-4 w-4" />
                </span>
                <span>
                  <span className="block font-sans text-[12px] font-bold text-[#111827]">
                    Paste link
                  </span>
                  <span className="block font-sans text-[11px] text-[#6b6680]">
                    YouTube, Drive, Dropbox
                  </span>
                </span>
              </button>
            </div>
          </section>
        </DashboardMotion>

        <DashboardMotion direction="right" delay={0.22}>
          <section className="rounded-[22px] bg-white p-3.5 shadow-[0_10px_28px_rgba(20,20,40,0.06)] sm:p-4">
            <h2 className="font-sans text-[13px] font-bold text-[#111827]">
              {files.length ? "Selected files" : "Recent uploads"}
            </h2>
            <div className="mt-3 space-y-2.5">
              {(files.length
                ? files
                : [
                    { id: "1", name: "Podcast_ep12.mp4", size: "420 MB", status: "Ready" as const },
                    { id: "2", name: "Product_demo.mov", size: "180 MB", status: "Ready" as const },
                    { id: "3", name: "Interview_raw.mp4", size: "1.2 GB", status: "Ready" as const },
                  ]
              ).map((item) => (
                <article
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-[16px] bg-[#faf5ff] px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate font-sans text-[12px] font-semibold text-[#111827]">
                      {item.name}
                    </p>
                    <p className="mt-0.5 font-sans text-[10px] text-[#7a738c]">{item.size}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span
                      className={
                        item.status === "Ready"
                          ? "rounded-[10px] bg-[#dcfce7] px-2.5 py-1 font-sans text-[10px] font-semibold text-[#15803d]"
                          : "rounded-[10px] bg-[#ede9fe] px-2.5 py-1 font-sans text-[10px] font-semibold text-[#7c3aed]"
                      }
                    >
                      {item.status}
                    </span>
                    {files.length ? (
                      <button
                        type="button"
                        onClick={() => removeFile(item.id)}
                        className="inline-flex h-7 w-7 items-center justify-center rounded-[10px] text-[#6b6680] hover:bg-white hover:text-[#111827]"
                        aria-label={`Remove ${item.name}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
            <GradientButton size="sm" fullWidth className="mt-4" disabled={!files.length}>
              Start AI clipping
            </GradientButton>
          </section>
        </DashboardMotion>
      </div>
    </div>
  );
}
