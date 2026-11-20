import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const frontendRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 100],
  },
  experimental: {
    agentFeedback: false,
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  // Cache Components + partial prefetch fight Firebase client-auth gates
  // and were causing multi-second FS compaction + broken instant nav in dev.
  // Re-enable later with proper Suspense/`instant` migration if needed.
  // Keep Turbopack rooted on frontend/ so .env.local NEXT_PUBLIC_* vars load
  // (a root package-lock.json otherwise makes Next pick D:\clipforge as root).
  turbopack: {
    root: frontendRoot,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
