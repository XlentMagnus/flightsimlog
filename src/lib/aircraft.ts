import { AIRCRAFT, type AircraftEntry } from "@/data/aircraft";

export { AIRCRAFT };
export type { AircraftEntry };

const key = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");

const byName = new Map<string, AircraftEntry>(
  AIRCRAFT.map((a) => [key(a.name), a]),
);

/** Slar upp ett flygplan i listan, skiftlageskanslig. */
export function findAircraft(name: string): AircraftEntry | undefined {
  return byName.get(key(name));
}
