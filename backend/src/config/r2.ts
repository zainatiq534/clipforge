import {
  DeleteObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { requireR2 } from "./env.js";

let client: S3Client | null = null;

export function getR2Client(): S3Client {
  if (client) return client;
  const cfg = requireR2();
  client = new S3Client({
    region: "auto",
    endpoint: cfg.endpoint,
    credentials: {
      accessKeyId: cfg.accessKeyId,
      secretAccessKey: cfg.secretAccessKey,
    },
  });
  return client;
}

export function objectKeyFromParts(folder: string, publicId: string, ext = "mp4") {
  const cleanFolder = folder.replace(/^\/+|\/+$/g, "");
  const cleanId = publicId.replace(/^\/+|\/+$/g, "").replace(/\.[^.]+$/, "");
  const base = cleanFolder ? `${cleanFolder}/${cleanId}` : cleanId;
  return `${base}.${ext.replace(/^\./, "")}`;
}

/** Storage id stored in Firestore (no extension), same shape as Cloudinary public_id. */
export function storageIdFromParts(folder: string, publicId: string) {
  const cleanFolder = folder.replace(/^\/+|\/+$/g, "");
  const cleanId = publicId.replace(/^\/+|\/+$/g, "").replace(/\.[^.]+$/, "");
  return cleanFolder ? `${cleanFolder}/${cleanId}` : cleanId;
}

export function publicUrlForKey(key: string) {
  const base = requireR2().publicUrl.replace(/\/+$/, "");
  const cleanKey = key.replace(/^\/+/, "");
  return `${base}/${cleanKey}`;
}

export function keyFromStorageId(storageId: string, ext = "mp4") {
  const id = storageId.replace(/^\/+/, "").replace(/\.(mp4|mov|webm|mkv)$/i, "");
  return `${id}.${ext}`;
}

export async function createPresignedUpload(input: {
  key: string;
  contentType: string;
  expiresInSec?: number;
}) {
  const cfg = requireR2();
  const command = new PutObjectCommand({
    Bucket: cfg.bucket,
    Key: input.key,
    ContentType: input.contentType || "video/mp4",
  });
  const uploadUrl = await getSignedUrl(getR2Client(), command, {
    expiresIn: input.expiresInSec ?? 60 * 60,
  });
  return {
    uploadUrl,
    publicUrl: publicUrlForKey(input.key),
    key: input.key,
    bucket: cfg.bucket,
    contentType: input.contentType || "video/mp4",
  };
}

export async function uploadFileToR2(input: {
  filePath: string;
  key: string;
  contentType?: string;
}) {
  const cfg = requireR2();
  const st = await stat(input.filePath);
  const body = createReadStream(input.filePath);
  const contentType = input.contentType || "video/mp4";

  // Multipart for anything non-trivial — single PutObject stalls on ~100MB+
  if (st.size >= 8 * 1024 * 1024) {
    const upload = new Upload({
      client: getR2Client(),
      params: {
        Bucket: cfg.bucket,
        Key: input.key,
        Body: body,
        ContentType: contentType,
      },
      queueSize: 4,
      partSize: 16 * 1024 * 1024,
      leavePartsOnError: false,
    });
    upload.on("httpUploadProgress", (p) => {
      if (!p.total || !p.loaded) return;
      const pct = Math.round((p.loaded / p.total) * 100);
      if (pct % 20 === 0) {
        console.info(`[r2] upload ${input.key} ${pct}%`);
      }
    });
    await upload.done();
  } else {
    await getR2Client().send(
      new PutObjectCommand({
        Bucket: cfg.bucket,
        Key: input.key,
        Body: body,
        ContentType: contentType,
        ContentLength: st.size,
      }),
    );
  }

  return {
    key: input.key,
    publicUrl: publicUrlForKey(input.key),
    bytes: st.size,
  };
}

export async function headR2Object(key: string) {
  const cfg = requireR2();
  try {
    const res = await getR2Client().send(
      new HeadObjectCommand({ Bucket: cfg.bucket, Key: key }),
    );
    return {
      exists: true as const,
      contentLength: res.ContentLength,
      contentType: res.ContentType,
    };
  } catch {
    return { exists: false as const };
  }
}

export async function deleteR2Object(key: string) {
  const cfg = requireR2();
  await getR2Client().send(
    new DeleteObjectCommand({ Bucket: cfg.bucket, Key: key }),
  );
}
