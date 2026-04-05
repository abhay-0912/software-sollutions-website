import type { Metadata } from "next";
import { seoConfig } from "@/lib/seo.config";

type GenerateMetadataInput = {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string | null;
  modifiedTime?: string | null;
  tags?: string[];
  noIndex?: boolean;
  absoluteTitle?: boolean;
};

function toCanonical(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${seoConfig.siteUrl}${normalized}`;
}

function toAbsoluteImage(image?: string): string {
  if (!image) return seoConfig.defaultImage;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `${seoConfig.siteUrl}${image.startsWith("/") ? image : `/${image}`}`;
}

export function generateMetadata(input: GenerateMetadataInput = {}): Metadata {
  const {
    title,
    description = seoConfig.defaultDescription,
    path = "/",
    image,
    imageAlt = seoConfig.siteName,
    keywords,
    type = "website",
    publishedTime,
    modifiedTime,
    tags,
    noIndex = false,
    absoluteTitle = false,
  } = input;

  const canonical = toCanonical(path);
  const imageUrl = toAbsoluteImage(image);

  const metadataTitle = title
    ? absoluteTitle
      ? title
      : `${title} | ${seoConfig.siteName}`
    : seoConfig.defaultTitle;

  return {
    title: metadataTitle,
    description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      type,
      url: canonical,
      title: metadataTitle,
      description,
      siteName: seoConfig.siteName,
      locale: seoConfig.locale,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
      ...(type === "article"
        ? {
            publishedTime: publishedTime || undefined,
            modifiedTime: modifiedTime || publishedTime || undefined,
            tags,
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      site: seoConfig.twitterHandle,
      title: metadataTitle,
      description,
      images: [imageUrl],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
