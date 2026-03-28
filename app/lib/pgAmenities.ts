import Fuse from "fuse.js";

/** Fixed amenity/tag vocabulary for PGs/Hotels (search index uses normalized forms). */
export const PG_AMENITY_CANONICAL_TAGS = [
  "NON AC",
  "AC",
  "DOUBLE BED",
  "WIFI",
  "ONE BEDDED",
  "TWO BEDDED",
  "THREE BEDDED",
  "FOUR BEDDED",
  "OPTIONAL BREAKFAST",
  "FULLY FURNISHED",
  "KING BED",
  "FAMILY RESTAURANT",
  "QUEEN BED",
  "FARMHOUSE",
  "HOMESTAY",
] as const;

/** Collapse spaces, trim, lowercase — single phrase unit for comparison. */
export function normalizeTagString(s: string): string {
  return s.trim().replace(/\s+/g, " ").toLowerCase();
}

const NORMALIZED_CANONICAL = new Map<string, string>(
  PG_AMENITY_CANONICAL_TAGS.map((t) => [normalizeTagString(t), t])
);

/**
 * Map DB values like "  Double Bed  " or "double bed" onto the canonical normalized key.
 * Unknown tags are kept as normalized free text for display/search.
 */
export function normalizeDbTagToCanonical(raw: string): string {
  const n = normalizeTagString(raw);
  return NORMALIZED_CANONICAL.get(n) ?? n;
}

export function getNormalizedItemTags(place: {
  features?: string[] | null;
  tags?: string[] | null;
}): string[] {
  const raw = [...(place.tags ?? []), ...(place.features ?? [])];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const r of raw) {
    if (r == null || typeof r !== "string") continue;
    const key = normalizeTagString(normalizeDbTagToCanonical(r));
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(key);
  }
  return out;
}

function itemKey(p: { id?: string; name: string | null; address: string | null }) {
  return p.id ?? `__${p.name ?? ""}-${p.address ?? ""}`;
}

export type PGSearchRankable = {
  id?: string;
  name: string | null;
  category: string | null;
  Place_category: string | null;
  address: string | null;
  features?: string[] | null;
  tags?: string[] | null;
};

const WEIGHT_EXACT_TAG = 1_000_000;
const WEIGHT_FUZZY_TAG = 10_000;

/**
 * Search + rank PG/Hotel rows: exact amenity phrase matches first, then fuzzy tag matches, then Fuse on other fields.
 * Multi-word tags are matched as whole phrases via Fuse on full canonical strings only (not word-split).
 */
export function rankPgPlacesBySearch<T extends PGSearchRankable>(
  places: T[],
  rawQuery: string
): T[] {
  const q = normalizeTagString(rawQuery);
  if (!q) return places;

  const exactNorm = PG_AMENITY_CANONICAL_TAGS.map((t) => normalizeTagString(t)).find(
    (n) => n === q
  );

  const tagFuse = new Fuse(
    PG_AMENITY_CANONICAL_TAGS.map((tag) => ({ tag })),
    { keys: ["tag"], threshold: 0.42, ignoreLocation: true }
  );
  const fuzzyTagHits = tagFuse.search(rawQuery.trim(), { limit: 20 });
  const fuzzyNormTagSet = new Set(
    fuzzyTagHits.map((r) => normalizeTagString(r.item.tag))
  );

  const fieldFuse = new Fuse(places, {
    keys: ["name", "category", "Place_category", "address"],
    threshold: 0.3,
    ignoreLocation: true,
    includeScore: true,
  });
  const fieldHits = fieldFuse.search(rawQuery.trim());

  const fieldScoreByKey = new Map<string, number>();
  for (const h of fieldHits) {
    const k = itemKey(h.item);
    const s = h.score ?? 1;
    if (!fieldScoreByKey.has(k)) fieldScoreByKey.set(k, s);
  }

  const scored = places.map((p) => {
    const k = itemKey(p);
    const tags = getNormalizedItemTags(p);

    let score = 0;
    if (exactNorm && tags.includes(exactNorm)) {
      score += WEIGHT_EXACT_TAG;
    } else {
      for (const t of tags) {
        if (fuzzyNormTagSet.has(t)) {
          score += WEIGHT_FUZZY_TAG;
          break;
        }
      }
    }

    const fs = fieldScoreByKey.get(k);
    if (fs !== undefined) {
      score += Math.max(0, 1 - fs);
    }

    return { place: p, score, key: k, hasFieldHit: fs !== undefined };
  });

  const matched = scored.filter(
    (row) =>
      row.score >= WEIGHT_EXACT_TAG ||
      row.score >= WEIGHT_FUZZY_TAG ||
      row.hasFieldHit
  );

  matched.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return 0;
  });

  return matched.map((row) => row.place);
}
