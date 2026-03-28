"use client";

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import MedicalCard, { MedicalPlace } from "./MedicalCard";
import { rankMedicalPlacesBySearch } from "@/app/lib/medicalTags";
import PersonalizedRecommendations from "@/app/Components/PersonalizedRecommendations";

export default function MedicalList({
  activeCategory,
  searchTerm,
}: {
  activeCategory: string;
  searchTerm?: string;
}) {
  const [places, setPlaces] = useState<MedicalPlace[]>([]);
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
          .ilike("category", "%Pharmacy%");

        const { data, error } = await query;
        if (cancelled) return;

        if (error) {
          setErrorMsg(error.message ?? "Failed to load places.");
          setPlaces([]);
          return;
        }

        setPlaces((data ?? []) as MedicalPlace[]);
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
    if (activeCategory === "24/7 Pharmacy") {
      categoryFiltered = places.filter(
        (p) => p.Place_category?.toLowerCase().trim() === "24/7 pharmacy"
      );
    } else if (activeCategory === "Clinics") {
      categoryFiltered = places.filter(
        (p) => p.Place_category?.toLowerCase().trim() === "clinics"
      );
    } else if (activeCategory === "Pathology Labs") {
      categoryFiltered = places.filter(
        (p) => p.Place_category?.toLowerCase().trim() === "pathology labs"
      );
    } else if (activeCategory === "First Aid") {
      categoryFiltered = places.filter(
        (p) => p.Place_category?.toLowerCase().trim() === "first aid"
      );
    }

    const query = searchTerm?.trim();
    if (!query) return categoryFiltered;

    return rankMedicalPlacesBySearch(categoryFiltered, query);
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
        sectionName="pharmacy"
        data={filteredPlaces}
        visible={!searchTerm?.trim()}
        renderItem={(place) => (
          <MedicalCard
            key={place.id ?? `${place.name ?? "place"}-rec`}
            place={place}
          />
        )}
      />

      <div className="grid grid-cols-1 mt-4">
        {filteredPlaces.map((place, idx) => (
          <MedicalCard
            key={place.id ?? `${place.name ?? "place"}-${idx}`}
            place={place}
          />
        ))}
      </div>
    </div>
  );
}
