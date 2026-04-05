import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { generateBreadcrumbs } from "@/lib/generateBreadcrumbs";
import { generateMetadata } from "@/lib/generateMetadata";
import { seoConfig } from "@/lib/seo.config";

export const metadata: Metadata = generateMetadata({
  title: "Web & Mobile App Development Services | abaay.tech",
  absoluteTitle: true,
  path: "/services/web-mobile-apps",
  image: "/opengraph-image",
  description:
    "Custom web and mobile application development from idea to launch. Scalable architecture, modern UI, and fast iteration.",
  keywords: [
    "web app development services",
    "mobile app development company",
    "Next.js development",
    "custom product development",
  ],
});

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Web and Mobile Application Development",
  provider: {
    "@type": "Organization",
    name: "Abaay Tech",
    url: seoConfig.siteUrl,
  },
  areaServed: "Worldwide",
  description:
    "Design and development of modern web and mobile applications with scalable backend architecture.",
  url: `${seoConfig.siteUrl}/services/web-mobile-apps`,
};

export default function WebMobileAppsServicePage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-14 text-white lg:px-10">
      <JsonLd id="web-mobile-service-schema" data={serviceSchema} />
      <JsonLd id="web-mobile-breadcrumbs" data={generateBreadcrumbs("/services/web-mobile-apps", { "web-mobile-apps": "Web & Mobile Apps" })} />
      <p className="text-sm text-slate-400">
        <Link href="/services" className="hover:text-white">Services</Link> → Web & Mobile Apps
      </p>
      <h1 className="mt-4 text-4xl font-bold">Web & Mobile App Development</h1>
      <p className="mt-4 text-slate-300">
        We build high-performance applications with clean architecture, fast interfaces, and dependable deployment pipelines.
      </p>
      <ul className="mt-6 list-disc space-y-2 pl-5 text-slate-200">
        <li>Product strategy and scope definition</li>
        <li>UI engineering with modern frameworks</li>
        <li>Secure API and database development</li>
        <li>Performance optimization and observability</li>
      </ul>
      <Link href="/contact?service=web" className="mt-8 inline-flex rounded-full border border-[#3B82F6]/70 bg-[#3B82F6] px-5 py-2.5 font-semibold">
        Start your project
      </Link>
    </main>
  );
}
