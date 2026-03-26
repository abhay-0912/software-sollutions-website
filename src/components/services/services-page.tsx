"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Briefcase,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  Cloud,
  Code2,
  Database,
  Menu,
  Monitor,
  Server,
  Sparkles,
  Workflow,
  Wrench,
  X,
} from "lucide-react";
import { FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { useEffect, useMemo, useState } from "react";

type Service = {
  id: string | number;
  title: string;
  slug: string;
  description: string;
  icon: string | null;
  features: string[] | null;
  price_range: string | null;
  order: number;
};

type ServicesPageProps = {
  services: Service[];
};

const navLinks = [
  { label: "Services", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const fallbackServices: Service[] = [
  {
    id: "svc-web",
    title: "Web & Mobile Applications",
    slug: "web",
    description:
      "We design and build fast, scalable web and mobile apps tailored to your business needs. From MVPs to full-scale platforms, built with modern frameworks and clean architecture.",
    icon: "web",
    features: [
      "React / Next.js frontends",
      "Node.js / Django backends",
      "REST & GraphQL APIs",
      "Mobile-first responsive design",
      "Cloud deployment (AWS / Vercel / Railway)",
    ],
    price_range: "From $1,500",
    order: 1,
  },
  {
    id: "svc-erp",
    title: "ERP & CRM Systems",
    slug: "erp",
    description:
      "Custom enterprise resource planning and CRM systems that replace spreadsheet chaos with structured, automated workflows. Built on Odoo or fully custom, we handle it all.",
    icon: "erp",
    features: [
      "Custom Odoo implementation and modules",
      "Inventory, HR, accounting modules",
      "Sales pipeline and CRM workflows",
      "Multi-user roles and permissions",
      "Data migration from legacy systems",
    ],
    price_range: "From $5,000",
    order: 2,
  },
  {
    id: "svc-automation",
    title: "Automation & Integrations",
    slug: "automation",
    description:
      "Stop doing manually what software can do for you. We build custom automation pipelines and API integrations that connect your tools and eliminate repetitive tasks.",
    icon: "automation",
    features: [
      "API integrations (CRMs, payments, ERPs)",
      "Workflow automation (Zapier replacements)",
      "Custom n8n / Make pipelines",
      "Scheduled jobs and background tasks",
      "Webhook systems and event-driven flows",
    ],
    price_range: "Custom",
    order: 3,
  },
];

const faqItems = [
  {
    q: "How long does a typical project take?",
    a: "Most web apps take 4-8 weeks. ERP systems typically take 8-16 weeks depending on complexity.",
  },
  {
    q: "Do you work with international clients?",
    a: "Yes. We work with clients across the US, UK, Europe, and Australia. All communication is in English.",
  },
  {
    q: "What's your payment structure?",
    a: "We typically work with 50% upfront and 50% on delivery for fixed-price projects.",
  },
  {
    q: "Do you provide post-launch support?",
    a: "Yes. We offer monthly maintenance retainers starting at $300/month.",
  },
  {
    q: "Can you work with our existing codebase?",
    a: "Absolutely. We regularly take over and extend existing projects.",
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
            const isActive = item.href === "/services";
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`text-sm font-medium transition ${
                  isActive
                    ? "text-[#8AB4FF]"
                    : "text-slate-300 hover:text-white"
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
                  item.href === "/services" ? "text-[#8AB4FF]" : "text-slate-200"
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

function ServiceGraphic({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#111427] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <div className="mb-3 flex items-center gap-2 border-b border-white/10 pb-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="ml-2 text-xs text-slate-400">web-platform.tsx</span>
        </div>
        <pre className="text-xs leading-6 text-slate-300">
          <code>{`export function Dashboard() {
  return <AppShell>
    <AnalyticsPanel />
    <WorkflowBoard />
  </AppShell>;
}`}</code>
        </pre>
      </div>
    );
  }

  if (index === 1) {
    return (
      <div className="rounded-2xl border border-white/15 bg-[#111427] p-4">
        <div className="mb-4 h-8 w-1/2 rounded bg-white/10" />
        <div className="grid grid-cols-[180px_1fr] gap-4">
          <div className="space-y-2">
            <div className="h-8 rounded bg-white/10" />
            <div className="h-8 rounded bg-white/10" />
            <div className="h-8 rounded bg-white/10" />
          </div>
          <div className="space-y-3">
            <div className="h-20 rounded bg-[#1A2340]" />
            <div className="h-28 rounded bg-white/10" />
            <div className="h-16 rounded bg-white/10" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/15 bg-[#111427] p-4">
      <svg viewBox="0 0 460 240" className="h-full w-full">
        <g fill="none" stroke="#3B82F6" strokeWidth="2">
          <rect x="20" y="20" width="120" height="46" rx="10" />
          <rect x="170" y="100" width="120" height="46" rx="10" />
          <rect x="320" y="20" width="120" height="46" rx="10" />
          <rect x="320" y="170" width="120" height="46" rx="10" />
          <path d="M140 42h70" />
          <path d="M290 122h30v-80" />
          <path d="M230 146v24h90" />
        </g>
        <g fill="#9CC1FF" fontSize="12" fontFamily="DM Sans, sans-serif">
          <text x="36" y="48">CRM Trigger</text>
          <text x="188" y="128">Validation</text>
          <text x="338" y="48">ERP Sync</text>
          <text x="333" y="198">Client Notification</text>
        </g>
      </svg>
    </div>
  );
}

function ServiceIcon({ slug }: { slug: string }) {
  if (slug.includes("erp")) return <Database className="h-6 w-6" />;
  if (slug.includes("automation")) return <Workflow className="h-6 w-6" />;
  return <Code2 className="h-6 w-6" />;
}

function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <div className="space-y-3">
      {faqItems.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <article
            key={item.q}
            className="rounded-xl border border-white/10 bg-[#111427]/75"
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-5 px-5 py-4 text-left"
              onClick={() => setOpenIndex(isOpen ? -1 : idx)}
            >
              <span className="font-semibold text-white">{item.q}</span>
              <ChevronDown
                className={`h-4 w-4 shrink-0 text-slate-300 transition ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen ? (
              <div className="border-t border-white/10 px-5 py-4 text-slate-300">{item.a}</div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

export function ServicesPage({ services }: ServicesPageProps) {
  const serviceList = useMemo(() => {
    const rows = services.length > 0 ? services : fallbackServices;
    return rows.slice(0, 3).map((service, idx) => {
      const fallback = fallbackServices[idx];
      return {
        ...service,
        slug: service.slug || fallback.slug,
        description: service.description || fallback.description,
        features:
          service.features && service.features.length > 0
            ? service.features
            : fallback.features,
      };
    });
  }, [services]);

  const techGroups = [
    {
      title: "Frontend",
      icon: <Monitor className="h-4 w-4" />,
      items: ["React", "Next.js", "Tailwind CSS", "TypeScript"],
    },
    {
      title: "Backend",
      icon: <Server className="h-4 w-4" />,
      items: ["Node.js", "Django", "FastAPI", "PostgreSQL"],
    },
    {
      title: "ERP",
      icon: <Building2 className="h-4 w-4" />,
      items: ["Odoo", "ERPNext"],
    },
    {
      title: "Automation",
      icon: <Workflow className="h-4 w-4" />,
      items: ["n8n", "Make", "Zapier", "Python"],
    },
    {
      title: "Cloud",
      icon: <Cloud className="h-4 w-4" />,
      items: ["Vercel", "AWS", "Railway", "Supabase"],
    },
  ];

  return (
    <div className="relative overflow-hidden">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-20 px-6 pb-20 pt-10 lg:gap-28 lg:px-10">
        <Section className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#111427]/40 p-8 lg:p-12">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:36px_36px] opacity-25" />
            <motion.div
              className="absolute -left-16 top-8 h-44 w-44 rounded-2xl border border-[#3B82F6]/40"
              animate={{ y: [0, 16, 0], rotate: [0, 6, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute right-12 top-16 h-24 w-24 rounded-full border border-[#22D3EE]/40"
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          <div className="relative z-10 space-y-6">
            <p className="text-sm text-slate-300">
              <Link href="/" className="hover:text-white">
                Home
              </Link>{" "}
              → Services
            </p>
            <span className="inline-flex items-center rounded-full border border-[#3B82F6]/40 bg-[#3B82F6]/10 px-4 py-1.5 text-sm font-medium text-[#9CC1FF]">
              🛠️ Full-stack solutions
            </span>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Everything You Need to Build and Scale
            </h1>
            <p className="max-w-2xl text-lg text-slate-300">
              From idea to deployment, we cover web apps, enterprise systems, and intelligent automation.
            </p>
          </div>
        </Section>

        <Section className="space-y-12" delay={0.08}>
          {serviceList.map((service, idx) => {
            const isReverse = idx % 2 === 1;
            const ctaHref =
              idx === 0
                ? "/contact?service=web"
                : idx === 1
                  ? "/contact?service=erp"
                  : "/contact?service=automation";
            const ctaLabel =
              idx === 0
                ? "Start a Web Project"
                : idx === 1
                  ? "Discuss Your ERP Needs"
                  : "Automate My Workflow";

            return (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, x: isReverse ? 60 : -60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="grid items-center gap-8 rounded-3xl border border-white/10 bg-[#111427]/70 p-6 lg:grid-cols-2 lg:p-8"
              >
                <div className={`${isReverse ? "lg:order-2" : ""} space-y-5`}>
                  <div className="inline-flex rounded-xl border border-[#3B82F6]/35 bg-[#3B82F6]/15 p-2 text-[#9CC1FF]">
                    <ServiceIcon slug={service.slug} />
                  </div>
                  <h2 className="text-3xl font-bold text-white">{service.title}</h2>
                  <p className="text-slate-300">{service.description}</p>
                  <ul className="space-y-2">
                    {(service.features ?? []).map((feature) => (
                      <li key={`${service.id}-${feature}`} className="flex items-start gap-2 text-slate-200">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={ctaHref}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#8AB4FF] hover:text-[#B6D2FF]"
                  >
                    {ctaLabel} <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className={isReverse ? "lg:order-1" : ""}>
                  <ServiceGraphic index={idx} />
                </div>
              </motion.article>
            );
          })}
        </Section>

        <Section className="space-y-8" delay={0.12}>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">How We Work</h2>
          <div className="grid gap-4 md:grid-cols-5">
            {[
              {
                title: "Discovery Call",
                desc: "We learn about your goals, stack, and timeline.",
                icon: <Briefcase className="h-5 w-5" />,
              },
              {
                title: "Proposal and Scope",
                desc: "You get a detailed plan, timeline, and fixed price.",
                icon: <Wrench className="h-5 w-5" />,
              },
              {
                title: "Design and Build",
                desc: "Iterative development with weekly progress updates.",
                icon: <Code2 className="h-5 w-5" />,
              },
              {
                title: "Testing and Review",
                desc: "QA, feedback rounds, and final refinements.",
                icon: <CheckCircle2 className="h-5 w-5" />,
              },
              {
                title: "Launch and Support",
                desc: "We deploy, monitor, and support post-launch.",
                icon: <Sparkles className="h-5 w-5" />,
              },
            ].map((step, idx, arr) => (
              <div key={step.title} className="relative rounded-xl border border-white/10 bg-[#111427]/70 p-5">
                {idx < arr.length - 1 ? (
                  <>
                    <div className="absolute left-8 top-[58px] h-8 w-[2px] bg-[#3B82F6]/45 md:hidden" />
                    <div className="absolute right-[-14px] top-8 hidden h-[2px] w-7 bg-[#3B82F6]/45 md:block" />
                  </>
                ) : null}
                <div
                  className={`mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold ${
                    idx === 0
                      ? "border border-[#3B82F6]/70 bg-[#3B82F6]/25 text-[#d5e7ff]"
                      : "border border-[#3B82F6]/35 bg-[#3B82F6]/10 text-[#9CC1FF]"
                  }`}
                >
                  <span>{idx + 1}</span>
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{step.desc}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section className="space-y-8" delay={0.16}>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Technologies We Use</h2>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {techGroups.map((group) => (
              <article key={group.title} className="rounded-xl border border-white/10 bg-[#111427]/70 p-5">
                <h3 className="mb-4 inline-flex items-center gap-2 text-lg font-semibold text-white">
                  {group.icon}
                  {group.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-white/15 px-3 py-1.5 text-sm text-slate-200 transition hover:scale-105 hover:border-[#3B82F6]/60"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section className="space-y-8" delay={0.2}>
          <div>
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Transparent Pricing</h2>
            <p className="mt-3 text-slate-300">
              Every project is scoped individually, but here is a rough idea of what to expect.
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {[
              {
                name: "Starter",
                price: "From $1,500",
                desc: "Simple web app or landing page",
                points: ["Up to 5 pages", "Basic CMS", "2 revisions"],
                cta: "Get a quote",
                featured: false,
              },
              {
                name: "Business",
                price: "From $5,000",
                desc: "Custom web app or ERP module",
                points: [
                  "Full custom build",
                  "Integrations",
                  "Ongoing support",
                  "Unlimited revisions",
                ],
                cta: "Get a quote",
                featured: true,
              },
              {
                name: "Enterprise",
                price: "Custom pricing",
                desc: "Large-scale ERP or SaaS platform",
                points: [
                  "Full discovery",
                  "Dedicated team",
                  "SLA",
                  "Priority support",
                ],
                cta: "Let's talk",
                featured: false,
              },
            ].map((plan) => (
              <article
                key={plan.name}
                className={`rounded-2xl border p-6 ${
                  plan.featured
                    ? "border-[#3B82F6]/60 bg-[#121937] shadow-[0_0_40px_rgba(59,130,246,0.2)]"
                    : "border-white/10 bg-[#111427]/70"
                }`}
              >
                <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                <p className="mt-2 text-2xl font-bold text-[#9CC1FF]">{plan.price}</p>
                <p className="mt-2 text-slate-300">{plan.desc}</p>
                <ul className="mt-5 space-y-2">
                  {plan.points.map((point) => (
                    <li key={point} className="flex items-center gap-2 text-sm text-slate-200">
                      <Check className="h-4 w-4 text-emerald-400" />
                      {point}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className="mt-6 inline-flex rounded-full border border-[#3B82F6]/70 bg-[#3B82F6]/15 px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#3B82F6]/25"
                >
                  {plan.cta}
                </Link>
              </article>
            ))}
          </div>
        </Section>

        <Section className="space-y-8" delay={0.24}>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Common Questions</h2>
          <FaqAccordion />
        </Section>

        <Section className="rounded-3xl border border-[#3B82F6]/30 bg-[#121937] p-8 shadow-[0_0_60px_rgba(59,130,246,0.2)] lg:p-10" delay={0.28}>
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-3xl font-bold text-white">Ready to start your project?</h2>
              <p className="mt-3 max-w-2xl text-slate-300">
                Book a free 30-minute discovery call. No commitment, just clarity.
              </p>
            </div>
            <Link
              href="/contact"
              className="rounded-full border border-[#3B82F6]/70 bg-[#3B82F6] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#60A5FA]"
            >
              Book Free Call
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
