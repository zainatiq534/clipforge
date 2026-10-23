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
  body: {
    intro: string;
    sections: { heading: string; paragraphs: string[] }[];
  };
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
    imageAlt: "Laptop with AI branding on screen",
    popular: true,
    rank: 1,
    body: {
      intro:
        "Artificial intelligence is transforming how creators plan, write, edit and publish content. In 2025, the best AI tools help you move faster without sacrificing quality — from drafting scripts to polishing short-form clips.",
      sections: [
        {
          heading: "1. ChatGPT",
          paragraphs: [
            "ChatGPT remains a go-to for brainstorming hooks, outlining long-form scripts, and rewriting captions for every platform. Pair it with ClipForge to turn those ideas into ready-to-post vertical clips.",
          ],
        },
        {
          heading: "2. ClipForge",
          paragraphs: [
            "ClipForge finds the highest-performing moments in long videos, reframes them for Shorts and Reels, and adds captions automatically — so one recording becomes a full week of content.",
          ],
        },
        {
          heading: "3. Midjourney & image AI",
          paragraphs: [
            "Use image generators for thumbnails, cover frames and b-roll concepts. Keep branding consistent, then drop the best frames into your CapCut or ClipForge timeline.",
          ],
        },
      ],
    },
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
    body: {
      intro:
        "CapCut is one of the most popular free editors for short-form video. This guide walks through a clean beginner workflow — from import to export — so your clips look polished on every platform.",
      sections: [
        {
          heading: "1. Import and organize",
          paragraphs: [
            "Start a new project, import your long video, and mark the strongest hooks. Keep audio levels consistent before you cut.",
          ],
        },
        {
          heading: "2. Cut, captions, export",
          paragraphs: [
            "Trim to 15–60 seconds, add auto captions, then export in 9:16 for TikTok, Reels and Shorts. Or skip manual steps and let ClipForge generate captioned clips for you.",
          ],
        },
      ],
    },
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
    body: {
      intro:
        "Growth on short-form platforms comes from consistency, strong hooks, and platform-native formatting. Here’s what creators use most in 2025.",
      sections: [
        {
          heading: "1. Post cadence",
          paragraphs: [
            "Aim for 4–7 shorts per week. Repurpose one long video into multiple clips so you stay consistent without burning out.",
          ],
        },
        {
          heading: "2. Hook in three seconds",
          paragraphs: [
            "Lead with a bold claim, a question, or a visual pattern interrupt. Captions help viewers stay when sound is off.",
          ],
        },
      ],
    },
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
    body: {
      intro:
        "WordPress still powers a huge share of the web. This beginner guide covers hosting, themes, and your first pages.",
      sections: [
        {
          heading: "1. Hosting and install",
          paragraphs: [
            "Pick a host with one-click WordPress install. Secure your site with HTTPS and a strong admin password.",
          ],
        },
        {
          heading: "2. Theme and content",
          paragraphs: [
            "Choose a lightweight theme, add Home and Blog pages, then publish your first post. Link ClipForge content when you share video guides.",
          ],
        },
      ],
    },
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
    body: {
      intro:
        "Thumbnails decide whether someone clicks. AI tools can help you generate faces, backgrounds and text layouts faster — then you refine for clarity and contrast.",
      sections: [
        {
          heading: "1. Start with a clear subject",
          paragraphs: [
            "One face or one object, big text, and high contrast. Avoid clutter that disappears on mobile.",
          ],
        },
      ],
    },
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
    body: {
      intro:
        "From caption writing to clip generation, AI can compress hours of work into minutes. Here’s a practical stack for social creators.",
      sections: [
        {
          heading: "1. Clip and caption tools",
          paragraphs: [
            "Use ClipForge for auto clips and captions, then polish hooks with a writing assistant before you schedule posts.",
          ],
        },
      ],
    },
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
    body: {
      intro:
        "You don’t need a complex NLE to start. Learn a simple cut-caption-export loop, then layer AI where it saves the most time.",
      sections: [
        {
          heading: "1. Keep cuts intentional",
          paragraphs: [
            "Every cut should move the story forward. Remove silence, keep energy high, and add captions for mute viewing.",
          ],
        },
      ],
    },
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
    body: {
      intro:
        "AI won’t replace creators — but creators who use AI will outpace those who don’t. The future is human taste plus machine speed.",
      sections: [
        {
          heading: "1. Human taste still wins",
          paragraphs: [
            "Use AI for drafts and cuts, then apply your judgment on hooks, pacing and brand voice before you publish.",
          ],
        },
      ],
    },
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getPopularPosts(): BlogPost[] {
  return blogPosts
    .filter((p) => p.popular)
    .sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99));
}

export function getAllPostSlugs(): string[] {
  return blogPosts.map((p) => p.slug);
}
