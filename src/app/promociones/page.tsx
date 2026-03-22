"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

// Hooks
import { usePromociones } from "@/hooks/usePromociones";

// Componentes
import EncabezadoPromociones from "@/components/promociones/EncabezadoPromociones";
import BarraNavegacionPromociones from "@/components/promociones/BarraNavegacionPromociones";
import TablaPromociones from "@/components/promociones/TablaPromociones";

function PromocionesContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Estados de búsqueda
  const urlQuery = searchParams.get("q") || "";
  const currentPage = Number(searchParams.get("page")) || 1;

  const [busqueda, setBusqueda] = useState(urlQuery);
  const [debouncedBusqueda, setDebouncedBusqueda] = useState(urlQuery);

  // 2. Traemos los datos (ahora el hook debe devolver 'totalPages' también)
  const { promociones, loading, totalPages = 1, error, isAdmin, recargar } = usePromociones();

  // 3. Debounce para la búsqueda (espera 400ms antes de buscar en la BD)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedBusqueda(busqueda);
    }, 400);
    return () => clearTimeout(handler);
  }, [busqueda]);

  // 4. Utilidad para modificar la URL sin recargar la página
  const createQueryString = useCallback(
    (updates: Record<string, string | number | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "" || (key === 'page' && value === 1)) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });
      return params.toString();
    },
    [searchParams]
  );

  // 5. Efecto principal: Recargar datos cuando cambia la página o la búsqueda debounced
  useEffect(() => {
    // Actualizamos la URL con la búsqueda si cambió
    if (debouncedBusqueda !== urlQuery) {
      router.push(`${pathname}?${createQueryString({ q: debouncedBusqueda, page: 1 })}`, { scroll: false });
    }

    // Llamamos al backend
    recargar({
      query: debouncedBusqueda,
      page: currentPage
    });
  }, [debouncedBusqueda, currentPage, recargar, router, pathname, createQueryString, urlQuery]);

  // Manejador de cambio de página
  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      router.push(`${pathname}?${createQueryString({ page: newPage })}`, { scroll: false });
    }
  };

  return (
    <main className="flex flex-1 flex-col items-center py-8 px-4 sm:px-10 md:px-20 lg:px-40 w-full max-w-[1440px] mx-auto overflow-hidden relative min-h-screen bg-[#f6f6f8] dark:bg-[#101622]">
      <div className="w-full flex flex-col gap-6 h-full">
        <EncabezadoPromociones />

        <BarraNavegacionPromociones
          busqueda={busqueda}
          onSearchChange={setBusqueda}
        />

        {/* 2. CARTEL DE ERROR DE CONEXIÓN */}
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
              onClick={() => recargar({ query: debouncedBusqueda, page: currentPage })}
              className="shrink-0 px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-800/50 dark:hover:bg-red-800 text-red-700 dark:text-red-300 text-xs font-bold rounded-lg transition-colors"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* 3. OCULTAMOS LA TABLA SI HAY ERROR */}
        {!error && (
          <TablaPromociones
            promociones={promociones}
            loading={loading}
            isAdmin={isAdmin}
            busqueda={debouncedBusqueda}
            onClearBusqueda={() => setBusqueda("")}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onDeleteSuccess={() => {
              recargar({
                query: debouncedBusqueda,
                page: currentPage
              });
            }}
          />
        )}
      </div>
    </main>
  );
}

export default function PromocionesPage() {
  return (
    <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><span className="material-symbols-outlined animate-spin text-3xl">progress_activity</span></div>}>
      <PromocionesContent />
    </Suspense>
  );
}