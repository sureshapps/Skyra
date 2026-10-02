"use client";

import { useState, Suspense, useEffect } from "react";
import type {
  AlertActionTip,
  WeatherAlert,
  WeatherSnapshot,
} from "@/lib/weather/types";
import { WeatherScene } from "@/components/weather/WeatherScene";
import { HourlyTempChart } from "@/components/weather/HourlyTempChart";
import { DailyForecastList } from "@/components/weather/DailyForecastList";
import { RainfallBars } from "@/components/weather/RainfallBars";
import { AqiCard } from "@/components/weather/AqiCard";
import { DetailTiles } from "@/components/weather/DetailTiles";
import { SevereAlertCard } from "@/components/weather/SevereAlertCard";
import { UvIndexMap } from "@/components/weather/UvIndexMap";
import { UseMyLocationButton } from "@/components/geo/UseMyLocationButton";
import { SavePlaceButton } from "@/components/geo/SavePlaceButton";
import { LocationSearch } from "@/components/layout/LocationSearch";
import { GlassCard } from "@/components/weather/GlassCard";
import { LiveClock } from "@/components/layout/LiveClock";
import { daySummary } from "@/lib/format/day-summary";
import { useT } from "@/components/i18n/LocaleProvider";
import {
  lottieSrcForCondition,
  sceneGradientForCondition,
} from "@/lib/weather/scenes";
import { indiaSeasonFromDate } from "@/lib/weather/season";
import { WeatherLottie } from "@/components/weather/scene/WeatherLottie";
import { MagnifyingGlass } from "@phosphor-icons/react";

type Props = {
  snapshot: WeatherSnapshot;
  nearYou?: boolean;
  tips?: AlertActionTip[];
  alerts: WeatherAlert[];
  todaySummary?: string;
};

