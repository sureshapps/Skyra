import type { Metadata } from "next";
import { SITE } from "./site";
import type { LocationRef } from "@/lib/weather/types";
import { hrefForLocation } from "@/lib/geo/location-url";
import { OG_IMAGE } from "./bot-shell";

/** Keep social cards under ~125 characters so mobile previews do not cut mid-sentence. */
const SOCIAL_DESCRIPTION =
  "Live weather for Malaysia and cities worldwide. Hourly and 7-day outlook, rain, UV, and air quality.";

const defaultOg = {
  title: `${SITE.name} | ${SITE.tagline}`,
  description: SOCIAL_DESCRIPTION,
  images: [OG_IMAGE],
};

function openGraphBase(
  overrides: Partial<NonNullable<Metadata["openGraph"]>> = {},
): NonNullable<Metadata["openGraph"]> {
  return {
    type: "website",
    locale: SITE.locale,
    siteName: SITE.name,
    title: defaultOg.title,
    description: defaultOg.description,
    images: defaultOg.images,
    ...overrides,
  };
}

function twitterBase(
  overrides: Partial<NonNullable<Metadata["twitter"]>> = {},
): NonNullable<Metadata["twitter"]> {
  return {
    card: "summary_large_image",
    site: SITE.twitter,
    creator: SITE.twitter,
    title: defaultOg.title,
    description: defaultOg.description,
    images: [OG_IMAGE.url],
    ...overrides,
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} | ${SITE.tagline}`,
    template: `%s | ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  authors: [{ name: SITE.maintainer, url: SITE.maintainerUrl }],
  creator: SITE.maintainer,
  publisher: SITE.name,
  category: "weather",
  keywords: [...SITE.keywords],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: SITE.logo, type: SITE.logoType, sizes: "500x500" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    shortcut: SITE.logo,
    apple: [{ url: SITE.appleTouchIcon, sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  openGraph: openGraphBase({ url: "/" }),
  twitter: twitterBase(),
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
  appleWebApp: {
    capable: true,
    title: SITE.shortName,
    statusBarStyle: "black-translucent",
  },
  other: {
    "geo.region": "MY",
    "geo.placename": "Malaysia",
    "code-repository": SITE.repository,
    license: SITE.license,
  },
};

export function welcomeMetadata(): Metadata {
  return {
    title: `${SITE.name} | ${SITE.tagline}`,
    description: SITE.description,
    alternates: { canonical: "/" },
    openGraph: openGraphBase({
      title: defaultOg.title,
      description: SOCIAL_DESCRIPTION,
      url: "/",
    }),
    twitter: twitterBase(),
  };
}

export function locationMetadata(location: LocationRef): Metadata {
  const placeLine = location.state
    ? `${location.name}, ${location.state}`
    : location.name;
  const title = `Weather in ${placeLine}`;
  const description = `Current conditions in ${placeLine}, plus hourly and 7-day forecast, rain, wind, UV, and air quality.`;
  const socialDescription =
    description.length <= 125
      ? description
      : `Weather in ${placeLine}: current, hourly, 7-day, rain, UV, and air quality.`;
  const path = hrefForLocation(location);

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: openGraphBase({
      title: `${title} | ${SITE.name}`,
      description: socialDescription,
      url: path,
    }),
    twitter: twitterBase({
      title: `${title} | ${SITE.name}`,
      description: socialDescription,
    }),
    other: {
      "geo.placename": placeLine,
      "geo.position": `${location.lat};${location.lon}`,
      ICBM: `${location.lat}, ${location.lon}`,
    },
  };
}

export function errorMetadata(): Metadata {
  return {
    title: "Weather unavailable",
    description: "Live weather did not load. Search for your city and try again.",
    robots: { index: false, follow: true },
    openGraph: openGraphBase({
      title: `Weather unavailable | ${SITE.name}`,
      description: "Live weather did not load. Search for your city and try again.",
    }),
    twitter: twitterBase({
      title: `Weather unavailable | ${SITE.name}`,
      description: "Live weather did not load. Search for your city and try again.",
    }),
  };
}
