import type { MetadataRoute } from "next";
import { fallbackBlogPosts } from "@/lib/blog";
import { fallbackProjects } from "@/lib/portfolio";
import { seoConfig } from "@/lib/seo.config";
import { getSupabaseServerClient } from "@/lib/supabase";

const staticRoutes = [
  "",
  "/about",
  "/services",
  "/services/web-mobile-apps",
  "/services/erp-crm",
  "/services/automation-integrations",
  "/portfolio",
  "/blog",
  "/contact",
];

async function getProjectEntries() {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return fallbackProjects.map((project) => ({ slug: project.slug, updated_at: project.created_at }));
  }

  const { data } = await supabase
    .from("projects")
    .select("slug, updated_at, created_at")
    .eq("published", true);

  if (!data || data.length === 0) {
    return fallbackProjects.map((project) => ({ slug: project.slug, updated_at: project.created_at }));
  }

  return data.map((row) => ({ slug: row.slug as string, updated_at: (row.updated_at || row.created_at) as string | null }));
}

async function getBlogEntries() {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return fallbackBlogPosts.map((post) => ({ slug: post.slug, updated_at: post.updated_at || post.created_at }));
  }

  const { data } = await supabase
    .from("blog_posts")
    .select("slug, updated_at, created_at")
    .eq("published", true);

  if (!data || data.length === 0) {
    return fallbackBlogPosts.map((post) => ({ slug: post.slug, updated_at: post.updated_at || post.created_at }));
  }

  return data.map((row) => ({ slug: row.slug as string, updated_at: (row.updated_at || row.created_at) as string | null }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const [projects, posts] = await Promise.all([getProjectEntries(), getBlogEntries()]);

  const baseEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${seoConfig.siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/services" || route === "/portfolio" || route === "/blog" ? 0.9 : 0.7,
  }));

  const projectEntries: MetadataRoute.Sitemap = projects
    .filter((project) => Boolean(project.slug))
    .map((project) => ({
      url: `${seoConfig.siteUrl}/portfolio/${project.slug}`,
      lastModified: project.updated_at ? new Date(project.updated_at) : now,
      changeFrequency: "monthly",
      priority: 0.8,
    }));

  const blogEntries: MetadataRoute.Sitemap = posts
    .filter((post) => Boolean(post.slug))
    .map((post) => ({
      url: `${seoConfig.siteUrl}/blog/${post.slug}`,
      lastModified: post.updated_at ? new Date(post.updated_at) : now,
      changeFrequency: "weekly",
      priority: 0.75,
    }));

  return [...baseEntries, ...projectEntries, ...blogEntries];
}
