import type { Metadata, Viewport } from "next";
import { Outfit, IBM_Plex_Sans } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { JsonLd } from "@/components/seo/JsonLd";
import { rootMetadata } from "@/lib/seo/metadata";
import { GLOBAL_JSON_LD } from "@/lib/seo/json-ld";
import { SITE } from "@/lib/seo/site";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-display-face",
  subsets: ["latin"],
  display: "swap",
});

const plex = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = rootMetadata;

/** theme-color must live on viewport in Next.js 14+ (metadata.themeColor is ignored). */
export const viewport: Viewport = {
  themeColor: SITE.themeColor,
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en-IN"
      className={`${outfit.variable} ${plex.variable} h-full antialiased`}
    >
      <head>
        <link rel="llms-txt" href="/llms.txt" />
        <link rel="author" type="text/plain" href="/humans.txt" />
        <link rel="author" href="https://github.com/nishal21" />
        <link rel="me" href="https://github.com/nishal21" />
        <link rel="license" href="https://www.mozilla.org/MPL/2.0/" />
      </head>
      <body className="min-h-[100dvh] font-sans text-zinc-50">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <JsonLd data={GLOBAL_JSON_LD} />
        <AppProviders>
          <div className="flex min-h-[100dvh] flex-col">
            {children}
            <SiteFooter />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
