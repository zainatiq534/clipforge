"use client";

import { LegalDocPage, type LegalSection } from "@/components/legal/LegalDocPage";

const SECTIONS: LegalSection[] = [
  {
    id: "overview",
    title: "Overview",
    paragraphs: [
      "This Privacy Policy explains how ClipForge (“we”, “us”, or “our”) collects, uses, stores, and shares information when you use clipforge.app, our dashboard, and related services (the “Service”).",
      "By creating an account or using ClipForge, you agree to this policy. If you do not agree, please do not use the Service.",
    ],
  },
  {
    id: "information-we-collect",
    title: "Information we collect",
    paragraphs: [
      "We collect information you provide and information generated when you use ClipForge.",
    ],
    bullets: [
      "Account details: name, email, password (or Google sign-in), phone or address if you add them in settings.",
      "Workspace content: videos you upload or import, clips you generate, captions, project metadata, and export history.",
      "Usage & device data: pages visited, feature usage, approximate location from IP, browser type, and diagnostics needed to keep the Service reliable.",
      "Billing data: plan selection and payment-related status handled by our payment processors (we do not store full card numbers on ClipForge servers).",
    ],
  },
  {
    id: "how-we-use",
    title: "How we use your information",
    paragraphs: [
      "We use your information to run ClipForge and improve the product for creators.",
    ],
    bullets: [
      "Provide uploading, AI clipping, editing, captions, storage, and export features.",
      "Authenticate accounts, secure the Service, and prevent abuse or fraud.",
      "Measure performance, fix bugs, and understand which features help you ship clips faster.",
      "Send transactional emails (receipts, security notices, important product updates). Marketing emails are optional where required by law.",
      "Enforce our Terms of Service and respond to support requests.",
    ],
  },
  {
    id: "video-content",
    title: "Your videos & clips",
    paragraphs: [
      "Your uploads and generated clips belong to you. We process them solely to provide the Service — for example, analyzing moments, generating captions, storing files, and preparing exports.",
      "You can delete projects and content from your dashboard. Deletion removes access from the active product; residual backups may persist for a limited period for disaster recovery, then are purged according to our retention schedule.",
    ],
  },
  {
    id: "sharing",
    title: "When we share information",
    paragraphs: [
      "We do not sell your personal information. We share data only as needed to operate ClipForge:",
    ],
    bullets: [
      "Infrastructure providers (cloud hosting, storage, video processing) under contracts that protect your data.",
      "Authentication and payment partners when you sign in or upgrade a plan.",
      "Legal requirements if we must respond to a valid law enforcement or regulatory request.",
      "Business transfers if ClipForge is involved in a merger, acquisition, or asset sale — your information would remain protected under this policy or a successor policy with notice.",
    ],
  },
  {
    id: "retention-security",
    title: "Retention & security",
    paragraphs: [
      "We keep account and content data while your account is active and as needed for backups, disputes, or legal obligations. You may request deletion of your account via support.",
      "We use encryption in transit, access controls, and least-privilege practices. No method of transmission or storage is 100% secure, but we work continuously to protect ClipForge.",
    ],
  },
  {
    id: "your-rights",
    title: "Your choices & rights",
    paragraphs: [
      "Depending on where you live, you may have rights to access, correct, export, or delete personal data, or to object to certain processing. Contact support@clipforge.app to make a request. We may need to verify your identity before fulfilling it.",
      "You can update profile details in Settings, manage plan storage, and delete uploads from your Projects workspace.",
    ],
  },
  {
    id: "children",
    title: "Children",
    paragraphs: [
      "ClipForge is not directed to children under 13 (or the minimum age required in your country). We do not knowingly collect personal information from children. If you believe a child has provided data, contact us and we will take appropriate steps.",
    ],
  },
  {
    id: "changes",
    title: "Changes to this policy",
    paragraphs: [
      "We may update this Privacy Policy as ClipForge evolves. We will post the revised version on this page and update the “Last updated” date. Material changes may also be communicated by email or in-app notice.",
    ],
  },
  {
    id: "contact",
    title: "Contact",
    paragraphs: [
      "For privacy questions or requests, email support@clipforge.app or use the Contact page. We typically respond within a few business days.",
    ],
  },
];

export function PrivacyPolicyPage() {
  return (
    <LegalDocPage
      label="Legal"
      titleLead="Your privacy"
      titleAccent="matters to us."
      intro="Clear rules on what ClipForge collects, how we use video and account data, and the choices you have in your workspace."
      updated="November 27, 2026"
      sections={SECTIONS}
    />
  );
}
