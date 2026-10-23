import {
  ArrowRight,
  BarChart3,
  Clapperboard,
  Cpu,
  GraduationCap,
  LayoutGrid,
  Lightbulb,
  Paintbrush,
  PenLine,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { SoftContinuousBackground } from "@/components/SoftContinuousBackground";
import { SOFT_PAGE_BASE } from "@/lib/softPageBg";
import { cn } from "@/lib/cn";

const categories = [
  {
    slug: "ai-tools",
    title: "AI Tools",
    posts: "12 Posts",
    icon: Cpu,
  },
  {
    slug: "video-editing",
    title: "Video Editing",
    posts: "18 Posts",
    icon: Clapperboard,
  },
  {
    slug: "social-media",
    title: "Social Media",
    posts: "15 Posts",
    icon: Share2,
  },
  {
    slug: "content-creation",
    title: "Content Creation",
    posts: "10 Posts",
    icon: PenLine,
  },
  {
    slug: "design-graphics",
    title: "Design & Graphics",
    posts: "9 Posts",
    icon: Paintbrush,
  },
  {
    slug: "marketing",
    title: "Marketing",
    posts: "14 Posts",
    icon: BarChart3,
  },
  {
    slug: "tutorials",
    title: "Tutorials",
    posts: "22 Posts",
    icon: GraduationCap,
  },
  {
    slug: "tips-tricks",
    title: "Tips & Tricks",
    posts: "8 Posts",
    icon: Lightbulb,
  },
] as const;

type BlogCategoriesProps = {
  className?: string;
};

export function BlogCategories({ className }: BlogCategoriesProps) {
  return (
    <section
      className={cn("relative w-full overflow-hidden", className)}
      style={{ background: SOFT_PAGE_BASE }}
      aria-labelledby="categories-heading"
    >
      <SoftContinuousBackground />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        {/* Header — icon + title same row as reference */}
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <div className="flex items-center justify-center gap-3 sm:gap-3.5">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px] bg-[#7c3aed] text-white shadow-[0_10px_28px_rgba(124,58,237,0.28)] sm:h-12 sm:w-12 sm:rounded-[14px]">
              <LayoutGrid className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.1} aria-hidden />
            </span>
            <h2
              id="categories-heading"
              className="font-display text-[2rem] font-bold tracking-tight text-[#1e1b4b] sm:text-[2.35rem] lg:text-[2.6rem]"
            >
              Categories
            </h2>
          </div>

          <p className="mt-3 max-w-lg font-sans text-[0.9375rem] leading-relaxed text-[#64748b] sm:text-base">
            Browse through different categories and find the content that matches your
            interests.
          </p>
        </div>

        {/* 4×2 category cards */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4 lg:gap-5">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <article
                key={cat.slug}
                className="relative flex min-h-[9.5rem] flex-col rounded-[18px] border border-[#ebe6f8] bg-white p-5 shadow-[0_8px_30px_rgba(76,29,149,0.06),0_2px_8px_rgba(15,23,42,0.04)] sm:min-h-[10.25rem] sm:p-5"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-[12px] bg-[#7c3aed] text-white shadow-[0_8px_20px_rgba(124,58,237,0.25)]">
                  <Icon className="h-5 w-5" strokeWidth={2.1} aria-hidden />
                </span>

                <h3 className="mt-4 font-sans text-[1.05rem] font-bold tracking-tight text-[#1e1b4b] sm:text-[1.1rem]">
                  {cat.title}
                </h3>
                <p className="mt-1 font-sans text-sm text-[#94a3b8]">{cat.posts}</p>

                <Link
                  href={`/blog?category=${cat.slug}`}
                  className="absolute right-4 bottom-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#7c3aed] text-white shadow-[0_6px_16px_rgba(124,58,237,0.3)] transition-transform hover:scale-105"
                  aria-label={`Browse ${cat.title}`}
                >
                  <ArrowRight className="h-4 w-4" strokeWidth={2.4} aria-hidden />
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
