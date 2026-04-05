import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { ContactPage } from "@/components/contact/contact-page";
import { contactFaqItems, toFaqJsonLd } from "@/lib/faq";
import { generateBreadcrumbs } from "@/lib/generateBreadcrumbs";
import { generateMetadata } from "@/lib/generateMetadata";

type ContactRouteProps = {
  searchParams?: {
    service?: string;
    subject?: string;
  };
};

const serviceMap: Record<string, string> = {
  web: "Web & Mobile App Development",
  erp: "ERP / CRM System (Odoo or Custom)",
  automation: "Automation & Integrations",
};

export const metadata: Metadata = generateMetadata({
  title: "Contact Abaay Tech | Free Consultation",
  absoluteTitle: true,
  path: "/contact",
  image: "/opengraph-image",
  description:
    "Talk to Abaay Tech about your next software project. Get a free consultation for web apps, ERP, CRM, and automation initiatives.",
  keywords: [
    "contact software company",
    "free software consultation",
    "hire development team",
    "abaay tech contact",
  ],
});

export default function ContactRoute({ searchParams }: ContactRouteProps) {
  const serviceKey = (searchParams?.service ?? "").toLowerCase();
  const initialService = serviceMap[serviceKey] ?? "";
  const initialSubject = searchParams?.subject?.trim() ?? "";

  return (
    <>
      <JsonLd id="contact-faq-schema" data={toFaqJsonLd(contactFaqItems)} />
      <JsonLd id="contact-breadcrumbs" data={generateBreadcrumbs("/contact")} />
      <ContactPage initialService={initialService} initialSubject={initialSubject} />
    </>
  );
}
