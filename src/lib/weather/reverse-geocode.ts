import type { LocationRef } from "@/lib/weather/types";
import {
  bigDataCloudLanguage,
  type AppLocale,
} from "@/lib/i18n/locale";
import { serverEnv } from "@/lib/env/server";

interface BigDataCloudReverse {
  city?: string;
  locality?: string;
  principalSubdivision?: string;
  countryCode?: string;
  localityInfo?: {
    administrative?: { name: string; adminLevel: number }[];
  };
}

export async function reverseGeocode(
  lat: number,
  lon: number,
  locale: AppLocale = "en",
): Promise<LocationRef> {
  const lang = bigDataCloudLanguage(locale);
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    localityLanguage: lang,
  });
  if (serverEnv.bigDataCloudApiKey) {
    params.set("key", serverEnv.bigDataCloudApiKey);
  }
  const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?${params.toString()}`;
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) {
    throw new Error(`Reverse geocode HTTP ${res.status}`);
  }
  const data = (await res.json()) as BigDataCloudReverse;
  const name =
    data.city ||
    data.locality ||
    data.localityInfo?.administrative?.find((a) => a.adminLevel >= 5)?.name ||
    "Near you";
  const state = data.principalSubdivision || "";
  const countryCode = (data.countryCode || "MY").toUpperCase();

  return {
    id: `gps-${lat.toFixed(4)}-${lon.toFixed(4)}`,
    name,
    state,
    countryCode,
    lat,
    lon,
  };
}
