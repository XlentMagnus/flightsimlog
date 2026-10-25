import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  date,
} from "drizzle-orm/pg-core";

export const simulatorEnum = pgEnum("simulator", [
  "MSFS 2024",
  "MSFS 2020",
  "Other",
]);

export const flights = pgTable("flights", {
  id: serial("id").primaryKey(),
  // Version 2 (flera anvandare): byt till en riktig foreign key mot en users-tabell.
  ownerId: text("owner_id").notNull().default("owner"),
  flightDate: date("flight_date", { mode: "string" }).notNull(),
  departureIcao: varchar("departure_icao", { length: 4 }).notNull(),
  arrivalIcao: varchar("arrival_icao", { length: 4 }).notNull(),
  aircraft: text("aircraft").notNull(),
  simulator: simulatorEnum("simulator").notNull(),
  flightTimeMinutes: integer("flight_time_minutes").notNull(),
  distanceNm: integer("distance_nm").notNull(),
  rating: integer("rating"),
  route: text("route"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Flight = typeof flights.$inferSelect;
export type NewFlight = typeof flights.$inferInsert;
