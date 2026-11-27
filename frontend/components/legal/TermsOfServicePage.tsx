"use client";

import { LegalDocPage, type LegalSection } from "@/components/legal/LegalDocPage";

const SECTIONS: LegalSection[] = [
  {
    id: "agreement",
    title: "Agreement to these terms",
    paragraphs: [
      "These Terms of Service (“Terms”) govern your access to and use of ClipForge, including our website, dashboard, AI clipping tools, editor, and related services (the “Service”).",
      "By creating an account, uploading content, or otherwise using ClipForge, you agree to these Terms and our Privacy Policy. If you use ClipForge on behalf of a company, you represent that you have authority to bind that company.",
    ],
  },
  {
    id: "the-service",
    title: "The ClipForge service",
    paragraphs: [
      "ClipForge helps you upload or import long-form video, identify engaging moments, generate short clips, apply captions and styles, and export vertical or platform-ready media.",
      "Features, plan limits (storage, uploads, watermarks, processing priority), and availability may change over time. We may add, modify, or discontinue features with reasonable notice when practical.",
    ],
  },
  {
    id: "accounts",
    title: "Accounts & eligibility",
    paragraphs: [
      "You must provide accurate account information and keep your credentials secure. You are responsible for activity under your account.",
      "You must be old enough to form a binding contract in your jurisdiction (and at least 13). We may suspend or terminate accounts that violate these Terms or create risk for other users.",
    ],
  },
  {
    id: "your-content",
    title: "Your content & license",
    paragraphs: [
      "You retain ownership of videos, clips, captions, and other materials you submit (“Your Content”). You grant ClipForge a limited license to host, process, transcode, analyze, and display Your Content solely to operate and improve the Service for you.",
      "You represent that you have all rights needed to upload and process Your Content — including rights from platforms when you import from links — and that Your Content does not infringe others’ rights or applicable law.",
    ],
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    paragraphs: ["You agree not to misuse ClipForge. Prohibited conduct includes:"],
    bullets: [
      "Uploading illegal, harmful, or infringing content, or content you do not have rights to use.",
      "Attempting to bypass plan limits, security controls, or access another user’s workspace.",
      "Reverse engineering, scraping, or overloading the Service except as allowed by law.",
      "Using ClipForge to spam, harass, or distribute malware.",
      "Reselling or redistributing the Service without our written permission.",
    ],
  },
  {
    id: "plans-billing",
    title: "Plans, billing & refunds",
    paragraphs: [
      "Free and paid plans include different storage, upload, and export entitlements as shown in Pricing and Settings. Paid plans renew according to the interval you select until canceled.",
      "Fees are charged via our payment partners. Taxes may apply. Unless required by law or stated in a specific offer, fees are non-refundable except as described on our refund guidance (for example, a 14-day satisfaction window on eligible paid plans).",
      "If payment fails or a plan expires, we may reduce features, pause processing, or limit new uploads until the account is brought current.",
    ],
  },
  {
    id: "ai-outputs",
    title: "AI features & outputs",
    paragraphs: [
      "ClipForge uses automated systems to suggest viral windows, captions, and related edits. Outputs can be imperfect — always preview before publishing. You are responsible for reviewing clips, captions, and exports for accuracy, brand safety, and compliance with platform rules.",
      "We do not guarantee specific view counts, ranking, or viral performance for any clip.",
    ],
  },
  {
    id: "ip",
    title: "ClipForge intellectual property",
    paragraphs: [
      "The ClipForge name, logos, UI, software, and documentation are our property or our licensors’. These Terms do not grant you rights to our trademarks or source code beyond the limited right to use the Service as provided.",
    ],
  },
  {
    id: "disclaimers",
    title: "Disclaimers",
    paragraphs: [
      "THE SERVICE IS PROVIDED “AS IS” AND “AS AVAILABLE.” TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. We do not warrant uninterrupted or error-free operation, or that content will never be lost — keep your own backups of critical masters.",
    ],
  },
  {
    id: "liability",
    title: "Limitation of liability",
    paragraphs: [
      "To the maximum extent permitted by law, ClipForge and its team will not be liable for indirect, incidental, special, consequential, or punitive damages, or for lost profits, revenue, or data, arising from your use of the Service.",
      "Our total liability for any claim relating to the Service is limited to the greater of (a) the amounts you paid us for the Service in the 3 months before the claim or (b) USD $50, except where law prohibits such a limit.",
    ],
  },
  {
    id: "termination",
    title: "Suspension & termination",
    paragraphs: [
      "You may stop using ClipForge and request account closure at any time. We may suspend or terminate access if you breach these Terms, create legal or security risk, or if we discontinue the Service.",
      "Upon termination, your right to use ClipForge ends. Provisions that should survive (ownership, disclaimers, liability limits) will survive.",
    ],
  },
  {
    id: "changes-law",
    title: "Changes & governing law",
    paragraphs: [
      "We may update these Terms by posting a new version on this page. Continued use after the effective date means you accept the updated Terms. If you do not agree, stop using the Service.",
      "These Terms are governed by the laws applicable in the jurisdiction where ClipForge operates its primary business entity, without regard to conflict-of-law rules, except where mandatory consumer protections in your country apply.",
    ],
  },
  {
    id: "contact",
    title: "Contact",
    paragraphs: [
      "Questions about these Terms? Email support@clipforge.app or reach us through the Contact page.",
    ],
  },
];

export function TermsOfServicePage() {
  return (
    <LegalDocPage
      label="Legal"
      titleLead="Terms that keep"
      titleAccent="ClipForge fair."
      intro="The rules for using ClipForge — accounts, your content, plans, AI features, and what we both agree to when you create and export clips."
      updated="November 27, 2026"
      sections={SECTIONS}
    />
  );
}
