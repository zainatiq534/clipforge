import { ArrowRight, Calendar, Eye, Flame } from "lucide-react";
import Link from "next/link";
import { SoftContinuousBackground } from "@/components/shared/SoftContinuousBackground";
import { SOFT_PAGE_BASE } from "@/lib/softPageBg";
import { cn } from "@/lib/cn";

const posts = [
  {
    rank: 1,
    slug: "top-10-ai-tools-2025",
    category: "AI Tools",
    title: "Top 10 AI Tools for Content Creation in 2025",
    date: "Apr 15, 2025",
    views: "6.2K",
    excerpt:
      "Discover the most powerful AI tools that are revolutionizing content creation this year.",
    image: "/blog/popular-1.png?v=hq2",
    imageAlt: "AI neural network graphic with purple lighting",
  },
  {
    rank: 2,
    slug: "video-editing-capcut-guide",
    category: "Video Editing",
    title: "Complete Guide to Video Editing with CapCut",
    date: "Apr 12, 2025",
    views: "5.8K",
    excerpt:
      "Master CapCut with this step-by-step guide covering cuts, effects, captions and exports.",
    image: "/blog/popular-2.png?v=hq2",
    imageAlt: "Laptop showing video editing software",
  },
  {
    rank: 3,
    slug: "social-media-growth-strategies",
    category: "Social Media",
    title: "Social Media Growth Strategies That Actually Work",
    date: "Apr 10, 2025",
    views: "4.9K",
    excerpt:
      "Proven tactics to grow your audience on TikTok, Instagram Reels and YouTube Shorts.",
    image: "/blog/popular-3.png?v=hq2",
    imageAlt: "Social media app icons with purple neon glow",
  },
  {
    rank: 4,
    slug: "wordpress-website-beginner-guide",
    category: "Web Design",
    title: "How to Make a Website with WordPress (Beginner Guide)",
    date: "Apr 8, 2025",
    views: "4.1K",
    excerpt:
      "A beginner-friendly walkthrough to launch your first WordPress site without coding.",
    image: "/blog/popular-4.png?v=hq2",
    imageAlt: "Office desk with computer monitor",
  },
] as const;

type BlogPopularPostsProps = {
  className?: string;
};

export function BlogPopularPosts({ className }: BlogPopularPostsProps) {
  return (
    <section
      className={cn("relative w-full overflow-hidden", className)}
      style={{ background: SOFT_PAGE_BASE }}
      aria-labelledby="popular-posts-heading"
    >
      <SoftContinuousBackground />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        {/* Header — icon + title one row */}
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <div className="flex items-center justify-center gap-3 sm:gap-3.5">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[#7c3aed] text-white shadow-[0_10px_28px_rgba(124,58,237,0.28)] sm:h-12 sm:w-12 sm:rounded-[14px]">
              <Flame className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.1} aria-hidden />
            </span>
            <h2
              id="popular-posts-heading"
              className="font-display text-[2rem] font-bold tracking-tight text-[#1e1b4b] sm:text-[2.35rem] lg:text-[2.6rem]"
            >
              Popular Posts
            </h2>
          </div>

          <p className="mt-3 max-w-lg font-sans text-[0.9375rem] leading-relaxed text-[#64748b] sm:text-base">
            Most read articles, trending topics and community favorites from our blog.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-5 xl:gap-6">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="flex flex-col overflow-hidden rounded-[18px] border border-[#ebe6f8] bg-white shadow-[0_8px_30px_rgba(76,29,149,0.06),0_2px_8px_rgba(15,23,42,0.04)]"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#efeafc]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image}
                  alt={post.imageAlt}
                  width={800}
                  height={450}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />

                {/* Rank */}
                <span className="absolute top-2.5 left-2.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#7c3aed] font-sans text-xs font-bold text-white shadow-sm sm:h-8 sm:w-8 sm:text-sm">
                  {post.rank}
                </span>

                {/* Views */}
                <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 rounded-full bg-black/45 px-2 py-0.5 font-sans text-[10px] font-semibold text-white backdrop-blur-sm sm:text-[11px]">
                  <Eye className="h-3 w-3" strokeWidth={2.2} aria-hidden />
                  {post.views}
                </span>

                {/* Popular badge */}
                <span className="absolute bottom-2.5 left-2.5 inline-flex rounded-full bg-[#7c3aed] px-2.5 py-0.5 font-sans text-[10px] font-semibold text-white sm:text-[11px]">
                  Popular
                </span>
              </div>

              <div className="flex flex-1 flex-col px-4 pb-4 pt-3.5 sm:px-4 sm:pb-5 sm:pt-4">
                <span className="inline-flex w-fit rounded-full bg-[#f3e8ff] px-2.5 py-0.5 font-sans text-[10px] font-semibold text-[#7c3aed] sm:text-[11px]">
                  {post.category}
                </span>

                <h3 className="mt-2.5 font-sans text-[0.95rem] leading-snug font-bold tracking-tight text-[#1e1b4b] sm:text-[1rem]">
                  <Link href={`/blog/${post.slug}`} className="hover:text-[#7c3aed]">
                    {post.title}
                  </Link>
                </h3>

                <div className="mt-2.5 inline-flex items-center gap-1.5 font-sans text-[11px] text-[#94a3b8] sm:text-xs">
                  <Calendar className="h-3 w-3 shrink-0" strokeWidth={2} aria-hidden />
                  {post.date}
                </div>

                <p className="mt-2.5 flex-1 font-sans text-[0.8125rem] leading-relaxed text-[#64748b] sm:text-sm">
                  {post.excerpt}
                </p>

                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-4 inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-[#7c3aed] transition-colors hover:text-[#6d28d9]"
                >
                  Read More
                  <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} aria-hidden />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
