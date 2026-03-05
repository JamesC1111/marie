export const siteConfig = {
  name: "Marie Harding Counselling Service",
  description:
    "Counselling support in Kanturk, Co. Cork. Calm, confidential and practical support for adults, young people and families.",
  siteUrl: "https://www.mariehardingcounselling.ie",
  locale: "en-IE",
  areaServed: ["Kanturk", "North Cork", "Co. Cork"],
  sameAs: [
    "https://www.google.com/maps/search/?api=1&query=12+Percival+Street,+Kanturk,+Co.+Cork",
    "https://www.napcp.ie/",
  ],
} as const;

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
  hseExperience: "1999 to 2016",
  fullTimeKanturkSince: "July 2018",
  supervision: "Accredited supervisor with the NAPCP",
  openingNote: "Day and evening appointments.",
} as const;

export const urgentHelpText =
  "If you need urgent help, call 112 or 999. Samaritans freephone 116 123.";

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about-marie", label: "About Marie" },
  { href: "/how-counselling-works", label: "How counselling works" },
  { href: "/services", label: "Services" },
  { href: "/fees-and-cancellations", label: "Fees" },
  { href: "/resources", label: "Resources" },
  { href: "/contact", label: "Contact" },
] as const;

export const ctaLinks = {
  call: `tel:${practiceContact.phoneHref}`,
  email: `mailto:${practiceContact.email}`,
  request: "/contact#appointment-form",
} as const;

const analyticsEnv = import.meta.env ?? {};

export const analyticsConfig = {
  enabled: analyticsEnv.PUBLIC_ANALYTICS_ENABLED === "true",
  scriptSrc:
    analyticsEnv.PUBLIC_ANALYTICS_SCRIPT_SRC ??
    "https://plausible.io/js/script.js",
  domain: analyticsEnv.PUBLIC_ANALYTICS_DOMAIN ?? "",
};

export const defaultMeta = {
  title: "Counselling in Kanturk, Co. Cork",
  description: siteConfig.description,
} as const;
