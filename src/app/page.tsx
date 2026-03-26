import type { Metadata } from "next";
import { HomePage } from "@/components/home/home-page";
import { getSupabaseServerClient } from "@/lib/supabase";

type ProjectRow = {
  id: string | number;
  title: string;
  description: string;
  tech_stack: string[] | string | null;
  cover_image: string | null;
  slug: string | null;
};

type TestimonialRow = {
  id: string | number;
  name: string;
  company: string;
  rating: number;
  message: string;
  avatar_url: string | null;
};

export const metadata: Metadata = {
  title: "Abaay Tech | Custom Software Solutions for Global Teams",
  description:
    "Abaay Tech builds custom web apps, ERP/CRM systems, and automation integrations for international businesses.",
  openGraph: {
    title: "Abaay Tech | Custom Software Solutions for Global Teams",
    description:
      "Custom web apps, ERP/CRM systems, and automation solutions built for ambitious teams worldwide.",
    images: ["/og-abaay.svg"],
  },
};

async function getFeaturedProjects(): Promise<ProjectRow[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("projects")
    .select("id, title, description, tech_stack, cover_image, slug")
    .eq("featured", true)
    .limit(3);

  if (error || !data) return [];
  return data;
}

async function getVisibleTestimonials(): Promise<TestimonialRow[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("testimonials")
    .select("id, name, company, rating, message, avatar_url")
    .eq("visible", true)
    .limit(10);

  if (error || !data) return [];
  return data;
}

export default async function Home() {
  const [projects, testimonials] = await Promise.all([
    getFeaturedProjects(),
    getVisibleTestimonials(),
  ]);

  return <HomePage projects={projects} testimonials={testimonials} />;
}
