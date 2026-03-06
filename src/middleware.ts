import { defineMiddleware } from "astro:middleware";

import { getRequestHost, shouldNoIndexHost } from "./lib/request";

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  const requestHost = getRequestHost(context.request, context.url);

  response.headers.set("referrer-policy", "strict-origin-when-cross-origin");
  response.headers.set("x-content-type-options", "nosniff");
  response.headers.set("x-frame-options", "DENY");
  response.headers.set(
    "permissions-policy",
    "camera=(), geolocation=(), microphone=()",
  );

  if (shouldNoIndexHost(requestHost)) {
    response.headers.set("x-robots-tag", "noindex, nofollow");
  }

  return response;
});
