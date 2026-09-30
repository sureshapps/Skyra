import { SITE, absoluteUrl } from "./site";
import { SITE_FAQ } from "./faq";
import type { LocationRef } from "@/lib/weather/types";
import type { WeatherSnapshot } from "@/lib/weather/types";
import { hrefForLocation } from "@/lib/geo/location-url";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    logo: absoluteUrl(SITE.logo),
    description: SITE.description,
    founder: {
      "@type": "Person",
      name: SITE.maintainer,
      url: SITE.maintainerUrl,
    },
    sameAs: [SITE.repository, SITE.maintainerUrl],
    areaServed: [
      { "@type": "Country", name: "Malaysia" },
      { "@type": "Place", name: "World" },
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    inLanguage: ["en-MY", "en-ZH", "en-TA"],
    publisher: { "@type": "Organization", name: SITE.name },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.url}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function webApplicationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE.name,
    url: SITE.url,
    applicationCategory: "WeatherApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "MYR" },
    description: SITE.description,
    author: {
      "@type": "Person",
      name: SITE.maintainer,
      url: SITE.maintainerUrl,
    },
    codeRepository: SITE.repository,
    license: SITE.licenseUrl,
    isAccessibleForFree: true,
    featureList: [
      "Hourly and 7-day forecast",
      "City search worldwide",
      "GPS weather for your area",
      "Air quality and UV index",
      "Rainfall charts",
      "UI in many languages",
      "Saved places on device",
    ],
    screenshot: absoluteUrl("/og-share.jpg"),
  };
}

export function faqPageJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: SITE_FAQ.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function weatherPageJsonLd(
  location: LocationRef,
  snapshot: WeatherSnapshot,
) {
  const placeName = location.state
    ? `${location.name}, ${location.state}`
    : location.name;
  const pageUrl = absoluteUrl(hrefForLocation(location));
  const temp = Math.round(snapshot.current.temperatureC);

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Weather in ${placeName}`,
    url: pageUrl,
    description: `${snapshot.current.conditionLabel}. High near ${Math.round(snapshot.forecast7[0]?.maxTempC ?? temp)}°C in ${placeName}. Live forecast from ${SITE.name}.`,
    isPartOf: { "@type": "WebSite", name: SITE.name, url: SITE.url },
    about: {
      "@type": "Place",
      name: location.name,
      address: {
        "@type": "PostalAddress",
        addressRegion: location.state || undefined,
        addressCountry: location.countryCode || "MY",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: location.lat,
        longitude: location.lon,
      },
    },
    mainEntity: {
      "@type": "Observation",
      name: `Current weather in ${placeName}`,
      observationDate: snapshot.current.observedAt,
      measuredProperty: {
        "@type": "PropertyValue",
        name: "Temperature",
        value: temp,
        unitCode: "CEL",
      },
    },
  };
}

export function globalJsonLdGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      organizationJsonLd(),
      websiteJsonLd(),
      webApplicationJsonLd(),
      faqPageJsonLd(),
    ],
  };
}

/** Built once at module load so layout does not rebuild the graph every request. */
export const GLOBAL_JSON_LD = globalJsonLdGraph();

