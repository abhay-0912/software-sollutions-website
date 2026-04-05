"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { Copy, ThumbsDown, ThumbsUp } from "lucide-react";
import { FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import {
  blurDataUrl,
  categoryBadgeClass,
  estimateReadTime,
  formatPostDate,
  slugifyHeading,
  type BlogPost,
} from "@/lib/blog";
import { BlogFooter, BlogNavbar } from "@/components/blog/blog-shell";

type TocItem = { id: string; text: string; level: 2 | 3 };

function extractToc(content: string): TocItem[] {
  const lines = content.split("\n");
  const items: TocItem[] = [];

  lines.forEach((line) => {
    if (line.startsWith("## ")) {
      const text = line.replace(/^##\s+/, "").trim();
      items.push({ id: slugifyHeading(text), text, level: 2 });
    }
    if (line.startsWith("### ")) {
      const text = line.replace(/^###\s+/, "").trim();
      items.push({ id: slugifyHeading(text), text, level: 3 });
    }
  });

  return items;
}

function toLinkedInShare(url: string) {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
}

function toXShare(url: string, title: string) {
  return `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
}

export function BlogPostPage({
  post,
  related,
  initialReactions,
}: {
  post: BlogPost;
  related: BlogPost[];
  initialReactions: { up: number; down: number };
}) {
  const [activeToc, setActiveToc] = useState<string>("");
  const [reactions, setReactions] = useState(initialReactions);
  const [reacting, setReacting] = useState<"up" | "down" | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const toc = useMemo(() => extractToc(post.content), [post.content]);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 28 });

  const readTime = estimateReadTime(post.content, post.read_time);
  const currentUrl = typeof window !== "undefined" ? window.location.href : `https://abaay.tech/blog/${post.slug}`;

  useEffect(() => {
    if (!toc.length) return;

    const observers: IntersectionObserver[] = [];
    toc.forEach((item) => {
      const el = document.getElementById(item.id);
      if (!el) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveToc(item.id);
            }
          });
        },
        { rootMargin: "-30% 0px -60% 0px", threshold: 0.1 },
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [toc]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = currentUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
  };

  const react = async (reaction: "up" | "down") => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setReacting(reaction);
    const { error } = await supabase.from("post_reactions").insert({
      post_id: post.id,
      reaction,
    });

    if (!error) {
      setReactions((prev) => ({ ...prev, [reaction]: prev[reaction] + 1 }));
    }

    setReacting(null);
  };

  return (
    <div className="min-h-screen bg-[#0D0F1A] text-white">
      <motion.div className="fixed left-0 top-0 z-[60] h-[3px] w-full origin-left bg-[#3B82F6]" style={{ scaleX: progress }} />
      <BlogNavbar />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 pb-20 pt-10 lg:px-10">
        <section className="space-y-4">
          <p className="text-sm text-slate-300">
            <Link href="/" className="hover:text-white">Home</Link> → <Link href="/blog" className="hover:text-white">Blog</Link> → {post.title}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {(post.tags || []).map((tag) => (
              <span key={tag} className={`rounded-full border px-2.5 py-1 text-xs ${categoryBadgeClass(tag)}`}>
                {tag}
              </span>
            ))}
          </div>

          <h1 className="max-w-4xl text-4xl font-bold leading-tight sm:text-5xl">{post.title}</h1>
          <p className="max-w-3xl text-slate-300">{post.excerpt}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-full border border-white/20">
                <Image
                  src={post.author_avatar || "/og-abaay.svg"}
                  alt={post.author || "Abaay"}
                  fill
                  placeholder="blur"
                  blurDataURL={blurDataUrl}
                  sizes="32px"
                  className="object-cover"
                />
              </div>
              <span>Written by {post.author || "Abaay"}</span>
            </div>
            <span>{formatPostDate(post.created_at)}</span>
            {post.updated_at && post.updated_at !== post.created_at ? <span>Updated {formatPostDate(post.updated_at)}</span> : null}
            <span>{readTime} min read</span>
          </div>

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => void copyLink()} className="inline-flex items-center gap-1 rounded-full border border-white/20 px-3 py-1.5 text-sm">
              <Copy className="h-4 w-4" /> Copy link
            </button>
            <Link href={toLinkedInShare(currentUrl)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full border border-white/20 px-3 py-1.5 text-sm">
              <FaLinkedinIn className="h-4 w-4" /> Share on LinkedIn
            </Link>
            <Link href={toXShare(currentUrl, post.title)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full border border-white/20 px-3 py-1.5 text-sm">
              <FaXTwitter className="h-4 w-4" /> Share on X
            </Link>
          </div>

          <div className="relative mt-3 overflow-hidden rounded-xl border border-white/10">
            <div className="relative h-[360px] w-full sm:h-[460px]">
              <Image
                src={post.cover_image || "/og-abaay.svg"}
                alt={post.title}
                fill
                placeholder="blur"
                blurDataURL={blurDataUrl}
                sizes="(max-width: 1200px) 100vw, 1200px"
                className="object-cover"
              />
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.8fr_0.8fr]">
          <article ref={contentRef} className="space-y-8">
            <div className="prose prose-invert max-w-none prose-headings:font-bold prose-h2:border-l-4 prose-h2:border-[#3B82F6] prose-h2:pl-3 prose-p:text-slate-200 prose-p:leading-8 prose-li:text-slate-200 prose-a:text-[#8AB4FF] prose-blockquote:border-l-4 prose-blockquote:border-[#3B82F6] prose-blockquote:bg-white/[0.03] prose-blockquote:py-1 prose-blockquote:text-slate-300">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  h2: ({ children }) => {
                    const text = String(children);
                    const id = slugifyHeading(text);
                    return <h2 id={id}>{children}</h2>;
                  },
                  h3: ({ children }) => {
                    const text = String(children);
                    const id = slugifyHeading(text);
                    return <h3 id={id}>{children}</h3>;
                  },
                  code(props) {
                    const { children, className, ...rest } = props;
                    const match = /language-(\w+)/.exec(className || "");
                    if (!match) {
                      return (
                        <code className="rounded bg-[#111427] px-1.5 py-0.5 text-[#8AB4FF]" {...rest}>
                          {children}
                        </code>
                      );
                    }

                    return (
                      <span className="relative block">
                        <button
                          type="button"
                          onClick={() => void navigator.clipboard.writeText(String(children))}
                          className="absolute right-3 top-3 rounded border border-white/20 bg-black/35 px-2 py-1 text-xs text-slate-200"
                        >
                          Copy
                        </button>
                        <code className={className} {...rest}>{children}</code>
                      </span>
                    );
                  },
                  img: ({ alt, src }) => (
                    <span className="my-6 block">
                      <span className="relative block aspect-[16/9] w-full overflow-hidden rounded-xl border border-white/10">
                        <Image
                          src={typeof src === "string" ? src : "/og-abaay.svg"}
                          alt={alt || "Article image"}
                          fill
                          placeholder="blur"
                          blurDataURL={blurDataUrl}
                          sizes="(max-width: 1200px) 100vw, 900px"
                          className="object-cover"
                        />
                      </span>
                    </span>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="rounded-2xl border border-white/10 bg-[#111427] p-6">
              <div className="flex gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-full border-2 border-[#3B82F6]/70">
                  <Image
                    src={post.author_avatar || "/og-abaay.svg"}
                    alt={post.author || "Abaay"}
                    fill
                    placeholder="blur"
                    blurDataURL={blurDataUrl}
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Written by {post.author || "Abaay"}</h3>
                  <p className="text-slate-300">{post.author_bio || "Software builder focused on practical outcomes in web platforms, ERP systems, and automation workflows."}</p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full border border-white/20 px-2 py-1">React</span>
                    <span className="rounded-full border border-white/20 px-2 py-1">Node.js</span>
                    <span className="rounded-full border border-white/20 px-2 py-1">Odoo</span>
                  </div>
                  <Link href="/blog" className="inline-flex text-sm font-semibold text-[#8AB4FF] hover:text-[#B6D2FF]">
                    See all posts by {post.author || "Abaay"}
                  </Link>
                </div>
              </div>
            </motion.section>

            <section className="space-y-4">
              <h3 className="text-2xl font-bold">You might also like</h3>
              <div className="grid gap-4 md:grid-cols-3">
                {related.map((item, idx) => (
                  <motion.article key={item.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="overflow-hidden rounded-xl border border-white/10 bg-[#111427]">
                    <div className="relative aspect-[16/9]">
                      <Image src={item.cover_image || "/og-abaay.svg"} alt={item.title} fill placeholder="blur" blurDataURL={blurDataUrl} sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                    </div>
                    <div className="space-y-2 p-3">
                      <h4 className="line-clamp-2 font-semibold">{item.title}</h4>
                      <p className="line-clamp-2 text-sm text-slate-300">{item.excerpt}</p>
                      <Link href={`/blog/${item.slug}`} className="text-sm font-semibold text-[#8AB4FF]">Read more →</Link>
                    </div>
                  </motion.article>
                ))}
              </div>
            </section>

            <section className="space-y-4 rounded-2xl border border-white/10 bg-[#111427] p-6">
              <h3 className="text-xl font-semibold">Found this helpful?</h3>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => void react("up")} disabled={reacting !== null} className="inline-flex items-center gap-1 rounded-full border border-white/20 px-4 py-2 text-sm hover:border-[#3B82F6]/50">
                  <ThumbsUp className={`h-4 w-4 ${reacting === "up" ? "animate-bounce" : ""}`} />
                  👍 {reactions.up}
                </button>
                <button type="button" onClick={() => void react("down")} disabled={reacting !== null} className="inline-flex items-center gap-1 rounded-full border border-white/20 px-4 py-2 text-sm hover:border-[#3B82F6]/50">
                  <ThumbsDown className={`h-4 w-4 ${reacting === "down" ? "animate-bounce" : ""}`} />
                  👎 {reactions.down}
                </button>
              </div>
              <div className="rounded-xl border border-[#3B82F6]/35 bg-[#121937] p-5">
                <h4 className="text-lg font-semibold">Have a project in mind?</h4>
                <p className="mt-2 text-slate-300">We write about what we build - and we&apos;d love to build something for you.</p>
                <Link href="/contact" className="mt-3 inline-flex rounded-full border border-[#3B82F6]/70 bg-[#3B82F6] px-4 py-2 text-sm font-semibold">
                  Let&apos;s talk
                </Link>
              </div>
            </section>
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-xl border border-white/10 bg-[#111427] p-4">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-300">In this article</h3>
              <div className="space-y-2 text-sm">
                {toc.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className={`block w-full text-left ${item.level === 3 ? "pl-4" : ""} ${activeToc === item.id ? "text-[#8AB4FF]" : "text-slate-300"}`}
                  >
                    {item.text}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </section>
      </main>

      <BlogFooter />
    </div>
  );
}
