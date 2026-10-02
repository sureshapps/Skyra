import type {
  AlertActionTip,
  AlertSeverity,
  WeatherAlert,
  WeatherSnapshot,
} from "./types";

function dayRange(isoDate: string): { from: string; to: string } {
  return {
    from: `${isoDate}T00:00:00+08:00`,
    to: `${isoDate}T23:59:59+08:00`,
  };
}

function formatAlertDay(isoDate: string): string {
  try {
    const d = new Date(`${isoDate}T12:00:00`);
    return new Intl.DateTimeFormat("en-MY", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(d);
  } catch {
    return isoDate.slice(5);
  }
}

/** Build real, condition-based alerts from live forecast (no sample bulletins). */
export function deriveAlerts(snapshot: WeatherSnapshot): {
  alerts: WeatherAlert[];
  tips: AlertActionTip[];
  highest: AlertSeverity;
} {
  const alerts: WeatherAlert[] = [];
  const tips: AlertActionTip[] = [];
  const { current, forecast7, hourly48, uvIndexMax, location, provider } = snapshot;

  const push = (
    severity: AlertSeverity,
    title: string,
    summary: string,
    date: string,
    id: string,
  ) => {
    const { from, to } = dayRange(date);
    alerts.push({ id, severity, title, summary, validFrom: from, validTo: to, source: provider });
  };

  if (current.condition === "thunderstorm" || current.wmoCode === 95 || (current.wmoCode ?? 0) >= 95) {
    push(
      "red",
      "Thunderstorm now",
      `Thunderstorm conditions in ${location.name}. Stay indoors and avoid open fields and tall trees.`,
      current.observedAt.slice(0, 10),
      "now-storm",
    );
    tips.push({
      id: "tip-storm",
      text: "Stay indoors. Unplug sensitive electronics if lightning is close.",
      priority: 1,
    });
  }

  if (current.condition === "heavy_rain") {
    push(
      "orange",
      "Heavy rain now",
      `Heavy rain in ${location.name}. Avoid flooded roads and overflowing drains.`,
      current.observedAt.slice(0, 10),
      "now-heavy-rain",
    );
    tips.push({
      id: "tip-rain",
      text: "Do not walk or drive through flood water.",
      priority: 1,
    });
  }

  if (current.condition === "heatwave" || (current.temperatureC ?? 0) >= 37) {
    push(
      "red",
      "Extreme heat",
      `Air temperature around ${Math.round(current.temperatureC)}°C in ${location.name}. Limit outdoor work in the afternoon.`,
      current.observedAt.slice(0, 10),
      "now-heat",
    );
    tips.push({
      id: "tip-heat",
      text: "Drink water often. Avoid midday sun. Check on elders and children.",
      priority: 1,
    });
  }

  if (current.condition === "fog") {
    push(
      "yellow",
      "Fog reducing visibility",
      `Fog in ${location.name}. Drive slowly and use fog lights if needed.`,
      current.observedAt.slice(0, 10),
      "now-fog",
    );
  }

  // Next 3 days from daily forecast — collect rain days for one grouped alert
  const rainDays: { date: string; label: string; mm?: number }[] = [];

  for (const day of forecast7.slice(0, 3)) {
    if (day.condition === "thunderstorm" || (day.wmoCode ?? 0) >= 95) {
      push(
        "orange",
        `Thunderstorm likely · ${formatAlertDay(day.date)}`,
        `${day.conditionLabel}. Plan indoor options and secure loose outdoor items.`,
        day.date,
        `day-storm-${day.date}`,
      );
    } else if (
      day.condition === "heavy_rain" ||
      (day.precipitationSumMm ?? 0) >= 50 ||
      (day.rainChancePct ?? 0) >= 80
    ) {
      rainDays.push({
        date: day.date,
        label: day.conditionLabel,
        mm: day.precipitationSumMm,
      });
    } else if (day.maxTempC >= 35) {
      push(
        "orange",
        `Very hot · ${formatAlertDay(day.date)}`,
        `High near ${day.maxTempC}°C. Schedule outdoor work for early morning or evening.`,
        day.date,
        `day-heat-${day.date}`,
      );
    }
  }

  if (rainDays.length > 0) {
    const dates = rainDays.map((d) => d.date).sort();
    const maxMm = Math.max(...rainDays.map((d) => d.mm ?? 0));
    const dayLabel =
      rainDays.length === 1
        ? formatAlertDay(dates[0])
        : `${formatAlertDay(dates[0])} – ${formatAlertDay(dates[dates.length - 1])}`;
    push(
      "yellow",
      `Rain likely · ${dayLabel}`,
      `${rainDays.length} day${rainDays.length === 1 ? "" : "s"} with wet weather${
        maxMm > 0 ? ` · up to ~${maxMm.toFixed(1)} mm` : ""
      }. Keep an umbrella handy and avoid low-lying roads.`,
      dates[0],
      `day-rain-${dates[0]}-${dates[dates.length - 1]}`,
    );
  }

  // Next 12h intense rain pulse
  const wetHours = hourly48
    .slice(0, 12)
    .filter((h) => h.precipitationMm >= 5 || (h.precipitationProbabilityPct ?? 0) >= 85);
  if (wetHours.length >= 3 && !alerts.some((a) => a.id.startsWith("now-"))) {
    push(
      "yellow",
      "Wet hours ahead",
      `Several wet hours expected near ${location.name} in the next half day.`,
      wetHours[0].time.slice(0, 10),
      "hours-wet",
    );
  }

  if (uvIndexMax != null && uvIndexMax >= 8) {
    push(
      "yellow",
      "Very high UV",
      `UV index up to ${uvIndexMax}. Use shade, sleeves, and sunscreen outdoors.`,
      forecast7[0]?.date ?? current.observedAt.slice(0, 10),
      "uv-high",
    );
    tips.push({
      id: "tip-uv",
      text: "Limit direct sun between 11am and 3pm.",
      priority: 2,
    });
  }

  if (location.countryCode === "MY" && tips.length > 0) {
    tips.push({
      id: "tip-helpline",
      text: "In an emergency in Malaysia, call 999.",
      priority: 2,
      phoneHref: "tel:999",
    });
  }

  // Deduplicate by id
  const unique = [...new Map(alerts.map((a) => [a.id, a])).values()];
  const rank: Record<AlertSeverity, number> = {
    red: 4,
    orange: 3,
    yellow: 2,
    green: 1,
    white: 0,
  };
  unique.sort((a, b) => rank[b.severity] - rank[a.severity]);

  const highest: AlertSeverity =
    unique.length === 0
      ? "green"
      : unique.reduce(
          (h, a) => (rank[a.severity] > rank[h] ? a.severity : h),
          "green" as AlertSeverity,
        );

  if (unique.length === 0) {
    tips.push({
      id: "tip-clear",
      text: "No severe weather flags from the forecast right now. Still check updates if you travel.",
      priority: 2,
    });
  }

  return {
    alerts: unique.slice(0, 6),
    tips: tips.slice(0, 5),
    highest,
  };
}
