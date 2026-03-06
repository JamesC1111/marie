# Implement

## Running Log

### 2026-03-05 Foundation build

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
- Added Open Graph and Twitter metadata support plus a generated text-based OG image.
- Implemented `/api/contact` with server-side validation, honeypot handling, in-memory rate limiting, SMTP delivery, and safe redirect-based success and error responses.
- Added local scripts for linting, formatting, Lighthouse CI, and site-health checks.
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
- Updated the contact page to show a stronger direct call and email fallback if production form delivery is unavailable.
- Tightened server-side contact validation:
  - basic phone validation
  - preferred contact method must match the supplied contact detail
  - clearer redirect-based error states
- Converted service detail pages to request-time rendering so host-based indexing rules apply consistently there too.
- Extended `check:health` to verify `/healthz`, non-canonical `noindex` behaviour, and restrictive non-production `robots.txt`.
- Updated local Lighthouse checks so the canonical host name can be audited without weakening non-production indexing safeguards.
- Added tests for host detection and contact delivery environment handling.

### 2026-03-06 Support resources + local trust pass

- Reworked the resources content collection so support entries can appear under more than one practical group:
  - urgent help
  - general support
  - youth support
  - peer support
  - bereavement support
  - family and supporter information
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
- Rebuilt `src/pages/resources.astro` so it reads as a curated support guide rather than a plain link list.
- Added `src/components/SupportPanel.astro` and reused it on contact, how counselling works, service detail pages, and the resources page.
- Expanded the footer urgent-help area with clearer quick links for emergency services, Samaritans, Pieta, HSE urgent help, Cork Samaritans, and Jigsaw Cork.
- Added shared urgent and local support constants in `src/lib/site.ts` so support details stay consistent.
- Kept support resources clearly framed as additional or urgent supports, not replacements for Marie's counselling service.

### 2026-03-06 Mobile + Desktop Excellence Pass

- Reworked the homepage hero so it now answers, above the fold:
  - the service name
  - the location in Kanturk, Co. Cork
  - confidentiality and calm support
  - who Marie is in broad terms
  - how to get started
- Strengthened homepage trust architecture with integrated experience cards, practice metrics, clearer local signals, and a cleaner three-step start flow.
- Tightened the navigation system:
  - desktop request-appointment and call actions in the header
  - cleaner mobile menu structure with direct CTAs
  - stronger footer navigation
- Refined spacing, card rhythm, max widths, and content grids across Home, Services, Contact, and How counselling works.
- Expanded practical FAQs into a dedicated `faq` route using the same accessible accordion component.
- Improved the contact page hierarchy around phone, email, address, map, short enquiry, and callback capture.
- Ran rendered responsive checks at 375px, 768px, 1280px, and large desktop widths.
- Fixed a desktop contact-layout compression issue by overriding the generic card grid inside the contact sidebar.

### 2026-03-06 Chat assistant + callback capture

- Added `src/components/ChatAssistant.astro` as a small local launcher in the bottom right corner.
- Kept the chat limited to practical guidance only:
  - appointments
  - contact options
  - location
  - online vs in-person sessions
  - first-session expectations
  - confidentiality basics
  - urgent-help guidance
- Added visible safety wording telling visitors not to share highly sensitive personal or medical details in chat.
- Added keyword-based urgent-risk detection that immediately redirects users to urgent help rather than continuing normal chat.
- Added `src/components/CallbackCapture.astro` and reused it on Home, Contact, and How counselling works.
- Added `src/pages/api/callback.ts` with:
  - honeypot checking
  - rate limiting
  - server-side validation
  - SMTP delivery or safe local preview fallback
- Added newsletter-mode support behind feature flags without changing the page templates.
- Updated the privacy policy only where necessary to mention callback submissions alongside contact submissions.

### 2026-03-06 2026 Advanced Optimisation Pass

- Added `src/components/SpeculationRules.astro` and gated it behind `PUBLIC_SPECULATION_RULES_ENABLED` plus canonical-host checks.
- Marked the highest-intent internal links with `data-speculate="intent"` instead of broad prefetching.
- Kept the project on a system font stack because that is the strongest low-risk font optimisation for this site.
- Kept imagery intentionally light rather than adding heavier image tooling with little real benefit.
- Added extra response headers in middleware:
  - `Referrer-Policy`
  - `X-Content-Type-Options`
  - `X-Frame-Options`
  - `Permissions-Policy`
- Retained progressive CSS view transitions only where the browser supports them and the user has not requested reduced motion.
- Evaluated Astro 6 beta and did not upgrade because the site is already stable, fast, and low-complexity on Astro 5.
- Evaluated Navigation API and Trusted Types hardening and left both as documented future work rather than partial production changes.

### 2026-03-06 Premium design + content growth pass

- Added `guides` and `insights` Astro content collections.
- Added new content routes:
  - `/guides`
  - `/guides/[slug]`
  - `/insights`
  - `/insights/[slug]`
  - `/insights/tags/[tag]`
  - `/rss.xml`
  - `/sitemap.xml`
  - `/faq`
- Added reusable article components, article metadata helpers, and article schema support.
- Added 8 evergreen guides designed to earn links naturally through usefulness rather than SEO manipulation.
- Added 6 starter insight posts to support weekly publishing.
- Added tag browsing, related-reading blocks, and stronger internal linking between guides, insights, services, FAQs, and Contact.
- Replaced the old sitemap dependency with a custom sitemap route that stays aligned with the content collections.
- Cleaned article metadata output so list cards use an ASCII separator and stay encoding-safe.

## Commands Used

- `npm create astro@latest`
- `npx astro add tailwind --yes`
- `npm install`
- `npm uninstall @astrojs/sitemap`
- `npm run format:write`
- `npm run lint`
- `npm run test`
- `npm run build`
- `npm run check:links`
- `npm run check:health`
- `npm run lighthouse`
- `npm run audit`

## Assumptions

- Assumption: the live canonical domain is `https://www.mariehardingcounselling.ie`.
- Assumption: online sessions, medical card acceptance, and exact fee amounts should remain phrased as `Please ask` rather than being invented.
- Assumption: the contact and callback forms should use SMTP credentials supplied through environment variables rather than a third-party hosted form backend.
- Assumption: local preview, Render preview hosts, and the Render default hostname should not be indexable even though they serve the same content.
- Assumption: local Lighthouse checks need to adjust HTTPS-only best-practice audits because TLS is terminated at the production host, not in the local preview server.
- Assumption: the chat assistant must remain practical-only and must not operate as therapy, diagnosis, or crisis support.
- Assumption: callback mode is the correct default for a counselling practice, while newsletter mode remains optional and unconfigured until a human explicitly enables it.
- Assumption: system fonts are preferable to a webfont for this project because the visual style can remain calm and premium without paying a performance cost.
- Assumption: Astro 6 beta is not yet a justifiable production upgrade for this codebase.
- Assumption: official support resources, phone numbers, and URLs may change over time and should be checked against source organisations during future reviews.
