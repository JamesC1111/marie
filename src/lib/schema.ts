import { practiceAuthor, practiceContact, siteConfig } from "./site";

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.siteUrl,
    inLanguage: siteConfig.locale,
    description: siteConfig.description,
  };
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.siteUrl}/#localbusiness`,
    name: siteConfig.name,
    url: siteConfig.siteUrl,
    email: `mailto:${practiceContact.email}`,
    telephone: practiceContact.phoneDisplay,
    address: {
      "@type": "PostalAddress",
      streetAddress: practiceContact.addressLine1,
      addressLocality: "Kanturk",
      addressRegion: "Co. Cork",
      addressCountry: "IE",
    },
    areaServed: siteConfig.areaServed.map((area) => ({
      "@type": "AdministrativeArea",
      name: area,
    })),
    sameAs: siteConfig.sameAs,
  };
}

export function articleSchema({
  type = "Article",
  headline,
  description,
  url,
  published,
  updated,
  keywords,
}: {
  type?: "Article" | "BlogPosting";
  headline: string;
  description: string;
  url: string;
  published: Date;
  updated?: Date;
  keywords?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": type,
    headline,
    description,
    url,
    datePublished: published.toISOString(),
    dateModified: (updated ?? published).toISOString(),
    author: {
      "@type": "Organization",
      name: practiceAuthor.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.siteUrl,
    },
    inLanguage: siteConfig.locale,
    keywords,
  };
}

export function faqSchema(
  entries: Array<{ question: string; answer: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer,
      },
    })),
  };
}
