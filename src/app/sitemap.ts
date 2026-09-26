import type { MetadataRoute } from "next";
import { posts } from "@/content/blog";
import { siteUrl } from "@/lib/site";

const paths = [
  "/",
  "/tools",
  "/image-converter",
  "/image-cropper",
  "/image-resizer",
  "/image-compressor",
  "/jpg-to-png",
  "/png-to-jpg",
  "/jpg-to-webp",
  "/png-to-webp",
  "/webp-to-jpg",
  "/webp-to-png",
  "/about",
  "/faq",
  "/blog",
  "/contact",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-09-26");
  return [
    ...paths.map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified,
    })),
    ...posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified,
    })),
  ];
}
