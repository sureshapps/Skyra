import type { Metadata } from "next";
import { Suspense } from "react";
import { AutoLocate } from "@/components/geo/AutoLocate";
import { LocationSearch } from "@/components/layout/LocationSearch";
import { JsonLd } from "@/components/seo/JsonLd";
import { fetchWeatherSnapshot } from "@/lib/weather/provider";
import { deriveAlerts } from "@/lib/weather/derive-alerts";
import { DEFAULT_LOCATION } from "@/lib/weather/locations/india-cities";
import {
  hasPlaceInQuery,
  isNearYouQuery,
  locationRefFromQuery,
  type LocationQueryParams,
} from "@/lib/geo/location-url";
import { getServerLocale } from "@/lib/i18n/server";
import {
  localizeAlertsCopy,
  localizeDaySummaryText,
} from "@/lib/i18n/localize-snapshot";
import {
  locationMetadata,
  welcomeMetadata,
} from "@/lib/seo/metadata";
import { weatherPageJsonLd } from "@/lib/seo/json-ld";

type PageProps = {
  searchParams: Promise<LocationQueryParams>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams;
  if (!hasPlaceInQuery(params)) return welcomeMetadata();

  const place = locationRefFromQuery(params);
  if (!place || place.name === "Selected place" || place.name === "Near you") {
    return welcomeMetadata();
  }

  return locationMetadata(place);
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const nearYou = isNearYouQuery(params);
  const hasPlace = hasPlaceInQuery(params);

  // Welcome path: no cookies()/headers() here. Last-place redirect lives in proxy.
  if (!hasPlace) {
    const { LocatingScreen } = await import("@/components/geo/LocatingScreen");
    return <LocatingScreen />;
  }

  const locale = await getServerLocale();

  let snapshot;
  let error: string | null = null;
  try {
    snapshot = await fetchWeatherSnapshot(params, locale);
  } catch {
    error = "Weather didn't load. Try again.";
  }

  if (error || !snapshot) {
    return (
      <>
        <Suspense fallback={null}>
          <AutoLocate />
        </Suspense>
        <div className="relative flex min-h-[100dvh] w-full items-center justify-center bg-gradient-to-b from-[#0a121c] via-[#0b1410] to-[#070b12] px-4">
          <main id="main-content" role="alert" className="relative z-10 w-full max-w-xl">
            <div className="search-modal-panel overflow-hidden p-5 shadow-2xl">
              <h1 className="text-xl font-semibold text-white">
                Couldn&apos;t load weather
              </h1>
              <p className="mt-2 text-sm text-white/55">{error}</p>
            </div>
            <div className="mt-3">
              <LocationSearch current={DEFAULT_LOCATION} layout="standalone" />
            </div>
          </main>
        </div>
      </>
    );
  }

  const derived = deriveAlerts(snapshot);
  const [localized, todaySummary, { WeatherAppScreen }] = await Promise.all([
    localizeAlertsCopy(derived.alerts, derived.tips, locale),
    localizeDaySummaryText(snapshot, locale),
    import("@/components/weather/WeatherAppScreen"),
  ]);

  return (
    <>
      <JsonLd data={weatherPageJsonLd(snapshot.location, snapshot)} />
      <Suspense fallback={null}>
        <AutoLocate />
      </Suspense>
      <WeatherAppScreen
        snapshot={snapshot}
        nearYou={nearYou}
        tips={localized.tips}
        alerts={localized.alerts}
        todaySummary={todaySummary}
      />
    </>
  );
}
