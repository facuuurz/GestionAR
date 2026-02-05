"use client";
import { useState, useEffect } from "react";

export default function OrdenarCuentas({ isOpen, onClose, onAplicar, currentSort = "nombre-asc" }: any) {
  const [criterio, setCriterio] = useState(currentSort);

  useEffect(() => {
    // Si currentSort viene vacío, lo forzamos a "nombre-asc" visualmente
    if (isOpen) setCriterio(currentSort || "nombre-asc");
  }, [isOpen, currentSort]);

  if (!isOpen) return null;

  const handleApply = () => {
    // CORRECCIÓN: Enviamos 'criterio' directamente. 
    // Si es "nombre-asc", enviamos "nombre-asc", no "".
    onAplicar(criterio, true);
    onClose();
  };

  const handleReset = () => {
    // Al resetear, volvemos al default explícito
    setCriterio("nombre-asc");
    onAplicar("nombre-asc", false); // Ojo: enviar el valor explícito aquí también
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative w-full max-w-sm bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl ring-1 ring-black/5 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-5 border-b border-[#ededed] dark:border-[#333]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-neutral-700 dark:text-white">sort</span>
            <h3 className="text-lg font-bold text-primary dark:text-white">Ordenar Cuentas</h3>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-800 dark:hover:text-white transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        <div className="p-2 flex flex-col gap-1">
          <SortOption label="Nombre (A - Z)" value="nombre-asc" icon="sort_by_alpha" current={criterio} set={setCriterio} />
          <SortOption label="Nombre (Z - A)" value="nombre-desc" icon="sort_by_alpha" current={criterio} set={setCriterio} />
          <SortOption label="Mayor Saldo" value="saldo-desc" icon="trending_up" current={criterio} set={setCriterio} />
          <SortOption label="Menor Saldo" value="saldo-asc" icon="trending_down" current={criterio} set={setCriterio} />
        </div>

        <div className="p-5 bg-neutral-50 dark:bg-[#252525]/50 border-t border-[#ededed] dark:border-[#333] flex flex-col sm:flex-row justify-between gap-3">
           <button onClick={handleReset} className="h-10 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold text-red-600 border border-red-200 bg-red-50/50 hover:bg-red-100 dark:bg-red-900/10 dark:text-red-400">
             <span className="material-symbols-outlined text-[18px]">restart_alt</span> Restablecer
           </button>
           <button onClick={handleApply} className="w-full sm:w-auto h-10 px-6 rounded-lg text-sm font-bold bg-neutral-800 hover:bg-black text-white shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 dark:bg-white dark:text-black">
             <span className="material-symbols-outlined text-[18px]">check</span> Aplicar
           </button>
        </div>
      </div>
    </div>
  );
}

function SortOption({ label, value, icon, current, set }: any) {
    // CORRECCIÓN: Simplificamos la lógica de selección
    const isSelected = current === value;
    
    return (
        <label className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all group ${isSelected ? "bg-neutral-100 dark:bg-[#2a2a2a]" : "hover:bg-neutral-50 dark:hover:bg-[#252525]"}`}>
            <div className="flex items-center gap-3">
              <span className={`material-symbols-outlined transition-colors ${isSelected ? "text-neutral-900 dark:text-white" : "text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-300"}`}>{icon}</span>
              <span className={`text-sm font-medium transition-colors ${isSelected ? "text-neutral-900 dark:text-white" : "text-neutral-700 dark:text-neutral-200"}`}>{label}</span>
            </div>
            <input type="radio" name="ordenar" value={value} checked={isSelected} onChange={(e) => set(e.target.value)} className="accent-black dark:accent-white w-4 h-4 cursor-pointer" />
        </label>
    )
}