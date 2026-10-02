"use client";

import type { HourlyForecast } from "@/lib/weather/types";
import { formatLocalTime } from "@/lib/format/localized-units";
import { GlassCard, PanelTitle } from "@/components/weather/GlassCard";
import { useLocale, useT } from "@/components/i18n/LocaleProvider";

type Props = {
  uvIndexMax?: number;
  hourly: HourlyForecast[];
  isDay?: boolean;
};

const UV_BANDS = [
  { max: 2, key: "uv.band.low", color: "#3dd68c" },
  { max: 5, key: "uv.band.mod", color: "#f5d76e" },
  { max: 7, key: "uv.band.high", color: "#f0a202" },
  { max: 10, key: "uv.band.vHigh", color: "#e85d4c" },
  { max: 20, key: "uv.band.extreme", color: "#9b5de5" },
] as const;

function uvColor(uv: number): string {
  for (const b of UV_BANDS) {
    if (uv <= b.max) return b.color;
  }
  return UV_BANDS[UV_BANDS.length - 1].color;
}

function uvCategoryKey(uv: number):
  | "uv.cat.low"
  | "uv.cat.moderate"
  | "uv.cat.high"
  | "uv.cat.veryHigh"
  | "uv.cat.extreme" {
  if (uv < 3) return "uv.cat.low";
  if (uv < 6) return "uv.cat.moderate";
  if (uv < 8) return "uv.cat.high";
  if (uv < 11) return "uv.cat.veryHigh";
  return "uv.cat.extreme";
}

function uvDaySeries(hourly: HourlyForecast[]): HourlyForecast[] {
  const lit = hourly.filter((h) => (h.uvIndex ?? 0) > 0.15);
  if (lit.length >= 4) return lit.slice(0, 12);
  return hourly.slice(0, 12);
}

function uvHintKey(uv: number):
  | "uv.desc.low"
  | "uv.desc.moderate"
  | "uv.desc.high"
  | "uv.desc.veryHigh"
  | "uv.desc.extreme" {
  if (uv < 3) return "uv.desc.low";
  if (uv < 6) return "uv.desc.moderate";
  if (uv < 8) return "uv.desc.high";
  if (uv < 11) return "uv.desc.veryHigh";
  return "uv.desc.extreme";
}

export function UvIndexMap({ uvIndexMax, hourly, isDay = true }: Props) {
  const { locale } = useLocale();
  const t = useT();
  const series = uvDaySeries(hourly);
  const seriesVals = series.map((h) => h.uvIndex ?? 0);
  const seriesPeak = seriesVals.length ? Math.max(...seriesVals) : 0;
  const peak = Math.max(uvIndexMax ?? 0, seriesPeak);
  if (peak <= 0 && seriesVals.every((v) => v <= 0)) return null;

  const displayPeak = peak > 0 ? peak : 1;
  const nowUv = hourly[0]?.uvIndex ?? 0;
  const hasNowReading = isDay && nowUv > 0.15;
  const displayUv = hasNowReading ? nowUv : displayPeak;
  const cat = t(uvCategoryKey(displayUv));
  const accent = uvColor(displayUv);
  const chartMax = Math.max(displayPeak, displayUv, 3);
  const railPct = Math.min(100, (displayUv / 11) * 100);

  const bars: { time: string; uv: number }[] =
    seriesPeak > 0.15
      ? series.map((h) => ({ time: h.time, uv: h.uvIndex ?? 0 }))
      : uvIndexMax != null && uvIndexMax > 0
        ? Array.from({ length: 12 }, (_, i) => {
            const t = (i - 5.5) / 5.5;
            const bell = Math.max(0, 1 - t * t);
            return {
              time: `synth-${i}`,
              uv: Number((uvIndexMax * bell).toFixed(1)),
            };
          })
        : series.map((h) => ({ time: h.time, uv: 0 }));

  return (
    <GlassCard aria-label={t("panel.uvMap")} className="card-rise">
      <PanelTitle
        trailing={
          <span
            className="max-w-[7rem] truncate rounded-full px-2 py-0.5 text-[10px] font-semibold"
            style={{ background: `${accent}28`, color: accent }}
          >
            {cat}
          </span>
        }
      >
        {t("panel.uvMap")}
      </PanelTitle>

      <div className="mt-3 flex items-end justify-between gap-4">
        <div>
          <p
            className="font-display text-[2.75rem] font-semibold leading-none tracking-tight tabular-nums"
            style={{ color: accent }}
          >
            {displayUv.toFixed(displayUv >= 10 ? 0 : 1)}
          </p>
          <p className="mt-1.5 line-clamp-2 break-words text-xs text-white/50">
            {hasNowReading && displayPeak > nowUv + 0.05
              ? `${t("uv.peakToday")} ${displayPeak.toFixed(displayPeak >= 10 ? 0 : 1)}`
              : hasNowReading
                ? t("uv.now")
                : t("uv.peakToday")}
          </p>
        </div>
        <p className="max-w-[14rem] line-clamp-3 break-words pb-1 text-right text-xs leading-relaxed text-white/55">
          {t(uvHintKey(displayUv))}
        </p>
      </div>

      <div className="relative mt-4 h-1.5 overflow-hidden rounded-full">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg,#3dd68c,#f5d76e 28%,#f0a202 50%,#e85d4c 72%,#9b5de5)",
          }}
        />
        <div
          className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow"
          style={{ left: `${railPct}%`, background: accent }}
        />
      </div>
      <div className="mt-1.5 grid grid-cols-5 text-center text-[9px] text-white/35">
        {UV_BANDS.map((b) => (
          <span key={b.key}>{t(b.key)}</span>
        ))}
      </div>

      <div className="mt-4 flex h-[4.25rem] items-end gap-1 rounded-2xl bg-black/20 px-2 pb-2 pt-2">
        {bars.map((b) => {
          const px = Math.max(b.uv > 0 ? 6 : 3, (b.uv / chartMax) * 48);
          return (
            <div
              key={b.time}
              className="flex min-w-0 flex-1 flex-col items-center justify-end"
              title={
                b.time.startsWith("synth")
                  ? `UV ${b.uv}`
                  : `${formatLocalTime(b.time, locale)} · UV ${b.uv}`
              }
            >
              <div
                className="w-full max-w-[0.85rem] rounded-t-md"
                style={{
                  height: px,
                  background: `linear-gradient(to top, ${uvColor(b.uv)}, ${uvColor(Math.max(b.uv, 0.5))}aa)`,
                  opacity: b.uv <= 0 ? 0.18 : 1,
                }}
              />
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
