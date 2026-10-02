const MYT = "Asia/Kuala_Lumpur";

export function formatTempC(n: number): string {
  return `${Math.round(n)}°C`;
}

export function formatWind(kmh: number): string {
  return `${Math.round(kmh)} km/h`;
}

export function formatMm(mm: number): string {
  return `${mm.toFixed(mm >= 10 ? 0 : 1)} mm`;
}

export function formatIstTime(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-MY", {
      timeZone: MYT,
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function formatIstDate(isoDate: string): string {
  try {
    return new Intl.DateTimeFormat("en-MY", {
      timeZone: MYT,
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(new Date(`${isoDate}T12:00:00+08:00`));
  } catch {
    return isoDate;
  }
}

export function formatUpdatedAt(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-MY", {
      timeZone: MYT,
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function windDirectionLabel(deg?: number): string {
  if (deg == null) return "";
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const i = Math.round(deg / 45) % 8;
  return dirs[i];
}
