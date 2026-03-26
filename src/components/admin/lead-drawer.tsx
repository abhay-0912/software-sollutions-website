"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service_interest: string;
  budget: string;
  timeline: string;
  message: string;
  referral_source: string | null;
  status: string;
  created_at: string;
};

type LeadDrawerProps = {
  open: boolean;
  lead: Lead | null;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
  onMarkSpam: (id: string) => void;
  onDelete: (id: string) => void;
};

const statusOptions = ["new", "contacted", "in_progress", "closed", "spam"];

export function statusBadgeClass(status: string) {
  if (status === "new") return "border-[#3B82F6]/45 bg-[#3B82F6]/15 text-[#C6DCFF]";
  if (status === "contacted") return "border-amber-300/45 bg-amber-300/15 text-amber-100";
  if (status === "in_progress") return "border-violet-300/45 bg-violet-300/15 text-violet-100";
  if (status === "closed") return "border-emerald-300/45 bg-emerald-300/15 text-emerald-100";
  return "border-red-300/45 bg-red-300/15 text-red-100";
}

export function LeadDrawer({ open, lead, onClose, onStatusChange, onMarkSpam, onDelete }: LeadDrawerProps) {
  return (
    <AnimatePresence>
      {open && lead ? (
        <>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[90] bg-black/55"
            aria-label="Close lead drawer"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 240, damping: 26 }}
            className="fixed right-0 top-0 z-[91] h-screen w-full max-w-[480px] overflow-y-auto border-l border-white/10 bg-[#101324] p-5"
          >
            <div className="mb-5 flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-white">{lead.name}</h3>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`rounded-full border px-2.5 py-1 text-xs ${statusBadgeClass(lead.status)}`}>
                    {lead.status}
                  </span>
                  <select
                    value={lead.status}
                    onChange={(event) => onStatusChange(lead.id, event.target.value)}
                    className="rounded-md border border-white/15 bg-[#0D0F1A] px-2 py-1 text-xs text-slate-200"
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button type="button" onClick={onClose} className="rounded-md border border-white/15 p-2 text-slate-300">
                <X className="h-4 w-4" />
              </button>
            </div>

            <section className="space-y-4">
              <article className="rounded-xl border border-white/10 bg-[#111427]/75 p-4">
                <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Contact Info</h4>
                <div className="mt-3 space-y-2 text-sm">
                  <p>
                    <span className="text-slate-400">Email:</span>{" "}
                    <a href={`mailto:${lead.email}`} className="text-[#9CC1FF]">{lead.email}</a>
                  </p>
                  <p>
                    <span className="text-slate-400">Phone:</span>{" "}
                    {lead.phone ? <a href={`tel:${lead.phone}`} className="text-[#9CC1FF]">{lead.phone}</a> : "Not provided"}
                  </p>
                  <p><span className="text-slate-400">Company:</span> {lead.company || "Not provided"}</p>
                </div>
              </article>

              <article className="rounded-xl border border-white/10 bg-[#111427]/75 p-4">
                <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Project Details</h4>
                <div className="mt-3 space-y-2 text-sm text-slate-200">
                  <p><span className="text-slate-400">Service:</span> {lead.service_interest}</p>
                  <p><span className="text-slate-400">Budget:</span> {lead.budget}</p>
                  <p><span className="text-slate-400">Timeline:</span> {lead.timeline}</p>
                  <p><span className="text-slate-400">Referral:</span> {lead.referral_source || "Not provided"}</p>
                  <div>
                    <p className="text-slate-400">Message:</p>
                    <div className="mt-1 max-h-40 overflow-y-auto rounded-md border border-white/10 bg-[#0D0F1A] p-3 text-sm text-slate-200">
                      {lead.message}
                    </div>
                  </div>
                </div>
              </article>

              <article className="rounded-xl border border-white/10 bg-[#111427]/75 p-4 text-sm text-slate-300">
                <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Meta</h4>
                <p className="mt-2">Submitted: {new Date(lead.created_at).toLocaleString()}</p>
                <p className="mt-1 break-all font-mono text-xs text-slate-400">Lead ID: {lead.id}</p>
              </article>
            </section>

            <div className="mt-6 space-y-2">
              <a
                href={`mailto:${lead.email}?subject=${encodeURIComponent(`Re: ${lead.service_interest}`)}`}
                className="inline-flex w-full items-center justify-center rounded-lg border border-[#3B82F6]/60 bg-[#3B82F6]/20 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Reply via Email
              </a>
              <Link
                href={`https://wa.me/?text=${encodeURIComponent(`Hi ${lead.name}, thanks for contacting Abaay Tech.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center rounded-lg border border-white/20 px-4 py-2.5 text-sm font-semibold text-slate-100"
              >
                Open WhatsApp
              </Link>
              <button
                type="button"
                onClick={() => onMarkSpam(lead.id)}
                className="inline-flex w-full items-center justify-center rounded-lg border border-red-300/40 bg-red-400/15 px-4 py-2.5 text-sm font-semibold text-red-100"
              >
                Mark as Spam
              </button>
              <button
                type="button"
                onClick={() => onDelete(lead.id)}
                className="inline-flex w-full items-center justify-center rounded-lg border border-red-400/50 bg-red-500 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Delete Lead
              </button>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
