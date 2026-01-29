"use client";
import { useState, useEffect } from "react";

// Definimos los tipos de los filtros
export type FilterState = {
  category: string;
  stockStatus: string;
  priceRange: { min: string; max: string };
};

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  currentFilters: FilterState;
  categoriasDisponibles?: string[];
}

export default function FilterModal({ 
  isOpen, 
  onClose, 
  onApply, 
  currentFilters, 
  categoriasDisponibles = ["General", "Bebidas", "Limpieza", "Comestibles"] // Ejemplos
}: FilterModalProps) {
    
  const [category, setCategory] = useState("Todas");
  const [stockStatus, setStockStatus] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  useEffect(() => {
    if (isOpen && currentFilters) {
      setCategory(currentFilters.category || "Todas");
      setStockStatus(currentFilters.stockStatus || "all");
      setPriceRange(currentFilters.priceRange || { min: "", max: "" });
    }
  }, [isOpen, currentFilters]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({
      category,
      stockStatus,
      priceRange
    });
    onClose();
  };

  const handleReset = () => {
    const defaults = {
        category: "Todas",
        stockStatus: "all",
        priceRange: { min: "", max: "" }
    };

    setCategory(defaults.category);
    setStockStatus(defaults.stockStatus);
    setPriceRange(defaults.priceRange);

    onApply(defaults);
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose} 
      ></div>

      <div className="relative w-full max-w-md bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl ring-1 ring-black/5 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Cabecera */}
        <div className="flex items-center justify-between p-5 border-b border-[#ededed] dark:border-[#333]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-neutral-700 dark:text-white">filter_list</span>
            <h3 className="text-lg font-bold text-primary dark:text-white">Filtrar Productos</h3>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-800 dark:hover:text-white transition-colors cursor-pointer hover:scale-110 active:scale-95 duration-200">
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Cuerpo */}
        <div className="p-6 flex flex-col gap-6">
          
          {/* Filtro: Tipo de producto */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-neutral-400">category</span>
              Tipo de producto
            </label>
            <div className="relative">
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-11 px-3 rounded-lg border-2 border-neutral-300 dark:border-neutral-600 bg-white dark:bg-[#2a2a2a] text-sm text-neutral-800 dark:text-white font-medium focus:outline-none focus:border-neutral-500 transition-all cursor-pointer appearance-none capitalize"
              >
                <option value="Todas">Todos los tipos de producto</option>
                {categoriasDisponibles.map((cat: string) => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">expand_more</span>
            </div>
          </div>

          {/* Filtro: Estado del Stock */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-neutral-400">inventory_2</span>
              Estado del Stock
            </label>
            <div className="flex flex-wrap gap-2">
              <label className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors flex-1 justify-center ${stockStatus === 'all' ? 'bg-neutral-100 dark:bg-neutral-700 border-neutral-400' : 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50'}`}>
                <input type="radio" name="stock" className="hidden" checked={stockStatus === 'all'} onChange={() => setStockStatus('all')} />
                <span className="text-sm font-medium">Todos</span>
              </label>
              <label className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors flex-1 justify-center ${stockStatus === 'low' ? 'bg-yellow-50 border-yellow-400 text-yellow-700' : 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50'}`}>
                <input type="radio" name="stock" className="hidden" checked={stockStatus === 'low'} onChange={() => setStockStatus('low')} />
                <span className="text-sm font-medium">Bajo</span>
              </label>
            </div>
          </div>

          {/* Filtro: Rango de Precio */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-neutral-400">payments</span>
              Rango de Precio
            </label>
            <div className="flex gap-3 items-center">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
                <input 
                  type="number" 
                  placeholder="Min" 
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                  className="w-full h-10 pl-6 pr-3 rounded-lg border border-[#ededed] dark:border-[#333] bg-white dark:bg-[#252525] text-sm text-neutral-900 dark:text-white outline-none focus:border-neutral-400 transition-colors" 
                />
              </div>
              <span className="text-neutral-400">-</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
                <input 
                  type="number" 
                  placeholder="Max" 
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                  className="w-full h-10 pl-6 pr-3 rounded-lg border border-[#ededed] dark:border-[#333] bg-white dark:bg-[#252525] text-sm text-neutral-900 dark:text-white outline-none focus:border-neutral-400 transition-colors" 
                />
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-5 bg-neutral-50 dark:bg-[#252525]/50 border-t border-[#ededed] dark:border-[#333] flex flex-col sm:flex-row justify-between gap-3">
           <button 
             onClick={handleReset}
             className="h-10 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold text-red-600 border border-red-200 bg-red-50/50 hover:bg-red-100 hover:border-red-300 transition-all hover:scale-105 active:scale-95 cursor-pointer dark:bg-red-900/10 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-900/20"
           >
             <span className="material-symbols-outlined text-[18px]">restart_alt</span>
             Restablecer
           </button>

           <div className="flex gap-3 w-full sm:w-auto">
             <button 
                onClick={handleApply} 
                className="w-full sm:w-auto h-10 px-6 rounded-lg text-sm font-bold bg-neutral-800 hover:bg-black text-white shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 dark:bg-white dark:text-black"
             >
                <span className="material-symbols-outlined text-[18px]">check</span>
                Aplicar
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}