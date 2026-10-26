"use client";

import type { ReactNode } from "react";
import { SoftContinuousBackground } from "@/components/SoftContinuousBackground";
import { SOFT_PAGE_BASE } from "@/lib/softPageBg";

type FeaturesLightCanvasProps = {
  children: ReactNode;
};

/** Light features canvas (soft washes only — no Three.js background motion). */
export function FeaturesLightCanvas({ children }: FeaturesLightCanvasProps) {
  return (
    <div className="relative" style={{ background: SOFT_PAGE_BASE }}>
      <SoftContinuousBackground />
      <div className="relative z-10 flex flex-col">{children}</div>
    </div>
  );
}
