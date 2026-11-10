import type { Metadata } from "next";
import { Caveat, Outfit, Plus_Jakarta_Sans } from "next/font/google";
import { SiteShell } from "@/components/layout/SiteShell";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ClipForge — Turn Long Videos Into Viral-Ready Clips",
  description:
    "Upload long videos and let ClipForge create 5–10 engaging, captioned, vertical clips for TikTok, Instagram Reels, and YouTube Shorts.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${plusJakarta.variable} ${caveat.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Anton&family=Bangers&family=Barlow+Condensed:wght@700;800&family=Bebas+Neue&family=Caveat:wght@600;700&family=Cinzel:wght@700&family=Figtree:wght@600;700&family=Great+Vibes&family=Inter:wght@500;600;700;800&family=JetBrains+Mono:wght@500;700&family=Luckiest+Guy&family=Montserrat:wght@600;700;800;900&family=Noto+Nastaliq+Urdu:wght@700&family=Noto+Sans+Devanagari:wght@700&family=Nunito:wght@700;800&family=Orbitron:wght@700&family=Oswald:wght@600;700&family=Permanent+Marker&family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=Poppins:wght@600;700;800&family=Righteous&family=Space+Grotesk:wght@500;700&family=Teko:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-dvh bg-background font-sans text-foreground">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
