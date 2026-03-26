"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, CheckCircle2, ExternalLink, Menu, X } from "lucide-react";
import { FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { useEffect, useMemo, useState } from "react";
import {
  categoryColorClass,
  normalizeProject,
  toScreenshotsArray,
  toTechArray,
  type PortfolioProject,
} from "@/lib/portfolio";

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

type PortfolioCaseStudyPageProps = {
  project: PortfolioProject;
  relatedProjects: PortfolioProject[];
  nextProject: PortfolioProject | null;
};

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

function Lightbox({
  openImage,
  onClose,
}: {
  openImage: string | null;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {openImage ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="relative w-full max-w-5xl overflow-hidden rounded-2xl border border-white/20"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-3 z-10 rounded-full border border-white/20 bg-black/50 p-2 text-white"
              aria-label="Close screenshot"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="relative aspect-[16/9] w-full bg-[#111427]">
              <Image
                src={openImage}
                alt="Project screenshot"
                fill
                unoptimized
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function RelatedProjectCard({ project }: { project: PortfolioProject }) {
  const tech = toTechArray(project.tech_stack).slice(0, 3);

  return (
    <article className="overflow-hidden rounded-xl border border-white/10 bg-[#111427]/80">
      <div className="relative aspect-[16/9] w-full border-b border-white/10 bg-[#151b30]">
        <Image
          src={project.cover_image || "/og-abaay.svg"}
          alt={project.title}
          fill
          unoptimized
          sizes="(max-width: 1024px) 100vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="space-y-3 p-4">
        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs ${categoryColorClass(project.category)}`}>
          {project.category}
        </span>
        <h3 className="text-lg font-semibold text-white">{project.title}</h3>
        <div className="flex flex-wrap gap-2">
          {tech.map((item) => (
            <span key={`${project.id}-${item}`} className="rounded-full border border-white/15 px-2 py-0.5 text-xs text-slate-300">
              {item}
            </span>
          ))}
        </div>
        <Link href={`/portfolio/${project.slug}`} className="inline-flex items-center text-sm font-semibold text-[#8AB4FF] hover:text-[#B6D2FF]">
          View case study <ExternalLink className="ml-1 h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

export function PortfolioCaseStudyPage({
  project,
  relatedProjects,
  nextProject,
}: PortfolioCaseStudyPageProps) {
  const safeProject = normalizeProject(project);
  const screenshots = useMemo(() => toScreenshotsArray(safeProject), [safeProject]);
  const tech = toTechArray(safeProject.tech_stack);
  const [openImage, setOpenImage] = useState<string | null>(null);

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 400], [0, 60]);

  return (
    <div className="relative overflow-hidden">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 pb-20 pt-10 lg:px-10">
        <div>
          <Link href="/portfolio" className="inline-flex items-center gap-2 text-sm font-semibold text-[#8AB4FF] hover:text-[#B6D2FF]">
            <ArrowLeft className="h-4 w-4" /> Back to Portfolio
          </Link>
        </div>

        <section className="space-y-6">
          <h1 className="text-4xl font-bold text-white sm:text-5xl">{safeProject.title}</h1>
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${categoryColorClass(safeProject.category)}`}>
              {safeProject.category}
            </span>
            {tech.map((item) => (
              <span key={item} className="rounded-full border border-white/15 px-3 py-1 text-xs text-slate-300">
                {item}
              </span>
            ))}
          </div>

          <motion.div style={{ y: heroY }} className="relative overflow-hidden rounded-2xl border border-white/10">
            <div className="relative aspect-[16/8] w-full bg-[#111427]">
              <Image
                src={safeProject.cover_image || "/og-abaay.svg"}
                alt={safeProject.title}
                fill
                unoptimized
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </motion.div>
        </section>

        <section className="grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-8">
            <article className="space-y-3">
              <h2 className="text-2xl font-bold text-white">Overview</h2>
              <p className="text-slate-300">{safeProject.long_description || safeProject.description}</p>
            </article>

            <article className="space-y-3">
              <h2 className="text-2xl font-bold text-white">The Challenge</h2>
              <p className="text-slate-300">
                {safeProject.challenge ||
                  "The client needed a more efficient, scalable system and better visibility across teams and operations."}
              </p>
            </article>

            <article className="space-y-3">
              <h2 className="text-2xl font-bold text-white">Our Solution</h2>
              <p className="text-slate-300">
                {safeProject.solution ||
                  "We designed and built a tailored software stack with modern architecture, integrations, and automation workflows to solve the bottlenecks."}
              </p>
            </article>

            <article className="space-y-3">
              <h2 className="text-2xl font-bold text-white">Results</h2>
              <p className="text-slate-300">
                {safeProject.results ||
                  "The final system improved speed, reduced manual work, and provided better reporting for ongoing decision-making."}
              </p>
            </article>

            <article className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Screenshot Gallery</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {screenshots.map((item, idx) => (
                  <button
                    key={`${item}-${idx}`}
                    type="button"
                    onClick={() => setOpenImage(item)}
                    className="group relative overflow-hidden rounded-xl border border-white/10 text-left"
                  >
                    <div className="relative aspect-[16/10] w-full bg-[#111427]">
                      <Image
                        src={item}
                        alt={`Screenshot ${idx + 1}`}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>
                  </button>
                ))}
              </div>
            </article>
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-2xl border border-white/10 bg-[#111427]/80 p-5">
              <h3 className="mb-4 text-lg font-semibold text-white">Project Info</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-4 border-b border-white/10 pb-2">
                  <dt className="text-slate-400">Client</dt>
                  <dd className="text-slate-200">{safeProject.client_name || "Confidential"}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-white/10 pb-2">
                  <dt className="text-slate-400">Industry</dt>
                  <dd className="text-slate-200">{safeProject.industry || "General"}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-white/10 pb-2">
                  <dt className="text-slate-400">Timeline</dt>
                  <dd className="text-slate-200">{safeProject.timeline || "8 weeks"}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-white/10 pb-2">
                  <dt className="text-slate-400">Team size</dt>
                  <dd className="text-slate-200">{safeProject.team_size || "2 developers"}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-400">Services</dt>
                  <dd>
                    <Link href="/services" className="text-[#8AB4FF] hover:text-[#B6D2FF]">
                      Explore services
                    </Link>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="space-y-3">
              {safeProject.live_url ? (
                <Link
                  href={safeProject.live_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#3B82F6]/70 bg-[#3B82F6] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#60A5FA]"
                >
                  View Live Project <ExternalLink className="h-4 w-4" />
                </Link>
              ) : null}
              <Link
                href="/contact"
                className="inline-flex w-full items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-[#3B82F6]/60 hover:text-white"
              >
                Start a Similar Project →
              </Link>
            </div>
          </aside>
        </section>

        <section className="space-y-8">
          {nextProject ? (
            <article className="rounded-2xl border border-white/10 bg-[#111427]/70 p-6">
              <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Next Project</p>
              <h2 className="mt-2 text-2xl font-bold text-white">{nextProject.title}</h2>
              <p className="mt-2 text-slate-300 line-clamp-2">{nextProject.description}</p>
              <Link href={`/portfolio/${nextProject.slug}`} className="mt-4 inline-flex items-center text-sm font-semibold text-[#8AB4FF] hover:text-[#B6D2FF]">
                Next Project →
              </Link>
            </article>
          ) : null}

          {relatedProjects.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Related Projects</h2>
              <div className="grid gap-4 lg:grid-cols-2">
                {relatedProjects.map((item) => (
                  <RelatedProjectCard key={item.id} project={item} />
                ))}
              </div>
            </div>
          ) : null}
        </section>
      </main>

      <section className="mx-auto mb-20 w-full max-w-7xl px-6 lg:px-10">
        <div className="rounded-3xl border border-[#3B82F6]/30 bg-[#121937] p-8 shadow-[0_0_60px_rgba(59,130,246,0.2)] lg:p-10">
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
        </div>
      </section>

      <Footer />

      <Lightbox openImage={openImage} onClose={() => setOpenImage(null)} />
    </div>
  );
}
