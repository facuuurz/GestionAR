"use client";
import { useState, useEffect } from "react";

export default function FiltroCuentas({ isOpen, onClose, onApply, currentFilters }: any) {
  const [estado, setEstado] = useState("Todos");
  const [saldoRange, setSaldoRange] = useState({ min: "", max: "" });

  useEffect(() => {
    if (isOpen && currentFilters) {
      setEstado(currentFilters.estado || "Todos");
      setSaldoRange(currentFilters.saldoRange || { min: "", max: "" });
    }
  }, [isOpen, currentFilters]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({ estado, saldoRange });
    onClose();
  };

  const handleReset = () => {
    setEstado("Todos");
    setSaldoRange({ min: "", max: "" });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className="relative w-full max-w-md bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl ring-1 ring-black/5 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Cabecera */}
        <div className="flex items-center justify-between p-5 border-b border-[#ededed] dark:border-[#333]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-neutral-700 dark:text-white">filter_list</span>
            <h3 className="text-lg font-bold text-primary dark:text-white">Filtrar Cuentas</h3>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-neutral-800 dark:hover:text-white transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Cuerpo */}
        <div className="p-6 flex flex-col gap-6">
          
          {/* Filtro: Estado */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-neutral-400">verified</span>
              Estado de Cuenta
            </label>
            <div className="relative">
              <select 
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
                className="w-full h-11 px-3 rounded-lg border-2 border-neutral-300 dark:border-neutral-600 bg-white dark:bg-[#2a2a2a] text-sm text-neutral-800 dark:text-white font-medium focus:outline-none focus:border-neutral-500 transition-all cursor-pointer appearance-none"
              >
                <option value="Todos">Todos los estados</option>
                <option value="Al Día">Al Día</option>
                <option value="Deudor">Deudor</option>
                <option value="Pendiente">Pendiente</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">expand_more</span>
            </div>
          </div>

          {/* Filtro: Rango de Saldo */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-neutral-400">attach_money</span>
              Rango de Saldo
            </label>
            <div className="flex gap-3 items-center">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
                <input 
                  type="number" placeholder="Min" value={saldoRange.min}
                  onChange={(e) => setSaldoRange({ ...saldoRange, min: e.target.value })}
                  className="w-full h-10 pl-6 pr-3 rounded-lg border border-[#ededed] dark:border-[#333] bg-white dark:bg-[#252525] text-sm text-neutral-900 dark:text-white outline-none focus:border-neutral-400 transition-colors" 
                />
              </div>
              <span className="text-neutral-400">-</span>
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">$</span>
                <input 
                  type="number" placeholder="Max" value={saldoRange.max}
                  onChange={(e) => setSaldoRange({ ...saldoRange, max: e.target.value })}
                  className="w-full h-10 pl-6 pr-3 rounded-lg border border-[#ededed] dark:border-[#333] bg-white dark:bg-[#252525] text-sm text-neutral-900 dark:text-white outline-none focus:border-neutral-400 transition-colors" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 bg-neutral-50 dark:bg-[#252525]/50 border-t border-[#ededed] dark:border-[#333] flex flex-col sm:flex-row justify-between gap-3">
           <button onClick={handleReset} className="h-10 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold text-red-600 border border-red-200 bg-red-50/50 hover:bg-red-100 hover:border-red-300 transition-all hover:scale-105 active:scale-95 cursor-pointer dark:bg-red-900/10 dark:border-red-900/30 dark:text-red-400">
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