# Documentation

## Summary

This repository contains the production-ready Astro website for **Marie Harding Counselling Service** in **Kanturk, Co. Cork**.

It includes:

- a calm, mobile-first front end with strong desktop layouts
- markdown-driven services, resources, guides, and insights content
- a practical FAQ page, RSS feed, and custom sitemap route
- a server-side contact form and callback form that send to email and do not store enquiries in a database
- a limited practical chat assistant with clear safety boundaries
- host-aware indexing safety for Render preview and default hosts
- Render deployment support and launch documentation
- weekly automated site-health checks in GitHub Actions

## Short Handover Summary

- Run locally with `npm install` then `npm run dev`.
- Build for production with `npm run build` and start with `npm start` or `npm run preview`.
- Edit counselling services in `src/content/services`.
- Edit support links in `src/content/resources`.
- Edit evergreen guides in `src/content/guides`.
- Edit weekly articles in `src/content/insights`.
- Edit shared FAQs in `src/lib/faqs.ts`.
- Edit contact details, trust signals, and feature flags in `src/lib/site.ts`.

## What Was Built

- Mobile-first counselling website with calm, accessible design.
- Shared layout, reusable components, and markdown collections for easier editing.
- Contact page with click-to-call, tap-to-email, map embed, protected enquiry form, and short callback-capture form.
- Support resources page with official Irish services, Cork framing, and reusable urgent-help panels.
- FAQ page with practical first-session questions answered clearly.
- Guides hub with evergreen, practical articles designed to stay useful over time.
- Insights hub with shorter weekly-style articles, tags, and RSS feed.
- Legal pages, accessibility statement, custom `sitemap.xml`, dynamic `robots.txt`, `404`, and OG image.
- Optional privacy-respecting analytics, defaulted off.
- Dedicated `/healthz` endpoint for Render health checks.
- Host-aware `noindex` protection for non-canonical hosts.
- Weekly GitHub Actions workflow for site-health reporting.

## How To Run Locally

### Normal development

