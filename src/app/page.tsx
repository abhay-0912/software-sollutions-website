import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { HomePage } from "@/components/home/home-page";
import { generateBreadcrumbs } from "@/lib/generateBreadcrumbs";
import { generateMetadata } from "@/lib/generateMetadata";
import { seoConfig } from "@/lib/seo.config";
import { getSupabaseServerClient } from "@/lib/supabase";

type ProjectRow = {
  id: string | number;
  title: string;
  description: string;
  tech_stack: string[] | string | null;
  cover_image: string | null;
  slug: string | null;
};

type TestimonialRow = {
  id: string | number;
  name: string;
  company: string;
  rating: number;
  message: string;
  avatar_url: string | null;
};

export const revalidate = 120;

export const metadata: Metadata = generateMetadata({
  title: "Abaay Tech | Custom Software Solutions for Global Teams",
  absoluteTitle: true,
  path: "/",
  image: "/opengraph-image",
  description:
    "Abaay Tech builds custom web apps, ERP/CRM systems, and automation integrations for international businesses.",
  keywords: [
    "Abaay Tech",
    "custom software development",
    "Next.js development company",
    "ERP development",
    "automation agency",
  ],
});

async function getFeaturedProjects(): Promise<ProjectRow[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("projects")
    .select("id, title, description, tech_stack, cover_image, slug")
    .eq("featured", true)
    .limit(3);

  if (error || !data) return [];
  return data;
}

async function getVisibleTestimonials(): Promise<TestimonialRow[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("testimonials")
    .select("id, name, company, rating, message, avatar_url")
    .eq("visible", true)
    .limit(10);

  if (error || !data) return [];
  return data;
}

export default async function Home() {
  const [projects, testimonials] = await Promise.all([
    getFeaturedProjects(),
    getVisibleTestimonials(),
  ]);

  const professionalServiceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "Abaay Tech",
    url: seoConfig.siteUrl,
    description:
      "Custom web applications, ERP/CRM systems, and automation solutions for businesses worldwide.",
    areaServed: "Worldwide",
    telephone: "+91-0000000000",
    email: "absrivastava999@gmail.com",
    serviceType: [
      "Custom Web Application Development",
      "ERP and CRM Development",
      "Automation and Integrations",
    ],
  };

  return (
    <>
      <JsonLd id="home-service-schema" data={professionalServiceSchema} />
      <JsonLd id="home-breadcrumbs" data={generateBreadcrumbs("/")} />
      <HomePage projects={projects} testimonials={testimonials} />
    </>
  );
}
