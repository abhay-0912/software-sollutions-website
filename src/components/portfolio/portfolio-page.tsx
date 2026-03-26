"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { ArrowRight, CheckCircle2, Menu, Sparkles, Star, X } from "lucide-react";
import { FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  categoryColorClass,
  fallbackMiniTestimonials,
  fallbackProjects,
  normalizeProject,
  portfolioFilters,
  type PortfolioCategory,
  type PortfolioProject,
  type PortfolioTestimonial,
  toTechArray,
} from "@/lib/portfolio";

type PortfolioPageProps = {
  projects: PortfolioProject[];
  testimonials: PortfolioTestimonial[];
};

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        isScrolled
          ? "border-white/10 bg-[#0D0F1A]/75 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link href="/" className="text-2xl font-bold tracking-tight text-white">
          abaay
          <span className="text-[#3B82F6]">.tech</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((item) => {
            const isActive = item.href === "/portfolio";
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`text-sm font-medium transition ${
                  isActive ? "text-[#8AB4FF]" : "text-slate-300 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Link
            href="/contact"
            className="rounded-full border border-[#3B82F6]/80 bg-[#3B82F6]/15 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_rgba(59,130,246,0.35)] transition hover:-translate-y-0.5 hover:bg-[#3B82F6]/25"
          >
            Get a Free Quote
          </Link>
        </div>

        <button
          type="button"
          className="rounded-md border border-white/20 p-2 text-slate-200 lg:hidden"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen ? (
        <div className="border-t border-white/10 bg-[#0D0F1A]/95 px-6 py-4 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col gap-4">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`text-sm font-medium ${
                  item.href === "/portfolio" ? "text-[#8AB4FF]" : "text-slate-200"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setMenuOpen(false)}
              className="mt-2 inline-flex w-fit rounded-full border border-[#3B82F6]/80 bg-[#3B82F6]/20 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Get a Free Quote
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0C1120]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1.2fr_1fr_1fr] lg:px-10">
        <div>
          <Link href="/" className="text-2xl font-bold text-white">
            abaay<span className="text-[#3B82F6]">.tech</span>
          </Link>
          <p className="mt-3 max-w-sm text-slate-300">Building tomorrow&apos;s software, today.</p>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Company</h3>
          {navLinks.map((item) => (
            <Link key={item.label} href={item.href} className="text-slate-200 transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </div>
        <div className="space-y-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Connect</h3>
          <div className="flex items-center gap-3">
            <Link
              href="https://www.linkedin.com"
              className="rounded-full border border-white/15 p-2 text-slate-300 transition hover:border-[#3B82F6]/60 hover:text-white"
              aria-label="LinkedIn"
              target="_blank"
              rel="noreferrer"
            >
              <FaLinkedinIn className="h-4 w-4" />
            </Link>
            <Link
              href="https://github.com"
              className="rounded-full border border-white/15 p-2 text-slate-300 transition hover:border-[#3B82F6]/60 hover:text-white"
              aria-label="GitHub"
              target="_blank"
              rel="noreferrer"
            >
              <FaGithub className="h-4 w-4" />
            </Link>
            <Link
              href="https://x.com"
              className="rounded-full border border-white/15 p-2 text-slate-300 transition hover:border-[#3B82F6]/60 hover:text-white"
              aria-label="Twitter"
              target="_blank"
              rel="noreferrer"
            >
              <FaXTwitter className="h-4 w-4" />
            </Link>
          </div>
          <div className="inline-flex items-center gap-2 text-sm text-slate-400">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            Serving international B2B clients
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-sm text-slate-400">
        © 2025 Abaay Tech. All rights reserved.
      </div>
    </footer>
  );
}

function FilterBar({
  activeFilter,
  onFilterChange,
}: {
  activeFilter: PortfolioCategory;
  onFilterChange: (category: PortfolioCategory) => void;
}) {
  return (
    <div className="sticky top-[72px] z-40 -mx-6 border-y border-white/10 bg-[#0D0F1A]/90 px-6 py-4 backdrop-blur lg:-mx-10 lg:px-10">
      <div className="mx-auto flex w-full max-w-7xl flex-wrap gap-3">
        {portfolioFilters.map((filter) => {
          const active = activeFilter === filter;
          return (
            <button
              key={filter}
              type="button"
              onClick={() => onFilterChange(filter)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                active
                  ? "border-[#3B82F6]/80 bg-[#3B82F6]/20 text-white"
                  : "border-white/15 bg-white/[0.03] text-slate-300 hover:border-[#3B82F6]/45 hover:text-white"
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function EmptyCategoryState() {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-[#111427]/50 px-6 text-center">
      <div className="relative mb-6 h-20 w-20">
        <div className="absolute inset-0 rounded-full border border-[#3B82F6]/50 bg-[#3B82F6]/10" />
        <div className="absolute -left-3 top-3 h-4 w-4 rounded-full border border-[#9CC1FF]/50 bg-[#3B82F6]/15" />
        <div className="absolute -right-2 bottom-2 h-5 w-5 rounded-md border border-cyan-300/50 bg-cyan-400/10" />
        <Sparkles className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 text-[#9CC1FF]" />
      </div>
      <h3 className="text-xl font-semibold text-white">No projects in this category yet.</h3>
      <p className="mt-3 max-w-md text-slate-300">Check back soon!</p>
    </div>
  );
}

function ProjectCard({
  project,
  featured,
  index,
}: {
  project: PortfolioProject;
  featured: boolean;
  index: number;
}) {
  const tech = toTechArray(project.tech_stack).slice(0, featured ? 6 : 4);

  return (
    <motion.article
      layout
      initial={featured ? { opacity: 0, x: -28 } : { opacity: 0, y: 30 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-[#111427]/80 transition hover:-translate-y-1 hover:border-[#3B82F6]/55 hover:shadow-[0_0_36px_rgba(59,130,246,0.22)] ${
        featured ? "md:col-span-2" : ""
      }`}
    >
      <div className="relative aspect-[16/9] w-full border-b border-white/10 bg-gradient-to-br from-[#17203d] via-[#111427] to-[#0b111f]">
        <Image
          src={project.cover_image || "/og-abaay.svg"}
          alt={project.title}
          fill
          unoptimized
          className="object-cover"
          sizes={featured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 1024px) 50vw, 33vw"}
        />
        <div className="absolute left-3 top-3">
          <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${categoryColorClass(project.category)}`}>
            {project.category}
          </span>
        </div>
        {featured ? (
          <div className="absolute right-3 top-3 rounded-full border border-amber-200/50 bg-amber-200/15 px-3 py-1 text-xs font-semibold text-amber-100">
            Featured Project
          </div>
        ) : null}
      </div>

      <div className="space-y-4 p-5">
        <h3 className="text-[18px] font-bold text-white">{project.title}</h3>
        <p className={`text-slate-300 ${featured ? "line-clamp-4" : "line-clamp-2"}`}>
          {featured
            ? project.long_description || project.description
            : project.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {tech.map((tag) => (
            <span
              key={`${project.id}-${tag}`}
              className="rounded-full border border-white/15 bg-white/[0.02] px-2.5 py-1 text-xs text-slate-200"
            >
              {tag}
            </span>
          ))}
        </div>

        {featured ? (
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {project.live_url ? (
              <Link
                href={project.live_url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-[#3B82F6]/70 bg-[#3B82F6] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#60A5FA]"
              >
                Live URL
              </Link>
            ) : null}
            <Link
              href={`/portfolio/${project.slug}`}
              className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-[#3B82F6]/60 hover:text-white"
            >
              Case study
            </Link>
          </div>
        ) : (
          <Link
            href={`/portfolio/${project.slug}`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#8AB4FF] transition hover:text-[#B6D2FF]"
          >
            View case study <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </motion.article>
  );
}

function CountUpStat({ label, value }: { label: string; value: number }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.55 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const duration = 1400;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setCount(Math.round(value * progress));
      if (progress < 1) {
        raf = window.requestAnimationFrame(tick);
      }
    };

    raf = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <div ref={ref} className="rounded-xl border border-white/10 bg-[#111427]/70 p-5 text-center">
      <p className="text-3xl font-bold text-[#A6C8FF]">{count.toLocaleString()}+</p>
      <p className="mt-2 text-sm text-slate-300">{label}</p>
    </div>
  );
}

function TestimonialsMini({ testimonials }: { testimonials: PortfolioTestimonial[] }) {
  const items = testimonials.length > 0 ? testimonials.slice(0, 2) : fallbackMiniTestimonials;

  return (
    <section className="space-y-7">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-2xl font-bold text-white sm:text-3xl">What clients say about our work</h2>
        <Link href="/about" className="text-sm font-semibold text-[#8AB4FF] hover:text-[#B6D2FF]">
          See all reviews →
        </Link>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {items.map((item) => (
          <article key={item.id} className="rounded-2xl border border-white/10 bg-[#111427]/80 p-5">
            <div className="mb-3 flex items-center gap-1 text-amber-300">
              {Array.from({ length: Math.min(Math.max(item.rating, 1), 5) }).map((_, idx) => (
                <Star key={`${item.id}-${idx}`} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="text-slate-200">{item.message}</p>
            <p className="mt-4 text-sm text-slate-400">
              {item.name} · {item.company}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function PortfolioPage({ projects, testimonials }: PortfolioPageProps) {
  const [activeFilter, setActiveFilter] = useState<PortfolioCategory>("All");

  const allProjects = useMemo(() => {
    const list = projects.length > 0 ? projects : fallbackProjects;
    return list.map(normalizeProject);
  }, [projects]);

  const filtered = useMemo(() => {
    if (activeFilter === "All") return allProjects;

    return allProjects.filter(
      (project) => project.category.toLowerCase() === activeFilter.toLowerCase(),
    );
  }, [activeFilter, allProjects]);

  const featuredFromFiltered = filtered[0] || null;

  return (
    <div className="relative overflow-hidden">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-6 pb-20 pt-10 lg:gap-18 lg:px-10">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#111427]/45 p-8 lg:p-12"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(59,130,246,0.22),transparent_38%),radial-gradient(circle_at_90%_0%,rgba(34,211,238,0.12),transparent_35%)]" />
          <div className="relative z-10 space-y-6">
            <p className="text-sm text-slate-300">
              <Link href="/" className="hover:text-white">
                Home
              </Link>{" "}
              → Portfolio
            </p>
            <span className="inline-flex items-center rounded-full border border-[#3B82F6]/40 bg-[#3B82F6]/10 px-4 py-1.5 text-sm font-medium text-[#9CC1FF]">
              💼 Real work, real results
            </span>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Projects We&apos;re Proud Of
            </h1>
            <p className="max-w-2xl text-lg text-slate-300">
              A selection of web apps, ERP systems, and automation solutions we&apos;ve built for clients worldwide.
            </p>
          </div>
        </motion.section>

        <FilterBar activeFilter={activeFilter} onFilterChange={setActiveFilter} />

        <section className="space-y-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {filtered.length === 0 ? (
                <EmptyCategoryState />
              ) : (
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((project, index) => (
                    <ProjectCard
                      key={`${activeFilter}-${project.id}`}
                      project={project}
                      featured={Boolean(featuredFromFiltered && project.id === featuredFromFiltered.id)}
                      index={index}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>

        <section className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <CountUpStat label="Web Apps Built" value={20} />
            <CountUpStat label="ERP Deployments" value={10} />
            <CountUpStat label="Hours Automated" value={50000} />
            <CountUpStat label="Countries Served" value={12} />
          </div>
        </section>

        <TestimonialsMini testimonials={testimonials} />

        <section className="rounded-3xl border border-[#3B82F6]/30 bg-[#121937] p-8 shadow-[0_0_60px_rgba(59,130,246,0.2)] lg:p-10">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-white">Like what you see?</h2>
              <p className="mt-3 max-w-2xl text-slate-300">
                Let&apos;s build something just as good or better for your business.
              </p>
            </div>
            <Link
              href="/contact"
              className="rounded-full border border-[#3B82F6]/70 bg-[#3B82F6] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#60A5FA]"
            >
              Start Your Project
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
