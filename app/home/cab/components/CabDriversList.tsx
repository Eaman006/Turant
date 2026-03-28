"use client";

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import CabDriverCard, { CabDriver } from "./CabDriverCard";
import { diceCoefficient } from "@/app/lib/similarity";
import Fuse from "fuse.js";
import {
  extractCabWhitelistTags,
  getPersonalizedList,
  PROFILE_UPDATED_EVENT,
} from "@/app/lib/personalization";

type DriverWithScore = CabDriver & { matchScore: number };

export default function CabDriversList({
  vehicleType,
  searchTerm,
}: {
  vehicleType?: string | null;
  searchTerm?: string;
}) {
  const [drivers, setDrivers] = useState<CabDriver[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lastSearchQuery, setLastSearchQuery] = useState<string>("");
  /** Bumps when the category profile vector changes so re-ranking runs again. */
  const [profileTick, setProfileTick] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("turant_last_search") || "";
      setLastSearchQuery(stored.trim());
    }
  }, []);

  useEffect(() => {
    const onProfile = () => setProfileTick((t) => t + 1);
    if (typeof window === "undefined") return;
    window.addEventListener(PROFILE_UPDATED_EVENT, onProfile);
    return () => window.removeEventListener(PROFILE_UPDATED_EVENT, onProfile);
  }, []);

  const filterVehicleType = useMemo(() => {
    const v = vehicleType?.trim();
    return v ? v : null;
  }, [vehicleType]);

  useEffect(() => {
    let cancelled = false;

    async function fetchDrivers() {
      setLoading(true);
      setErrorMsg(null);

      try {
        let query = supabase
          .from("Cabs")
          .select("*")
          .order("driver_name", { ascending: true });

        if (filterVehicleType) {
          if (filterVehicleType === "Shared Auto") {
            query = query.ilike("vehicle_type", "%auto%");
          } else if (filterVehicleType === "Private Cab") {
            query = query.ilike("vehicle_type", "%cab%");
          } else {
            query = query.eq("vehicle_type", filterVehicleType);
          }
        }

        const { data, error } = await query;
        if (cancelled) return;

        if (error) {
          setErrorMsg(error.message ?? "Failed to load drivers.");
          setDrivers([]);
          return;
        }

        setDrivers((data ?? []) as CabDriver[]);
      } catch (e) {
        if (cancelled) return;
        const message = e instanceof Error ? e.message : String(e);
        setErrorMsg(message ?? "Failed to load drivers.");
        setDrivers([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchDrivers();
    return () => {
      cancelled = true;
    };
  }, [filterVehicleType]);

  const filteredDrivers = useMemo(() => {
    const query = searchTerm?.trim();
    if (!query) return drivers;

    const fuse = new Fuse(drivers, {
      threshold: 0.3,
      keys: ["driver_name", "vehicle", "vehicle_type", "description", "phone_number", "actual_rating"],
    });

    return fuse.search(query).map((result) => result.item);
  }, [drivers, searchTerm]);

  /** Re-order by user profile scores (whitelist tags on vehicle / type / description). */
  const personalizedDrivers = useMemo(
    () =>
      getPersonalizedList(
        filteredDrivers,
        "cabs",
        extractCabWhitelistTags
      ),
    [filteredDrivers, profileTick]
  );

  const recommendedDrivers = useMemo<DriverWithScore[]>(() => {
    const query = lastSearchQuery?.trim();
    if (!query) return [];

    return drivers
      .map((driver) => {
        const name = driver.driver_name ?? "";
        const carModel = driver.vehicle ?? "";
        const description = (driver.description ?? driver.vehicle_type ?? "");

        const score = Math.max(
          diceCoefficient(name, query),
          diceCoefficient(carModel, query),
          diceCoefficient(description, query)
        );

        return { ...driver, matchScore: score };
      })
      .filter((driver) => driver.matchScore > 0.3)
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [drivers, lastSearchQuery]);

  const recommendedIds = useMemo(() => new Set(recommendedDrivers.map((d) => d.id ?? `${d.driver_name ?? ''}-${d.phone_number ?? ''}`)), [recommendedDrivers]);

  const allDrivers = useMemo(() => {
    return personalizedDrivers.filter((driver) => {
      const id = driver.id ?? `${driver.driver_name ?? ''}-${driver.phone_number ?? ''}`;
      return !recommendedIds.has(id);
    });
  }, [personalizedDrivers, recommendedIds]);

  return (
    <div className="px-2 pb-10">
      {loading && (
        <div className="text-center py-6 text-gray-600 font-semibold">
          Loading drivers...
        </div>
      )}

      {errorMsg && !loading && (
        <div className="text-center py-6 text-red-600 font-semibold">
          {errorMsg}
        </div>
      )}

      {!loading && !errorMsg && personalizedDrivers.length === 0 && (
        <div className="text-center py-6 text-gray-600 font-semibold">
          No drivers found.
        </div>
      )}

      {recommendedDrivers.length > 0 && (
        <div className="rounded-2xl bg-blue-50 p-4 mb-4 border border-blue-100">
          <div className="mb-3 text-lg font-bold text-blue-800">Recommended for You</div>
          <div className="grid grid-cols-1 gap-4">
            {recommendedDrivers.map((driver) => (
              <CabDriverCard
                key={driver.id ?? `${driver.driver_name ?? "driver"}-${driver.phone_number ?? "phone"}`}
                driver={driver}
                matchScore={driver.matchScore}
              />
            ))}
          </div>
        </div>
      )}

      <div className="text-sm font-semibold mb-2">All Drivers</div>
      <div className="grid grid-cols-1 gap-4 mt-0">
        {allDrivers.map((driver) => (
          <CabDriverCard
            key={driver.id ?? `${driver.driver_name ?? "driver"}-${driver.phone_number ?? "phone"}`}
            driver={driver}
          />
        ))}
      </div>
    </div>
  );
}

