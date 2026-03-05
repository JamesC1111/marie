import { defineMiddleware } from "astro:middleware";

import { getRequestHost, shouldNoIndexHost } from "./lib/request";

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  const requestHost = getRequestHost(context.request, context.url);

  if (shouldNoIndexHost(requestHost)) {
    response.headers.set("x-robots-tag", "noindex, nofollow");
  }

  return response;
});
