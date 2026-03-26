"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Compass,
  Handshake,
  Menu,
  Rocket,
  Shield,
  X,
} from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { useMemo, useState, useEffect } from "react";

type SkillCategory = "Frontend" | "Backend" | "ERP" | "Automation" | "Cloud";

type SkillItem = {
  name: string;
  level: number;
};

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const skillsByCategory: Record<SkillCategory, SkillItem[]> = {
  Frontend: [
    { name: "React", level: 5 },
    { name: "Next.js", level: 5 },
    { name: "TypeScript", level: 4 },
    { name: "Tailwind CSS", level: 5 },
    { name: "Framer Motion", level: 4 },
  ],
  Backend: [
    { name: "Node.js", level: 5 },
    { name: "Django", level: 4 },
    { name: "FastAPI", level: 4 },
    { name: "PostgreSQL", level: 5 },
    { name: "REST APIs", level: 5 },
  ],
  ERP: [
    { name: "Odoo", level: 5 },
    { name: "ERPNext", level: 3 },
    { name: "Custom ERP", level: 5 },
  ],
  Automation: [
    { name: "n8n", level: 5 },
    { name: "Make/Integromat", level: 4 },
    { name: "Python scripting", level: 5 },
    { name: "Zapier", level: 3 },
  ],
  Cloud: [
    { name: "Vercel", level: 5 },
    { name: "Supabase", level: 5 },
    { name: "AWS (EC2/S3)", level: 3 },
    { name: "Railway", level: 4 },
  ],
};

const milestones = [
  {
    period: "2024 Q1",
    title: "Founded",
    body: "Abaay Tech registered as a private limited company in Lucknow, India.",
    future: false,
  },
  {
    period: "2024 Q2",
    title: "First Client",
    body: "Landed first international project - a web app for a UK-based startup.",
    future: false,
  },
  {
    period: "2024 Q3",
    title: "ERP Practice Launched",
    body: "Delivered first Odoo implementation for a logistics company.",
    future: false,
  },
  {
    period: "2024 Q4",
    title: "10 Projects Milestone",
    body: "Completed 10 projects across 5 countries.",
    future: false,
  },
  {
    period: "2025",
    title: "Growing the Team",
    body: "Expanding with new developers and taking on larger enterprise projects.",
    future: true,
  },
];

function Section({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay },
      }}
      viewport={{ once: true, amount: 0.18 }}
      className={className}
    >
      {children}
    </motion.section>
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
          {navLinks.map((item) => {
            const isActive = item.href === "/about";
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
                  item.href === "/about" ? "text-[#8AB4FF]" : "text-slate-200"
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
              rel="noopener noreferrer"
            >
              <FaLinkedinIn className="h-4 w-4" />
            </Link>
            <Link
              href="https://github.com"
              className="rounded-full border border-white/15 p-2 text-slate-300 transition hover:border-[#3B82F6]/60 hover:text-white"
              aria-label="GitHub"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub className="h-4 w-4" />
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

function SkillBadge({ item }: { item: SkillItem }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#111427]/75 p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="font-semibold text-white">{item.name}</span>
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, idx) => (
            <span
              key={`${item.name}-${idx}`}
              className={`h-2.5 w-2.5 rounded-full ${
                idx < item.level ? "bg-[#60A5FA]" : "bg-white/15"
              }`}
            />
          ))}
        </div>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#3B82F6] to-[#60A5FA]"
          style={{ width: `${item.level * 20}%` }}
        />
      </div>
    </div>
  );
}

