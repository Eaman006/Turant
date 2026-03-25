"use client";

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import RestaurantCard, { RestaurantPlace } from "./RestaurantCard";

export default function RestaurantList({
  activeCategory,
  searchTerm,
}: {
  activeCategory: string;
  searchTerm?: string;
}) {
  const [places, setPlaces] = useState<RestaurantPlace[]>([]);
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
          .ilike("category", "%Restaurant%");

        const { data, error } = await query;
        if (cancelled) return;

        if (error) {
          setErrorMsg(error.message ?? "Failed to load places.");
          setPlaces([]);
          return;
        }

        setPlaces((data ?? []) as RestaurantPlace[]);
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
    if (activeCategory === "Family Restaurant") {
      categoryFiltered = places.filter(
        (p) => p.Place_category?.toLowerCase().trim() === "family restaurant"
      );
    } else if (activeCategory === "Restaurant") {
      categoryFiltered = places.filter(
        (p) => p.Place_category?.toLowerCase().trim() === "restaurant"
      );
    } else if (activeCategory === "Chinese Food") {
      // Prompt explicitly said: "Chineese Food option as Chineese"
      categoryFiltered = places.filter(
        (p) => p.Place_category?.toLowerCase().trim() === "chinese"
      );
    } else if (activeCategory === "Cafe") {
      categoryFiltered = places.filter(
        (p) => p.Place_category?.toLowerCase().trim() === "cafe"
      );
    }

    if (!searchTerm?.trim()) return categoryFiltered;
    const lowerTerm = searchTerm.toLowerCase();

    return categoryFiltered.filter((place) => {
      return Object.values(place).some((val) => {
        if (val && typeof val !== "object") {
          return String(val).toLowerCase().includes(lowerTerm);
        }
        return false;
      });
    });
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

      <div className="grid grid-cols-1 mt-4">
        {filteredPlaces.map((place, idx) => (
          <RestaurantCard
            key={place.id ?? `${place.name ?? "place"}-${idx}`}
            place={place}
          />
        ))}
      </div>
    </div>
  );
}
