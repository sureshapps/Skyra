"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  LOCALE_AUTO,
  LOCALE_COOKIE,
  LOCALE_EXPLICIT_COOKIE,
  LOCALE_EXPLICIT_STORAGE,
  LOCALE_EXPLICIT_STORAGE_LEGACY,
  LOCALE_STORAGE,
  LOCALE_STORAGE_LEGACY,
  isLocaleAuto,
  languageDisplayName,
  normalizeLanguageCode,
  resolveLanguage,
  type LanguageCode,
} from "@/lib/i18n/locale";
import { getLocalStorageMigrating } from "@/lib/storage/migrate-local";
import { UI_SOURCE, LOCALE_BUNDLE_VERSION, type UiKey } from "@/lib/i18n/ui-source";
import { sanitizeTranslation } from "@/lib/i18n/translate-sanitize";

type Strings = Record<UiKey, string>;

type LocaleContextValue = {
  locale: LanguageCode;
  preference: string;
  preferenceLabel: string;
  setLocale: (preference: string) => void;
  t: (key: UiKey) => string;
  ready: boolean;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readStoredPreference(): string {
  try {
    const explicit =
      getLocalStorageMigrating(
        LOCALE_EXPLICIT_STORAGE,
        LOCALE_EXPLICIT_STORAGE_LEGACY,
      ) === "1";
    if (!explicit) return LOCALE_AUTO;
    const raw = getLocalStorageMigrating(LOCALE_STORAGE, LOCALE_STORAGE_LEGACY);
    if (!raw || isLocaleAuto(raw)) return LOCALE_AUTO;
    return normalizeLanguageCode(raw);
  } catch {
    return LOCALE_AUTO;
  }
}

function setLocaleCookie(preference: string, explicit: boolean) {
  document.cookie = `${LOCALE_COOKIE}=${preference};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
  document.cookie = `${LOCALE_EXPLICIT_COOKIE}=${explicit ? "1" : "0"};path=/;max-age=${60 * 60 * 24 * 365};SameSite=Lax`;
}

function languageNativeOrEnglish(code: LanguageCode): string {
  const native = languageDisplayName(code, code);
  if (native && native !== code) return native;
  return languageDisplayName(code, "en");
}

function preferenceLabelFor(
  preference: string,
  resolved: LanguageCode,
  t: (key: UiKey) => string,
): string {
  if (isLocaleAuto(preference)) {
    return `${languageDisplayName(resolved, resolved)} · ${t("lang.deviceShort")}`;
  }
  return languageNativeOrEnglish(resolved);
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [preference, setPreference] = useState(LOCALE_AUTO);
  const [locale, setLocaleState] = useState<LanguageCode>("en");
  const [strings, setStrings] = useState<Strings>(UI_SOURCE);
  const [ready, setReady] = useState(false);

  const loadStrings = useCallback(async (code: LanguageCode) => {
    if (code === "en") {
      setStrings(UI_SOURCE);
      setReady(true);
      return;
    }
    try {
      const res = await fetch(
        `/api/locale?lang=${encodeURIComponent(code)}&v=${LOCALE_BUNDLE_VERSION}`,
      );
      const data = (await res.json()) as { strings?: Strings };
      setStrings(data.strings ?? UI_SOURCE);
    } catch {
      setStrings(UI_SOURCE);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    const pref = readStoredPreference();
    const resolved = resolveLanguage(pref);
    setPreference(pref);
    setLocaleState(resolved);
    setLocaleCookie(pref, false);
    document.documentElement.lang = resolved === "en" ? "en-MY" : resolved;
    void loadStrings(resolved);
  }, [loadStrings]);

  const t = useCallback(
    (key: UiKey) => {
      const raw = strings[key] ?? UI_SOURCE[key] ?? key;
      if (locale === "en") return raw;
      return sanitizeTranslation(UI_SOURCE[key] ?? raw, raw, locale);
    },
    [strings, locale],
  );

  const setLocale = useCallback(
    (nextPref: string) => {
      const stored = isLocaleAuto(nextPref)
        ? LOCALE_AUTO
        : normalizeLanguageCode(nextPref);
      const resolved = resolveLanguage(stored);
      setPreference(stored);
      setLocaleState(resolved);
      try {
        localStorage.setItem(LOCALE_STORAGE, stored);
        localStorage.setItem(LOCALE_EXPLICIT_STORAGE, "1");
        localStorage.removeItem(LOCALE_STORAGE_LEGACY);
        localStorage.removeItem(LOCALE_EXPLICIT_STORAGE_LEGACY);
      } catch {
        /* ignore */
      }
      setLocaleCookie(stored, true);
      document.documentElement.lang = resolved === "en" ? "en-MY" : resolved;
      setReady(false);
      void loadStrings(resolved).then(() => router.refresh());
    },
    [loadStrings, router],
  );

  const preferenceLabel = useMemo(
    () => preferenceLabelFor(preference, locale, t),
    [preference, locale, t],
  );

  const value = useMemo(
    () => ({
      locale,
      preference,
      preferenceLabel,
      setLocale,
      t,
      ready,
    }),
    [locale, preference, preferenceLabel, setLocale, t, ready],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}

export function useT() {
  return useLocale().t;
}
