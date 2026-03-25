"use client";

import React from "react";
import Image from "next/image";

export type PGPlace = {
  id?: string;
  name: string | null;
  category: string | null;
  address: string | null;
  contact_number: string | null;
  map_link: string | null;
  Place_category: string | null;
};

export default function PGCard({ place }: { place: PGPlace }) {
  const name = place.name ?? "Unknown Place";
  const address = place.address ?? "Address not provided";
  const mapLink = place.map_link ?? "#";
  const contact = place.contact_number ?? "";

  const handleMapClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (mapLink && mapLink !== "#") {
      window.open(mapLink, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 flex overflow-hidden min-h-[140px] items-stretch pr-6 mb-4 gap-6">
      {/* Left Image Placeholder */}
      <div className="w-40 sm:w-56 bg-gray-200 relative flex-shrink-0">
        <Image 
          src="/sh.png" // placeholder
          alt="Room" 
          fill
          className="object-cover opacity-10" // Just a faint placeholder since we don't have actual images
        />
      </div>

      <div className="flex-1 py-5 flex flex-col justify-between">
        <div className="flex justify-between items-start w-full">
          <div>
            <h2 className="text-[#201B10] font-extrabold text-2xl leading-tight">
              {name}
            </h2>
            <div className="flex items-center text-[#7C7C7C] mt-2 font-medium">
              <span 
                onClick={handleMapClick}
                className="cursor-pointer hover:text-blue-500 inline-flex items-center transition"
                title="Open in Maps"
              >
                {/* Location Pin Icon */}
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              <span>{address}</span>
            </div>
          </div>
          
          <div className="flex items-center text-xs text-[#A8A8A8] font-bold cursor-pointer hover:text-gray-600 transition">
            <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2v4z" />
            </svg>
            REPORT
          </div>
        </div>

        <div className="flex justify-end items-center mt-4">
          {contact ? (
            <a
              href={`tel:${contact}`}
              className="bg-[#016A4A] text-white font-semibold flex items-center gap-2 px-6 py-2.5 rounded-xl hover:opacity-95 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call Now
            </a>
          ) : (
            <div className="bg-gray-200 text-gray-500 font-semibold flex items-center gap-2 px-6 py-2.5 rounded-xl">
              Call Now
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
