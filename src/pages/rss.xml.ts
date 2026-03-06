import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

import { getEntrySlug } from "../lib/content";
import { siteConfig } from "../lib/site";

export const GET: APIRoute = async () => {
  const insights = (await getCollection("insights")).sort(
    (a, b) => b.data.published.getTime() - a.data.published.getTime(),
  );

  const items = insights
    .map((entry) => {
      const url = `${siteConfig.siteUrl}/insights/${getEntrySlug(entry.id)}`;
      return [
        "<item>",
        `<title><![CDATA[${entry.data.title}]]></title>`,
        `<link>${url}</link>`,
        `<guid>${url}</guid>`,
        `<pubDate>${entry.data.published.toUTCString()}</pubDate>`,
        `<description><![CDATA[${entry.data.summary}]]></description>`,
        "</item>",
      ].join("");
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${siteConfig.name} Insights</title>
    <link>${siteConfig.siteUrl}/insights</link>
    <description>${siteConfig.description}</description>
    <language>en-ie</language>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
};
