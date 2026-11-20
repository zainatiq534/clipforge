const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:4000";

export type ApiErrorBody = {
  error?: string;
  message?: string;
};

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init.headers ?? {}),
      },
    });
  } catch {
    throw new Error(
      `Cannot reach ClipForge API at ${API_BASE}. Start the backend (port 4000) and try again.`,
    );
  }

  const data = (await res.json().catch(() => ({}))) as T & ApiErrorBody;
  if (!res.ok) {
    throw new Error(
      humanizeApiError(data.error ?? data.message, res.status),
    );
  }
  return data;
}

/** Unwrap nested OpenRouter/API JSON blobs into a short user-facing message. */
function humanizeApiError(raw: string | undefined, status: number): string {
  if (!raw || !raw.trim()) return `Request failed (${status})`;
  let text = raw.trim();
  // Sometimes the backend/error body is stringified JSON
  for (let i = 0; i < 2; i++) {
    if (!text.startsWith("{")) break;
    try {
      const parsed = JSON.parse(text) as {
        error?: { message?: string; metadata?: { reason?: string } } | string;
        message?: string;
      };
      const nested =
        (typeof parsed.error === "object" && parsed.error?.message) ||
        (typeof parsed.error === "string" ? parsed.error : null) ||
        parsed.message;
      if (nested && nested.trim()) {
        text = nested.trim();
        continue;
      }
    } catch {
      break;
    }
  }
  if (
    status === 402 ||
    /credits|budget|payment|billing|weight_exceeds/i.test(text)
  ) {
    return "Caption credits ran out on OpenRouter. Add credits, or ClipForge will try Groq automatically if configured.";
  }
  return text.slice(0, 280);
}

export type RegisterPayload = {
  email: string;
  password: string;
  address: string;
  phone: string;
};

export type AspectPreference = "9:16" | "1:1" | "16:9" | "4:5";

export type UserPreferences = {
  defaultAspect: AspectPreference;
  defaultCaptionPackId: string;
  autoCaptionsOnClip: boolean;
  notifications: {
    clipReady: boolean;
    weeklyReport: boolean;
    marketingEmails: boolean;
  };
};

export type PlanId = "free" | "creator" | "studio";

export type UserProfile = {
  uid: string;
  email: string;
  address: string;
  phone: string;
  displayName?: string;
  photoURL?: string;
  provider?: string;
  workspaceName?: string;
  plan?: PlanId;
  preferences?: UserPreferences;
  createdAt: string;
  updatedAt: string;
};

export type StorageQuotaSnapshot = {
  planId: PlanId;
  planLabel: string;
  storageBytesUsed: number;
  storageBytesLimit: number;
  storagePercent: number;
  uploadsUsed: number;
  uploadsLimit: number;
  breakdown: {
    uploadsBytes: number;
    uploadCount: number;
    readyUploadCount: number;
    failedUploadCount: number;
    clipCount: number;
  };
  plans: Array<{
    id: PlanId;
    label: string;
    storageBytesLimit: number;
    maxUploads: number;
    priceLabel: string;
    blurb: string;
    current: boolean;
  }>;
};

export type UpdateSettingsPayload = {
  displayName?: string;
  address?: string;
  phone?: string;
  workspaceName?: string;
  preferences?: Partial<UserPreferences> & {
    notifications?: Partial<UserPreferences["notifications"]>;
  };
};

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  defaultAspect: "9:16",
  defaultCaptionPackId: "ali-abdaal",
  autoCaptionsOnClip: true,
  notifications: {
    clipReady: true,
    weeklyReport: true,
    marketingEmails: false,
  },
};

export function registerUser(payload: RegisterPayload) {
  return apiFetch<{ user: UserProfile; message: string }>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchMe(idToken: string) {
  return apiFetch<{ user: UserProfile }>("/auth/me", {
    headers: { Authorization: `Bearer ${idToken}` },
  });
}

export function updateSettings(idToken: string, payload: UpdateSettingsPayload) {
  return apiFetch<{ user: UserProfile }>("/auth/me", {
    method: "PATCH",
    headers: { Authorization: `Bearer ${idToken}` },
    body: JSON.stringify(payload),
  });
}

export function syncProfile(
  idToken: string,
  body: { displayName?: string; photoURL?: string; provider?: string } = {},
) {
  return apiFetch<{ user: UserProfile }>("/auth/sync", {
    method: "POST",
    headers: { Authorization: `Bearer ${idToken}` },
    body: JSON.stringify(body),
  });
}

export function fetchStorageQuota(idToken: string) {
  return apiFetch<{ storage: StorageQuotaSnapshot }>("/auth/storage", {
    headers: { Authorization: `Bearer ${idToken}` },
  });
}

export function upgradeStoragePlan(idToken: string, planId: PlanId) {
  return apiFetch<{ user: UserProfile; storage: StorageQuotaSnapshot }>(
    "/auth/storage/plan",
    {
      method: "POST",
      headers: { Authorization: `Bearer ${idToken}` },
      body: JSON.stringify({ planId }),
    },
  );
}
