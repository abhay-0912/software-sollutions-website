import type { Metadata } from "next";
import { DM_Sans, Syne } from "next/font/google";
import { JsonLd } from "@/components/JsonLd";
import { seoConfig } from "@/lib/seo.config";
import { generateMetadata } from "@/lib/generateMetadata";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  ...generateMetadata({
    title: "Abaay Tech - Custom Web Apps, ERP & Automation Solutions",
    description:
      "We build custom web applications, ERP systems, and automation tools for businesses worldwide. Fast delivery, clean code, and global client execution.",
    path: "/",
    absoluteTitle: true,
    keywords: [
      "web app development company",
      "custom ERP development",
      "automation integrations",
      "software company India",
      "Odoo developer",
      "hire web developer",
    ],
  }),
  metadataBase: new URL(seoConfig.siteUrl),
  verification: {
    google: "REPLACE_WITH_YOUR_CODE",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Abaay Tech",
  url: "https://abaay.tech",
  logo: "https://abaay.tech/logo.png",
  description:
    "Custom web apps, ERP systems, and automation solutions for global businesses.",
  email: "absrivastava999@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Lucknow",
    addressRegion: "Uttar Pradesh",
    addressCountry: "IN",
  },
  sameAs: [
    "https://linkedin.com/company/abaay-tech",
    "https://github.com/abaay-tech",
    "https://twitter.com/abaaytech",
  ],
  foundingDate: "2024",
  numberOfEmployees: {
    "@type": "QuantitativeValue",
    minValue: 1,
    maxValue: 10,
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Abaay Tech",
  url: "https://abaay.tech",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://abaay.tech/blog?search={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`}>
      <body className={`${syne.variable} ${dmSans.variable} bg-[#0D0F1A] text-white antialiased`}>
        <JsonLd id="organization-schema" data={organizationSchema} />
        <JsonLd id="website-schema" data={websiteSchema} />
        {children}
      </body>
    </html>
  );
}
