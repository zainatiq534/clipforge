import { v2 as cloudinary } from "cloudinary";
import { requireCloudinary } from "./env.js";

let configured = false;

export function getCloudinary() {
  if (!configured) {
    const cfg = requireCloudinary();
    cloudinary.config({
      cloud_name: cfg.cloudName,
      api_key: cfg.apiKey,
      api_secret: cfg.apiSecret,
      secure: true,
    });
    configured = true;
  }
  return cloudinary;
}

export function requireCloudName() {
  return requireCloudinary().cloudName;
}

export function createVideoUploadSignature(input: {
  folder: string;
  publicId: string;
  timestamp: number;
}) {
  const cloudinary = getCloudinary();
  const cfg = requireCloudinary();

  const paramsToSign = {
    folder: input.folder,
    public_id: input.publicId,
    timestamp: input.timestamp,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    cfg.apiSecret,
  );

  return {
    cloudName: cfg.cloudName,
    apiKey: cfg.apiKey,
    timestamp: input.timestamp,
    folder: input.folder,
    publicId: input.publicId,
    signature,
    uploadUrl: `https://api.cloudinary.com/v1_1/${cfg.cloudName}/video/upload`,
  };
}
