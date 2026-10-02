import type {
  AlertBulletin,
  AlertSeverity,
  DistrictForecastBoard,
  DistrictForecastRow,
  RainfallClass,
} from "../types";
import { KL_DISTRICTS } from "../locations/kl-districts";

const API = "https://api.data.gov.my/weather";

type ApiForecast = {
  location: { location_id: string; location_name: string };
  date: string;
  morning_forecast: string;
  afternoon_forecast: string;
  night_forecast: string;
  summary_forecast: string;
  summary_when: string;
  min_temp: number;
  max_temp: number;
};

type ApiWarning = {
  warning_issue: { issued: string; title_bm: string; title_en: string };
  valid_from: string;
  valid_to: string;
  heading_en: string;
  text_en: string;
  instruction_en: string;
};

type Level = { severity: AlertSeverity; rainfallClass: RainfallClass; label: string };

const GREEN: Level = { severity: "green", rainfallClass: "moderate", label: "L to M" };
const RANK: Record<string, number> = { green: 0, yellow: 1, orange: 2, red: 3 };

/** MetMalaysia forecast text (BM) -> app severity */
const FORECAST_MAP: Record<string, Level> = {
  "tiada hujan": GREEN,
  berjerebu: GREEN,
  "hujan di satu dua tempat": GREEN,
  "hujan di satu dua tempat di kawasan pantai": GREEN,
  "hujan di satu dua tempat di kawasan pedalaman": GREEN,
  "hujan di beberapa tempat": { severity: "yellow", rainfallClass: "heavy", label: "SCT R" },
  "ribut petir di satu dua tempat": { severity: "yellow", rainfallClass: "heavy", label: "ISOL TS" },
  "ribut petir di satu dua tempat di kawasan pantai": { severity: "yellow", rainfallClass: "heavy", label: "ISOL TS" },
  "ribut petir di satu dua tempat di kawasan pedalaman": { severity: "yellow", rainfallClass: "heavy", label: "ISOL TS" },
  hujan: { severity: "yellow", rainfallClass: "heavy", label: "R" },
  "ribut petir di beberapa tempat": { severity: "orange", rainfallClass: "very_heavy", label: "SCT TS" },
  "ribut petir di beberapa tempat di kawasan pedalaman": { severity: "orange", rainfallClass: "very_heavy", label: "SCT TS" },
  "ribut petir": { severity: "orange", rainfallClass: "very_heavy", label: "TS" },
};

function levelOf(text: string): Level {
  return FORECAST_MAP[text.trim().toLowerCase()] ?? GREEN;
}

function worst(a: Level, b: Level): Level {
  return RANK[b.severity] > RANK[a.severity] ? b : a;
}

