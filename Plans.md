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
- [x] Build components: `Hero`, `CTASection`, `ServiceCard`, `FAQAccordion`, `ContactBar`, `Breadcrumbs`, and `PageHeader`.
- [x] Add SEO helpers and JSON-LD helpers.

### 4. Page implementation

- [x] Home
- [x] About Marie
- [x] How counselling works
- [x] Services hub + individual service pages
- [x] Fees and cancellations
- [x] Resources
- [x] Contact
- [x] Privacy policy
- [x] Terms of use
- [x] Accessibility statement
- [x] 404

### 5. Contact and safety systems

- [x] Implement contact API route with server-side validation.
- [x] Add honeypot spam check.
- [x] Add simple IP rate limit.
- [x] Implement email sender interface via environment variables.
- [x] Add user-safe success and error handling.

### 6. SEO, discovery, and metadata

- [x] Unique metadata for each page.
- [x] Canonical URLs and tidy social previews.
- [x] Add `robots.txt` and sitemap generation.
- [x] Add `LocalBusiness`, `WebSite`, `FAQPage`, and article JSON-LD.

### 7. CI and maintenance

- [x] Add scripts for lint, format, test, audit, Lighthouse, and health checks.
- [x] Add weekly GitHub Actions `site-health` workflow.
- [x] Generate markdown health report artifact.
- [x] Open issue automatically only on failure.

### 8. Validation and handover

- [x] Run local build and checks.
- [x] Fix broken links and metadata issues.
- [x] Update memory files with final state.
- [x] Add deployment, domain, and email launch checklist.
- [x] Final content and quality pass.

### 9. Launch hardening

- [x] Add a dedicated `/healthz` endpoint for Render.
- [x] Switch Render health checks to `/healthz`.
- [x] Add host-aware `noindex` protection for non-canonical hosts.
- [x] Serve restrictive `robots.txt` on non-production hosts.
- [x] Keep canonical URLs pointed at `https://www.mariehardingcounselling.ie`.
- [x] Add production-safe contact delivery validation and fallback UI.
- [x] Tighten server-side contact validation without making the form harsher.
- [x] Expand deployment and launch documentation for Render, DNS, SSL, and Blacknight.
- [x] Re-run build, test, health checks, lint, and Lighthouse after hardening.

### 10. Support resources + local trust pass

- [x] Restructure `resources` content around official Irish and Cork-relevant support groups.
- [x] Add official support entries for urgent help, general support, youth support, peer support, bereavement, and family/supporter information.
- [x] Improve urgent-help presentation in the footer and reusable support panels.
- [x] Link the resources layer from contact, how counselling works, footer, and service pages.
- [x] Add local framing for Cork supports without using spammy SEO or fake backlink tactics.
- [x] Expand handover documentation with support-link editing guidance and local trust footprint notes.
- [x] Re-run install, build, test, lint, and health checks after the update.

### 11. Mobile + Desktop Excellence Pass

- [x] Rework the homepage hero for faster trust and clearer contact actions.
- [x] Improve navigation for mobile and desktop with stronger top-level CTAs.
- [x] Tighten spacing, max widths, card rhythm, and section pacing sitewide.
- [x] Strengthen the How counselling works page for nervous first-time visitors.
- [x] Refine services and contact layouts for stronger desktop balance and mobile scannability.
- [x] Expand practical FAQs and make accordion interactions calm and accessible.
- [x] Re-check responsive layouts at 375px, 768px, 1280px, and large desktop.

### 12. Chat assistant + callback capture

- [x] Add a limited practical website chat launcher with safety wording.
- [x] Keep chat restricted to practical topics and urgent-help redirection only.
- [x] Add callback capture sections on Home, Contact, and How counselling works.
- [x] Support callback mode by default and newsletter mode behind configuration.
- [x] Keep all callback and contact submissions email-only with no database storage.
- [x] Document feature flags, privacy notes, and operator setup.

### 13. 2026 Advanced Optimisation Pass

- [x] Add progressive, feature-flagged Speculation Rules for high-intent internal links.
- [x] Keep a zero-request system-font strategy to avoid font CLS and extra requests.
- [x] Keep imagery light and avoid unnecessary image-processing complexity.
- [x] Add stronger security headers for interactive surfaces.
- [x] Evaluate Astro 6 beta and keep the production build on stable Astro 5.
- [x] Keep Navigation API and Trusted Types as documented future options rather than fragile partial implementations.

### 14. Premium design + content growth pass

- [x] Add a dedicated FAQ page.
- [x] Add guides content collection and hub with 8 evergreen guides.
- [x] Add insights content collection and hub with 6 starter articles.
- [x] Add tag pages, RSS feed, related reading blocks, and article schema.
- [x] Strengthen internal linking between Home, FAQ, guides, insights, services, and Contact.
- [x] Document a link-earning strategy based on useful content rather than backlink schemes.

## Assumptions Log

- [x] Canonical domain is `https://www.mariehardingcounselling.ie`.
- [x] Exact fee amounts, online-session availability, and medical card acceptance remain intentionally unconfirmed.
- [x] SMTP environment variables are the supported email delivery method.
- [x] Only the live `www` host should be indexable; local, preview, and Render default hosts should remain blocked from indexing.
- [x] Official support resources should stay factual, external, and clearly separate from Marie's counselling service.
- [x] The chat assistant must remain practical-only and must not act as therapy, diagnosis, or crisis support.
- [x] Callback capture is the default conversion path; newsletter mode is optional and unconfigured by default.
- [x] System fonts are intentional for this project because the best font optimisation here is avoiding a webfont request entirely.
- [x] Astro 6 beta is not worth the production risk for this site yet.

## Final QA Checklist (repo and pre-launch)

- [x] Mobile nav and sticky contact bar work across key pages.
- [x] Keyboard-only navigation is usable; visible focus states throughout.
- [x] All forms are labelled and validation messages are clear.
- [x] Urgent-help note appears sitewide in footer.
- [x] Contact details are consistent on all pages.
- [x] No placeholder text remains.
- [x] No broken internal links.
- [x] Meta title and description are unique on all indexable pages.
- [x] Sitemap and robots are reachable.
- [x] `/healthz` returns a fast 200 response.
- [x] Non-canonical hosts return `noindex` signals and restrictive robots rules.
- [x] Contact and callback forms fall back safely when SMTP is unavailable in production.
- [x] FAQ, guides, insights, and resources pages are linked from relevant journeys.
- [x] RSS feed and custom sitemap route build successfully.
- [x] Lighthouse scores are strong for Home, Services, Contact, Guides, and Insights in local checks.
- [x] Responsive layouts were manually inspected from rendered pages at mobile, tablet, desktop, and large desktop widths.
- [x] Weekly CI health workflow runs and reports correctly.
- [x] Documentation is clear for non-developers.
- [x] Content growth features are useful, non-spammy, and easy to maintain.
