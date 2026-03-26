"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { getSupabaseBrowserAuthClient } from "@/lib/supabase-auth";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useAdminToast } from "@/components/admin/toast-provider";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  published: boolean | null;
  created_at: string | null;
};

export function AdminBlogPage() {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [query, setQuery] = useState("");
  const [target, setTarget] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);
  const { pushToast } = useAdminToast();

  const fetchData = useCallback(async () => {
    const supabase = getSupabaseBrowserAuthClient();
    if (!supabase) return;

    setLoading(true);
    const { data, error } = await supabase.from("blog_posts").select("id,title,slug,published,created_at").order("created_at", { ascending: false });
    if (error) pushToast("Failed to load blog posts", "error", true);
    setPosts((data || []) as BlogPost[]);
    setLoading(false);
  }, [pushToast]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const filtered = useMemo(() => {
    const text = query.trim().toLowerCase();
    if (!text) return posts;
    return posts.filter((post) => `${post.title} ${post.slug}`.toLowerCase().includes(text));
  }, [posts, query]);

  const toggle = async (id: string, published: boolean) => {
    const supabase = getSupabaseBrowserAuthClient();
    if (!supabase) return;

    setPosts((prev) => prev.map((item) => (item.id === id ? { ...item, published } : item)));
    const { error } = await supabase.from("blog_posts").update({ published, published_at: published ? new Date().toISOString() : null }).eq("id", id);

    if (error) {
      pushToast("Update failed", "error", true);
      void fetchData();
      return;
    }

    pushToast("Post updated", "success");
  };

  const remove = async () => {
    if (!target) return;

    const supabase = getSupabaseBrowserAuthClient();
    if (!supabase) return;

    setSaving(true);
    const { error } = await supabase.from("blog_posts").delete().eq("id", target.id);
    setSaving(false);

    if (error) {
      pushToast("Delete failed", "error", true);
      return;
    }

    setPosts((prev) => prev.filter((item) => item.id !== target.id));
    setTarget(null);
    pushToast("Post removed", "success");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#111427]/75 p-4">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search title or slug..." className="w-full max-w-md rounded-lg border border-white/15 bg-[#0D1222] px-3 py-2 text-sm text-white" />
        <Link href="/admin/blog/new" className="inline-flex items-center gap-2 rounded-lg border border-[#3B82F6]/50 bg-[#3B82F6]/20 px-4 py-2 text-sm font-semibold text-white">
          <Plus className="h-4 w-4" /> New Post
        </Link>
      </div>

      <article className="rounded-xl border border-white/10 bg-[#111427]/75 p-4">
        {loading ? (
          <div className="space-y-2">{Array.from({ length: 6 }).map((_, idx) => <div key={idx} className="h-10 animate-pulse rounded bg-white/5" />)}</div>
        ) : filtered.length === 0 ? (
          <p className="text-slate-300">No blog posts found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-400">
                <tr>
                  <th className="pb-2">Title</th>
                  <th className="pb-2">Created</th>
                  <th className="pb-2">Published</th>
                  <th className="pb-2" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((post, idx) => (
                  <motion.tr key={post.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }} className="border-t border-white/10">
                    <td className="py-2 text-white">{post.title}<p className="text-xs text-slate-500">/{post.slug}</p></td>
                    <td className="py-2 text-slate-400">{post.created_at ? new Date(post.created_at).toLocaleDateString() : "-"}</td>
                    <td className="py-2"><input type="checkbox" checked={Boolean(post.published)} onChange={(e) => void toggle(post.id, e.target.checked)} /></td>
                    <td className="py-2 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link href={`/admin/blog/${post.id}/edit`} className="inline-flex items-center gap-1 text-[#9CC1FF] hover:text-[#C6DCFF]"><Pencil className="h-4 w-4" />Edit</Link>
                        <button type="button" onClick={() => setTarget(post)} className="inline-flex items-center gap-1 text-red-300 hover:text-red-200"><Trash2 className="h-4 w-4" />Delete</button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </article>

      <ConfirmDialog
        open={Boolean(target)}
        title="Delete post?"
        description="This permanently removes the blog post."
        confirmLabel={saving ? "Deleting..." : "Delete"}
        busy={saving}
        onCancel={() => setTarget(null)}
        onConfirm={() => void remove()}
      />
    </div>
  );
}
