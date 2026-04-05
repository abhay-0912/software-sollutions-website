import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PortfolioPage } from "@/components/portfolio/portfolio-page";
import { generateBreadcrumbs } from "@/lib/generateBreadcrumbs";
import { generateMetadata } from "@/lib/generateMetadata";
import {
  fallbackProjects,
  normalizeProject,
  type PortfolioProject,
  type PortfolioTestimonial,
} from "@/lib/portfolio";
import { getSupabaseServerClient } from "@/lib/supabase";

export const revalidate = 300;

export const metadata: Metadata = generateMetadata({
  title: "Portfolio & Case Studies | abaay.tech",
  absoluteTitle: true,
  path: "/portfolio",
  image: "/portfolio/opengraph-image",
  description: "Explore Abaay Tech case studies across web apps, ERP implementations, and automation products.",
  keywords: [
    "software case studies",
    "ERP project portfolio",
    "automation project examples",
    "Abaay Tech portfolio",
  ],
});

async function getPublishedProjects(): Promise<PortfolioProject[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, title, slug, description, long_description, challenge, solution, results, cover_image, screenshots, tech_stack, category, client_name, industry, timeline, team_size, live_url, github_url, featured, published, created_at",
    )
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error || !data) return [];

  return data.map(normalizeProject);
}

async function getMiniTestimonials(): Promise<PortfolioTestimonial[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("testimonials")
    .select("id, name, company, message, rating, avatar_url")
    .eq("visible", true)
    .limit(2);

  if (error || !data) return [];
  return data;
}

export default async function PortfolioRoute() {
  const [projects, testimonials] = await Promise.all([
    getPublishedProjects(),
    getMiniTestimonials(),
  ]);

  return (
    <>
      <JsonLd id="portfolio-breadcrumbs" data={generateBreadcrumbs("/portfolio")} />
      <PortfolioPage
        projects={projects.length > 0 ? projects : fallbackProjects}
        testimonials={testimonials}
      />
    </>
  );
}
