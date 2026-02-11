"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// Componentes y Hooks
import BarraNavegacionPromociones from "@/components/promociones/BarraNavegacionPromociones"; 
import PromocionRow from "@/components/promociones/PromocionRow";
import { usePromociones } from "@/hooks/usePromociones";

export default function PromocionesPage() {
  const [busqueda, setBusqueda] = useState(""); 
  const { promociones, loading } = usePromociones();

  // Filtrado en el cliente para mayor velocidad
  const promocionesFiltradas = useMemo(() => {
    if (!busqueda) return promociones;
    const termino = busqueda.toLowerCase();
    
    return promociones.filter((promo) => {
      const matches = [promo.nombre, promo.descripcion];
      return matches.some(field => field?.toLowerCase().includes(termino));
    });
  }, [promociones, busqueda]);

  return (
    <main className="flex flex-1 flex-col items-center py-8 px-4 sm:px-10 md:px-20 lg:px-40 w-full max-w-360 mx-auto overflow-hidden relative min-h-screen bg-[#f6f6f8] dark:bg-[#101622]">
      
      <div className="w-full flex flex-col gap-6 h-full">
        
        {/* Breadcrumbs */}
        <div className="flex flex-wrap gap-2 items-center text-sm shrink-0">
          <Link href="/" className="text-neutral-500 hover:text-primary dark:hover:text-white font-medium transition-colors">
            Panel
          </Link>
          <span className="material-symbols-outlined text-neutral-400 text-base">chevron_right</span>
          <span className="text-primary dark:text-white font-bold">Promociones</span>
        </div>

        {/* Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
          <div className="flex flex-col gap-1">
            <h1 className="text-primary dark:text-white tracking-tight text-[32px] font-bold leading-tight">
              Listado de Promociones
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm font-normal">
              Gestiona tus ofertas activas, precios promocionales y vigencias.
            </p>
          </div>
          <Link 
             href="/promociones/nuevo"
             className="group flex items-center gap-2 cursor-pointer justify-center overflow-hidden rounded-lg h-10 px-5 bg-neutral-800 text-white shadow-sm transition-all duration-300 hover:bg-black hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            <span className="material-symbols-outlined text-[20px] transition-transform duration-300 group-hover:rotate-90">add</span>
            <span className="text-sm font-bold truncate">Nueva Promoción</span>
          </Link>
        </div>

        {/* Barra de Búsqueda */}
        <BarraNavegacionPromociones 
            busqueda={busqueda}
            onSearchChange={setBusqueda}
        />

        {/* Tabla de Resultados */}
        <div className="flex flex-col rounded-xl border border-[#ededed] dark:border-[#333] bg-white dark:bg-[#1e2736] overflow-hidden shadow-sm flex-1 min-h-0">
          <div className="overflow-x-auto overflow-y-auto h-full relative custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-200">
              <thead className="bg-[#f9f9f9] dark:bg-[#151a25] border-b border-[#ededed] dark:border-[#333] sticky top-0 z-20">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider w-[20%]">Nombre</th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider w-[25%]">Descripción</th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider w-[15%]">Precio</th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider w-[20%]">Vigencia</th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider w-[10%]">Estado</th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider text-center sticky right-0 bg-[#f9f9f9] dark:bg-[#151a25] shadow-[-1px_0_0_0_#ededed] dark:shadow-[-1px_0_0_0_#333]">Acciones</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-[#ededed] dark:divide-[#333]">
                {loading ? (
                   <tr>
                     <td colSpan={6} className="text-center py-20">
                       <div className="flex flex-col items-center justify-center gap-2">
                          <span className="material-symbols-outlined animate-spin text-3xl text-primary dark:text-white">progress_activity</span>
                          <span className="text-neutral-400 text-sm">Cargando promociones...</span>
                       </div>
                     </td>
                   </tr>
                ) : promocionesFiltradas.length > 0 ? (
                   promocionesFiltradas.map((promo) => (
                     <PromocionRow key={promo.id} promo={promo} />
                   ))
                ) : (
                   <tr>
                       <td colSpan={6} className="text-center py-12 text-neutral-500 text-sm">
                           <div className="flex flex-col items-center gap-2">
                               <span className="material-symbols-outlined text-4xl text-neutral-300">search_off</span>
                               <p>
                                 {busqueda 
                                    ? `No se encontraron promociones que coincidan con "${busqueda}"` 
                                    : "No hay promociones registradas con productos."}
                               </p>
                               {busqueda && (
                                   <button 
                                     onClick={() => setBusqueda("")}
                                     className="text-blue-600 hover:underline text-xs font-bold mt-1"
                                   >
                                     Limpiar búsqueda
                                   </button>
                               )}
                           </div>
                       </td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Footer de la Tabla */}
          {!loading && (
            <div className="px-4 py-3 border-t border-[#ededed] dark:border-[#333] bg-[#f9f9f9] dark:bg-[#151a25] text-xs text-neutral-500 font-medium flex justify-between">
                <span>Mostrando {promocionesFiltradas.length} promociones</span>
                <span>Total: {promociones.length}</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}