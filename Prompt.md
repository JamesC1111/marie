# Prompt

## Project Goal
Build a production-ready, static-first counselling website for **Marie Harding Counselling Service** in **Kanturk, Co. Cork** using **Astro + TypeScript + Tailwind**. The site must be calm, clear, accessible, mobile-first, and easy to maintain.

## Audience and Tone
- People may arrive feeling anxious, tired, and unsure.
- Writing should be human, plain, respectful, and non-salesy.
- Use UK/Irish English spelling.
- No hype and no medical/outcome guarantees.

## Source-of-Truth Content
- Use the supplied biography, service list, contact details, confidentiality statement, and professional listing note.
- Include Marie's first-person story publicly.
- Handle sensitive topics with supportive, careful language.
- Do not present Marie as a psychologist unless explicitly supported.

## Core Requirements
- Clear top-level pages:
  - Home
  - About Marie
  - How counselling works
  - Services hub + individual service pages
  - Fees and cancellations
  - Resources
  - Contact
  - Privacy policy
  - Terms of use
  - Accessibility statement
- Include sitewide urgent-help note:
  `If you need urgent help, call 112 or 999. Samaritans freephone 116 123.`
- Add clear CTA options everywhere: Call, Email, Request appointment.
- Include mobile sticky contact bar.
- Add contact form with:
  - Server-side validation
  - Honeypot
  - Simple rate limit
  - Email delivery to `marieharding4@gmail.com`
  - No database storage of messages
- Use content collections for service/resource content.
- Implement structured data (LocalBusiness + WebSite), OG/Twitter tags, canonical URLs.
- Add robots.txt, sitemap, 404 page, and print-friendly styles.
- Add optional privacy-friendly analytics defaulted OFF; cookie banner only when analytics enabled.
- Add weekly GitHub Actions site-health workflow (build, links, Lighthouse, schema, accessibility) with report artifact and issue-on-failure.

## Quality Targets
- Excellent Core Web Vitals orientation: minimal JS, static-first rendering.
- WCAG 2.2 AA basics: semantic structure, labels, focus states, contrast, keyboard-friendly navigation, skip link.
- Strong internal linking (especially Home -> How it works -> Contact).
- Unique, natural metadata across pages.

## Definition of Done
- Site builds and runs locally without errors.
- All required pages/components/content exist and are connected.
- No broken internal links.
- Contact form endpoint validates and returns safe user-facing responses.
- Documentation enables handover for editing, deployment, domain setup, and email setup.
- Project memory files exist and are updated:
  - `Prompt.md`
  - `Plans.md`
  - `Architecture.md`
  - `Implement.md`
  - `Documentation.md`
  - `AGENTS.md`
