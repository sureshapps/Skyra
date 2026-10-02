import { intlLocaleTag } from "@/lib/i18n/locale";
import type { UiKey } from "@/lib/i18n/ui-source";

const MYT = "Asia/Kuala_Lumpur";

const WIND_DIR_KEYS: UiKey[] = [
  "wind.n",
  "wind.ne",
  "wind.e",
  "wind.se",
  "wind.s",
  "wind.sw",
  "wind.w",
  "wind.nw",
];

export function windDirectionKey(deg?: number): UiKey {
  if (deg == null) return "wind.n";
  return WIND_DIR_KEYS[Math.round(deg / 45) % 8] ?? "wind.n";
}

export function localeTagFor(code: string): string {
  return intlLocaleTag(code);
}

export function formatLocalTime(iso: string, localeCode: string): string {
  try {
    return new Intl.DateTimeFormat(localeTagFor(localeCode), {
      timeZone: MYT,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function formatWeekdayShort(isoDate: string, localeCode: string): string {
  try {
    return new Intl.DateTimeFormat(localeTagFor(localeCode), {
      timeZone: MYT,
      weekday: "short",
    }).format(new Date(`${isoDate}T12:00:00+08:00`));
  } catch {
    return isoDate;
  }
}

export function formatWindSpeed(kmh: number, localeCode: string): string {
  const value = Math.round(kmh);
  if (localeCode === "en") return `${value} km/h`;
  try {
    const unit = new Intl.NumberFormat(localeTagFor(localeCode), {
      style: "unit",
      unit: "kilometer-per-hour",
      unitDisplay: "short",
      maximumFractionDigits: 0,
    }).format(value);
    return unit.replace(/\s+/g, " ");
  } catch {
    return `${value} km/h`;
  }
}
