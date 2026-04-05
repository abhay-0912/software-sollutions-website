import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { BlogPostPage } from "@/components/blog/blog-post-page";
import { fallbackBlogPosts, type BlogPost } from "@/lib/blog";
import { generateBreadcrumbs } from "@/lib/generateBreadcrumbs";
import { generateMetadata as buildMetadata } from "@/lib/generateMetadata";
import { seoConfig } from "@/lib/seo.config";
import { getSupabaseServerClient } from "@/lib/supabase";

type PageProps = {
  params: { slug: string };
};

export const revalidate = 180;

async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return fallbackBlogPosts.find((post) => post.slug === slug) ?? null;
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      "id, title, slug, excerpt, content, cover_image, author, author_avatar, author_bio, tags, read_time, featured, published, created_at, updated_at",
    )
    .eq("slug", slug)
    .eq("published", true)
    .limit(1)
    .maybeSingle();

  if (error) return null;
  if (data) return data as BlogPost;

  return fallbackBlogPosts.find((post) => post.slug === slug) ?? null;
}

async function getRelatedPosts(post: BlogPost): Promise<BlogPost[]> {
  const supabase = getSupabaseServerClient();
  const tags = post.tags || [];

  if (!supabase) {
    return fallbackBlogPosts.filter((item) => item.slug !== post.slug).slice(0, 3);
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .select(
      "id, title, slug, excerpt, content, cover_image, author, author_avatar, author_bio, tags, read_time, featured, published, created_at, updated_at",
    )
    .neq("slug", post.slug)
    .eq("published", true)
    .overlaps("tags", tags)
    .limit(3);

  if (error || !data || data.length === 0) {
    return fallbackBlogPosts.filter((item) => item.slug !== post.slug).slice(0, 3);
  }

  return data as BlogPost[];
}

async function getReactions(postId: string) {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return { up: 0, down: 0 };
  }

  const [upRes, downRes] = await Promise.all([
    supabase.from("post_reactions").select("id", { count: "exact", head: true }).eq("post_id", postId).eq("reaction", "up"),
    supabase.from("post_reactions").select("id", { count: "exact", head: true }).eq("post_id", postId).eq("reaction", "down"),
  ]);

  return {
    up: upRes.count || 0,
    down: downRes.count || 0,
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return buildMetadata({
      title: "Blog Post | abaay.tech",
      absoluteTitle: true,
      description: "Technical article from Abaay Tech.",
      path: `/blog/${params.slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: post.title,
    path: `/blog/${post.slug}`,
    image: post.cover_image || `/blog/${post.slug}/opengraph-image`,
    description: post.excerpt,
    type: "article",
    publishedTime: post.created_at,
    modifiedTime: post.updated_at || post.created_at,
    tags: post.tags || undefined,
    keywords: [post.title, ...(post.tags || []), "Abaay Tech blog"],
  });
}

export async function generateStaticParams() {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return fallbackBlogPosts.map((post) => ({ slug: post.slug }));
  }

  const { data } = await supabase.from("blog_posts").select("slug").eq("published", true);
  if (!data || data.length === 0) {
    return fallbackBlogPosts.map((post) => ({ slug: post.slug }));
  }

  return data
    .map((row) => row.slug)
    .filter((slug): slug is string => Boolean(slug?.trim()))
    .map((slug) => ({ slug }));
}

export default async function BlogPostRoute({ params }: PageProps) {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  const [related, initialReactions] = await Promise.all([
    getRelatedPosts(post),
    getReactions(post.id),
  ]);

  const breadcrumbData = generateBreadcrumbs(`/blog/${post.slug}`, { [post.slug]: post.title });

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.cover_image || `${seoConfig.siteUrl}/blog/${post.slug}/opengraph-image`,
    datePublished: post.created_at,
    dateModified: post.updated_at || post.created_at,
    author: {
      "@type": "Person",
      name: post.author || "Abaay",
    },
    publisher: {
      "@type": "Organization",
      name: "Abaay Tech",
      logo: {
        "@type": "ImageObject",
        url: `${seoConfig.siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: `${seoConfig.siteUrl}/blog/${post.slug}`,
  };

  return (
    <>
      <JsonLd id="blog-posting-schema" data={blogPostingSchema} />
      <JsonLd id="blog-post-breadcrumbs" data={breadcrumbData} />
      <BlogPostPage post={post} related={related} initialReactions={initialReactions} />
    </>
  );
}
