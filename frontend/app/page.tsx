import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { BackgroundImage } from "@/components/ui/Image";

export default function Home() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <BackgroundImage src="/hero-bg.jpg" />

      <div className="relative z-10 flex min-h-full flex-1 flex-col">
        <Header />
        <Hero />
      </div>
    </div>
  );
}
