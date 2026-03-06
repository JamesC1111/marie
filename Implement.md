# Implement

## Running Log

### 2026-03-05

- Created `Prompt.md`, `Plans.md`, and `Architecture.md` first, before app code.
- Scaffolded Astro in the workspace and moved the generated app into the repository root.
- Added Tailwind CSS with a custom calm visual system, semantic layout shell, sticky mobile contact bar, footer urgent-help note, and print styles.
- Built core pages:
  - Home
  - About Marie
  - How counselling works
  - Services hub
  - 11 individual service pages
  - Fees and cancellations
  - Resources
  - Contact
  - Privacy policy
  - Terms of use
  - Accessibility statement
  - 404
- Added content collections for `services` and `resources`.
- Added structured data helpers for `WebSite` and `LocalBusiness`.
- Added Open Graph/Twitter metadata support and a generated text-based OG image.
- Implemented `/api/contact` with server-side validation, honeypot handling, in-memory rate limiting, SMTP delivery, and safe redirect-based success and error responses.
- Added local scripts for linting, formatting, testing, Lighthouse CI, and site-health checks.
- Added weekly GitHub Actions workflow for build, health checks, Lighthouse CI, artifact upload, and issue creation on failure.
- Added TypeScript tests for validation, slug generation, and rate limiting.

### 2026-03-05 Launch hardening

- Added `src/pages/healthz.ts` for a lightweight Render health probe and updated `render.yaml` to use `/healthz`.
- Added host-aware request helpers and middleware so non-canonical hosts send `X-Robots-Tag: noindex, nofollow`.
- Updated `Layout.astro` so non-canonical hosts output a `noindex, nofollow` robots meta tag while canonical URLs still point to the live `www` domain.
- Replaced the static `public/robots.txt` with a dynamic `src/pages/robots.txt.ts` route:
  - live `www` host allows crawling and advertises the sitemap
  - local, preview, apex, and Render default hosts disallow crawling
- Tightened contact delivery handling with `src/lib/contact-delivery.ts`:
  - validates SMTP settings only where needed
  - keeps a local preview fallback without storing form contents
  - fails safely on non-local production hosts if delivery is unavailable
- Updated the contact page to show a stronger direct call/email fallback if production form delivery is unavailable.
- Tightened server-side contact validation:
  - basic phone validation
  - preferred contact method must match the supplied contact detail
  - clearer redirect-based error states
- Converted service detail pages to request-time rendering so host-based indexing rules apply consistently there too.
- Extended `check:health` to verify:
  - `/healthz`
  - non-canonical `noindex` behaviour
  - restrictive non-production `robots.txt`
- Updated `run-lighthouse.mjs` so local audits exercise the canonical host name without weakening non-production indexing safeguards.
- Added tests for host detection and contact delivery environment handling.

### 2026-03-06 Support resources + local trust pass

- Reworked the resources content collection so support entries can appear under more than one practical group:
  - urgent help
  - general support
  - youth support
  - peer support
  - bereavement support
  - family/supporter information
- Replaced the earlier generic resources set with official Irish and Cork-relevant supports:
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
- Rebuilt `src/pages/resources.astro` so it now reads as a curated support guide rather than a plain link list:
  - grouped sections
  - clear summaries
  - phone/text/email details where appropriate
  - Cork-specific framing without clutter
- Added `src/components/SupportPanel.astro` and reused it on:
  - contact page
  - how counselling works page
  - service detail pages
  - resources page
- Expanded the footer urgent-help area with clearer quick links for emergency services, Samaritans, Pieta, HSE urgent help, Cork Samaritans, and Jigsaw Cork.
- Added shared `urgentSupportLinks` and `localSupportLinks` constants in `src/lib/site.ts` so urgent-help and local-support details stay consistent.
- Removed duplicate page-level CTA sections from the services hub and service detail pages because `Layout.astro` already renders the shared CTA.
- Kept support resources clearly framed as additional or urgent supports, not as replacements for Marie's counselling service.

## Commands Used

- `npm create astro@latest`
- `npx astro add tailwind --yes`
- `npm install`
- `npm run build`
- `npm run lint`
- `npm run test`
- `npm run check:health`
- `npm run lighthouse`
- `npm run format:write`

## Assumptions

- Assumption: the live canonical domain is `https://www.mariehardingcounselling.ie`.
- Assumption: online sessions, medical card acceptance, and exact fee amounts should remain phrased as "Please ask" rather than being invented.
- Assumption: the contact form should use SMTP credentials supplied through environment variables rather than a third-party hosted form backend.
- Assumption: local preview, Render preview hosts, and the Render default hostname should not be indexable even though they serve the same content.
- Assumption: local Lighthouse checks need to adjust HTTPS-only best-practice audits because TLS is terminated at the production host, not in the local preview server.
- Assumption: official support resources may change over time, so organisations, phone numbers, and URLs should be checked against the source sites during future content reviews.