async function getJson<T>(path: string, params: Record<string, string>, signal?: AbortSignal): Promise<T> {
  const url = `${API}/${path}?${new URLSearchParams(params).toString()}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`data.gov.my ${path} ${res.status}`);
  return (await res.json()) as T;
}

async function fetchKlForecast(signal?: AbortSignal): Promise<ApiForecast[]> {
  const rows = await getJson<ApiForecast[]>(
    "forecast",
    { contains: "Kuala Lumpur@location__location_name", limit: "50" },
    signal,
  );
  // Prefer the state-level entry (St###) if several locations match
  const state = rows.filter((r) => r.location.location_id.startsWith("St"));
  const picked = state.length ? state : rows;
  const id = picked[0]?.location.location_id;
  return picked.filter((r) => r.location.location_id === id).sort((a, b) => a.date.localeCompare(b.date));
}

async function fetchKlWarnings(signal?: AbortSignal): Promise<ApiWarning[]> {
  const all = await getJson<ApiWarning[]>("warning", { limit: "50" }, signal);
  const now = Date.now();
  return all.filter((w) => {
    const active = new Date(w.valid_to).getTime() > now && new Date(w.valid_from).getTime() <= now;
    return active && /kuala lumpur/i.test(`${w.heading_en} ${w.text_en}`);
  });
}

/** MetMalaysia rain warning tiers: Alert (yellow) / Warning (orange) / Danger (red) */
function warningSeverity(w: ApiWarning): AlertSeverity {
  const t = `${w.heading_en} ${w.warning_issue.title_en}`.toLowerCase();
  if (t.includes("danger")) return "red";
  if (t.includes("warning") && !t.includes("alert")) return "orange";
  return "yellow";
}

export async function fetchKlBoard(signal?: AbortSignal): Promise<DistrictForecastBoard> {
  const fc = (await fetchKlForecast(signal)).slice(0, 5);
  const days = fc.map((f) => f.date);

  const perDay = fc.map((f) =>
    [f.morning_forecast, f.afternoon_forecast, f.night_forecast, f.summary_forecast]
      .map(levelOf)
      .reduce(worst, GREEN),
  );

  // API gives one forecast for all of KL, so every area row shares it
  const rows: DistrictForecastRow[] = KL_DISTRICTS.map((d) => ({
    districtId: d.id,
    districtName: d.name,
    days: days.map((date, i) => ({
      date,
      severity: perDay[i].severity,
      rainfallClass: perDay[i].rainfallClass,
      label: perDay[i].label,
    })),
  }));

  return {
    state: "Kuala Lumpur",
    issuedAt: new Date().toISOString(),
    days,
    rows,
    source: "metmalaysia",
  };
}

export async function fetchKlBulletin(signal?: AbortSignal): Promise<AlertBulletin> {
  const [board, warnings] = await Promise.all([fetchKlBoard(signal), fetchKlWarnings(signal)]);
  const day0 = board.days[0];
  const allIds = board.rows.map((r) => r.districtId);

  const warned = warnings.map((w) => ({ w, severity: warningSeverity(w) }));
  const forecastSev = board.rows[0]?.days[0]?.severity ?? "green";
  const highest = [forecastSev, ...warned.map((x) => x.severity)].reduce<AlertSeverity>(
    (a, b) => (RANK[b] > RANK[a] ? b : a),
    "green",
  );

  const groups = warned.map(({ w, severity }) => ({
    severity,
    date: day0,
    districtIds: allIds,
    rainfallClass: (severity === "red"
      ? "extremely_heavy"
      : severity === "orange"
        ? "very_heavy"
        : "heavy") as RainfallClass,
    headline: w.heading_en || w.warning_issue.title_en,
  }));

  // No active warning: fall back to the forecast level for today
  if (!groups.length && forecastSev !== "green") {
    const l = board.rows[0].days[0];
    groups.push({
      severity: l.severity,
      date: day0,
      districtIds: allIds,
      rainfallClass: l.rainfallClass,
      headline: "Rain likely today",
    });
  }

  const newest = warnings
    .map((w) => w.warning_issue.issued)
    .sort()
    .pop();

  return {
    id: `kl-live-${day0}`,
    regionLabel: "Kuala Lumpur",
    issuedAt: newest ?? board.issuedAt,
    authorityLine: "MetMalaysia via data.gov.my",
    highestSeverity: highest,
    groups,
    tips: [
      { id: "t1", text: "Avoid low-lying areas, underpasses and riverside roads where flash floods are likely.", priority: 1 },
      { id: "t2", text: "Do not drive through flooded roads or enter drains and rivers.", priority: 1 },
      { id: "t3", text: "Call 999 for emergency help.", priority: 1, phoneHref: "tel:999" },
      { id: "t4", text: "Stay clear of hillside slopes and retaining walls during heavy rain.", priority: 2 },
      { id: "t5", text: "Keep an emergency kit ready (torch, medicines, documents, water).", priority: 2 },
    ],
    board,
    sourceUrl: "https://www.met.gov.my/",
    source: "metmalaysia",
  };
}
