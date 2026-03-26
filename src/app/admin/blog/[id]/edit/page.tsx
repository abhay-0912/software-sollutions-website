import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogEditor } from "@/components/admin/blog-editor";
import { getSupabaseServerAuthClient } from "@/lib/supabase-auth-server";

type Params = { params: { id: string } };

export const metadata: Metadata = {
  title: "Edit Blog Post | Admin",
  robots: { index: false, follow: false },
};

export default async function EditBlogPostPage({ params }: Params) {
  const supabase = getSupabaseServerAuthClient();
  if (!supabase) {
    notFound();
  }

  const { data } = await supabase.from("blog_posts").select("*").eq("id", params.id).single();
  if (!data) notFound();

  return <BlogEditor isEdit initialData={data} />;
}
