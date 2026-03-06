# Architecture

## Status

- Implemented on 5 March 2026.
- Local checks in place: `format`, `lint`, `test`, `build`, `check:health`, `lighthouse`, `audit`.
- GitHub Actions runs weekly site-health reporting.
- Launch hardening added for Render, custom-domain safety, and contact-form resilience.
- Support resources layer added with official Irish and Cork-relevant support listings plus reusable urgent-help panels.

## Stack Choice

- **Astro + TypeScript + Tailwind CSS**.
- Server output with the Node adapter.
- Minimal client-side JavaScript; small progressive enhancements only where needed.

## High-Level Structure

- `src/layouts/` shared page shell and metadata handling.
- `src/components/` reusable UI components.
- `src/pages/` route-based pages, dynamic support routes, and API endpoints.
- `src/content/` markdown content collections for services and resources.
- `src/styles/` global styles and print baseline.
- `src/lib/` shared configuration, schema, request, validation, and email helpers.
- `public/` static assets such as icons, favicon, and OG image.
- `scripts/` local health and Lighthouse checks.

## Routing Plan

- `/` Home
- `/about-marie`
- `/how-counselling-works`
- `/services`
- `/services/[slug]`
- `/fees-and-cancellations`
- `/resources`
- `/contact`
- `/privacy-policy`
- `/terms-of-use`
- `/accessibility-statement`
- `/404`
- `/robots.txt` dynamic host-aware robots route
- `/healthz` lightweight health endpoint
- `/api/contact` POST endpoint

## Content Model

### Services collection (`src/content/services/*.md`)

Frontmatter fields:

- `title`
- `summary`
- `metaTitle`
- `metaDescription`
- `order`
- `serviceArea` (optional)

Body sections (authoring convention):

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

Body supports optional context and usage notes.

Authoring convention:

- keep to official organisations only
- group entries under practical support types such as urgent help, youth support, peer support, and family/supporter information
- use short, factual summaries rather than promotional copy

## Shared Components

- `Layout.astro` for global chrome, metadata, canonical tags, and host-aware robots meta.
- `Hero` for landing headers and quick actions.
- `PageHeader` for interior pages.
- `Breadcrumbs` for navigational context.
- `ServiceCard` for service grid and listing.
- `FAQAccordion` for practical FAQs using `details/summary`.
- `CTASection` for gentle contact prompts.
- `ContactBar` sticky mobile call and email actions.
- `SupportPanel` for reusable urgent-help and additional-support guidance on contact, process, service, and resources pages.

## SEO, Canonical, And Host Safety

- Per-page title, description, and canonical config.
- Open Graph and Twitter card tags via layout props.
- Shared OG image.
- JSON-LD:
  - `WebSite` globally
  - `LocalBusiness` on Home and Contact
- Sitemap generation via Astro integration.
- Dynamic `robots.txt`:
  - canonical `www` host allows crawling and exposes sitemap
  - non-canonical hosts disallow crawling
- Middleware adds `X-Robots-Tag: noindex, nofollow` on non-canonical hosts.

## Accessibility Baseline

- Semantic landmarks: header, nav, main, footer.
- Skip link and visible keyboard focus states.
- Colour contrast and readable line lengths.
- Form labels, hints, and error feedback.
- Reduced motion and print-friendly defaults.

## Contact Form Architecture

- `POST /api/contact` handles submissions.
- Validation:
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

## Operational And CI

- npm scripts for lint, format, test, audit, Lighthouse, and health checks.
- Local health scripts live in `scripts/`.
- `check:health` verifies links, schema, accessibility, `/healthz`, and non-production indexing behaviour.
- Local Lighthouse checks run against the canonical `www` host name mapped to the local preview server.
- Weekly GitHub Actions workflow:
  - build
  - link check
  - Lighthouse CI
  - schema check
  - accessibility check
  - markdown report artifact
  - issue creation on failure only

## Editing And Ownership

- Most textual content is editable via markdown collections and Astro page files.
- Contact details and organisation metadata are centralised in shared config to prevent drift.
- Deployment, DNS, SSL, and email handover steps live in `Documentation.md`.
