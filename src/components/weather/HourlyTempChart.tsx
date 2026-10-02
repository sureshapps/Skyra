"use client";

import { useEffect, useRef, useState } from "react";
import type { HourlyForecast, WeatherCondition } from "@/lib/weather/types";
import { formatLocalTime } from "@/lib/format/localized-units";
import { GlassCard, PanelTitle } from "@/components/weather/GlassCard";
import { useLocale, useT } from "@/components/i18n/LocaleProvider";
import { wallClockMinutes } from "@/lib/weather/wmo";
import {
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudSun,
  Sun,
  Moon,
  Wind,
} from "@phosphor-icons/react";

function hourIsDay(
  iso: string,
  fallbackIsDay: boolean,
  sunrise?: string,
  sunset?: string,
): boolean {
  const now = wallClockMinutes(iso);
  const rise = sunrise ? wallClockMinutes(sunrise) : null;
  const set = sunset ? wallClockMinutes(sunset) : null;
  if (now != null && rise != null && set != null) {
    if (rise <= set) return now >= rise && now < set;
    return now >= rise || now < set;
  }
  if (now != null) return now >= 6 * 60 && now < 18 * 60;
  return fallbackIsDay;
}

function MiniIcon({
  condition,
  isDay = true,
}: {
  condition: WeatherCondition;
  isDay?: boolean;
}) {
  const cls = "size-[1.35rem]";
  switch (condition) {
    case "clear":
      return isDay ? (
        <Sun className={`${cls} text-amber-200`} weight="fill" />
      ) : (
        <Moon className={`${cls} text-slate-100`} weight="fill" />
      );
    case "partly_cloudy":
      return isDay ? (
        <CloudSun className={`${cls} text-white`} weight="fill" />
      ) : (
        <CloudMoon className={`${cls} text-white`} weight="fill" />
      );
    case "fog":
    case "haze":
    case "overcast":
      return <CloudFog className={`${cls} text-white/90`} weight="fill" />;
    case "light_rain":
      return <CloudRain className={`${cls} text-sky-200`} weight="fill" />;
    case "heavy_rain":
    case "thunderstorm":
      return <CloudLightning className={`${cls} text-violet-200`} weight="fill" />;
    case "snow":
      return <CloudSnow className={`${cls} text-sky-100`} weight="fill" />;
    case "windy":
      return <Wind className={`${cls} text-teal-100`} weight="fill" />;
    default:
      return isDay ? (
        <CloudSun className={`${cls} text-white`} weight="fill" />
      ) : (
        <CloudMoon className={`${cls} text-white`} weight="fill" />
      );
  }
}

type Props = {
  hourly: HourlyForecast[];
  isDay?: boolean;
  sunrise?: string;
  sunset?: string;
};

/** Hourly fills the card on large screens; scrolls on phone. */
export function HourlyTempChart({
  hourly,
  isDay = true,
  sunrise,
  sunset,
}: Props) {
  const { locale } = useLocale();
  const t = useT();
  const hours = hourly.slice(0, 24);
  const trackRef = useRef<HTMLDivElement>(null);
  const [fillW, setFillW] = useState(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setFillW(el.clientWidth));
    ro.observe(el);
    setFillW(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  if (hours.length === 0) return null;

  const temps = hours.map((h) => h.temperatureC);
  const min = Math.min(...temps);
  const max = Math.max(...temps);
  const span = Math.max(max - min, 1);

  const minCol = 48;
  const natural = hours.length * minCol;
  const width = Math.max(natural, fillW || natural);
  const colW = width / hours.length;
  const padX = colW / 2;
  const chartH = 48;
  const points = hours
    .map((h, i) => {
      const x = padX + i * colW;
      const y = 6 + ((max - h.temperatureC) / span) * (chartH - 12);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <GlassCard
      aria-label={t("panel.hourly")}
      className="card-rise overflow-hidden !px-3 sm:!px-5"
    >
      <PanelTitle>{t("panel.hourly")}</PanelTitle>

      <div
        ref={trackRef}
        className="mt-3 overflow-x-auto overscroll-x-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div style={{ width }} className="relative min-w-full">
          <ul className="relative z-10 flex">
            {hours.map((h, i) => (
              <li
                key={h.time}
                style={{ width: colW }}
                className="flex shrink-0 flex-col items-center gap-1"
              >
                <span
                  className={`text-[10px] font-semibold ${
                    i === 0 ? "text-amber-200" : "text-white/45"
                  }`}
                >
                  {i === 0 ? t("uv.now") : formatLocalTime(h.time, locale)}
                </span>
                <MiniIcon
                  condition={h.condition}
                  isDay={hourIsDay(h.time, isDay, sunrise, sunset)}
                />
              </li>
            ))}
          </ul>

          <svg
            width={width}
            height={chartH}
            className="my-0.5 block overflow-visible"
            aria-hidden
          >
            <defs>
              <linearGradient id="hourlyTempStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#fde68a" />
                <stop offset="100%" stopColor="#fbbf24" />
              </linearGradient>
            </defs>
            <polyline
              fill="none"
              stroke="url(#hourlyTempStroke)"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={points}
            />
            {hours.map((h, i) => {
              const x = padX + i * colW;
              const y = 6 + ((max - h.temperatureC) / span) * (chartH - 12);
              return (
                <circle
                  key={h.time}
                  cx={x}
                  cy={y}
                  r={i === 0 ? 4 : 3}
                  fill="white"
                  stroke="#fbbf24"
                  strokeWidth="2"
                />
              );
            })}
          </svg>

          <ul className="flex">
            {hours.map((h, i) => (
              <li
                key={`${h.time}-t`}
                style={{ width: colW }}
                className="flex shrink-0 flex-col items-center gap-0.5"
              >
                <span
                  className={`text-[13px] font-semibold tabular-nums ${
                    i === 0 ? "text-white" : "text-white/90"
                  }`}
                >
                  {Math.round(h.temperatureC)}°
                </span>
                <span className="text-[9px] tabular-nums text-sky-200/80">
                  {h.precipitationProbabilityPct != null
                    ? `${h.precipitationProbabilityPct}%`
                    : "·"}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </GlassCard>
  );
}