export function WeatherAppScreen({
  snapshot,
  nearYou,
  alerts,
  tips = [],
  todaySummary: todaySummaryProp,
}: Props) {
  const [searchOpen, setSearchOpen] = useState(false);
  const t = useT();

  useEffect(() => {
    if (!searchOpen) return;
    const html = document.documentElement;
    const body = document.body;
    html.classList.add("search-modal-open");
    body.classList.add("search-modal-open");
    return () => {
      html.classList.remove("search-modal-open");
      body.classList.remove("search-modal-open");
    };
  }, [searchOpen]);

  const { current, location, hourly48, forecast7, astronomy, uvIndexMax, aqi } =
    snapshot;
  const placeLine = location.state
    ? `${location.name}, ${location.state}`
    : location.name;
  const today = forecast7[0];
  const summary =
    todaySummaryProp ?? daySummary(current, today);
  const isDay = current.isDay ?? true;
  const season = indiaSeasonFromDate(current.observedAt);
  const sceneKey = `${location.id}-${current.condition}-${isDay ? "day" : "night"}-${season}`;
  const pageGradient = sceneGradientForCondition(current.condition, isDay);
  const lottieSrc = lottieSrcForCondition(
    current.condition,
    isDay,
    current.wmoCode,
  );
  const high = today != null ? Math.round(today.maxTempC) : null;
  const low = today != null ? Math.round(today.minTempC) : null;
  const temp = Math.round(current.temperatureC);
  const feels =
    current.feelsLikeC != null ? Math.round(current.feelsLikeC) : null;
  const hasSevereAlerts = alerts.some(
    (a) =>
      a.severity === "yellow" ||
      a.severity === "orange" ||
      a.severity === "red",
  );

  return (
    <div
      className={`relative min-h-[100dvh] w-full overflow-x-hidden bg-gradient-to-b ${pageGradient}`}
    >
      <section className="relative isolate flex w-full flex-col min-h-[min(86dvh,46rem)] sm:min-h-[min(82dvh,50rem)] lg:min-h-[min(78dvh,54rem)]">
        <WeatherScene
          condition={current.condition}
          isDay={isDay}
          temperatureC={current.temperatureC}
          season={season}
          sceneKey={sceneKey}
          immersive
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/28 via-transparent to-black/20"
          aria-hidden
        />

        <header className="relative z-10 mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col px-5 pt-[max(1.1rem,env(safe-area-inset-top))] sm:px-8 sm:pt-6 lg:px-10">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 pr-2">
              <h1 className="hero-place-title truncate">{location.name}</h1>
              {nearYou ? (
                <p className="hero-place-sub">{t("hero.nearYou")}</p>
              ) : location.state ? (
                <p className="hero-place-sub truncate">{location.state}</p>
              ) : null}
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/15 active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300"
                aria-label={t("hero.search")}
                onClick={() => setSearchOpen(true)}
              >
                <MagnifyingGlass className="size-5" weight="bold" />
              </button>
              <SavePlaceButton location={location} />
              <Suspense fallback={null}>
                <UseMyLocationButton />
              </Suspense>
            </div>
          </div>

          <div className="hero-now">
            <div className="min-w-0">
              <p className="hero-temp">
                {temp}
                <span className="hero-temp-unit">°</span>
              </p>
              <p className="hero-condition">{current.conditionLabel}</p>
              <p className="hero-details">
                {high != null && low != null ? (
                  <span>
                    ↑{high}° / ↓{low}°
                  </span>
                ) : null}
                {feels != null ? (
                  <>
                    {high != null ? (
                      <span className="hero-details-sep" aria-hidden>
                        ·
                      </span>
                    ) : null}
                    <span>{t("hero.feelsLike")} {feels}°</span>
                  </>
                ) : null}
              </p>
              <LiveClock className="mt-2 text-sm leading-snug text-white/80" />
            </div>
            <div className="hero-lottie shrink-0" aria-hidden>
              <WeatherLottie
                key={lottieSrc}
                src={lottieSrc}
                className="h-full w-full"
              />
            </div>
          </div>

          {/* Lower hero: ridge and character */}
          <div className="min-h-[clamp(16rem,42dvh,28rem)] flex-1 sm:min-h-[clamp(18rem,44dvh,32rem)]" />
        </header>
      </section>

      {/* Content bed: phone stack on mobile, multi-column on desktop */}
      <div className="relative z-20 -mt-12 bg-gradient-to-b from-transparent via-[#070b12]/88 to-[#070b12] pt-12 sm:-mt-16 sm:pt-16">
        <main
          id="main-content"
          className="relative mx-auto w-full max-w-lg px-4 pb-10 sm:max-w-2xl sm:px-6 md:max-w-4xl md:pb-14 lg:max-w-6xl lg:px-8"
        >
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-12 lg:gap-4">
            <GlassCard className="card-rise !py-3.5 lg:col-span-12">
              <h2 className="weather-panel-label mb-1">{t("panel.today")}</h2>
              <p className="text-[15px] leading-relaxed text-white/88">
                {summary}
              </p>
            </GlassCard>

            {hasSevereAlerts ? (
              <div className="lg:col-span-12">
                <SevereAlertCard alerts={alerts} tips={tips} />
              </div>
            ) : null}

            <div className="lg:col-span-12">
              <HourlyTempChart
                hourly={hourly48}
                isDay={isDay}
                sunrise={astronomy?.sunrise}
                sunset={astronomy?.sunset}
              />
            </div>

            <div className="lg:col-span-7">
              <DailyForecastList daily={forecast7} />
            </div>

            <div className="lg:col-span-5 lg:self-start">
              <UvIndexMap
                uvIndexMax={uvIndexMax}
                hourly={hourly48}
                isDay={isDay}
              />
            </div>

            <div className={aqi ? "lg:col-span-6" : "lg:col-span-12"}>
              <RainfallBars
                hourly={hourly48}
                last24hMm={current.rainfallLast24hMm}
              />
            </div>

            {aqi ? (
              <div className="lg:col-span-6">
                <AqiCard aqi={aqi} />
              </div>
            ) : null}

            <div className="lg:col-span-12">
              <DetailTiles current={current} astronomy={astronomy} />
            </div>
          </div>

          <p className="mt-7 text-center text-[11px] text-white/35">
            {snapshot.attribution}
          </p>
        </main>
      </div>

      {searchOpen ? (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-start justify-center bg-[#070b12]/70 px-4 pt-[max(10vh,3.5rem)] backdrop-blur-md sm:pt-[12vh]">
          <button
            type="button"
            className="absolute inset-0"
            aria-label={t("search.dismiss")}
            onClick={() => setSearchOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={t("hero.search")}
            className="relative w-full max-w-xl"
          >
            <LocationSearch
              current={location}
              onClose={() => setSearchOpen(false)}
            />
            <p className="mt-3 break-words text-center text-[12px] text-white/40">
              {t("search.showingFor")} {placeLine}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
