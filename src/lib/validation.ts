import { z } from "zod";

export const SIMULATORS = ["MSFS 2024", "MSFS 2020", "Other"] as const;

const icao = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{4}$/, "ICAO-kod ar fyra bokstaver, t.ex. ESSA");

export const flightSchema = z.object({
  flightDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Ange ett datum"),
  departureIcao: icao,
  arrivalIcao: icao,
  aircraft: z.string().trim().min(1, "Ange flygplan").max(80),
  simulator: z.enum(SIMULATORS),
  hours: z.coerce.number().int().min(0).max(99),
  minutes: z.coerce.number().int().min(0).max(59),
  distanceNm: z.coerce.number().int().min(0).max(30000),
  rating: z
    .union([z.literal(""), z.coerce.number().int().min(1).max(5)])
    .transform((v) => (v === "" ? null : v)),
  route: z
    .string()
    .trim()
    .max(500)
    .transform((v) => (v === "" ? null : v)),
  notes: z
    .string()
    .trim()
    .max(4000)
    .transform((v) => (v === "" ? null : v)),
});

export type FlightInput = z.infer<typeof flightSchema>;
