"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

// Hooks
import { useClientes } from "@/hooks/useClientes";

// Componentes
import FiltroCuentas from "@/components/Cuentas-corrientes/FiltroCuentas/FiltroCuentas"; 
import OrdenarCuentas from "@/components/Cuentas-corrientes/OrdenarCuentas";
import BarraNavegacionCuentas from "@/components/Cuentas-corrientes/BarraNavegacionCuentas"; 
import EncabezadoCuentas from "@/components/Cuentas-corrientes/EncabezadoCuentas";
import TablaCuentas from "@/components/Cuentas-corrientes/TablaCuentas";

export default function CuentasCorrientesPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // --- 1. ESTADOS DE UI MODALES ---
  const [showFilters, setShowFilters] = useState(false);
  const [mostrarOrdenar, setMostrarOrdenar] = useState(false);
  
  // --- 2. LEER DATOS DESDE LA URL (Fuente de la verdad) ---
  const urlQuery = searchParams.get("q") || "";
  const currentEstado = searchParams.get("estado") || "Todos";
  const currentMinSaldo = searchParams.get("min") || "";
  const currentMaxSaldo = searchParams.get("max") || "";
  const currentSort = searchParams.get("sort") || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  // Estado local para los modales de filtro
  const activeFilters = {
    estado: currentEstado,
    saldoRange: { min: currentMinSaldo, max: currentMaxSaldo }
  };

  // --- 3. ESTADOS DE BÚSQUEDA (Con Debounce) ---
  const [busqueda, setBusqueda] = useState(urlQuery); 
  const [debouncedBusqueda, setDebouncedBusqueda] = useState(urlQuery);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedBusqueda(busqueda);
    }, 400);
    return () => clearTimeout(handler);
  }, [busqueda]);

  // --- 4. DATA DESDE EL HOOK ---
  const { clientes, totalPages, loading, error, recargar } = useClientes();

  // --- 5. ACTUALIZAR URL DINÁMICAMENTE ---
  const createQueryString = useCallback(
    (updates: Record<string, string | number | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "" || value === "Todos" || (key === 'page' && value === 1)) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });
      return params.toString();
    },
    [searchParams]
  );

  // --- 6. EFECTO PRINCIPAL: Disparar la recarga cuando cambian los parámetros ---
  useEffect(() => {
    // Si la búsqueda escrita cambia, actualizamos la URL
    if (debouncedBusqueda !== urlQuery) {
      router.push(`${pathname}?${createQueryString({ q: debouncedBusqueda, page: 1 })}`, { scroll: false });
    }

    // Llamamos al servidor
    recargar({
      query: debouncedBusqueda,
      estado: currentEstado,
      minSaldo: currentMinSaldo,
      maxSaldo: currentMaxSaldo,
      sort: currentSort,
      page: currentPage
    });
  }, [debouncedBusqueda, currentEstado, currentMinSaldo, currentMaxSaldo, currentSort, currentPage, recargar, pathname, router, createQueryString, urlQuery]);

  // --- 7. MANEJADORES ---
  const handleApplyFilters = (filtros: any) => {
    router.push(`${pathname}?${createQueryString({ 
      estado: filtros.estado, 
      min: filtros.saldoRange.min, 
      max: filtros.saldoRange.max, 
      page: 1 
    })}`, { scroll: false });
  };

  const handleApplySort = (criterio: string, cerrarModal: boolean = true) => {
    router.push(`${pathname}?${createQueryString({ sort: criterio, page: 1 })}`, { scroll: false });
    if (cerrarModal) setMostrarOrdenar(false);
  };

  const handleClearAll = () => {
    setBusqueda("");
    router.push(pathname, { scroll: false }); // Limpia la URL por completo
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      router.push(`${pathname}?${createQueryString({ page: newPage })}`, { scroll: false });
    }
  };

  const isAnythingActive = activeFilters.estado !== "Todos" || activeFilters.saldoRange.min !== "" || activeFilters.saldoRange.max !== "" || busqueda !== "" || currentSort !== "";

  return (
    <main className="flex flex-1 flex-col items-center py-8 px-4 sm:px-10 md:px-20 lg:px-40 w-full max-w-[1440px] mx-auto overflow-hidden relative min-h-screen bg-[#f6f6f8] dark:bg-[#101622]">
      
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
        
        <EncabezadoCuentas />

        <BarraNavegacionCuentas 
            busqueda={busqueda}
            onSearchChange={setBusqueda}
            onOpenFilters={() => setShowFilters(true)}
            onOpenSort={() => setMostrarOrdenar(true)}
            hasActiveFilters={activeFilters.estado !== "Todos" || activeFilters.saldoRange.min !== "" || activeFilters.saldoRange.max !== ""}
            hasActiveSort={!!currentSort} 
        />

        {/* --- CARTEL DE ERROR --- */}
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
              onClick={() => recargar({ query: debouncedBusqueda, estado: currentEstado, minSaldo: currentMinSaldo, maxSaldo: currentMaxSaldo, sort: currentSort, page: currentPage })} 
              className="shrink-0 px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-800/50 dark:hover:bg-red-800 text-red-700 dark:text-red-300 text-xs font-bold rounded-lg transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* --- TABLA PRINCIPAL --- */}
        {!error && (
          <TablaCuentas 
              clientes={clientes}
              loading={loading}
              busqueda={debouncedBusqueda}
              hasActiveFilters={isAnythingActive}
              onClearAll={handleClearAll}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
          />
        )}

      </div>
    </main>
  );
}