import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { BlogListingPage } from "@/components/blog/blog-listing-page";
import { fallbackBlogPosts, type BlogPost } from "@/lib/blog";
import { generateBreadcrumbs } from "@/lib/generateBreadcrumbs";
import { generateMetadata } from "@/lib/generateMetadata";
import { seoConfig } from "@/lib/seo.config";
import { getSupabaseServerClient } from "@/lib/supabase";

export const revalidate = 180;

export const metadata: Metadata = generateMetadata({
  title: "Abaay Tech Blog | Web, ERP & Automation Insights",
  absoluteTitle: true,
  path: "/blog",
  image: "/blog/opengraph-image",
  description:
    "Read practical guides, tutorials, and case studies on web development, ERP systems, and automation from Abaay Tech.",
  keywords: [
    "software development blog",
    "ERP implementation tips",
    "automation tutorials",
    "Next.js blog",
    "Abaay Tech blog",
  ],
});

async function getPublishedPosts(): Promise<BlogPost[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return fallbackBlogPosts;
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      "id, title, slug, excerpt, content, cover_image, author, author_avatar, author_bio, tags, read_time, featured, published, created_at, updated_at",
    )
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error || !data || data.length === 0) {
    return fallbackBlogPosts;
  }

  return data as BlogPost[];
}

export default async function BlogRoute() {
  const posts = await getPublishedPosts();

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Abaay Tech Blog",
    description: "Insights on modern web development, ERP, and automation.",
    url: `${seoConfig.siteUrl}/blog`,
    publisher: {
      "@type": "Organization",
      name: "Abaay Tech",
      url: seoConfig.siteUrl,
    },
  };

  return (
    <>
      <JsonLd id="blog-schema" data={blogSchema} />
      <JsonLd id="blog-breadcrumbs" data={generateBreadcrumbs("/blog")} />
      <BlogListingPage posts={posts} />
    </>
  );
}
