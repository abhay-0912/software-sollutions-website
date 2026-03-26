import type { Metadata } from "next";
import { AdminSettingsPage } from "@/components/admin/settings-page";

export const metadata: Metadata = {
  title: "Admin Settings | Abaay",
  robots: { index: false, follow: false },
};

export default function SettingsRoutePage() {
  return <AdminSettingsPage />;
}
