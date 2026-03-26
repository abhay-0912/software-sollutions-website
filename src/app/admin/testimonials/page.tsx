import type { Metadata } from "next";
import { AdminTestimonialsPage } from "@/components/admin/testimonials-page";

export const metadata: Metadata = {
  title: "Admin Testimonials | Abaay",
  robots: { index: false, follow: false },
};

export default function TestimonialsRoutePage() {
  return <AdminTestimonialsPage />;
}
