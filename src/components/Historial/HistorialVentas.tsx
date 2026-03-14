"use client";

import Link from 'next/link';
import React, { useState } from 'react';
import FiltroFechaModal from '@/components/Historial/FiltroFechaModal'; 

interface VentaData {
  idRaw: number;
  id: string;       // Ej: "#V-1024"
  fecha: string;    // Ej: "24/05/2023"
  cuit: string;
  monto: string;
  vendedorNombre?: string;
}

interface HistorialVentasProps {
  ventasIniciales: VentaData[];
  isAdmin: boolean;
  empleadoNombre?: string | null;
}

export default function HistorialVentas({ ventasIniciales, isAdmin, empleadoNombre }: HistorialVentasProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState({
    year: "Todos",
    month: "Todos",
    day: "Todos"
  });

  // Lógica Combinada de Filtrado (Búsqueda + Fecha)
  const ventasFiltradas = ventasIniciales.filter((venta) => {
    // A. Filtrado por término (ID o CUIT)
    const term = searchTerm.toLowerCase();
    const matchSearch = 
      venta.id.toLowerCase().includes(term) || 
      (venta.cuit || "").toLowerCase().includes(term);

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

  const hasActiveFilter = dateFilter.year !== "Todos" || dateFilter.month !== "Todos" || dateFilter.day !== "Todos";

  return (
    <main className="flex-1 flex flex-col overflow-hidden px-6 lg:px-20 py-6 max-w-360 mx-auto w-full gap-6 bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 h-full relative">
      
      {/* Modal de Filtros */}
      <FiltroFechaModal 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        currentFilter={dateFilter}
      />

      {/* Breadcrumb y Título */}
      <div className="space-y-4 shrink-0">
        <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Link className="hover:text-primary transition-colors hover:underline underline-offset-4" href="/">Panel</Link>
          <span className="material-symbols-outlined text-sm leading-none">chevron_right</span>
          <span className="text-slate-900 dark:text-slate-200 font-medium">Historial de Ventas</span>
        </nav>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            {empleadoNombre ? `Historial de venta de ${empleadoNombre}` : "Historial de Ventas"}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">
            Mostrando {ventasFiltradas.length} registros
          </p>
        </div>
      </div>

      {/* Barra de Búsqueda y Botón de Filtro */}
      <div className="shrink-0 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
            <span className="material-symbols-outlined">search</span>
          </div>
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-800 border-none rounded-xl ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary dark:focus:ring-primary shadow-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-all outline-none" 
            placeholder="Buscar por ID de venta o CUIT/CUIL..." 
          />
        </div>

        <button
          onClick={() => setIsFilterOpen(true)}
          className="group inline-flex items-center justify-center gap-1.5 px-6 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-sm hover:shadow-md text-white bg-neutral-800 hover:bg-black dark:bg-white dark:text-black shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">calendar_month</span>
          <span>Filtrar Fecha</span>
          {hasActiveFilter && (
            <span className="ml-1 w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          )}
        </button>
      </div>

      {/* TABLA */}
      <div className="flex-1 min-h-0 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <table className="w-full border-collapse text-left">
            <thead className="sticky top-0 bg-slate-50 dark:bg-slate-950 z-20 shadow-sm">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Fecha</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">ID Venta</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">CUIT/CUIL Cuenta</th>
                {isAdmin && (
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Vendedor</th>
                )}
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
                    {isAdmin && (
                      <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-300">
                        {venta.vendedorNombre}
                      </td>
                    )}
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