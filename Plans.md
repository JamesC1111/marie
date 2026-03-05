# Plans

## Milestones

### 1. Foundation and memory files

- [x] Create `Prompt.md`, `Plans.md`, and `Architecture.md`.
- [x] Create and maintain `Implement.md`, `Documentation.md`, and `AGENTS.md`.
- [x] Initialise Astro + TypeScript + Tailwind project structure.

### 2. Core layout and design system

- [x] Build global layout with semantic header, nav, footer, skip link, and main wrapper.
- [x] Add calm visual system (type scale, spacing rhythm, button, form, link styles).
- [x] Add mobile sticky contact bar.
- [x] Add print stylesheet baseline.

### 3. Content model and reusable components

- [x] Configure Astro content collections for `services` and `resources`.
- [x] Build components: `Hero`, `CTASection`, `ServiceCard`, `FAQAccordion`, `ContactBar`, `Breadcrumbs`, `PageHeader`.
- [x] Add SEO helpers and JSON-LD helpers.

### 4. Page implementation

- [x] Home
- [x] About Marie
- [x] How counselling works
- [x] Services hub + at least 10 individual service pages
- [x] Fees and cancellations
- [x] Resources
- [x] Contact
- [x] Privacy policy
- [x] Terms of use
- [x] Accessibility statement
- [x] 404 page

### 5. Contact and safety systems

- [x] Implement contact API route with server-side validation.
- [x] Add honeypot spam check.
- [x] Add simple IP rate limit.
- [x] Implement email sender interface via environment variables.
- [x] Add user-safe success/error handling.

### 6. SEO, discovery, and metadata

- [x] Unique metadata for each page.
- [x] Canonical URLs and tidy social previews.
- [x] Add `robots.txt` and sitemap generation.
- [x] Add `LocalBusiness` and `WebSite` JSON-LD.

### 7. CI and maintenance

- [x] Add scripts for lint/format/test/audit/lighthouse and health checks.
- [x] Add weekly GitHub Actions `site-health` workflow.
- [x] Generate markdown health report artifact.
- [x] Open issue automatically only on failure.

### 8. Validation and handover

- [x] Run local build and checks.
- [x] Fix broken links and metadata issues.
- [x] Update memory files with final state.
- [x] Add deployment/domain/email launch checklist.
- [x] Final content and quality pass.

## Assumptions Log

- [x] Canonical domain placeholder is `https://www.mariehardingcounselling.ie` until the final live domain is chosen.
- [x] Exact fee amounts, online-session availability, and medical card acceptance remain intentionally unconfirmed.
- [x] SMTP environment variables are the supported email delivery method.

## Final QA Checklist (pre-launch)

- [x] Mobile nav and sticky contact bar work across key pages.
- [x] Keyboard-only navigation is usable; visible focus states throughout.
- [x] All forms are labelled and validation messages are clear.
- [x] Urgent-help note appears sitewide in footer.
- [x] Contact details are consistent on all pages.
- [x] No placeholder lorem text remains.
- [x] No broken internal links.
- [x] Meta title + description are unique on all indexable pages.
- [x] Sitemap and robots are reachable.
- [x] Lighthouse scores are strong for Home and Contact.
- [x] Weekly CI health workflow runs and reports correctly.
- [x] Documentation is clear for non-developers.
