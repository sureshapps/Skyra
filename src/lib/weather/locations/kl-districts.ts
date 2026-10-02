import type { LocationRef } from "../types";

/** 11 Kuala Lumpur areas (one per parliamentary constituency) with centroid lat-lon for Open-Meteo */
export const KL_DISTRICTS: LocationRef[] = [
  {
    id: "bbt",
    name: "Bukit Bintang",
    state: "Kuala Lumpur",
    district: "Bukit Bintang",
    countryCode: "MY",
    lat: 3.1466,
    lon: 101.7108,
  },
  {
    id: "ttw",
    name: "Titiwangsa",
    state: "Kuala Lumpur",
    district: "Titiwangsa",
    countryCode: "MY",
    lat: 3.1805,
    lon: 101.701,
  },
  {
    id: "stw",
    name: "Setiawangsa",
    state: "Kuala Lumpur",
    district: "Setiawangsa",
    countryCode: "MY",
    lat: 3.1752,
    lon: 101.7388,
  },
  {
    id: "wmj",
    name: "Wangsa Maju",
    state: "Kuala Lumpur",
    district: "Wangsa Maju",
    countryCode: "MY",
    lat: 3.2005,
    lon: 101.7316,
  },
  {
    id: "sgb",
    name: "Segambut",
    state: "Kuala Lumpur",
    district: "Segambut",
    countryCode: "MY",
    lat: 3.1856,
    lon: 101.6648,
  },
  {
    id: "kpg",
    name: "Kepong",
    state: "Kuala Lumpur",
    district: "Kepong",
    countryCode: "MY",
    lat: 3.2094,
    lon: 101.6361,
  },
  {
    id: "btu",
    name: "Batu",
    state: "Kuala Lumpur",
    district: "Batu",
    countryCode: "MY",
    lat: 3.2379,
    lon: 101.684,
  },
  {
    id: "lpt",
    name: "Lembah Pantai",
    state: "Kuala Lumpur",
    district: "Lembah Pantai",
    countryCode: "MY",
    lat: 3.129,
    lon: 101.671,
  },
  {
    id: "spt",
    name: "Seputeh",
    state: "Kuala Lumpur",
    district: "Seputeh",
    countryCode: "MY",
    lat: 3.11,
    lon: 101.683,
  },
  {
    id: "chr",
    name: "Cheras",
    state: "Kuala Lumpur",
    district: "Cheras",
    countryCode: "MY",
    lat: 3.098,
    lon: 101.75,
  },
  {
    id: "btr",
    name: "Bandar Tun Razak",
    state: "Kuala Lumpur",
    district: "Bandar Tun Razak",
    countryCode: "MY",
    lat: 3.092,
    lon: 101.722,
  },
];

export const DEFAULT_LOCATION_ID = "bbt";

export function getLocationById(id: string): LocationRef | undefined {
  return KL_DISTRICTS.find((d) => d.id === id);
}
