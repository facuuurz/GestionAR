"use client";

import { useState, useEffect } from "react";

const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

export default function FilterModalHistorial({ isOpen, onClose, onApply, currentFilters }: any) {
  const [tempFilters, setTempFilters] = useState(currentFilters);

  // Generar años (2020 hasta 2030 por ejemplo)
  const añosDisponibles = Array.from({ length: 11 }, (_, i) => (2020 + i).toString());

  // Calcular días dinámicos
  const getDaysInMonth = (monthName: string, year: string) => {
    if (monthName === "Todos") return 31;
    const monthIndex = MESES.indexOf(monthName);
    return new Date(parseInt(year), monthIndex + 1, 0).getDate();
  };

  const diasDisponibles = Array.from(
    { length: getDaysInMonth(tempFilters.mes, tempFilters.anio) }, 
    (_, i) => (i + 1).toString().padStart(2, '0')
  );

  useEffect(() => {
    if (isOpen) setTempFilters(currentFilters);
  }, [isOpen, currentFilters]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative w-full max-w-md bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-[#ededed] dark:border-[#333]">
          <h3 className="text-lg font-bold dark:text-white">Filtrar por Fecha</h3>
          <button onClick={onClose} className="material-symbols-outlined text-neutral-500">close</button>
        </div>

        <div className="p-6 space-y-5">
          {/* SELECTOR DE AÑO */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-400 uppercase">Año</label>
            <select 
              value={tempFilters.anio}
              onChange={(e) => setTempFilters({...tempFilters, anio: e.target.value})}
              className="w-full p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 dark:text-white outline-none ring-1 ring-transparent focus:ring-black"
            >
              <option value="Todos">Todos los años</option>
              {añosDisponibles.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* SELECTOR DE MES */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400 uppercase">Mes</label>
              <select 
                value={tempFilters.mes}
                onChange={(e) => setTempFilters({...tempFilters, mes: e.target.value, dia: "Todos"})}
                className="w-full p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 dark:text-white outline-none"
              >
                <option value="Todos">Todos</option>
                {MESES.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            {/* SELECTOR DE DÍA (DINÁMICO) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-neutral-400 uppercase">Día</label>
              <select 
                value={tempFilters.dia}
                onChange={(e) => setTempFilters({...tempFilters, dia: e.target.value})}
                className="w-full p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 dark:text-white outline-none"
              >
                <option value="Todos">Todos</option>
                {diasDisponibles.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="p-5 bg-neutral-50 dark:bg-[#252525]/50 border-t border-[#ededed] dark:border-[#333] flex justify-between">
          <button 
            onClick={() => setTempFilters({dia: "Todos", mes: "Todos", anio: "Todos"})}
            className="text-sm font-semibold text-red-600 px-4 py-2"
          >
            Limpiar
          </button>
          <button 
            onClick={() => { onApply(tempFilters); onClose(); }}
            className="bg-black dark:bg-white text-white dark:text-black px-6 py-2 rounded-lg font-bold text-sm shadow-md transition-transform active:scale-95"
          >
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
}