import type { Metadata } from "next";
import { AboutPage } from "@/components/about/about-page";

export const metadata: Metadata = {
  title: "About Us | abaay.tech",
  description:
    "Learn about Abaay Tech - a software solutions company building web apps, ERP systems, and automation tools for global clients.",
  openGraph: {
    title: "About Us | abaay.tech",
    description:
      "Learn about Abaay Tech - a software solutions company building web apps, ERP systems, and automation tools for global clients.",
    images: ["/og-abaay.svg"],
  },
};

// TODO: Enable team member data from Supabase when the `team_members` table is ready.
// Example:
// const supabase = getSupabaseServerClient();
// const { data: teamMembers } = await supabase
//   .from("team_members")
//   .select("id, name, role, bio, avatar_url, linkedin_url, github_url, tech_tags, order, visible")
//   .eq("visible", true)
//   .order("order", { ascending: true });

export default function AboutRoute() {
  return <AboutPage />;
}
