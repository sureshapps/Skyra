"use client";

import {
  useDeferredValue,
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
  type MouseEvent,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { GlobeHemisphereWest, MagnifyingGlass, MapPin, SpinnerGap, X, BookmarkSimple } from "@phosphor-icons/react";
import type { LocationRef } from "@/lib/weather/types";
import {
  hrefForLocation,
  readSavedPlaces,
  removeSavedPlace,
  saveLastPlace,
} from "@/lib/geo/client";
import { useLocale, useT } from "@/components/i18n/LocaleProvider";
import {
  LanguagePickerPanel,
  LanguagePickerRow,
} from "@/components/i18n/LanguagePicker";
import { WORLD_QUICK_PICKS } from "@/lib/weather/locations/world-cities";

type Props = {
  current: LocationRef;
  /** When set, renders as a modal panel with close affordance and Escape key. */
  onClose?: () => void;
  /** inner = no outer shell (inside LocatingScreen panel); standalone = own glass card */
  layout?: "modal" | "inner" | "standalone";
};

const QUICK_PICKS: LocationRef[] = WORLD_QUICK_PICKS;

function placeSubtitle(loc: LocationRef): string {
  return [loc.state, loc.countryCode].filter(Boolean).join(" · ");
}

function PlaceRow({
  loc,
  icon,
  onSelect,
  trailing,
}: {
  loc: LocationRef;
  icon: "globe" | "pin" | "saved";
  onSelect: () => void;
  trailing?: ReactNode;
}) {
  const Icon =
    icon === "globe"
      ? GlobeHemisphereWest
      : icon === "saved"
        ? BookmarkSimple
        : MapPin;

  return (
    <div className="search-modal-row group flex min-h-[3.25rem] w-full items-start gap-1 rounded-xl px-1 py-1">
      <button
        type="button"
        className="flex min-w-0 flex-1 items-start gap-3 rounded-xl px-2 py-1.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/40"
        onClick={onSelect}
      >
        <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-sky-300 group-hover:border-sky-400/25 group-hover:bg-sky-400/10">
          <Icon className="size-4" weight="fill" aria-hidden />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-semibold text-white">
            {loc.name}
          </span>
          <span className="mt-0.5 block truncate text-[13px] leading-snug text-white/50">
            {placeSubtitle(loc)}
          </span>
        </span>
      </button>
      {trailing}
    </div>
  );
}

export function LocationSearch({ current, onClose, layout }: Props) {
  const router = useRouter();
  const { locale } = useLocale();
  const t = useT();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const [results, setResults] = useState<LocationRef[]>([]);
  const [pending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const [savedPlaces, setSavedPlaces] = useState<LocationRef[]>([]);
  const [langOpen, setLangOpen] = useState(false);
  const resolvedLayout = layout ?? (onClose ? "modal" : "standalone");
  const isModal = resolvedLayout === "modal";
  const isInner = resolvedLayout === "inner";
  const isGlass = isModal || isInner || resolvedLayout === "standalone";
  const trimmed = query.trim();
  const isSearching = trimmed.length >= 2;

  useEffect(() => {
    const sync = () => setSavedPlaces(readSavedPlaces());
    sync();
    window.addEventListener("saved-places-changed", sync);
    return () => window.removeEventListener("saved-places-changed", sync);
  }, []);

  useEffect(() => {
    if (!onClose) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (isModal) inputRef.current?.focus();
  }, [isModal]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (deferred.trim().length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `/api/places?q=${encodeURIComponent(deferred.trim())}&scope=world&lang=${locale}`,
        );
        const data = await res.json();
        if (!cancelled) setResults(data.results ?? []);
      } catch {
        if (!cancelled) setResults([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    const t = setTimeout(run, 200);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [deferred, locale]);

  const go = (loc: LocationRef) => {
    onClose?.();
    setQuery("");
    saveLastPlace(loc);
    startTransition(() => {
      router.push(hrefForLocation(loc, { from: "search" }));
    });
  };

  const removeSaved = (loc: LocationRef, e: MouseEvent) => {
    e.stopPropagation();
    removeSavedPlace(loc);
    setSavedPlaces(readSavedPlaces());
  };

  const resultLabel = isSearching
    ? loading
      ? t("search.searching")
      : results.length === 0
        ? t("search.noResults")
        : results.length === 1
          ? t("search.oneResult")
          : `${results.length} ${t("search.results")}`
    : t("search.popular");

  const shellClass = isInner
    ? ""
    : isGlass
      ? "search-modal-panel overflow-hidden shadow-2xl"
      : "rounded-2xl border border-white/12 bg-[rgb(var(--bg-rgb)/0.2)] p-2.5";

  const content = langOpen ? (
    <LanguagePickerPanel
      onBack={() => setLangOpen(false)}
      onClose={onClose}
    />
  ) : (
    <>
      <form
        role="search"
        onSubmit={(e) => e.preventDefault()}
        className={
          isGlass
            ? "flex items-center gap-2.5 border-b border-white/10 bg-white/[0.03] px-4 py-3.5"
            : "flex items-center gap-2 rounded-xl border border-white/10 bg-[rgb(var(--field-rgb)/0.8)] px-3 py-2.5 shadow-inner focus-within:border-sky-400/55 focus-within:ring-2 focus-within:ring-sky-400/30"
        }
      >
        <MagnifyingGlass
          className="size-5 shrink-0 text-sky-300/80"
          weight="bold"
          aria-hidden
        />
        <label className="sr-only" htmlFor="place-search">
          Search city or district worldwide
        </label>
        <input
          ref={inputRef}
          id="place-search"
          type="search"
          role="combobox"
          aria-expanded={isSearching}
          aria-controls={listId}
          aria-autocomplete="list"
          className="min-w-0 flex-1 bg-transparent text-[15px] text-white outline-none placeholder:text-white/40"
          placeholder={t("search.placeholder")}
          value={query}
          maxLength={80}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
          enterKeyHint="search"
        />
        {(loading || pending) && (
          <SpinnerGap
            className="size-5 shrink-0 animate-spin text-sky-300/70"
            aria-label="Searching"
          />
        )}
        {isModal && onClose ? (
          <button
            type="button"
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-white/55 transition hover:bg-white/10 hover:text-white"
            aria-label={t("search.close")}
            onClick={onClose}
          >
            <X className="size-4" weight="bold" />
          </button>
        ) : null}
      </form>

      <div
        className={
          isGlass
            ? isInner
              ? "search-modal-scroll max-h-[min(40vh,20rem)] overflow-y-auto overscroll-y-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              : "search-modal-scroll overflow-y-auto overscroll-y-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            : "mt-3"
        }
      >
        {isSearching ? (
          <>
            <p className="weather-panel-label px-4 pt-3 pb-1.5">{resultLabel}</p>
            <ul id={listId} role="listbox" aria-label="Places" className="px-2 pb-3">
              {results.map((r, i) => (
                <li key={`${r.id}-${r.lat}-${r.lon}`} role="option">
                  <PlaceRow loc={r} icon="pin" onSelect={() => go(r)} />
                  {i < results.length - 1 ? (
                    <div className="mx-4 border-b border-white/[0.06]" aria-hidden />
                  ) : null}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            {savedPlaces.length > 0 ? (
              <>
                <p className="weather-panel-label px-4 pt-3 pb-1.5">
                  {t("search.saved")}
                </p>
                <ul aria-label="Saved places" className="px-2 pb-1">
                  {savedPlaces.map((r, i) => (
                    <li key={`saved-${r.id}-${r.lat}-${r.lon}`}>
                      <PlaceRow
                        loc={r}
                        icon="saved"
                        onSelect={() => go(r)}
                        trailing={
                          <span
                            role="presentation"
                            className="ml-1 shrink-0 self-center"
                          >
                            <button
                              type="button"
                              className="inline-flex size-8 items-center justify-center rounded-full text-white/40 transition hover:bg-white/10 hover:text-white"
                              aria-label={`${t("search.remove")} ${r.name}`}
                              onClick={(e) => removeSaved(r, e)}
                            >
                              <X className="size-3.5" weight="bold" />
                            </button>
                          </span>
                        }
                      />
                      {i < savedPlaces.length - 1 ? (
                        <div className="mx-4 border-b border-white/[0.06]" aria-hidden />
                      ) : null}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
            <p
              className={`weather-panel-label px-4 pb-1.5 ${
                savedPlaces.length > 0 ? "pt-2" : "pt-3"
              }`}
            >
              {t("search.popular")}
            </p>
            <ul id={listId} role="listbox" aria-label="Places" className="px-2 pb-3">
              {QUICK_PICKS.map((r, i) => (
                <li key={`${r.id}-${r.lat}-${r.lon}`} role="option">
                  <PlaceRow loc={r} icon="globe" onSelect={() => go(r)} />
                  {i < QUICK_PICKS.length - 1 ? (
                    <div className="mx-4 border-b border-white/[0.06]" aria-hidden />
                  ) : null}
                </li>
              ))}
            </ul>
          </>
        )}

        {!isGlass ? (
          <p className="mt-2 px-1 text-[11px] text-zinc-500">
            Current: {current.name}
            {current.state ? `, ${current.state}` : ""}
          </p>
        ) : null}

        {isGlass ? (
          <div className="border-t border-white/[0.06] px-1 pb-1 pt-0.5">
            <LanguagePickerRow onOpen={() => setLangOpen(true)} />
          </div>
        ) : null}
      </div>
    </>
  );

  if (isInner) {
    return content;
  }

  return <div className={shellClass}>{content}</div>;
}
