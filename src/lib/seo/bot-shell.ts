import { SITE, absoluteUrl } from "./site";
import { GLOBAL_JSON_LD } from "./json-ld";

const SOCIAL_DESCRIPTION =
  "Live weather for Malaysia and cities worldwide. Hourly and 7-day outlook, rain, UV, and air quality.";

/**
 * Share image path. Keep the designed OG art in public/og-share.jpg —
 * do not replace it with a logo poster when regenerating favicons.
 */
export const OG_IMAGE_PATH = "/og-share.jpg";

export const OG_IMAGE = {
  url: absoluteUrl(OG_IMAGE_PATH),
  width: 1200,
  height: 630,
  alt: `${SITE.name}: live weather for Malaysia and worldwide cities`,
  type: "image/jpeg",
} as const;

function jsonLdText(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

/**
 * Tiny HTML document for LinkedIn/Facebook/Twitter/Discord crawlers.
 * Served from proxy so OG scans avoid a cold Next.js serverless render.
 */
export function seoBotHtml(): string {
  const title = `${SITE.name} | ${SITE.tagline}`;
  const url = absoluteUrl("/");
  const image = OG_IMAGE.url;
  const desc = SOCIAL_DESCRIPTION;
  const longDesc = SITE.description;
  const fav32 = absoluteUrl("/favicon-32x32.png");
  const fav16 = absoluteUrl("/favicon-16x16.png");
  const logo = absoluteUrl(SITE.logo);
  const apple = absoluteUrl(SITE.appleTouchIcon);
  const manifest = absoluteUrl("/site.webmanifest");

  return `<!DOCTYPE html>
<html lang="en-MY">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta name="theme-color" content="${SITE.themeColor}"/>
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(longDesc)}"/>
<link rel="canonical" href="${escapeHtml(url)}"/>
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"/>
<meta name="application-name" content="${escapeHtml(SITE.name)}"/>
<meta name="author" content="${escapeHtml(SITE.maintainer)}"/>
<meta name="geo.region" content="MY"/>
<meta name="geo.placename" content="Malaysia"/>
<link rel="manifest" href="${escapeHtml(manifest)}"/>
<link rel="icon" href="${escapeHtml(logo)}" type="${SITE.logoType}" sizes="500x500"/>
<link rel="icon" type="image/png" sizes="32x32" href="${escapeHtml(fav32)}"/>
<link rel="icon" type="image/png" sizes="16x16" href="${escapeHtml(fav16)}"/>
<link rel="shortcut icon" href="${escapeHtml(absoluteUrl("/favicon.ico"))}"/>
<link rel="apple-touch-icon" sizes="180x180" href="${escapeHtml(apple)}"/>
<meta property="og:title" content="${escapeHtml(title)}"/>
<meta property="og:description" content="${escapeHtml(desc)}"/>
<meta property="og:url" content="${escapeHtml(url)}"/>
<meta property="og:site_name" content="${escapeHtml(SITE.name)}"/>
<meta property="og:locale" content="${SITE.locale}"/>
<meta property="og:type" content="website"/>
<meta property="og:image" content="${escapeHtml(image)}"/>
<meta property="og:image:secure_url" content="${escapeHtml(image)}"/>
<meta property="og:image:type" content="${OG_IMAGE.type}"/>
<meta property="og:image:width" content="${OG_IMAGE.width}"/>
<meta property="og:image:height" content="${OG_IMAGE.height}"/>
<meta property="og:image:alt" content="${escapeHtml(OG_IMAGE.alt)}"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:site" content="${SITE.twitter}"/>
<meta name="twitter:creator" content="${SITE.twitter}"/>
<meta name="twitter:title" content="${escapeHtml(title)}"/>
<meta name="twitter:description" content="${escapeHtml(desc)}"/>
<meta name="twitter:image" content="${escapeHtml(image)}"/>
<meta name="twitter:image:alt" content="${escapeHtml(OG_IMAGE.alt)}"/>
<script type="application/ld+json">${jsonLdText(GLOBAL_JSON_LD)}</script>
</head>
<body>
<main>
<h1>${escapeHtml(SITE.name)}</h1>
<p>${escapeHtml(longDesc)}</p>
<p><a href="${escapeHtml(url)}">Open Live Weather</a></p>
</main>
</body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
