"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Bot,
  Building2,
  CheckCircle2,
  Clock3,
  Code2,
  Handshake,
  Menu,
  Rocket,
  ShieldCheck,
  Star,
  TrendingUp,
  X,
} from "lucide-react";
import { FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { useEffect, useMemo, useState } from "react";

type Project = {
  id: string | number;
  title: string;
  description: string;
  tech_stack: string[] | string | null;
  cover_image: string | null;
  slug: string | null;
};

type Testimonial = {
  id: string | number;
  name: string;
  company: string;
  rating: number;
  message: string;
  avatar_url: string | null;
};

type HomePageProps = {
  projects: Project[];
  testimonials: Testimonial[];
};

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const typedWords = ["Web Apps", "ERP Systems", "Automation", "SaaS Products"];

const fallbackProjects: Project[] = [
  {
    id: "fallback-1",
    title: "Global Logistics Control Platform",
    description:
      "A multi-country operations dashboard unifying warehouse flow, shipment forecasting, and KPI reporting.",
    tech_stack: ["Next.js", "PostgreSQL", "Supabase"],
    cover_image: null,
    slug: "global-logistics-control-platform",
  },
  {
    id: "fallback-2",
    title: "Manufacturing ERP Suite",
    description:
      "An end-to-end ERP system with inventory planning, procurement automation, and real-time finance modules.",
    tech_stack: ["React", "Node.js", "ERP Workflow Engine"],
    cover_image: null,
    slug: "manufacturing-erp-suite",
  },
  {
    id: "fallback-3",
    title: "Sales CRM Automation Hub",
    description:
      "A CRM solution integrating lead routing, omnichannel outreach, and pipeline intelligence in one workspace.",
    tech_stack: ["TypeScript", "Supabase", "API Integrations"],
    cover_image: null,
    slug: "sales-crm-automation-hub",
  },
];

const fallbackTestimonials: Testimonial[] = [
  {
    id: "t-fallback-1",
    name: "Maya Thompson",
    company: "Orion Freight Group",
    rating: 5,
    message:
      "Abaay translated complex operational needs into a polished platform that scaled with our international growth.",
    avatar_url: null,
  },
  {
    id: "t-fallback-2",
    name: "Karim Soliman",
    company: "Nova Retail Systems",
    rating: 5,
    message:
      "The team shipped fast, communicated clearly, and delivered automation that saved us hundreds of hours per month.",
    avatar_url: null,
  },
];

function TypingCycle() {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = typedWords[wordIndex];
    const doneTyping = !isDeleting && displayText === currentWord;
    const doneDeleting = isDeleting && displayText.length === 0;

    const timeout = setTimeout(
      () => {
        if (doneTyping) {
          setIsDeleting(true);
          return;
        }

        if (doneDeleting) {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % typedWords.length);
          return;
        }

        setDisplayText((prev) =>
          isDeleting ? prev.slice(0, -1) : currentWord.slice(0, prev.length + 1),
        );
      },
      doneTyping ? 900 : isDeleting ? 50 : 90,
    );

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, wordIndex]);

  return (
    <span className="inline-flex min-h-8 items-center text-[#3B82F6]">
      {displayText}
      <span className="ml-1 h-6 w-[2px] animate-pulse bg-[#22D3EE]" />
    </span>
  );
}

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
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              {item.label}
            </Link>
          ))}
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
                className="text-sm font-medium text-slate-200"
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

function FloatingMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="relative mx-auto w-full max-w-xl"
    >
      <div className="absolute -left-6 -top-6 h-40 w-40 rounded-full bg-[#3B82F6]/20 blur-3xl" />
      <div className="absolute -bottom-6 -right-8 h-32 w-32 rounded-full bg-[#22D3EE]/15 blur-3xl" />
      <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#111427] shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="ml-3 text-xs text-slate-400">deployment-status.ts</span>
        </div>
        <pre className="overflow-x-auto p-4 text-xs leading-6 text-slate-300">
          <code>{`const release = await deploy({
  app: "international-ops-suite",
  tests: "passed",
  uptimeTarget: "99.95%",
});

if (release.status === "ready") {
  notifyClient("Your platform is live");
}`}</code>
        </pre>
      </div>
    </motion.div>
  );
}

