"use client";

import { useState, useMemo } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import Link from "next/link";
import FilterModalHistorial from "@/components/Historial/FilterModalHistorial";

export default function HistorialVentas() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  
  const [filtros, setFiltros] = useState({
    dia: "Todos",
    mes: "Todos",
    anio: new Date().getFullYear().toString()
  });

  // Datos de ejemplo
  const [ventas] = useState([
    { id: 1, codigoVenta: "#V-1024", fecha: "24/02/2026", cliente: "Consumidor Final", montoTotal: 15500, metodoPago: "Efectivo" },
    { id: 2, codigoVenta: "#V-1023", fecha: "23/02/2026", cliente: "Juan Perez", montoTotal: 8200, metodoPago: "Cuenta Corriente" },
  ]);

  const ventasFiltradas = useMemo(() => {
    const mesesNombre = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    
    return ventas.filter(venta => {
      const [vDia, vMes, vAnio] = venta.fecha.split("/");
      const nombreMesVenta = mesesNombre[parseInt(vMes) - 1];

      const matchQuery = venta.codigoVenta.toLowerCase().includes(debouncedQuery.toLowerCase()) || 
                         venta.cliente.toLowerCase().includes(debouncedQuery.toLowerCase());
      
      const matchDia = filtros.dia === "Todos" || vDia === filtros.dia;
      const matchMes = filtros.mes === "Todos" || nombreMesVenta === filtros.mes;
      const matchAnio = filtros.anio === "Todos" || vAnio === filtros.anio;

      return matchQuery && matchDia && matchMes && matchAnio;
    });
  }, [debouncedQuery, filtros, ventas]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden px-6 lg:px-20 py-6 max-w-360 mx-auto w-full gap-6 bg-[#f6f6f8] dark:bg-[#101622]">
      
      <FilterModalHistorial 
        isOpen={isFilterModalOpen} 
        onClose={() => setIsFilterModalOpen(false)} 
        currentFilters={filtros}
        onApply={setFiltros}
      />

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <Link href="/" className="hover:text-black dark:hover:text-white transition-colors">Panel</Link>
          <span className="material-symbols-outlined text-base">chevron_right</span>
          <span className="text-primary dark:text-white font-bold">Historial de Ventas</span>
        </div>
        <div className="flex justify-between items-end">
          <h2 className="text-4xl font-bold dark:text-white">Historial de Ventas</h2>
          <p className="text-slate-500 text-sm font-medium">Resultados: {ventasFiltradas.length}</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-4 bg-white dark:bg-slate-800 rounded-xl ring-1 ring-slate-200 dark:ring-slate-700 outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
            placeholder="Buscar venta o cliente..." 
          />
        </div>

        <button 
          onClick={() => setIsFilterModalOpen(true)}
          className="bg-black dark:bg-white text-white dark:text-black px-6 py-4 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg"
        >
          <span className="material-symbols-outlined">tune</span>
          Filtros
          {(filtros.dia !== "Todos" || filtros.mes !== "Todos") && (
            <span className="size-2 bg-blue-500 rounded-full"></span>
          )}
        </button>
      </div>

      {/* Tabla (Se mantiene igual con el text-center en Acción) */}
      <div className="flex-1 overflow-hidden bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-slate-50 dark:bg-slate-950 shadow-sm">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 text-left">Fecha</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 text-left">ID Venta</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 text-left">Cliente</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 text-left">Total</th>
                <th className="px-6 py-4 text-xs font-bold uppercase text-slate-500 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {ventasFiltradas.map((venta) => (
                <tr key={venta.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                  <td className="px-6 py-5 text-sm dark:text-slate-400">{venta.fecha}</td>
                  <td className="px-6 py-5 text-sm font-mono font-medium dark:text-white">{venta.codigoVenta}</td>
                  <td className="px-6 py-5 text-sm dark:text-slate-300">{venta.cliente}</td>
                  <td className="px-6 py-5 text-sm font-bold dark:text-white">
                    {new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(venta.montoTotal)}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <button className="bg-slate-100 dark:bg-slate-800 dark:text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-black hover:text-white transition-all">
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}