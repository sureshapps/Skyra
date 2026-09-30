import { SITE } from "@/lib/seo/site";

/** Crawlable about copy for search and answer engines. Server-rendered English. */
export function SeoAboutSection() {
  return (
    <article className="seo-prose" aria-labelledby="seo-about-heading">
      <h2 id="seo-about-heading">About {SITE.name}</h2>
      <p>
        {SITE.name} is a free weather site for cities in Malaysia and elsewhere.
        Pick a place, allow GPS, or open a saved location. You get current
        conditions, an hourly view, a 7-day outlook, rain and wind, UV, air
        quality, and short alerts built from the forecast.
      </p>
      <h2 id="seo-how-heading">How the data works</h2>
      <p>
        Forecasts come from Open-Meteo (CC BY 4.0). City search uses Open-Meteo
        geocoding. GPS names use BigDataCloud. Alerts are planning tips from
        those fields. They are not official India Meteorological Department
        bulletins.
      </p>
      <p>
        Source code is open under {SITE.license}. Maintained by{" "}
        <a href={SITE.maintainerUrl} rel="author me">
          {SITE.maintainer}
        </a>
        . Repository:{" "}
        <a href={SITE.repository} rel="me">
          github.com/sureshapps/Skyra
        </a>
        .
      </p>
    </article>
  );
}
