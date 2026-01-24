"use client";

import { useState, useTransition, type ChangeEvent } from "react";
import { crearCategoria } from "@/actions/categorias";

interface AgregarTipoModalProps {
  isOpen: boolean;
  // CAMBIO CLAVE: onClose ahora acepta opcionalmente el nombre creado
  onClose: (nuevoNombre?: string) => void;
}

export default function AgregarTipoModal({ isOpen, onClose }: AgregarTipoModalProps) {
  const [nombre, setNombre] = useState<string>("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string>("");

  if (!isOpen) return null;

  const handleSave = async () => {
    // 1. Validación local simple
    if (!nombre.trim()) {
      setError("Escribe un nombre para la categoría.");
      return;
    }
    setError(""); // Limpiar errores previos

    // 2. Transición asíncrona (Server Action)
    startTransition(async () => {
      const resultado = await crearCategoria(nombre);
      
      if (resultado.success) {
        const nombreGuardado = nombre; // Guardamos referencia del nombre
        setNombre("");                 // Limpiamos el input
        
        // 3. ¡ÉXITO! Cerramos el modal y pasamos el nombre nuevo
        onClose(nombreGuardado); 
      } else {
        // Si falla (ej. duplicado), mostramos el error
        setError(resultado.message);
      }
    });
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNombre(e.target.value);
    if(error) setError(""); // Borrar error al escribir
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      
      {/* Fondo Oscuro */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => onClose()} // Cierre sin guardar
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
            onClick={() => onClose()}
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
                onKeyDown={(e) => e.key === 'Enter' && handleSave()} // Guardar al dar Enter
                disabled={isPending}
                className="flex w-full rounded-lg border border-[#cfd7e7] dark:border-[#4a5568] bg-[#f8f9fc] dark:bg-[#2d3748] text-[#0d121b] dark:text-white focus:ring-2 focus:ring-black/20 focus:border-black dark:focus:border-white h-11 pl-10 pr-4 placeholder:text-[#9ca3af] text-sm font-medium transition-all outline-none disabled:opacity-50" 
                placeholder="Ej. Congelados" 
              />
              <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 flex items-center text-neutral-400">
                <span className="material-symbols-outlined text-[20px]">label</span>
              </div>
            </div>
            
            {/* Mensaje de Error */}
            {error && (
              <p className="text-red-500 text-xs font-medium animate-pulse flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">error</span>
                {error}
              </p>
            )}
          </label>
        </div>

        {/* Footer (Botones) */}
        <div className="p-5 bg-neutral-50 dark:bg-[#252525]/50 border-t border-[#ededed] dark:border-[#333] flex justify-end gap-3">
          
          <button 
            onClick={() => onClose()}
            type="button"
            disabled={isPending}
            className="w-full md:w-auto h-10 px-4 rounded-lg text-sm font-semibold text-neutral-700 dark:text-neutral-200 bg-white dark:bg-transparent border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            Cancelar
          </button>
          
          <button 
            onClick={handleSave} 
            type="button"
            // Deshabilitado si carga o si está vacío
            disabled={isPending || !nombre.trim()}
            className="w-full md:w-auto h-10 px-4 rounded-lg text-sm font-bold bg-neutral-800 hover:bg-black text-white shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-md cursor-pointer flex items-center justify-center gap-2 dark:bg-white dark:text-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
               <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
            ) : (
               <span className="material-symbols-outlined text-[18px]">save</span>
            )}
            {isPending ? "Guardando..." : "Guardar Tipo"}
          </button>

        </div>
      </div>
    </div>
  );
}