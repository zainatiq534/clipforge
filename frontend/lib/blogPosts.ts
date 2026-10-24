export type BlogPostSection = {
  heading: string;
  paragraphs: string[];
};

export type BlogPost = {
  slug: string;
  category: string;
  title: string;
  date: string;
  views: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  popular?: boolean;
  rank?: number;
  body: string[];
  sections?: BlogPostSection[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "top-10-ai-tools-2025",
    category: "AI Tools",
    title: "Top 10 AI Tools for Content Creation in 2025",
    date: "Apr 15, 2025",
    views: "5.2K views",
    excerpt:
      "Discover the most powerful AI tools that are revolutionizing content creation this year.",
    image: "/blog/popular-1.png?v=hq2",
    imageAlt: "AI graphic with purple lighting on a laptop",
    popular: true,
    rank: 1,
    body: [
      "AI tools are transforming how creators, marketers, and businesses produce content. From writing assistants to video editors, these platforms help you ship faster without sacrificing quality.",
      "In this guide, we break down the top AI tools for content creation in 2025 — what they do best, who they are for, and how to combine them into a smooth workflow.",
    ],
    sections: [
      {
        heading: "1. ChatGPT",
        paragraphs: [
          "ChatGPT remains a go-to for outlines, scripts, captions, and brainstorming. Pair it with clear prompts and brand examples to get publish-ready drafts in minutes.",
        ],
      },
    ],
  },
  {
    slug: "video-editing-capcut-guide",
    category: "Video Editing",
    title: "Complete Guide to Video Editing with CapCut",
    date: "Apr 12, 2025",
    views: "5.8K views",
    excerpt:
      "Master CapCut with this step-by-step guide covering cuts, effects, captions and exports.",
    image: "/blog/popular-2.png?v=hq2",
    imageAlt: "Laptop showing video editing software",
    popular: true,
    rank: 2,
    body: [
      "CapCut makes short-form editing accessible for beginners and fast for pros. Learn timelines, captions, effects, and export presets that look great on TikTok, Reels, and Shorts.",
    ],
  },
  {
    slug: "social-media-growth-strategies",
    category: "Social Media",
    title: "Social Media Growth Strategies That Actually Work",
    date: "Apr 10, 2025",
    views: "4.9K views",
    excerpt:
      "Proven tactics to grow your audience on TikTok, Instagram Reels and YouTube Shorts.",
    image: "/blog/popular-3.png?v=hq2",
    imageAlt: "Social media app icons with purple neon glow",
    popular: true,
    rank: 3,
    body: [
      "Growth is not luck — it is consistent hooks, posting cadence, and platform-native formats. Here are strategies creators use to compound reach without burning out.",
    ],
  },
  {
    slug: "wordpress-website-beginner-guide",
    category: "Web Design",
    title: "How to Make a Website with WordPress (Beginner Guide)",
    date: "Apr 8, 2025",
    views: "4.1K views",
    excerpt:
      "A beginner-friendly walkthrough to launch your first WordPress site without coding.",
    image: "/blog/popular-4.png?v=hq2",
    imageAlt: "Office desk with computer monitor",
    popular: true,
    rank: 4,
    body: [
      "WordPress still powers a huge share of the web. This beginner guide walks through hosting, themes, pages, and your first publish — step by step.",
    ],
  },
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
    body: [
      "Thumbnails decide whether viewers click. With AI, you can generate bold faces, text layouts, and color contrast that stand out in crowded feeds — then refine the best options for your brand.",
    ],
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
    body: [
      "Social platforms move fast. The right AI stack helps you ideate, caption, clip, and schedule without losing your voice.",
    ],
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
    body: [
      "Start with clean cuts, readable captions, and strong hooks. AI can auto-detect highlights and suggest reframes so you spend less time scrubbing timelines.",
    ],
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
    body: [
      "AI will not replace great creators — it will amplify them. The winners will combine taste, distribution, and tools that remove busywork from the workflow.",
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getAllBlogSlugs(): string[] {
  return blogPosts.map((post) => post.slug);
}

export function getPopularSidebarPosts(): BlogPost[] {
  return blogPosts
    .filter((post) => post.popular)
    .sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99))
    .slice(0, 4);
}

export function getPopularPosts(): BlogPost[] {
  return getPopularSidebarPosts();
}

export function getLatestPosts(): BlogPost[] {
  return blogPosts.filter((post) => !post.popular).slice(0, 4);
}
