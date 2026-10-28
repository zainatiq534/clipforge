"use client";

import { Bell, CreditCard, Shield, User } from "lucide-react";
import { AppPageHero } from "@/components/dashboard/AppPageHero";
import { DashboardMotion } from "@/components/dashboard/DashboardMotion";
import { GradientButton } from "@/components/ui/Button";

const sections = [
  {
    title: "Profile",
    icon: User,
    fields: [
      { label: "Display name", value: "Zain" },
      { label: "Email", value: "zain@clipforge.ai" },
      { label: "Workspace", value: "ClipForge Studio" },
    ],
  },
  {
    title: "Notifications",
    icon: Bell,
    fields: [
      { label: "Clip ready alerts", value: "On" },
      { label: "Weekly report", value: "On" },
      { label: "Marketing emails", value: "Off" },
    ],
  },
  {
    title: "Billing",
    icon: CreditCard,
    fields: [
      { label: "Plan", value: "Pro" },
      { label: "Renews", value: "Nov 27, 2026" },
      { label: "Seats", value: "5" },
    ],
  },
  {
    title: "Security",
    icon: Shield,
    fields: [
      { label: "2FA", value: "Enabled" },
      { label: "Sessions", value: "2 active" },
      { label: "API keys", value: "1 key" },
    ],
  },
];

export function SettingsPage() {
  return (
    <div className="flex min-w-0 flex-col gap-3">
      <DashboardMotion delay={0.08}>
        <AppPageHero
          title="Settings"
          description="Manage your profile, notifications, billing, and workspace security — same ClipForge brand look."
          action="Save changes"
        />
      </DashboardMotion>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {sections.map((section, i) => {
          const Icon = section.icon;
          return (
            <DashboardMotion key={section.title} delay={0.12 + i * 0.06}>
              <section className="rounded-[22px] bg-white p-3.5 shadow-[0_10px_28px_rgba(20,20,40,0.06)] sm:p-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-sans text-[13px] font-bold text-[#111827]">
                    {section.title}
                  </h2>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-[12px] bg-[#ede9fe] text-[#7c3aed]">
                    <Icon className="h-4 w-4" strokeWidth={1.8} />
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  {section.fields.map((field) => (
                    <div
                      key={field.label}
                      className="flex items-center justify-between gap-3 rounded-[16px] bg-[#faf5ff] px-3 py-2.5"
                    >
                      <span className="font-sans text-[11px] text-[#7a738c]">{field.label}</span>
                      <span className="font-sans text-[12px] font-semibold text-[#111827]">
                        {field.value}
                      </span>
                    </div>
                  ))}
                </div>
                <GradientButton size="sm" className="mt-3.5">
                  {section.title === "Billing" ? "Upgrade plan" : "Edit"}
                </GradientButton>
              </section>
            </DashboardMotion>
          );
        })}
      </div>
    </div>
  );
}
