import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { getSupabaseServerAuthClient } from "@/lib/supabase-auth-server";

export const metadata: Metadata = {
  title: "Abaay Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = getSupabaseServerAuthClient();

  if (!supabase) {
    return <>{children}</>;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <>{children}</>;
  }

  return <AdminShell email={user.email || "absrivastava999@gmail.com"}>{children}</AdminShell>;
}
