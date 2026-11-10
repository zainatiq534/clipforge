import { FieldValue } from "firebase-admin/firestore";
import { auth, db, USERS_COLLECTION } from "../config/firebase.js";
import {
  DEFAULT_PLAN_ID,
  resolvePlan,
  type PlanId,
} from "../types/plan.js";
import {
  DEFAULT_USER_PREFERENCES,
  type UserPreferences,
  type UserProfile,
} from "../types/user.js";

type CreateUserInput = {
  email: string;
  password: string;
  address: string;
  phone: string;
};

export type UpdateUserSettingsInput = {
  displayName?: string;
  address?: string;
  phone?: string;
  workspaceName?: string;
  preferences?: {
    defaultAspect?: UserPreferences["defaultAspect"];
    defaultCaptionPackId?: string;
    autoCaptionsOnClip?: boolean;
    notifications?: {
      clipReady?: boolean;
      weeklyReport?: boolean;
      marketingEmails?: boolean;
    };
  };
};

export function normalizeUserProfile(
  raw: Partial<UserProfile> & { uid: string; email: string },
): UserProfile {
  const prefs = raw.preferences;
  return {
    uid: raw.uid,
    email: raw.email.toLowerCase(),
    address: raw.address ?? "",
    phone: raw.phone ?? "",
    displayName: raw.displayName,
    photoURL: raw.photoURL,
    provider: raw.provider,
    workspaceName: raw.workspaceName ?? "ClipForge Studio",
    plan: resolvePlan(raw.plan).id,
    preferences: {
      defaultAspect: prefs?.defaultAspect ?? DEFAULT_USER_PREFERENCES.defaultAspect,
      defaultCaptionPackId:
        prefs?.defaultCaptionPackId ??
        DEFAULT_USER_PREFERENCES.defaultCaptionPackId,
      autoCaptionsOnClip:
        prefs?.autoCaptionsOnClip ?? DEFAULT_USER_PREFERENCES.autoCaptionsOnClip,
      notifications: {
        clipReady:
          prefs?.notifications?.clipReady ??
          DEFAULT_USER_PREFERENCES.notifications.clipReady,
        weeklyReport:
          prefs?.notifications?.weeklyReport ??
          DEFAULT_USER_PREFERENCES.notifications.weeklyReport,
        marketingEmails:
          prefs?.notifications?.marketingEmails ??
          DEFAULT_USER_PREFERENCES.notifications.marketingEmails,
      },
    },
    createdAt: raw.createdAt ?? new Date().toISOString(),
    updatedAt: raw.updatedAt ?? new Date().toISOString(),
  };
}

export async function createUserWithProfile(
  input: CreateUserInput,
): Promise<UserProfile> {
  const user = await auth.createUser({
    email: input.email,
    password: input.password,
    emailVerified: false,
    disabled: false,
  });

  const now = new Date().toISOString();
  const profile = normalizeUserProfile({
    uid: user.uid,
    email: input.email.toLowerCase(),
    address: input.address,
    phone: input.phone,
    provider: "password",
    plan: DEFAULT_PLAN_ID,
    preferences: DEFAULT_USER_PREFERENCES,
    createdAt: now,
    updatedAt: now,
  });

  await db.collection(USERS_COLLECTION).doc(user.uid).set({
    ...profile,
    createdAtServer: FieldValue.serverTimestamp(),
    updatedAtServer: FieldValue.serverTimestamp(),
  });

  return profile;
}

export async function getUserProfile(
  uid: string,
): Promise<UserProfile | null> {
  const snap = await db.collection(USERS_COLLECTION).doc(uid).get();
  if (!snap.exists) return null;
  const data = snap.data() as Partial<UserProfile>;
  if (!data.email) return null;
  return normalizeUserProfile({ ...data, uid, email: data.email });
}

type EnsureProfileInput = {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  provider?: string;
};

