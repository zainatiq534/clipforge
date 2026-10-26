import type { Metadata } from "next";
import { BlogCategories } from "@/components/blog/BlogCategories";
import { BlogLatestPosts } from "@/components/blog/BlogLatestPosts";
import { BlogPopularPosts } from "@/components/blog/BlogPopularPosts";
import { Hero } from "@/components/home/Hero";
import { BackgroundImage } from "@/components/ui/Image";

export const metadata: Metadata = {
  title: "Blog — ClipForge",
  description:
    "Tips, guides, and updates on AI clipping, short-form video, and growing with ClipForge.",
};

export default function BlogPage() {
  return (
    <>
      {/* Home section — same as homepage */}
      <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
        <BackgroundImage src="/hero-bg.jpg" />

        <div className="relative z-10 flex min-h-full flex-1 flex-col pt-20">
          <Hero />
        </div>
      </div>

      {/* Latest Posts — light section matching reference */}
      <BlogLatestPosts />

      {/* Categories — same light theme / layout as reference */}
      <BlogCategories />

      {/* Popular Posts — same light theme / layout as reference */}
      <BlogPopularPosts />
    </>
  );
}
