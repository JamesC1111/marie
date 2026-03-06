import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ request }) =>
  Response.redirect(new URL('/contact', request.url), 301);
