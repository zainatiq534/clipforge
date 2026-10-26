import { ArrowLeft, ArrowRight, Calendar, Eye, Flame } from "lucide-react";
import Link from "next/link";
import type { BlogPost } from "@/lib/blogPosts";
import { getPopularPosts } from "@/lib/blogPosts";
import { SoftContinuousBackground } from "@/components/SoftContinuousBackground";
import { SOFT_PAGE_BASE } from "@/lib/softPageBg";
import { cn } from "@/lib/cn";

type BlogPostArticleProps = {
  post: BlogPost;
  className?: string;
};

export function BlogPostArticle({ post, className }: BlogPostArticleProps) {
  const popular = getPopularPosts();

  return (
    <section
      className={cn("relative w-full overflow-hidden", className)}
      style={{ background: SOFT_PAGE_BASE }}
    >
      <SoftContinuousBackground />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-16 pt-4 sm:px-8 sm:pb-20 sm:pt-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 font-sans text-sm font-semibold text-[#7c3aed] transition-colors hover:text-[#6d28d9]"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={2.4} aria-hidden />
          Back to Blog
        </Link>

        <div className="mt-5 grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(260px,300px)] lg:gap-7 xl:gap-8">
          {/* Main article card */}
          <article className="overflow-hidden rounded-[20px] border border-[#ebe6f8] bg-white shadow-[0_10px_40px_rgba(76,29,149,0.07),0_2px_10px_rgba(15,23,42,0.04)]">
            <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#efeafc] sm:aspect-[2/1]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.image}
                alt={post.imageAlt}
                width={1200}
                height={600}
                className="h-full w-full object-cover"
                decoding="async"
              />
              {post.popular ? (
                <span className="absolute top-3 left-3 inline-flex rounded-full bg-[#7c3aed] px-2.5 py-0.5 font-sans text-[11px] font-semibold text-white shadow-sm">
                  Popular
                </span>
              ) : null}
            </div>

            <div className="px-5 py-5 sm:px-7 sm:py-6 lg:px-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex rounded-full bg-[#f3e8ff] px-2.5 py-0.5 font-sans text-[11px] font-semibold text-[#7c3aed]">
                  {post.category}
                </span>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-xs text-[#94a3b8]">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                    {post.date}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                    {post.views.replace(" views", "")} views
                  </span>
                </div>
              </div>

              <h1 className="mt-4 font-display text-[1.65rem] leading-tight font-bold tracking-tight text-[#1e1b4b] sm:text-[2rem] lg:text-[2.15rem]">
                {post.title}
              </h1>

              <div className="mt-5 space-y-4 font-sans text-[0.9375rem] leading-relaxed text-[#475569] sm:text-base">
                <p>{post.body.intro}</p>
                {post.body.sections.map((section) => (
                  <div key={section.heading}>
                    <h2 className="mt-6 font-sans text-lg font-bold text-[#1e1b4b]">
                      {section.heading}
                    </h2>
                    {section.paragraphs.map((p) => (
                      <p key={p.slice(0, 24)} className="mt-2">
                        {p}
                      </p>
                    ))}
                  </div>
                ))}
              </div>

              <Link
                href="/blog"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#6d28d9] px-5 py-2.5 font-sans text-sm font-semibold text-white shadow-[0_8px_22px_rgba(124,58,237,0.35)] transition-opacity hover:opacity-95"
              >
                Read More
                <ArrowRight className="h-4 w-4" strokeWidth={2.4} aria-hidden />
              </Link>
            </div>
          </article>

          {/* Popular Posts sidebar */}
          <aside className="rounded-[20px] border border-[#ebe6f8] bg-white p-5 shadow-[0_10px_40px_rgba(76,29,149,0.07),0_2px_10px_rgba(15,23,42,0.04)] sm:p-5">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#7c3aed] text-white shadow-[0_6px_16px_rgba(124,58,237,0.28)]">
                <Flame className="h-4 w-4" strokeWidth={2.2} aria-hidden />
              </span>
              <h2 className="font-sans text-base font-bold text-[#1e1b4b]">Popular Posts</h2>
            </div>

            <ul className="mt-5 space-y-4">
              {popular.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={`/blog/${item.slug}`}
                    className="group flex items-start gap-3"
                  >
                    <span className="relative mt-0.5 h-14 w-14 shrink-0 overflow-hidden rounded-[12px] bg-[#efeafc]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt=""
                        width={56}
                        height={56}
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute -top-1 -left-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#7c3aed] font-sans text-[10px] font-bold text-white shadow-sm">
                        {item.rank}
                      </span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-sans text-[0.8125rem] leading-snug font-bold text-[#1e1b4b] transition-colors group-hover:text-[#7c3aed] sm:text-sm">
                        {item.title}
                      </span>
                      <span className="mt-1 inline-flex items-center gap-1 font-sans text-[11px] text-[#94a3b8]">
                        <Eye className="h-3 w-3" strokeWidth={2} aria-hidden />
                        {item.views.includes("views") ? item.views : `${item.views} views`}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
