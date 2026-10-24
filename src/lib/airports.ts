import "server-only";
import data from "@/data/airports.json";
import type { Flight } from "@/db/schema";

type AirportTuple = [number, number, string];
const airports = data as unknown as Record<string, AirportTuple>;

export type MapAirport = { icao: string; name: string; lat: number; lon: number };

export type MapRoute = {
  key: string;
  from: MapAirport;
  to: MapAirport;
  count: number;
};

function lookup(icao: string): MapAirport | null {
  const hit = airports[icao.toUpperCase()];
  if (!hit) return null;
  return { icao: icao.toUpperCase(), name: hit[2], lat: hit[0], lon: hit[1] };
}

/**
 * Bygger unika rutter (A-B och B-A slas ihop) med antal flygningar.
 * Koder som saknas i datasetet returneras i `missing`.
 */
export function buildRoutes(rows: Flight[]): {
  routes: MapRoute[];
  missing: string[];
} {
  const routes = new Map<string, MapRoute>();
  const missing = new Set<string>();

  for (const f of rows) {
    const from = lookup(f.departureIcao);
    const to = lookup(f.arrivalIcao);
    if (!from) missing.add(f.departureIcao);
    if (!to) missing.add(f.arrivalIcao);
    if (!from || !to) continue;

    const key = [from.icao, to.icao].sort().join("-");
    const existing = routes.get(key);
    if (existing) existing.count += 1;
    else routes.set(key, { key, from, to, count: 1 });
  }

  return { routes: [...routes.values()], missing: [...missing].sort() };
}
