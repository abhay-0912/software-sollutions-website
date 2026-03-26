"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { getSupabaseBrowserAuthClient } from "@/lib/supabase-auth";

export function AdminLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const supabase = getSupabaseBrowserAuthClient();

    if (!supabase) {
      setError("Supabase environment is missing.");
      return;
    }

    setIsLoading(true);
    setError("");

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (signInError) {
      setError("Invalid credentials. Try again.");
      return;
    }

    const nextPath = searchParams.get("next") || "/admin/dashboard";
    router.push(nextPath);
    router.refresh();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0D0F1A] px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111427]/80 p-7"
      >
        <div className="mb-7 text-center">
          <p className="text-3xl font-bold text-white">
            abaay<span className="text-[#3B82F6]">.tech</span>
          </p>
          <p className="mt-1 text-sm text-slate-400">admin</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block space-y-2">
            <span className="text-sm text-slate-300">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-white/15 bg-[#0D0F1A] px-4 py-2.5 text-white"
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm text-slate-300">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-white/15 bg-[#0D0F1A] px-4 py-2.5 text-white"
              required
            />
          </label>

          {error ? (
            <p className="rounded-lg border border-red-300/50 bg-red-500/15 px-3 py-2 text-sm text-red-100">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center rounded-lg border border-[#3B82F6]/80 bg-[#3B82F6] px-4 py-3 font-semibold text-white transition hover:bg-[#60A5FA] disabled:opacity-70"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-slate-500">
          Internal access only. <Link href="/" className="text-slate-400 hover:text-white">Back to site</Link>
        </p>
      </motion.div>
    </main>
  );
}
