import { ImageResponse } from "next/og";
import { fallbackProjects } from "@/lib/portfolio";
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

async function getProjectTitle(slug: string) {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return fallbackProjects.find((project) => project.slug === slug)?.title || "Abaay Tech Case Study";
  }

  const { data } = await supabase
    .from("projects")
    .select("title")
    .eq("slug", slug)
    .eq("published", true)
    .limit(1)
    .maybeSingle();

  return data?.title || fallbackProjects.find((project) => project.slug === slug)?.title || "Abaay Tech Case Study";
}

export default async function Image({ params }: RouteProps) {
  const title = await getProjectTitle(params.slug);

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
            "radial-gradient(circle at 10% 15%, #1b4d8f 0%, #0D0F1A 55%), linear-gradient(130deg, #0D0F1A 0%, #111a2f 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, color: "#8AB4FF" }}>Abaay Tech Portfolio</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 60, fontWeight: 700, lineHeight: 1.1, maxWidth: 1020 }}>{title}</div>
          <div style={{ fontSize: 28, color: "#c5d9ff" }}>Case Study</div>
        </div>
      </div>
    ),
    size,
  );
}
