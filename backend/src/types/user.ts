import type { PlanId } from "./plan.js";

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
