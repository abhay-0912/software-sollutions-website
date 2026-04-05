"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import {
  blogCategoryFilters,
  blurDataUrl,
  categoryBadgeClass,
  estimateReadTime,
  fallbackBlogPosts,
  formatPostDate,
  getPrimaryCategory,
  type BlogCategoryFilter,
  type BlogPost,
} from "@/lib/blog";
import { BlogFooter, BlogNavbar } from "@/components/blog/blog-shell";

const PAGE_SIZE = 6;

function normalizePosts(posts: BlogPost[]) {
  return (posts.length ? posts : fallbackBlogPosts).filter((post) => post.published !== false);
}

export function BlogListingPage({ posts }: { posts: BlogPost[] }) {
  const [query, setQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<BlogCategoryFilter[]>(["All"]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loadingMore, setLoadingMore] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterState, setNewsletterState] = useState<"idle" | "success" | "error" | "loading">("idle");

  const allPosts = useMemo(() => normalizePosts(posts), [posts]);

  const featuredPost = useMemo(() => {
    const featured = allPosts
      .filter((post) => post.featured)
      .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())[0];
    return featured || null;
  }, [allPosts]);

  const countByFilter = useMemo(() => {
    const map = new Map<BlogCategoryFilter, number>();
    blogCategoryFilters.forEach((filter) => {
      if (filter === "All") {
        map.set(filter, allPosts.length);
      } else {
        map.set(
          filter,
          allPosts.filter((post) => (post.tags || []).includes(filter)).length,
        );
      }
    });
    return map;
  }, [allPosts]);

  const filteredPosts = useMemo(() => {
    const text = query.trim().toLowerCase();
    const enabledFilters = activeFilters.includes("All")
      ? blogCategoryFilters.filter((item) => item !== "All")
      : activeFilters;

    return allPosts.filter((post) => {
      const haystack = `${post.title} ${post.excerpt} ${(post.tags || []).join(" ")}`.toLowerCase();
      const matchesQuery = text ? haystack.includes(text) : true;
      const matchesFilter =
        activeFilters.includes("All") ||
        enabledFilters.some((filter) => (post.tags || []).includes(filter));
      return matchesQuery && matchesFilter;
    });
  }, [activeFilters, allPosts, query]);

  const visiblePosts = filteredPosts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredPosts.length;

  const toggleFilter = (filter: BlogCategoryFilter) => {
    if (filter === "All") {
      setActiveFilters(["All"]);
      setVisibleCount(PAGE_SIZE);
      return;
    }

    setActiveFilters((prev) => {
      const withoutAll = prev.filter((item) => item !== "All");
      if (withoutAll.includes(filter)) {
        const next = withoutAll.filter((item) => item !== filter);
        return next.length ? next : ["All"];
      }
      return [...withoutAll, filter];
    });

    setVisibleCount(PAGE_SIZE);
  };

  const loadMore = async () => {
    setLoadingMore(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setVisibleCount((prev) => prev + PAGE_SIZE);
    setLoadingMore(false);
  };

  const subscribe = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsletterEmail.trim())) {
      setNewsletterState("error");
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setNewsletterState("error");
      return;
    }

    setNewsletterState("loading");
    const { error } = await supabase.from("newsletter_subscribers").insert({
      email: newsletterEmail.trim().toLowerCase(),
    });

    if (error) {
      setNewsletterState("error");
      return;
    }

    setNewsletterState("success");
    setNewsletterEmail("");
  };

  return (
    <div className="min-h-screen bg-[#0D0F1A] text-white">
      <BlogNavbar />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 pb-20 pt-10 lg:px-10">
        <section className="space-y-4">
          <p className="text-sm text-slate-300">
            <Link href="/" className="hover:text-white">Home</Link> → Blog
          </p>
          <span className="inline-flex items-center rounded-full border border-[#3B82F6]/40 bg-[#3B82F6]/10 px-4 py-1.5 text-sm font-medium text-[#9CC1FF]">
            📝 Insights & tutorials
          </span>
          <h1 className="text-4xl font-bold sm:text-5xl">The Abaay Tech Blog</h1>
          <p className="max-w-3xl text-slate-300">
            Practical articles on web development, ERP systems, automation, and running a software business - written by the people who build it daily.
          </p>

          <div className="relative max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
              placeholder="Search articles..."
              className="w-full rounded-xl border border-white/15 bg-[#111427] py-3 pl-10 pr-10 text-sm text-white outline-none focus:border-[#3B82F6]"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-3 rounded text-slate-400 hover:text-white"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </section>

        {featuredPost ? (
          <motion.article
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            className="grid overflow-hidden rounded-2xl border border-[#3B82F6]/30 bg-[#111427] shadow-[0_0_30px_rgba(59,130,246,0.2)] lg:grid-cols-[1.2fr_1fr]"
          >
            <div className="relative min-h-[280px]">
              <Image
                src={featuredPost.cover_image || "/og-abaay.svg"}
                alt={featuredPost.title}
                fill
                placeholder="blur"
                blurDataURL={blurDataUrl}
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
            </div>
            <div className="space-y-4 p-6">
              <span className={`inline-flex rounded-full border px-3 py-1 text-xs ${categoryBadgeClass(getPrimaryCategory(featuredPost.tags))}`}>
                {getPrimaryCategory(featuredPost.tags)}
              </span>
              <h2 className="line-clamp-3 text-2xl font-bold">{featuredPost.title}</h2>
              <p className="line-clamp-4 text-slate-300">{featuredPost.excerpt}</p>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <div className="relative h-7 w-7 overflow-hidden rounded-full border border-white/20">
                  <Image
                    src={featuredPost.author_avatar || "/og-abaay.svg"}
                    alt={featuredPost.author || "Abaay Tech"}
                    fill
                    placeholder="blur"
                    blurDataURL={blurDataUrl}
                    sizes="28px"
                    className="object-cover"
                  />
                </div>
                <span>{featuredPost.author || "Abaay"}</span>
                <span>•</span>
                <span>{formatPostDate(featuredPost.created_at)}</span>
                <span>•</span>
                <span>{estimateReadTime(featuredPost.content, featuredPost.read_time)} min read</span>
              </div>
              <Link href={`/blog/${featuredPost.slug}`} className="inline-flex font-semibold text-[#8AB4FF] hover:text-[#B6D2FF]">
                Read article →
              </Link>
            </div>
          </motion.article>
        ) : null}

        <section className="space-y-4">
          <div className="flex flex-wrap gap-2">
            {blogCategoryFilters.map((filter) => {
              const active = activeFilters.includes(filter);
              const count = countByFilter.get(filter) || 0;
              return (
                <button
                  key={filter}
                  type="button"
                  onClick={() => toggleFilter(filter)}
                  className={`rounded-full border px-3 py-1.5 text-sm transition ${
                    active
                      ? "border-[#3B82F6]/70 bg-[#3B82F6]/20 text-white"
                      : "border-white/15 bg-white/[0.02] text-slate-300 hover:border-[#3B82F6]/50"
                  }`}
                >
                  {filter} ({count})
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeFilters.join("-")}-${query}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
            >
              {visiblePosts.map((post, idx) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="overflow-hidden rounded-xl border border-white/10 bg-[#111427] transition hover:-translate-y-1 hover:border-[#3B82F6]/45"
                >
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={post.cover_image || "/og-abaay.svg"}
                      alt={post.title}
                      fill
                      placeholder="blur"
                      blurDataURL={blurDataUrl}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <span className={`absolute left-3 top-3 rounded-full border px-2.5 py-1 text-xs ${categoryBadgeClass(getPrimaryCategory(post.tags))}`}>
                      {getPrimaryCategory(post.tags)}
                    </span>
                    <span className="absolute right-3 top-3 rounded-full border border-white/20 bg-black/45 px-2.5 py-1 text-xs text-slate-100">
                      {estimateReadTime(post.content, post.read_time)} min read
                    </span>
                  </div>
                  <div className="space-y-3 p-4">
                    <h3 className="line-clamp-2 text-lg font-semibold transition hover:text-[#8AB4FF]">{post.title}</h3>
                    <p className="line-clamp-3 text-sm text-slate-300">{post.excerpt}</p>
                    <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <div className="relative h-6 w-6 overflow-hidden rounded-full border border-white/20">
                          <Image
                            src={post.author_avatar || "/og-abaay.svg"}
                            alt={post.author || "Abaay"}
                            fill
                            placeholder="blur"
                            blurDataURL={blurDataUrl}
                            sizes="24px"
                            className="object-cover"
                          />
                        </div>
                        <span>{post.author || "Abaay"}</span>
                      </div>
                      <span>{formatPostDate(post.created_at)}</span>
                    </div>
                    <Link href={`/blog/${post.slug}`} className="inline-flex text-sm font-semibold text-[#8AB4FF] hover:text-[#B6D2FF]">
                      Read more →
                    </Link>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </AnimatePresence>

          {loadingMore ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="h-72 animate-pulse rounded-xl border border-white/10 bg-white/5" />
              ))}
            </div>
          ) : null}

          {!loadingMore && hasMore ? (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => void loadMore()}
                className="rounded-full border border-[#3B82F6]/60 bg-[#3B82F6]/15 px-5 py-2.5 text-sm font-semibold text-white"
              >
                Load more articles
              </button>
            </div>
          ) : null}

          {!hasMore && filteredPosts.length > 0 ? (
            <p className="text-center text-sm text-slate-400">You&apos;ve reached the end.</p>
          ) : null}
        </section>

        <section className="rounded-2xl border border-[#3B82F6]/35 bg-[#121937] p-6">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <p className="text-2xl">📬</p>
              <h2 className="mt-2 text-2xl font-bold">Get articles like these in your inbox</h2>
              <p className="mt-2 text-slate-300">
                No spam. Just practical software insights, once or twice a month.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-lg border border-white/15 bg-[#0D0F1A] px-3 py-2.5 text-sm text-white"
                />
                <button
                  type="button"
                  onClick={() => void subscribe()}
                  disabled={newsletterState === "loading"}
                  className="rounded-lg border border-[#3B82F6]/70 bg-[#3B82F6] px-4 py-2.5 text-sm font-semibold text-white"
                >
                  {newsletterState === "loading" ? "Subscribing..." : "Subscribe"}
                </button>
              </div>
              {newsletterState === "success" ? (
                <p className="text-sm text-emerald-300">You&apos;re in! 🎉 Welcome aboard.</p>
              ) : null}
              {newsletterState === "error" ? (
                <p className="text-sm text-red-300">Something went wrong. Try again.</p>
              ) : null}
            </div>
          </div>
        </section>
      </main>

      <BlogFooter />
    </div>
  );
}
