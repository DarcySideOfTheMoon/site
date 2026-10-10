import type { MetadataRoute } from "next";
import { getAllPosts, getAllProjects } from "@/lib/content";
import { site } from "@/lib/site";

export const revalidate = 3600;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: site.url, lastModified: now, priority: 1 },
    { url: `${site.url}/journal`, lastModified: now, priority: 0.8 },
    { url: `${site.url}/about`, lastModified: now, priority: 0.5 },
    ...getAllProjects().map((p) => ({
      url: `${site.url}/work/${p.slug}`,
      lastModified: now,
      priority: 0.9,
    })),
    ...getAllPosts().map((p) => ({
      url: `${site.url}/journal/${p.slug}`,
      lastModified: new Date(p.date),
      priority: 0.7,
    })),
  ];
}
