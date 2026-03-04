"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

// Componentes
import FilterModal from "@/components/Inventario/FiltroProducto"; 
import Ordenar from "@/components/Inventario/OrdenarProductos";
import BarraNavegacionInventario from "@/components/Inventario/BarraNavegacionInventario"; 
import EncabezadoInventario from "@/components/Inventario/EncabezadoInventario";
import TablaProductos from "@/components/Inventario/TablaProductos";

// Hooks
import { useProductos } from "@/hooks/useProductos";

export default function InventarioPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isReady, setIsReady] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [mostrarOrdenar, setMostrarOrdenar] = useState(false);
  
  // --- 1. PROTECCIÓN DE BÚSQUEDA (DEBOUNCE LOCAL) ---
  const [busqueda, setBusqueda] = useState(""); 
  const [debouncedBusqueda, setDebouncedBusqueda] = useState("");

  // Este efecto espera 400ms después de la última tecla para actualizar 'debouncedBusqueda'
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedBusqueda(busqueda);
    }, 400);

    return () => {
      clearTimeout(handler); // Si el usuario sigue escribiendo, cancelamos el timer anterior
    };
  }, [busqueda]);

  // --- LEER DATOS DESDE LA URL (Filtros y Paginación) ---
  const currentCategory = searchParams.get("categoria") || "Todas";
  const currentStock = searchParams.get("stock") || "all";
  const currentMinPrice = searchParams.get("min") || "";
  const currentMaxPrice = searchParams.get("max") || "";
  const currentSort = searchParams.get("sort") || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  const activeFilters = useMemo(() => ({
    category: currentCategory,
    stockStatus: currentStock,
    priceRange: { min: currentMinPrice, max: currentMaxPrice }
  }), [currentCategory, currentStock, currentMinPrice, currentMaxPrice]);

  // --- DATA DESDE EL HOOK (Ahora extraemos 'error') ---
  const { productos, totalPages, loading, error, recargar } = useProductos();

  const createQueryString = useCallback(
    (updates: Record<string, string | number | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "" || value === "Todas" || value === "all" || (key === 'page' && value === 1)) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });
      
      return params.toString();
    },
    [searchParams]
  );

  // --- EFECTO DE RECARGA (Escucha a la búsqueda retrasada) ---
  useEffect(() => {
    recargar({
      query: debouncedBusqueda, // <-- ¡Clave! Usamos el valor protegido
      category: currentCategory,
      stockStatus: currentStock,
      priceMin: currentMinPrice,
      priceMax: currentMaxPrice,
      sort: currentSort,
      page: currentPage 
    });
    
    setIsReady(true); 
  }, [debouncedBusqueda, currentCategory, currentStock, currentMinPrice, currentMaxPrice, currentSort, currentPage, recargar]);

  const categoriasUnicas = useMemo(() => {
    const tipos = productos
        .map(p => p.tipo)
        .filter((t): t is string => t !== null && t.trim() !== "");
    return Array.from(new Set(tipos));
  }, [productos]);

  // --- MANEJADORES ---
  const handleApplyFilters = (filtros: any) => {
    router.push(`${pathname}?${createQueryString({ 
      categoria: filtros.category,
      stock: filtros.stockStatus,
      min: filtros.priceRange.min,
      max: filtros.priceRange.max,
      page: 1 
    })}`, { scroll: false });
  };

  const handleApplySort = (criterio: string, cerrarModal: boolean = true) => {
    router.push(`${pathname}?${createQueryString({ sort: criterio, page: 1 })}`, { scroll: false });
    if (cerrarModal) setMostrarOrdenar(false);
  };

  const handleClearFilters = () => {
    setBusqueda(""); 
    router.push(pathname, { scroll: false }); 
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      router.push(`${pathname}?${createQueryString({ page: newPage })}`, { scroll: false });
    }
  };

  const isFilterModalActive = currentCategory !== "Todas" || currentStock !== "all" || currentMinPrice !== "" || currentMaxPrice !== "";
  const isAnythingActive = isFilterModalActive || busqueda !== "" || currentSort !== "";

  // --- RENDERIZADO ---
  return (
    <main className="flex flex-1 flex-col items-center py-8 px-4 sm:px-10 md:px-20 lg:px-40 w-full max-w-360 mx-auto overflow-hidden relative min-h-screen bg-[#f6f6f8] dark:bg-[#101622]">
      
      <FilterModal isOpen={showFilters} onClose={() => setShowFilters(false)} onApply={handleApplyFilters} currentFilters={activeFilters} categoriasDisponibles={categoriasUnicas} />
      <Ordenar isOpen={mostrarOrdenar} onClose={() => setMostrarOrdenar(false)} onAplicar={handleApplySort} currentSort={currentSort} />

      <div className="w-full flex flex-col gap-6 h-full">
        <EncabezadoInventario />

        <BarraNavegacionInventario 
            busqueda={busqueda} // El usuario ve su texto al instante
            onSearchChange={(val) => {
                setBusqueda(val);
                router.push(`${pathname}?${createQueryString({ page: 1 })}`, { scroll: false });
            }} 
            onOpenFilters={() => setShowFilters(true)}
            onOpenSort={() => setMostrarOrdenar(true)}
            hasActiveFilters={isFilterModalActive} 
            hasActiveSort={!!currentSort} 
        />

        {/* --- 2. CARTEL DE ERROR DE CONEXIÓN --- */}
        {error && (
          <div className="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-red-500 dark:text-red-400 text-2xl">cloud_off</span>
              <div className="flex flex-col">
                <p className="text-red-800 dark:text-red-300 font-semibold text-sm">Problema de conexión</p>
                <p className="text-red-600 dark:text-red-400 text-xs">{error}</p>
              </div>
            </div>
            <button 
              onClick={() => recargar()} 
              className="shrink-0 px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-800/50 dark:hover:bg-red-800 text-red-700 dark:text-red-300 text-xs font-bold rounded-lg transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Solo mostramos la tabla si NO hay error crítico. 
            (Podés decidir mostrarla vacía, pero ocultarla cuando hay error es más limpio) */}
        {!error && (
          <TablaProductos 
              productos={productos}
              loading={loading || !isReady} 
              busqueda={debouncedBusqueda} 
              hasActiveFilters={isAnythingActive} 
              onClearFilters={handleClearFilters}
          />
        )}
        
        {/* Controles de Paginación */}
        {totalPages > 1 && !error && (
          <div className="flex justify-between items-center mt-4 px-2">
            <button 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1 || loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1e2736] border border-gray-300 dark:border-[#333] rounded-md hover:bg-gray-50 dark:hover:bg-[#2a3649] disabled:opacity-50 transition-colors"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-700 dark:text-gray-400">
              Página <span className="font-semibold text-primary dark:text-white">{currentPage}</span> de <span className="font-semibold text-primary dark:text-white">{totalPages}</span>
            </span>
            <button 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage === totalPages || loading}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1e2736] border border-gray-300 dark:border-[#333] rounded-md hover:bg-gray-50 dark:hover:bg-[#2a3649] disabled:opacity-50 transition-colors"
            >
              Siguiente
            </button>
          </div>
        )}

      </div>
    </main>
  );
}