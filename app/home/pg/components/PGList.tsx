"use client";

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import PGCard, { PGPlace } from "./PGCard";

export default function PGList({
  activeCategory,
  searchTerm,
}: {
  activeCategory: string;
  searchTerm?: string;
}) {
  const [places, setPlaces] = useState<PGPlace[]>([]);
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
          .or('category.ilike.%PG%,category.ilike.%Hotel%');

        const { data, error } = await query;
        if (cancelled) return;

        if (error) {
          setErrorMsg(error.message ?? "Failed to load places.");
          setPlaces([]);
          return;
        }

        setPlaces((data ?? []) as PGPlace[]);
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
    if (activeCategory === "Boys PG") {
      categoryFiltered = places.filter(p => p.Place_category?.toLowerCase().includes("boys"));
    } else if (activeCategory === "Girls PG") {
      categoryFiltered = places.filter(p => p.Place_category?.toLowerCase().includes("girl"));
    } else if (activeCategory === "Hotel") {
      categoryFiltered = places.filter(p => p.Place_category?.toLowerCase().includes("hotel"));
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
          Loading places...
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
          <PGCard
            key={place.id ?? `${place.name ?? "place"}-${idx}`}
            place={place}
          />
        ))}
      </div>
    </div>
  );
}
