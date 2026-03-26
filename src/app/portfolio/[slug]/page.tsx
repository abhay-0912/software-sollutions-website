import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortfolioCaseStudyPage } from "@/components/portfolio/portfolio-case-study-page";
import {
  fallbackProjects,
  normalizeProject,
  type PortfolioProject,
} from "@/lib/portfolio";
import { getSupabaseServerClient } from "@/lib/supabase";

type PageProps = {
  params: { slug: string };
};

async function getProjectBySlug(slug: string): Promise<PortfolioProject | null> {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return fallbackProjects.find((project) => project.slug === slug) ?? null;
  }

  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, title, slug, description, long_description, challenge, solution, results, cover_image, screenshots, tech_stack, category, client_name, industry, timeline, team_size, live_url, github_url, featured, published, created_at",
    )
    .eq("slug", slug)
    .eq("published", true)
    .limit(1)
    .maybeSingle();

  if (error) return null;

  if (data) return normalizeProject(data);

  return fallbackProjects.find((project) => project.slug === slug) ?? null;
}

async function getRelatedProjects(project: PortfolioProject): Promise<PortfolioProject[]> {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return fallbackProjects
      .filter((item) => item.category === project.category && item.slug !== project.slug)
      .slice(0, 2)
      .map(normalizeProject);
  }

  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, title, slug, description, long_description, challenge, solution, results, cover_image, screenshots, tech_stack, category, client_name, industry, timeline, team_size, live_url, github_url, featured, published, created_at",
    )
    .eq("category", project.category)
    .neq("slug", project.slug)
    .eq("published", true)
    .limit(2);

  if (error || !data) {
    return fallbackProjects
      .filter((item) => item.category === project.category && item.slug !== project.slug)
      .slice(0, 2)
      .map(normalizeProject);
  }

  return data.map(normalizeProject);
}

async function getNextProject(projectSlug: string): Promise<PortfolioProject | null> {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    const normalized = fallbackProjects.map(normalizeProject);
    const index = normalized.findIndex((item) => item.slug === projectSlug);
    if (index === -1 || index + 1 >= normalized.length) return null;
    return normalized[index + 1];
  }

  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, title, slug, description, long_description, challenge, solution, results, cover_image, screenshots, tech_stack, category, client_name, industry, timeline, team_size, live_url, github_url, featured, published, created_at",
    )
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error || !data || data.length === 0) {
    return null;
  }

  const normalized = data.map(normalizeProject);
  const index = normalized.findIndex((item) => item.slug === projectSlug);
  if (index === -1 || index + 1 >= normalized.length) return null;

  return normalized[index + 1];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    return {
      title: "Portfolio Project | abaay.tech",
      description: "Project details and outcomes from abaay.tech.",
    };
  }

  return {
    title: `${project.title} | abaay.tech Portfolio`,
    description: project.description,
    openGraph: {
      title: `${project.title} | abaay.tech Portfolio`,
      description: project.description,
      images: [project.cover_image || "/og-abaay.svg"],
    },
  };
}

export default async function PortfolioCaseStudyRoute({ params }: PageProps) {
  const project = await getProjectBySlug(params.slug);

  if (!project) {
    notFound();
  }

  const [relatedProjects, nextProject] = await Promise.all([
    getRelatedProjects(project),
    getNextProject(project.slug),
  ]);

  return (
    <PortfolioCaseStudyPage
      project={project}
      relatedProjects={relatedProjects}
      nextProject={nextProject}
    />
  );
}
