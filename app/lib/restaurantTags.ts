import Fuse from "fuse.js";
import { loadUserVector, restaurantVectorKeyForNormalizedTag } from "@/app/lib/userVector";

/** Cuisine + service / food-type tags for restaurants (normalized keys are lowercase). */
export const RESTAURANT_CANONICAL_TAGS = [
  "INDIAN FOOD",
  "CHINESE FOOD",
  "VEG",
  "NON VEG",
  "DINE-IN",
  "TAKE AWAY",
  "DRIVE-THROUGH",
  "DELIVERY",
  "WRAPS",
  "PIZZA",
  "SNACKS",
  "TEA",
  "SWEETS",
] as const;

export function normalizeTagString(s: string): string {
  return s.trim().replace(/\s+/g, " ").toLowerCase();
}

const NORMALIZED_CANONICAL = new Map<string, string>(
  RESTAURANT_CANONICAL_TAGS.map((t) => [normalizeTagString(t), t])
);

export function normalizeDbTagToCanonical(raw: string): string {
  const n = normalizeTagString(raw);
  return NORMALIZED_CANONICAL.get(n) ?? n;
}

export function getNormalizedRestaurantTags(place: {
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

export type RestaurantSearchRankable = {
  id?: string;
  name: string | null;
  category: string | null;
  Place_category: string | null;
  address: string | null;
  features?: string[] | null;
  tags?: string[] | null;
};

/** Veg-focused search: VEG tag, or Indian/Chinese cuisine without NON VEG (veg-friendly by omission). */
function matchesVegSearch(tags: string[]): boolean {
  const set = new Set(tags);
  if (set.has("veg")) return true;
  const cuisine =
    set.has("indian food") || set.has("chinese food");
  const hasNonVeg = set.has("non veg");
  if (cuisine && !hasNonVeg) return true;
  return false;
}

function isVegIntentQuery(normalizedQuery: string, rawQuery: string): boolean {
  if (normalizedQuery === "veg") return true;
  if (normalizedQuery.includes("vegetarian")) return true;
  const tagFuse = new Fuse(
    RESTAURANT_CANONICAL_TAGS.map((tag) => ({ tag })),
    { keys: ["tag"], threshold: 0.38, ignoreLocation: true }
  );
  const hits = tagFuse.search(rawQuery.trim(), { limit: 5 });
  return hits.some((h) => normalizeTagString(h.item.tag) === "veg");
}

/**
 * Tag-first ranking (exact phrase on canonical tags), then fuzzy tags, then name/address.
 * "INDIAN FOOD" beats a loose "food" hit in other fields via tag weights.
 * Optional user-vector boost for logged interactions.
 */
export function rankRestaurantsBySearch(
  places: RestaurantSearchRankable[],
  rawQuery: string
): RestaurantSearchRankable[] {
  const q = normalizeTagString(rawQuery);
  if (!q) return places;

  const userVec = loadUserVector();

  const exactNorm = RESTAURANT_CANONICAL_TAGS.map((t) => normalizeTagString(t)).find(
    (n) => n === q
  );

  const tagFuse = new Fuse(
    RESTAURANT_CANONICAL_TAGS.map((tag) => ({ tag })),
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

  const vegIntent = isVegIntentQuery(q, rawQuery);

  const scored = places.map((p) => {
    const k = itemKey(p);
    const tags = getNormalizedRestaurantTags(p);

    if (vegIntent && !matchesVegSearch(tags)) {
      return { place: p, score: -1, key: k, hasFieldHit: false, drop: true as const };
    }

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

    if (
      vegIntent &&
      matchesVegSearch(tags) &&
      score < WEIGHT_FUZZY_TAG
    ) {
      score += WEIGHT_FUZZY_TAG;
    }

    const fs = fieldScoreByKey.get(k);
    if (fs !== undefined) {
      score += Math.max(0, 1 - fs);
    }

    let vecBoost = 0;
    for (const t of tags) {
      const vk = restaurantVectorKeyForNormalizedTag(t);
      const w = userVec.get(vk) ?? 0;
      vecBoost += w;
    }
    score += Math.min(WEIGHT_USER_VECTOR, vecBoost * 2);

    return {
      place: p,
      score,
      key: k,
      hasFieldHit: fs !== undefined,
      drop: false as const,
    };
  });

  const matched = scored.filter((row) => {
    if (row.drop) return false;
    return (
      row.score >= WEIGHT_EXACT_TAG ||
      row.score >= WEIGHT_FUZZY_TAG ||
      row.hasFieldHit
    );
  });

  matched.sort((a, b) => b.score - a.score);
  return matched.map((row) => row.place);
}

/** Labels for chips (canonical casing from the fixed list when possible). */
export function getDisplayRestaurantTags(place: RestaurantSearchRankable): string[] {
  const raw = [...(place.tags ?? []), ...(place.features ?? [])];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const r of raw) {
    if (r == null || typeof r !== "string") continue;
    const canon = normalizeDbTagToCanonical(r);
    const key = normalizeTagString(canon);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    const display =
      NORMALIZED_CANONICAL.get(key) ?? canon.toUpperCase();
    out.push(display);
  }
  return out;
}
