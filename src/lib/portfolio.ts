export type PortfolioCategory = "All" | "Web Apps" | "ERP / CRM" | "Automation" | "SaaS";

export type PortfolioProject = {
  id: string | number;
  title: string;
  slug: string;
  description: string;
  long_description: string | null;
  challenge: string | null;
  solution: string | null;
  results: string | null;
  cover_image: string | null;
  screenshots: string[] | null;
  tech_stack: string[] | string | null;
  category: string;
  client_name: string | null;
  industry: string | null;
  timeline: string | null;
  team_size: string | null;
  live_url: string | null;
  github_url: string | null;
  featured: boolean | null;
  published: boolean | null;
  created_at: string | null;
};

export type PortfolioTestimonial = {
  id: string | number;
  name: string;
  company: string;
  message: string;
  rating: number;
  avatar_url: string | null;
};

function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function normalizeProject(project: PortfolioProject): PortfolioProject {
  return {
    ...project,
    slug: project.slug?.trim() ? project.slug : slugifyTitle(project.title),
  };
}

export function toTechArray(value: PortfolioProject["tech_stack"]): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function toScreenshotsArray(project: PortfolioProject): string[] {
  const raw = Array.isArray(project.screenshots) ? project.screenshots : [];
  const sanitized = raw.filter((item): item is string => Boolean(item));

  if (sanitized.length >= 3) return sanitized.slice(0, 4);

  const fallback = project.cover_image || "/og-abaay.svg";
  while (sanitized.length < 3) {
    sanitized.push(fallback);
  }

  return sanitized.slice(0, 4);
}

export const portfolioFilters: PortfolioCategory[] = [
  "All",
  "Web Apps",
  "ERP / CRM",
  "Automation",
  "SaaS",
];

