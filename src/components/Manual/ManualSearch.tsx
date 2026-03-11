"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useManual } from "@/hooks/useManual";

export default function ManualSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  
  const searchBoxRef = useRef<HTMLDivElement>(null);

  const { performSearch, searchResults, loading } = useManual();

  // Debounce lógico
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 400);
    return () => clearTimeout(handler);
  }, [query]);

  // Ejecutar búsqueda real
  useEffect(() => {
    if (debouncedQuery.trim()) {
      performSearch(debouncedQuery);
    }
  }, [debouncedQuery, performSearch]);

  // Cerrar resultados al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectResult = (sectionId: string) => {
    setQuery("");
    setIsFocused(false);
    const params = new URLSearchParams(searchParams.toString());
    params.set("seccion", sectionId);
    router.push(`${pathname}?${params.toString()}`);
  };

  const showResults = isFocused && query.length > 0;

  return (
    <div className="relative w-full max-w-md" ref={searchBoxRef}>
      <div className="relative flex items-center w-full h-12 rounded-lg bg-white dark:bg-[#1e293b] overflow-hidden border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition-all shadow-sm">
        <div className="grid place-items-center h-full w-12 text-gray-400">
          <span className="material-symbols-outlined shrink-0 text-xl">search</span>
        </div>

        <input
          className="peer h-full w-full outline-none text-sm text-gray-700 dark:text-gray-200 bg-transparent pr-2"
          type="text"
          id="search"
          placeholder="Busca un tema de ayuda..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          autoComplete="off"
        />

        {query && (
          <button
            onClick={() => setQuery("")}
            className="grid place-items-center h-full w-12 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        )}
      </div>

      {/* Resultados desplegables */}
      {showResults && (
        <div className="absolute top-14 left-0 w-full bg-white dark:bg-[#1e293b] border border-gray-100 dark:border-gray-800 rounded-xl shadow-lg z-50 overflow-hidden flex flex-col max-h-80 overflow-y-auto">
          {loading.search ? (
             <div className="flex justify-center items-center p-6 text-gray-500">
               <span className="material-symbols-outlined animate-spin mr-2">progress_activity</span>
               Buscando...
             </div>
          ) : searchResults === null || searchResults.length === 0 ? (
             <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                No se encontraron resultados para "{query}".
             </div>
          ) : (
            <div className="flex flex-col">
              {searchResults.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleSelectResult(result.id)}
                  className="flex items-start gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 text-left border-b border-gray-50 dark:border-gray-800/50 last:border-0 transition-colors"
                >
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 shrink-0">
                     <span className="material-symbols-outlined">{result.icon}</span>
                  </div>
                  <div className="flex flex-col pt-1">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{result.title}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">{result.description}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
