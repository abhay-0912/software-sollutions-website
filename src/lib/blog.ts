export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  author: string | null;
  author_avatar: string | null;
  author_bio: string | null;
  tags: string[] | null;
  read_time: number | null;
  featured: boolean | null;
  published: boolean | null;
  created_at: string | null;
  updated_at: string | null;
};

export const blogCategoryFilters = [
  "All",
  "Web Dev",
  "ERP & Odoo",
  "Automation",
  "Business",
  "Tutorials",
  "Case Studies",
] as const;

export type BlogCategoryFilter = (typeof blogCategoryFilters)[number];

export const blurDataUrl =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y8hP3kAAAAASUVORK5CYII=";

export function estimateReadTime(content: string, explicitReadTime?: number | null): number {
  if (explicitReadTime && explicitReadTime > 0) return explicitReadTime;
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function formatPostDate(date: string | null): string {
  if (!date) return "Unknown date";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getPrimaryCategory(tags: string[] | null): string {
  if (!tags || tags.length === 0) return "Web Dev";
  const known = ["Web Dev", "ERP & Odoo", "Automation", "Business", "Tutorials", "Case Studies"];
  const match = tags.find((tag) => known.includes(tag));
  return match || tags[0];
}

export function categoryBadgeClass(category: string): string {
  if (category === "ERP & Odoo") return "border-cyan-300/45 bg-cyan-400/15 text-cyan-100";
  if (category === "Automation") return "border-emerald-300/45 bg-emerald-400/15 text-emerald-100";
  if (category === "Business") return "border-amber-300/45 bg-amber-400/15 text-amber-100";
  if (category === "Tutorials") return "border-violet-300/45 bg-violet-400/15 text-violet-100";
  if (category === "Case Studies") return "border-rose-300/45 bg-rose-400/15 text-rose-100";
  return "border-[#9CC1FF]/45 bg-[#3B82F6]/15 text-[#C6DCFF]";
}

export function slugifyHeading(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const fallbackBlogPosts: BlogPost[] = [
  {
    id: "fallback-blog-1",
    title: "How We Built a Custom ERP for a UK Logistics Company in 8 Weeks",
    slug: "how-we-built-custom-erp-for-uk-logistics-company",
    excerpt:
      "A behind-the-scenes look at how we scoped, designed, and delivered a full Odoo implementation on a tight deadline - and what we learned.",
    content: `## Why the client reached out\n\nThe logistics team had disconnected tools for dispatch, invoicing, and route operations. Managers were exporting spreadsheets every evening just to build a partial performance report.\n\n## The 8-week delivery plan\n\n### Week 1: Discovery and process mapping\nWe interviewed operations, finance, and dispatch teams. We mapped each workflow and highlighted handoffs where delays or duplicate work happened.\n\n### Week 2 to 4: Core ERP modules\nWe shipped inventory, fleet tracking, and billing modules first because they carried the biggest operational risk.\n\n### Week 5 to 6: Permissions and dashboards\nBranch managers, operations leads, and finance admins got role-based dashboards with tailored metrics.\n\n### Week 7 to 8: Migration and go-live\nWe migrated key data in batches, validated reconciliations, and trained users before launch day.\n\n## Key lessons\n\n- Keep integrations narrow at first and expand after stabilization.\n- Define ownership for each workflow early.\n- Weekly demos reduce stakeholder anxiety and prevent rework.\n\n## What changed post-launch\n\nManual reporting dropped sharply, invoicing became faster, and management finally had one trusted source of truth for day-to-day decisions.`,
    cover_image: null,
    author: "Abaay",
    author_avatar: null,
    author_bio:
      "Founder at Abaay Tech. Builds ERP, automation, and scalable web platforms for international clients.",
    tags: ["ERP & Odoo", "Case Studies"],
    read_time: 7,
    featured: true,
    published: true,
    created_at: "2026-03-10T10:00:00.000Z",
    updated_at: "2026-03-10T10:00:00.000Z",
  },
  {
    id: "fallback-blog-2",
    title: "Why Most Businesses Should Replace Zapier With Custom Automation",
    slug: "replace-zapier-with-custom-automation",
    excerpt:
      "Zapier is great - until it isn't. Here's when it makes sense to build your own automation pipeline and how to do it with n8n.",
    content: `## The hidden cost of no-code automations\n\nNo-code platforms help teams move quickly at first, but costs and complexity rise with volume and branching logic.\n\n## When custom automation makes sense\n\n- You run high-frequency workflows daily.\n- You need better retry logic and observability.\n- You need tighter security and compliance controls.\n\n## Building with n8n\n\n### Start with workflow inventory\nList each automation by trigger, destination, owner, and failure impact.\n\n### Add queue and retry strategy\nAvoid silent failures by introducing retries and dead-letter handling.\n\n### Centralize logs\nTrack every event across integrations so operations teams can debug quickly.\n\n## Final takeaway\n\nCustom automation is not about replacing every SaaS tool. It is about controlling mission-critical workflows where reliability and cost matter most.`,
    cover_image: null,
    author: "Abaay",
    author_avatar: null,
    author_bio:
      "Founder at Abaay Tech. Builds ERP, automation, and scalable web platforms for international clients.",
    tags: ["Automation", "Tutorials"],
    read_time: 5,
    featured: false,
    published: true,
    created_at: "2026-03-03T10:00:00.000Z",
    updated_at: "2026-03-03T10:00:00.000Z",
  },
  {
    id: "fallback-blog-3",
    title: "Next.js 14 vs Remix: Which Should You Use for Your Next Web App?",
    slug: "nextjs-14-vs-remix-which-should-you-use",
    excerpt:
      "We've built production apps with both. Here's an honest comparison of performance, DX, and when to pick one over the other.",
    content: `## The short answer\n\nBoth frameworks are excellent. Choose based on your product constraints, deployment model, and team familiarity.\n\n## Next.js 14 strengths\n\n- Mature ecosystem and hosting options.\n- App Router + Server Components for modern patterns.\n- Strong enterprise support and integration ecosystem.\n\n## Remix strengths\n\n- Excellent data loading mental model.\n- Progressive enhancement by default.\n- Lean runtime behavior in certain SSR-heavy apps.\n\n## Decision framework\n\n### Choose Next.js when\nYou need broad ecosystem support, rich UI composition, and straightforward scaling with Vercel or custom infra.\n\n### Choose Remix when\nYour team values request/response purity and form-driven workflows with fewer abstractions.\n\n## Final recommendation\n\nIf your team already ships Next.js successfully, the cost of switching is rarely worth it. Focus on product execution first.`,
    cover_image: null,
    author: "Abaay",
    author_avatar: null,
    author_bio:
      "Founder at Abaay Tech. Builds ERP, automation, and scalable web platforms for international clients.",
    tags: ["Web Dev", "Tutorials"],
    read_time: 8,
    featured: false,
    published: true,
    created_at: "2026-02-26T10:00:00.000Z",
    updated_at: "2026-02-26T10:00:00.000Z",
  },
  {
    id: "fallback-blog-4",
    title: "How to Get Your First International Client as a Developer in India",
    slug: "how-to-get-your-first-international-client",
    excerpt:
      "The exact steps we took to land our first US client - Upwork profile tips, proposal templates, and how to price your work confidently.",
    content: `## Start with one niche\n\nDo not market yourself as a generic developer. Pick a concrete outcome, such as "custom ERP integrations for logistics teams."\n\n## Build proof before pitching\n\nCreate two or three realistic case-style examples that show decision making, not just screenshots.\n\n## Proposal structure that converts\n\n- Restate the client's business problem.\n- Show your implementation plan in phases.\n- Add timeline and communication rhythm.\n\n## Pricing without undercutting\n\nPrice for value and complexity, not hours alone. Underpricing creates distrust and unstable projects.\n\n## Final note\n\nConsistency in outreach beats one-time bursts. High-quality proposals over several weeks compound into opportunities.`,
    cover_image: null,
    author: "Abaay",
    author_avatar: null,
    author_bio:
      "Founder at Abaay Tech. Builds ERP, automation, and scalable web platforms for international clients.",
    tags: ["Business"],
    read_time: 6,
    featured: false,
    published: true,
    created_at: "2026-02-19T10:00:00.000Z",
    updated_at: "2026-02-19T10:00:00.000Z",
  },
  {
    id: "fallback-blog-5",
    title: "Supabase vs Firebase in 2025: A Developer's Honest Take",
    slug: "supabase-vs-firebase-in-2025",
    excerpt:
      "We've used both in production. Here's where Supabase wins, where Firebase still holds its ground, and which one we recommend for most projects.",
    content: `## Product direction matters\n\nThe right backend depends on your team's stack, SQL comfort, and scaling model.\n\n## Supabase advantages\n\n- Postgres-first data model and SQL power.\n- Straightforward auth and storage workflows.\n- Better fit for teams that want relational modeling.\n\n## Firebase advantages\n\n- Deep mobile ecosystem and tooling.\n- Real-time use cases can be very quick to implement.\n\n## Practical recommendation\n\nFor most web B2B platforms with structured data, we prefer Supabase. For certain mobile-first real-time apps, Firebase remains strong.`,
    cover_image: null,
    author: "Abaay",
    author_avatar: null,
    author_bio:
      "Founder at Abaay Tech. Builds ERP, automation, and scalable web platforms for international clients.",
    tags: ["Web Dev", "Tutorials"],
    read_time: 6,
    featured: false,
    published: true,
    created_at: "2026-02-11T10:00:00.000Z",
    updated_at: "2026-02-11T10:00:00.000Z",
  },
  {
    id: "fallback-blog-6",
    title: "Odoo 17: What's New and Should You Upgrade?",
    slug: "odoo-17-whats-new-and-should-you-upgrade",
    excerpt:
      "A practical breakdown of the most important changes in Odoo 17 - new UI, updated modules, and our migration experience.",
    content: `## What changed in Odoo 17\n\nThe update includes UI improvements, performance refinements, and cleaner workflows in several core modules.\n\n## Upgrade decision checklist\n\n- Are your custom modules version-compatible?\n- Can your team handle staged migration testing?\n- Do new module improvements justify migration effort now?\n\n## Migration strategy we use\n\n### 1. Clone and audit\nAudit custom modules and external integrations in a staging copy.\n\n### 2. Dry-run migration\nRun full migration with sample production data and identify breakpoints early.\n\n### 3. Controlled rollout\nMigrate in planned windows and monitor key operational KPIs after go-live.\n\n## Bottom line\n\nUpgrade when business value is clear and technical risk is controlled. Avoid rushed migrations without testing discipline.`,
    cover_image: null,
    author: "Abaay",
    author_avatar: null,
    author_bio:
      "Founder at Abaay Tech. Builds ERP, automation, and scalable web platforms for international clients.",
    tags: ["ERP & Odoo"],
    read_time: 9,
    featured: false,
    published: true,
    created_at: "2026-02-03T10:00:00.000Z",
    updated_at: "2026-02-03T10:00:00.000Z",
  },
];
