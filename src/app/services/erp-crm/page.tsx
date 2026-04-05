import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { generateBreadcrumbs } from "@/lib/generateBreadcrumbs";
import { generateMetadata } from "@/lib/generateMetadata";
import { seoConfig } from "@/lib/seo.config";

export const metadata: Metadata = generateMetadata({
  title: "ERP & CRM Development Services | abaay.tech",
  absoluteTitle: true,
  path: "/services/erp-crm",
  image: "/opengraph-image",
  description:
    "Custom ERP and CRM implementation services including Odoo customization, process automation, and data migration.",
  keywords: [
    "ERP development",
    "CRM development",
    "Odoo implementation partner",
    "business process automation",
  ],
});

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "ERP and CRM Development",
  provider: {
    "@type": "Organization",
    name: "Abaay Tech",
    url: seoConfig.siteUrl,
  },
  areaServed: "Worldwide",
  description:
    "ERP and CRM systems tailored to sales, operations, finance, and reporting workflows.",
  url: `${seoConfig.siteUrl}/services/erp-crm`,
};

export default function ErpCrmServicePage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-14 text-white lg:px-10">
      <JsonLd id="erp-service-schema" data={serviceSchema} />
      <JsonLd id="erp-service-breadcrumbs" data={generateBreadcrumbs("/services/erp-crm", { "erp-crm": "ERP & CRM" })} />
      <p className="text-sm text-slate-400">
        <Link href="/services" className="hover:text-white">Services</Link> → ERP & CRM
      </p>
      <h1 className="mt-4 text-4xl font-bold">ERP & CRM Development</h1>
      <p className="mt-4 text-slate-300">
        We design and implement ERP/CRM systems that unify your operations, sales, and reporting in one reliable platform.
      </p>
      <ul className="mt-6 list-disc space-y-2 pl-5 text-slate-200">
        <li>Odoo implementation and customization</li>
        <li>Custom CRM workflows and permissions</li>
        <li>Data migration and integration planning</li>
        <li>Training and post-launch support</li>
      </ul>
      <Link href="/contact?service=erp" className="mt-8 inline-flex rounded-full border border-[#3B82F6]/70 bg-[#3B82F6] px-5 py-2.5 font-semibold">
        Book a consultation
      </Link>
    </main>
  );
}
