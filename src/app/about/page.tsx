import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { AboutPage } from "@/components/about/about-page";
import { generateBreadcrumbs } from "@/lib/generateBreadcrumbs";
import { generateMetadata } from "@/lib/generateMetadata";

export const metadata: Metadata = generateMetadata({
  title: "About Abaay Tech | Software Team for Global Projects",
  absoluteTitle: true,
  path: "/about",
  image: "/opengraph-image",
  description:
    "Learn about Abaay Tech, our approach to building reliable software, and how we help global teams launch and scale products.",
  keywords: ["about abaay tech", "software team India", "global software partner"],
});

// TODO: Enable team member data from Supabase when the `team_members` table is ready.
// Example:
// const supabase = getSupabaseServerClient();
// const { data: teamMembers } = await supabase
//   .from("team_members")
//   .select("id, name, role, bio, avatar_url, linkedin_url, github_url, tech_tags, order, visible")
//   .eq("visible", true)
//   .order("order", { ascending: true });

export default function AboutRoute() {
  return (
    <>
      <JsonLd id="about-breadcrumbs" data={generateBreadcrumbs("/about")} />
      <AboutPage />
    </>
  );
}
