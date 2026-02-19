"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import Link from "next/link";

// Tipos sugeridos para el historial
type VentaResumen = {
  id: number;
  codigoVenta: string;
  fecha: string;
  cliente: string;
  montoTotal: number;
  metodoPago: string;
};

export default function HistorialVentas() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Estado para filtros de fecha
  const [filtros, setFiltros] = useState({
    dia: "Todos",
    mes: "Todos",
    anio: "2024"
  });

  // Datos de ejemplo (Esto vendría de una Server Action)
  const [ventas, setVentas] = useState<VentaResumen[]>([
    { id: 1, codigoVenta: "#V-1024", fecha: "24/05/2023", cliente: "Consumidor Final", montoTotal: 15500, metodoPago: "Efectivo" },
    { id: 2, codigoVenta: "#V-1023", fecha: "23/05/2023", cliente: "Juan Perez", montoTotal: 8200, metodoPago: "Cuenta Corriente" },
    { id: 3, codigoVenta: "#V-1022", fecha: "22/05/2023", cliente: "Consumidor Final", montoTotal: 45000, metodoPago: "Efectivo" },
  ]);

  const formatMoney = (n: number) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(n);

  return (
    <div className="flex-1 flex flex-col overflow-hidden px-6 lg:px-20 py-6 max-w-360 mx-auto w-full gap-6 bg-[#f6f6f8] dark:bg-[#101622]">
      
      {/* TÍTULO Y面包屑 (Breadcrumbs) */}
      <div className="space-y-4 shrink-0">
        <div className="flex flex-wrap gap-2 items-center text-sm shrink-0">
          <Link href="/" className="text-neutral-500 hover:text-primary dark:hover:text-white font-medium transition-colors hover:text-blue-600 ">
            Panel
          </Link>
          <span className="material-symbols-outlined text-neutral-400 text-base">chevron_right</span>
          <span className="text-primary dark:text-white font-bold">Inventario</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Historial de Ventas</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">Mostrando {ventas.length} registros de ventas</p>
        </div>
      </div>

      {/* BARRA DE BÚSQUEDA Y FILTROS */}
      <div className="shrink-0 flex flex-col xl:flex-row gap-4">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
            <span className="material-symbols-outlined">search</span>
          </div>
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="block w-full pl-11 pr-4 py-4 bg-white dark:bg-slate-800 border-none rounded-xl ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary shadow-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-all outline-none"
            placeholder="Buscar por ID de venta o nombre del cliente..." 
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white dark:bg-slate-800 rounded-xl ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm p-1">
            <FechaSelect label="Día" value={filtros.dia} options={["Todos", "01", "02", "03"]} onChange={(v) => setFiltros({...filtros, dia: v})} />
            <FechaSelect label="Mes" value={filtros.mes} options={["Todos", "Enero", "Febrero", "Marzo"]} onChange={(v) => setFiltros({...filtros, mes: v})} border />
            <FechaSelect label="Año" value={filtros.anio} options={["2024", "2023", "2022"]} onChange={(v) => setFiltros({...filtros, anio: v})} border />
          </div>
          
          <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-950 px-6 py-4 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">filter_list</span>
            Filtrar
          </button>
        </div>
      </div>

      {/* TABLA DE RESULTADOS */}
      <div className="flex-1 min-h-0 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <table className="w-full border-collapse text-left">
            <thead className="sticky top-0 bg-slate-50 dark:bg-slate-950 z-20 shadow-sm">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Fecha</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">ID Venta</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Cliente</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Monto Total</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {ventas.map((venta) => (
                <tr key={venta.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-400">{venta.fecha}</td>
                  <td className="px-6 py-5 text-sm font-mono font-medium text-primary">{venta.codigoVenta}</td>
                  <td className="px-6 py-5 text-sm text-slate-700 dark:text-slate-300 font-medium">{venta.cliente}</td>
                  <td className="px-6 py-5 text-sm font-bold text-slate-900 dark:text-white">{formatMoney(venta.montoTotal)}</td>
                  <td className="px-6 py-5 text-right">
                    <button className="bg-primary/10 hover:bg-primary text-primary hover:text-white px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm">
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

// Sub-componente para los selectores de la barra de filtros
function FechaSelect({ label, value, options, onChange, border }: { label: string, value: string, options: string[], onChange: (v: string) => void, border?: boolean }) {
  return (
    <div className={`flex flex-col px-3 ${border ? 'border-l border-slate-200 dark:border-slate-700' : ''}`}>
      <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">{label}</label>
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent border-none p-0 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:ring-0 cursor-pointer outline-none"
      >
        {options.map(opt => <option key={opt} value={opt} className="dark:bg-slate-800">{opt}</option>)}
      </select>
    </div>
  );
}