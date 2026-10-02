import type { LocationRef, WeatherSnapshot, DataProvider } from "./types";
import { OpenMeteoWeatherService } from "./open-meteo-service";
import { MockWeatherService } from "./mock-service";
import {
  DEFAULT_LOCATION,
  findQuickCity,
  parseCoords,
} from "./locations/malaysia-cities";
import { searchPlaces } from "./geocoding";
import { reverseGeocode } from "./reverse-geocode";
import {
  normalizeLocationQuery,
  roundCoord,
  type LocationQueryParams,
} from "@/lib/geo/location-url";
import type { AppLocale } from "@/lib/i18n/locale";
import {
  localizeAlertsCopy,
  localizeWeatherSnapshot,
} from "@/lib/i18n/localize-snapshot";
import { translateOnline } from "@/lib/i18n/translate-online";

import { serverEnv } from "@/lib/env/server";

export function getDataSource(): DataProvider {
  const raw = serverEnv.weatherDataSource;
  if (raw === "mock" || raw === "metmalaysia" || raw === "open-meteo") return raw;
  return "open-meteo";
}

export type LocationQuery = LocationQueryParams;

export async function resolveLocation(
  query: LocationQuery,
  locale: AppLocale = "en",
): Promise<LocationRef> {
  const q = normalizeLocationQuery(query);

  if (q.lat && q.lon) {
    const lat = roundCoord(Number(q.lat));
    const lon = roundCoord(Number(q.lon));
    if (Number.isFinite(lat) && Number.isFinite(lon)) {
      const base: LocationRef = {
        id: q.location || `coord-${lat}-${lon}`,
        name:
          q.name?.trim() ||
          (q.f === "g"
            ? locale === "en"
              ? "Near you"
              : await translateOnline("Near you", locale)
            : await translateOnline("Selected place", locale)),
        state: q.state?.trim() || "",
        countryCode: q.cc?.trim().toUpperCase() || "MY",
        lat,
        lon,
      };
      if (locale !== "en") {
        try {
          const localized = await reverseGeocode(lat, lon, locale);
          return { ...base, name: localized.name, state: localized.state || base.state };
        } catch {
          return base;
        }
      }
      return base;
    }
  }

  if (q.location) {
    const quick = findQuickCity(q.location);
    if (quick) return quick;

    const coords = parseCoords(q.location);
    if (coords) {
      return {
        id: `coord-${coords.lat}-${coords.lon}`,
        name: q.name?.trim() || "Selected place",
        state: q.state?.trim() || "",
        countryCode: q.cc?.trim().toUpperCase() || "MY",
        lat: coords.lat,
        lon: coords.lon,
      };
    }
  }

  if (q.q && q.q.trim().length >= 2) {
    const hits = await searchPlaces(q.q, {
      countryCode: "MY",
      count: 1,
      language: locale,
    });
    if (hits[0]) return hits[0];
  }

  return DEFAULT_LOCATION;
}

export async function fetchWeatherSnapshot(
  query: LocationQuery = {},
  locale: AppLocale = "en",
): Promise<WeatherSnapshot> {
  const location = await resolveLocation(normalizeLocationQuery(query), locale);
  const source = getDataSource();

  if (source === "mock") {
    return new MockWeatherService().getSnapshot(location.id);
  }

  const om = new OpenMeteoWeatherService();
  let snapshot = await om.getSnapshotForLocation(location, locale);
  snapshot = await localizeWeatherSnapshot(snapshot, locale);
  return snapshot;
}
