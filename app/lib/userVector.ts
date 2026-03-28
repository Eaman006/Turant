const STORAGE_KEY = "turant_user_vector_v1";

export type UserVector = Map<string, number>;

function parseStored(raw: string | null): UserVector {
  const map = new Map<string, number>();
  if (!raw) return map;
  try {
    const obj = JSON.parse(raw) as Record<string, number>;
    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === "number" && Number.isFinite(v)) map.set(k, v);
    }
  } catch {
    /* ignore */
  }
  return map;
}

export function loadUserVector(): UserVector {
  if (typeof window === "undefined") return new Map();
  return parseStored(localStorage.getItem(STORAGE_KEY));
}

function persistUserVector(map: UserVector): void {
  if (typeof window === "undefined") return;
  const obj: Record<string, number> = {};
  map.forEach((v, k) => {
    obj[k] = v;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
}

/**
 * Merge score deltas into the persisted user interest profile (e.g. restaurant tag IDs).
 */
export function updateUserVector(deltas: Record<string, number>): void {
  const map = loadUserVector();
  for (const [k, v] of Object.entries(deltas)) {
    if (!Number.isFinite(v)) continue;
    map.set(k, (map.get(k) ?? 0) + v);
  }
  persistUserVector(map);
}

/** Key used for a normalized restaurant amenity tag (e.g. `indian food` → `restaurant_tag_indian_food`). */
export function restaurantVectorKeyForNormalizedTag(normalizedTag: string): string {
  return `restaurant_tag_${normalizedTag.replace(/\s+/g, "_")}`;
}

export function incrementRestaurantVectorFromTags(
  normalizedTags: string[],
  weight = 1
): void {
  const deltas: Record<string, number> = {};
  for (const t of normalizedTags) {
    if (!t) continue;
    const key = restaurantVectorKeyForNormalizedTag(t);
    deltas[key] = (deltas[key] ?? 0) + weight;
  }
  updateUserVector(deltas);
}

/** Key for grocery / daily-needs tags (e.g. `general store` → `grocery_tag_general_store`). */
export function groceryVectorKeyForNormalizedTag(normalizedTag: string): string {
  return `grocery_tag_${normalizedTag.replace(/\s+/g, "_")}`;
}

export function incrementGroceryVectorFromTags(
  normalizedTags: string[],
  weight = 1
): void {
  const deltas: Record<string, number> = {};
  for (const t of normalizedTags) {
    if (!t) continue;
    const key = groceryVectorKeyForNormalizedTag(t);
    deltas[key] = (deltas[key] ?? 0) + weight;
  }
  updateUserVector(deltas);
}

/** Pharmacies & clinics tags (e.g. `delivery` → `medical_tag_delivery`). */
export function medicalVectorKeyForNormalizedTag(normalizedTag: string): string {
  return `medical_tag_${normalizedTag.replace(/\s+/g, "_")}`;
}

export function incrementMedicalVectorFromTags(
  normalizedTags: string[],
  weight = 1
): void {
  const deltas: Record<string, number> = {};
  for (const t of normalizedTags) {
    if (!t) continue;
    const key = medicalVectorKeyForNormalizedTag(t);
    deltas[key] = (deltas[key] ?? 0) + weight;
  }
  updateUserVector(deltas);
}
