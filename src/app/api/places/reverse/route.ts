import { NextRequest, NextResponse } from "next/server";
import { reverseGeocode } from "@/lib/weather/reverse-geocode";
import { resolveLanguage } from "@/lib/i18n/locale";
import { translateOnline } from "@/lib/i18n/translate-online";
import {
  apiError,
  assertApiCallerAllowed,
  parseBoundedLatLon,
} from "@/lib/api/guard";

export async function GET(req: NextRequest) {
  const blocked = assertApiCallerAllowed(req);
  if (blocked) return blocked;

  const coords = parseBoundedLatLon(
    req.nextUrl.searchParams.get("lat"),
    req.nextUrl.searchParams.get("lon"),
  );
  if (!coords) {
    return NextResponse.json({ error: "lat and lon required" }, { status: 400 });
  }

  const locale = resolveLanguage(req.nextUrl.searchParams.get("lang"));
  const { lat, lon } = coords;

  try {
    const place = await reverseGeocode(lat, lon, locale);
    return NextResponse.json(place, {
      headers: { "Cache-Control": "public, s-maxage=3600" },
    });
  } catch (err) {
    console.error(err);
    const nearYou = await translateOnline("Near you", locale);
    return NextResponse.json(
      {
        id: `gps-${lat.toFixed(4)}-${lon.toFixed(4)}`,
        name: nearYou,
        state: "",
        countryCode: "MY",
        lat,
        lon,
      },
      { status: 200 },
    );
  }
}
