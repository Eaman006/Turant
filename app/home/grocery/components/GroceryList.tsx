"use client";

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import GroceryCard, { GroceryPlace } from "./GroceryCard";
import { rankGroceryPlacesBySearch } from "@/app/lib/groceryTags";
import PersonalizedRecommendations from "@/app/Components/PersonalizedRecommendations";

export default function GroceryList({
  activeCategory,
  searchTerm,
}: {
  activeCategory: string;
  searchTerm?: string;
}) {
  const [places, setPlaces] = useState<GroceryPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchPlaces() {
      setLoading(true);
      setErrorMsg(null);

      try {
        let query = supabase
          .from("places")
          .select("*")
          .ilike("category", "%Grocery%");

        const { data, error } = await query;
        if (cancelled) return;

        if (error) {
          setErrorMsg(error.message ?? "Failed to load places.");
          setPlaces([]);
          return;
        }

        setPlaces((data ?? []) as GroceryPlace[]);
      } catch (e) {
        if (cancelled) return;
        const message = e instanceof Error ? e.message : String(e);
        setErrorMsg(message ?? "Failed to load places.");
        setPlaces([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchPlaces();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredPlaces = useMemo(() => {
    let categoryFiltered = places;
    if (activeCategory === "Kirana Stores") {
      categoryFiltered = places.filter(
        (p) => p.Place_category?.toLowerCase().trim() === "kirana stores"
      );
    } else if (activeCategory === "Fresh Veggies") {
      categoryFiltered = places.filter(
        (p) => p.Place_category?.toLowerCase().trim() === "fresh veggies"
      );
    } else if (activeCategory === "Water Suppliers") {
      categoryFiltered = places.filter(
        (p) => p.Place_category?.toLowerCase().trim() === "water suppliers"
      );
    } else if (activeCategory === "Stationery") {
      categoryFiltered = places.filter(
        (p) => p.Place_category?.toLowerCase().trim() === "stationery"
      );
    }

    const query = searchTerm?.trim();
    if (!query) return categoryFiltered;

    return rankGroceryPlacesBySearch(categoryFiltered, query);
  }, [places, activeCategory, searchTerm]);

  return (
    <div className="pb-10">
      {loading && (
        <div className="text-center py-6 text-gray-600 font-semibold">
          Loading...
        </div>
      )}

      {errorMsg && !loading && (
        <div className="text-center py-6 text-red-600 font-semibold">
          {errorMsg}
        </div>
      )}

      {!loading && !errorMsg && filteredPlaces.length === 0 && (
        <div className="text-center py-6 text-gray-600 font-semibold">
          No matches found.
        </div>
      )}

      <PersonalizedRecommendations
        sectionName="grocery"
        data={filteredPlaces}
        visible={!searchTerm?.trim()}
        renderItem={(place) => (
          <GroceryCard
            key={place.id ?? `${place.name ?? "place"}-rec`}
            place={place}
          />
        )}
      />

      <div className="grid grid-cols-1 mt-4">
        {filteredPlaces.map((place, idx) => (
          <GroceryCard
            key={place.id ?? `${place.name ?? "place"}-${idx}`}
            place={place}
          />
        ))}
      </div>
    </div>
  );
}
