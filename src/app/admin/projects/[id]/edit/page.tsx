import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectEditor } from "@/components/admin/project-editor";
import { getSupabaseServerAuthClient } from "@/lib/supabase-auth-server";

type Params = { params: { id: string } };

export const metadata: Metadata = {
  title: "Edit Project | Admin",
  robots: { index: false, follow: false },
};

export default async function EditProjectPage({ params }: Params) {
  const supabase = getSupabaseServerAuthClient();
  if (!supabase) {
    notFound();
  }

  const { data } = await supabase.from("projects").select("*").eq("id", params.id).single();
  if (!data) notFound();

  return <ProjectEditor isEdit initialData={data} />;
}
