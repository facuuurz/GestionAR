"use client";

import { useState } from "react";

export default function Ordenar({ isOpen, onClose, onAplicar }) {
  if (!isOpen) return null;

  // Estado local para la opción seleccionada
  const [criterio, setCriterio] = useState("nombre-asc");

  const handleApply = () => {
    // Aquí luego conectaremos la lógica real
    console.log("Ordenando por:", criterio);
    onAplicar(criterio);
    onClose();
  };

  // Lógica para restablecer orden
  const handleReset = () => {
    // Enviamos string vacío para indicar que NO hay orden específico
    // Esto hará que desaparezca el punto azul
    setCriterio("nombre-asc"); // Reset visual interno (opcional)
    onAplicar(""); 
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
            <h3 className="text-lg font-bold text-primary dark:text-white">Ordenar Productos</h3>
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
            <input 
              type="radio" 
              name="ordenar" 
              value="nombre-asc"
              checked={criterio === "nombre-asc"}
              onChange={(e) => setCriterio(e.target.value)}
              className="accent-black dark:accent-white w-4 h-4 cursor-pointer" 
            />
          </label>

          {/* Opción: Mayor Stock */}
          <label className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all group ${criterio === "stock-desc" ? "bg-neutral-100 dark:bg-[#2a2a2a]" : "hover:bg-neutral-50 dark:hover:bg-[#252525]"}`}>
            <div className="flex items-center gap-3">
              <span className={`material-symbols-outlined transition-colors ${criterio === "stock-desc" ? "text-neutral-900 dark:text-white" : "text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300"}`}>inventory_2</span>
              <span className={`text-sm font-medium transition-colors ${criterio === "stock-desc" ? "text-neutral-900 dark:text-white" : "text-neutral-700 dark:text-neutral-200"}`}>Mayor Stock</span>
            </div>
            <input 
              type="radio" 
              name="ordenar" 
              value="stock-desc"
              checked={criterio === "stock-desc"}
              onChange={(e) => setCriterio(e.target.value)}
              className="accent-black dark:accent-white w-4 h-4 cursor-pointer" 
            />
          </label>

           {/* Opción: Menor Stock */}
           <label className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all group ${criterio === "stock-asc" ? "bg-neutral-100 dark:bg-[#2a2a2a]" : "hover:bg-neutral-50 dark:hover:bg-[#252525]"}`}>
            <div className="flex items-center gap-3">
              <span className={`material-symbols-outlined transition-colors ${criterio === "stock-asc" ? "text-neutral-900 dark:text-white" : "text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300"}`}>low_priority</span>
              <span className={`text-sm font-medium transition-colors ${criterio === "stock-asc" ? "text-neutral-900 dark:text-white" : "text-neutral-700 dark:text-neutral-200"}`}>Menor Stock</span>
            </div>
            <input 
              type="radio" 
              name="ordenar" 
              value="stock-asc"
              checked={criterio === "stock-asc"}
              onChange={(e) => setCriterio(e.target.value)}
              className="accent-black dark:accent-white w-4 h-4 cursor-pointer" 
            />
          </label>

          {/* Opción: Precio Mayor a Menor */}
          <label className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all group ${criterio === "precio-desc" ? "bg-neutral-100 dark:bg-[#2a2a2a]" : "hover:bg-neutral-50 dark:hover:bg-[#252525]"}`}>
            <div className="flex items-center gap-3">
              <span className={`material-symbols-outlined transition-colors ${criterio === "precio-desc" ? "text-neutral-900 dark:text-white" : "text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300"}`}>attach_money</span>
              <span className={`text-sm font-medium transition-colors ${criterio === "precio-desc" ? "text-neutral-900 dark:text-white" : "text-neutral-700 dark:text-neutral-200"}`}>Precio (Mayor a Menor)</span>
            </div>
            <input 
              type="radio" 
              name="ordenar" 
              value="precio-desc"
              checked={criterio === "precio-desc"}
              onChange={(e) => setCriterio(e.target.value)}
              className="accent-black dark:accent-white w-4 h-4 cursor-pointer" 
            />
          </label>

          {/* NUEVA OPCIÓN: Precio Menor a Mayor */}
          <label className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all group ${criterio === "precio-asc" ? "bg-neutral-100 dark:bg-[#2a2a2a]" : "hover:bg-neutral-50 dark:hover:bg-[#252525]"}`}>
            <div className="flex items-center gap-3">
              <span className={`material-symbols-outlined transition-colors ${criterio === "precio-asc" ? "text-neutral-900 dark:text-white" : "text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300"}`}>savings</span>
              <span className={`text-sm font-medium transition-colors ${criterio === "precio-asc" ? "text-neutral-900 dark:text-white" : "text-neutral-700 dark:text-neutral-200"}`}>Precio (Menor a Mayor)</span>
            </div>
            <input 
              type="radio" 
              name="ordenar" 
              value="precio-asc"
              checked={criterio === "precio-asc"}
              onChange={(e) => setCriterio(e.target.value)}
              className="accent-black dark:accent-white w-4 h-4 cursor-pointer" 
            />
          </label>

        </div>

        {/* Footer */}
        <div className="p-5 bg-neutral-50 dark:bg-[#252525]/50 border-t border-[#ededed] dark:border-[#333] flex justify-between gap-3">
          
          {/* Botón Restablecer a la izquierda */}
           <button 
             onClick={handleReset}
             className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
           >
             Restablecer
           </button>
          
          <div className="flex gap-3">
            <button 
                onClick={onClose}
                className="h-10 px-4 rounded-lg text-sm font-semibold text-neutral-700 dark:text-neutral-200 bg-white dark:bg-transparent border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all cursor-pointer flex items-center gap-2"
            >
                Cancelar
            </button>
            
            <button 
                onClick={handleApply} 
                className="h-10 px-4 rounded-lg text-sm font-bold bg-neutral-800 hover:bg-black text-white shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-md cursor-pointer flex items-center gap-2 dark:bg-white dark:text-black"
            >
                <span className="material-symbols-outlined text-[18px]">check</span>
                Aplicar Orden
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}