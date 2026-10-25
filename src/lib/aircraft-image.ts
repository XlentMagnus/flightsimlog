import "server-only";

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

/** Soker Wikipedia efter flygplanet och returnerar forsta traffen med bild. */
export async function findAircraftImage(
  rawName: string,
): Promise<AircraftImage | null> {
  const name = cleanAircraftName(rawName);
  if (name.length < 2) return null;

  const params = new URLSearchParams({
    action: "query",
    format: "json",
    generator: "search",
    gsrsearch: `${name} aircraft`,
    gsrnamespace: "0",
    gsrlimit: "5",
    prop: "pageimages|info",
    piprop: "thumbnail",
    pithumbsize: "900",
    inprop: "url",
  });

  const res = await fetch(`https://en.wikipedia.org/w/api.php?${params}`, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
    next: { revalidate: 60 * 60 * 24 * 7 },
  });
  if (!res.ok) return null;

  const json = (await res.json()) as {
    query?: { pages?: Record<string, WikiPage> };
  };
  const pages = Object.values(json.query?.pages ?? {}).sort(
    (a, b) => (a.index ?? 99) - (b.index ?? 99),
  );

  const hit = pages.find((p) => p.thumbnail?.source && p.fullurl);
  if (!hit?.thumbnail || !hit.fullurl) return null;

  return {
    imageUrl: hit.thumbnail.source,
    pageUrl: hit.fullurl,
    title: hit.title,
  };
}
