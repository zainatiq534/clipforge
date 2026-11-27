import type { Metadata } from "next";
import { TermsOfServicePage } from "@/components/legal/TermsOfServicePage";

export const metadata: Metadata = {
  title: "Terms of Service — ClipForge",
  description:
    "Terms of Service for using ClipForge — accounts, content rights, plans, and acceptable use.",
};

export default function Page() {
  return <TermsOfServicePage />;
}
