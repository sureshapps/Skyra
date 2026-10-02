import type { LocationRef, WeatherProvider, WeatherSnapshot } from "./types";
import { mapOpenMeteoToSnapshot } from "./mappers/open-meteo";
import { deriveAlerts } from "./derive-alerts";
import { categorizeEuropeanAqi } from "./aqi";
import { DEFAULT_LOCATION } from "./locations/malaysia-cities";
import { openMeteoLanguage, type AppLocale } from "@/lib/i18n/locale";

const OM_URL = "https://api.open-meteo.com/v1/forecast";
const AQ_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";

export class OpenMeteoWeatherService implements WeatherProvider {
  async getSnapshot(locationId: string): Promise<WeatherSnapshot> {
    // locationId unused when calling via getSnapshotForLocation
    return this.getSnapshotForLocation(DEFAULT_LOCATION);
  }

  async getSnapshotForLocation(
    location: LocationRef,
    locale: AppLocale = "en",
  ): Promise<WeatherSnapshot> {
    const timezone =
      location.countryCode === "MY" ? "Asia/Kuala_Lumpur" : "auto";
    const language = openMeteoLanguage(locale);

    const params = new URLSearchParams({
      latitude: String(location.lat),
      longitude: String(location.lon),
      timezone,
      language,
      wind_speed_unit: "kmh",
      forecast_days: "7",
      current: [
        "temperature_2m",
        "relative_humidity_2m",
        "apparent_temperature",
        "weather_code",
        "wind_speed_10m",
        "wind_direction_10m",
        "pressure_msl",
        "precipitation",
        "is_day",
        "cloud_cover",
        "dew_point_2m",
        "visibility",
      ].join(","),
      hourly: [
        "temperature_2m",
        "precipitation_probability",
        "precipitation",
        "weather_code",
        "wind_speed_10m",
        "uv_index",
      ].join(","),
      daily: [
        "weather_code",
        "temperature_2m_max",
        "temperature_2m_min",
        "precipitation_sum",
        "precipitation_probability_max",
        "sunrise",
        "sunset",
        "uv_index_max",
      ].join(","),
    });

    const aqParams = new URLSearchParams({
      latitude: String(location.lat),
      longitude: String(location.lon),
      current: "european_aqi",
    });

    const [res, aqRes] = await Promise.all([
      fetch(`${OM_URL}?${params.toString()}`, { next: { revalidate: 300 } }),
      fetch(`${AQ_URL}?${aqParams.toString()}`, { next: { revalidate: 300 } }),
    ]);

    if (!res.ok) {
      throw new Error(`Open-Meteo HTTP ${res.status}`);
    }
    const data = await res.json();
    const snapshot = mapOpenMeteoToSnapshot(data, location);

    if (aqRes.ok) {
      try {
        const aq = await aqRes.json();
        const value = aq?.current?.european_aqi;
        if (typeof value === "number" && !Number.isNaN(value)) {
          snapshot.aqi = categorizeEuropeanAqi(value);
        }
      } catch {
        /* AQI optional */
      }
    }

    const derived = deriveAlerts(snapshot);
    snapshot.alerts = derived.alerts;
    snapshot.bulletin = undefined;
    return snapshot;
  }
}
