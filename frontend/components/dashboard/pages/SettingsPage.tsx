"use client";

import {
  Bell,
  Building2,
  Check,
  HardDrive,
  Info,
  KeyRound,
  Loader2,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Save,
  Settings2,
  Shield,
  Sparkles,
  User,
  type LucideIcon,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  DEFAULT_USER_PREFERENCES,
  fetchMe,
  fetchStorageQuota,
  updateSettings,
  upgradeStoragePlan,
  type PlanId,
  type StorageQuotaSnapshot,
  type UserPreferences,
  type UserProfile,
} from "@/lib/api";
import {
  changeAccountPassword,
  firebaseAuthErrorMessage,
  logout,
  sendResetPasswordEmail,
} from "@/lib/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { cn } from "@/lib/cn";

type FormState = {
  displayName: string;
  email: string;
  address: string;
  phone: string;
  workspaceName: string;
  provider: string;
  preferences: UserPreferences;
};

type SettingsTab = "profile" | "storage" | "alerts" | "account";

const TABS: { id: SettingsTab; label: string; icon: LucideIcon }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "storage", label: "Storage", icon: HardDrive },
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "account", label: "Account", icon: Shield },
];

const spring = { type: "spring" as const, stiffness: 420, damping: 34 };

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
}

function profileToForm(user: UserProfile): FormState {
  const prefs = user.preferences ?? DEFAULT_USER_PREFERENCES;
  return {
    displayName: user.displayName ?? "",
    email: user.email,
    address: user.address ?? "",
    phone: user.phone ?? "",
    workspaceName: user.workspaceName ?? "ClipForge Studio",
    provider: user.provider ?? "password",
    preferences: {
      defaultAspect: prefs.defaultAspect ?? DEFAULT_USER_PREFERENCES.defaultAspect,
      defaultCaptionPackId:
        prefs.defaultCaptionPackId ??
        DEFAULT_USER_PREFERENCES.defaultCaptionPackId,
      autoCaptionsOnClip:
        prefs.autoCaptionsOnClip ?? DEFAULT_USER_PREFERENCES.autoCaptionsOnClip,
      notifications: {
        clipReady:
          prefs.notifications?.clipReady ??
          DEFAULT_USER_PREFERENCES.notifications.clipReady,
        weeklyReport:
          prefs.notifications?.weeklyReport ??
          DEFAULT_USER_PREFERENCES.notifications.weeklyReport,
        marketingEmails:
          prefs.notifications?.marketingEmails ??
          DEFAULT_USER_PREFERENCES.notifications.marketingEmails,
      },
    },
  };
}

/** Soft filled field matching the reference mock. */
function SoftField({
  label,
  icon,
  children,
  className,
}: {
  label: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label
      className={cn(
        "relative block rounded-[18px] bg-[#f3eefc]/90 px-3.5 pb-2.5 pt-[1.35rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] ring-1 ring-white/50 transition focus-within:bg-white focus-within:ring-[#c4b5fd]",
        className,
      )}
    >
      <span className="pointer-events-none absolute left-3.5 top-2 inline-flex items-center gap-1.5 font-[family-name:var(--font-outfit)] text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9b8bb8]">
        <span className="text-[#a78bfa]">{icon}</span>
        {label}
      </span>
      {children}
    </label>
  );
}

const softInputClass =
  "w-full border-0 bg-transparent font-sans text-[14px] font-medium text-[#2a2140] outline-none placeholder:text-[#b7a9cf]";

function ModernToggle({
  on,
  onChange,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={cn(
        "relative h-7 w-12 shrink-0 rounded-full p-0.5 transition-colors duration-300",
        on
          ? "bg-gradient-to-r from-[#c084fc] via-[#a855f7] to-[#7c3aed] shadow-[0_8px_20px_rgba(168,85,247,0.4)]"
          : "bg-[#e4dcf5]",
      )}
    >
      <motion.span
        className="block h-6 w-6 rounded-full bg-white shadow"
        animate={{ x: on ? 20 : 0 }}
        transition={spring}
      />
    </button>
  );
}

