"use client";

import Link from 'next/link';
import React, { useState } from 'react';
import FiltroFechaModal from '@/components/Historial/FiltroFechaModal'; 

// 1. Definimos la interfaz de los datos que vienen del servidor
interface VentaData {
  idRaw: number;
  id: string;       // "#V-1024"
  fecha: string;    // "24/05/2023"
  cuit: string;
  monto: string;
}

interface HistorialVentasProps {
  ventasIniciales: VentaData[];
}

export default function HistorialVentas({ ventasIniciales }: HistorialVentasProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState({
    year: "Todos",
    month: "Todos",
    day: "Todos"
  });

  // 2. Usamos ventasIniciales en lugar del array fijo
  const ventasFiltradas = ventasIniciales.filter((venta) => {
    // A. Filtrado por término
    const term = searchTerm.toLowerCase();
    // Agregamos seguridad (venta.cuit || "") por si viene nulo
    const matchSearch = venta.id.toLowerCase().includes(term) || (venta.cuit || "").toLowerCase().includes(term);

    // B. Filtrado por Fecha Exacta
    const [vDia, vMes, vAnio] = venta.fecha.split("/");

    const matchDay = dateFilter.day === "Todos" || dateFilter.day === vDia;
    const matchMonth = dateFilter.month === "Todos" || dateFilter.month === vMes;
    const matchYear = dateFilter.year === "Todos" || dateFilter.year === vAnio;

    return matchSearch && matchDay && matchMonth && matchYear;
  });

  const handleApplyFilters = (filtros: any) => {
    setDateFilter(filtros);
  };

  return (
    <main className="flex-1 flex flex-col overflow-hidden px-6 lg:px-20 py-6 max-w-360 mx-auto w-full gap-6 bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 h-full relative">
      
      
      <FiltroFechaModal 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        currentFilter={dateFilter}
      />


      {/* TABLA */}
      <div className="flex-1 min-h-0 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <table className="w-full border-collapse text-left">
            {/* ... THEAD igual ... */}
            <thead className="sticky top-0 bg-slate-50 dark:bg-slate-950 z-20 shadow-sm">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Fecha</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">ID Venta</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">CUIT/CUIL Cuenta</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Monto Total</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-center">Acción</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {ventasFiltradas.length > 0 ? (
                ventasFiltradas.map((venta) => (
                  <tr key={venta.idRaw} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-400">{venta.fecha}</td>
                    <td className="px-6 py-5 text-sm font-mono font-medium text-cyan-600 hover:underline hover:cursor-pointer underline-offset-4">
                      {venta.id}
                    </td>
                    <td className={`px-6 py-5 text-sm font-mono font-medium ${venta.cuit === '-' ? 'text-slate-400 dark:text-slate-600' : 'text-cyan-600 hover:underline hover:cursor-pointer underline-offset-4 dark:text-slate-300'}`}>
                      {venta.cuit}
                    </td>
                    <td className="px-6 py-5 text-sm font-bold text-slate-900 dark:text-white">{venta.monto}</td>
                    
                    <td className="px-4 py-3 text-center sticky right-0 bg-white dark:bg-slate-900 group-hover:bg-neutral-50 dark:group-hover:bg-slate-800 transition-colors z-10 shadow-[-1px_0_0_0_#ededed] dark:shadow-[-1px_0_0_0_#333]">
                      <Link
                        href={`/historial-ventas/${venta.idRaw}`}
                        className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-sm hover:shadow-md text-white bg-neutral-800 hover:bg-black dark:bg-white dark:text-black"
                      >
                        <span className="material-symbols-outlined text-[16px]">visibility</span>
                        <span>Ver Detalles</span>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
                    No se encontraron registros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}