1. Open a terminal in the project folder.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open [http://localhost:4321](http://localhost:4321).

### Production-style local run

1. Run `npm run build`.
2. Run `npm run preview`.
3. Open [http://localhost:4321](http://localhost:4321).

Notes:

- The local preview and dev server are for editing and checking only.
- `npm run check:health` and `npm run lighthouse` use their own preview process and do not rely on a browser already being open.

## How To Edit Content

- Main page copy lives in `src/pages`.
- Service pages live in `src/content/services`.
- Resource items live in `src/content/resources`.
- Evergreen guides live in `src/content/guides`.
- Weekly-style insight posts live in `src/content/insights`.
- Shared FAQs live in `src/lib/faqs.ts`.
- Shared contact details, trust signals, and structured-data values live in `src/lib/site.ts`.

When editing:

- Keep UK and Irish English spelling.
- Keep the tone calm, direct, and non-salesy.
- Do not add medical claims or guaranteed outcomes.
- Do not change crisis wording casually.
- Do not change protected counselling copy without human review. See `AGENTS.md`.

### Services

Each service markdown file should keep the same broad structure and meaning:

- What this can feel like
- How counselling may help
- What we might work on together
- How to start
- Confidentiality note

### Support links

The support resources layer is intentionally simple:

- one markdown file per organisation in `src/content/resources`
- grouping is controlled by the `groups` array in each file
- urgent and local quick links are centralised in `src/lib/site.ts`

When updating support entries:

- use official organisation links only
- keep summaries short, factual, and non-alarmist
- keep local notes factual
- do not add referral schemes, affiliate links, or unofficial directories
- check phone numbers, text numbers, and emails against the official site before publishing

### Guides and insights

Use `guides` for evergreen pages that should keep earning traffic over time.

Use `insights` for shorter weekly posts.

Recommended publishing rhythm:

- 1 insight per week if Marie or James can sustain it
- 1 new evergreen guide only when there is something genuinely useful to add
- update existing evergreen guides before creating thin new pages

Recommended content themes:

- first-session questions
- confidentiality and practical expectations
- anxiety and day-to-day stress
- grief and bereavement
- online vs in-person practicalities
- local or national support information

## Design System And Layout Notes

The design system is intentionally restrained:

- soft neutral background with calm teal accents
- editorial serif headings with a system sans body font
- rounded section shells and cards with subtle shadows
- short readable line lengths on desktop
- clear CTA hierarchy without pushy styling
- strong mobile sticky contact bar
- unobtrusive bottom-right chat launcher

The site is tuned to feel spacious on desktop without becoming empty:

- the main content width is capped
- long prose uses a tighter measure
- large card grids collapse cleanly on smaller screens
- the contact page uses a specific sidebar override so desktop cards do not become too narrow

## Chat Assistant And Callback Capture

### Chat assistant behaviour

The chat assistant is intentionally limited.

It may help with:

- appointments
- contact options
- location
- online vs in-person sessions
- first-session expectations
- confidentiality basics
- urgent-help guidance

It must not provide:

- counselling
- diagnosis
- treatment advice
- crisis intervention
- encouragement to share highly sensitive personal or medical details

If urgent-risk language appears, the assistant stops normal chat and directs the user to urgent help.

### Chat configuration

Chat is enabled by default in the codebase and can be turned off with:

- `PUBLIC_CHAT_ASSISTANT_ENABLED=false`

The chat is local to the site. No provider key is required for the current implementation.

If a third-party widget is ever considered later:

- keep it lazy-loaded
- keep it feature-flagged
- review privacy, CSP, and performance impact first
- do not let it become an AI therapy or crisis tool

### Callback and newsletter capture modes

The capture component supports two modes:

- `callback` (default)
- `newsletter` (optional)

Relevant variables:

- `PUBLIC_CAPTURE_MODE=callback`
- `PUBLIC_NEWSLETTER_FORM_ACTION=`
- `PUBLIC_NEWSLETTER_BUTTON_LABEL=Join updates`

If `PUBLIC_CAPTURE_MODE=newsletter` is enabled, you must also set a valid external form action URL. Otherwise the page will show a configuration warning.

Privacy note for counselling context:

- callback details are sent to email for follow-up and are not stored in a website database
- newsletter mode should only be enabled if consent wording is explicit and the provider is GDPR-appropriate

## Contact Form Email Setup

The contact and callback forms send messages by email and do not store message contents on the site.

### Required SMTP variables

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`

### Recommended contact variables

- `CONTACT_FROM_EMAIL`

### Optional variable

- `CONTACT_TO_EMAIL`

If `CONTACT_TO_EMAIL` is not set, the site falls back to `marieharding4@gmail.com`.

Reference template: [`.env.example`](C:\Users\james\OneDrive\Documents\Playground.env.example)

### Delivery behaviour

- Local development or local preview with missing SMTP:
  - the site keeps the current friendly fallback behaviour
  - submissions are logged locally for testing
  - no email is sent
- Non-local production host with missing or invalid SMTP:
  - the contact and callback sections show a stronger fallback note to call or email directly
  - the APIs return a safe error state
  - internal configuration details are logged only for the operator

## Feature Flags And Browser Support

### Feature flags

- `PUBLIC_CHAT_ASSISTANT_ENABLED`
- `PUBLIC_CAPTURE_MODE`
- `PUBLIC_NEWSLETTER_FORM_ACTION`
- `PUBLIC_NEWSLETTER_BUTTON_LABEL`
- `PUBLIC_SPECULATION_RULES_ENABLED`
- `PUBLIC_ANALYTICS_ENABLED`
- `PUBLIC_ANALYTICS_DOMAIN`
- `PUBLIC_ANALYTICS_SCRIPT_SRC`

### Speculation Rules

Speculation Rules are optional and off by default.

To enable them on the live site:

- set `PUBLIC_SPECULATION_RULES_ENABLED=true`

Current behaviour:

- only renders on the canonical production host
- only targets links marked `data-speculate="intent"`
- no effect in browsers that do not support the API
- no effect on non-production hosts

This keeps prefetching narrow and safe.

### Motion and transitions

The site uses only small progressive enhancements:

- CSS view transitions where supported
- no heavy page animation
- reduced-motion preferences disable transitions and animations

## Advanced Optimisation Notes

### Adopted

- System font strategy for zero extra font requests.
- Feature-flagged Speculation Rules for high-intent internal links.
- Lightweight security headers in middleware.
- Custom `sitemap.xml` route aligned with current content collections.
- RSS feed for the insights section.
- Minimal image usage with a light OG asset rather than decorative media.

### Evaluated but not adopted

#### Astro 6 beta

Current installed Astro line is stable Astro 5.

Decision:

- do not upgrade yet

Reason:

- no strong business or performance win for this calm, content-led site
- current build is already fast and stable
- beta risk is not justified for a small local practice site

Suggested future review point:

- review Astro 6 again after stable release notes clearly show a practical win for this project

#### Navigation API

Decision:

- not implemented

Reason:

- this is a mostly server-rendered content site
- there is no strong UX gain compared with the added maintenance complexity

#### Trusted Types and stricter CSP

Decision:

- documented as future work, not implemented yet

Reason:

- current interactive surface area is still small
- adding a strict policy now risks breaking safe inline enhancements without clear practical benefit
- revisit if third-party scripts or richer client-side features are added

## Analytics

Analytics are off by default.

To enable privacy-focused analytics:

- set `PUBLIC_ANALYTICS_ENABLED=true`
- set `PUBLIC_ANALYTICS_DOMAIN`
- optionally set `PUBLIC_ANALYTICS_SCRIPT_SRC`

If analytics are enabled, the cookie banner appears. If analytics stay off, no banner is shown.

## Local Checks

- `npm run lint`
- `npm run format`
- `npm run test`
- `npm run audit`
- `npm run build`
- `npm run check:links`
- `npm run check:health`
- `npm run lighthouse`

Notes:

- `npm run check:health` verifies links, schema, accessibility, `/healthz`, and non-production indexing protection.
- `npm run lighthouse` audits the canonical `www` host name against a local preview alias.
- Because the local preview server is plain HTTP, the Lighthouse script adjusts the HTTPS-only best-practice checks for local scoring. SSL must still be verified on the live Render domain before launch.

## Deployment

This project uses Astro with the Node adapter because the contact and callback forms are server-side.

### Render deployment

The repository includes [render.yaml](C:\Users\james\OneDrive\Documents\Playground\render.yaml) for a Render web service.

Recommended setup:

1. Sign in to [Render](https://render.com/).
2. Create a new Blueprint or Web Service from the GitHub repo `JamesC1111/marie`.
3. Let Render read the included `render.yaml`.
4. Provide the secret values:
   - `CONTACT_FROM_EMAIL`
   - `SMTP_HOST`
   - `SMTP_USER`
   - `SMTP_PASS`
5. Deploy the service.

Important:

- `render.yaml` uses `healthCheckPath: /healthz`.
- `CONTACT_TO_EMAIL` is already set to `marieharding4@gmail.com` in the blueprint.
- `SMTP_PORT` defaults to `587`.
- The blueprint currently uses `plan: free` for safe testing. Change to a paid Render instance before launch because free web services sleep after inactivity.
- The selected region is `frankfurt`, the closest available listed region to Ireland.

### Manual Node deployment

If you host somewhere else that supports a long-running Node process:

1. Set the environment variables from `.env.example`.
2. Run `npm ci`.
3. Run `npm run build`.
4. Start the server with `npm start`.

## Canonical Host And Indexing Safety

The site is configured for one live canonical host:

- `https://www.mariehardingcounselling.ie`

Current behaviour:

- canonical tags always point to `https://www.mariehardingcounselling.ie`
- non-canonical hosts return:
  - `meta name="robots" content="noindex, nofollow"`
  - `X-Robots-Tag: noindex, nofollow`
  - a restrictive `robots.txt` that disallows crawling

This covers:

- local development hosts
- local preview hosts
- Render default `onrender.com` hostname
- other preview or accidental duplicate hosts

Important:

- root domain redirect (`mariehardingcounselling.ie` -> `www.mariehardingcounselling.ie`) still depends on the Render custom-domain setup and DNS being correct

## Domain And `.ie` Notes

- Keep one canonical domain only.
- Use `www.mariehardingcounselling.ie` as the canonical domain.
- Redirect the root/apex domain to `www`.
- Keep `src/lib/site.ts` and `astro.config.mjs` aligned with the live canonical domain.
- Do not leave both root and `www` serving as separate indexable hosts.

## Render Custom Domain Troubleshooting

Use this when Render deployment is working but the live domain is not yet correct.

### Required DNS pattern

For `www`:

```text
Type: CNAME
Host/Name: www
Value/Target: your-service.onrender.com
TTL: default
```

For the root/apex domain:

```text
Type: A
Host/Name: @
Value/Target: 216.24.57.1
TTL: default
```

### Troubleshooting checklist

- Add `www.mariehardingcounselling.ie` in Render first.
- Let Render attach the root/apex domain after that.
- Confirm the `www` record is a `CNAME` to the exact Render hostname shown in Render.
- Confirm the root/apex `@` record is an `A` record to `216.24.57.1`.
- Remove conflicting `AAAA` records for `@` or `www`.
- If no `CAA` records exist, do not add new ones.
- If `CAA` records already exist, make sure they do not block Render SSL issuance. If SSL will not issue, review the existing `CAA` policy before changing anything else.
- Wait for DNS propagation. Re-check after 15 minutes, 1 hour, and again after a few hours if needed.
- In Render, click `Verify` after DNS is in place.
- Only treat SSL as complete after Render shows the custom domain as verified and HTTPS loads successfully in the browser.

## Blacknight DNS Checklist

The domain is managed in Blacknight.

Before changing anything:

- keep Blacknight nameservers in place unless you are intentionally moving DNS elsewhere
- edit only the DNS records needed for Render

Checklist:

1. Sign in to Blacknight control panel.
2. Open DNS management for `mariehardingcounselling.ie`.
3. Find the current `www` record.
4. Set `www` to a `CNAME` pointing to the exact Render hostname.
5. Find the root/apex `@` record.
6. Set the root/apex to `A 216.24.57.1`.
7. Remove conflicting `AAAA` records for `@` and `www`.
8. Save the zone.
9. Wait for propagation, then return to Render and verify the domain.

## Launch Checklist For James

### Render and DNS

- [ ] Confirm the Render custom domain is verified.
- [ ] Confirm SSL is active on both `mariehardingcounselling.ie` and `www.mariehardingcounselling.ie`.
- [ ] Confirm the root/apex domain redirects to `www`.
- [ ] Confirm the Render default hostname is `noindex`.
- [ ] Confirm `robots.txt` is correct on the live production host.

### Contact, callback, and chat

- [ ] Confirm SMTP works in production.
- [ ] Confirm a real contact form submission is received in the inbox.
- [ ] Confirm a real callback form submission is received in the inbox.
- [ ] Confirm the chat assistant loads and only answers practical questions.
- [ ] Confirm urgent-risk wording in chat points to the support resources page and emergency contacts.
- [ ] Confirm fallback direct call and email details are still correct.

### Search and listings

- [ ] Verify Google Search Console ownership.
- [ ] Submit the production sitemap.
- [ ] Confirm Google Business Profile uses the live domain.
- [ ] Confirm Facebook uses the live domain if linked.
- [ ] Confirm any NAPCP listing points to the live domain if linked.

### Final live checks

- [ ] Confirm phone, email, and address match across the live site.
- [ ] Confirm the homepage, services, guides, and contact page all load correctly on mobile.
- [ ] Confirm the contact bar works on a phone.
- [ ] Confirm the callback capture section behaves correctly on Home and Contact.
- [ ] Confirm the site loads over HTTPS without certificate warnings.

## Support Resources Maintenance

Use this when reviewing or updating the support-resources layer.

### Current support structure

- Urgent help
- General mental health support
- Young people
- Peer support
- Bereavement and suicide-related support
- Family and supporter information

### Safe editing process

1. Open the relevant markdown file in `src/content/resources`.
2. Update the official URL, summary, or contact details only after checking the source organisation.
3. Keep summaries practical and calm.
4. Run:
   - `npm run build`
   - `npm run test`
   - `npm run check:health`
5. Review the Resources page locally on mobile and desktop.

### External links currently included

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

## Local Trust Footprint

The goal is not backlink building. The goal is consistency, trust, and accurate local information.

Maintain these real profiles and citations with the same name, address, phone, website, and service wording as the live site:

- Google Business Profile
- Marie's main Facebook page
- NAPCP listing
- any other real professional or community listing already associated with Marie

Guidelines:

- use the live canonical website URL
- keep the business name exactly consistent
- keep address and phone formatting consistent
- keep service descriptions calm and factual
- do not use backlink schemes, directory spam, bought listings, or link exchanges

## Content Growth And Link-Earning Strategy

The site should earn links by being genuinely useful, not by chasing links artificially.

### Current link-earning assets

- evergreen practical guides
- a curated support resources page
- a practical FAQ page
- short insights articles that can be published weekly
- clean share metadata and article templates
- good internal linking between articles, services, and contact actions

### Recommended weekly workflow

1. Choose one practical topic that real visitors are likely to ask about.
2. Decide whether it is an evergreen guide or a shorter insight.
3. Write or edit the markdown file.
4. Link it to one relevant service page and one next-step page such as Contact or How counselling works.
5. Run `npm run build` and `npm run check:health`.
6. Publish only if the piece is genuinely useful and not padded for SEO.

### Do not do this

- do not buy backlinks
- do not use directory spam
- do not create doorway pages
- do not stuff location names into titles or body copy
- do not create thin weekly posts just to hit a number

## Domain Approval Note

Domain approval does not block content, design, or support-resource work.

Once the domain is approved, the final live checks are:

- DNS records
- SSL
- canonical host verification
- Search Console setup
- live contact and callback form tests

## VS Code And Local Folder Use

To work from a local copy:

1. Clone or copy the repository into the chosen folder.
2. Open that folder in VS Code.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open [http://localhost:4321](http://localhost:4321).

## Future Growth

- Add more evergreen guides only when the topic is clearly useful and distinct.
- Add more FAQ entries only after manual review of tone, compliance, and confidentiality implications.
- Revisit Astro 6 after stable release notes show a clear operational gain.
- Revisit stricter CSP or Trusted Types only if third-party scripts are introduced.
