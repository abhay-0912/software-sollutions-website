import type { Metadata } from "next";
import { PortfolioPage } from "@/components/portfolio/portfolio-page";
import {
  fallbackProjects,
  normalizeProject,
  type PortfolioProject,
  type PortfolioTestimonial,
} from "@/lib/portfolio";
import { getSupabaseServerClient } from "@/lib/supabase";

export const metadata: Metadata = {
  title: "Portfolio | abaay.tech",
  description: "See our work - custom web apps, ERP systems, and automation solutions.",
  openGraph: {
    title: "Portfolio | abaay.tech",
    description: "See our work - custom web apps, ERP systems, and automation solutions.",
    images: ["/og-abaay.svg"],
  },
};

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
    <PortfolioPage
      projects={projects.length > 0 ? projects : fallbackProjects}
      testimonials={testimonials}
    />
  );
}
