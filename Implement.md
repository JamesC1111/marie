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
- Implemented `/api/contact` with:
  - server-side validation
  - honeypot field handling
  - in-memory rate limiting
  - SMTP email delivery via environment variables
  - safe redirect-based success/error responses
- Added local scripts for linting, formatting, testing, Lighthouse CI, and site-health checks.
- Added weekly GitHub Actions workflow for build, health checks, Lighthouse CI, artifact upload, and issue creation on failure.
- Added TypeScript tests for validation, slug generation, and rate limiting.

## Commands Used

- `npm create astro@latest`
- `npx astro add tailwind --yes`
- `npm install`
- `npm run build`
- `npm run lint`

## Assumptions

- Assumption: the live canonical domain will be `https://www.mariehardingcounselling.ie` until James or Marie chooses a different final `.ie` domain.
- Assumption: online sessions, medical card acceptance, and exact fee amounts should remain phrased as “Please ask” rather than being invented.
- Assumption: the contact form should use SMTP credentials supplied through environment variables rather than a third-party hosted form backend.
