import type { Metadata } from "next";
import { defaultMetadata } from "./defaultMetadata";

type PageMetadataOptions = {
  title?: string;
  description?: string;
  image?: string;
  type?: "website" | "article";
};

export function generatePageMetadata(options: PageMetadataOptions): Metadata {
  const title = options.title
    ? `${options.title} | ${defaultMetadata.title}`
    : (defaultMetadata.title as string);
  const description = options.description || (defaultMetadata.description as string) || "";

  return {
    title,
    description,
    openGraph: {
      title: title as string,
      description: description as string,
      type: options.type || "website",
      images: options.image ? [{ url: options.image }] : undefined,
      siteName: defaultMetadata.title as string,
    },
    twitter: {
      card: "summary_large_image",
      title: title as string,
      description: description as string,
      images: options.image ? [options.image] : undefined,
    },
  };
}

