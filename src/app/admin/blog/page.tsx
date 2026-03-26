import type { Metadata } from "next";
import { AdminBlogPage } from "@/components/admin/blog-page";

export const metadata: Metadata = {
  title: "Admin Blog | Abaay",
  robots: { index: false, follow: false },
};

export default function BlogRoutePage() {
  return <AdminBlogPage />;
}
