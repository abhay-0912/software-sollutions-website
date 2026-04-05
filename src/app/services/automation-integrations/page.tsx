import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { generateBreadcrumbs } from "@/lib/generateBreadcrumbs";
import { generateMetadata } from "@/lib/generateMetadata";
import { seoConfig } from "@/lib/seo.config";

export const metadata: Metadata = generateMetadata({
  title: "Automation & Integrations Services | abaay.tech",
  absoluteTitle: true,
  path: "/services/automation-integrations",
  image: "/opengraph-image",
  description:
    "Automate repetitive operations and integrate your business tools using custom workflows, APIs, and event-driven systems.",
  keywords: [
    "workflow automation services",
    "business integrations",
    "n8n automation",
    "API integration development",
  ],
});

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Automation and Integrations",
  provider: {
    "@type": "Organization",
    name: "Abaay Tech",
    url: seoConfig.siteUrl,
  },
  areaServed: "Worldwide",
  description:
    "Integration and automation systems that connect your stack and reduce manual work.",
  url: `${seoConfig.siteUrl}/services/automation-integrations`,
};

export default function AutomationIntegrationsServicePage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-14 text-white lg:px-10">
      <JsonLd id="automation-service-schema" data={serviceSchema} />
      <JsonLd id="automation-service-breadcrumbs" data={generateBreadcrumbs("/services/automation-integrations", { "automation-integrations": "Automation & Integrations" })} />
      <p className="text-sm text-slate-400">
        <Link href="/services" className="hover:text-white">Services</Link> → Automation & Integrations
      </p>
      <h1 className="mt-4 text-4xl font-bold">Automation & Integrations</h1>
      <p className="mt-4 text-slate-300">
        We automate repetitive operations and connect your tools so your team can focus on high-leverage work.
      </p>
      <ul className="mt-6 list-disc space-y-2 pl-5 text-slate-200">
        <li>Workflow automation architecture</li>
        <li>Custom integrations with internal and third-party APIs</li>
        <li>Queue/retry/error handling for reliability</li>
        <li>Monitoring and optimization dashboards</li>
      </ul>
      <Link href="/contact?service=automation" className="mt-8 inline-flex rounded-full border border-[#3B82F6]/70 bg-[#3B82F6] px-5 py-2.5 font-semibold">
        Automate my workflows
      </Link>
    </main>
  );
}
