"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, FileText, Inbox, Star } from "lucide-react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { getSupabaseBrowserAuthClient } from "@/lib/supabase-auth";
import { LeadDrawer, statusBadgeClass, type Lead } from "@/components/admin/lead-drawer";
import { useAdminToast } from "@/components/admin/toast-provider";

type ServiceCount = { name: string; value: number };
type DailyLead = { date: string; count: number };

const pieColors = ["#3B82F6", "#22D3EE", "#A78BFA", "#34D399", "#F59E0B", "#F87171"];

export function AdminDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [serviceData, setServiceData] = useState<ServiceCount[]>([]);
  const [dailyData, setDailyData] = useState<DailyLead[]>([]);
  const [projectsCount, setProjectsCount] = useState(0);
  const [blogCount, setBlogCount] = useState(0);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const { pushToast } = useAdminToast();

  useEffect(() => {
    const run = async () => {
      const supabase = getSupabaseBrowserAuthClient();
      if (!supabase) return;

      setLoading(true);

      const [
        leadsResp,
        leadsCountResp,
        projectsResp,
        blogResp,
      ] = await Promise.all([
        supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(200),
        supabase.from("leads").select("id", { count: "exact", head: true }),
        supabase.from("projects").select("id", { count: "exact", head: true }).eq("published", true),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }).eq("published", true),
      ]);

      const allLeads = (leadsResp.data || []) as Lead[];
      setLeads(allLeads.slice(0, 5));
      setProjectsCount(projectsResp.count || 0);
      setBlogCount(blogResp.count || 0);

      const byService = new Map<string, number>();
      const byDay = new Map<string, number>();

      const start = new Date();
      start.setDate(start.getDate() - 29);

      for (let i = 0; i < 30; i += 1) {
        const day = new Date(start);
        day.setDate(start.getDate() + i);
        byDay.set(day.toISOString().slice(0, 10), 0);
      }

      allLeads.forEach((lead) => {
        byService.set(lead.service_interest, (byService.get(lead.service_interest) || 0) + 1);
        const dayKey = new Date(lead.created_at).toISOString().slice(0, 10);
        if (byDay.has(dayKey)) {
          byDay.set(dayKey, (byDay.get(dayKey) || 0) + 1);
        }
      });

      setServiceData(Array.from(byService.entries()).map(([name, value]) => ({ name, value })));
      setDailyData(
        Array.from(byDay.entries()).map(([date, count]) => ({
          date: date.slice(5),
          count,
        })),
      );

      setLoading(false);

      if (leadsCountResp.error) {
        pushToast("Failed to load dashboard counts", "error", true);
      }
    };

    void run();
  }, [pushToast]);

  const totalLeads = useMemo(() => dailyData.reduce((sum, item) => sum + item.count, 0), [dailyData]);
  const thisWeekLeads = useMemo(() => dailyData.slice(-7).reduce((sum, item) => sum + item.count, 0), [dailyData]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { title: "Total Leads", value: totalLeads, sub: "vs last month", icon: <Inbox className="h-5 w-5" />, color: "text-[#9CC1FF]" },
          { title: "New Leads", value: thisWeekLeads, sub: "since Monday", icon: <Star className="h-5 w-5" />, color: "text-emerald-300" },
          { title: "Projects Published", value: projectsCount, sub: "in portfolio", icon: <Briefcase className="h-5 w-5" />, color: "text-violet-300" },
          { title: "Blog Posts", value: blogCount, sub: "published", icon: <FileText className="h-5 w-5" />, color: "text-amber-300" },
        ].map((card) => (
          <motion.article key={card.title} className="rounded-xl border border-white/10 bg-[#111427]/75 p-5" whileHover={{ y: -2 }}>
            <div className="flex items-start justify-between">
              <p className="text-sm text-slate-400">{card.title}</p>
              <span className={card.color}>{card.icon}</span>
            </div>
            <p className="mt-3 text-3xl font-bold text-white">{card.value}</p>
            <p className="mt-1 text-xs text-slate-500">{card.sub}</p>
          </motion.article>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <article className="rounded-xl border border-white/10 bg-[#111427]/75 p-5">
          <h2 className="text-lg font-semibold text-white">Leads Over Time</h2>
          <div className="mt-4 h-[280px]">
            {loading ? (
              <div className="h-full animate-pulse rounded-lg bg-white/5" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyData}>
                  <CartesianGrid stroke="#223" strokeDasharray="3 3" />
                  <XAxis dataKey="date" stroke="#8EA1C8" />
                  <YAxis stroke="#8EA1C8" />
                  <Tooltip
                    contentStyle={{ background: "#0F1426", border: "1px solid #2A3555", borderRadius: 8 }}
                  />
                  <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </article>

        <article className="rounded-xl border border-white/10 bg-[#111427]/75 p-5">
          <h2 className="text-lg font-semibold text-white">Leads by Service</h2>
          <div className="mt-4 h-[280px]">
            {loading ? (
              <div className="h-full animate-pulse rounded-lg bg-white/5" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={serviceData} dataKey="value" nameKey="name" innerRadius={58} outerRadius={92} label>
                    {serviceData.map((entry, index) => (
                      <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip
                    contentStyle={{ background: "#0F1426", border: "1px solid #2A3555", borderRadius: 8 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </article>
      </div>

      <article className="rounded-xl border border-white/10 bg-[#111427]/75 p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Latest Leads</h2>
          <Link href="/admin/leads" className="text-sm font-semibold text-[#9CC1FF]">View all →</Link>
        </div>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div key={idx} className="h-11 animate-pulse rounded bg-white/5" />
            ))}
          </div>
        ) : leads.length === 0 ? (
          <p className="rounded-lg border border-white/10 bg-white/[0.02] p-5 text-slate-300">
            No leads yet. Share your contact page to start getting enquiries.
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
                  <th className="pb-2">Date</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2" />
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, idx) => (
                  <motion.tr key={lead.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.04 }} className="border-t border-white/10">
                    <td className="py-2 text-white">{lead.name}</td>
                    <td className="py-2 text-slate-300">{lead.email}</td>
                    <td className="py-2 text-slate-200">{lead.service_interest}</td>
                    <td className="py-2 text-slate-200">{lead.budget}</td>
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
      </article>

      <div className="flex flex-wrap gap-3">
        <Link href="/admin/blog/new" className="rounded-lg border border-[#3B82F6]/60 bg-[#3B82F6]/20 px-4 py-2 text-sm font-semibold text-white">
          + New Blog Post
        </Link>
        <Link href="/admin/projects/new" className="rounded-lg border border-[#3B82F6]/60 bg-[#3B82F6]/20 px-4 py-2 text-sm font-semibold text-white">
          + New Project
        </Link>
        <Link href="/contact" target="_blank" rel="noopener noreferrer" className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-slate-100">
          View Contact Form
        </Link>
      </div>

      <LeadDrawer
        open={Boolean(selectedLead)}
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
        onStatusChange={() => {}}
        onMarkSpam={() => {}}
        onDelete={() => {}}
      />
    </div>
  );
}
