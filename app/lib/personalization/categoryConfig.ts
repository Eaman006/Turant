/**
 * Cross-section category whitelists for personalization.
 * Only these labels are tracked in the user profile vector and used for re-ranking.
 * (Beginner note: edit these arrays when your product taxonomy changes.)
 */

/** Which vertical / page this profile bucket belongs to */
export type SectionName =
  | "cabs"
  | "pgHotels"
  | "restaurants"
  | "grocery"
  | "pharmacy";

/**
 * Strict tag whitelists per section.
 * Keys must match `SectionName`; values are the exact strings we match against
 * (after normalizing spaces + case in the tracker).
 */
export const CATEGORY_WHITELISTS: Record<SectionName, readonly string[]> = {
  cabs: ["Ertiga", "Eeco", "Swift", "WagonR", "Auto", "Exter"],

  pgHotels: [
    "NON AC",
    "AC",
    "WIFI",
    "ONE BEDDED",
    "TWO BEDDED",
    "THREE BEDDED",
    "FOUR BEDDED",
    "OPTIONAL BREAKFAST",
    "FULLY FURNISHED",
    "KING BED",
    "DOUBLE BED",
    "FAMILY RESTAURANT",
    "QUEEN BED",
    "FARMHOUSE",
    "HOMESTAY",
  ],

  restaurants: [
    "INDIAN FOOD",
    "DINE-IN",
    "TAKE AWAY",
    "VEG",
    "DRIVE-THROUGH",
    "DELIVERY",
    "CHINESE FOOD",
    "NON VEG",
    "WRAPS",
    "PIZZA",
    "SNACKS",
    "TEA",
    "SWEETS",
  ],

  grocery: ["GENERAL STORE", "GROCERIES"],

  pharmacy: [
    "GENERAL MEDICINES",
    "AGRICULTURAL CHEMICALS",
    "VETERNARY MEDICINES",
    "DELIVERY",
  ],
} as const;

/** All section keys (handy for loops when initializing the vector). */
export const ALL_SECTION_NAMES = Object.keys(CATEGORY_WHITELISTS) as SectionName[];
