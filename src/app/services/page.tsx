import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { ServicesPage } from "@/components/services/services-page";
import { toFaqJsonLd, servicesFaqItems } from "@/lib/faq";
import { generateBreadcrumbs } from "@/lib/generateBreadcrumbs";
import { generateMetadata } from "@/lib/generateMetadata";
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

export const revalidate = 300;

export const metadata: Metadata = generateMetadata({
  title: "Software Development Services | abaay.tech",
  absoluteTitle: true,
  path: "/services",
  image: "/opengraph-image",
  description:
    "Explore Abaay Tech services: custom web apps, ERP/CRM development, and automation solutions for growing businesses.",
  keywords: [
    "software development services",
    "custom web app development",
    "ERP implementation",
    "business automation services",
    "Abaay Tech services",
  ],
});

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

  return (
    <>
      <JsonLd id="services-faq-schema" data={toFaqJsonLd(servicesFaqItems)} />
      <JsonLd id="services-breadcrumbs" data={generateBreadcrumbs("/services")} />
      <ServicesPage services={services} />
    </>
  );
}
