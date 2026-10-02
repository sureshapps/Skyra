import { LANGUAGE_CODES } from "./language-catalog";

export const LOCALE_COOKIE = "weather_lang";
export const LOCALE_STORAGE = "straten:locale";
export const LOCALE_STORAGE_LEGACY = "india-weather:locale";
export const LOCALE_EXPLICIT_STORAGE = "straten:locale-explicit";
export const LOCALE_EXPLICIT_STORAGE_LEGACY = "india-weather:locale-explicit";
export const LOCALE_EXPLICIT_COOKIE = "weather_lang_explicit";
/** Stored preference meaning “follow device / Accept-Language”. */
export const LOCALE_AUTO = "auto";

/** Resolved 2-letter ISO 639-1 code. */
export type LanguageCode = string;

const VALID_CODE = /^[a-z]{2}$/;

export function normalizeLanguageCode(raw: string | null | undefined): string {
  if (!raw) return "en";
  const code = raw.trim().toLowerCase().split("-")[0];
  if (VALID_CODE.test(code)) return code;
  return "en";
}

export function isLocaleAuto(raw: string | null | undefined): boolean {
  return !raw || raw === LOCALE_AUTO;
}

export function detectBrowserLanguage(): string {
  if (typeof navigator === "undefined") return "en";
  const langs = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  for (const tag of langs) {
    const code = normalizeLanguageCode(tag);
    if (code) return code;
  }
  return "en";
}

export function parseAcceptLanguage(header: string | null | undefined): string {
  if (!header) return "en";
  for (const part of header.split(",")) {
    const tag = part.trim().split(";")[0];
    const code = normalizeLanguageCode(tag);
    if (code) return code;
  }
  return "en";
}

/** Stored cookie/localStorage value → resolved language code. */
export function resolveLanguage(
  preference: string | null | undefined,
  acceptLanguage?: string | null,
): string {
  if (isLocaleAuto(preference)) {
    if (acceptLanguage) return parseAcceptLanguage(acceptLanguage);
    return detectBrowserLanguage();
  }
  return normalizeLanguageCode(preference);
}

export function intlLocaleTag(code: string): string {
  const c = normalizeLanguageCode(code);
  if (c === "en") return "en-MY";
  if (c === "ms") return "ms-MY";
  return c;
}


/** Open-Meteo geocoding/forecast language (falls back to en when unsupported). */
const OPEN_METEO_LANGS = new Set([
  "ar",
  "bg",
  "cs",
  "da",
  "de",
  "el",
  "en",
  "es",
  "et",
  "fi",
  "fr",
  "he",
  "hr",
  "hu",
  "id",
  "it",
  "ja",
  "ko",
  "lt",
  "lv",
  "ms",
  "nl",
  "no",
  "pl",
  "pt",
  "ro",
  "ru",
  "sk",
  "sl",
  "sv",
  "tr",
  "uk",
  "vi",
  "hi",
  "ml",
  "ta",
  "te",
  "kn",
  "bn",
]);

export function openMeteoLanguage(code: string): string {
  const c = normalizeLanguageCode(code);
  return OPEN_METEO_LANGS.has(c) ? c : "en";
}

export function bigDataCloudLanguage(code: string): string {
  const c = normalizeLanguageCode(code);
  return c === "en" ? "en" : c;
}

export function languageDisplayName(
  code: string,
  displayIn = "en",
): string {
  const c = normalizeLanguageCode(code);
  try {
    const dn = new Intl.DisplayNames([displayIn], { type: "language" });
    return dn.of(c) ?? c;
  } catch {
    return c;
  }
}

export function languageNativeName(code: string): string {
  return languageDisplayName(code, normalizeLanguageCode(code));
}

export function isKnownLanguage(code: string): boolean {
  return (LANGUAGE_CODES as readonly string[]).includes(
    normalizeLanguageCode(code),
  );
}

/** @deprecated use LanguageCode */
export type AppLocale = LanguageCode;

/** @deprecated use normalizeLanguageCode */
export function parseAppLocale(v: string | null | undefined): LanguageCode {
  if (isLocaleAuto(v)) return resolveLanguage(v);
  return normalizeLanguageCode(v);
}