export function AboutPage() {
  const [activeSkillTab, setActiveSkillTab] = useState<SkillCategory>("Frontend");

  const activeSkills = useMemo(
    () => skillsByCategory[activeSkillTab],
    [activeSkillTab],
  );

  return (
    <div className="relative overflow-hidden">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-20 px-6 pb-20 pt-10 lg:gap-28 lg:px-10">
        <Section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#111427]/45 p-8 lg:p-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_12%,rgba(59,130,246,0.24),transparent_40%),radial-gradient(circle_at_90%_20%,rgba(34,211,238,0.14),transparent_34%)]" />
          <div className="relative z-10 grid items-center gap-10 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              <p className="text-sm text-slate-300">
                <Link href="/" className="hover:text-white">
                  Home
                </Link>{" "}
                → About
              </p>
              <span className="inline-flex items-center rounded-full border border-[#3B82F6]/40 bg-[#3B82F6]/10 px-4 py-1.5 text-sm font-medium text-[#9CC1FF]">
                🌍 Based in India, working worldwide
              </span>
              <h1 className="max-w-2xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                We&apos;re a Small Team That Builds Big Things
              </h1>
              <p className="max-w-2xl text-lg text-slate-300">
                Abaay Tech is a software solutions company founded with one goal: to help businesses worldwide grow through clean, reliable, and scalable software.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-sm text-slate-200">
                  Since 2024
                </span>
                <span className="rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-sm text-slate-200">
                  Lucknow, India
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="relative"
            >
              <div className="absolute -left-6 -top-6 h-32 w-32 rounded-full bg-[#3B82F6]/25 blur-3xl" />
              <div className="absolute -bottom-8 -right-8 h-36 w-36 rounded-full bg-cyan-300/20 blur-3xl" />
              <div className="relative overflow-hidden rounded-3xl border border-[#3B82F6]/40 bg-[#101327] p-6 shadow-[0_0_45px_rgba(59,130,246,0.2)]">
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#9CC1FF]">Team Snapshot</span>
                  <span className="rounded-full border border-emerald-300/40 bg-emerald-300/10 px-2.5 py-1 text-xs text-emerald-200">
                    Small, focused, global
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Core</p>
                    <p className="mt-2 text-2xl font-bold text-white">2+</p>
                    <p className="text-sm text-slate-300">Engineers</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Partners</p>
                    <p className="mt-2 text-2xl font-bold text-white">5+</p>
                    <p className="text-sm text-slate-300">Specialists</p>
                  </div>
                  <div className="col-span-2 rounded-xl border border-white/10 bg-[linear-gradient(130deg,#17203d,#111427)] p-5">
                    <p className="text-sm text-slate-200">
                      We blend product thinking, engineering discipline, and rapid delivery to create software clients can rely on for years.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </Section>

        <Section delay={0.06} className="grid gap-8 lg:grid-cols-[200px_1fr]">
          <div className="flex items-start justify-center lg:justify-start">
            <span className="text-8xl font-bold leading-none text-[#3B82F6]/75">“</span>
          </div>
          <div className="space-y-5 rounded-2xl border-l-2 border-[#3B82F6]/45 bg-[#111427]/45 p-6 lg:p-8">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">How It Started</h2>
            {[
              "Abaay Tech was started by a developer who got tired of seeing businesses struggle with outdated systems, clunky spreadsheets, and software that didn&apos;t actually fit their needs.",
              "We started with a simple belief: great software should be accessible to every business - not just the ones with massive IT budgets. So we built a small, focused team that punches well above its weight.",
              "Today we work with clients across the US, UK, Europe, and beyond - building everything from MVPs to full enterprise systems. Every project gets our full attention, every time.",
            ].map((paragraph, idx) => (
              <motion.p
                key={paragraph}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.55, delay: idx * 0.1 }}
                className="text-slate-300"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        </Section>

        <Section delay={0.08} className="space-y-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">What We Stand For</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-2xl border border-white/10 bg-[#111427]/75 p-6">
              <div className="mb-4 inline-flex rounded-xl border border-[#3B82F6]/35 bg-[#3B82F6]/15 p-2.5 text-[#9CC1FF]">
                <Compass className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">Our Mission</h3>
              <p className="mt-3 text-slate-300">
                To deliver software that solves real problems, ships on time, and works exactly as promised - for businesses of every size, anywhere in the world.
              </p>
            </article>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: <Shield className="h-5 w-5" />,
                  title: "Honesty",
                  text: "We tell you what&apos;s possible and what&apos;s not. No overselling.",
                },
                {
                  icon: <CheckCircle2 className="h-5 w-5" />,
                  title: "Quality",
                  text: "We don&apos;t cut corners. Every line of code is written to last.",
                },
                {
                  icon: <Rocket className="h-5 w-5" />,
                  title: "Speed",
                  text: "We move fast without breaking things. Deadlines are sacred.",
                },
                {
                  icon: <Handshake className="h-5 w-5" />,
                  title: "Partnership",
                  text: "We treat your project like it&apos;s ours. Your success is our success.",
                },
              ].map((value, idx) => (
                <motion.article
                  key={value.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ duration: 0.5, delay: idx * 0.07 }}
                  className="rounded-xl border border-white/10 bg-[#111427]/75 p-4 transition hover:-translate-y-1 hover:border-[#3B82F6]/50"
                >
                  <div className="mb-3 inline-flex rounded-lg border border-[#3B82F6]/30 bg-[#3B82F6]/10 p-2 text-[#9CC1FF]">
                    {value.icon}
                  </div>
                  <h4 className="font-semibold text-white">{value.title}</h4>
                  <p className="mt-2 text-sm text-slate-300">{value.text}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </Section>

        <Section delay={0.1} className="space-y-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">The People Behind the Work</h2>
          <div className="grid gap-6 lg:grid-cols-[1.3fr_auto] lg:items-start">
            <article className="rounded-2xl border border-white/10 bg-[#111427]/75 p-6">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="relative h-24 w-24 shrink-0 rounded-full border-2 border-[#3B82F6]/80 bg-[linear-gradient(135deg,#1d2a52,#101327)]">
                  <div className="absolute inset-2 rounded-full border border-white/10 bg-[#1A223F]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Abaay</h3>
                  <p className="text-[#9CC1FF]">Founder & Lead Developer</p>
                </div>
              </div>
              <p className="mt-5 max-w-3xl text-slate-300">
                Full-stack developer with expertise in React, Node.js, and Odoo. Passionate about building software that makes a real difference for businesses. Based in Lucknow, India.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  "React",
                  "Node.js",
                  "Odoo",
                  "Python",
                  "Supabase",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/15 bg-white/[0.02] px-3 py-1 text-xs text-slate-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex items-center gap-3">
                <Link
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/15 p-2 text-slate-300 transition hover:border-[#3B82F6]/60 hover:text-white"
                  aria-label="LinkedIn profile"
                >
                  <FaLinkedinIn className="h-4 w-4" />
                </Link>
                <Link
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/15 p-2 text-slate-300 transition hover:border-[#3B82F6]/60 hover:text-white"
                  aria-label="GitHub profile"
                >
                  <FaGithub className="h-4 w-4" />
                </Link>
              </div>
              <p className="mt-6 text-sm text-slate-400">
                We also work with a trusted network of freelance designers and developers to scale up on larger projects.
              </p>
            </article>

            <article className="rounded-2xl border border-[#3B82F6]/35 bg-[#121937] p-5 lg:w-[290px]">
              <p className="text-sm font-semibold text-white">Interested in working with us?</p>
              <Link
                href="/contact?subject=Hiring"
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#9CC1FF] hover:text-[#C6DCFF]"
              >
                We&apos;re hiring <ArrowRight className="h-4 w-4" />
              </Link>
            </article>
          </div>
        </Section>

        <Section delay={0.12} className="space-y-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Our Technical Expertise</h2>

          <div className="hidden flex-wrap gap-3 md:flex">
            {(Object.keys(skillsByCategory) as SkillCategory[]).map((tab) => {
              const active = activeSkillTab === tab;
              return (
                <button
                  type="button"
                  key={tab}
                  onClick={() => setActiveSkillTab(tab)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "border-[#3B82F6]/80 bg-[#3B82F6]/20 text-white"
                      : "border-white/15 bg-white/[0.03] text-slate-300 hover:border-[#3B82F6]/45 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <div className="md:hidden">
            <label className="mb-2 block text-sm font-medium text-slate-300" htmlFor="skills-tab">
              Choose category
            </label>
            <select
              id="skills-tab"
              value={activeSkillTab}
              onChange={(e) => setActiveSkillTab(e.target.value as SkillCategory)}
              className="w-full rounded-xl border border-white/15 bg-[#111427] px-4 py-3 text-white"
            >
              {(Object.keys(skillsByCategory) as SkillCategory[]).map((tab) => (
                <option key={tab} value={tab}>
                  {tab}
                </option>
              ))}
            </select>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSkillTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {activeSkills.map((item) => (
                <SkillBadge key={item.name} item={item} />
              ))}
            </motion.div>
          </AnimatePresence>
        </Section>

        <Section delay={0.14} className="space-y-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Our Journey</h2>
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute left-3 top-0 h-full w-[2px] bg-[#3B82F6]/35 md:left-1/2 md:-translate-x-1/2" />
            <div className="space-y-8">
              {milestones.map((item, idx) => {
                const leftSide = idx % 2 === 0;
                return (
                  <motion.article
                    key={item.period}
                    initial={{ opacity: 0, x: leftSide ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.28 }}
                    transition={{ duration: 0.55 }}
                    className={`relative md:grid md:grid-cols-2 ${item.future ? "opacity-70" : ""}`}
                  >
                    <div className={`pl-10 md:pl-0 ${leftSide ? "md:pr-10" : "md:order-2 md:pl-10"}`}>
                      <div className="rounded-xl border border-white/10 bg-[#111427]/75 p-5">
                        <p className="text-xs uppercase tracking-[0.14em] text-[#9CC1FF]">{item.period}</p>
                        <h3 className="mt-2 text-xl font-semibold text-white">{item.title}</h3>
                        <p className="mt-2 text-slate-300">{item.body}</p>
                      </div>
                    </div>
                    <motion.span
                      className="absolute left-3 top-5 h-3.5 w-3.5 -translate-x-1/2 rounded-full border border-[#9CC1FF]/50 bg-[#3B82F6] md:left-1/2"
                      initial={{ scale: 0.8 }}
                      whileInView={{ scale: [0.8, 1.2, 1] }}
                      viewport={{ once: true, amount: 0.5 }}
                      transition={{ duration: 0.45 }}
                    />
                  </motion.article>
                );
              })}
            </div>
          </div>
        </Section>

        <Section delay={0.16} className="space-y-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Clients & Collaborations</h2>
          <div className="grid gap-7 rounded-2xl border border-white/10 bg-[#111427]/55 p-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {["NOVA Group", "AtlasPay", "HelixOps", "UrbanGrid", "BlueOrbit"].map((brand) => (
                <div
                  key={brand}
                  className="flex h-14 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-sm font-semibold tracking-wide text-slate-400 opacity-70 grayscale transition hover:opacity-100"
                >
                  {brand}
                </div>
              ))}
            </div>
            <p className="text-slate-300">
              We&apos;ve worked with startups, SMEs, and enterprise teams across the US, UK, Germany, and Australia.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-slate-200">
              <span className="rounded-full border border-white/15 px-3 py-1.5">🇺🇸 United States</span>
              <span className="rounded-full border border-white/15 px-3 py-1.5">🇬🇧 United Kingdom</span>
              <span className="rounded-full border border-white/15 px-3 py-1.5">🇩🇪 Germany</span>
            </div>
          </div>
        </Section>

        <Section delay={0.18} className="rounded-3xl border border-[#3B82F6]/30 bg-[#121937] p-8 shadow-[0_0_60px_rgba(59,130,246,0.2)] lg:p-10">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-white">Want to Work With Us?</h2>
              <p className="mt-3 max-w-2xl text-slate-300">
                We&apos;re selective about the projects we take on - which means the ones we do, we do really well.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="rounded-full border border-[#3B82F6]/70 bg-[#3B82F6] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#60A5FA]"
              >
                Start a Project
              </Link>
              <Link
                href="/portfolio"
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-slate-100 transition hover:border-[#3B82F6]/60 hover:text-white"
              >
                See Our Work
              </Link>
            </div>
          </div>
        </Section>
      </main>

      <Footer />
    </div>
  );
}
