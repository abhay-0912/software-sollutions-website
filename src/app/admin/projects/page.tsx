import type { Metadata } from "next";
import { AdminProjectsPage } from "@/components/admin/projects-page";

export const metadata: Metadata = {
  title: "Admin Projects | Abaay",
  robots: { index: false, follow: false },
};

export default function ProjectsRoutePage() {
  return <AdminProjectsPage />;
}
