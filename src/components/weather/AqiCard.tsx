"use client";

import type { AirQualityIndex } from "@/lib/weather/types";
import { GlassCard, PanelTitle } from "@/components/weather/GlassCard";
import { useT } from "@/components/i18n/LocaleProvider";
import type { UiKey } from "@/lib/i18n/ui-source";

type Props = {
  aqi: AirQualityIndex;
};

function accent(value: number): string {
  if (value <= 20) return "#34d399";
  if (value <= 40) return "#a3e635";
  if (value <= 60) return "#fbbf24";
  if (value <= 80) return "#f97316";
  if (value <= 100) return "#ef4444";
  return "#c026d3";
}

function categoryKey(category: string): UiKey {
  const map: Record<string, UiKey> = {
    Good: "aqi.cat.good",
    Fair: "aqi.cat.fair",
    Moderate: "aqi.cat.moderate",
    Poor: "aqi.cat.poor",
    "Very poor": "aqi.cat.veryPoor",
    "Extremely poor": "aqi.cat.extremePoor",
  };
  return map[category] ?? "aqi.cat.moderate";
}

function tipKey(value: number):
  | "aqi.tip.veryGood"
  | "aqi.tip.good"
  | "aqi.tip.care"
  | "aqi.tip.limit"
  | "aqi.tip.indoor" {
  if (value <= 20) return "aqi.tip.veryGood";
  if (value <= 40) return "aqi.tip.good";
  if (value <= 60) return "aqi.tip.care";
  if (value <= 80) return "aqi.tip.limit";
  return "aqi.tip.indoor";
}

export function AqiCard({ aqi }: Props) {
  const t = useT();
  const pct = Math.min(100, Math.max(6, (aqi.value / 100) * 100));
  const color = accent(aqi.value);

  return (
    <GlassCard aria-label={t("panel.aqi")} className="card-rise flex h-full flex-col">
      <PanelTitle>{t("panel.aqi")}</PanelTitle>

      <p className="mt-3 font-display text-[1.85rem] font-semibold leading-none tracking-tight">
        {t(categoryKey(aqi.category))}
      </p>
      <p className="mt-1.5 text-xs text-white/45">
        {t("aqi.index")}{" "}
        <span className="font-medium tabular-nums" style={{ color }}>
          {aqi.value}
        </span>
      </p>

      <div className="mt-auto pt-5">
        <div className="relative h-1.5 overflow-hidden rounded-full bg-black/35">
          <div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${color}88, ${color})`,
            }}
          />
          <div
            className="absolute top-1/2 size-2.5 -translate-y-1/2 rounded-full border-2 border-white"
            style={{ left: `calc(${pct}% - 5px)`, background: color }}
          />
        </div>
        <div className="mt-1.5 flex justify-between text-[9px] text-white/35">
          <span>{t("aqi.good")}</span>
          <span>{t("aqi.poor")}</span>
        </div>
        <p className="mt-3 line-clamp-3 break-words text-xs leading-relaxed text-white/50">
          {t(tipKey(aqi.value))}
        </p>
      </div>
    </GlassCard>
  );
}
