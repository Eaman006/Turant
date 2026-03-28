'use client';
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const Chatbot = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'assistant', content: string}[]>([
    { role: 'assistant', content: 'Namaste! I am your Turant Sahayak. How can I help you today? I can find water suppliers, book autos, or locate the nearest medical clinic.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput('');
    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: newMessages })
      });
      const data = await response.json();
      if (data.text) {
        setMessages([...newMessages, { role: 'assistant', content: data.text }]);
      } else if (data.error) {
        setMessages([...newMessages, { role: 'assistant', content: `API Error: ${data.error}` }]);
      } else {
        setMessages([...newMessages, { role: 'assistant', content: "Sorry, I ran into an error connecting to my brain." }]);
      }
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: "Sorry, I ran into a network error." }]);
    } finally {
      setIsLoading(false);
    }
  };

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
              {messages.map((msg, i) => (
                <div key={i} className={`flex items-end ${msg.role === 'user' ? 'justify-end' : 'justify-start items-start gap-3'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-gray-200 flex shrink-0 items-center justify-center mt-auto mb-2 text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                        <circle cx="12" cy="5" r="2"></circle>
                        <path d="M12 7v4"></path>
                        <line x1="8" y1="16" x2="8" y2="16"></line>
                        <line x1="16" y1="16" x2="16" y2="16"></line>
                      </svg>
                    </div>
                  )}
                  <div className={`${msg.role === 'user' ? 'bg-[#FF5A25] text-white rounded-br-sm' : 'bg-white text-gray-800 rounded-bl-sm border border-gray-100'} p-4 rounded-2xl shadow-sm leading-relaxed max-w-[85%] whitespace-pre-wrap flex flex-col gap-2`}>
                    <ReactMarkdown
                      components={{
                        p: ({node, ...props}) => <p className="m-0" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc ml-4 space-y-1" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal ml-4 space-y-1" {...props} />,
                        li: ({node, ...props}) => <li {...props} />
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
              {isLoading && (
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
                    <div className="bg-white p-4 rounded-2xl rounded-bl-sm shadow-sm text-gray-800 border border-gray-100">
                      Thinking...
                    </div>
                 </div>
              )}
            </div>

            {/* Bottom Input Area */}
            <div className="bg-white p-4 shrink-0 flex flex-col gap-3 border-t border-gray-100 relative shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.05)]">
              <div className="relative flex items-center bg-[#F3F4F6] rounded-full p-1 border border-gray-200 focus-within:border-gray-300 focus-within:bg-white transition-colors">
                  <input 
                    type="text" 
                    placeholder="Type your question in Hindi or English..." 
                    className="w-full bg-transparent outline-none px-4 text-sm text-gray-700 placeholder:text-gray-400"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if ('key' in e && e.key === 'Enter') handleSend(); }}
                  />
                  <button 
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="bg-[#FF5A25] hover:bg-[#E64A19] disabled:opacity-50 transition shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md">
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
