"use client";

import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAplicar: (criterio: string) => void;
  valorActual?: string;
}

export default function OrdenarProveedores({ isOpen, onClose, onAplicar, valorActual }: Props) {
  if (!isOpen) return null;

  const [criterio, setCriterio] = useState(valorActual || "nombre-asc");

  const handleApply = () => {
    onAplicar(criterio);
    onClose();
  };

  const handleReset = () => {
    setCriterio("nombre-asc");
    onAplicar("");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className="relative w-full max-w-sm bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl ring-1 ring-black/5 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Cabecera */}
        <div className="flex items-center justify-between p-5 border-b border-[#ededed] dark:border-[#333]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-neutral-700 dark:text-white">sort</span>
            <h3 className="text-lg font-bold text-primary dark:text-white">Ordenar Proveedores</h3>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-800 dark:hover:text-white transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Opciones */}
        <div className="p-2 flex flex-col gap-1">
          
          {/* Opción: Contacto A-Z */}
          <label className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all group ${criterio === "Contacto-asc" ? "bg-neutral-100 dark:bg-[#2a2a2a]" : "hover:bg-neutral-50 dark:hover:bg-[#252525]"}`}>
            <div className="flex items-center gap-3">
              <span className={`material-symbols-outlined transition-colors ${criterio === "Contacto-asc" ? "text-neutral-900 dark:text-white" : "text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300"}`}>sort_by_alpha</span>
              <span className={`text-sm font-medium transition-colors ${criterio === "Contacto-asc" ? "text-neutral-900 dark:text-white" : "text-neutral-700 dark:text-neutral-200"}`}>Contacto (A - Z)</span>
            </div>
            <input type="radio" name="ordenar" value="Contacto-asc" checked={criterio === "Contacto-asc"} onChange={(e) => setCriterio(e.target.value)} className="accent-black dark:accent-white w-4 h-4 cursor-pointer" />
          </label>

          {/* Opción: Contacto Z-A */}
          <label className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all group ${criterio === "Contacto-desc" ? "bg-neutral-100 dark:bg-[#2a2a2a]" : "hover:bg-neutral-50 dark:hover:bg-[#252525]"}`}>
            <div className="flex items-center gap-3">
              <span className={`material-symbols-outlined transition-colors ${criterio === "Contacto-desc" ? "text-neutral-900 dark:text-white" : "text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300"}`}>sort_by_alpha</span>
              <span className={`text-sm font-medium transition-colors ${criterio === "Contacto-desc" ? "text-neutral-900 dark:text-white" : "text-neutral-700 dark:text-neutral-200"}`}>Contacto (Z - A)</span>
            </div>
            <input type="radio" name="ordenar" value="Contacto-desc" checked={criterio === "Contacto-desc"} onChange={(e) => setCriterio(e.target.value)} className="accent-black dark:accent-white w-4 h-4 cursor-pointer" />
          </label>

          <label className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all group ${criterio === "razon-social-asc" ? "bg-neutral-100 dark:bg-[#2a2a2a]" : "hover:bg-neutral-50 dark:hover:bg-[#252525]"}`}>
            <div className="flex items-center gap-3">
              <span className={`material-symbols-outlined transition-colors ${criterio === "razon-social-asc" ? "text-neutral-900 dark:text-white" : "text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300"}`}>corporate_fare</span>
              <span className={`text-sm font-medium transition-colors ${criterio === "razon-social-asc" ? "text-neutral-900 dark:text-white" : "text-neutral-700 dark:text-neutral-200"}`}>Razón Social (A - Z)</span>
            </div>
            <input 
              type="radio" name="ordenar" value="razon-social-asc" checked={criterio === "razon-social-asc"} onChange={(e) => setCriterio(e.target.value)} className="accent-black dark:accent-white w-4 h-4 cursor-pointer" />
          </label>
        </div>

        {/* Footer */}
        <div className="p-5 bg-neutral-50 dark:bg-[#252525]/50 border-t border-[#ededed] dark:border-[#333] flex justify-between gap-3">
           <button onClick={handleReset} className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors">Restablecer</button>
          <div className="flex gap-3">
            <button onClick={onClose} className="h-10 px-4 rounded-lg text-sm font-semibold text-neutral-700 dark:text-neutral-200 bg-white dark:bg-transparent border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all cursor-pointer">Cancelar</button>
            <button onClick={handleApply} className="h-10 px-4 rounded-lg text-sm font-bold bg-neutral-800 hover:bg-black text-white shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2 dark:bg-white dark:text-black">
                <span className="material-symbols-outlined text-[18px]">check</span> Aplicar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}