"use client";

import React from "react";

export type CabDriver = {
  driver_name: string | null;
  phone_number: string | null;
  vehicle_type: string | null;
  id: string | null;
};

function getInitials(name: string | null) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "?";
  const second = parts.length > 1 ? parts[parts.length - 1]?.[0] : "";
  return (first + second).toUpperCase();
}

export default function CabDriverCard({ driver }: { driver: CabDriver }) {
  const driverName = driver.driver_name ?? "Unknown driver";
  const vehicleType = driver.vehicle_type ?? "—";
  const phone = driver.phone_number ?? "";
  const initials = getInitials(driver.driver_name);

  const callHref = phone ? `tel:${phone}` : undefined;

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-full bg-[#EDE1CF99] flex items-center justify-center font-bold text-[#201B10]">
          {initials}
        </div>

        <div className="min-w-0">
          <div className="text-[#201B10] font-extrabold text-lg leading-tight truncate">
            {driverName}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {vehicleType}
          </div>
          {phone ? (
            <div className="text-sm text-gray-600 mt-1 truncate">
              {phone}
            </div>
          ) : (
            <div className="text-sm text-gray-600 mt-1">Phone not available</div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="text-xs font-semibold text-[#0049DB] bg-[#EDE1CF99] px-3 py-1 rounded-full">
          Verified driver
        </div>
        {callHref ? (
          <a
            href={callHref}
            className="bg-[#0049DB] text-white font-semibold px-6 py-2 rounded-xl hover:opacity-95 transition"
          >
            Call Now
          </a>
        ) : (
          <div className="bg-gray-200 text-gray-500 font-semibold px-6 py-2 rounded-xl">
            Call Now
          </div>
        )}
      </div>
    </div>
  );
}

