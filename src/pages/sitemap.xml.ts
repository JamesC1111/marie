import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

import { getEntrySlug } from "../lib/content";
import { siteConfig } from "../lib/site";

const staticRoutes = [
  "/",
  "/about-marie",
  "/how-counselling-works",
  "/services",
  "/fees-and-cancellations",
  "/resources",
  "/guides",
  "/insights",
  "/faq",
  "/contact",
  "/privacy-policy",
  "/terms-of-use",
  "/accessibility-statement",
];

function buildUrl(path: string) {
  return new URL(path, siteConfig.siteUrl).toString();
}

function renderEntry(url: string, lastModified?: Date) {
  return [
    "<url>",
    `<loc>${url}</loc>`,
    lastModified ? `<lastmod>${lastModified.toISOString()}</lastmod>` : "",
    "</url>",
  ].join("");
}

export const GET: APIRoute = async () => {
  const [services, guides, insights] = await Promise.all([
    getCollection("services"),
    getCollection("guides"),
    getCollection("insights"),
  ]);

  const entries = [
    ...staticRoutes.map((route) => renderEntry(buildUrl(route))),
    ...services.map((entry) =>
      renderEntry(buildUrl(`/services/${getEntrySlug(entry.id)}`)),
    ),
    ...guides.map((entry) =>
      renderEntry(
        buildUrl(`/guides/${getEntrySlug(entry.id)}`),
        entry.data.updated ?? entry.data.published,
      ),
    ),
    ...insights.map((entry) =>
      renderEntry(
        buildUrl(`/insights/${getEntrySlug(entry.id)}`),
        entry.data.updated ?? entry.data.published,
      ),
    ),
  ].join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
