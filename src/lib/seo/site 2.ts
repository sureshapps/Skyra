/** Site config for SEO, OpenGraph, sitemap, and AI crawlers. */
import { publicEnv } from "@/lib/env/public";

export const SITE = {
  name: "SKYRA",
  shortName: "SKYRA",
  tagline: "Weather for Malaysia and beyond",
  description:
    "Live weather for cities in Malaysia and around the world. Hourly and 7-day forecasts, rain, wind, UV, air quality, and short alerts you can use.",
  locale: "en_MY",
  country: "MY",
  url: publicEnv.siteUrl,
  repository: "https://github.com/sureshapps/Skyra",
  repositoryGit: "https://github.com/sureshapps/Skyra.git",
  maintainer: "Suresh Kaleyannan",
  maintainerUrl: "https://github.com/sureshapps/",
  license: "MPL-2.0",
  licenseUrl: "https://www.mozilla.org/MPL/2.0/",
  twitter: "@sureshksmy",
  themeColor: "#070b12",
  /** Brand mark (PNG). Bump ?v= when the file changes so CDN drops stale bytes. */
  logo: "/logo.png?v=1",
  logoType: "image/png",
  appleTouchIcon: "/apple-touch-icon.png?v=1",
  keywords: [
    "SKYRA",
    "SKYRA weather",
    "Malaysia weather",
    "weather forecast Malaysia",
    "live weather",
    "hourly forecast",
    "7 day forecast",
    "rain forecast",
    "air quality index",
    "UV index",
    "weather alerts",
    "Malay weather",
    "Chinese weather",
    "Tamil weather",
    "world weather",
    "city weather search",
  ],
} as const;

export function absoluteUrl(path = "/"): string {
  if (path.startsWith("http")) return path;
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Next.js writes sitemap `<loc>` as-is. Query `&` must be `&amp;` or XML parsers fail. */
export function sitemapLoc(path = "/"): string {
  return absoluteUrl(path)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
