"use client";

import { useState, type ChangeEvent } from "react";

// Definimos la forma de las props
interface AgregarTipoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AgregarTipoModal({ isOpen, onClose }: AgregarTipoModalProps) {
  // Tipado explícito del estado (aunque TS lo infiere, es buena práctica)
  const [nombre, setNombre] = useState<string>("");

  if (!isOpen) return null;

  const handleSave = () => {
    // Lógica para guardar
    console.log("Guardando nuevo tipo:", nombre);
    setNombre(""); 
    onClose();
  };

  // Manejador del input tipado
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNombre(e.target.value);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      
      {/* Fondo Oscuro */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose} 
      ></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl ring-1 ring-black/5 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Cabecera */}
        <div className="flex items-center justify-between p-5 border-b border-[#ededed] dark:border-[#333]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-neutral-700 dark:text-white">category</span>
            <h3 className="text-lg font-bold text-primary dark:text-white">Nuevo Tipo de Producto</h3>
          </div>
          <button 
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-800 dark:hover:text-white transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Cuerpo (Formulario) */}
        <div className="p-6 flex flex-col gap-5">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Crea una nueva categoría para organizar mejor tu inventario.
          </p>

          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">Nombre de la Categoría</span>
            <div className="relative w-full">
              <input 
                autoFocus
                type="text"
                value={nombre}
                onChange={handleChange}
                className="flex w-full rounded-lg border border-[#cfd7e7] dark:border-[#4a5568] bg-[#f8f9fc] dark:bg-[#2d3748] text-[#0d121b] dark:text-white focus:ring-2 focus:ring-black/20 focus:border-black dark:focus:border-white h-11 pl-10 pr-4 placeholder:text-[#9ca3af] text-sm font-medium transition-all outline-none" 
                placeholder="Ej. Congelados" 
              />
              <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 flex items-center text-neutral-400">
                <span className="material-symbols-outlined text-[20px]">label</span>
              </div>
            </div>
          </label>
        </div>

        {/* Footer (Botones) */}
        <div className="p-5 bg-neutral-50 dark:bg-[#252525]/50 border-t border-[#ededed] dark:border-[#333] flex justify-end gap-3">
          
          <button 
            onClick={onClose}
            type="button"
            className="w-full md:w-auto h-10 px-4 rounded-lg text-sm font-semibold text-neutral-700 dark:text-neutral-200 bg-white dark:bg-transparent border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
          >
            Cancelar
          </button>
          
          <button 
            onClick={handleSave} 
            type="button"
            className="w-full md:w-auto h-10 px-4 rounded-lg text-sm font-bold bg-neutral-800 hover:bg-black text-white shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-md cursor-pointer flex items-center justify-center gap-2 dark:bg-white dark:text-black"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            Guardar Tipo
          </button>

        </div>
      </div>
    </div>
  );
}