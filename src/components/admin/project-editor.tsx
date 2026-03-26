"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Upload } from "lucide-react";
import { getSupabaseBrowserAuthClient } from "@/lib/supabase-auth";
import { useAdminToast } from "@/components/admin/toast-provider";

type ProjectForm = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  long_description: string;
  challenge: string;
  solution: string;
  results: string;
  category: string;
  client_name: string;
  industry: string;
  timeline: string;
  team_size: string;
  live_url: string;
  github_url: string;
  cover_image: string;
  tech_stack: string;
  featured: boolean;
  published: boolean;
};

const emptyForm: ProjectForm = {
  title: "",
  slug: "",
  description: "",
  long_description: "",
  challenge: "",
  solution: "",
  results: "",
  category: "Web Apps",
  client_name: "",
  industry: "",
  timeline: "",
  team_size: "",
  live_url: "",
  github_url: "",
  cover_image: "",
  tech_stack: "",
  featured: false,
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

export function ProjectEditor({ initialData, isEdit }: { initialData?: Partial<ProjectForm>; isEdit: boolean }) {
  const [form, setForm] = useState<ProjectForm>({ ...emptyForm, ...initialData });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dirty, setDirty] = useState(false);
  const router = useRouter();
  const { pushToast } = useAdminToast();

  useEffect(() => {
    if (!form.slug && form.title.trim()) {
      setForm((prev) => ({ ...prev, slug: slugify(prev.title) }));
    }
  }, [form.slug, form.title]);

  const update = <K extends keyof ProjectForm>(key: K, value: ProjectForm[K]) => {
    setDirty(true);
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const payload = useMemo(
    () => ({
      title: form.title,
      slug: form.slug,
      description: form.description,
      long_description: form.long_description || null,
      challenge: form.challenge || null,
      solution: form.solution || null,
      results: form.results || null,
      category: form.category,
      client_name: form.client_name || null,
      industry: form.industry || null,
      timeline: form.timeline || null,
      team_size: form.team_size || null,
      live_url: form.live_url || null,
      github_url: form.github_url || null,
      cover_image: form.cover_image || null,
      tech_stack: form.tech_stack
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      featured: form.featured,
      published: form.published,
      updated_at: new Date().toISOString(),
    }),
    [form],
  );

  const save = useCallback(async () => {
    if (!form.title.trim() || !form.description.trim()) {
      pushToast("Title and short description are required", "error", true);
      return;
    }

    const supabase = getSupabaseBrowserAuthClient();
    if (!supabase) return;

    setSaving(true);

    const query = isEdit && form.id
      ? supabase.from("projects").update(payload).eq("id", form.id)
      : supabase.from("projects").insert(payload);

    const { error } = await query;
    setSaving(false);

    if (error) {
      pushToast(error.message || "Failed to save project", "error", true);
      return;
    }

    setDirty(false);
    pushToast(isEdit ? "Project updated" : "Project created", "success");

    if (!isEdit) {
      router.push("/admin/projects");
      router.refresh();
    }
  }, [form.description, form.id, form.title, isEdit, payload, pushToast, router]);

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
    }, 45000);

    return () => window.clearTimeout(timer);
  }, [dirty, save]);

  const onUpload = async (file: File) => {
    const supabase = getSupabaseBrowserAuthClient();
    if (!supabase) return;

    setUploading(true);
    const path = `projects/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const { error } = await supabase.storage.from("admin-media").upload(path, file, { upsert: true });

    if (error) {
      pushToast("Upload failed. Ensure bucket 'admin-media' exists.", "error", true);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("admin-media").getPublicUrl(path);
    update("cover_image", data.publicUrl);
    setUploading(false);
    pushToast("Image uploaded", "success");
  };

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
            <span className="mb-1 block text-xs text-slate-400">Short Description</span>
            <textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={2} className="w-full rounded-lg border border-white/15 bg-[#0D1222] px-3 py-2 text-sm text-white" />
          </label>

          <label className="md:col-span-2">
            <span className="mb-1 block text-xs text-slate-400">Long Description</span>
            <textarea value={form.long_description} onChange={(e) => update("long_description", e.target.value)} rows={4} className="w-full rounded-lg border border-white/15 bg-[#0D1222] px-3 py-2 text-sm text-white" />
          </label>

          <label>
            <span className="mb-1 block text-xs text-slate-400">Category</span>
            <select value={form.category} onChange={(e) => update("category", e.target.value)} className="w-full rounded-lg border border-white/15 bg-[#0D1222] px-3 py-2 text-sm text-white">
              <option>Web Apps</option>
              <option>ERP / CRM</option>
              <option>Automation</option>
              <option>SaaS</option>
            </select>
          </label>

          <label>
            <span className="mb-1 block text-xs text-slate-400">Tech Stack (comma separated)</span>
            <input value={form.tech_stack} onChange={(e) => update("tech_stack", e.target.value)} className="w-full rounded-lg border border-white/15 bg-[#0D1222] px-3 py-2 text-sm text-white" />
          </label>

          <label>
            <span className="mb-1 block text-xs text-slate-400">Client</span>
            <input value={form.client_name} onChange={(e) => update("client_name", e.target.value)} className="w-full rounded-lg border border-white/15 bg-[#0D1222] px-3 py-2 text-sm text-white" />
          </label>

          <label>
            <span className="mb-1 block text-xs text-slate-400">Industry</span>
            <input value={form.industry} onChange={(e) => update("industry", e.target.value)} className="w-full rounded-lg border border-white/15 bg-[#0D1222] px-3 py-2 text-sm text-white" />
          </label>

          <label>
            <span className="mb-1 block text-xs text-slate-400">Timeline</span>
            <input value={form.timeline} onChange={(e) => update("timeline", e.target.value)} className="w-full rounded-lg border border-white/15 bg-[#0D1222] px-3 py-2 text-sm text-white" />
          </label>

          <label>
            <span className="mb-1 block text-xs text-slate-400">Team Size</span>
            <input value={form.team_size} onChange={(e) => update("team_size", e.target.value)} className="w-full rounded-lg border border-white/15 bg-[#0D1222] px-3 py-2 text-sm text-white" />
          </label>

          <label>
            <span className="mb-1 block text-xs text-slate-400">Live URL</span>
            <input value={form.live_url} onChange={(e) => update("live_url", e.target.value)} className="w-full rounded-lg border border-white/15 bg-[#0D1222] px-3 py-2 text-sm text-white" />
          </label>

          <label>
            <span className="mb-1 block text-xs text-slate-400">GitHub URL</span>
            <input value={form.github_url} onChange={(e) => update("github_url", e.target.value)} className="w-full rounded-lg border border-white/15 bg-[#0D1222] px-3 py-2 text-sm text-white" />
          </label>

          <label className="md:col-span-2">
            <span className="mb-1 block text-xs text-slate-400">Cover Image URL</span>
            <input value={form.cover_image} onChange={(e) => update("cover_image", e.target.value)} className="w-full rounded-lg border border-white/15 bg-[#0D1222] px-3 py-2 text-sm text-white" />
          </label>

          <label className="md:col-span-2">
            <span className="mb-1 block text-xs text-slate-400">Upload Cover Image</span>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm text-slate-200">
              <Upload className="h-4 w-4" />
              {uploading ? "Uploading..." : "Choose image"}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    void onUpload(file);
                  }
                }}
              />
            </label>
          </label>

          <label className="md:col-span-2">
            <span className="mb-1 block text-xs text-slate-400">Challenge</span>
            <textarea value={form.challenge} onChange={(e) => update("challenge", e.target.value)} rows={3} className="w-full rounded-lg border border-white/15 bg-[#0D1222] px-3 py-2 text-sm text-white" />
          </label>

          <label className="md:col-span-2">
            <span className="mb-1 block text-xs text-slate-400">Solution</span>
            <textarea value={form.solution} onChange={(e) => update("solution", e.target.value)} rows={3} className="w-full rounded-lg border border-white/15 bg-[#0D1222] px-3 py-2 text-sm text-white" />
          </label>

          <label className="md:col-span-2">
            <span className="mb-1 block text-xs text-slate-400">Results</span>
            <textarea value={form.results} onChange={(e) => update("results", e.target.value)} rows={3} className="w-full rounded-lg border border-white/15 bg-[#0D1222] px-3 py-2 text-sm text-white" />
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-200">
            <input type="checkbox" checked={form.featured} onChange={(e) => update("featured", e.target.checked)} />
            Featured project
          </label>

          <label className="flex items-center gap-2 text-sm text-slate-200">
            <input type="checkbox" checked={form.published} onChange={(e) => update("published", e.target.checked)} />
            Published
          </label>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" disabled={saving} onClick={() => void save()} className="inline-flex items-center gap-2 rounded-lg border border-[#3B82F6]/50 bg-[#3B82F6]/20 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
          <Save className="h-4 w-4" /> {saving ? "Saving..." : "Save Project"}
        </button>
        <p className="text-xs text-slate-400">Shortcut: Ctrl+S</p>
      </div>
    </div>
  );
}
