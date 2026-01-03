"use client";

import { useState } from "react";

export default function Ordenar({ isOpen, onClose }) {
  if (!isOpen) return null;

  // Estado local para la opción seleccionada
  const [criterio, setCriterio] = useState("nombre-asc");

  const handleApply = () => {
    // Aquí luego conectaremos la lógica real
    console.log("Ordenando por:", criterio);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
      {/* Fondo Oscuro */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose} 
      ></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-sm bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl ring-1 ring-black/5 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Cabecera */}
        <div className="flex items-center justify-between p-5 border-b border-[#ededed] dark:border-[#333]">
          <h3 className="text-lg font-bold text-primary dark:text-white">Ordenar Productos</h3>
          <button 
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-800 dark:hover:text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Opciones */}
        <div className="p-2 flex flex-col">
          
          {/* Opción: Nombre A-Z */}
          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-[#252525] cursor-pointer transition-colors group">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-neutral-400 group-hover:text-primary dark:group-hover:text-white">sort_by_alpha</span>
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Nombre (A - Z)</span>
            </div>
            <input 
              type="radio" 
              name="ordenar" 
              value="nombre-asc"
              checked={criterio === "nombre-asc"}
              onChange={(e) => setCriterio(e.target.value)}
              className="accent-black dark:accent-white w-4 h-4" 
            />
          </label>

          {/* Opción: Mayor Stock */}
          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-[#252525] cursor-pointer transition-colors group">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-neutral-400 group-hover:text-primary dark:group-hover:text-white">inventory_2</span>
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Mayor Stock</span>
            </div>
            <input 
              type="radio" 
              name="ordenar" 
              value="stock-desc"
              checked={criterio === "stock-desc"}
              onChange={(e) => setCriterio(e.target.value)}
              className="accent-black dark:accent-white w-4 h-4" 
            />
          </label>

           {/* Opción: Menor Stock */}
           <label className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-[#252525] cursor-pointer transition-colors group">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-neutral-400 group-hover:text-primary dark:group-hover:text-white">low_priority</span>
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Menor Stock</span>
            </div>
            <input 
              type="radio" 
              name="ordenar" 
              value="stock-asc"
              checked={criterio === "stock-asc"}
              onChange={(e) => setCriterio(e.target.value)}
              className="accent-black dark:accent-white w-4 h-4" 
            />
          </label>

          {/* Opción: Precio Mayor */}
          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-[#252525] cursor-pointer transition-colors group">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-neutral-400 group-hover:text-primary dark:group-hover:text-white">attach_money</span>
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">Precio (Mayor a Menor)</span>
            </div>
            <input 
              type="radio" 
              name="ordenar" 
              value="precio-desc"
              checked={criterio === "precio-desc"}
              onChange={(e) => setCriterio(e.target.value)}
              className="accent-black dark:accent-white w-4 h-4" 
            />
          </label>

        </div>

        {/* Footer */}
        <div className="p-5 bg-neutral-50 dark:bg-[#252525]/50 border-t border-[#ededed] dark:border-[#333] flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="h-10 px-4 rounded-lg text-sm font-semibold text-neutral-700 dark:text-neutral-200 bg-white dark:bg-transparent border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all cursor-pointer"
          >
            Cancelar
          </button>
          
          <button 
            onClick={handleApply} 
            className="h-10 px-4 rounded-lg text-sm font-bold bg-gray-200 text-black hover:bg-gray-300 dark:bg-white dark:text-black dark:hover:bg-gray-200 shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            Aplicar Orden
          </button>
        </div>

      </div>
    </div>
  );
}