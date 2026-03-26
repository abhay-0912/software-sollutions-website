import type { Metadata } from "next";
import { AdminDashboardPage } from "@/components/admin/dashboard-page";

export const metadata: Metadata = {
  title: "Admin Dashboard | Abaay",
  robots: { index: false, follow: false },
};

export default function DashboardRoutePage() {
  return <AdminDashboardPage />;
}
