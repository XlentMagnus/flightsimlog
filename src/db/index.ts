import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

type Db = ReturnType<typeof drizzle<typeof schema>>;

let cached: Db | undefined;

/**
 * Skapar anslutningen forst nar den behovs, sa att bygget inte kraver
 * DATABASE_URL (viktigt for Vercel-bygget). Kastar vid forsta fragan om
 * variabeln saknas.
 */
export function getDb(): Db {
  if (cached) return cached;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL saknas. Se .env.example.");
  }

  cached = drizzle(neon(url), { schema });
  return cached;
}
