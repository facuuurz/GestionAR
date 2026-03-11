import Link from "next/link";
import React from "react";

interface PaginadorProps {
  currentPage: number;
  totalPages: number;
  createPageUrl: (newPage: number) => string;
}

export default function Paginador({ currentPage, totalPages, createPageUrl }: PaginadorProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center gap-4">
      
      {/* Botón Anterior */}
      {currentPage > 1 ? (
        <Link 
          href={createPageUrl(currentPage - 1)} 
          className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-[#1e2736] border border-neutral-300 dark:border-[#333] rounded-md hover:bg-neutral-50 dark:hover:bg-[#2a3649] transition-colors"
        >
          Anterior
        </Link>
      ) : (
        <button disabled className="px-4 py-2 text-sm font-medium text-neutral-400 dark:text-neutral-600 bg-neutral-100 dark:bg-[#151a25] border border-neutral-200 dark:border-[#333] rounded-md cursor-not-allowed">
          Anterior
        </button>
      )}

      <span className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
        Página <span className="font-bold text-slate-900 dark:text-white">{currentPage}</span> de <span className="font-bold text-slate-900 dark:text-white">{totalPages}</span>
      </span>

      {/* Botón Siguiente */}
      {currentPage < totalPages ? (
        <Link 
          href={createPageUrl(currentPage + 1)} 
          className="px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-[#1e2736] border border-neutral-300 dark:border-[#333] rounded-md hover:bg-neutral-50 dark:hover:bg-[#2a3649] transition-colors"
        >
          Siguiente
        </Link>
      ) : (
        <button disabled className="px-4 py-2 text-sm font-medium text-neutral-400 dark:text-neutral-600 bg-neutral-100 dark:bg-[#151a25] border border-neutral-200 dark:border-[#333] rounded-md cursor-not-allowed">
          Siguiente
        </button>
      )}
      
    </div>
  );
}