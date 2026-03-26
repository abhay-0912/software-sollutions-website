"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Download, Search } from "lucide-react";
import { getSupabaseBrowserAuthClient } from "@/lib/supabase-auth";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { LeadDrawer, statusBadgeClass, type Lead } from "@/components/admin/lead-drawer";
import { useAdminToast } from "@/components/admin/toast-provider";

const pageSize = 10;
type LeadStatus = "new" | "contacted" | "in_progress" | "closed" | "spam";

function toCSV(rows: Lead[]) {
  const headers = [
    "id",
    "name",
    "email",
    "phone",
    "company",
    "service_interest",
    "budget",
    "timeline",
    "status",
    "created_at",
    "message",
  ];

  const quote = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const body = rows.map((row) => headers.map((h) => quote((row as Record<string, unknown>)[h])).join(","));
  return [headers.join(","), ...body].join("\n");
}

export function AdminLeadsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | LeadStatus>("all");
  const [service, setService] = useState<"all" | string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [deleteLead, setDeleteLead] = useState<Lead | null>(null);
  const { pushToast } = useAdminToast();

  const services = useMemo(
    () => ["all", ...Array.from(new Set(allLeads.map((lead) => lead.service_interest).filter(Boolean)))],
    [allLeads],
  );

  useEffect(() => {
    const run = async () => {
      const supabase = getSupabaseBrowserAuthClient();
      if (!supabase) return;

      setLoading(true);
      const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });

      if (error) {
        pushToast("Unable to load leads", "error", true);
      }

      setAllLeads((data || []) as Lead[]);
      setLoading(false);
    };

    void run();
  }, [pushToast]);

  const filtered = useMemo(() => {
    return allLeads.filter((lead) => {
      const text = `${lead.name} ${lead.email} ${lead.company || ""} ${lead.message || ""}`.toLowerCase();
      const matchesText = query.trim() ? text.includes(query.trim().toLowerCase()) : true;
      const matchesStatus = status === "all" ? true : lead.status === status;
      const matchesService = service === "all" ? true : lead.service_interest === service;

      const date = new Date(lead.created_at).getTime();
      const from = dateFrom ? new Date(dateFrom).getTime() : 0;
      const to = dateTo ? new Date(`${dateTo}T23:59:59`).getTime() : Number.MAX_SAFE_INTEGER;
      const matchesDate = date >= from && date <= to;

      return matchesText && matchesStatus && matchesService && matchesDate;
    });
  }, [allLeads, dateFrom, dateTo, query, service, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const onStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    const supabase = getSupabaseBrowserAuthClient();
    if (!supabase) return;

    setSaving(true);

    setAllLeads((prev) => prev.map((lead) => (lead.id === leadId ? { ...lead, status: newStatus } : lead)));

    const { error } = await supabase.from("leads").update({ status: newStatus }).eq("id", leadId);

    setSaving(false);

    if (error) {
      pushToast("Status update failed", "error", true);
      const { data } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
      setAllLeads((data || []) as Lead[]);
      return;
    }

    pushToast("Lead status updated", "success");
    setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : prev));
  };

  const onDelete = async (lead: Lead) => {
    const supabase = getSupabaseBrowserAuthClient();
    if (!supabase) return;

    setSaving(true);
    const { error } = await supabase.from("leads").delete().eq("id", lead.id);
    setSaving(false);

    if (error) {
      pushToast("Delete failed", "error", true);
      return;
    }

    pushToast("Lead deleted", "success");
    setAllLeads((prev) => prev.filter((item) => item.id !== lead.id));
    setSelectedLead(null);
    setDeleteLead(null);
  };

  const onMarkSpam = async (lead: Lead) => {
    await onStatusChange(lead.id, "spam");
  };

  const onExport = () => {
    const blob = new Blob([toCSV(filtered)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", `leads-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    pushToast("CSV exported", "success");
  };

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-white/10 bg-[#111427]/75 p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <label className="xl:col-span-2">
            <span className="mb-1 block text-xs text-slate-400">Search</span>
            <span className="relative block">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="name, email, company..." className="w-full rounded-lg border border-white/15 bg-[#0D1222] py-2 pl-9 pr-3 text-sm text-white outline-none focus:border-[#3B82F6]" />
            </span>
          </label>

          <label>
            <span className="mb-1 block text-xs text-slate-400">Status</span>
            <select value={status} onChange={(e) => setStatus(e.target.value as "all" | LeadStatus)} className="w-full rounded-lg border border-white/15 bg-[#0D1222] px-3 py-2 text-sm text-white outline-none focus:border-[#3B82F6]">
              <option value="all">All</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed</option>
              <option value="spam">Spam</option>
            </select>
          </label>

          <label>
            <span className="mb-1 block text-xs text-slate-400">Service</span>
            <select value={service} onChange={(e) => setService(e.target.value)} className="w-full rounded-lg border border-white/15 bg-[#0D1222] px-3 py-2 text-sm text-white outline-none focus:border-[#3B82F6]">
              {services.map((svc) => (
                <option key={svc} value={svc}>{svc === "all" ? "All" : svc}</option>
              ))}
            </select>
          </label>

          <label>
            <span className="mb-1 block text-xs text-slate-400">From</span>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full rounded-lg border border-white/15 bg-[#0D1222] px-3 py-2 text-sm text-white outline-none focus:border-[#3B82F6]" />
          </label>

          <label>
            <span className="mb-1 block text-xs text-slate-400">To</span>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full rounded-lg border border-white/15 bg-[#0D1222] px-3 py-2 text-sm text-white outline-none focus:border-[#3B82F6]" />
          </label>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3 text-sm">
          <p className="text-slate-400">Showing {paginated.length} of {filtered.length} leads</p>
          <button type="button" onClick={onExport} className="inline-flex items-center gap-2 rounded-lg border border-[#3B82F6]/50 bg-[#3B82F6]/15 px-3 py-2 font-semibold text-[#C6DCFF]">
            <Download className="h-4 w-4" /> Export CSV
          </button>
        </div>
      </div>

      <article className="rounded-xl border border-white/10 bg-[#111427]/75 p-4">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 10 }).map((_, idx) => (
              <div key={idx} className="h-10 animate-pulse rounded bg-white/5" />
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <p className="rounded-lg border border-white/10 bg-white/[0.02] p-5 text-slate-300">
            No leads found with your current filters.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-400">
                <tr>
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Email</th>
                  <th className="pb-2">Service</th>
                  <th className="pb-2">Budget</th>
                  <th className="pb-2">Timeline</th>
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2" />
                </tr>
              </thead>
              <tbody>
                {paginated.map((lead, idx) => (
                  <motion.tr key={lead.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.025 }} className="border-t border-white/10">
                    <td className="py-2 text-white">{lead.name}</td>
                    <td className="py-2 text-slate-300">{lead.email}</td>
                    <td className="py-2 text-slate-200">{lead.service_interest}</td>
                    <td className="py-2 text-slate-200">{lead.budget}</td>
                    <td className="py-2 text-slate-200">{lead.timeline}</td>
                    <td className="py-2 text-slate-400">{new Date(lead.created_at).toLocaleDateString()}</td>
                    <td className="py-2">
                      <span className={`rounded-full border px-2 py-0.5 text-xs ${statusBadgeClass(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-2 text-right">
                      <button type="button" onClick={() => setSelectedLead(lead)} className="text-[#9CC1FF] hover:text-[#C6DCFF]">
                        View
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
          <p>Page {page} of {totalPages}</p>
          <div className="flex items-center gap-2">
            <button type="button" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="rounded-md border border-white/15 px-3 py-1 disabled:opacity-40">
              Prev
            </button>
            <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="rounded-md border border-white/15 px-3 py-1 disabled:opacity-40">
              Next
            </button>
          </div>
        </div>
      </article>

      <LeadDrawer
        open={Boolean(selectedLead)}
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onStatusChange={(leadId, newStatus) => void onStatusChange(leadId, newStatus as LeadStatus)}
        onMarkSpam={(leadId) => {
          const lead = allLeads.find((item) => item.id === leadId);
          if (lead) {
            void onMarkSpam(lead);
          }
        }}
        onDelete={(leadId) => {
          const lead = allLeads.find((item) => item.id === leadId);
          if (lead) {
            setDeleteLead(lead);
          }
        }}
      />

      <ConfirmDialog
        open={Boolean(deleteLead)}
        title="Delete lead permanently?"
        description="This cannot be undone and removes this lead from your CRM records."
        confirmLabel={saving ? "Deleting..." : "Delete"}
        busy={saving}
        onCancel={() => setDeleteLead(null)}
        onConfirm={() => {
          if (deleteLead) {
            void onDelete(deleteLead);
          }
        }}
      />
    </div>
  );
}
