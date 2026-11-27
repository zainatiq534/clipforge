import type { Metadata } from "next";
import { PrivacyPolicyPage } from "@/components/legal/PrivacyPolicyPage";

export const metadata: Metadata = {
  title: "Privacy Policy — ClipForge",
  description:
    "How ClipForge collects, uses, and protects your account data, uploads, and clips.",
};

export default function Page() {
  return <PrivacyPolicyPage />;
}
