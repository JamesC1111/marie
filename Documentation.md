# Documentation

## Summary

This repository contains a production-ready Astro website for **Marie Harding Counselling Service** in **Kanturk, Co. Cork**. It includes a static-first front end, markdown-driven service/resource content, a server-side contact form, SEO metadata, structured data, and a weekly site-health workflow.

## What Was Built

- Mobile-first counselling website with calm, accessible design.
- Shared layout, reusable components, and content collections for easy editing.
- Contact page with click-to-call, tap-to-email, map embed, and protected email form.
- Legal pages, accessibility statement, sitemap, robots file, 404 page, and OG image.
- Optional privacy-respecting analytics, defaulted off.
- GitHub Actions workflow for weekly site-health reporting.

## How To Run Locally

1. Open a terminal in the project folder.
2. Install dependencies with `npm install`.
3. Start the local server with `npm run dev`.
4. Open [http://localhost:4321](http://localhost:4321) in a browser.

For a production-style local run:

1. `npm run build`
2. `npm run preview`
3. Open [http://localhost:4321](http://localhost:4321)

## How To Edit Content

- Main page copy lives in the Astro page files under `src/pages`.
- Service pages live in `src/content/services`.
- Resource items live in `src/content/resources`.
- Shared contact details and structured-data values live in `src/lib/site.ts`.

When editing:

- Keep UK and Irish English spelling.
- Keep tone calm, direct, and non-salesy.
- Do not add medical claims or guaranteed outcomes.
- Do not change crisis wording casually.

## Contact Form Email Setup

The form sends messages by email and does not store message contents on the website.

Set these variables in the hosting environment:

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_SECURE`
- `SMTP_USER`
- `SMTP_PASS`
- `CONTACT_FROM_EMAIL`
- `CONTACT_TO_EMAIL`

Reference template: [`.env.example`](./.env.example)

Development behaviour:

- If SMTP is not configured and the site is running in development mode, the form logs the submission preview to the server console.
- In production, missing SMTP configuration returns a safe error message to the visitor.

## Analytics

Analytics are off by default.

To enable privacy-focused analytics:

- Set `PUBLIC_ANALYTICS_ENABLED=true`
- Set `PUBLIC_ANALYTICS_DOMAIN`
- Optionally set `PUBLIC_ANALYTICS_SCRIPT_SRC`

If analytics are enabled, the cookie banner appears. If analytics stay off, no banner is shown.

## Local Checks

- `npm run lint`
- `npm run format`
- `npm run test`
- `npm run audit`
- `npm run build`
- `npm run check:health`
- `npm run lighthouse`

## Deployment

This project uses Astro with the Node adapter because the contact form is server-side.

### Render deployment

The repository now includes [`render.yaml`](./render.yaml) for a Render web service.

Recommended setup:

1. Sign in to [Render](https://render.com/).
2. Create a new Blueprint or Web Service from the GitHub repo `JamesC1111/marie`.
3. Let Render read the included `render.yaml`.
4. Provide the prompted secret values:
   - `CONTACT_FROM_EMAIL`
   - `SMTP_HOST`
   - `SMTP_USER`
   - `SMTP_PASS`
5. Deploy the service.

Notes:

- The blueprint currently uses `plan: free` so you can test without immediate paid hosting.
- Before going live, change the service to a paid instance type in Render. Render’s free web services spin down after 15 minutes of inactivity, which can delay the next request and temporarily serve a restrictive `robots.txt` while the service is asleep.
- The selected region is `frankfurt`, which is the closest listed Render region to Ireland.

### Manual Node deployment

If you host somewhere else that supports long-running Node services:

1. Set the environment variables from `.env.example`.
2. Run `npm ci`.
3. Run `npm run build`.
4. Start the server with `npm start`.

## Domain And `.ie` Notes

- Choose one canonical domain and keep all other variants redirected to it.
- The codebase is already configured for `https://www.mariehardingcounselling.ie`.
- Add `www.mariehardingcounselling.ie` as the custom domain in Render first.
- Render will automatically add the root domain `mariehardingcounselling.ie` and redirect it to `www` when `www` is added first.
- Point both the apex domain and `www` subdomain to Render using the values shown in the Render dashboard.
- Keep the canonical URL in `src/lib/site.ts` and `astro.config.mjs` aligned with the chosen live domain.
- Ensure HTTPS/SSL is active before launch.

### DNS values for Render

If your DNS provider is not Cloudflare-specific:

- `www`:
  - Type: `CNAME`
  - Name/Host: `www`
  - Value: your Render service subdomain, shown in Render, in the format `your-service.onrender.com`
- Root domain:
  - Type: `A`
  - Name/Host: `@`
  - Value: `216.24.57.1`

Also remove any `AAAA` records for the root or `www` host while pointing the domain at Render.

## Launch Checklist

- Confirm `www.mariehardingcounselling.ie` is the canonical host.
- Add the custom domain in Render before editing DNS.
- Configure DNS records for the chosen host and verify the domain in Render.
- Confirm SSL certificate is active.
- Set SMTP environment variables and test the contact form.
- Verify Google Search Console ownership.
- Submit the sitemap URL.
- Confirm phone, email, and address are correct on the live site.
- Run `npm run build`, `npm run check:health`, and `npm run lighthouse` before launch.

## Future Growth

- Add a blog or updates section using a new Astro content collection if Marie wants to publish articles or notices.
- Add a testimonials or FAQ expansion only after manual review of tone, compliance, and confidentiality implications.

## VS Code And Downloads

If you want this in a folder under Downloads:

1. Create a folder such as `C:\Users\james\Downloads\marie-harding-site`
2. Copy this repository into that folder.
3. Open that folder in VS Code.
4. Run `npm install`
5. Run `npm run dev`
6. Open [http://localhost:4321](http://localhost:4321)
