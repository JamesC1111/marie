# Architecture

## Stack Choice
- **Astro + TypeScript + Tailwind CSS**.
- Static-first rendering with a lightweight server endpoint for the contact form.
- Minimal client-side JavaScript; only small progressive enhancements where needed.

## High-Level Structure
- `src/layouts/` shared page shell and metadata handling.
- `src/components/` reusable UI components.
- `src/pages/` route-based pages and API endpoints.
- `src/content/` markdown content collections for services and resources.
- `src/styles/` global styles and print baseline.
- `public/` static assets (icons, OG image, robots).

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
- `/api/contact` (POST endpoint)

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

Body supports optional context and usage notes.

## Shared Components
- `SiteLayout` for global chrome, metadata, schema, footer, and urgent-help note.
- `Hero` for landing headers and quick actions.
- `PageHeader` for interior pages.
- `Breadcrumbs` for navigational context.
- `ServiceCard` for service grid/listing.
- `FAQAccordion` for practical FAQs (details/summary pattern).
- `CTASection` for gentle contact prompts.
- `ContactBar` sticky mobile call/email actions.

## SEO and Metadata
- Per-page title/description/canonical config.
- Open Graph + Twitter card tags via layout props.
- Shared OG image (simple text-based fallback image).
- JSON-LD:
  - `WebSite` globally
  - `LocalBusiness` on Home and Contact.
- Sitemap generation via Astro integration.
- `robots.txt` served from `public/`.

## Accessibility Baseline
- Semantic landmarks: header/nav/main/footer.
- Skip link and keyboard focus visibility.
- Colour contrast and readable line lengths.
- Form labels, hints, and error feedback.
- Reduced motion and print-friendly defaults.

## Contact Form Architecture
- `POST /api/contact` handles submissions.
- Validation: required fields, max lengths, email format, consent check, and either email or phone.
- Anti-spam:
  - Honeypot hidden field
  - In-memory IP rate limiter (simple sliding window)
- Email delivery abstraction in `src/lib/email.ts` using environment variables.
- No message persistence in databases.

## Operational and CI
- npm scripts for lint, format, test, audit, lighthouse, and health checks.
- Weekly GitHub Actions workflow:
  - Build
  - Link check
  - Lighthouse CI
  - Schema check
  - Accessibility check
  - Markdown report artifact
  - Issue creation on failure only

## Editing and Ownership
- Most textual content editable via markdown collections/pages.
- Contact details and organisation metadata centralised in config/constants to prevent drift.
- Documentation includes non-technical update and deployment instructions.
