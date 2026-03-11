import React from "react";

interface PaginadorProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  loading?: boolean;
}

export default function Paginador({ currentPage, totalPages, onPageChange, loading = false }: PaginadorProps) {
  if (loading || totalPages <= 1) return null;

  return (
    <div className="flex justify-between items-center px-4 py-3 border-t border-[#ededed] dark:border-[#333] bg-[#f9f9f9] dark:bg-[#151a25]">
      
      {/* Botón Anterior */}
      <button 
        onClick={() => onPageChange(currentPage - 1)} 
        disabled={currentPage === 1}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors 
          ${currentPage === 1 
            ? 'text-neutral-400 dark:text-neutral-600 bg-neutral-100 dark:bg-[#151a25] border border-neutral-200 dark:border-[#333] cursor-not-allowed' 
            : 'text-neutral-700 dark:text-neutral-300 bg-white dark:bg-[#1e2736] border border-neutral-300 dark:border-[#333] hover:bg-neutral-50 dark:hover:bg-[#2a3649]'}`}
      >
        Anterior
      </button>
      
      <span className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
        Página <span className="font-bold text-slate-900 dark:text-white">{currentPage}</span> de <span className="font-bold text-slate-900 dark:text-white">{totalPages}</span>
      </span>
      
      {/* Botón Siguiente */}
      <button 
        onClick={() => onPageChange(currentPage + 1)} 
        disabled={currentPage === totalPages}
        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors 
          ${currentPage === totalPages 
            ? 'text-neutral-400 dark:text-neutral-600 bg-neutral-100 dark:bg-[#151a25] border border-neutral-200 dark:border-[#333] cursor-not-allowed' 
            : 'text-neutral-700 dark:text-neutral-300 bg-white dark:bg-[#1e2736] border border-neutral-300 dark:border-[#333] hover:bg-neutral-50 dark:hover:bg-[#2a3649]'}`}
      >
        Siguiente
      </button>

    </div>
  );
}