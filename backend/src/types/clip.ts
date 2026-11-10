export type ViralClip = {
  id: string;
  uploadId: string;
  uid: string;
  title: string;
  hook: string;
  reason: string;
  viralScore: number;
  startSec: number;
  endSec: number;
  durationSec: number;
  sourcePublicId: string;
  clipUrl: string;
  status: "ready" | "failed" | "processing";
  source?: "ai" | "manual";
  rank?: number;
  createdAt: string;
  updatedAt: string;
};

export type ManualSegment = {
  startSec: number;
  endSec: number;
  title?: string;
};
