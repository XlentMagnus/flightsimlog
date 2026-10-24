import "server-only";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { flights, type Flight } from "@/db/schema";

export async function listFlights(): Promise<Flight[]> {
  return getDb()
    .select()
    .from(flights)
    .orderBy(desc(flights.flightDate), desc(flights.id));
}

export async function getFlight(id: number): Promise<Flight | undefined> {
  const rows = await getDb().select().from(flights).where(eq(flights.id, id));
  return rows[0];
}

export type Stats = {
  count: number;
  totalMinutes: number;
  totalNm: number;
  airports: number;
  topAircraft: string | null;
};

export function computeStats(rows: Flight[]): Stats {
  const airports = new Set<string>();
  const aircraftCount = new Map<string, number>();
  let totalMinutes = 0;
  let totalNm = 0;

  for (const f of rows) {
    totalMinutes += f.flightTimeMinutes;
    totalNm += f.distanceNm;
    airports.add(f.departureIcao);
    airports.add(f.arrivalIcao);
    aircraftCount.set(f.aircraft, (aircraftCount.get(f.aircraft) ?? 0) + 1);
  }

  let topAircraft: string | null = null;
  let best = 0;
  for (const [name, n] of aircraftCount) {
    if (n > best) {
      best = n;
      topAircraft = name;
    }
  }

  return {
    count: rows.length,
    totalMinutes,
    totalNm,
    airports: airports.size,
    topAircraft,
  };
}

export function formatDuration(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h ${String(m).padStart(2, "0")}m`;
}
