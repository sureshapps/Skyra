import { NextRequest, NextResponse } from "next/server";
import { translateOnline } from "@/lib/i18n/translate-online";
import { UI_SOURCE, type UiKey } from "@/lib/i18n/ui-source";
import {
  apiError,
  assertApiCallerAllowed,
  sanitizeLang,
} from "@/lib/api/guard";

export async function GET(req: NextRequest) {
  const blocked = assertApiCallerAllowed(req);
  if (blocked) return blocked;

  const locale = sanitizeLang(req.nextUrl.searchParams.get("lang"));
  const entries = Object.entries(UI_SOURCE) as [UiKey, string][];

  if (locale === "en") {
    return NextResponse.json(
      { locale, strings: UI_SOURCE },
      { headers: { "Cache-Control": "public, s-maxage=3600" } },
    );
  }

  try {
    const strings = {} as Record<UiKey, string>;
    await Promise.all(
      entries.map(async ([key, value]) => {
        strings[key] = await translateOnline(value, locale);
      }),
    );

    return NextResponse.json(
      { locale, strings },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600",
          "Content-Type": "application/json; charset=utf-8",
        },
      },
    );
  } catch (err) {
    console.error(err);
    return apiError("Translation bundle unavailable");
  }
}
