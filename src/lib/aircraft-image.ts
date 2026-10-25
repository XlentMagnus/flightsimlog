import "server-only";
import { findAircraft } from "@/lib/aircraft";
import { pickImageByTitles, type WikiTitlesResponse } from "@/lib/wiki-pick";

export type AircraftImage = {
  imageUrl: string;
  pageUrl: string;
  title: string;
};

// Namn pa tillaggsflygplan och utvecklare som inte hjalper en Wikipedia-sokning.
const NOISE = [
  "fenix",
  "flybywire",
  "fbw",
  "pmdg",
  "asobo",
  "working title",
  "inibuilds",
  "headwind",
  "aerosoft",
  "just flight",
  "justflight",
  "black square",
  "milviz",
  "carenado",
  "leonardo",
  "miltech",
  "mod",
];

export function cleanAircraftName(raw: string): string {
  let name = raw.replace(/[()[\]]/g, " ");
  for (const word of NOISE) {
    name = name.replace(new RegExp(`\\b${word}\\b`, "gi"), " ");
  }
  return name.replace(/[^\p{L}\p{N}\s\-./]/gu, " ").replace(/\s+/g, " ").trim();
}

type WikiPage = {
  index?: number;
  title: string;
  fullurl?: string;
  thumbnail?: { source: string };
};

const USER_AGENT =
  "Flightlog/1.0 (personal flight log; https://github.com/XlentMagnus/flightsimlog)";

async function wikiFetch<T>(params: Record<string, string>): Promise<T | null> {
  const qs = new URLSearchParams({ action: "query", format: "json", ...params });
  const res = await fetch(`https://en.wikipedia.org/w/api.php?${qs}`, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
    next: { revalidate: 60 * 60 * 24 * 7 },
  });
  if (!res.ok) return null;
  return (await res.json()) as T;
}

/** Hamtar bild fran exakta Wikipedia-artiklar (redirects foljs). */
async function imageByTitles(titles: string[]): Promise<AircraftImage | null> {
  const json = await wikiFetch<WikiTitlesResponse>({
    titles: titles.join("|"),
    redirects: "1",
    prop: "pageimages|info",
    piprop: "thumbnail",
    pithumbsize: "900",
    inprop: "url",
  });
  if (!json) return null;
  return pickImageByTitles(titles, json);
}

/** Fritextsokning, anvands bara for flygplan som saknas i listan. */
async function imageBySearch(rawName: string): Promise<AircraftImage | null> {
  const name = cleanAircraftName(rawName);
  if (name.length < 2) return null;

  const json = await wikiFetch<{ query?: { pages?: Record<string, WikiPage> } }>({
    generator: "search",
    gsrsearch: `${name} aircraft`,
    gsrnamespace: "0",
    gsrlimit: "5",
    prop: "pageimages|info",
    piprop: "thumbnail",
    pithumbsize: "900",
    inprop: "url",
  });
  if (!json) return null;

  const pages = Object.values(json.query?.pages ?? {}).sort(
    (a, b) => (a.index ?? 99) - (b.index ?? 99),
  );
  const hit = pages.find((p) => p.thumbnail?.source && p.fullurl);
  if (!hit?.thumbnail || !hit.fullurl) return null;

  return { imageUrl: hit.thumbnail.source, pageUrl: hit.fullurl, title: hit.title };
}

/**
 * Flygplan i listan slas upp pa exakta artiklar. Saknas det i listan, eller
 * artiklarna saknar bild, faller vi tillbaka pa en fritextsokning.
 */
export async function findAircraftImage(
  rawName: string,
): Promise<AircraftImage | null> {
  const entry = findAircraft(rawName);
  if (entry) {
    const exact = await imageByTitles(entry.wiki);
    if (exact) return exact;
  }
  return imageBySearch(entry?.name ?? rawName);
}
