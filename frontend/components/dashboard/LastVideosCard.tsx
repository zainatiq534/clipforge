"use client";

import { Eye, Film, Flame } from "lucide-react";
import Link from "next/link";
import type { VideoUpload } from "@/lib/uploads";

const GRADIENTS = [
  "from-[#a78bfa] via-[#818cf8] to-[#6366f1]",
  "from-[#c4b5fd] via-[#a78bfa] to-[#7c3aed]",
  "from-[#8b5cf6] via-[#7c3aed] to-[#3b82f6]",
  "from-[#ddd6fe] via-[#a78bfa] to-[#60a5fa]",
];

type LastVideosCardProps = {
  uploads: VideoUpload[];
  loading?: boolean;
};

function formatDuration(sec?: number) {
  if (!sec || !Number.isFinite(sec) || sec <= 0) return "—";
  const s = Math.round(sec);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

export function LastVideosCard({ uploads, loading }: LastVideosCardProps) {
  return (
    <section className="rounded-[22px] bg-white p-3.5 shadow-[0_10px_28px_rgba(20,20,40,0.06)]">
      <div className="flex items-center justify-between">
        <h2 className="font-sans text-[13px] font-bold text-[#1a1a1f]">
          Last videos
        </h2>
        <Link
          href="/dashboard/projects"
          className="font-sans text-[10px] font-semibold text-[#7c3aed] hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="mt-4 space-y-3">
        {loading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-[4.25rem] animate-pulse rounded-[18px] bg-[#f7f5fb]"
            />
          ))
        ) : uploads.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-[18px] bg-[#f7f5fb] px-3 py-6 text-center">
            <Film className="h-4 w-4 text-[#8b5cf6]" />
            <p className="font-sans text-[11px] text-[#7a738c]">
              No uploads yet. Start from Upload.
            </p>
          </div>
        ) : (
          uploads.map((video, i) => (
            <Link
              key={video.id}
              href={`/dashboard/upload?upload=${encodeURIComponent(video.id)}`}
              className="flex items-center gap-3 rounded-[18px] bg-[#f7f5fb] p-2.5 transition hover:bg-[#efeaf8]"
            >
              <div
                className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-[14px] bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]}`}
              >
                {video.secureUrl || video.latestClipUrl ? (
                  <video
                    src={video.latestClipUrl || video.secureUrl}
                    muted
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-sans text-[12px] font-semibold text-[#1a1a1f]">
                  {video.name || "Untitled upload"}
                </p>
                <div className="mt-1.5 flex flex-wrap items-center gap-3 font-sans text-[10px] text-[#7a738c]">
                  <span className="inline-flex items-center gap-1 capitalize">
                    <Eye className="h-3 w-3" /> {video.status}
                  </span>
                  <span>{formatDuration(video.durationSec)}</span>
                  {video.latestViralScore != null &&
                  video.latestViralScore > 0 ? (
                    <span className="inline-flex items-center gap-1">
                      <Flame className="h-3 w-3 text-[#8b5cf6]" />{" "}
                      {Math.round(video.latestViralScore)}
                    </span>
                  ) : null}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
