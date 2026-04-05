import { seoConfig } from "@/lib/seo.config";

type BreadcrumbItem = {
  name: string;
  item: string;
};

function titleizeSegment(segment: string): string {
  return segment
    .replace(/-/g, " ")
    .split(" ")
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : part))
    .join(" ");
}

export function generateBreadcrumbs(pathname: string, labels?: Record<string, string>) {
  const cleanPath = pathname.split("?")[0].split("#")[0];
  const segments = cleanPath.split("/").filter(Boolean);

  const items: BreadcrumbItem[] = [
    {
      name: "Home",
      item: seoConfig.siteUrl,
    },
  ];

  let currentPath = "";
  segments.forEach((segment) => {
    currentPath += `/${segment}`;
    const name = labels?.[segment] || titleizeSegment(segment);
    items.push({
      name,
      item: `${seoConfig.siteUrl}${currentPath}`,
    });
  });

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  };
}
