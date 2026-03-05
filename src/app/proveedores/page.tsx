import Link from "next/link";
import { obtenerProveedores } from "@/actions/proveedores";

// Componentes
import EncabezadoProveedores from "@/components/Proveedores/EncabezadoProveedores";
import BarraNavegacionProveedores from "@/components/Proveedores/BarraNavegacionProveedores";
import TablaProveedores from "@/components/Proveedores/TablaProveedores";

export default async function ProveedoresPage(props: {
  searchParams?: Promise<{ query?: string; sort?: string; page?: string }>;
}) {
  // --- 1. LEER PARÁMETROS DE LA URL ---
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const sort = searchParams?.sort || "";
  
  // NUEVO: Leer la página actual de la URL
  const currentPage = Number(searchParams?.page) || 1;
  
  // --- 2. TRAER DATOS DEL SERVIDOR ---
  // Ahora desestructuramos el objeto robusto que armamos en el backend
  const { proveedores, totalProveedores, totalPages, error } = await obtenerProveedores(query, sort, currentPage);

  // Helper para crear URLs de paginación manteniendo la búsqueda y el orden
  const createPageUrl = (newPage: number) => {
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (sort) params.set("sort", sort);
    params.set("page", newPage.toString());
    return `/proveedores?${params.toString()}`;
  };

  // --- 3. RENDERIZAR ORQUESTADOR ---
  return (
    <div className="flex flex-col w-full min-h-screen bg-[#f6f6f8] dark:bg-[#101622]">
      <main className="flex flex-1 flex-col items-center py-8 px-4 sm:px-10 md:px-20 lg:px-40 w-full max-w-[1440px] mx-auto overflow-hidden relative">
        <div className="w-full flex flex-col gap-6 h-full">
          
          <EncabezadoProveedores />
          
          <BarraNavegacionProveedores />

          {/* --- CARTEL DE ERROR DE CONEXIÓN --- */}
          {error && (
            <div className="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-red-500 dark:text-red-400 text-2xl">cloud_off</span>
                <div className="flex flex-col">
                  <p className="text-red-800 dark:text-red-300 font-semibold text-sm">Problema de conexión</p>
                  <p className="text-red-600 dark:text-red-400 text-xs">{error}</p>
                </div>
              </div>
              {/* En los Server Components, para reintentar simplemente recargamos la página base */}
              <Link href="/proveedores" className="shrink-0 px-4 py-2 bg-red-100 hover:bg-red-200 dark:bg-red-800/50 dark:hover:bg-red-800 text-red-700 dark:text-red-300 text-xs font-bold rounded-lg transition-colors">
                Reintentar
              </Link>
            </div>
          )}

          {/* --- TABLA Y PAGINACIÓN (Solo si NO hay error) --- */}
          {!error && (
            <>
              <TablaProveedores 
                proveedores={proveedores} 
                totalProveedores={totalProveedores} 
              />

              {/* Controles de Paginación */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4 px-2">
                  
                  {/* Botón Anterior */}
                  {currentPage > 1 ? (
                    <Link 
                      href={createPageUrl(currentPage - 1)} 
                      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1e2736] border border-gray-300 dark:border-[#333] rounded-md hover:bg-gray-50 dark:hover:bg-[#2a3649] transition-colors"
                    >
                      Anterior
                    </Link>
                  ) : (
                    <button disabled className="px-4 py-2 text-sm font-medium text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-[#151a25] border border-gray-200 dark:border-[#333] rounded-md cursor-not-allowed">
                      Anterior
                    </button>
                  )}

                  <span className="text-sm text-gray-700 dark:text-gray-400">
                    Página <span className="font-semibold text-primary dark:text-white">{currentPage}</span> de <span className="font-semibold text-primary dark:text-white">{totalPages}</span>
                  </span>

                  {/* Botón Siguiente */}
                  {currentPage < totalPages ? (
                    <Link 
                      href={createPageUrl(currentPage + 1)} 
                      className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1e2736] border border-gray-300 dark:border-[#333] rounded-md hover:bg-gray-50 dark:hover:bg-[#2a3649] transition-colors"
                    >
                      Siguiente
                    </Link>
                  ) : (
                    <button disabled className="px-4 py-2 text-sm font-medium text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-[#151a25] border border-gray-200 dark:border-[#333] rounded-md cursor-not-allowed">
                      Siguiente
                    </button>
                  )}
                  
                </div>
              )}
            </>
          )}

        </div>
      </main>
    </div>
  );
}