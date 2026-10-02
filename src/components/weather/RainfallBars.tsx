"use client";

import type { HourlyForecast } from "@/lib/weather/types";
import { formatIstTime, formatMm } from "@/lib/format/units";
import { GlassCard, PanelTitle } from "@/components/weather/GlassCard";
import { useT } from "@/components/i18n/LocaleProvider";
import { Drop } from "@phosphor-icons/react";

type Props = {
  hourly: HourlyForecast[];
  last24hMm: number;
};

const CHART_H = 72;

export function RainfallBars({ hourly, last24hMm }: Props) {
  const t = useT();
  const hours = hourly.slice(0, 12);
  const values = hours.map((h) => h.precipitationMm);
  const max = Math.max(...values, 0.5);
  const next12 = Number(values.reduce((a, b) => a + b, 0).toFixed(1));
  const hasRain = next12 > 0 || last24hMm > 0;

  return (
    <GlassCard aria-label={t("panel.rainfall")} className="card-rise flex h-full flex-col">
      <PanelTitle>{t("panel.rainfall")}</PanelTitle>

      <p className="mt-3 font-display text-[1.85rem] font-semibold leading-none tabular-nums tracking-tight">
        {formatMm(next12)}
      </p>
      <p className="mt-1.5 break-words text-xs text-white/45">
        {t("panel.rain.next12h")} · {formatMm(last24hMm)} {t("panel.rain.lastDay")}
      </p>

      {hasRain ? (
        <div
          className="mt-4 flex flex-1 items-end gap-1 rounded-2xl bg-black/20 px-1.5 pb-1.5 pt-5"
          style={{ minHeight: CHART_H + 28 }}
        >
          {hours.map((h) => {
            const mm = h.precipitationMm;
            const px =
              mm <= 0 ? 4 : Math.max(10, Math.round((mm / max) * CHART_H));
            return (
              <div
                key={h.time}
                className="relative flex min-w-0 flex-1 flex-col items-center justify-end"
                title={`${formatIstTime(h.time)} · ${mm} mm`}
              >
                <div
                  className={`w-full max-w-[1.1rem] rounded-t-md ${
                    mm > 0
                      ? "bg-gradient-to-t from-sky-600 via-sky-400 to-sky-200"
                      : "bg-white/[0.07]"
                  }`}
                  style={{ height: px }}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <div className="mt-4 flex flex-1 flex-col items-center justify-center rounded-2xl bg-black/20 px-3 py-6 text-center">
          <Drop className="size-7 text-white/20" weight="duotone" aria-hidden />
          <p className="mt-2 break-words text-sm text-white/65">{t("panel.rain.dryNow")}</p>
        </div>
      )}
    </GlassCard>
  );
}
