"use client";

import { useState, useEffect } from "react";
// 1. Importamos nuestro átomo UI
import BotonAccion from "@/components/Proveedores/ui/BotonAccion";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAplicar: (criterio: string, cerrarModal?: boolean) => void;
  valorActual?: string;
}

export default function OrdenarProveedores({ isOpen, onClose, onAplicar, valorActual }: Props) {
  
  // Si no hay valor en la URL, asumimos "razon-social-asc" visualmente
  const [criterio, setCriterio] = useState(valorActual || "razon-social-asc");

  useEffect(() => {
    if (isOpen) {
      setCriterio(valorActual || "razon-social-asc");
    }
  }, [isOpen, valorActual]);

  if (!isOpen) return null;

  const handleApply = () => {
    // LÓGICA DE DEFAULT: Si es "razon-social-asc", enviamos vacío para limpiar la URL
    const valorFinal = (criterio === "razon-social-asc") ? "" : criterio;
    
    // Aplicar y cerrar
    onAplicar(valorFinal, true);
  };

  const handleReset = () => {
    // 1. Reset visual
    setCriterio("razon-social-asc");
    
    // 2. Reset funcional: Enviamos vacío y FALSE para no cerrar
    onAplicar("", false);
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
            <h3 className="text-lg font-bold text-primary dark:text-white">Ordenar Proveedores</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-neutral-500 hover:text-neutral-800 dark:hover:text-white transition-colors cursor-pointer hover:scale-110 active:scale-95 duration-200"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Opciones */}
        <div className="p-2 flex flex-col gap-1">
          
          {/* Opción: Razón Social (A-Z) - DEFAULT */}
          <label className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all group ${(criterio === "razon-social-asc" || criterio === "") ? "bg-neutral-100 dark:bg-[#2a2a2a]" : "hover:bg-neutral-50 dark:hover:bg-[#252525]"}`}>
            <div className="flex items-center gap-3">
              <span className={`material-symbols-outlined transition-colors ${(criterio === "razon-social-asc" || criterio === "") ? "text-neutral-900 dark:text-white" : "text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300"}`}>corporate_fare</span>
              <span className={`text-sm font-medium transition-colors ${(criterio === "razon-social-asc" || criterio === "") ? "text-neutral-900 dark:text-white" : "text-neutral-700 dark:text-neutral-200"}`}>Razón Social (A - Z)</span>
            </div>
            <input 
              type="radio" 
              name="ordenar" 
              value="razon-social-asc" 
              checked={criterio === "razon-social-asc" || criterio === ""} 
              onChange={(e) => setCriterio(e.target.value)} 
              className="accent-black dark:accent-white w-4 h-4 cursor-pointer" 
            />
          </label>

          {/* Opción: Contacto A-Z */}
          <label className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all group ${criterio === "Contacto-asc" ? "bg-neutral-100 dark:bg-[#2a2a2a]" : "hover:bg-neutral-50 dark:hover:bg-[#252525]"}`}>
            <div className="flex items-center gap-3">
              <span className={`material-symbols-outlined transition-colors ${criterio === "Contacto-asc" ? "text-neutral-900 dark:text-white" : "text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300"}`}>sort_by_alpha</span>
              <span className={`text-sm font-medium transition-colors ${criterio === "Contacto-asc" ? "text-neutral-900 dark:text-white" : "text-neutral-700 dark:text-neutral-200"}`}>Contacto (A - Z)</span>
            </div>
            <input 
              type="radio" 
              name="ordenar" 
              value="Contacto-asc" 
              checked={criterio === "Contacto-asc"} 
              onChange={(e) => setCriterio(e.target.value)} 
              className="accent-black dark:accent-white w-4 h-4 cursor-pointer" 
            />
          </label>

          {/* Opción: Contacto Z-A */}
          <label className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all group ${criterio === "Contacto-desc" ? "bg-neutral-100 dark:bg-[#2a2a2a]" : "hover:bg-neutral-50 dark:hover:bg-[#252525]"}`}>
            <div className="flex items-center gap-3">
              <span className={`material-symbols-outlined transition-colors ${criterio === "Contacto-desc" ? "text-neutral-900 dark:text-white" : "text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300"}`}>sort_by_alpha</span>
              <span className={`text-sm font-medium transition-colors ${criterio === "Contacto-desc" ? "text-neutral-900 dark:text-white" : "text-neutral-700 dark:text-neutral-200"}`}>Contacto (Z - A)</span>
            </div>
            <input 
              type="radio" 
              name="ordenar" 
              value="Contacto-desc" 
              checked={criterio === "Contacto-desc"} 
              onChange={(e) => setCriterio(e.target.value)} 
              className="accent-black dark:accent-white w-4 h-4 cursor-pointer" 
            />
          </label>

        </div>

        {/* Footer Refactorizado con el Átomo */}
        <div className="p-5 bg-neutral-50 dark:bg-[#252525]/50 border-t border-[#ededed] dark:border-[#333] flex flex-col sm:flex-row justify-between gap-3">
          
           <button 
             type="button" 
             onClick={handleReset}
             className="h-10 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold text-red-600 border border-red-200 bg-red-50/50 hover:bg-red-100 hover:border-red-300 transition-all hover:scale-105 active:scale-95 cursor-pointer dark:bg-red-900/10 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-900/20"
           >
             <span className="material-symbols-outlined text-[18px]">restart_alt</span>
             Restablecer
           </button>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <BotonAccion 
              type="button"
              onClick={handleApply}
              texto="Aplicar"
              icono="check"
              className="w-full sm:w-auto" // Para que ocupe todo el ancho en mobile
            />
          </div>
        </div>

      </div>
    </div>
  );
}