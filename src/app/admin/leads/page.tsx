import type { Metadata } from "next";
import { AdminLeadsPage } from "@/components/admin/leads-page";

export const metadata: Metadata = {
  title: "Admin Leads | Abaay",
  robots: { index: false, follow: false },
};

export default function LeadsRoutePage() {
  return <AdminLeadsPage />;
}
