import Image from "next/image";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";

export default function Home() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <Image
        src="/hero-bg.jpg"
        alt=""
        fill
        preload
        quality={100}
        sizes="100vw"
        className="object-cover object-center"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,8,20,0.08)_0%,rgba(5,8,20,0.35)_65%,rgba(5,8,20,0.55)_100%)]"
        aria-hidden
      />

      <div className="relative z-10 flex min-h-full flex-1 flex-col">
        <Header />
        <Hero />
      </div>
    </div>
  );
}
