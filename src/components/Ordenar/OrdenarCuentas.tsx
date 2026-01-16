"use client";

import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAplicar: (criterio: string) => void;
  valorActual?: string;
}

export default function OrdenarClientes({ isOpen, onClose, onAplicar, valorActual }: Props) {
  if (!isOpen) return null;

  // Iniciamos con el valor que viene de la URL o por defecto nombre-asc
  const [criterio, setCriterio] = useState(valorActual || "nombre-asc");

  const handleApply = () => {
    onAplicar(criterio);
    onClose();
  };

  const handleReset = () => {
    setCriterio("nombre-asc");
    onAplicar(""); // Limpia la URL
    onClose();
  }

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
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-neutral-700 dark:text-white">sort</span>
            <h3 className="text-lg font-bold text-primary dark:text-white">Ordenar Cuentas</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-800 dark:hover:text-white transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Opciones */}
        <div className="p-2 flex flex-col gap-1">
          
          {/* Opción: Nombre A-Z */}
          <label className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all group ${criterio === "nombre-asc" ? "bg-neutral-100 dark:bg-[#2a2a2a]" : "hover:bg-neutral-50 dark:hover:bg-[#252525]"}`}>
            <div className="flex items-center gap-3">
              <span className={`material-symbols-outlined transition-colors ${criterio === "nombre-asc" ? "text-neutral-900 dark:text-white" : "text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300"}`}>sort_by_alpha</span>
              <span className={`text-sm font-medium transition-colors ${criterio === "nombre-asc" ? "text-neutral-900 dark:text-white" : "text-neutral-700 dark:text-neutral-200"}`}>Nombre (A - Z)</span>
            </div>
            <input type="radio" name="ordenar" value="nombre-asc" checked={criterio === "nombre-asc"} onChange={(e) => setCriterio(e.target.value)} className="accent-black dark:accent-white w-4 h-4 cursor-pointer" />
          </label>

          {/* Opción: Nombre Z-A */}
          <label className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all group ${criterio === "nombre-desc" ? "bg-neutral-100 dark:bg-[#2a2a2a]" : "hover:bg-neutral-50 dark:hover:bg-[#252525]"}`}>
            <div className="flex items-center gap-3">
              <span className={`material-symbols-outlined transition-colors ${criterio === "nombre-desc" ? "text-neutral-900 dark:text-white" : "text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300"}`}>sort_by_alpha</span>
              <span className={`text-sm font-medium transition-colors ${criterio === "nombre-desc" ? "text-neutral-900 dark:text-white" : "text-neutral-700 dark:text-neutral-200"}`}>Nombre (Z - A)</span>
            </div>
            <input type="radio" name="ordenar" value="nombre-desc" checked={criterio === "nombre-desc"} onChange={(e) => setCriterio(e.target.value)} className="accent-black dark:accent-white w-4 h-4 cursor-pointer" />
          </label>

          {/* Opción: Mayor Deuda */}
          <label className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all group ${criterio === "saldo-menor" ? "bg-red-50 dark:bg-red-900/20" : "hover:bg-neutral-50 dark:hover:bg-[#252525]"}`}>
            <div className="flex items-center gap-3">
              <span className={`material-symbols-outlined transition-colors ${criterio === "saldo-menor" ? "text-red-600 dark:text-red-400" : "text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300"}`}>trending_down</span>
              <span className={`text-sm font-medium transition-colors ${criterio === "saldo-menor" ? "text-red-700 dark:text-red-300" : "text-neutral-700 dark:text-neutral-200"}`}>Mayor Deuda</span>
            </div>
            <input type="radio" name="ordenar" value="saldo-menor" checked={criterio === "saldo-menor"} onChange={(e) => setCriterio(e.target.value)} className="accent-red-600 w-4 h-4 cursor-pointer" />
          </label>

           {/* Opción: Mayor Saldo a Favor */}
           <label className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all group ${criterio === "saldo-mayor" ? "bg-green-50 dark:bg-green-900/20" : "hover:bg-neutral-50 dark:hover:bg-[#252525]"}`}>
            <div className="flex items-center gap-3">
              <span className={`material-symbols-outlined transition-colors ${criterio === "saldo-mayor" ? "text-green-600 dark:text-green-400" : "text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300"}`}>savings</span>
              <span className={`text-sm font-medium transition-colors ${criterio === "saldo-mayor" ? "text-green-700 dark:text-green-300" : "text-neutral-700 dark:text-neutral-200"}`}>Mayor Saldo a Favor</span>
            </div>
            <input type="radio" name="ordenar" value="saldo-mayor" checked={criterio === "saldo-mayor"} onChange={(e) => setCriterio(e.target.value)} className="accent-green-600 w-4 h-4 cursor-pointer" />
          </label>

          {/* Opción: Más Antiguos */}
          <label className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all group ${criterio === "antiguos" ? "bg-neutral-100 dark:bg-[#2a2a2a]" : "hover:bg-neutral-50 dark:hover:bg-[#252525]"}`}>
            <div className="flex items-center gap-3">
              <span className={`material-symbols-outlined transition-colors ${criterio === "antiguos" ? "text-neutral-900 dark:text-white" : "text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300"}`}>history</span>
              <span className={`text-sm font-medium transition-colors ${criterio === "antiguos" ? "text-neutral-900 dark:text-white" : "text-neutral-700 dark:text-neutral-200"}`}>Más Antiguos</span>
            </div>
            <input type="radio" name="ordenar" value="antiguos" checked={criterio === "antiguos"} onChange={(e) => setCriterio(e.target.value)} className="accent-black dark:accent-white w-4 h-4 cursor-pointer" />
          </label>

        </div>

        {/* Footer */}
        <div className="p-5 bg-neutral-50 dark:bg-[#252525]/50 border-t border-[#ededed] dark:border-[#333] flex justify-between gap-3">
           <button onClick={handleReset} className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors">
             Restablecer
           </button>
          
          <div className="flex gap-3">
            <button onClick={onClose} className="h-10 px-4 rounded-lg text-sm font-semibold text-neutral-700 dark:text-neutral-200 bg-white dark:bg-transparent border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all cursor-pointer">
                Cancelar
            </button>
            <button onClick={handleApply} className="h-10 px-4 rounded-lg text-sm font-bold bg-neutral-800 hover:bg-black text-white shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2 dark:bg-white dark:text-black">
                <span className="material-symbols-outlined text-[18px]">check</span>
                Aplicar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}