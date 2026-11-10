export type UploadStatus =
  | "uploading"
  | "ready"
  | "failed"
  | "queued"
  | "processing";

export type VideoUpload = {
  id: string;
  uid: string;
  name: string;
  sizeBytes: number;
  contentType: string;
  status: UploadStatus;
  folder: string;
  publicId: string;
  secureUrl?: string;
  cloudinaryPublicId?: string;
  bytes?: number;
  durationSec?: number;
  latestClipId?: string;
  latestClipUrl?: string;
  latestClipTitle?: string;
  latestClipIds?: string[];
  latestViralScore?: number;
  createdAt: string;
  updatedAt: string;
};
