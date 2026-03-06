# Architecture

## Status

- Implemented in Astro 5 with the Node adapter, TypeScript, and Tailwind CSS.
- Local quality gates in place: `format`, `lint`, `test`, `build`, `check:links`, `check:health`, `lighthouse`, and `audit`.
- Weekly GitHub Actions health reporting is configured.
- Launch hardening, support resources, content growth, responsive QA, and conversion features are all implemented.

## Stack Choice

- Astro + TypeScript + Tailwind CSS.
- Server output with `@astrojs/node` for the server-side form endpoints.
- Minimal client-side JavaScript with progressive enhancement only where it has a clear benefit.
- System font stack by design to keep font loading simple, fast, and stable.

## High-Level Structure

- `src/layouts/` shared page shell and metadata handling.
- `src/components/` reusable UI components.
- `src/pages/` route-based pages, dynamic content routes, feed routes, and API endpoints.
- `src/content/` markdown content collections for services, resources, guides, and insights.
- `src/styles/` global styles and print baseline.
- `src/lib/` shared configuration, schema, request, validation, content, and email helpers.
- `public/` static assets such as icons, favicons, and the default OG image.
- `scripts/` local health, links, schema, accessibility, and Lighthouse checks.

## Routing Plan

- `/` Home
- `/about-marie`
- `/how-counselling-works`
- `/services`
- `/services/[slug]`
- `/fees-and-cancellations`
- `/resources`
- `/faq`
- `/contact`
- `/privacy-policy`
- `/terms-of-use`
- `/accessibility-statement`
- `/guides`
- `/guides/[slug]`
- `/insights`
- `/insights/[slug]`
- `/insights/tags/[tag]`
- `/rss.xml`
- `/sitemap.xml`
- `/robots.txt` dynamic host-aware robots route
- `/healthz` lightweight health endpoint
- `/api/contact` POST endpoint
- `/api/callback` POST endpoint
- `/404`

## Content Model

### Services collection (`src/content/services/*.md`)

Frontmatter fields:

- `title`
- `summary`
- `metaTitle`
- `metaDescription`
- `order`
- `serviceArea` (optional)

Authoring convention:

- What this can feel like
- How counselling may help
- What we might work on together
- How to start
- Confidentiality note

### Resources collection (`src/content/resources/*.md`)

Frontmatter fields:

- `title`
- `organisation`
- `url`
- `summary`
- `order`
- `groups`
- `forWho` (optional)
- `phone` (optional)
- `text` (optional)
- `email` (optional)
- `localNote` (optional)

Authoring convention:

- official organisations only
- short factual summaries
- practical grouping such as urgent help, youth support, peer support, or bereavement support

### Guides collection (`src/content/guides/*.md`)

Frontmatter fields:

- `title`
- `summary`
- `metaTitle`
- `metaDescription`
- `published`
- `updated` (optional)
- `order`
- `category`
- `tags`
- `featured`

Use for evergreen, backlink-worthy, practical pages that should stay useful over time.

### Insights collection (`src/content/insights/*.md`)

Frontmatter fields:

- `title`
- `summary`
- `metaTitle`
- `metaDescription`
- `published`
- `updated` (optional)
- `category`
- `tags`
- `featured`

Use for shorter weekly articles or updates.

## Shared Components

- `Layout.astro` for global chrome, metadata, canonical tags, host-aware robots meta, chat launcher, and speculation rules injection.
- `Hero.astro` for the homepage hero and immediate CTAs.
- `PageHeader.astro` for interior pages.
- `Breadcrumbs.astro` for navigational context.
- `ServiceCard.astro` for service grids and listings.
- `FAQAccordion.astro` for practical FAQs using `details` and `summary`.
- `CTASection.astro` for shared gentle contact prompts.
- `ContactBar.astro` for sticky mobile call and email actions.
- `SupportPanel.astro` for reusable urgent-help and additional-support guidance.
- `CallbackCapture.astro` for callback-mode or newsletter-mode capture sections.
- `ChatAssistant.astro` for limited practical chat support with clear safety boundaries.
- `ArticleCard.astro` and `TagList.astro` for guides and insights.
- `SpeculationRules.astro` for the optional high-intent prefetch rules.

