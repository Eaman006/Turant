/**
 * Persists the numeric user profile: one score per (section × whitelist tag).
 * Stored in localStorage so preferences survive refresh and new sessions.
 */

import {
  ALL_SECTION_NAMES,
  CATEGORY_WHITELISTS,
  type SectionName,
} from "./categoryConfig";

/** localStorage key — keep stable so users don't lose history on deploys */
export const USER_PROFILE_STORAGE_KEY = "turant_category_profile_v1";

/** Nested map: section → (canonical tag string → score) */
export type UserProfile = Record<SectionName, Record<string, number>>;

/** Fired on the window after any profile write so React lists can re-fetch / re-sort */
export const PROFILE_UPDATED_EVENT = "turant-category-profile-updated";

/**
 * Build a fresh profile with every whitelist tag set to 0.
 */
export function createEmptyUserProfile(): UserProfile {
  const profile = {} as UserProfile;
  for (const section of ALL_SECTION_NAMES) {
    const bucket: Record<string, number> = {};
    for (const tag of CATEGORY_WHITELISTS[section]) {
      bucket[tag] = 0;
    }
    profile[section] = bucket;
  }
  return profile;
}

/**
 * Load profile from localStorage, or create + persist a new empty one.
 * Safe to call from client components only (returns empty profile on server).
 */
export function loadUserProfile(): UserProfile {
  if (typeof window === "undefined") {
    return createEmptyUserProfile();
  }

  try {
    const raw = localStorage.getItem(USER_PROFILE_STORAGE_KEY);
    if (!raw) {
      const empty = createEmptyUserProfile();
      persistUserProfile(empty);
      return empty;
    }

    const parsed = JSON.parse(raw) as UserProfile;
    const base = createEmptyUserProfile();

    // Merge: ensures new tags added in CATEGORY_WHITELISTS get score 0
    for (const section of ALL_SECTION_NAMES) {
      for (const tag of CATEGORY_WHITELISTS[section]) {
        const v = parsed[section]?.[tag];
        base[section][tag] =
          typeof v === "number" && Number.isFinite(v) ? v : 0;
      }
    }
    return base;
  } catch {
    const empty = createEmptyUserProfile();
    persistUserProfile(empty);
    return empty;
  }
}

export function persistUserProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(profile));
  window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT));
}

/**
 * Increment one tag's score by `delta` (usually +1 from a tracked search).
 */
export function incrementProfileTag(
  section: SectionName,
  tag: string,
  delta = 1
): UserProfile {
  const profile = loadUserProfile();
  if (!(tag in profile[section])) {
    profile[section][tag] = 0;
  }
  profile[section][tag] += delta;
  persistUserProfile(profile);
  return profile;
}
