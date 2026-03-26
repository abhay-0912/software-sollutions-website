"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowserAuthClient } from "@/lib/supabase-auth";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { useAdminToast } from "@/components/admin/toast-provider";

type SettingsState = {
  site_name: string;
  contact_email: string;
  whatsapp_number: string;
  notifications_email: boolean;
  notifications_whatsapp: boolean;
};

const defaultState: SettingsState = {
  site_name: "abaay.tech",
  contact_email: "",
  whatsapp_number: "",
  notifications_email: true,
  notifications_whatsapp: false,
};

export function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dangerOpen, setDangerOpen] = useState(false);
  const [state, setState] = useState<SettingsState>(defaultState);
  const { pushToast } = useAdminToast();

  useEffect(() => {
    const run = async () => {
      const supabase = getSupabaseBrowserAuthClient();
      if (!supabase) return;

      setLoading(true);
      const { data } = await supabase.from("site_settings").select("key,value");
      const next = { ...defaultState };

      (data || []).forEach((item: { key: string; value: unknown }) => {
        if (item.key in next) {
          (next as Record<string, unknown>)[item.key] = item.value;
        }
      });

      setState(next);
      setLoading(false);
    };

    void run();
  }, []);

  const save = async () => {
    const supabase = getSupabaseBrowserAuthClient();
    if (!supabase) return;

    setSaving(true);

    const payload = Object.entries(state).map(([key, value]) => ({ key, value }));
    const { error } = await supabase.from("site_settings").upsert(payload, { onConflict: "key" });

    setSaving(false);

    if (error) {
      pushToast("Failed to save settings", "error", true);
      return;
    }

    pushToast("Settings saved", "success");
  };

  const clearSpam = async () => {
    const supabase = getSupabaseBrowserAuthClient();
    if (!supabase) return;

    setSaving(true);
    const { error } = await supabase.from("leads").delete().eq("status", "spam");
    setSaving(false);

    if (error) {
      pushToast("Could not clear spam leads", "error", true);
      return;
    }

    pushToast("Spam leads deleted", "success");
    setDangerOpen(false);
  };

  if (loading) {
    return <div className="h-40 animate-pulse rounded-xl border border-white/10 bg-white/5" />;
  }

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-white/10 bg-[#111427]/75 p-4">
        <h2 className="text-lg font-semibold text-white">Site Profile</h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <label>
            <span className="mb-1 block text-xs text-slate-400">Site Name</span>
            <input value={state.site_name} onChange={(e) => setState((prev) => ({ ...prev, site_name: e.target.value }))} className="w-full rounded-lg border border-white/15 bg-[#0D1222] px-3 py-2 text-sm text-white" />
          </label>
          <label>
            <span className="mb-1 block text-xs text-slate-400">Contact Email</span>
            <input value={state.contact_email} onChange={(e) => setState((prev) => ({ ...prev, contact_email: e.target.value }))} className="w-full rounded-lg border border-white/15 bg-[#0D1222] px-3 py-2 text-sm text-white" />
          </label>
          <label>
            <span className="mb-1 block text-xs text-slate-400">WhatsApp Number</span>
            <input value={state.whatsapp_number} onChange={(e) => setState((prev) => ({ ...prev, whatsapp_number: e.target.value }))} className="w-full rounded-lg border border-white/15 bg-[#0D1222] px-3 py-2 text-sm text-white" />
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-[#111427]/75 p-4">
        <h2 className="text-lg font-semibold text-white">Notifications</h2>
        <div className="mt-3 space-y-2 text-sm text-slate-200">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={state.notifications_email} onChange={(e) => setState((prev) => ({ ...prev, notifications_email: e.target.checked }))} />
            Email me for new leads
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={state.notifications_whatsapp} onChange={(e) => setState((prev) => ({ ...prev, notifications_whatsapp: e.target.checked }))} />
            WhatsApp alerts for priority leads
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-red-400/30 bg-red-500/5 p-4">
        <h2 className="text-lg font-semibold text-red-100">Danger Zone</h2>
        <p className="mt-1 text-sm text-red-100/80">Remove all leads marked as spam.</p>
        <button type="button" onClick={() => setDangerOpen(true)} className="mt-3 rounded-lg border border-red-300/50 px-3 py-2 text-sm font-semibold text-red-100">
          Delete Spam Leads
        </button>
      </section>

      <div className="flex items-center gap-3">
        <button type="button" disabled={saving} onClick={() => void save()} className="rounded-lg border border-[#3B82F6]/50 bg-[#3B82F6]/20 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      <ConfirmDialog
        open={dangerOpen}
        title="Delete all spam leads?"
        description="This will permanently remove every lead with spam status."
        confirmLabel={saving ? "Deleting..." : "Delete Spam Leads"}
        busy={saving}
        onCancel={() => setDangerOpen(false)}
        onConfirm={() => void clearSpam()}
      />
    </div>
  );
}
