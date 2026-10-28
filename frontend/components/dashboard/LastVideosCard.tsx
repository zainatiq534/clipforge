import { Eye, Heart, MessageCircle } from "lucide-react";

const videos = [
  {
    title: "Brand Workshop Recap",
    views: "2.4k",
    comments: "128",
    likes: "840",
    gradient: "from-[#a78bfa] via-[#818cf8] to-[#6366f1]",
  },
  {
    title: "Product Launch Teaser",
    views: "1.8k",
    comments: "96",
    likes: "612",
    gradient: "from-[#c4b5fd] via-[#a78bfa] to-[#7c3aed]",
  },
];

export function LastVideosCard() {
  return (
    <section className="rounded-[22px] bg-white p-3.5 shadow-[0_10px_28px_rgba(20,20,40,0.06)]">
      <div className="flex items-center justify-between">
        <h2 className="font-sans text-[13px] font-bold text-[#1a1a1f]">Last videos</h2>
        <Eye className="h-4 w-4 text-[#8b849c]" strokeWidth={1.8} aria-hidden />
      </div>

      <div className="mt-4 space-y-3">
        {videos.map((video) => (
          <article
            key={video.title}
            className="flex items-center gap-3 rounded-[18px] bg-[#f7f5fb] p-2.5"
          >
            <div
              className={`h-14 w-14 shrink-0 rounded-[14px] bg-gradient-to-br ${video.gradient}`}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-sans text-[12px] font-semibold text-[#1a1a1f]">
                {video.title}
              </p>
              <div className="mt-1.5 flex items-center gap-3 font-sans text-[10px] text-[#7a738c]">
                <span className="inline-flex items-center gap-1">
                  <Eye className="h-3 w-3" /> {video.views}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MessageCircle className="h-3 w-3" /> {video.comments}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Heart className="h-3 w-3" /> {video.likes}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
