import type {
  LocationRef,
  WeatherProvider,
  WeatherSnapshot,
} from "./types";
import { deriveAlerts } from "./derive-alerts";
import { DEFAULT_LOCATION, findQuickCity, MALAYSIA_QUICK_CITIES } from "./locations/malaysia-cities";

function mockSnapshot(location: LocationRef): WeatherSnapshot {
  const now = new Date();
  const hourly48 = Array.from({ length: 48 }, (_, i) => {
    const t = new Date(now.getTime() + i * 3600_000);
    return {
      time: t.toISOString(),
      temperatureC: 28 + (i % 5),
      precipitationMm: i % 7 === 0 ? 2.5 : 0,
      precipitationProbabilityPct: 40,
      uvIndex: i >= 7 && i <= 17 ? Math.max(0, 8 - Math.abs(12 - i) * 0.9) : 0,
      condition: "light_rain" as const,
      conditionLabel: "Light rain",
      windSpeedKmph: 12,
      wmoCode: 61,
    };
  });

  const forecast7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    return {
      date: d.toISOString().slice(0, 10),
      maxTempC: 31,
      minTempC: 24,
      condition: i < 2 ? ("heavy_rain" as const) : ("partly_cloudy" as const),
      conditionLabel: i < 2 ? "Heavy rain" : "Partly cloudy",
      rainChancePct: i < 2 ? 80 : 30,
      precipitationSumMm: i < 2 ? 40 : 5,
      wmoCode: i < 2 ? 65 : 2,
    };
  });

  const base: WeatherSnapshot = {
    location,
    current: {
      observedAt: now.toISOString(),
      temperatureC: 29,
      feelsLikeC: 33,
      humidityPct: 84,
      windSpeedKmph: 14,
      windDirectionDeg: 220,
      pressureHpa: 1008,
      rainfallLast24hMm: 22.4,
      dewPointC: 25,
      visibilityKm: 6.5,
      condition: "heavy_rain",
      conditionLabel: "Heavy rain",
      wmoCode: 65,
      isDay: true,
    },
    hourly48,
    forecast7,
    astronomy: {
      date: now.toISOString().slice(0, 10),
      sunrise: `${now.toISOString().slice(0, 10)}T06:15:00`,
      sunset: `${now.toISOString().slice(0, 10)}T18:42:00`,
    },
    uvIndexMax: 6.2,
    aqi: { value: 57, category: "Moderate" },
    alerts: [],
    provider: "mock",
    fetchedAt: now.toISOString(),
    attribution: "Sample data mode (WEATHER_DATA_SOURCE=mock)",
  };

  const derived = deriveAlerts(base);
  base.alerts = derived.alerts;
  return base;
}

export class MockWeatherService implements WeatherProvider {
  async getSnapshot(locationId: string): Promise<WeatherSnapshot> {
    await new Promise((r) => setTimeout(r, 150));
    const location =
      findQuickCity(locationId) ??
      DEFAULT_LOCATION;
    return mockSnapshot(location);
  }

  async searchLocations(query: string): Promise<LocationRef[]> {
    const q = query.trim().toLowerCase();
    if (!q) return MALAYSIA_QUICK_CITIES;
    return MALAYSIA_QUICK_CITIES.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.state.toLowerCase().includes(q),
    );
  }
}
