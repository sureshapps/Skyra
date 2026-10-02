import type { LocationRef } from "../types";

/** Major cities across Malaysian states/federal territories for quick picks (real coords for Open-Meteo). */
export const MALAYSIA_QUICK_CITIES: LocationRef[] = [
  // Federal territories
  { id: "my-kuala-lumpur", name: "Kuala Lumpur", state: "Kuala Lumpur", countryCode: "MY", lat: 3.139, lon: 101.6869 },
  { id: "my-putrajaya", name: "Putrajaya", state: "Putrajaya", countryCode: "MY", lat: 2.9264, lon: 101.6964 },
  { id: "my-labuan", name: "Labuan", state: "Labuan", countryCode: "MY", lat: 5.2831, lon: 115.2308 },
  // Selangor
  { id: "my-shah-alam", name: "Shah Alam", state: "Selangor", countryCode: "MY", lat: 3.0738, lon: 101.5183 },
  { id: "my-petaling-jaya", name: "Petaling Jaya", state: "Selangor", countryCode: "MY", lat: 3.1073, lon: 101.6067 },
  { id: "my-subang-jaya", name: "Subang Jaya", state: "Selangor", countryCode: "MY", lat: 3.0565, lon: 101.5851 },
  { id: "my-klang", name: "Klang", state: "Selangor", countryCode: "MY", lat: 3.0449, lon: 101.4455 },
  { id: "my-kajang", name: "Kajang", state: "Selangor", countryCode: "MY", lat: 2.9935, lon: 101.7874 },
  { id: "my-cyberjaya", name: "Cyberjaya", state: "Selangor", countryCode: "MY", lat: 2.9213, lon: 101.6559 },
  // Penang
  { id: "my-george-town", name: "George Town", state: "Penang", countryCode: "MY", lat: 5.4141, lon: 100.3288 },
  { id: "my-butterworth", name: "Butterworth", state: "Penang", countryCode: "MY", lat: 5.3991, lon: 100.3638 },
  { id: "my-bukit-mertajam", name: "Bukit Mertajam", state: "Penang", countryCode: "MY", lat: 5.3631, lon: 100.4668 },
  // Johor
  { id: "my-johor-bahru", name: "Johor Bahru", state: "Johor", countryCode: "MY", lat: 1.4927, lon: 103.7414 },
  { id: "my-iskandar-puteri", name: "Iskandar Puteri", state: "Johor", countryCode: "MY", lat: 1.4276, lon: 103.6425 },
  { id: "my-batu-pahat", name: "Batu Pahat", state: "Johor", countryCode: "MY", lat: 1.8548, lon: 102.9325 },
  { id: "my-muar", name: "Muar", state: "Johor", countryCode: "MY", lat: 2.0442, lon: 102.5689 },
  { id: "my-kluang", name: "Kluang", state: "Johor", countryCode: "MY", lat: 2.0251, lon: 103.3184 },
  { id: "my-segamat", name: "Segamat", state: "Johor", countryCode: "MY", lat: 2.5148, lon: 102.8158 },
  // Perak
  { id: "my-ipoh", name: "Ipoh", state: "Perak", countryCode: "MY", lat: 4.5975, lon: 101.0901 },
  { id: "my-taiping", name: "Taiping", state: "Perak", countryCode: "MY", lat: 4.85, lon: 100.7333 },
  { id: "my-teluk-intan", name: "Teluk Intan", state: "Perak", countryCode: "MY", lat: 4.0259, lon: 101.0213 },
  // Pahang
  { id: "my-kuantan", name: "Kuantan", state: "Pahang", countryCode: "MY", lat: 3.8077, lon: 103.326 },
  { id: "my-temerloh", name: "Temerloh", state: "Pahang", countryCode: "MY", lat: 3.45, lon: 102.4167 },
  { id: "my-bentong", name: "Bentong", state: "Pahang", countryCode: "MY", lat: 3.5226, lon: 101.9086 },
  { id: "my-cameron-highlands", name: "Tanah Rata", state: "Pahang", countryCode: "MY", lat: 4.4718, lon: 101.3801 },
  // Terengganu
  { id: "my-kuala-terengganu", name: "Kuala Terengganu", state: "Terengganu", countryCode: "MY", lat: 5.3302, lon: 103.1408 },
  { id: "my-kemaman", name: "Kemaman", state: "Terengganu", countryCode: "MY", lat: 4.2333, lon: 103.4167 },
  { id: "my-dungun", name: "Dungun", state: "Terengganu", countryCode: "MY", lat: 4.7594, lon: 103.4147 },
  // Kelantan
  { id: "my-kota-bharu", name: "Kota Bharu", state: "Kelantan", countryCode: "MY", lat: 6.1254, lon: 102.2381 },
  { id: "my-kuala-krai", name: "Kuala Krai", state: "Kelantan", countryCode: "MY", lat: 5.5333, lon: 102.2 },
  { id: "my-gua-musang", name: "Gua Musang", state: "Kelantan", countryCode: "MY", lat: 4.8833, lon: 101.9667 },
  // Kedah
  { id: "my-alor-setar", name: "Alor Setar", state: "Kedah", countryCode: "MY", lat: 6.1248, lon: 100.3678 },
  { id: "my-sungai-petani", name: "Sungai Petani", state: "Kedah", countryCode: "MY", lat: 5.647, lon: 100.4877 },
  { id: "my-kulim", name: "Kulim", state: "Kedah", countryCode: "MY", lat: 5.3647, lon: 100.5617 },
  { id: "my-langkawi", name: "Kuah (Langkawi)", state: "Kedah", countryCode: "MY", lat: 6.3167, lon: 99.85 },
  // Perlis
  { id: "my-kangar", name: "Kangar", state: "Perlis", countryCode: "MY", lat: 6.4414, lon: 100.1986 },
  // Negeri Sembilan
  { id: "my-seremban", name: "Seremban", state: "Negeri Sembilan", countryCode: "MY", lat: 2.7259, lon: 101.9424 },
  { id: "my-port-dickson", name: "Port Dickson", state: "Negeri Sembilan", countryCode: "MY", lat: 2.5225, lon: 101.7961 },
  { id: "my-nilai", name: "Nilai", state: "Negeri Sembilan", countryCode: "MY", lat: 2.8167, lon: 101.8 },
  // Melaka
  { id: "my-melaka", name: "Melaka", state: "Melaka", countryCode: "MY", lat: 2.1896, lon: 102.2501 },
  { id: "my-alor-gajah", name: "Alor Gajah", state: "Melaka", countryCode: "MY", lat: 2.3833, lon: 102.2 },
  // Sarawak
  { id: "my-kuching", name: "Kuching", state: "Sarawak", countryCode: "MY", lat: 1.5535, lon: 110.3593 },
  { id: "my-sibu", name: "Sibu", state: "Sarawak", countryCode: "MY", lat: 2.2873, lon: 111.8305 },
  { id: "my-miri", name: "Miri", state: "Sarawak", countryCode: "MY", lat: 4.3995, lon: 113.9914 },
  { id: "my-bintulu", name: "Bintulu", state: "Sarawak", countryCode: "MY", lat: 3.1667, lon: 113.0333 },
  { id: "my-sri-aman", name: "Sri Aman", state: "Sarawak", countryCode: "MY", lat: 1.237, lon: 111.4621 },
  { id: "my-mukah", name: "Mukah", state: "Sarawak", countryCode: "MY", lat: 2.8987, lon: 112.0911 },
  { id: "my-limbang", name: "Limbang", state: "Sarawak", countryCode: "MY", lat: 4.75, lon: 115.0 },
  // Sabah
  { id: "my-kota-kinabalu", name: "Kota Kinabalu", state: "Sabah", countryCode: "MY", lat: 5.9804, lon: 116.0735 },
  { id: "my-sandakan", name: "Sandakan", state: "Sabah", countryCode: "MY", lat: 5.8394, lon: 118.1172 },
  { id: "my-tawau", name: "Tawau", state: "Sabah", countryCode: "MY", lat: 4.2448, lon: 117.8912 },
  { id: "my-lahad-datu", name: "Lahad Datu", state: "Sabah", countryCode: "MY", lat: 5.0267, lon: 118.3269 },
  { id: "my-keningau", name: "Keningau", state: "Sabah", countryCode: "MY", lat: 5.3378, lon: 116.1602 },
  { id: "my-semporna", name: "Semporna", state: "Sabah", countryCode: "MY", lat: 4.4811, lon: 118.6111 },
  { id: "my-kudat", name: "Kudat", state: "Sabah", countryCode: "MY", lat: 6.8833, lon: 116.8333 },
  { id: "my-beaufort", name: "Beaufort", state: "Sabah", countryCode: "MY", lat: 5.3472, lon: 115.7456 },
  { id: "my-ranau", name: "Ranau", state: "Sabah", countryCode: "MY", lat: 5.9525, lon: 116.6628 },
];

export const DEFAULT_LOCATION: LocationRef = MALAYSIA_QUICK_CITIES[0];

export function findQuickCity(id: string): LocationRef | undefined {
  return MALAYSIA_QUICK_CITIES.find((c) => c.id === id);
}

export function encodeCoords(lat: number, lon: number): string {
  return `${lat.toFixed(4)},${lon.toFixed(4)}`;
}

export function parseCoords(raw: string): { lat: number; lon: number } | null {
  const m = raw.trim().match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
  if (!m) return null;
  const lat = Number(m[1]);
  const lon = Number(m[2]);
  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  if (lat < -90 || lat > 90 || lon < -180 || lon > 180) return null;
  return { lat, lon };
}
