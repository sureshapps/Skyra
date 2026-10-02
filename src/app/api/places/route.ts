import { NextRequest, NextResponse } from "next/server";
import { searchPlaces } from "@/lib/weather/geocoding";
import { MALAYSIA_QUICK_CITIES } from "@/lib/weather/locations/malaysia-cities";
import { openMeteoLanguage, resolveLanguage } from "@/lib/i18n/locale";
import {
  apiError,
  assertApiCallerAllowed,
  sanitizeSearchQuery,
} from "@/lib/api/guard";

export async function GET(req: NextRequest) {
  const blocked = assertApiCallerAllowed(req);
  if (blocked) return blocked;

  const q = sanitizeSearchQuery(req.nextUrl.searchParams.get("q"));
  const country = (req.nextUrl.searchParams.get("country") ?? "MY").slice(0, 2);
  const scope = req.nextUrl.searchParams.get("scope") ?? "world";
  const locale = resolveLanguage(req.nextUrl.searchParams.get("lang"));

  try {
    if (!q) {
      return NextResponse.json({
        results: scope === "world" ? [] : MALAYSIA_QUICK_CITIES.slice(0, 12),
      });
    }

    const results = await searchPlaces(q, {
      countryCode: scope === "world" ? undefined : country,
      count: 20,
      language: openMeteoLanguage(locale),
    });

    return NextResponse.json(
      { results },
      { headers: { "Cache-Control": "public, s-maxage=3600" } },
    );
  } catch (err) {
    console.error(err);
    return apiError("Search failed");
  }
}