function Section({
  id,
  delay,
  children,
  className = "",
}: {
  id?: string;
  delay: number;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
      }}
      viewport={{ once: true, amount: 0.2 }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

function toTechArray(value: Project["tech_stack"]): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function HomePage({ projects, testimonials }: HomePageProps) {
  const safeProjects = useMemo(() => {
    const list = projects.length > 0 ? projects : fallbackProjects;
    return list.slice(0, 3);
  }, [projects]);

  const safeTestimonials = useMemo(() => {
    const list = testimonials.length > 0 ? testimonials : fallbackTestimonials;
    return list.slice(0, 8);
  }, [testimonials]);

  return (
    <div className="relative overflow-hidden">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-20 px-6 pb-20 pt-10 lg:gap-28 lg:px-10">
        <Section delay={0} className="grid items-center gap-10 lg:grid-cols-2">
          <div className="space-y-7">
            <span className="inline-flex items-center rounded-full border border-[#3B82F6]/40 bg-[#3B82F6]/10 px-4 py-1.5 text-sm font-medium text-[#9CC1FF]">
              ⚡ Available for new projects
            </span>
            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              We Build Software That Scales Your Business
            </h1>
            <p className="max-w-xl text-lg text-slate-300">
              Custom web apps, ERP systems and automation solutions for businesses worldwide. From idea to deployment.
            </p>
            <div className="text-base font-semibold text-slate-100">
              We engineer high-performance <TypingCycle />
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className="rounded-full border border-[#3B82F6]/80 bg-[#3B82F6] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(59,130,246,0.45)] transition hover:-translate-y-0.5 hover:bg-[#60A5FA]"
              >
                Start a Project
              </Link>
              <Link
                href="/portfolio"
                className="rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-[#3B82F6]/60 hover:text-white"
              >
                View Our Work
              </Link>
            </div>
          </div>
          <FloatingMockup />
        </Section>

        <Section delay={0.08} className="space-y-6">
          <p className="text-center text-sm uppercase tracking-[0.25em] text-slate-400">
            Trusted by teams across
          </p>
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {["NOVA Group", "AtlasPay", "HelixOps", "UrbanGrid", "BlueOrbit"].map((brand) => (
              <div
                key={brand}
                className="flex h-14 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-sm font-semibold tracking-wide text-slate-400 opacity-70 grayscale transition hover:opacity-100"
              >
                {brand}
              </div>
            ))}
          </div>
        </Section>

        <Section id="services" delay={0.12} className="space-y-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">What We Build</h2>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Web & Mobile Apps",
                desc: "Scalable apps designed for speed, clean UX, and global users across web and mobile touchpoints.",
                icon: <Rocket className="h-6 w-6" />,
              },
              {
                title: "ERP & CRM Systems",
                desc: "Business-critical systems that streamline operations, sales pipelines, finance flow, and reporting.",
                icon: <Building2 className="h-6 w-6" />,
              },
              {
                title: "Automation & Integrations",
                desc: "Automated workflows, third-party integrations, and API orchestration to remove bottlenecks fast.",
                icon: <Bot className="h-6 w-6" />,
              },
            ].map((service) => (
              <article
                key={service.title}
                className="group rounded-2xl border border-white/10 bg-[#111427]/70 p-6 transition duration-300 hover:-translate-y-1 hover:border-[#3B82F6]/50 hover:shadow-[0_0_40px_rgba(59,130,246,0.25)]"
              >
                <div className="mb-5 inline-flex rounded-lg border border-[#3B82F6]/30 bg-[#3B82F6]/10 p-2.5 text-[#8AB4FF]">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-white">{service.title}</h3>
                <p className="mt-3 text-slate-300">{service.desc}</p>
                <Link
                  href="/services"
                  className="mt-5 inline-block text-sm font-semibold text-[#7FB3FF] transition group-hover:text-[#A3C8FF]"
                >
                  Learn more →
                </Link>
              </article>
            ))}
          </div>
        </Section>

        <Section id="portfolio" delay={0.18} className="space-y-8">
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Recent Work</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {safeProjects.map((project) => {
              const techItems = toTechArray(project.tech_stack);

              return (
                <article
                  key={project.id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-[#111427]/80 transition hover:border-[#3B82F6]/50"
                >
                  <div className="relative h-44 w-full border-b border-white/10 bg-gradient-to-br from-[#17203d] via-[#111427] to-[#0b111f]">
                    {project.cover_image ? (
                      <Image
                        src={project.cover_image}
                        alt={project.title}
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-400">
                        <Code2 className="h-9 w-9" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-4 p-5">
                    <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                    <p className="text-slate-300">{project.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {techItems.map((tag) => (
                        <span
                          key={`${project.id}-${tag}`}
                          className="rounded-full border border-white/15 px-2.5 py-1 text-xs text-slate-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={project.slug ? `/portfolio/${project.slug}` : "/portfolio"}
                      className="inline-block text-sm font-semibold text-[#7FB3FF] hover:text-[#A3C8FF]"
                    >
                      View case study →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
          <div>
            <Link href="/portfolio" className="text-sm font-semibold text-[#8AB4FF] hover:text-[#B6D2FF]">
              View all projects →
            </Link>
          </div>
        </Section>

        <Section id="about" delay={0.22} className="space-y-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Why teams choose us</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "50+ Projects Delivered",
              "3+ Years Experience",
              "15+ Happy Clients",
              "100% On-Time Delivery",
            ].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-center text-lg font-semibold text-slate-100"
              >
                {item}
              </div>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Fast Delivery",
                icon: <Clock3 className="h-5 w-5" />,
                desc: "Lean execution cycles keep momentum high and launch timelines short.",
              },
              {
                title: "Clean Code",
                icon: <ShieldCheck className="h-5 w-5" />,
                desc: "Maintainable architecture and clear standards that support long-term scale.",
              },
              {
                title: "Ongoing Support",
                icon: <Handshake className="h-5 w-5" />,
                desc: "Post-launch optimization and proactive support to keep systems reliable.",
              },
            ].map((point) => (
              <div key={point.title} className="rounded-xl border border-white/10 bg-[#111427]/70 p-5">
                <div className="mb-3 inline-flex rounded-full bg-[#3B82F6]/20 p-2 text-[#8AB4FF]">{point.icon}</div>
                <h3 className="font-semibold text-white">{point.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{point.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section delay={0.28} className="space-y-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">What clients say</h2>
          <div className="-mx-2 flex snap-x snap-mandatory gap-4 overflow-x-auto px-2 pb-2">
            {safeTestimonials.map((item) => (
              <article
                key={item.id}
                className="min-w-[290px] snap-start rounded-2xl border border-white/10 bg-[#111427]/80 p-5 sm:min-w-[360px]"
              >
                <div className="mb-4 flex items-center gap-3">
                  {item.avatar_url ? (
                    <Image
                      src={item.avatar_url}
                      alt={item.name}
                      width={44}
                      height={44}
                      unoptimized
                      className="h-11 w-11 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#3B82F6]/20 text-[#9CC1FF]">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-white">{item.name}</p>
                    <p className="text-sm text-slate-400">{item.company}</p>
                  </div>
                </div>
                <div className="mb-3 flex items-center gap-1 text-amber-300">
                  {Array.from({ length: Math.min(Math.max(item.rating, 1), 5) }).map((_, idx) => (
                    <Star key={`${item.id}-${idx}`} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-slate-300">{item.message}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section delay={0.33} className="rounded-3xl border border-[#3B82F6]/30 bg-[#121937] p-8 shadow-[0_0_60px_rgba(59,130,246,0.2)] lg:p-10">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-white">Ready to build something great?</h2>
              <p className="mt-3 max-w-2xl text-slate-300">
                Let&apos;s talk about your project. Free consultation, no commitment.
              </p>
            </div>
            <Link
              href="/contact"
              className="rounded-full border border-[#3B82F6]/70 bg-[#3B82F6] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#60A5FA]"
            >
              Book a Free Call
            </Link>
          </div>
        </Section>
      </main>

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
    </div>
  );
}
