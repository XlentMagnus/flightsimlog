// Ren logik utan beroenden, sa att den kan testas separat.

export type WikiPage = {
  title: string;
  fullurl?: string;
  missing?: boolean | string;
  thumbnail?: { source: string };
};

export type WikiTitlesResponse = {
  query?: {
    normalized?: { from: string; to: string }[];
    redirects?: { from: string; to: string }[];
    pages?: Record<string, WikiPage>;
  };
};

export type PickedImage = { imageUrl: string; pageUrl: string; title: string };

/**
 * Valjer den forsta av de efterfragade titlarna (i given ordning) som har en
 * bild, efter att normalisering och redirects har foljts.
 */
export function pickImageByTitles(
  requested: string[],
  json: WikiTitlesResponse,
): PickedImage | null {
  const q = json.query;
  if (!q?.pages) return null;

  const pages = Object.values(q.pages);
  const normalized = new Map((q.normalized ?? []).map((n) => [n.from, n.to]));
  const redirects = new Map((q.redirects ?? []).map((r) => [r.from, r.to]));

  for (const title of requested) {
    let current = normalized.get(title) ?? title;
    current = redirects.get(current) ?? current;

    const page = pages.find((p) => p.title === current);
    if (page && !page.missing && page.thumbnail?.source && page.fullurl) {
      return {
        imageUrl: page.thumbnail.source,
        pageUrl: page.fullurl,
        title: page.title,
      };
    }
  }
  return null;
}
