"use client";

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import CabDriverCard, { CabDriver } from "./CabDriverCard";

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
          .select("*");

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
    if (!searchTerm?.trim()) return drivers;
    const lowerTerm = searchTerm.toLowerCase();

    return drivers.filter((driver) => {
      return Object.values(driver).some((val) => {
        if (val && typeof val !== 'object') {
          return String(val).toLowerCase().includes(lowerTerm);
        }
        return false;
      });
    });
  }, [drivers, searchTerm]);

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

      {!loading && !errorMsg && filteredDrivers.length === 0 && (
        <div className="text-center py-6 text-gray-600 font-semibold">
          No drivers found.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 mt-4">
        {filteredDrivers.map((driver) => (
          <CabDriverCard
            key={
              driver.id ??
              `${driver.driver_name ?? "driver"}-${driver.phone_number ?? "phone"}`
            }
            driver={driver}
          />
        ))}
      </div>
    </div>
  );
}