## Page Architecture And Internal Linking

The strongest internal journeys are deliberate:

- Home -> How counselling works -> Contact
- Home -> Services -> Contact
- Home -> FAQ -> Contact
- Home -> Guides / Insights -> Contact
- Service pages -> related services / FAQ / Guides / Contact
- Contact / How counselling works -> Resources when urgent or wider support is needed

Guides and insights include related-reading sections so the content layer stays crawlable and useful rather than siloed.

## SEO, Feed, And Host Safety

- Per-page title, description, canonical path, Open Graph, and Twitter card support.
- Shared default OG image and LocalBusiness metadata.
- JSON-LD helpers:
  - `WebSite`
  - `LocalBusiness`
  - `FAQPage`
  - `Article` / `BlogPosting`
- Custom `sitemap.xml` route includes core pages plus content collections.
- `rss.xml` exposes the insights feed.
- Dynamic `robots.txt`:
  - canonical `www` host allows crawling and advertises the sitemap
  - non-canonical hosts disallow crawling
- Middleware adds `X-Robots-Tag: noindex, nofollow` on non-canonical hosts.

## Contact, Callback, And Delivery Architecture

### Contact form

- `POST /api/contact` handles full enquiry submissions.
- Validation includes:
  - required fields
  - max lengths
  - email format
  - basic phone validation
  - preferred contact method must match supplied contact detail
  - consent check
- Anti-spam:
  - honeypot hidden field
  - in-memory IP rate limiter
- Delivery:
  - SMTP transport via environment variables
  - no database storage
  - local preview fallback for testing
  - production-safe fallback UI if SMTP is unavailable

### Callback capture

- `POST /api/callback` handles short callback requests.
- Shares the same anti-spam model and SMTP delivery rules.
- Defaults to callback mode.
- Can switch to newsletter mode through feature flags without changing page templates.

## Chat Assistant Boundaries

- The chat launcher is local and lightweight. There is no third-party chat dependency by default.
- Allowed topics:
  - appointments
  - contact options
  - location
  - online vs in-person sessions
  - first-session expectations
  - confidentiality basics
  - urgent-help guidance
- It must not provide therapy, diagnosis, crisis intervention, or treatment advice.
- Urgent-risk keywords short-circuit to emergency and official support guidance.

## Performance And Progressive Enhancement

- System font stack avoids extra font requests and CLS from webfont swaps.
- Imagery is intentionally light; the site uses a lightweight OG asset and avoids decorative heavy media.
- Optional Speculation Rules only render when:
  - the feature flag is on
  - the request host is the canonical production host
- Same-document view transitions are progressive CSS-only enhancement and respect reduced-motion preferences.
- Analytics stay off by default.

## Security And Headers

- Middleware adds:
  - `X-Robots-Tag` on non-canonical hosts
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - a minimal `Permissions-Policy`
- Trusted Types and a stricter CSP are documented as future work rather than partially implemented.

## Accessibility Baseline

- Semantic landmarks: header, nav, main, footer.
- Skip link and visible keyboard focus states.
- Accessible accordions built with native elements.
- Form labels, hints, and clear redirect-based error states.
- Reduced-motion support and print-friendly defaults.
- Strong contrast and controlled line lengths on mobile and desktop.

## Operational And CI

- npm scripts for lint, format, test, audit, build, links, schema, accessibility, Lighthouse, and health checks.
- `check:health` verifies links, schema, accessibility, `/healthz`, and non-production indexing behaviour.
- `run-lighthouse.mjs` audits key routes locally.
- Weekly GitHub Actions workflow runs build, checks, Lighthouse, and issue creation on failure.

## Editing And Ownership

- Services, resources, guides, and insights are markdown-driven.
- Shared contact details, feature flags, trust signals, and schema values are centralised in `src/lib/site.ts`.
- FAQs live in `src/lib/faqs.ts`.
- Protected counselling copy still lives in page files where human review is expected.
- Deployment, DNS, SSL, content editing, and launch steps live in `Documentation.md`.
