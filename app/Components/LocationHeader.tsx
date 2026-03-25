// components/LocationHeader.tsx

interface LocationHeaderProps {
  locationName: string;
}

export default function LocationHeader({ locationName }: LocationHeaderProps) {
  return (
    // The background color closely matches the cream/off-white in your image
    <div className="flex items-center gap-3 px-2 py-2 bg-[#fffaf5] ">
      
      {/* Blue Map Pin Icon */}
      <div className="flex-shrink-0 text-[#0047FF]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-7 h-7"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
          />
        </svg>
      </div>

      {/* Text Content */}
      <div className="flex flex-col">
        <span className="text-[11px] font-bold tracking-widest text-[#8c7366] uppercase mb-0.5">
          Current Location
        </span>
        <span className="text-sm font-bold text-[#1a1a1a]">
          {locationName || "Detecting..."}
        </span>
      </div>
      
    </div>
  );
}