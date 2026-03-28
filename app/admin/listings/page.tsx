import React from 'react';

const Icons = {
  Download: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
  ),
  Plus: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
  ),
  Filter: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
  ),
  ChevronDown: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="6 9 12 15 18 9"/></svg>
  ),
  Storefront: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 3h18v4H3z"/><path d="M3 7l2 6h14l2-6"/><path d="M5 13v8h14v-8"/><path d="M10 13v8"/></svg>
  ),
  Building: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
  ),
  Utensils: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>
  ),
  Car: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a2 2 0 0 0-1.6-.8H9.3a2 2 0 0 0-1.6.8L5 11l-5.16.86a1 1 0 0 0-.84.99V16h3M4 16a2 2 0 1 0 4 0 2 2 0 1 0-4 0Zm12 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0Z"/></svg>
  ),
  House: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
  ),
  MoreVertical: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
  ),
  ChevronLeft: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="15 18 9 12 15 6"/></svg>
  ),
  ChevronRight: (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="9 18 15 12 9 6"/></svg>
  )
};

export default function AdminListingsPage() {
  return (
    <div className="min-h-screen bg-[#F8F9FB] p-6 sm:p-10 font-[family-name:var(--font-poppins)]">
      {/* Container */}
      <div className="max-w-[1200px] mx-auto">
        
        {/* Breadcrumb */}
        <div className="text-xs font-bold tracking-widest mb-3 text-[#6A7280]">
          ADMIN PANEL <span className="mx-1 text-[#BBC1C9]">&gt;</span> <span className="text-[#0049DB]">MANAGE LISTINGS</span>
        </div>

        {/* Title area */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1a1a1a]">Manage All Listings</h1>
            <div className="bg-[#E6F0FF] text-[#0049DB] px-4 py-1.5 rounded-full text-sm font-bold border border-[#CDE1FF]">
              142 Total
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#E0E4E8] rounded-xl text-sm font-bold text-[#333] hover:bg-gray-50 transition-colors shadow-sm">
              <Icons.Download className="w-4 h-4" />
              Export CSV
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0049DB] rounded-xl text-sm font-bold text-white hover:bg-[#003CB0] transition-colors shadow-sm">
              <Icons.Plus className="w-4 h-4" />
              New Listing
            </button>
          </div>
        </div>

        {/* Filters Box */}
        <div className="bg-white rounded-[20px] p-4 flex flex-col md:flex-row md:items-center justify-between shadow-sm mb-6">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0">
            <div className="flex items-center gap-2 bg-[#F6F4EE] px-5 py-2.5 rounded-xl text-sm font-bold text-[#7E7465]">
              <Icons.Filter className="w-4 h-4" />
              Filters:
            </div>
            <button className="flex items-center gap-2 bg-[#F6F4EE] px-5 py-2.5 rounded-xl text-sm font-bold text-[#4B443B] hover:bg-[#EAE5DF] transition-colors whitespace-nowrap">
              All Categories
              <Icons.ChevronDown className="w-4 h-4 text-[#8C8375] ml-1" />
            </button>
            <button className="flex items-center gap-2 bg-[#F6F4EE] px-5 py-2.5 rounded-xl text-sm font-bold text-[#4B443B] hover:bg-[#EAE5DF] transition-colors whitespace-nowrap">
              Status: Any
              <Icons.ChevronDown className="w-4 h-4 text-[#8C8375] ml-1" />
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold mt-2 md:mt-0 text-[#777] min-w-max px-2">
            SORTED BY: <span className="text-[#0049DB] flex items-center gap-1 cursor-pointer hover:underline">Recent First <Icons.ChevronDown className="w-3 h-3" /></span>
          </div>
        </div>

        {/* Main Table Card */}
        <div className="bg-white rounded-[20px] shadow-sm overflow-hidden mb-10">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-[#FAF7F2] text-[#867866] text-xs font-extrabold tracking-widest border-b border-[#F0EBE1]">
                  <th className="p-6">LISTING<br/>ID</th>
                  <th className="p-6">VENDOR NAME</th>
                  <th className="p-6">CATEGORY</th>
                  <th className="p-6">CONTACT</th>
                  <th className="p-6">STATUS</th>
                  <th className="p-6 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                
                {/* Row 1 */}
                <tr className="border-b border-[#F0EBE1] hover:bg-[#FDFCFB] transition-colors">
                  <td className="p-6 font-bold text-[#6A7280]">#TRN-<br/>001</td>
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-[#F0E5D3] text-[#0049DB] flex items-center justify-center shrink-0">
                        <Icons.Storefront className="w-5 h-5" />
                      </div>
                      <span className="font-extrabold text-[#111] text-base leading-tight">Guddu Bhaiya<br/>Auto</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="inline-flex items-center gap-2 bg-[#F6EFE5] text-[#514332] font-bold px-3.5 py-1.5 rounded-full text-xs">
                      <Icons.Car className="w-3.5 h-3.5" />
                      Cab/Auto
                    </div>
                  </td>
                  <td className="p-6 text-[#777] font-semibold">9876543210</td>
                  <td className="p-6">
                    <div className="inline-flex items-center gap-1.5 bg-[#E1F7E6] text-[#0E9034] font-extrabold px-3 py-1 rounded-full text-xs box-border tracking-wide uppercase">
                      <div className="w-2 h-2 rounded-full bg-[#0E9034]"></div>
                      LIVE
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <button className="text-[#A1A9B6] hover:text-[#555] p-2 transition-colors inline-block">
                      <Icons.MoreVertical className="w-5 h-5 mx-auto" />
                    </button>
                  </td>
                </tr>

                {/* Row 2 */}
                <tr className="border-b border-[#F0EBE1] hover:bg-[#FDFCFB] transition-colors">
                  <td className="p-6 font-bold text-[#6A7280]">#TRN-<br/>045</td>
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-[#E6F0FF] text-[#0049DB] flex items-center justify-center shrink-0">
                        <Icons.Building className="w-5 h-5" />
                      </div>
                      <span className="font-extrabold text-[#111] text-base leading-tight">Sunrise Boys<br/>PG</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="inline-flex items-center gap-2 bg-[#F6EFE5] text-[#514332] font-bold px-3.5 py-1.5 rounded-full text-xs">
                      <Icons.House className="w-3.5 h-3.5" />
                      Accommodation
                    </div>
                  </td>
                  <td className="p-6 text-[#777] font-semibold">9123456780</td>
                  <td className="p-6">
                    <div className="inline-flex items-center gap-1.5 bg-[#FFF2E0] text-[#D88408] font-extrabold px-3 py-1 rounded-full text-xs box-border tracking-wide uppercase">
                      <div className="w-2 h-2 rounded-full bg-[#D88408]"></div>
                      PENDING
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <button className="text-[#A1A9B6] hover:text-[#555] p-2 transition-colors inline-block">
                      <Icons.MoreVertical className="w-5 h-5 mx-auto" />
                    </button>
                  </td>
                </tr>

                {/* Row 3 */}
                <tr className="border-b border-[#F0EBE1] hover:bg-[#FDFCFB] transition-colors">
                  <td className="p-6 font-bold text-[#6A7280]">#TRN-<br/>088</td>
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-[#E6F0FF] text-[#0049DB] flex items-center justify-center shrink-0">
                        <Icons.Utensils className="w-5 h-5" />
                      </div>
                      <span className="font-extrabold text-[#111] text-base leading-tight">Spicy Sadda</span>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="inline-flex items-center gap-2 bg-[#F6EFE5] text-[#514332] font-bold px-3.5 py-1.5 rounded-full text-xs">
                      <Icons.Utensils className="w-3.5 h-3.5" />
                      Food & Tiffin
                    </div>
                  </td>
                  <td className="p-6 text-[#777] font-semibold">9988776655</td>
                  <td className="p-6">
                    <div className="inline-flex items-center gap-1.5 bg-[#FFEFEF] text-[#E02929] font-extrabold px-3 py-1 rounded-full text-xs box-border tracking-wide uppercase">
                      <div className="w-2 h-2 rounded-full bg-[#E02929]"></div>
                      SUSPENDED
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <button className="text-[#A1A9B6] hover:text-[#555] p-2 transition-colors inline-block">
                      <Icons.MoreVertical className="w-5 h-5 mx-auto" />
                    </button>
                  </td>
                </tr>

              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-6 text-sm font-bold text-[#6A7280]">
            <div>Showing 1-10 of 142 listings</div>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 flex items-center justify-center text-[#A1A9B6] hover:text-[#444] transition-colors rounded-lg">
                <Icons.ChevronLeft className="w-4 h-4" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-[#0049DB] text-white shadow-sm">1</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[#F2F4F7] transition-colors text-[#222]">2</button>
              <button className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[#F2F4F7] transition-colors text-[#222]">3</button>
              <div className="w-8 h-8 flex items-center justify-center tracking-widest px-1">...</div>
              <button className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[#F2F4F7] transition-colors text-[#222]">15</button>
              <button className="w-8 h-8 flex items-center justify-center text-[#A1A9B6] hover:text-[#444] transition-colors rounded-lg">
                <Icons.ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
