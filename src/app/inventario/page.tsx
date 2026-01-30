"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";

// Componentes
import FilterModal from "@/components/Inventario/FiltroProducto"; 
import Ordenar from "@/components/Inventario/OrdenarProductos";
import ProductRow from "@/components/Inventario/ListaProductos";
import BarraNavegacionInventario from "@/components/Inventario/BarraNavegacionInventario"; 
import { useProductos } from "@/hooks/useProductos";

export default function InventarioPage() {
  // --- 1. ESTADOS DE UI ---
  const [showFilters, setShowFilters] = useState(false);
  const [mostrarOrdenar, setMostrarOrdenar] = useState(false);
  
  // --- 2. ESTADOS DE DATOS ---
  const [busqueda, setBusqueda] = useState(""); 
  const [activeFilters, setActiveFilters] = useState({ 
    category: "Todas",
    stockStatus: "all", 
    priceRange: { min: "", max: "" }
  });
  const [currentSort, setCurrentSort] = useState(""); 

  // --- 3. DATA DESDE EL HOOK (MODIFICADO) ---
  // Obtenemos 'recargar' y usamos 'productos' directos (ya vienen filtrados)
  const { productos, loading, recargar } = useProductos();

  // --- 4. EFECTO: PEDIR DATOS AL SERVIDOR CUANDO CAMBIAN FILTROS ---
  useEffect(() => {
    recargar({
      query: busqueda,
      category: activeFilters.category,
      stockStatus: activeFilters.stockStatus,
      priceMin: activeFilters.priceRange.min,
      priceMax: activeFilters.priceRange.max,
      sort: currentSort
    });
  }, [busqueda, activeFilters, currentSort, recargar]);

  // --- 5. EXTRACCIÓN DE CATEGORÍAS ---
  // Nota: Esto mostrará solo categorías de los productos visibles. 
  // Idealmente deberías cargar todas las categorías en un hook aparte si quieres verlas siempre.
  const categoriasUnicas = useMemo(() => {
    const tipos = productos
        .map(p => p.tipo)
        .filter(t => t && t.trim() !== "");
    return Array.from(new Set(tipos));
  }, [productos]);

  // Manejadores
  const handleApplyFilters = (filtros: any) => setActiveFilters(filtros);

  const handleApplySort = (criterio: string, cerrarModal: boolean = true) => {
    setCurrentSort(criterio);
    if (cerrarModal) setMostrarOrdenar(false);
  };

  // Verificamos si hay filtros activos para mostrar el botón de limpiar
  const hasActiveFilters = 
    activeFilters.category !== "Todas" || 
    activeFilters.stockStatus !== "all" || 
    activeFilters.priceRange.min !== "" || 
    activeFilters.priceRange.max !== "" ||
    busqueda !== "" ||
    currentSort !== "";

  return (
    <main className="flex flex-1 flex-col items-center py-8 px-4 sm:px-10 md:px-20 lg:px-40 w-full max-w-360 mx-auto overflow-hidden relative min-h-screen bg-[#f6f6f8] dark:bg-[#101622]">
      
      {/* --- MODALES --- */}
      <FilterModal 
        isOpen={showFilters} 
        onClose={() => setShowFilters(false)} 
        onApply={handleApplyFilters} 
        currentFilters={activeFilters}
        categoriasDisponibles={categoriasUnicas} 
      />
      
      <Ordenar
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
          <span className="text-primary dark:text-white font-bold">Inventario</span>
        </div>

        {/* Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
          <div className="flex flex-col gap-1">
            <h1 className="text-primary dark:text-white tracking-tight text-[32px] font-bold leading-tight">
              Lista de Productos
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm font-normal">
              Gestiona el inventario, precios y stock de tus productos.
            </p>
          </div>
          <Link className="group flex items-center gap-2 cursor-pointer justify-center overflow-hidden rounded-lg h-10 px-5 bg-neutral-800 text-white shadow-sm transition-all duration-300 hover:bg-black hover:shadow-lg hover:shadow-neutral-500/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm" href="./inventario/nuevo-producto">
            <span className="material-symbols-outlined text-[20px] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-90">add</span>
            <span className="text-sm font-bold truncate">Agregar Nuevo Producto</span>
          </Link>
        </div>

        {/* Barra de Navegación */}
        <BarraNavegacionInventario 
            busqueda={busqueda}
            onSearchChange={setBusqueda}
            onOpenFilters={() => setShowFilters(true)}
            onOpenSort={() => setMostrarOrdenar(true)}
            hasActiveFilters={
                activeFilters.category !== "Todas" || 
                activeFilters.stockStatus !== "all" || 
                activeFilters.priceRange.min !== "" || 
                activeFilters.priceRange.max !== ""
            }
            hasActiveSort={!!currentSort} 
        />

        {/* Tabla */}
        <div className="flex flex-col rounded-xl border border-[#ededed] dark:border-[#333] bg-white dark:bg-[#1e2736] overflow-hidden shadow-sm flex-1 min-h-0">
          <div className="overflow-x-auto overflow-y-auto h-full relative custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#f9f9f9] dark:bg-[#151a25] border-b border-[#ededed] dark:border-[#333] sticky top-0 z-20">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Código</th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider min-w-50">Producto</th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Stock</th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Vencimiento</th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Precio Unit.</th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider whitespace-nowrap">Cod. Prov.</th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider text-center sticky right-0 bg-[#f9f9f9] dark:bg-[#151a25] shadow-[-1px_0_0_0_#ededed] dark:shadow-[-1px_0_0_0_#333]">Acciones</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-[#ededed] dark:divide-[#333]">
                {loading ? (
                   <tr>
                     <td colSpan={8} className="text-center py-20">
                       <div className="flex flex-col items-center justify-center gap-2">
                          <span className="material-symbols-outlined animate-spin text-3xl text-primary dark:text-white">progress_activity</span>
                          <span className="text-neutral-400 text-sm">Cargando inventario...</span>
                       </div>
                     </td>
                   </tr>
                ) : productos.length > 0 ? (
                   // Usamos 'productos' directamente en lugar de 'productosFiltrados'
                   productos.map((prod) => (
                     <ProductRow key={prod.id} prod={prod} />
                   ))
                ) : (
                   <tr>
                       <td colSpan={8} className="text-center py-12 text-neutral-500 text-sm">
                           <div className="flex flex-col items-center gap-2">
                               <span className="material-symbols-outlined text-4xl text-neutral-300">search_off</span>
                               <p>
                                 {busqueda 
                                   ? `No se encontraron productos que coincidan con "${busqueda}"` 
                                   : "No se encontraron productos con los filtros aplicados."}
                               </p>
                               {hasActiveFilters && (
                                   <button 
                                     onClick={() => {
                                         setBusqueda("");
                                         setActiveFilters({ category: "Todas", stockStatus: "all", priceRange: { min: "", max: "" } });
                                         setCurrentSort("");
                                         // recargar se llamará automáticamente por el useEffect
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
                <span>Mostrando {productos.length} productos</span>
                {/* Nota: Para mostrar el total real de la BD necesitarías que el server devuelva 'count' también */}
                <span>Resultados: {productos.length}</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}