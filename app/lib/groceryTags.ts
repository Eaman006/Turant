import Fuse from "fuse.js";
import { groceryVectorKeyForNormalizedTag, loadUserVector } from "@/app/lib/userVector";

/** Fixed tags for Local Grocery & Daily Needs */
export const GROCERY_CANONICAL_TAGS = ["GENERAL STORE", "GROCERIES"] as const;

export function normalizeTagString(s: string): string {
  return s.trim().replace(/\s+/g, " ").toLowerCase();
}

const NORMALIZED_CANONICAL = new Map<string, string>(
  GROCERY_CANONICAL_TAGS.map((t) => [normalizeTagString(t), t])
);

export function normalizeDbTagToCanonical(raw: string): string {
  const n = normalizeTagString(raw);
  return NORMALIZED_CANONICAL.get(n) ?? n;
}

export function getNormalizedGroceryTags(place: {
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

const WEIGHT_EXACT_TAG = 1_000_000;
const WEIGHT_FUZZY_TAG = 10_000;
const WEIGHT_USER_VECTOR = 50;

export type GrocerySearchRankable = {
  id?: string;
  name: string | null;
  category: string | null;
  Place_category: string | null;
  address: string | null;
  features?: string[] | null;
  tags?: string[] | null;
};

export function rankGroceryPlacesBySearch<T extends GrocerySearchRankable>(
  places: T[],
  rawQuery: string
): T[] {
  const q = normalizeTagString(rawQuery);
  if (!q) return places;

  const userVec = loadUserVector();

  const exactNorm = GROCERY_CANONICAL_TAGS.map((t) => normalizeTagString(t)).find(
    (n) => n === q
  );

  const tagFuse = new Fuse(
    GROCERY_CANONICAL_TAGS.map((tag) => ({ tag })),
    { keys: ["tag"], threshold: 0.42, ignoreLocation: true }
  );
  const fuzzyTagHits = tagFuse.search(rawQuery.trim(), { limit: 10 });
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
    const tags = getNormalizedGroceryTags(p);

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

    let vecBoost = 0;
    for (const t of tags) {
      const vk = groceryVectorKeyForNormalizedTag(t);
      vecBoost += userVec.get(vk) ?? 0;
    }
    score += Math.min(WEIGHT_USER_VECTOR, vecBoost * 2);

    return {
      place: p,
      score,
      key: k,
      hasFieldHit: fs !== undefined,
    };
  });

  const matched = scored.filter(
    (row) =>
      row.score >= WEIGHT_EXACT_TAG ||
      row.score >= WEIGHT_FUZZY_TAG ||
      row.hasFieldHit
  );

  matched.sort((a, b) => b.score - a.score);
  return matched.map((row) => row.place);
}

export function getDisplayGroceryTags(place: GrocerySearchRankable): string[] {
  const raw = [...(place.tags ?? []), ...(place.features ?? [])];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const r of raw) {
    if (r == null || typeof r !== "string") continue;
    const canon = normalizeDbTagToCanonical(r);
    const key = normalizeTagString(canon);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    const display = NORMALIZED_CANONICAL.get(key) ?? canon.toUpperCase();
    out.push(display);
  }
  return out;
}
