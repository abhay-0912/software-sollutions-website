"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Bell,
  Briefcase,
  FileText,
  Inbox,
  LayoutDashboard,
  Menu,
  MessageSquareText,
  Settings,
  Star,
  X,
  LogOut,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserAuthClient } from "@/lib/supabase-auth";
import { ToastProvider } from "@/components/admin/toast-provider";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Leads", href: "/admin/leads", icon: Inbox },
  { label: "Projects", href: "/admin/projects", icon: Briefcase },
  { label: "Blog Posts", href: "/admin/blog", icon: FileText },
  { label: "Testimonials", href: "/admin/testimonials", icon: Star },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

const titleMap: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/leads": "Leads",
  "/admin/projects": "Projects",
  "/admin/blog": "Blog Posts",
  "/admin/testimonials": "Testimonials",
  "/admin/settings": "Settings",
};

function ShellContent({ children, email }: { children: React.ReactNode; email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [leadBadge, setLeadBadge] = useState(0);

  const title = useMemo(() => {
    if (pathname.startsWith("/admin/projects/new")) return "New Project";
    if (pathname.includes("/admin/projects/") && pathname.endsWith("/edit")) return "Edit Project";
    if (pathname.startsWith("/admin/blog/new")) return "New Blog Post";
    if (pathname.includes("/admin/blog/") && pathname.endsWith("/edit")) return "Edit Blog Post";
    return titleMap[pathname] || "Admin";
  }, [pathname]);

  useEffect(() => {
    const supabase = getSupabaseBrowserAuthClient();
    if (!supabase) return;

    const fetchCount = async () => {
      const { count } = await supabase
        .from("leads")
        .select("id", { count: "exact", head: true })
        .eq("status", "new");
      setLeadBadge(count || 0);
    };

    void fetchCount();
  }, [pathname]);

  const handleSignOut = async () => {
    const supabase = getSupabaseBrowserAuthClient();
    if (!supabase) return;

    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#0D0F1A] text-white">
      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-[240px] border-r border-white/10 bg-[#101324] p-4 transition lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8">
          <p className="text-2xl font-bold text-white">
            abaay<span className="text-[#3B82F6]">.tech</span>
          </p>
          <p className="text-xs text-slate-400">Admin Panel</p>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-[#3B82F6]/20 text-white"
                    : "text-slate-300 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-5 left-4 right-4 border-t border-white/10 pt-4">
          <p className="truncate text-xs text-slate-500">{email}</p>
          <button
            type="button"
            onClick={handleSignOut}
            className="mt-2 inline-flex items-center gap-1 text-sm text-red-300 hover:text-red-200"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/45 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close sidebar"
        />
      ) : null}

      <div className="lg:pl-[240px]">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0D0F1A]/90 backdrop-blur">
          <div className="flex items-center justify-between px-5 py-4 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-md border border-white/15 p-2 text-slate-200 lg:hidden"
                onClick={() => setMobileOpen((prev) => !prev)}
              >
                {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
              <h1 className="text-2xl font-bold text-white">{title}</h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative rounded-full border border-white/10 bg-white/[0.02] p-2">
                <Bell className="h-4 w-4 text-slate-200" />
                {leadBadge > 0 ? (
                  <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-[#3B82F6] px-1 text-center text-[10px] font-semibold text-white">
                    {leadBadge}
                  </span>
                ) : null}
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#3B82F6]/45 bg-[#3B82F6]/15 text-sm font-semibold text-[#C6DCFF]">
                {email.slice(0, 2).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-5 py-6 lg:px-8"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}

export function AdminShell({ children, email }: { children: React.ReactNode; email: string }) {
  return (
    <ToastProvider>
      <ShellContent email={email}>{children}</ShellContent>
    </ToastProvider>
  );
}
