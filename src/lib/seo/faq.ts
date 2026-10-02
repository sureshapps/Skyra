/** FAQ for answer engines and FAQPage JSON-LD. Plain answers, no marketing fluff. */
export const SITE_FAQ = [
  {
    question: "What is SKYRA?",
    answer:
      "SKYRA is a free weather site for Malaysia and cities worldwide. It shows current temperature, hourly and 7-day outlooks, rain, wind, UV, air quality, and short alerts based on the forecast.",
  },
  {
    question: "Which cities can I look up?",
    answer:
      "Search any city you need. Malaysia coverage includes major metros and many districts, including Petaling, Subang, Sunway, Klang, and Banting.",
  },
  {
    question: "Where does the forecast come from?",
    answer:
      "Forecasts come from Open-Meteo. Place search uses Open-Meteo geocoding. GPS place names use BigDataCloud reverse geocoding. Alerts are built from those forecast fields, not from official MetMalaysia bulletins.",
  },
  {
    question: "Can I use Malay, Chinese, or other languages?",
    answer:
      "Yes. The site starts in your phone or browser language when possible. You can switch to 70+ languages. UI labels are translated online. Place names use localized geocoding when the provider supports it.",
  },
  {
    question: "Can I get weather for my current location?",
    answer:
      "Yes. Allow location in the browser and the app loads weather for that spot. You can also search by city or open a saved place.",
  },
  {
    question: "Are the alerts official MetMalaysia warnings?",
    answer:
      "No. Alerts are tips derived from the live forecast so you can plan your day. They are not official MetMalaysia warnings.",
  },
] as const;
