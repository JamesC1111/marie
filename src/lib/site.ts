const currentYear = new Date().getUTCFullYear();

export const siteConfig = {
  name: "Marie Harding Counselling Service",
  description:
    "Counselling support in Kanturk, Co. Cork. Calm, confidential and practical support for adults, young people and families.",
  siteUrl: "https://www.mariehardingcounselling.ie",
  locale: "en-IE",
  areaServed: ["Kanturk", "North Cork", "Co. Cork"],
  sameAs: [
    "https://www.google.com/maps/search/?api=1&query=12+Percival+Street,+Kanturk,+Co.+Cork",
    "https://www.apcp.ie/",
  ],
} as const;

const publicEnv = import.meta.env ?? {};

export const practiceContact = {
  phoneDisplay: "087 250 3743",
  phoneHref: "+353872503743",
  email: "marieharding4@gmail.com",
  addressLine1: "12 Percival Street",
  addressLine2: "Kanturk, Co. Cork",
  mapsEmbedUrl:
    "https://www.google.com/maps?q=12+Percival+Street,+Kanturk,+Co.+Cork&output=embed",
  mapsLink:
    "https://www.google.com/maps/search/?api=1&query=12+Percival+Street,+Kanturk,+Co.+Cork",
} as const;

export const serviceSignals = {
  privatePracticeSince: "1995",
  privatePracticeYears: currentYear - 1995,
  hseExperience: "1999 to 2016",
  hseYears: 2016 - 1999,
  fullTimeKanturkSince: "July 2018",
  kanturkYears: currentYear - 2018,
  supervision: "APCP and ACI accredited supervisor",
  openingNote: "Day and evening appointments.",
} as const;

export const urgentHelpText =
  "If you need urgent help, call 112 or 999. Samaritans freephone 116 123.";

export const urgentSupportLinks = {
  emergency: {
    label: "Emergency services",
    href: "tel:112",
    display: "112 / 999",
    note: "Call emergency services straight away if there is immediate danger.",
  },
  samaritans: {
    label: "Samaritans",
    href: "tel:116123",
    display: "116 123",
    note: "24-hour emotional support by phone.",
  },
  pieta: {
    label: "Pieta",
    href: "tel:1800247247",
    display: "1800 247 247",
    textDisplay: "Text HELP to 51444",
    textHref: "sms:51444?body=HELP",
    note: "Crisis support for suicidal distress and self-harm.",
  },
  hseUrgent: {
    label: "HSE urgent mental health help",
    href: "https://www2.hse.ie/mental-health/services-support/get-urgent-help/",
    note: "Official HSE urgent mental health guidance and next steps.",
  },
  hseInfo: {
    label: "HSE Your Mental Health information line",
    href: "tel:1800111888",
    display: "1800 111 888",
    note: "Information about mental health supports and services in Ireland.",
  },
} as const;

export const localSupportLinks = {
  growCork: {
    label: "Grow Cork support-group listings",
    href: "https://grow.ie/mental-health-support/",
    note: "Use Grow's official support-group finder to check current Cork meetings.",
  },
  corkSamaritans: {
    label: "Cork Samaritans branch",
    href: "https://www.samaritans.org/branches/cork/",
    note: "Local branch information for Cork city and county.",
  },
  jigsawCork: {
    label: "Jigsaw Cork",
    href: "https://jigsaw.ie/location/jigsaw-cork/",
    note: "Free mental health support for young people in Cork city and county.",
  },
} as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about-marie", label: "About Marie" },
  { href: "/how-counselling-works", label: "How counselling works" },
  { href: "/services", label: "Services" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact" },
] as const;

export const ctaLinks = {
  call: `tel:${practiceContact.phoneHref}`,
  email: `mailto:${practiceContact.email}`,
  request: "/contact#appointment-form",
} as const;

export const practiceAuthor = {
  name: "Marie Harding Counselling Service",
  location: practiceContact.addressLine2,
  role: "Counselling practice",
} as const;

export const featureFlags = {
  chatAssistantEnabled: publicEnv.PUBLIC_CHAT_ASSISTANT_ENABLED !== "false",
  captureMode:
    publicEnv.PUBLIC_CAPTURE_MODE === "newsletter" ? "newsletter" : "callback",
  newsletterFormAction: publicEnv.PUBLIC_NEWSLETTER_FORM_ACTION ?? "",
  newsletterButtonLabel:
    publicEnv.PUBLIC_NEWSLETTER_BUTTON_LABEL ?? "Join updates",
  speculationRulesEnabled:
    publicEnv.PUBLIC_SPECULATION_RULES_ENABLED === "true",
} as const;

export const analyticsConfig = {
  enabled: publicEnv.PUBLIC_ANALYTICS_ENABLED === "true",
  scriptSrc:
    publicEnv.PUBLIC_ANALYTICS_SCRIPT_SRC ??
    "https://plausible.io/js/script.js",
  domain: publicEnv.PUBLIC_ANALYTICS_DOMAIN ?? "",
};

export const defaultMeta = {
  title: "Counselling in Kanturk, Co. Cork",
  description: siteConfig.description,
} as const;
