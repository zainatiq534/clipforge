import { FieldValue } from "firebase-admin/firestore";
import { randomUUID } from "node:crypto";
import { db } from "../config/firebase.js";
import type { UploadStatus, VideoUpload } from "../types/upload.js";

export const UPLOADS_COLLECTION = "uploads";

type CreateUploadInput = {
  uid: string;
  name: string;
  sizeBytes: number;
  contentType: string;
};

export async function createUploadRecord(
  input: CreateUploadInput,
): Promise<VideoUpload> {
  const id = randomUUID();
  const now = new Date().toISOString();
  const folder = `clipforge/${input.uid}`;
  const publicId = `${id}`;

  const record: VideoUpload = {
    id,
    uid: input.uid,
    name: input.name,
    sizeBytes: input.sizeBytes,
    contentType: input.contentType,
    status: "uploading",
    folder,
    publicId,
    createdAt: now,
    updatedAt: now,
  };

  await db.collection(UPLOADS_COLLECTION).doc(id).set({
    ...record,
    createdAtServer: FieldValue.serverTimestamp(),
    updatedAtServer: FieldValue.serverTimestamp(),
  });

  return record;
}

export async function getUploadForUser(
  id: string,
  uid: string,
): Promise<VideoUpload | null> {
  const snap = await db.collection(UPLOADS_COLLECTION).doc(id).get();
  if (!snap.exists) return null;
  const data = snap.data() as VideoUpload;
  if (data.uid !== uid) return null;
  return data;
}

export async function listUploadsForUser(uid: string, limit = 20) {
  // Filter only (no orderBy) so we don't require a composite index to start.
  const snap = await db
    .collection(UPLOADS_COLLECTION)
    .where("uid", "==", uid)
    .get();

  return snap.docs
    .map((doc) => doc.data() as VideoUpload)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit);
}

export async function completeUpload(input: {
  id: string;
  uid: string;
  secureUrl: string;
  cloudinaryPublicId: string;
  bytes?: number;
  durationSec?: number;
}): Promise<VideoUpload> {
  const existing = await getUploadForUser(input.id, input.uid);
  if (!existing) {
    throw Object.assign(new Error("Upload not found"), { status: 404 });
  }

  const now = new Date().toISOString();
  const next: VideoUpload = {
    ...existing,
    status: "ready",
    secureUrl: input.secureUrl,
    cloudinaryPublicId: input.cloudinaryPublicId,
    bytes: input.bytes ?? existing.sizeBytes,
    updatedAt: now,
  };

  await db.collection(UPLOADS_COLLECTION).doc(input.id).set(
    {
      ...next,
      ...(typeof input.durationSec === "number"
        ? { durationSec: input.durationSec }
        : {}),
      updatedAtServer: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  return next;
}

export async function markUploadFailed(id: string, uid: string) {
  const existing = await getUploadForUser(id, uid);
  if (!existing) return null;
  const now = new Date().toISOString();
  const next: VideoUpload = {
    ...existing,
    status: "failed" as UploadStatus,
    updatedAt: now,
  };
  await db.collection(UPLOADS_COLLECTION).doc(id).set(
    {
      status: "failed",
      updatedAt: now,
      updatedAtServer: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
  return next;
}

export async function deleteUploadRecord(id: string, uid: string) {
  const existing = await getUploadForUser(id, uid);
  if (!existing) {
    throw Object.assign(new Error("Upload not found"), { status: 404 });
  }
  await db.collection(UPLOADS_COLLECTION).doc(id).delete();
  return existing;
}
