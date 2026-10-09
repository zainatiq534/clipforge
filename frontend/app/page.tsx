import Image from "next/image";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { EnergyFieldLazy } from "@/components/three/EnergyFieldLazy";

export default function Home() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-hidden">
      <Image
        src="/hero-bg.jpg"
        alt=""
        fill
        preload
        sizes="100vw"
        className="object-cover object-center"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,8,20,0.15)_0%,rgba(5,8,20,0.55)_70%,rgba(5,8,20,0.75)_100%)]"
        aria-hidden
      />
      <EnergyFieldLazy />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-40 bg-gradient-to-b from-[#6d4dff]/20 to-transparent"
        aria-hidden
      />

      <div className="relative z-10 flex min-h-full flex-1 flex-col">
        <Header />
        <Hero />
      </div>
    </div>
  );
}
