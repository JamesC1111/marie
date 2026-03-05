# Plans

## Milestones

### 1. Foundation and memory files
- [x] Create `Prompt.md`, `Plans.md`, and `Architecture.md`.
- [ ] Create and maintain `Implement.md`, `Documentation.md`, and `AGENTS.md`.
- [ ] Initialise Astro + TypeScript + Tailwind project structure.

### 2. Core layout and design system
- [ ] Build global layout with semantic header, nav, footer, skip link, and main wrapper.
- [ ] Add calm visual system (type scale, spacing rhythm, button, form, link styles).
- [ ] Add mobile sticky contact bar.
- [ ] Add print stylesheet baseline.

### 3. Content model and reusable components
- [ ] Configure Astro content collections for `services` and `resources`.
- [ ] Build components: `Hero`, `CTASection`, `ServiceCard`, `FAQAccordion`, `ContactBar`, `Breadcrumbs`, `PageHeader`.
- [ ] Add SEO helpers and JSON-LD helpers.

### 4. Page implementation
- [ ] Home
- [ ] About Marie
- [ ] How counselling works
- [ ] Services hub + at least 10 individual service pages
- [ ] Fees and cancellations
- [ ] Resources
- [ ] Contact
- [ ] Privacy policy
- [ ] Terms of use
- [ ] Accessibility statement
- [ ] 404 page

### 5. Contact and safety systems
- [ ] Implement contact API route with server-side validation.
- [ ] Add honeypot spam check.
- [ ] Add simple IP rate limit.
- [ ] Implement email sender interface via environment variables.
- [ ] Add user-safe success/error handling.

### 6. SEO, discovery, and metadata
- [ ] Unique metadata for each page.
- [ ] Canonical URLs and tidy social previews.
- [ ] Add `robots.txt` and sitemap generation.
- [ ] Add `LocalBusiness` and `WebSite` JSON-LD.

### 7. CI and maintenance
- [ ] Add scripts for lint/format/test/audit/lighthouse and health checks.
- [ ] Add weekly GitHub Actions `site-health` workflow.
- [ ] Generate markdown health report artifact.
- [ ] Open issue automatically only on failure.

### 8. Validation and handover
- [ ] Run local build and checks.
- [ ] Fix broken links and metadata issues.
- [ ] Update memory files with final state.
- [ ] Add deployment/domain/email launch checklist.
- [ ] Final content and quality pass.

## Assumptions Log
- [ ] None yet.

## Final QA Checklist (pre-launch)
- [ ] Mobile nav and sticky contact bar work across key pages.
- [ ] Keyboard-only navigation is usable; visible focus states throughout.
- [ ] All forms are labelled and validation messages are clear.
- [ ] Urgent-help note appears sitewide in footer.
- [ ] Contact details are consistent on all pages.
- [ ] No placeholder lorem text remains.
- [ ] No broken internal links.
- [ ] Meta title + description are unique on all indexable pages.
- [ ] Sitemap and robots are reachable.
- [ ] Lighthouse scores are strong for Home and Contact.
- [ ] Weekly CI health workflow runs and reports correctly.
- [ ] Documentation is clear for non-developers.
