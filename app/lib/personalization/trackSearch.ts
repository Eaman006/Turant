/**
 * Uses `compromise` NLP to avoid learning from searches that look like
 * people names or place/organization names — only category-like queries update the vector.
 *
 * Install once in your project root:
 *   npm install compromise
 */

import { CATEGORY_WHITELISTS, type SectionName } from "./categoryConfig";
import { incrementProfileTag } from "./userProfileVector";

/** Normalize user text so it can match whitelist entries (trim + collapse spaces). */
export function normalizeQueryForWhitelist(q: string): string {
  return q.trim().replace(/\s+/g, " ");
}

/**
 * Case-insensitive match: returns the canonical whitelist string if `query` matches one entry.
 */
export function matchWhitelistTag(
  query: string,
  section: SectionName
): string | null {
  const normalized = normalizeQueryForWhitelist(query).toLowerCase();
  if (!normalized) return null;

  for (const tag of CATEGORY_WHITELISTS[section]) {
    if (tag.toLowerCase() === normalized) {
      return tag;
    }
  }
  return null;
}

/** Minimal typing for compromise's document view (people / places / orgs). */
type CompromiseDoc = {
  people: () => { length: number };
  places: () => { length: number };
  organizations: () => { length: number };
};

/**
 * Returns true if compromise thinks the query contains a person, place, or organization
 * span worth blocking (we skip vector updates in that case).
 *
 * Note: this is heuristic. Whitelist matches are applied *before* this runs so
 * searches like "Swift" (a car model) still count when they exactly match the dictionary.
 */
function queryLooksLikeNamedEntity(doc: CompromiseDoc): boolean {
  const people = doc.people();
  const places = doc.places();
  const orgs = doc.organizations();

  const n = people.length + places.length + orgs.length;

  return n > 0;
}

export type TrackSearchResult =
  | { updated: false; reason: "empty" | "entity_filtered" | "no_whitelist_match" }
  | { updated: true; section: SectionName; tag: string };

/**
 * Call this when the user **submits** a search (Enter / search button), not on every keystroke.
 *
 * 1) Empty → no-op
 * 2) Exact whitelist match for `sectionName` → increment score (+1), done
 * 3) Else run NLP; if it looks like a person/place/org → no-op
 * 4) Else try exact whitelist match again (same as step 2 for non-entity queries)
 *
 * Uses dynamic import so the NLP bundle loads only in the browser when needed.
 *
 * @example
 * await trackSearch("Swift", "cabs");
 */
export async function trackSearch(
  rawQuery: string,
  sectionName: SectionName
): Promise<TrackSearchResult> {
  const query = normalizeQueryForWhitelist(rawQuery);
  if (!query) {
    return { updated: false, reason: "empty" };
  }

  // Prefer dictionary: "Swift" should count even if NLP is noisy
  const direct = matchWhitelistTag(query, sectionName);
  if (direct) {
    incrementProfileTag(sectionName, direct, 1);
    return { updated: true, section: sectionName, tag: direct };
  }

  const nlp = (await import("compromise")).default;
  const doc = nlp(query) as CompromiseDoc;

  if (queryLooksLikeNamedEntity(doc)) {
    return { updated: false, reason: "entity_filtered" };
  }

  // Non-entity query that didn't exactly match whitelist (e.g. typo) — no increment
  return { updated: false, reason: "no_whitelist_match" };
}
