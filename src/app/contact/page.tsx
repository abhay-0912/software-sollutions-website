import type { Metadata } from "next";
import { ContactPage } from "@/components/contact/contact-page";

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

export const metadata: Metadata = {
  title: "Contact Us | abaay.tech",
  description:
    "Start your software project with Abaay Tech. Get a free consultation and estimate for web apps, ERP systems, or automation.",
  openGraph: {
    title: "Contact Us | abaay.tech",
    description:
      "Start your software project with Abaay Tech. Get a free consultation and estimate for web apps, ERP systems, or automation.",
    images: ["/og-abaay.svg"],
  },
};

export default function ContactRoute({ searchParams }: ContactRouteProps) {
  const serviceKey = (searchParams?.service ?? "").toLowerCase();
  const initialService = serviceMap[serviceKey] ?? "";
  const initialSubject = searchParams?.subject?.trim() ?? "";

  return <ContactPage initialService={initialService} initialSubject={initialSubject} />;
}
