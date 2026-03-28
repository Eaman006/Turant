/**
 * Re-ranks listings using the stored user profile: higher scores for tags the user
 * has searched for (or that you increment elsewhere) float to the top.
 */

import type { SectionName } from "./categoryConfig";
import { CATEGORY_WHITELISTS } from "./categoryConfig";
import { loadUserProfile, type UserProfile } from "./userProfileVector";

/**
 * Normalize a tag coming from your DB (any casing/spacing) to compare with whitelist keys.
 */
function normalizeTagLabel(s: string): string {
  return s.trim().replace(/\s+/g, " ");
}

/**
 * Sum profile scores for every whitelist tag this item is tagged with.
 *
 * @param itemTags — labels extracted from the item (e.g. from `features` / `tags` / vehicle text)
 * @param sectionName — which vertical's whitelist to use
 * @param userProfile — optional in-memory profile; defaults to localStorage snapshot
 */
export function computeItemMatchScore(
  itemTags: string[],
  sectionName: SectionName,
  userProfile?: UserProfile
): number {
  const profile = userProfile ?? loadUserProfile();

  let score = 0;
  for (const raw of itemTags) {
    const label = normalizeTagLabel(raw);
    if (!label) continue;

    // Find canonical whitelist key (case-insensitive)
    const key = CATEGORY_WHITELISTS[sectionName].find(
      (w) => w.toLowerCase() === label.toLowerCase()
    );
    if (key) {
      score += profile[sectionName][key] ?? 0;
    }
  }

  return score;
}

/**
 * Returns a **new array** sorted by personalization score (desc), then original order for ties.
 *
 * @param getItemTags — you provide how to read tags from your row shape (DB fields differ per section)
 *
 * @example
 * const rows = getPersonalizedList(drivers, "cabs", (d) => extractCabTags(d));
 */
export function getPersonalizedList<T>(
  items: T[],
  sectionName: SectionName,
  getItemTags: (item: T) => string[],
  userProfile?: UserProfile
): T[] {
  if (!items.length) return [];

  const profile = userProfile ?? loadUserProfile();

  return items
    .map((item, index) => ({
      item,
      index,
      matchScore: computeItemMatchScore(
        getItemTags(item),
        sectionName,
        profile
      ),
    }))
    .sort((a, b) => {
      if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
      return a.index - b.index;
    })
    .map((row) => row.item);
}
