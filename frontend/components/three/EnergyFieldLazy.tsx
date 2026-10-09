"use client";

import dynamic from "next/dynamic";

export const EnergyFieldLazy = dynamic(
  () => import("@/components/three/EnergyField").then((m) => m.EnergyField),
  { ssr: false },
);
