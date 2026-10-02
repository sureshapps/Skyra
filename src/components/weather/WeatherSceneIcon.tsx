import type { WeatherCondition } from "@/lib/weather/types";
import {
  CloudFog,
  CloudLightning,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudSun,
  Sun,
  Moon,
  Wind,
  ThermometerHot,
} from "@phosphor-icons/react/dist/ssr";

type Props = {
  condition: WeatherCondition;
  isDay?: boolean;
  size?: "md" | "lg";
};

/** Soft weather glyph style with no neon glow. */
export function WeatherSceneIcon({
  condition,
  isDay = true,
  size = "lg",
}: Props) {
  const box =
    size === "lg"
      ? "size-[min(42vw,11rem)] lg:size-44"
      : "size-24";

  let Icon = isDay ? Sun : Moon;
  let color = isDay ? "text-amber-200" : "text-slate-100";

  switch (condition) {
    case "clear":
      Icon = isDay ? Sun : Moon;
      color = isDay ? "text-amber-200" : "text-slate-100";
      break;
    case "partly_cloudy":
      Icon = isDay ? CloudSun : CloudMoon;
      color = "text-white";
      break;
    case "overcast":
    case "haze":
      Icon = CloudFog;
      color = "text-white/90";
      break;
    case "fog":
      Icon = CloudFog;
      color = "text-slate-200";
      break;
    case "light_rain":
      Icon = CloudRain;
      color = "text-sky-100";
      break;
    case "heavy_rain":
    case "thunderstorm":
      Icon = CloudLightning;
      color = "text-indigo-100";
      break;
    case "snow":
      Icon = CloudSnow;
      color = "text-sky-50";
      break;
    case "windy":
      Icon = Wind;
      color = "text-teal-100";
      break;
    case "heatwave":
      Icon = ThermometerHot;
      color = "text-orange-200";
      break;
  }

  return (
    <div className="relative flex items-center justify-center" aria-hidden="true">
      <div className="absolute size-[85%] rounded-full bg-white/10 blur-2xl" />
      <Icon className={`relative ${box} ${color} drop-shadow-md`} weight="duotone" />
    </div>
  );
}
