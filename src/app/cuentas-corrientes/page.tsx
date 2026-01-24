"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// Componentes
import FiltroCuentas from "@/components/Cuentas-corrientes/FiltroCuentas/FiltroCuentas"; 
import OrdenarCuentas from "@/components/Cuentas-corrientes/OrdenarCuentas";
import FilaCliente from "@/components/Cuentas-corrientes/FilaCliente/FilaCliente";
import BarraNavegacionCuentas from "@/components/Cuentas-corrientes/BarraNavegacionCuentas"; 
import { useClientes } from "@/hooks/useClientes";

export default function CuentasCorrientesPage() {
  // --- 1. ESTADOS DE UI ---
  const [showFilters, setShowFilters] = useState(false);
  const [mostrarOrdenar, setMostrarOrdenar] = useState(false);
  
  // --- 2. ESTADOS DE DATOS ---
  const [busqueda, setBusqueda] = useState(""); 
  const [activeFilters, setActiveFilters] = useState({ 
    estado: "Todos",
    saldoRange: { min: "", max: "" }
  });
  const [currentSort, setCurrentSort] = useState(""); 

  // --- 3. DATA DESDE EL HOOK ---
  const { clientes, setCriterioOrden, loading } = useClientes();

  // --- 4. LÓGICA DE FILTRADO ---
  const clientesFiltrados = useMemo(() => {
    return clientes.filter((cliente) => {
      // Lógica de búsqueda
      let matchesSearch = true;
      if (busqueda) {
        const termino = busqueda.toLowerCase();
        const matches = [
            cliente.nombre, 
            cliente.cuit, 
            cliente.estado, 
            cliente.id.toString()
        ];
        matchesSearch = matches.some(field => field?.toLowerCase().includes(termino));
      }

      // Filtro Estado
      let matchesEstado = true;
      if (activeFilters.estado !== "Todos") {
          matchesEstado = cliente.estado === activeFilters.estado;
      }

      // Filtro Rango Saldo
      let matchesSaldo = true;
      const saldo = Number(cliente.saldo);
      const min = activeFilters.saldoRange.min ? Number(activeFilters.saldoRange.min) : -Infinity; // Permitimos negativos
      const max = activeFilters.saldoRange.max ? Number(activeFilters.saldoRange.max) : Infinity;
      
      // Ajuste simple: si solo ponen min/max, validamos el rango
      if (activeFilters.saldoRange.min !== "" && saldo < min) matchesSaldo = false;
      if (activeFilters.saldoRange.max !== "" && saldo > max) matchesSaldo = false;

      return matchesSearch && matchesEstado && matchesSaldo;
    });
  }, [clientes, busqueda, activeFilters]);

  // Manejadores
  const handleApplyFilters = (filtros: any) => setActiveFilters(filtros);

  const handleApplySort = (criterio: string, cerrarModal: boolean = true) => {
    setCriterioOrden(criterio);
    setCurrentSort(criterio);
    if (cerrarModal) setMostrarOrdenar(false);
  };

  return (
    <main className="flex flex-1 flex-col items-center py-8 px-4 sm:px-10 md:px-20 lg:px-40 w-full max-w-360 mx-auto overflow-hidden relative min-h-screen bg-[#f6f6f8] dark:bg-[#101622]">
      
      {/* --- MODALES --- */}
      <FiltroCuentas 
        isOpen={showFilters} 
        onClose={() => setShowFilters(false)} 
        onApply={handleApplyFilters} 
        currentFilters={activeFilters}
      />
      
      <OrdenarCuentas
        isOpen={mostrarOrdenar}
        onClose={() => setMostrarOrdenar(false)}
        onAplicar={handleApplySort}
        currentSort={currentSort}
      />

      <div className="w-full flex flex-col gap-6 h-full">
        
        {/* Breadcrumbs */}
        <div className="flex flex-wrap gap-2 items-center text-sm shrink-0">
          <Link href="/" className="text-neutral-500 hover:text-primary dark:hover:text-white font-medium transition-colors hover:text-blue-600 ">
            Panel
          </Link>
          <span className="material-symbols-outlined text-neutral-400 text-base">chevron_right</span>
          <span className="text-primary dark:text-white font-bold">Cuentas Corrientes</span>
        </div>

        {/* Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
          <div className="flex flex-col gap-1">
            <h1 className="text-primary dark:text-white tracking-tight text-[32px] font-bold leading-tight">
              Cuentas Corrientes
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm font-normal">
              Gestiona los saldos y estados de cuenta de tus clientes.
            </p>
          </div>
          <Link className="group flex items-center gap-2 cursor-pointer justify-center overflow-hidden rounded-lg h-10 px-5 bg-neutral-800 text-white shadow-sm transition-all duration-300 hover:bg-black hover:shadow-lg hover:shadow-neutral-500/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm" href="/cuentas-corrientes/nuevo">
            <span className="material-symbols-outlined text-[20px] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-90">add</span>
            <span className="text-sm font-bold truncate">Agregar Nueva Cuenta Corriente</span>
          </Link>
        </div>

        {/* --- BARRA NAVEGACIÓN --- */}
        <BarraNavegacionCuentas 
            busqueda={busqueda}
            onSearchChange={setBusqueda}
            onOpenFilters={() => setShowFilters(true)}
            onOpenSort={() => setMostrarOrdenar(true)}
            hasActiveFilters={
                activeFilters.estado !== "Todos" || 
                activeFilters.saldoRange.min !== "" || 
                activeFilters.saldoRange.max !== ""
            }
            hasActiveSort={!!currentSort} 
        />

        {/* Tabla */}
        <div className="flex flex-col rounded-xl border border-[#ededed] dark:border-[#333] bg-white dark:bg-[#1e2736] overflow-hidden shadow-sm flex-1 min-h-0">
          <div className="overflow-x-auto overflow-y-auto h-full relative custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#f9f9f9] dark:bg-[#151a25] border-b border-[#ededed] dark:border-[#333] sticky top-0 z-20">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">ID Cliente</th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider min-w-50">Cliente / Razón Social</th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Estado</th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Saldo Actual</th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider text-center sticky right-0 bg-[#f9f9f9] dark:bg-[#151a25] shadow-[-1px_0_0_0_#ededed] dark:shadow-[-1px_0_0_0_#333]">Acciones</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-[#ededed] dark:divide-[#333]">
                {loading ? (
                   <tr>
                     <td colSpan={5} className="text-center py-20">
                       <div className="flex flex-col items-center justify-center gap-2">
                          <span className="material-symbols-outlined animate-spin text-3xl text-primary dark:text-white">progress_activity</span>
                          <span className="text-neutral-400 text-sm">Cargando cuentas...</span>
                       </div>
                     </td>
                   </tr>
                ) : clientesFiltrados.length > 0 ? (
                    clientesFiltrados.map((cliente) => (
                      <FilaCliente key={cliente.id} cliente={cliente} />
                    ))
                ) : (
                   <tr>
                       <td colSpan={5} className="text-center py-12 text-neutral-500 text-sm">
                           <div className="flex flex-col items-center gap-2">
                               <span className="material-symbols-outlined text-4xl text-neutral-300">search_off</span>
                               <p>
                                 {busqueda 
                                   ? `No se encontraron clientes para "${busqueda}"` 
                                   : "No se encontraron cuentas con los filtros aplicados."}
                               </p>
                               {(activeFilters.estado !== "Todos" || busqueda || currentSort) && (
                                   <button 
                                     onClick={() => {
                                          setBusqueda("");
                                          setActiveFilters({ estado: "Todos", saldoRange: { min: "", max: "" } });
                                          setCriterioOrden("");
                                          setCurrentSort("");
                                     }}
                                     className="text-blue-600 hover:underline text-xs font-bold mt-1"
                                   >
                                     Limpiar búsqueda, filtros y orden
                                   </button>
                               )}
                           </div>
                       </td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {!loading && (
            <div className="px-4 py-3 border-t border-[#ededed] dark:border-[#333] bg-[#f9f9f9] dark:bg-[#151a25] text-xs text-neutral-500 font-medium flex justify-between">
                <span>Mostrando {clientesFiltrados.length} cuentas</span>
                <span>Total Cuentas: {clientes.length}</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}