"use client"; // Importante en Next.js para usar Hooks

import React, { useState } from 'react';

export default function HistorialVentas() {
  // 1. Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  const ventas = [
    { fecha: "24/05/2023", id: "#V-1024", cuit: "20-30456789-2", monto: "$15,500.00" },
    { fecha: "23/05/2023", id: "#V-1023", cuit: "-", monto: "$8,200.00" },
    { fecha: "22/05/2023", id: "#V-1022", cuit: "27-25123456-4", monto: "$45,000.00" },
    { fecha: "21/05/2023", id: "#V-1021", cuit: "-", monto: "$12,000.00" },
    { fecha: "20/05/2023", id: "#V-1020", cuit: "-", monto: "$5,400.00" },
    { fecha: "19/05/2023", id: "#V-1019", cuit: "20-11223344-9", monto: "$2,100.00" },
    { fecha: "18/05/2023", id: "#V-1018", cuit: "-", monto: "$9,350.00" },
    { fecha: "17/05/2023", id: "#V-1017", cuit: "-", monto: "$11,200.00" },
    { fecha: "16/05/2023", id: "#V-1016", cuit: "23-45678901-5", monto: "$7,800.00" },
  ];

  // 2. Lógica de filtrado
  const ventasFiltradas = ventas.filter((venta) => {
    const term = searchTerm.toLowerCase();
    return (
      venta.id.toLowerCase().includes(term) || 
      venta.cuit.toLowerCase().includes(term)
    );
  });

  return (
    <main className="flex-1 flex flex-col overflow-hidden px-6 lg:px-20 py-6 max-w-360 mx-auto w-full gap-6 bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 h-full">
      
      {/* Breadcrumb y Título */}
      <div className="space-y-4 shrink-0">
        <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <a className="hover:text-primary transition-colors hover:underline underline-offset-4" href="#">Panel</a>
          <span className="material-symbols-outlined text-sm leading-none">chevron_right</span>
          <span className="text-slate-900 dark:text-slate-200 font-medium">Historial de Ventas</span>
        </nav>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Historial de Ventas</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">
            Mostrando {ventasFiltradas.length} registros
          </p>
        </div>
      </div>

      {/* Barra de Búsqueda */}
      <div className="shrink-0 flex flex-col xl:flex-row gap-4">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
            <span className="material-symbols-outlined">search</span>
          </div>
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // 3. Actualizar estado
            className="block w-full pl-11 pr-4 py-4 bg-white dark:bg-slate-800 border-none rounded-xl ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-2 focus:ring-primary dark:focus:ring-primary shadow-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-all outline-none" 
            placeholder="Buscar por ID de venta o CUIT/CUIL..." 
          />
        </div>

        {/* Filtros (Día, Mes, Año) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white dark:bg-slate-800 rounded-xl ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm p-1">
            <div className="flex flex-col px-3 border-r border-slate-200 dark:border-slate-700">
              <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">Día</label>
              <select className="bg-transparent border-none p-0 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:ring-0 cursor-pointer">
                <option>Todos</option>
                <option>01</option>
                <option>02</option>
              </select>
            </div>
            <div className="flex flex-col px-3 border-r border-slate-200 dark:border-slate-700">
              <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">Mes</label>
              <select className="bg-transparent border-none p-0 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:ring-0 cursor-pointer">
                <option>Todos</option>
                <option>Enero</option>
                <option>Febrero</option>
              </select>
            </div>
            <div className="flex flex-col px-3">
              <label className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">Año</label>
              <select className="bg-transparent border-none p-0 text-sm font-semibold text-slate-900 dark:text-slate-100 focus:ring-0 cursor-pointer">
                <option>2024</option>
                <option>2023</option>
                <option>2022</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla con resultados filtrados */}
      <div className="flex-1 min-h-0 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <table className="w-full border-collapse text-left">
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
    ventasFiltradas.map((venta, index) => (
      <tr key={index} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group">
        <td className="px-6 py-5 text-sm text-slate-600 dark:text-slate-400">{venta.fecha}</td>
        <td className="px-6 py-5 text-sm font-mono font-medium text-cyan-600 hover:underline hover:cursor-pointer underline-offset-4">
          {venta.id}
        </td>
        <td className={`px-6 py-5 text-sm font-mono font-medium ${venta.cuit === '-' ? 'text-slate-400 dark:text-slate-600' : 'text-cyan-600 hover:underline hover:cursor-pointer underline-offset-4 dark:text-slate-300'}`}>
          {venta.cuit}
        </td>
        <td className="px-6 py-5 text-sm font-bold text-slate-900 dark:text-white">{venta.monto}</td>
        
        {/* Celda de Acción con estilos de "Actualizar" adaptados */}
        <td className="px-4 py-3 text-center sticky right-0 bg-white dark:bg-slate-900 group-hover:bg-neutral-50 dark:group-hover:bg-slate-800 transition-colors z-10 shadow-[-1px_0_0_0_#ededed] dark:shadow-[-1px_0_0_0_#333]">
          <button
            onClick={() => console.log(`Navegando a detalle de: ${venta.id}`)}
            className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-sm hover:shadow-md text-white bg-neutral-800 hover:bg-black dark:bg-white dark:text-black"
          >
            <span className="material-symbols-outlined text-[16px]">
              visibility
            </span>
            <span>Ver Detalles</span>
          </button>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={5} className="px-6 py-10 text-center text-slate-500">
        No se encontraron registros para "{searchTerm}"
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