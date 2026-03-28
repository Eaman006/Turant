'use client';
import React, { useState } from 'react';

const Chatbot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      {/* Floating Button triggers when chat is closed */}
      {!isChatOpen && (
        <button 
          onClick={() => setIsChatOpen(true)} 
          className="fixed bottom-6 right-6 bg-[#FF5A25] hover:bg-[#E64A19] transition-all duration-300 p-4 rounded-full shadow-xl shadow-gray-600/40 border border-white/20 hover:shadow-2xl hover:shadow-gray-600/50 hover:-translate-y-1 cursor-pointer z-[100] flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bot">
            <path d="M12 8V4H8"/>
            <rect width="16" height="12" x="4" y="8" rx="2"/>
            <path d="M2 14h2"/>
            <path d="M20 14h2"/>
            <path d="M15 13v2"/>
            <path d="M9 13v2"/>
          </svg>
        </button>
      )}

      {/* Chat window overlay */}
      {isChatOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end items-end p-6 pointer-events-none sm:p-8">
          <div className="w-[380px] h-[650px] max-h-[90vh] bg-[#F9FAFB] flex flex-col rounded-2xl shadow-2xl overflow-hidden pointer-events-auto border border-gray-200">
            {/* Header */}
            <div className="bg-[#111827] text-white p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="bg-[#FF5A25] p-2 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bot">
                    <path d="M12 8V4H8"/>
                    <rect width="16" height="12" x="4" y="8" rx="2"/>
                    <path d="M2 14h2"/>
                    <path d="M20 14h2"/>
                    <path d="M15 13v2"/>
                    <path d="M9 13v2"/>
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg leading-tight">Turant Assist</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
                    <span className="text-gray-300 text-xs font-medium">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button className="text-gray-300 hover:text-white transition cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                  </svg>
                </button>
                <button 
                  onClick={() => setIsChatOpen(false)} 
                  className="text-gray-300 hover:text-white transition cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 font-[family-name:var(--font-poppins)] text-[15px]">
              
              {/* Bot Message 1 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-200 flex shrink-0 items-center justify-center mt-auto mb-2 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                    <circle cx="12" cy="5" r="2"></circle>
                    <path d="M12 7v4"></path>
                    <line x1="8" y1="16" x2="8" y2="16"></line>
                    <line x1="16" y1="16" x2="16" y2="16"></line>
                  </svg>
                </div>
                <div className="bg-white p-4 rounded-2xl rounded-bl-sm shadow-sm text-gray-800 leading-relaxed border border-gray-100">
                  Namaste! I am your Turant Sahayak. How can I help you today? I can find water suppliers, book autos, or locate the nearest medical clinic.
                </div>
              </div>

              {/* User Message 1 */}
              <div className="flex items-end justify-end">
                <div className="bg-[#FF5A25] p-4 rounded-2xl rounded-br-sm shadow-sm text-white max-w-[85%] leading-relaxed">
                  Which water suppliers are available near Rampur sector currently?
                </div>
              </div>

              {/* Bot Message 2 */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-200 flex shrink-0 items-center justify-center mt-auto mb-2 text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                    <circle cx="12" cy="5" r="2"></circle>
                    <path d="M12 7v4"></path>
                    <line x1="8" y1="16" x2="8" y2="16"></line>
                    <line x1="16" y1="16" x2="16" y2="16"></line>
                  </svg>
                </div>
                <div className="flex flex-col gap-3 w-full">
                  <div className="bg-white p-4 rounded-2xl rounded-bl-sm shadow-sm text-gray-800 border border-gray-100">
                      Found 1 supplier near you:
                  </div>
                  {/* Result Card UI */}
                  <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div className="font-bold text-[17px] text-gray-900 leading-tight">Sanjeevani Medical</div>
                        <div className="bg-gray-50 flex items-center gap-1.5 px-2 py-1 rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                            <span className="font-bold text-sm">4.8</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#2ECC71]"></span>
                        <span className="text-[#2ECC71] text-xs font-bold tracking-wider">OPEN TILL 11 PM</span>
                      </div>
                      <button className="w-full bg-[#2ECC71] text-white font-bold py-2.5 rounded-lg mt-1">
                        SHOW NUMBER
                      </button>
                  </div>
                </div>
              </div>
              
            </div>

            {/* Bottom Input Area */}
            <div className="bg-white p-4 shrink-0 flex flex-col gap-3 border-t border-gray-100 relative shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                  <button className="whitespace-nowrap bg-[#F3F4F6] hover:bg-gray-200 text-[#374151] font-medium text-sm px-4 py-2 rounded-full transition">Check Subsidy</button>
                  <button className="whitespace-nowrap bg-[#F3F4F6] hover:bg-gray-200 text-[#374151] font-medium text-sm px-4 py-2 rounded-full transition">Soil Test Result</button>
                  <button className="whitespace-nowrap bg-[#F3F4F6] hover:bg-gray-200 text-[#374151] font-medium text-sm px-4 py-2 rounded-full transition">Local Mandi Prices</button>
              </div>
              
              <div className="relative flex items-center bg-[#F3F4F6] rounded-full p-1 border border-gray-200 focus-within:border-gray-300 focus-within:bg-white transition-colors">
                  <input type="text" placeholder="Type your question in Hindi or English..." className="w-full bg-transparent outline-none px-4 text-sm text-gray-700 placeholder:text-gray-400" />
                  <button className="bg-[#FF5A25] hover:bg-[#E64A19] transition shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="translate-x-[-1px]">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                  </button>
              </div>
              
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
