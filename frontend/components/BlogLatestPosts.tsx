import { ArrowRight, Calendar, Eye, FileText } from "lucide-react";
import Link from "next/link";
import { SoftContinuousBackground } from "@/components/SoftContinuousBackground";
import { SOFT_PAGE_BASE } from "@/lib/softPageBg";
import { cn } from "@/lib/cn";

const posts = [
  {
    slug: "youtube-thumbnails-ai-2025",
    category: "Tutorial",
    title: "How to Create YouTube Thumbnails with AI in 2025",
    date: "Apr 25, 2025",
    views: "2.4K views",
    excerpt:
      "Learn how to design eye-catching YouTube thumbnails using AI tools that boost your click-through rates.",
    image: "/blog/post-1.jpg?v=v4",
    imageAlt: "Laptop on a desk showing a content design layout",
  },
  {
    slug: "best-ai-tools-social-media",
    category: "Tips",
    title: "Best AI Tools for Social Media Content Creation",
    date: "Apr 22, 2025",
    views: "3.1K views",
    excerpt:
      "Discover the top AI-powered tools that help creators produce engaging social media content faster.",
    image: "/blog/post-2.jpg?v=v4",
    imageAlt: "Smartphone with Instagram on screen",
  },
  {
    slug: "video-editing-tips-beginners",
    category: "Guide",
    title: "Video Editing Tips for Beginners (With AI Tools)",
    date: "Apr 18, 2025",
    views: "1.8K views",
    excerpt:
      "A beginner-friendly guide to video editing workflows and AI tools that simplify the process.",
    image: "/blog/post-3.jpg?v=v4",
    imageAlt: "Video editing software on a laptop",
  },
  {
    slug: "future-of-ai-content-creation",
    category: "AI",
    title: "The Future of AI in Content Creation",
    date: "Apr 15, 2025",
    views: "4.2K views",
    excerpt:
      "Explore how AI is transforming content creation and what it means for creators and marketers.",
    image: "/blog/post-4.jpg?v=v4",
    imageAlt: "Laptop with AI branding on screen",
  },
] as const;

type BlogLatestPostsProps = {
  className?: string;
};

export function BlogLatestPosts({ className }: BlogLatestPostsProps) {
  return (
    <section
      className={cn("relative w-full overflow-hidden", className)}
      style={{ background: SOFT_PAGE_BASE }}
      aria-labelledby="latest-posts-heading"
    >
      <SoftContinuousBackground />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        {/* Header — icon + title on one row (same as reference) */}
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <div className="flex items-center justify-center gap-3 sm:gap-3.5">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[#7c3aed] text-white shadow-[0_10px_28px_rgba(124,58,237,0.28)] sm:h-12 sm:w-12 sm:rounded-[14px]">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.1} aria-hidden />
            </span>
            <h2
              id="latest-posts-heading"
              className="font-display text-[2rem] font-bold tracking-tight text-[#1e1b4b] sm:text-[2.35rem] lg:text-[2.6rem]"
            >
              Latest Posts
            </h2>
          </div>

          <p className="mt-3 max-w-lg font-sans text-[0.9375rem] leading-relaxed text-[#64748b] sm:text-base">
            Discover the latest articles, tutorials and insights to help you create
            better content and grow your skills.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-5 xl:gap-6">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="flex flex-col overflow-hidden rounded-[18px] border border-[#ebe6f8] bg-white shadow-[0_8px_30px_rgba(76,29,149,0.06),0_2px_8px_rgba(15,23,42,0.04)]"
            >
              <Link
                href={`/blog/${post.slug}`}
                className="relative aspect-[16/10] w-full overflow-hidden bg-[#efeafc]"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.image}
                  alt={post.imageAlt}
                  width={640}
                  height={360}
                  className="h-full w-full object-cover [image-rendering:auto]"
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                />
              </Link>

              <div className="flex flex-1 flex-col px-4 pb-4 pt-3.5 sm:px-4 sm:pb-5 sm:pt-4">
                <span className="inline-flex w-fit rounded-full bg-[#7c3aed] px-2.5 py-0.5 font-sans text-[10px] font-semibold tracking-wide text-white sm:text-[11px]">
                  {post.category}
                </span>

                <h3 className="mt-2.5 font-sans text-[0.95rem] leading-snug font-bold tracking-tight text-[#1e1b4b] sm:text-[1rem]">
                  <Link href={`/blog/${post.slug}`} className="hover:text-[#7c3aed]">
                    {post.title}
                  </Link>
                </h3>

                <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 font-sans text-[11px] text-[#94a3b8] sm:text-xs">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3 shrink-0" strokeWidth={2} aria-hidden />
                    {post.date}
                  </span>
                  <span className="text-[#cbd5e1]" aria-hidden>
                    •
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Eye className="h-3 w-3 shrink-0" strokeWidth={2} aria-hidden />
                    {post.views}
                  </span>
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