/** Create or refresh a Firestore profile for Google / existing Auth users. */
export async function ensureUserProfile(
  input: EnsureProfileInput,
): Promise<UserProfile> {
  const ref = db.collection(USERS_COLLECTION).doc(input.uid);
  const existing = await ref.get();
  const now = new Date().toISOString();

  if (existing.exists) {
    const prev = normalizeUserProfile({
      ...(existing.data() as Partial<UserProfile>),
      uid: input.uid,
      email: input.email,
    });
    const next = normalizeUserProfile({
      ...prev,
      email: input.email.toLowerCase(),
      displayName: input.displayName ?? prev.displayName,
      photoURL: input.photoURL ?? prev.photoURL,
      provider: input.provider ?? prev.provider,
      updatedAt: now,
    });
    await ref.set(
      {
        ...next,
        updatedAtServer: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
    return next;
  }

  const profile = normalizeUserProfile({
    uid: input.uid,
    email: input.email.toLowerCase(),
    address: "",
    phone: "",
    displayName: input.displayName,
    photoURL: input.photoURL,
    provider: input.provider ?? "password",
    plan: DEFAULT_PLAN_ID,
    preferences: DEFAULT_USER_PREFERENCES,
    createdAt: now,
    updatedAt: now,
  });

  await ref.set({
    ...profile,
    createdAtServer: FieldValue.serverTimestamp(),
    updatedAtServer: FieldValue.serverTimestamp(),
  });

  return profile;
}

export async function updateUserSettings(
  uid: string,
  input: UpdateUserSettingsInput,
): Promise<UserProfile> {
  const ref = db.collection(USERS_COLLECTION).doc(uid);
  const existing = await ref.get();
  if (!existing.exists) {
    throw Object.assign(new Error("User profile not found."), { status: 404 });
  }

  const prev = normalizeUserProfile({
    ...(existing.data() as Partial<UserProfile>),
    uid,
    email: (existing.data() as { email?: string }).email ?? "",
  });

  if (!prev.email) {
    throw Object.assign(new Error("User profile not found."), { status: 404 });
  }

  const nextPrefs: UserPreferences = {
    defaultAspect:
      input.preferences?.defaultAspect ?? prev.preferences!.defaultAspect,
    defaultCaptionPackId:
      input.preferences?.defaultCaptionPackId ??
      prev.preferences!.defaultCaptionPackId,
    autoCaptionsOnClip:
      input.preferences?.autoCaptionsOnClip ??
      prev.preferences!.autoCaptionsOnClip,
    notifications: {
      clipReady:
        input.preferences?.notifications?.clipReady ??
        prev.preferences!.notifications.clipReady,
      weeklyReport:
        input.preferences?.notifications?.weeklyReport ??
        prev.preferences!.notifications.weeklyReport,
      marketingEmails:
        input.preferences?.notifications?.marketingEmails ??
        prev.preferences!.notifications.marketingEmails,
    },
  };

  const now = new Date().toISOString();
  const next = normalizeUserProfile({
    ...prev,
    displayName:
      input.displayName !== undefined
        ? input.displayName.trim() || undefined
        : prev.displayName,
    address: input.address !== undefined ? input.address.trim() : prev.address,
    phone: input.phone !== undefined ? input.phone.trim() : prev.phone,
    workspaceName:
      input.workspaceName !== undefined
        ? input.workspaceName.trim() || "ClipForge Studio"
        : prev.workspaceName,
    preferences: nextPrefs,
    updatedAt: now,
  });

  await ref.set(
    {
      ...next,
      updatedAtServer: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  if (input.displayName !== undefined) {
    try {
      await auth.updateUser(uid, {
        displayName: next.displayName ?? null,
      });
    } catch (error) {
      console.warn("[users/updateUserSettings] auth displayName sync skipped", error);
    }
  }

  return next;
}

export async function updateUserPlan(
  uid: string,
  planId: PlanId,
): Promise<UserProfile> {
  const ref = db.collection(USERS_COLLECTION).doc(uid);
  const existing = await ref.get();
  if (!existing.exists) {
    throw Object.assign(new Error("User profile not found."), { status: 404 });
  }

  const prev = normalizeUserProfile({
    ...(existing.data() as Partial<UserProfile>),
    uid,
    email: (existing.data() as { email?: string }).email ?? "",
  });
  if (!prev.email) {
    throw Object.assign(new Error("User profile not found."), { status: 404 });
  }

  const now = new Date().toISOString();
  const next = normalizeUserProfile({
    ...prev,
    plan: planId,
    updatedAt: now,
  });

  await ref.set(
    {
      ...next,
      updatedAtServer: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
  return next;
}

