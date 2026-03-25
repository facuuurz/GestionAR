"use client";

import { useChat } from "ai/react";
import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import ReactMarkdown from "react-markdown";

export default function ChatBot() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  }, [messages, isOpen]);

  if (!isMounted) return null;
  if (pathname === '/login') return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-black hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-200 dark:text-black rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 z-50"
      >
        <span className="material-symbols-outlined text-2xl">
          {isOpen ? "close" : "chat"}
        </span>
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-[350px] h-[500px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 transition-all font-display">
          
          <div className="bg-black p-4 flex items-center justify-between text-white shrink-0">
            <div className="flex items-center gap-2">
              <img src="/icon.png" alt="GestionAR Logo" className="w-6 h-6 object-contain" />
              <h3 className="font-bold">Asistente GestionAR</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-indigo-200 transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-950 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-center space-y-2">
                <span className="material-symbols-outlined text-4xl">forum</span>
                <p className="text-sm">¡Hola! Soy tu asistente. ¿En qué puedo ayudarte hoy?</p>
              </div>
            ) : (
              messages.filter(m => m.content.trim().length > 0).map(m => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                    m.role === 'user' 
                      ? 'bg-black text-white dark:bg-white dark:text-black rounded-tr-sm' 
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-sm shadow-sm'
                  }`}>
                    <div className="text-sm leading-relaxed prose prose-sm prose-invert max-w-none">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
               <div className="flex justify-start">
                 <div className="max-w-[85%] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1.5">
                   <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></div>
                   <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0.15s" }}></div>
                   <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0.3s" }}></div>
                 </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
            <div className="relative flex items-center">
              <input
                value={input}
                onChange={handleInputChange}
                className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-full pl-4 pr-12 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                placeholder="Escribe tu consulta aquí..."
                disabled={isLoading}
              />
              <button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="absolute right-1.5 p-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-full flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
