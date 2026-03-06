# Documentation

## Summary

This repository contains the production-ready Astro website for **Marie Harding Counselling Service** in **Kanturk, Co. Cork**.

It includes:

- a calm, mobile-first front end
- markdown-driven services and resources content
- an official Irish and Cork-relevant support resources layer
- a server-side contact form that sends to email and does not store enquiries in a database
- host-aware indexing safety for Render preview/default hosts
- Render deployment support and launch documentation
- weekly automated site-health checks in GitHub Actions

## What Was Built

- Mobile-first counselling website with calm, accessible design.
- Shared layout, reusable components, and content collections for easy editing.
- Contact page with click-to-call, tap-to-email, map embed, and protected email form.
- Support resources page with official Irish services, local Cork framing, and reusable urgent-help panels.
- Legal pages, accessibility statement, sitemap, dynamic `robots.txt`, `404`, and OG image.
- Optional privacy-respecting analytics, defaulted off.
- Dedicated `/healthz` endpoint for Render health checks.
- Host-aware `noindex` protection for non-canonical hosts.
- Weekly GitHub Actions workflow for site-health reporting.

## How To Run Locally

### Normal development

1. Open a terminal in the project folder.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open [http://localhost:4321](http://localhost:4321).

### Production-style local run

1. Run `npm run build`.
2. Run `npm run preview`.
3. Open [http://localhost:4321](http://localhost:4321).

Notes:

- The local preview and dev server are for editing and checking only.
- `npm run check:health` and `npm run lighthouse` use their own preview process and do not rely on a browser already being open.

## How To Edit Content

- Main page copy lives in `src/pages`.
- Service pages live in `src/content/services`.
- Resource items live in `src/content/resources`.
- Shared contact details and structured-data values live in `src/lib/site.ts`.

When editing:

- Keep UK and Irish English spelling.
- Keep the tone calm, direct, and non-salesy.
- Do not add medical claims or guaranteed outcomes.
- Do not change crisis wording casually.
- Do not change protected counselling copy without human review. See `AGENTS.md`.

### Editing support links

The support resources layer is intentionally simple:

- one markdown file per organisation in `src/content/resources`
- grouping is controlled by the `groups` array in each file
- contact and local-support quick links are centralised in `src/lib/site.ts`

When updating support entries:

- use official organisation links only
- keep summaries short, factual, and non-alarmist
- keep local notes factual
- do not add referral schemes, affiliate links, or unofficial directories
- check phone numbers, text numbers, and emails against the official site before publishing

## Contact Form Email Setup

The contact form sends messages by email and does not store message contents on the site.

### Required SMTP variables

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`

### Recommended contact variables

- `CONTACT_FROM_EMAIL`

### Optional variable

- `CONTACT_TO_EMAIL`

If `CONTACT_TO_EMAIL` is not set, the site falls back to `marieharding4@gmail.com`.

Reference template: [`.env.example`](./.env.example)

### Delivery behaviour

- Local development or local preview with missing SMTP:
  - the site keeps the current friendly fallback behaviour
  - submissions are logged locally for testing
  - no email is sent
- Non-local production host with missing or invalid SMTP:
  - the contact page shows a stronger fallback note to call or email directly
  - the API returns a safe error state
  - internal configuration details are logged only for the operator

## Analytics

Analytics are off by default.

To enable privacy-focused analytics:

- set `PUBLIC_ANALYTICS_ENABLED=true`
- set `PUBLIC_ANALYTICS_DOMAIN`
- optionally set `PUBLIC_ANALYTICS_SCRIPT_SRC`

If analytics are enabled, the cookie banner appears. If analytics stay off, no banner is shown.

## Local Checks

- `npm run lint`
- `npm run format`
- `npm run test`
- `npm run audit`
- `npm run build`
- `npm run check:health`
- `npm run lighthouse`

Notes:

- `npm run check:health` verifies links, schema, accessibility, `/healthz`, and non-production indexing protection.
- `npm run lighthouse` audits the canonical `www` host name against a local preview alias.
- Because the local preview server is plain HTTP, the Lighthouse script adjusts the HTTPS-only best-practice checks for local scoring. SSL must still be verified on the live Render domain before launch.

## Deployment

This project uses Astro with the Node adapter because the contact form is server-side.

### Render deployment

The repository includes [`render.yaml`](./render.yaml) for a Render web service.

Recommended setup:

1. Sign in to [Render](https://render.com/).
2. Create a new Blueprint or Web Service from the GitHub repo `JamesC1111/marie`.
3. Let Render read the included `render.yaml`.
4. Provide the secret values:
   - `CONTACT_FROM_EMAIL`
   - `SMTP_HOST`
   - `SMTP_USER`
   - `SMTP_PASS`
5. Deploy the service.

Important:

- `render.yaml` uses `healthCheckPath: /healthz`.
- `CONTACT_TO_EMAIL` is already set to `marieharding4@gmail.com` in the blueprint.
- `SMTP_PORT` defaults to `587`.
- The blueprint currently uses `plan: free` for safe testing. Change to a paid Render instance before launch because free web services sleep after inactivity.
- The selected region is `frankfurt`, the closest available listed region to Ireland.

### Manual Node deployment

If you host somewhere else that supports a long-running Node process:

1. Set the environment variables from `.env.example`.
2. Run `npm ci`.
3. Run `npm run build`.
4. Start the server with `npm start`.

## Canonical Host And Indexing Safety

The site is configured for one live canonical host:

- `https://www.mariehardingcounselling.ie`

Current behaviour:

- canonical tags always point to `https://www.mariehardingcounselling.ie`
- non-canonical hosts return:
  - `meta name="robots" content="noindex, nofollow"`
  - `X-Robots-Tag: noindex, nofollow`
  - a restrictive `robots.txt` that disallows crawling

This covers:

- local development hosts
- local preview hosts
- Render default `onrender.com` hostname
- other preview or accidental duplicate hosts

Important:

- Root domain redirect (`mariehardingcounselling.ie` -> `www.mariehardingcounselling.ie`) still depends on the Render custom-domain setup and DNS being correct.

## Domain And `.ie` Notes

- Keep one canonical domain only.
- Use `www.mariehardingcounselling.ie` as the canonical domain.
- Redirect the root/apex domain to `www`.
- Keep `src/lib/site.ts` and `astro.config.mjs` aligned with the live canonical domain.
- Do not leave both root and `www` serving as separate indexable hosts.

## Render Custom Domain Troubleshooting

Use this when Render deployment is working but the live domain is not yet correct.

### Required DNS pattern

For `www`:

```text
Type: CNAME
Host/Name: www
Value/Target: your-service.onrender.com
TTL: default
```

For the root/apex domain:

```text
Type: A
Host/Name: @
Value/Target: 216.24.57.1
TTL: default
```

### Troubleshooting checklist

- Add `www.mariehardingcounselling.ie` in Render first.
- Let Render attach the root/apex domain after that.
- Confirm the `www` record is a `CNAME` to the exact Render hostname shown in Render.
- Confirm the root/apex `@` record is an `A` record to `216.24.57.1`.
- Remove conflicting `AAAA` records for `@` or `www`.
- If no `CAA` records exist, do not add new ones.
- If `CAA` records already exist, make sure they do not block Render SSL issuance. If SSL will not issue, review the existing `CAA` policy before changing anything else.
- Wait for DNS propagation. Re-check after 15 minutes, 1 hour, and again after a few hours if needed.
- In Render, click `Verify` after DNS is in place.
- Only treat SSL as complete after Render shows the custom domain as verified and HTTPS loads successfully in the browser.

## Blacknight DNS Checklist

The domain is managed in Blacknight.

Before changing anything:

- Keep Blacknight nameservers in place unless you are intentionally moving DNS elsewhere.
- Edit only the DNS records needed for Render.

Checklist:

1. Sign in to Blacknight control panel.
2. Open DNS management for `mariehardingcounselling.ie`.
3. Find the current `www` record.
4. Set `www` to a `CNAME` pointing to the exact Render hostname.
5. Find the root/apex `@` record.
6. Set the root/apex to `A 216.24.57.1`.
7. Remove conflicting `AAAA` records for `@` and `www`.
8. Save the zone.
9. Wait for propagation, then return to Render and verify the domain.

## Launch Checklist For James

### Render and DNS

- [ ] Confirm the Render custom domain is verified.
- [ ] Confirm SSL is active on both `mariehardingcounselling.ie` and `www.mariehardingcounselling.ie`.
- [ ] Confirm the root/apex domain redirects to `www`.
- [ ] Confirm the Render default hostname is `noindex`.
- [ ] Confirm `robots.txt` is correct on the live production host.

### Contact form and email

- [ ] Confirm SMTP works in production.
- [ ] Confirm a real contact form submission is received in the inbox.
- [ ] Confirm the fallback direct call/email contact details are still correct.

### Search and listings

- [ ] Verify Google Search Console ownership.
- [ ] Submit the production sitemap.
- [ ] Confirm Google Business Profile uses the live domain.
- [ ] Confirm Facebook uses the live domain if linked.
- [ ] Confirm any NAPCP listing points to the live domain if linked.

### Final live checks

- [ ] Confirm phone, email, and address match across the live site.
- [ ] Confirm the homepage, services, and contact page all load correctly on mobile.
- [ ] Confirm the contact bar works on a phone.
- [ ] Confirm the site loads over HTTPS without certificate warnings.

## Support Resources Maintenance

Use this when reviewing or updating the support-resources layer.

### Current support structure

- Urgent help
- General mental health support
- Young people
- Peer support
- Bereavement and suicide-related support
- Family and supporter information

### Safe editing process

1. Open the relevant markdown file in `src/content/resources`.
2. Update the official URL, summary, or contact details only after checking the source organisation.
3. Keep summaries practical and calm.
4. Run:
   - `npm run build`
   - `npm run test`
   - `npm run check:health`
5. Review the Resources page locally on mobile and desktop.

### External links currently included

- Aware
- Grow Mental Health
- Samaritans Ireland
- Pieta
- HSE urgent mental health help
- HSE Your Mental Health information line
- Jigsaw Cork
- Shine
- HSE National Counselling Service
- Irish Hospice Foundation bereavement support

## Local Trust Footprint

The goal is not backlink building. The goal is consistency, trust, and accurate local information.

Maintain these real profiles and citations with the same name, address, phone, website, and service wording as the live site:

- Google Business Profile
- Marie's main Facebook page
- NAPCP listing
- any other real professional or community listing already associated with Marie

Guidelines:

- use the live canonical website URL
- keep the business name exactly consistent
- keep address and phone formatting consistent
- keep service descriptions calm and factual
- do not use backlink schemes, directory spam, bought listings, or link exchanges

## Domain Approval Note

Domain approval does not block content, design, or support-resource work.

Once the domain is approved, the final live checks are:

- DNS records
- SSL
- canonical host verification
- Search Console setup
- live contact-form test

## VS Code And Local Folder Use

To work from a local copy:

1. Clone or copy the repository into the chosen folder.
2. Open that folder in VS Code.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open [http://localhost:4321](http://localhost:4321).

## Future Growth

- Add a blog or updates section using a new Astro content collection if Marie wants to publish articles or notices.
- Add more FAQ entries only after manual review of tone, compliance, and confidentiality implications.