export const fallbackProjects: PortfolioProject[] = [
  {
    id: "fallback-1",
    title: "LogiTrack - Logistics ERP",
    slug: "logitrack-logistics-erp",
    description:
      "Custom Odoo-based ERP for a UK logistics company. Modules: inventory, fleet, HR, and billing.",
    long_description:
      "LogiTrack unified warehouse operations, fleet management, payroll, and billing in one central ERP. The platform eliminated scattered spreadsheets and made branch-level reporting available in real time.",
    challenge:
      "The client operated across multiple depots with disconnected systems for inventory, fleet, and invoicing, causing delays and frequent reconciliation errors.",
    solution:
      "We delivered an Odoo-based ERP suite with tailored modules for dispatch, route tracking, HR, and billing. We also automated nightly reporting and role-based dashboards for operations managers.",
    results:
      "40% reduction in manual data entry and 28% faster month-end reconciliation in the first quarter.",
    cover_image: null,
    screenshots: [],
    tech_stack: ["Odoo", "Python", "PostgreSQL"],
    category: "ERP / CRM",
    client_name: "Confidential",
    industry: "Logistics",
    timeline: "8 weeks",
    team_size: "2 developers",
    live_url: null,
    github_url: null,
    featured: true,
    published: true,
    created_at: "2025-10-15T10:00:00.000Z",
  },
  {
    id: "fallback-2",
    title: "Invozy - Invoice SaaS",
    slug: "invozy-invoice-saas",
    description:
      "Multi-tenant invoicing platform with Stripe payments, PDF generation, and client portal.",
    long_description:
      "Invozy is a modern invoicing SaaS product for service businesses managing recurring and one-off invoices. It includes tenant isolation, payment tracking, and branded client experiences.",
    challenge:
      "The client needed a secure multi-tenant SaaS architecture with clean onboarding and reliable online payments.",
    solution:
      "We built a Next.js SaaS app with tenant-aware auth, Stripe billing, PDF invoice generation, and an admin panel for subscription and usage analytics.",
    results:
      "Reduced average invoice collection time by 31% and improved on-time payments through automated reminders.",
    cover_image: null,
    screenshots: [],
    tech_stack: ["Next.js", "Node.js", "Stripe", "Supabase"],
    category: "SaaS",
    client_name: "Confidential",
    industry: "Fintech",
    timeline: "10 weeks",
    team_size: "3 developers",
    live_url: null,
    github_url: null,
    featured: false,
    published: true,
    created_at: "2025-09-04T10:00:00.000Z",
  },
  {
    id: "fallback-3",
    title: "Automate.io Clone",
    slug: "automate-io-clone",
    description:
      "Custom n8n-based automation platform for a German agency replacing Zapier internally.",
    long_description:
      "A private automation hub that let internal teams orchestrate CRM, ads, and reporting workflows without third-party workflow costs.",
    challenge:
      "Their team ran hundreds of monthly automations on SaaS tools with rising costs and limited control over retry/error logic.",
    solution:
      "We deployed a custom n8n setup with hardened queue workers, reusable templates, and event tracing for non-technical team members.",
    results:
      "50,000+ manual task minutes automated monthly and significant savings on integration tooling.",
    cover_image: null,
    screenshots: [],
    tech_stack: ["n8n", "Node.js", "PostgreSQL", "Docker"],
    category: "Automation",
    client_name: "Confidential",
    industry: "Marketing",
    timeline: "6 weeks",
    team_size: "2 developers",
    live_url: null,
    github_url: null,
    featured: false,
    published: true,
    created_at: "2025-08-21T10:00:00.000Z",
  },
  {
    id: "fallback-4",
    title: "MediBook - Clinic Management",
    slug: "medibook-clinic-management",
    description:
      "Appointment booking and patient management system for a US medical clinic.",
    long_description:
      "MediBook modernized appointment scheduling, reminders, and clinician workflows through one secure system accessible across desktop and tablet.",
    challenge:
      "The clinic relied on fragmented scheduling tools and manual phone follow-ups, creating no-shows and poor visibility.",
    solution:
      "We built a web platform with smart scheduling, Twilio reminders, and patient profile timelines for faster intake and follow-up.",
    results:
      "No-show rate dropped by 24% and front-desk workload fell significantly.",
    cover_image: null,
    screenshots: [],
    tech_stack: ["React", "Django", "PostgreSQL", "Twilio"],
    category: "Web Apps",
    client_name: "Confidential",
    industry: "Healthcare",
    timeline: "9 weeks",
    team_size: "3 developers",
    live_url: null,
    github_url: null,
    featured: false,
    published: true,
    created_at: "2025-07-11T10:00:00.000Z",
  },
  {
    id: "fallback-5",
    title: "RetailEdge - CRM",
    slug: "retailedge-crm",
    description:
      "Sales pipeline CRM for a retail chain with multi-branch support and analytics.",
    long_description:
      "RetailEdge gave regional managers one place to manage leads, store conversion pipelines, and branch-level sales forecasting.",
    challenge:
      "The chain lacked a unified sales process and had no consistent method to compare branch performance.",
    solution:
      "We delivered a custom CRM with pipeline stages, branch segmentation, and insight dashboards for executive reporting.",
    results:
      "Lead response times improved by 37% and conversion visibility improved across all branches.",
    cover_image: null,
    screenshots: [],
    tech_stack: ["React", "Node.js", "Supabase"],
    category: "ERP / CRM",
    client_name: "Confidential",
    industry: "Retail",
    timeline: "7 weeks",
    team_size: "2 developers",
    live_url: null,
    github_url: null,
    featured: false,
    published: true,
    created_at: "2025-06-16T10:00:00.000Z",
  },
  {
    id: "fallback-6",
    title: "ShipEasy - Shipping Dashboard",
    slug: "shipeasy-shipping-dashboard",
    description:
      "Real-time shipment tracking dashboard integrating FedEx, DHL, and UPS APIs.",
    long_description:
      "ShipEasy consolidated shipping statuses from major carriers into a single operations cockpit for support and logistics teams.",
    challenge:
      "Support teams lacked a live cross-carrier view, forcing manual status checks for each ticket.",
    solution:
      "We built a Next.js dashboard with normalized carrier events, status timelines, and SLA alerting.",
    results:
      "Average support resolution time dropped by 33% after launch.",
    cover_image: null,
    screenshots: [],
    tech_stack: ["Next.js", "TypeScript", "REST APIs"],
    category: "Web Apps",
    client_name: "Confidential",
    industry: "Logistics",
    timeline: "5 weeks",
    team_size: "2 developers",
    live_url: null,
    github_url: null,
    featured: false,
    published: true,
    created_at: "2025-05-02T10:00:00.000Z",
  },
];

export const fallbackMiniTestimonials: PortfolioTestimonial[] = [
  {
    id: "pt-1",
    name: "Emily Carter",
    company: "Northline Logistics",
    rating: 5,
    message:
      "Abaay turned our messy operations into one clean system. Their delivery speed and clarity were outstanding.",
    avatar_url: null,
  },
  {
    id: "pt-2",
    name: "Jonas Weber",
    company: "Metrik Digital",
    rating: 5,
    message:
      "The automation platform they built saved our team hours every day and replaced expensive third-party tools.",
    avatar_url: null,
  },
];

export function categoryColorClass(category: string): string {
  const key = category.toLowerCase();
  if (key.includes("erp") || key.includes("crm")) {
    return "border-cyan-300/40 bg-cyan-400/10 text-cyan-200";
  }

  if (key.includes("automation")) {
    return "border-emerald-300/40 bg-emerald-400/10 text-emerald-200";
  }

  if (key.includes("saas")) {
    return "border-violet-300/40 bg-violet-400/10 text-violet-200";
  }

  return "border-[#9CC1FF]/45 bg-[#3B82F6]/15 text-[#C6DCFF]";
}
