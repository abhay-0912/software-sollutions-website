"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Plus, Star, Trash2 } from "lucide-react";
import { getSupabaseBrowserAuthClient } from "@/lib/supabase-auth";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useAdminToast } from "@/components/admin/toast-provider";

type Testimonial = {
  id: string;
  name: string;
  company: string;
  message: string;
  rating: number;
  avatar_url: string | null;
  visible: boolean | null;
};

type FormState = Omit<Testimonial, "id"> & { id?: string };

const emptyForm: FormState = {
  name: "",
  company: "",
  message: "",
  rating: 5,
  avatar_url: "",
  visible: true,
};

export function AdminTestimonialsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [items, setItems] = useState<Testimonial[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);
  const { pushToast } = useAdminToast();

  const fetchData = useCallback(async () => {
    const supabase = getSupabaseBrowserAuthClient();
    if (!supabase) return;

    setLoading(true);
    const { data, error } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
    if (error) pushToast("Failed to load testimonials", "error", true);
    setItems((data || []) as Testimonial[]);
    setLoading(false);
  }, [pushToast]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const onSave = async () => {
    if (!form.name.trim() || !form.message.trim()) {
      pushToast("Name and message are required", "error", true);
      return;
    }

    const supabase = getSupabaseBrowserAuthClient();
    if (!supabase) return;

    setSaving(true);
    const payload = {
      name: form.name,
      company: form.company || null,
      message: form.message,
      rating: Number(form.rating) || 5,
      avatar_url: form.avatar_url || null,
      visible: form.visible,
      updated_at: new Date().toISOString(),
    };

    const query = form.id
      ? supabase.from("testimonials").update(payload).eq("id", form.id)
      : supabase.from("testimonials").insert(payload);

    const { error } = await query;
    setSaving(false);

    if (error) {
      pushToast("Failed to save testimonial", "error", true);
      return;
    }

    setModalOpen(false);
    setForm(emptyForm);
    pushToast("Saved", "success");
    void fetchData();
  };

  const onToggleVisible = async (item: Testimonial, visible: boolean) => {
    const supabase = getSupabaseBrowserAuthClient();
    if (!supabase) return;

    setItems((prev) => prev.map((row) => (row.id === item.id ? { ...row, visible } : row)));
    const { error } = await supabase.from("testimonials").update({ visible }).eq("id", item.id);

    if (error) {
      pushToast("Update failed", "error", true);
      void fetchData();
      return;
    }

    pushToast("Visibility changed", "success");
  };

  const onDelete = async () => {
    if (!deleteTarget) return;

    const supabase = getSupabaseBrowserAuthClient();
    if (!supabase) return;

    setSaving(true);
    const { error } = await supabase.from("testimonials").delete().eq("id", deleteTarget.id);
    setSaving(false);

    if (error) {
      pushToast("Delete failed", "error", true);
      return;
    }

    setItems((prev) => prev.filter((item) => item.id !== deleteTarget.id));
    setDeleteTarget(null);
    pushToast("Deleted", "success");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#111427]/75 p-4">
        <p className="text-sm text-slate-300">Manage social proof cards for website sections.</p>
        <button
          type="button"
          onClick={() => {
            setForm(emptyForm);
            setModalOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg border border-[#3B82F6]/50 bg-[#3B82F6]/20 px-4 py-2 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" /> Add Testimonial
        </button>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="h-44 animate-pulse rounded-xl border border-white/10 bg-white/5" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="rounded-xl border border-white/10 bg-[#111427]/75 p-5 text-slate-300">No testimonials yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item, idx) => (
            <motion.article key={item.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }} className="rounded-xl border border-white/10 bg-[#111427]/75 p-4">
              <p className="line-clamp-3 text-sm text-slate-200">{item.message}</p>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">{item.name}</p>
                  <p className="text-xs text-slate-400">{item.company}</p>
                </div>
                <p className="inline-flex items-center gap-1 text-amber-300"><Star className="h-4 w-4" />{item.rating}/5</p>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-200">
                  <input type="checkbox" checked={Boolean(item.visible)} onChange={(e) => void onToggleVisible(item, e.target.checked)} />
                  Visible
                </label>
                <div className="inline-flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setForm({ ...item, avatar_url: item.avatar_url || "" });
                      setModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1 text-[#9CC1FF]"
                  >
                    <Pencil className="h-4 w-4" /> Edit
                  </button>
                  <button type="button" onClick={() => setDeleteTarget(item)} className="inline-flex items-center gap-1 text-red-300">
                    <Trash2 className="h-4 w-4" /> Delete
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      {modalOpen ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/65 p-4">
          <article className="w-full max-w-xl rounded-xl border border-white/10 bg-[#0F1426] p-5">
            <h2 className="text-lg font-semibold text-white">{form.id ? "Edit" : "New"} Testimonial</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <label>
                <span className="mb-1 block text-xs text-slate-400">Name</span>
                <input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} className="w-full rounded-lg border border-white/15 bg-[#0D1222] px-3 py-2 text-sm text-white" />
              </label>
              <label>
                <span className="mb-1 block text-xs text-slate-400">Company</span>
                <input value={form.company} onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))} className="w-full rounded-lg border border-white/15 bg-[#0D1222] px-3 py-2 text-sm text-white" />
              </label>
              <label>
                <span className="mb-1 block text-xs text-slate-400">Rating</span>
                <input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm((prev) => ({ ...prev, rating: Number(e.target.value) }))} className="w-full rounded-lg border border-white/15 bg-[#0D1222] px-3 py-2 text-sm text-white" />
              </label>
              <label>
                <span className="mb-1 block text-xs text-slate-400">Avatar URL</span>
                <input value={form.avatar_url || ""} onChange={(e) => setForm((prev) => ({ ...prev, avatar_url: e.target.value }))} className="w-full rounded-lg border border-white/15 bg-[#0D1222] px-3 py-2 text-sm text-white" />
              </label>
              <label className="md:col-span-2">
                <span className="mb-1 block text-xs text-slate-400">Message</span>
                <textarea rows={5} value={form.message} onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))} className="w-full rounded-lg border border-white/15 bg-[#0D1222] px-3 py-2 text-sm text-white" />
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-200">
                <input type="checkbox" checked={Boolean(form.visible)} onChange={(e) => setForm((prev) => ({ ...prev, visible: e.target.checked }))} />
                Visible on site
              </label>
            </div>
            <div className="mt-5 flex items-center justify-end gap-3">
              <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg border border-white/15 px-3 py-2 text-sm text-slate-200">Cancel</button>
              <button type="button" disabled={saving} onClick={() => void onSave()} className="rounded-lg border border-[#3B82F6]/50 bg-[#3B82F6]/20 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Saving..." : "Save"}</button>
            </div>
          </article>
        </div>
      ) : null}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete testimonial?"
        description="This action cannot be undone."
        confirmLabel={saving ? "Deleting..." : "Delete"}
        busy={saving}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => void onDelete()}
      />
    </div>
  );
}
