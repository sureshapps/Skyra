# SKYRA

Repository: [github.com/sureshapps/Skyra](https://github.com/sureshapps/Skyra) · License: MPL-2.0

Live weather for cities in Malaysia and elsewhere. Hourly and 7-day outlook, rain, wind, UV, air quality, city search, GPS, saved places, and language support.

## What it includes

- Live weather from Open-Meteo
- World city search (Open-Meteo geocoding)
- GPS reverse geocoding (BigDataCloud)
- Cards for hourly, 7-day, rain, UV, AQI, and details
- UI strings translated online (MyMemory, with sanitizing)
- Device language by default until you pick one
- Compact URLs like `/?p=lat,lon&n=Name&st=State&f=g`
- SEO / GEO / AEO: metadata, robots, sitemap, manifest, JSON-LD, `llms.txt`, FAQ



## Local development

1. Install dependencies:

```bash
npm install
```

1. Copy env file and set your values:

```bash
cp .env.example .env.local
```

1. Start dev server:

```bash
npm run dev
```

1. Open [http://localhost:3000](http://localhost:3000)



## Environment variables

Use `.env.local` for local development.

Required for production SEO:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

This value is used for canonical URLs, sitemap links, and social metadata.

## Build check

```bash
npm run build
```



## Data sources

- Open-Meteo: forecast and geocoding
- BigDataCloud: reverse geocoding
- MyMemory: UI translation



## Notes

- This app is for weather guidance and convenience.
- Alerts are app-derived weather tips, not official government warnings.



## Security notes

Production responses send Content-Security-Policy, HSTS (`includeSubDomains` and `preload`), COOP, and CORP. API routes check the caller origin and keep keys on the server.

City and language search fields cap length. JSON-LD is escaped before it is injected.

## License

Source code in this repository is licensed under the [Mozilla Public License 2.0](LICENSE) (MPL-2.0).

You may use, modify, and distribute the code under MPL-2.0. If you modify MPL-covered source files and distribute them, those modified files must stay open under MPL-2.0.

## Copyright and assets

Copyright for the project source code is held by [Suresh Kaleyannan](https://github.com//sureshapps), under MPL-2.0.

Images, animations, icons, videos, fonts, and other media in this project may belong to their respective owners and are not necessarily covered by MPL-2.0. Use or redistribution of those assets may require separate permission or license from the original rights holders.

Third-party data and services (Open-Meteo, BigDataCloud, MyMemory, and others) remain subject to their own terms and attribution requirements.