function ActionBar({
  icon: Icon,
  title,
  description,
  on,
  onChange,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3.5 rounded-[20px] bg-white/55 px-4 py-3.5 ring-1 ring-white/60 backdrop-blur-md">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[14px] bg-[#f3e8ff] text-[#9333ea]">
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-[family-name:var(--font-outfit)] text-[15px] font-semibold text-[#2a2140]">
          {title}
        </p>
        <p className="mt-0.5 font-sans text-[12px] text-[#8b7aa8]">{description}</p>
      </div>
      <ModernToggle on={on} onChange={onChange} />
    </div>
  );
}

function GlassPanel({
  eyebrow,
  title,
  subtitle,
  icon: Icon,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="relative overflow-hidden rounded-[28px] border border-white/50 bg-white/55 p-5 shadow-[0_24px_60px_rgba(88,28,135,0.12)] backdrop-blur-2xl sm:p-7"
    >
      <div className="mb-6 flex items-start gap-3.5">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[16px] bg-gradient-to-br from-[#f3e8ff] to-[#ede9fe] text-[#9333ea] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
          <Icon className="h-5 w-5" strokeWidth={1.8} />
        </span>
        <div className="min-w-0">
          <p className="font-[family-name:var(--font-outfit)] text-[11px] font-bold uppercase tracking-[0.16em] text-[#a78bfa]">
            {eyebrow}
          </p>
          <h2 className="mt-0.5 font-[family-name:var(--font-outfit)] text-[1.7rem] font-extrabold leading-none tracking-[-0.04em] text-[#2a2140]">
            {title}
          </h2>
          <p className="mt-2 font-sans text-[13px] leading-relaxed text-[#8b7aa8]">
            {subtitle}
          </p>
        </div>
      </div>
      {children}
    </motion.section>
  );
}

function SaveBtn({
  saving,
  onClick,
  className,
}: {
  saving: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      disabled={saving}
      onClick={onClick}
      className={cn(
        "inline-flex h-10 items-center gap-2 rounded-full bg-gradient-to-r from-[#c084fc] via-[#a855f7] to-[#7c3aed] px-5 font-[family-name:var(--font-outfit)] text-[13px] font-bold text-white shadow-[0_12px_28px_rgba(168,85,247,0.45)] transition hover:brightness-110 disabled:opacity-60",
        className,
      )}
    >
      <Save className="h-3.5 w-3.5" strokeWidth={2.2} />
      {saving ? "Saving…" : "Save changes"}
    </button>
  );
}

export function SettingsPage() {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [tab, setTab] = useState<SettingsTab>("profile");
  const [form, setForm] = useState<FormState | null>(null);
  const [storage, setStorage] = useState<StorageQuotaSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [upgrading, setUpgrading] = useState<PlanId | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [resetBusy, setResetBusy] = useState(false);

  const isPasswordAccount = form?.provider !== "google";

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const user = getFirebaseAuth().currentUser;
      if (!user) {
        router.replace("/login");
        return;
      }
      const idToken = await user.getIdToken();
      const [{ user: profile }, { storage: quota }] = await Promise.all([
        fetchMe(idToken),
        fetchStorageQuota(idToken),
      ]);
      setForm(profileToForm(profile));
      setStorage(quota);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load settings.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  const save = async () => {
    if (!form) return;
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const user = getFirebaseAuth().currentUser;
      if (!user) {
        router.replace("/login");
        return;
      }
      const idToken = await user.getIdToken();
      const { user: profile } = await updateSettings(idToken, {
        displayName: form.displayName,
        address: form.address,
        phone: form.phone,
        workspaceName: form.workspaceName,
        preferences: form.preferences,
      });
      setForm(profileToForm(profile));
      setMessage("Settings saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save settings.");
    } finally {
      setSaving(false);
    }
  };

  const upgradePlan = async (planId: PlanId) => {
    setUpgrading(planId);
    setMessage(null);
    setError(null);
    try {
      const user = getFirebaseAuth().currentUser;
      if (!user) {
        router.replace("/login");
        return;
      }
      const idToken = await user.getIdToken();
      const res = await upgradeStoragePlan(idToken, planId);
      setStorage(res.storage);
      setMessage(`Plan updated to ${res.storage.planLabel}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not upgrade plan.");
    } finally {
      setUpgrading(null);
    }
  };

  const handleChangePassword = async () => {
    setPasswordBusy(true);
    setMessage(null);
    setError(null);
    try {
      if (newPassword.length < 8) {
        throw new Error("New password must be at least 8 characters.");
      }
      if (newPassword !== confirmPassword) {
        throw new Error("New password and confirmation do not match.");
      }
      await changeAccountPassword({ currentPassword, newPassword });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage("Password updated.");
    } catch (err) {
      setError(firebaseAuthErrorMessage(err));
    } finally {
      setPasswordBusy(false);
    }
  };

  const handleResetPassword = async () => {
    if (!form?.email) return;
    setResetBusy(true);
    setMessage(null);
    setError(null);
    try {
      await sendResetPasswordEmail(form.email);
      setMessage(`Password reset email sent to ${form.email}.`);
    } catch (err) {
      setError(firebaseAuthErrorMessage(err));
    } finally {
      setResetBusy(false);
    }
  };

  const signOut = async () => {
    await logout();
    router.replace("/login");
  };

  const initials = useMemo(() => {
    const name = form?.displayName?.trim() || form?.email || "CF";
    return name
      .split(/\s+/)
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [form?.displayName, form?.email]);

  if (loading) {
    return (
      <div className="relative flex min-h-[60vh] items-center justify-center overflow-hidden rounded-[28px]">
        <SettingsAtmosphere />
        <div className="relative z-10 flex items-center gap-2 font-sans text-[13px] text-[#6b21a8]">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading settings…
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="relative overflow-hidden rounded-[28px] p-8 text-center">
        <SettingsAtmosphere />
        <div className="relative z-10">
          <p className="font-sans text-[13px] text-[#6b21a8]">
            {error ?? "Could not load your profile."}
          </p>
          <button
            type="button"
            onClick={() => void load()}
            className="mt-4 inline-flex h-10 items-center rounded-full bg-gradient-to-r from-[#c084fc] to-[#7c3aed] px-5 text-[13px] font-bold text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const usedPct = storage?.storagePercent ?? 0;

  return (
    <div className="relative min-h-[calc(100dvh-2rem)] min-w-0 overflow-hidden rounded-[28px] pb-28">
      <SettingsAtmosphere />

      <div className="relative z-10 mx-auto max-w-5xl px-3 pt-3 sm:px-5 sm:pt-5">
        <motion.header
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex flex-wrap items-center gap-4 sm:gap-5">
            <div className="relative shrink-0">
              <div className="grid h-[4.5rem] w-[4.5rem] place-items-center rounded-[22px] bg-gradient-to-br from-[#e879f9] via-[#a855f7] to-[#7c3aed] font-[family-name:var(--font-outfit)] text-2xl font-extrabold text-white shadow-[0_16px_36px_rgba(168,85,247,0.45)]">
                {initials}
              </div>
              <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-white text-[#9333ea] shadow-[0_6px_16px_rgba(88,28,135,0.2)] ring-2 ring-[#f5d0fe]">
                <Pencil className="h-3 w-3" strokeWidth={2.2} />
              </span>
            </div>

            <div className="min-w-0 flex-1">
              <p className="inline-flex items-center gap-1.5 font-[family-name:var(--font-outfit)] text-[11px] font-bold uppercase tracking-[0.18em] text-[#9333ea]">
                <Settings2 className="h-3.5 w-3.5" />
                Workspace settings
              </p>
              <h1 className="mt-1 truncate font-[family-name:var(--font-outfit)] text-[2rem] font-extrabold leading-none tracking-[-0.045em] text-[#2a2140] sm:text-[2.35rem]">
                {form.displayName || "Your studio"}
              </h1>
              <p className="mt-2 truncate font-sans text-[13px] text-[#7c6b99]">
                {form.workspaceName} · {storage?.planLabel ?? "Free"} plan ·{" "}
                {form.email}
              </p>
            </div>

            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
              <button
                type="button"
                className="relative grid h-10 w-10 place-items-center rounded-full bg-white/55 text-[#7c3aed] shadow-[0_8px_20px_rgba(88,28,135,0.1)] ring-1 ring-white/70 backdrop-blur-md"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#ef4444] ring-2 ring-white" />
              </button>
              <button
                type="button"
                onClick={() => void signOut()}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-white/55 px-4 font-[family-name:var(--font-outfit)] text-[13px] font-semibold text-[#6b21a8] shadow-[0_8px_20px_rgba(88,28,135,0.1)] ring-1 ring-white/70 backdrop-blur-md"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
              <SaveBtn saving={saving} onClick={() => void save()} />
            </div>
          </div>

          {/* Tabs — active = solid purple pill */}
          <div className="mt-6 overflow-x-auto">
            <div className="inline-flex min-w-full gap-1.5 rounded-[22px] bg-white/40 p-1.5 shadow-[0_10px_30px_rgba(88,28,135,0.08)] ring-1 ring-white/60 backdrop-blur-xl sm:min-w-0">
              {TABS.map((item) => {
                const Icon = item.icon;
                const active = tab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTab(item.id)}
                    className={cn(
                      "relative flex flex-1 items-center justify-center gap-2 rounded-[16px] px-3 py-2.5 font-[family-name:var(--font-outfit)] text-[13px] font-semibold transition-colors",
                      active
                        ? "text-white"
                        : "text-[#7c6b99] hover:text-[#2a2140]",
                    )}
                  >
                    {active ? (
                      <motion.span
                        layoutId="settings-tab-pill"
                        className="absolute inset-0 rounded-[16px] bg-gradient-to-r from-[#c084fc] via-[#a855f7] to-[#7c3aed] shadow-[0_10px_24px_rgba(168,85,247,0.4)]"
                        transition={spring}
                      />
                    ) : null}
                    <Icon className="relative z-10 h-4 w-4" strokeWidth={1.9} />
                    <span className="relative z-10">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.header>

        {(message || error) && (
          <p
            className={cn(
              "mt-4 rounded-[16px] px-4 py-3 font-sans text-sm font-medium backdrop-blur-md",
              message
                ? "bg-emerald-50/80 text-emerald-700 ring-1 ring-emerald-200/80"
                : "bg-rose-50/80 text-rose-700 ring-1 ring-rose-200/80",
            )}
            role={error ? "alert" : undefined}
          >
            {message ?? error}
          </p>
        )}

        <div className="mt-5">
          <AnimatePresence mode="wait">
            {tab === "profile" ? (
              <GlassPanel
                key="profile"
                eyebrow="Identity"
                title="Profile"
                subtitle="How you appear across ClipForge — name, workspace, and contact."
                icon={User}
              >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <SoftField
                    label="Display name"
                    icon={<User className="h-3 w-3" />}
                  >
                    <input
                      className={softInputClass}
                      value={form.displayName}
                      placeholder="Your name"
                      onChange={(e) =>
                        setForm((prev) =>
                          prev
                            ? { ...prev, displayName: e.target.value }
                            : prev,
                        )
                      }
                    />
                  </SoftField>
                  <SoftField
                    label="Email"
                    icon={<Mail className="h-3 w-3" />}
                  >
                    <input
                      className={softInputClass}
                      value={form.email}
                      disabled
                    />
                  </SoftField>
                  <SoftField
                    label="Workspace"
                    icon={<Building2 className="h-3 w-3" />}
                  >
                    <input
                      className={softInputClass}
                      value={form.workspaceName}
                      onChange={(e) =>
                        setForm((prev) =>
                          prev
                            ? { ...prev, workspaceName: e.target.value }
                            : prev,
                        )
                      }
                    />
                  </SoftField>
                  <SoftField
                    label="Phone"
                    icon={<Phone className="h-3 w-3" />}
                  >
                    <input
                      className={softInputClass}
                      value={form.phone}
                      onChange={(e) =>
                        setForm((prev) =>
                          prev ? { ...prev, phone: e.target.value } : prev,
                        )
                      }
                    />
                  </SoftField>
                  <SoftField
                    label="Address"
                    icon={<MapPin className="h-3 w-3" />}
                    className="sm:col-span-2"
                  >
                    <input
                      className={softInputClass}
                      value={form.address}
                      onChange={(e) =>
                        setForm((prev) =>
                          prev ? { ...prev, address: e.target.value } : prev,
                        )
                      }
                    />
                  </SoftField>
                </div>
              </GlassPanel>
            ) : null}

            {tab === "storage" && storage ? (
              <GlassPanel
                key="storage"
                eyebrow="Quota"
                title="Storage"
                subtitle="See how much of your plan quota is used by uploads, and upgrade when you need more room."
                icon={HardDrive}
              >
                <div className="rounded-[22px] bg-[#f3eefc]/80 p-5 ring-1 ring-white/60">
                  <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <p className="font-[family-name:var(--font-outfit)] text-[12px] font-bold uppercase tracking-[0.12em] text-[#9b8bb8]">
                        Used of quota
                      </p>
                      <p className="mt-1 font-[family-name:var(--font-outfit)] text-[1.75rem] font-extrabold text-[#2a2140]">
                        {formatBytes(storage.storageBytesUsed)}
                        <span className="text-[15px] font-semibold text-[#8b7aa8]">
                          {" "}
                          / {formatBytes(storage.storageBytesLimit)}
                        </span>
                      </p>
                    </div>
                    <span className="rounded-full bg-white/80 px-3 py-1 font-[family-name:var(--font-outfit)] text-[11px] font-bold uppercase tracking-wider text-[#9333ea] ring-1 ring-[#e9d5ff]">
                      {storage.planLabel} plan
                    </span>
                  </div>
                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/70">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-[#e879f9] via-[#a855f7] to-[#7c3aed]"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, usedPct)}%` }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                  <p className="mt-2 font-sans text-[12px] text-[#8b7aa8]">
                    {usedPct}% used · {storage.uploadsUsed}/{storage.uploadsLimit}{" "}
                    uploads
                  </p>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {[
                    { label: "Uploads", value: storage.breakdown.uploadCount },
                    { label: "Ready", value: storage.breakdown.readyUploadCount },
                    { label: "Failed", value: storage.breakdown.failedUploadCount },
                    { label: "Clips", value: storage.breakdown.clipCount },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[18px] bg-white/60 px-3 py-3 ring-1 ring-white/70"
                    >
                      <p className="font-[family-name:var(--font-outfit)] text-[10px] font-bold uppercase tracking-[0.1em] text-[#9b8bb8]">
                        {item.label}
                      </p>
                      <p className="mt-1 font-[family-name:var(--font-outfit)] text-xl font-extrabold text-[#2a2140]">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-7">
                  <p className="mb-3 font-[family-name:var(--font-outfit)] text-[12px] font-bold uppercase tracking-[0.12em] text-[#9b8bb8]">
                    Upgrade storage
                  </p>
                  <div className="grid gap-3 md:grid-cols-3">
                    {storage.plans.map((plan) => (
                      <div
                        key={plan.id}
                        className={cn(
                          "rounded-[22px] p-4 ring-1",
                          plan.current
                            ? "bg-gradient-to-br from-[#f5d0fe]/70 to-[#ede9fe]/80 ring-[#c084fc]"
                            : "bg-white/55 ring-white/70",
                        )}
                      >
                        <p className="font-[family-name:var(--font-outfit)] text-sm font-bold text-[#8b7aa8]">
                          {plan.label}
                          {plan.current ? " · Current" : ""}
                        </p>
                        <p className="mt-1 font-[family-name:var(--font-outfit)] text-2xl font-extrabold text-[#2a2140]">
                          {plan.priceLabel}
                        </p>
                        <p className="mt-2 font-sans text-[12px] text-[#8b7aa8]">
                          {formatBytes(plan.storageBytesLimit)} · {plan.maxUploads}{" "}
                          uploads
                        </p>
                        <p className="mt-1 font-sans text-[11px] text-[#8b7aa8]">
                          {plan.blurb}
                        </p>
                        {!plan.current ? (
                          <button
                            type="button"
                            disabled={upgrading !== null}
                            onClick={() => void upgradePlan(plan.id)}
                            className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-full bg-gradient-to-r from-[#c084fc] to-[#7c3aed] font-[family-name:var(--font-outfit)] text-[12px] font-bold text-white disabled:opacity-60"
                          >
                            {upgrading === plan.id
                              ? "Updating…"
                              : plan.id === "free"
                                ? "Switch to Free"
                                : "Upgrade"}
                          </button>
                        ) : (
                          <p className="mt-4 flex items-center justify-center gap-1 font-[family-name:var(--font-outfit)] text-[12px] font-semibold text-[#9333ea]">
                            <Check className="h-3.5 w-3.5" strokeWidth={2.4} />
                            Active plan
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </GlassPanel>
            ) : null}

            {tab === "alerts" ? (
              <GlassPanel
                key="alerts"
                eyebrow="Signals"
                title="Alerts"
                subtitle="Control which moments ClipForge should ping you about."
                icon={Bell}
              >
                <div className="space-y-3">
                  <ActionBar
                    icon={Sparkles}
                    title="Auto captions on new clips"
                    description="Generate English captions when a clip is created."
                    on={form.preferences.autoCaptionsOnClip}
                    onChange={(next) =>
                      setForm((prev) =>
                        prev
                          ? {
                              ...prev,
                              preferences: {
                                ...prev.preferences,
                                autoCaptionsOnClip: next,
                              },
                            }
                          : prev,
                      )
                    }
                  />
                  <ActionBar
                    icon={Bell}
                    title="Clip ready alerts"
                    description="Get notified when AI or manual clips finish."
                    on={form.preferences.notifications.clipReady}
                    onChange={(next) =>
                      setForm((prev) =>
                        prev
                          ? {
                              ...prev,
                              preferences: {
                                ...prev.preferences,
                                notifications: {
                                  ...prev.preferences.notifications,
                                  clipReady: next,
                                },
                              },
                            }
                          : prev,
                      )
                    }
                  />
                  <ActionBar
                    icon={Mail}
                    title="Weekly report"
                    description="A short digest of uploads and top viral scores."
                    on={form.preferences.notifications.weeklyReport}
                    onChange={(next) =>
                      setForm((prev) =>
                        prev
                          ? {
                              ...prev,
                              preferences: {
                                ...prev.preferences,
                                notifications: {
                                  ...prev.preferences.notifications,
                                  weeklyReport: next,
                                },
                              },
                            }
                          : prev,
                      )
                    }
                  />
                  <ActionBar
                    icon={Sparkles}
                    title="Marketing emails"
                    description="Feature drops and tips — easy to turn off."
                    on={form.preferences.notifications.marketingEmails}
                    onChange={(next) =>
                      setForm((prev) =>
                        prev
                          ? {
                              ...prev,
                              preferences: {
                                ...prev.preferences,
                                notifications: {
                                  ...prev.preferences.notifications,
                                  marketingEmails: next,
                                },
                              },
                            }
                          : prev,
                      )
                    }
                  />
                </div>
              </GlassPanel>
            ) : null}

            {tab === "account" ? (
              <GlassPanel
                key="account"
                eyebrow="Security"
                title="Account"
                subtitle="Sign-in method, password controls, and session for this workspace."
                icon={Shield}
              >
                <div className="rounded-[22px] bg-white/55 p-5 ring-1 ring-white/70">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="grid h-14 w-14 place-items-center rounded-[18px] bg-[#f3e8ff] text-[#9333ea]">
                      <Shield className="h-6 w-6" strokeWidth={1.7} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-[family-name:var(--font-outfit)] text-[15px] font-semibold text-[#2a2140]">
                        Sign-in method
                      </p>
                      <p className="mt-0.5 font-sans text-[13px] capitalize text-[#8b7aa8]">
                        {form.provider === "google"
                          ? "Google account"
                          : "Email / password"}
                      </p>
                    </div>
                    <span className="rounded-full bg-white px-3 py-1 font-[family-name:var(--font-outfit)] text-[11px] font-bold uppercase tracking-wider text-[#9333ea] ring-1 ring-[#e9d5ff]">
                      Active
                    </span>
                  </div>
                </div>

                {isPasswordAccount ? (
                  <div className="mt-5 space-y-4">
                    <div className="rounded-[22px] bg-white/55 p-5 ring-1 ring-white/70">
                      <div className="mb-4 flex items-center gap-2">
                        <Lock className="h-4 w-4 text-[#9333ea]" />
                        <p className="font-[family-name:var(--font-outfit)] text-[15px] font-semibold text-[#2a2140]">
                          Change password
                        </p>
                      </div>
                      <div className="grid gap-3">
                        <SoftField
                          label="Current password"
                          icon={<KeyRound className="h-3 w-3" />}
                        >
                          <input
                            type="password"
                            className={softInputClass}
                            value={currentPassword}
                            autoComplete="current-password"
                            onChange={(e) => setCurrentPassword(e.target.value)}
                          />
                        </SoftField>
                        <SoftField
                          label="New password"
                          icon={<Lock className="h-3 w-3" />}
                        >
                          <input
                            type="password"
                            className={softInputClass}
                            value={newPassword}
                            autoComplete="new-password"
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </SoftField>
                        <SoftField
                          label="Confirm new password"
                          icon={<Lock className="h-3 w-3" />}
                        >
                          <input
                            type="password"
                            className={softInputClass}
                            value={confirmPassword}
                            autoComplete="new-password"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </SoftField>
                      </div>
                      <button
                        type="button"
                        disabled={
                          passwordBusy ||
                          !currentPassword ||
                          !newPassword ||
                          !confirmPassword
                        }
                        onClick={() => void handleChangePassword()}
                        className="mt-4 inline-flex h-10 items-center rounded-full bg-gradient-to-r from-[#c084fc] to-[#7c3aed] px-5 font-[family-name:var(--font-outfit)] text-[13px] font-bold text-white disabled:opacity-60"
                      >
                        {passwordBusy ? "Updating…" : "Update password"}
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] bg-white/55 px-5 py-4 ring-1 ring-white/70">
                      <div>
                        <p className="font-[family-name:var(--font-outfit)] text-[14px] font-semibold text-[#2a2140]">
                          Reset password by email
                        </p>
                        <p className="mt-0.5 font-sans text-[12px] text-[#8b7aa8]">
                          Send a reset link to {form.email}
                        </p>
                      </div>
                      <button
                        type="button"
                        disabled={resetBusy}
                        onClick={() => void handleResetPassword()}
                        className="inline-flex h-10 items-center gap-2 rounded-full bg-white/80 px-4 font-[family-name:var(--font-outfit)] text-[13px] font-semibold text-[#6b21a8] ring-1 ring-[#e9d5ff] disabled:opacity-60"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        {resetBusy ? "Sending…" : "Send reset email"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 rounded-[22px] bg-white/55 px-5 py-4 ring-1 ring-white/70">
                    <p className="font-[family-name:var(--font-outfit)] text-[14px] font-semibold text-[#2a2140]">
                      Password managed by Google
                    </p>
                    <p className="mt-1 font-sans text-[12px] text-[#8b7aa8]">
                      Change your password in your Google account settings.
                    </p>
                  </div>
                )}

                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-[22px] bg-white/55 px-5 py-4 ring-1 ring-white/70">
                  <p className="font-sans text-[12px] text-[#8b7aa8]">
                    End this session on this device.
                  </p>
                  <button
                    type="button"
                    onClick={() => void signOut()}
                    className="inline-flex h-10 items-center gap-2 rounded-full bg-white/80 px-4 font-[family-name:var(--font-outfit)] text-[13px] font-semibold text-[#6b21a8] ring-1 ring-[#e9d5ff]"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Sign out
                  </button>
                </div>
              </GlassPanel>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom dock */}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-30 flex justify-center px-4">
        <motion.div
          initial={reduce ? false : { y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="pointer-events-auto flex items-center gap-3 rounded-full border border-white/60 bg-white/55 px-2 py-2 pl-4 shadow-[0_18px_50px_rgba(88,28,135,0.2)] backdrop-blur-2xl"
        >
          <Info className="hidden h-3.5 w-3.5 text-[#a78bfa] sm:block" />
          <p className="hidden font-sans text-[12px] text-[#7c6b99] sm:block">
            Changes save to your ClipForge account
          </p>
          <SaveBtn saving={saving} onClick={() => void save()} />
        </motion.div>
      </div>
    </div>
  );
}

/** Reference image as page atmosphere + matching liquid color wash. */
function SettingsAtmosphere() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Same picture as background */}
      <div
        className="absolute inset-0 scale-110 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/settings-bg.jpg')",
          filter: "blur(28px) saturate(1.25) brightness(1.05)",
        }}
      />
      {/* Soft wash so UI stays readable while keeping the same palette */}
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(250,232,255,0.55)_0%,rgba(237,233,254,0.45)_40%,rgba(252,231,243,0.5)_100%)]" />
      <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-[#e879f9]/35 blur-3xl" />
      <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-[#a855f7]/30 blur-3xl" />
      <div className="absolute bottom-10 left-1/3 h-64 w-64 rounded-full bg-[#f472b6]/25 blur-3xl" />
    </div>
  );
}
