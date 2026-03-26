"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Save } from "lucide-react";
import { getSupabaseBrowserAuthClient } from "@/lib/supabase-auth";
import { useAdminToast } from "@/components/admin/toast-provider";

type BlogForm = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  tags: string;
  published: boolean;
};

const emptyForm: BlogForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image: "",
  tags: "",
  published: false,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function markdownPreview(markdown: string) {
  return markdown
    .replace(/^### (.*)$/gm, "<h3>$1</h3>")
    .replace(/^## (.*)$/gm, "<h2>$1</h2>")
    .replace(/^# (.*)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\n/g, "<br />");
}

export function BlogEditor({ initialData, isEdit }: { initialData?: Partial<BlogForm>; isEdit: boolean }) {
  const [form, setForm] = useState<BlogForm>({ ...emptyForm, ...initialData });
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [preview, setPreview] = useState(false);
  const router = useRouter();
  const { pushToast } = useAdminToast();

  useEffect(() => {
    if (!form.slug && form.title.trim()) {
      setForm((prev) => ({ ...prev, slug: slugify(prev.title) }));
    }
  }, [form.slug, form.title]);

  const update = <K extends keyof BlogForm>(key: K, value: BlogForm[K]) => {
    setDirty(true);
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const payload = useMemo(
    () => ({
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt,
      content: form.content,
      cover_image: form.cover_image || null,
      tags: form.tags
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      published: form.published,
      published_at: form.published ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    }),
    [form],
  );

  const save = useCallback(async () => {
    if (!form.title.trim() || !form.content.trim()) {
      pushToast("Title and content are required", "error", true);
      return;
    }

    const supabase = getSupabaseBrowserAuthClient();
    if (!supabase) return;

    setSaving(true);

    const query = isEdit && form.id
      ? supabase.from("blog_posts").update(payload).eq("id", form.id)
      : supabase.from("blog_posts").insert(payload);

    const { error } = await query;
    setSaving(false);

    if (error) {
      pushToast(error.message || "Save failed", "error", true);
      return;
    }

    setDirty(false);
    pushToast(isEdit ? "Post updated" : "Post created", "success");

    if (!isEdit) {
      router.push("/admin/blog");
      router.refresh();
    }
  }, [form.content, form.id, form.title, isEdit, payload, pushToast, router]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        void save();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [save]);

  useEffect(() => {
    if (!dirty) return;

    const timer = window.setTimeout(() => {
      void save();
    }, 30000);

    return () => window.clearTimeout(timer);
  }, [dirty, save]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-white/10 bg-[#111427]/75 p-4">
        <div className="grid gap-3 md:grid-cols-2">
          <label>
            <span className="mb-1 block text-xs text-slate-400">Title</span>
            <input value={form.title} onChange={(e) => update("title", e.target.value)} className="w-full rounded-lg border border-white/15 bg-[#0D1222] px-3 py-2 text-sm text-white" />
          </label>
          <label>
            <span className="mb-1 block text-xs text-slate-400">Slug</span>
            <input value={form.slug} onChange={(e) => update("slug", e.target.value)} className="w-full rounded-lg border border-white/15 bg-[#0D1222] px-3 py-2 text-sm text-white" />
          </label>
          <label className="md:col-span-2">
            <span className="mb-1 block text-xs text-slate-400">Excerpt</span>
            <textarea value={form.excerpt} onChange={(e) => update("excerpt", e.target.value)} rows={2} className="w-full rounded-lg border border-white/15 bg-[#0D1222] px-3 py-2 text-sm text-white" />
          </label>
          <label className="md:col-span-2">
            <span className="mb-1 block text-xs text-slate-400">Cover Image URL</span>
            <input value={form.cover_image} onChange={(e) => update("cover_image", e.target.value)} className="w-full rounded-lg border border-white/15 bg-[#0D1222] px-3 py-2 text-sm text-white" />
          </label>
          <label className="md:col-span-2">
            <span className="mb-1 block text-xs text-slate-400">Tags (comma separated)</span>
            <input value={form.tags} onChange={(e) => update("tags", e.target.value)} className="w-full rounded-lg border border-white/15 bg-[#0D1222] px-3 py-2 text-sm text-white" />
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-200">
            <input type="checkbox" checked={form.published} onChange={(e) => update("published", e.target.checked)} />
            Published
          </label>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#111427]/75 p-3">
        <p className="text-sm text-slate-300">Markdown Content</p>
        <button type="button" onClick={() => setPreview((prev) => !prev)} className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-1.5 text-sm text-slate-100">
          <Eye className="h-4 w-4" /> {preview ? "Editor" : "Preview"}
        </button>
      </div>

      <article className="rounded-xl border border-white/10 bg-[#111427]/75 p-4">
        {preview ? (
          <div className="prose prose-invert max-w-none text-sm" dangerouslySetInnerHTML={{ __html: markdownPreview(form.content) }} />
        ) : (
          <textarea value={form.content} onChange={(e) => update("content", e.target.value)} rows={20} className="w-full rounded-lg border border-white/15 bg-[#0D1222] px-3 py-3 text-sm text-white" />
        )}
      </article>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" disabled={saving} onClick={() => void save()} className="inline-flex items-center gap-2 rounded-lg border border-[#3B82F6]/50 bg-[#3B82F6]/20 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
          <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Post"}
        </button>
        <p className="text-xs text-slate-400">Autosave every 30s while editing, shortcut Ctrl+S.</p>
      </div>
    </div>
  );
}
