import type { Metadata } from "next";
import { ServicesPage } from "@/components/services/services-page";
import { getSupabaseServerClient } from "@/lib/supabase";

type ServiceRow = {
  id: string | number;
  title: string;
  slug: string;
  description: string;
  icon: string | null;
  features: string[] | null;
  price_range: string | null;
  order: number;
  created_at?: string;
};

export const metadata: Metadata = {
  title: "Services | abaay.tech",
  description:
    "Custom web apps, ERP systems, and automation solutions for businesses worldwide.",
  openGraph: {
    title: "Services | abaay.tech",
    description:
      "Custom web apps, ERP systems, and automation solutions for businesses worldwide.",
    images: ["/og-abaay.svg"],
  },
};

async function getServices(): Promise<ServiceRow[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("services")
    .select("id, title, slug, description, icon, features, price_range, order, created_at")
    .order("order", { ascending: true });

  if (error || !data) return [];
  return data;
}

export default async function Services() {
  const services = await getServices();

  return <ServicesPage services={services} />;
}
