import { ImageResponse } from "next/og";
import { fallbackBlogPosts } from "@/lib/blog";
import { getSupabaseServerClient } from "@/lib/supabase";

export const runtime = "edge";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

type RouteProps = {
  params: { slug: string };
};

async function getPostTitle(slug: string) {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return fallbackBlogPosts.find((post) => post.slug === slug)?.title || "Abaay Tech Blog";
  }

  const { data } = await supabase
    .from("blog_posts")
    .select("title")
    .eq("slug", slug)
    .eq("published", true)
    .limit(1)
    .maybeSingle();

  return data?.title || fallbackBlogPosts.find((post) => post.slug === slug)?.title || "Abaay Tech Blog";
}

export default async function Image({ params }: RouteProps) {
  const title = await getPostTitle(params.slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px",
          background:
            "radial-gradient(circle at 80% 20%, #12317a 0%, #0D0F1A 50%), linear-gradient(120deg, #0D0F1A 0%, #191f38 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, color: "#8AB4FF" }}>Abaay Tech Blog</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 62, fontWeight: 700, lineHeight: 1.08, maxWidth: 1020 }}>{title}</div>
          <div style={{ fontSize: 28, color: "#c5d9ff" }}>web • erp • automation</div>
        </div>
      </div>
    ),
    size,
  );
}
