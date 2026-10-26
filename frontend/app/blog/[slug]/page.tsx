import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogLightHeader } from "@/components/BlogLightHeader";
import { BlogPostDetail } from "@/components/BlogPostDetail";
import { SoftContinuousBackground } from "@/components/SoftContinuousBackground";
import { getAllBlogSlugs, getBlogPost } from "@/lib/blogPosts";
import { SOFT_PAGE_BASE } from "@/lib/softPageBg";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Post — ClipForge" };
  return {
    title: `${post.title} — ClipForge Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      style={{ background: SOFT_PAGE_BASE }}
    >
      <SoftContinuousBackground />
      <div className="relative z-10 flex min-h-screen flex-col">
        <BlogLightHeader />
        <BlogPostDetail post={post} withBackground={false} />
      </div>
    </div>
  );
}
