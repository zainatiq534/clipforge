import type { Metadata } from "next";
import { ContactPage } from "@/components/contact/ContactPage";

export const metadata: Metadata = {
  title: "Contact — ClipForge",
  description:
    "Contact ClipForge support for billing, exports, uploads, feature requests, and partnerships. We typically reply within a few hours.",
};

export default function Page() {
  return <ContactPage />;
}
