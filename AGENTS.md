# AGENTS

## Purpose

This repository contains the website for **Marie Harding Counselling Service**. Automated changes must preserve tone, legal safety, accessibility, and trust.

## Default Rules

- Keep UK and Irish English spelling.
- Keep the tone calm, clear, respectful, and human.
- Prefer simple, static-first solutions.
- Preserve accessibility basics: semantic HTML, visible focus styles, keyboard access, readable contrast, and labelled forms.
- Preserve performance: minimal JavaScript, small assets, no heavy animation.
- Keep contact routes obvious on mobile and desktop.

## Safe To Change Automatically

- Layout spacing, colours, borders, and typography refinements that preserve contrast and readability.
- Non-sensitive UI components and utility styles.
- Build tooling, health-check scripts, CI workflow internals, and deployment documentation.
- Resource links, sitemap settings, and robots rules, provided the intent stays the same.
- Markdown content structure changes that do not alter meaning.

## Never Change Without Review

- About story
- Services descriptions
- Crisis wording
- Privacy policy
- Any claims
- Contact details

## Content Rules

- Do not add medical claims.
- Do not promise outcomes.
- Do not invent fees, medical card acceptance, or online-session availability.
- Do not present Marie as a psychologist.
- Keep confidentiality wording prominent and intact in meaning.
- Treat sexual abuse, addiction, bereavement, and child/young-person support language with extra care.

## Technical Rules

- Keep the contact form server-side.
- Do not store enquiry messages in a database unless a human explicitly requests that change.
- Preserve spam protection: validation, honeypot, and rate limiting.
- Keep analytics disabled by default.
- Do not add a cookie banner unless analytics are enabled.

## Review Triggers

- Any change to page meaning, not just wording.
- Any SEO rewrite that changes tone or introduces keyword stuffing.
- Any domain, schema, structured data, or canonical URL change.
- Any legal or privacy copy change.
- Any change to emergency or urgent-help wording.
