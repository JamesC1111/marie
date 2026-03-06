import { practiceContact, siteConfig } from "./site";

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
