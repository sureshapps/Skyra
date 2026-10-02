export type WeatherCondition =
  | "clear"
  | "partly_cloudy"
  | "overcast"
  | "haze"
  | "fog"
  | "light_rain"
  | "heavy_rain"
  | "thunderstorm"
  | "heatwave"
  | "snow"
  | "windy";

export type AlertSeverity = "white" | "green" | "yellow" | "orange" | "red";
export type DataProvider = "open-meteo" | "mock" | "metmalaysia";

export type RainfallClass =
  | "none"
  | "light"
  | "moderate"
  | "heavy"
  | "very_heavy"
  | "extremely_heavy";

export interface LocationRef {
  id: string;
  name: string;
  state: string;
  district?: string;
  countryCode: string;
  lat: number;
  lon: number;
  imdStationCode?: string;
  imdDistrictObjId?: string;
}

export interface AlertActionTip {
  id: string;
  text: string;
  priority: 1 | 2 | 3;
  phoneHref?: string;
}

export interface DistrictDayForecast {
  date: string;
  severity: AlertSeverity;
  rainfallClass: RainfallClass;
  label: string;
  distribution?: string;
}

export interface DistrictForecastRow {
  districtId: string;
  districtName: string;
  days: DistrictDayForecast[];
}

export interface DistrictForecastBoard {
  state: string;
  issuedAt: string;
  days: string[];
  rows: DistrictForecastRow[];
  officialChartUrl?: string;
  source: DataProvider | "metmalaysia-sample";
}

export interface DistrictAlertGroup {
  severity: Exclude<AlertSeverity, "white" | "green">;
  date: string;
  districtIds: string[];
  rainfallClass: RainfallClass;
  headline: string;
}

export interface AlertBulletin {
  id: string;
  regionLabel: string;
  issuedAt: string;
  authorityLine: string;
  highestSeverity: AlertSeverity;
  groups: DistrictAlertGroup[];
  tips: AlertActionTip[];
  board: DistrictForecastBoard;
  sourceUrl?: string;
  source: DataProvider | "metmalaysia-sample";
}

export interface WeatherAlert {
  id: string;
  severity: AlertSeverity;
  title: string;
  summary: string;
  validFrom: string;
  validTo: string;
  source: DataProvider;
}

export interface CurrentWeather {
  observedAt: string;
  temperatureC: number;
  feelsLikeC?: number;
  humidityPct: number;
  windSpeedKmph: number;
  windDirectionDeg?: number;
  pressureHpa?: number;
  rainfallLast24hMm: number;
  dewPointC?: number;
  visibilityKm?: number;
  condition: WeatherCondition;
  conditionLabel: string;
  wmoCode?: number;
  isDay?: boolean;
  nebulosity?: number;
}

export interface DailyForecast {
  date: string;
  maxTempC: number;
  minTempC: number;
  condition: WeatherCondition;
  conditionLabel: string;
  rainChancePct?: number;
  precipitationSumMm?: number;
  wmoCode?: number;
}

export interface HourlyForecast {
  time: string;
  temperatureC: number;
  precipitationMm: number;
  precipitationProbabilityPct?: number;
  uvIndex?: number;
  condition: WeatherCondition;
  conditionLabel: string;
  windSpeedKmph?: number;
  wmoCode?: number;
}

export interface AstronomyDay {
  date: string;
  sunrise: string;
  sunset: string;
  moonrise?: string;
  moonset?: string;
}

export interface AirQualityIndex {
  value: number;
  category: string;
}

export interface WeatherSnapshot {
  location: LocationRef;
  current: CurrentWeather;
  hourly48: HourlyForecast[];
  forecast7: DailyForecast[];
  astronomy?: AstronomyDay;
  uvIndexMax?: number;
  aqi?: AirQualityIndex;
  alerts: WeatherAlert[];
  bulletin?: AlertBulletin;
  provider: DataProvider;
  fetchedAt: string;
  attribution: string;
}

export interface WeatherProvider {
  getSnapshot(locationId: string): Promise<WeatherSnapshot>;
  searchLocations?(query: string): Promise<LocationRef[]>;
}
