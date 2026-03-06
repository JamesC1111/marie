import type { APIRoute } from "astro";

import { getRequestHost, shouldNoIndexHost } from "../lib/request";
import { siteConfig } from "../lib/site";

export const GET: APIRoute = ({ request, url }) => {
  const requestHost = getRequestHost(request, url);
  const body = shouldNoIndexHost(requestHost)
    ? ["User-agent: *", "Disallow: /", ""].join("\n")
    : [
        "User-agent: *",
        "Allow: /",
        "",
        `Sitemap: ${siteConfig.siteUrl}/sitemap.xml`,
        "",
      ].join("\n");

  return new Response(body, {
    status: 200,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
};
