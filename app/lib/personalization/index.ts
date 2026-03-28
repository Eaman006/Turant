/**
 * Cross-sectional recommendation & personalization (category profile vector).
 *
 * Quick start:
 * 1. `npm install compromise`  ✅
 * 2. On search **submit**: `await trackSearch(query, "cabs")`
 * 3. Before `.map()`: `const sorted = getPersonalizedList(items, "cabs", extractCabWhitelistTags)`
 *
 * React integration (search bar — only on submit, not every keystroke):
 *
 * ```tsx
 * "use client";
 * import { trackSearch } from "@/app/lib/personalization";
 *
 * async function onSubmit(e: React.FormEvent) {
 *   e.preventDefault();
 *   const q = inputRef.current?.value ?? "";
 *   onSearch(q); // your existing filter state
 *   await trackSearch(q, "restaurants");
 * }
 * ```
 *
 * React integration (list — personalize then render):
 *
 * ```tsx
 * "use client";
 * import { useMemo, useState, useEffect } from "react";
 * import {
 *   getPersonalizedList,
 *   PROFILE_UPDATED_EVENT,
 *   extractCabWhitelistTags,
 * } from "@/app/lib/personalization";
 *
 * const [profileTick, setProfileTick] = useState(0);
 * useEffect(() => {
 *   const handler = () => setProfileTick((t) => t + 1);
 *   window.addEventListener(PROFILE_UPDATED_EVENT, handler);
 *   return () => window.removeEventListener(PROFILE_UPDATED_EVENT, handler);
 * }, []);
 *
 * const visible = useMemo(
 *   () => getPersonalizedList(rawItems, "cabs", extractCabWhitelistTags),
 *   [rawItems, profileTick]
 * );
 *
 * return visible.map((item) => <Card key={item.id} item={item} />);
 * ```
 */

export {
  CATEGORY_WHITELISTS,
  ALL_SECTION_NAMES,
  type SectionName,
} from "./categoryConfig";

export {
  loadUserProfile,
  persistUserProfile,
  createEmptyUserProfile,
  incrementProfileTag,
  USER_PROFILE_STORAGE_KEY,
  PROFILE_UPDATED_EVENT,
  type UserProfile,
} from "./userProfileVector";

export { trackSearch, matchWhitelistTag, normalizeQueryForWhitelist } from "./trackSearch";
export type { TrackSearchResult } from "./trackSearch";

export { getPersonalizedList, computeItemMatchScore } from "./getPersonalizedList";

export {
  extractCabWhitelistTags,
  extractPgHotelTagsFromPlace,
  extractRestaurantTagsFromPlace,
  extractSimpleFeatureTags,
  extractTagsForSection,
  type CabRowForTags,
} from "./tagExtractors";
