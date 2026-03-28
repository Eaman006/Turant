/**
 * Helpers that map real database rows → whitelist tag strings for a given section.
 * Adjust field names here if your Supabase schema differs.
 */

import { CATEGORY_WHITELISTS, type SectionName } from "./categoryConfig";

/** Same shape as cab rows from Supabase — kept local to avoid extra imports. */
export type CabRowForTags = {
  vehicle?: string | null;
  vehicle_type?: string | null;
  description?: string | null;
};

/** Cabs: look for model names inside vehicle / type / description text. */
export function extractCabWhitelistTags(driver: CabRowForTags): string[] {
  const haystack = `${driver.vehicle ?? ""} ${driver.vehicle_type ?? ""} ${driver.description ?? ""}`.toLowerCase();
  const found: string[] = [];
  for (const tag of CATEGORY_WHITELISTS.cabs) {
    if (haystack.includes(tag.toLowerCase())) {
      found.push(tag);
    }
  }
  return found;
}

/** PG / hotels: reuse normalized tags from your existing PG amenities helper. */
export function extractPgHotelTagsFromPlace(place: {
  features?: string[] | null;
  tags?: string[] | null;
}): string[] {
  const raw = [...(place.tags ?? []), ...(place.features ?? [])];
  return raw.filter((x): x is string => typeof x === "string" && x.trim().length > 0);
}

/** Restaurants: tags + features arrays. */
export function extractRestaurantTagsFromPlace(place: {
  features?: string[] | null;
  tags?: string[] | null;
}): string[] {
  const raw = [...(place.tags ?? []), ...(place.features ?? [])];
  return raw.filter((x): x is string => typeof x === "string" && x.trim().length > 0);
}

/** Grocery + pharmacy: same shape. */
export function extractSimpleFeatureTags(place: {
  features?: string[] | null;
  tags?: string[] | null;
}): string[] {
  const raw = [...(place.tags ?? []), ...(place.features ?? [])];
  return raw.filter((x): x is string => typeof x === "string" && x.trim().length > 0);
}

/**
 * Optional one-liner if you already know the section and item shape is `{ tags?, features? }`.
 */
export function extractTagsForSection(
  place: { features?: string[] | null; tags?: string[] | null },
  section: SectionName
): string[] {
  switch (section) {
    case "restaurants":
    case "grocery":
    case "pharmacy":
    case "pgHotels":
      return extractSimpleFeatureTags(place);
    default:
      return extractSimpleFeatureTags(place);
  }
}
