"use client";

import PromocionRow from "@/components/promociones/PromocionRow";

interface TablaPromocionesProps {
  promociones: any[]; 
  loading: boolean;
  busqueda: string;
  onClearBusqueda: () => void;
  // NUEVAS PROPS PARA PAGINACIÓN:
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

export default function TablaPromociones({ 
  promociones, 
  loading, 
  busqueda, 
  onClearBusqueda,
  currentPage,
  totalPages,
  onPageChange
}: TablaPromocionesProps) {
  
  // OJO: Ya no filtramos con useMemo aquí. 
  // La búsqueda ahora la mandaremos al servidor para que nos traiga la página correcta ya filtrada.

  return (
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
            ) : promociones.length > 0 ? (
                promociones.map((promo) => (
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
                                  onClick={onClearBusqueda}
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
      
      {/* Controles de Paginación */}
      {!loading && totalPages > 0 && (
        <div className="px-4 py-3 border-t border-[#ededed] dark:border-[#333] bg-[#f9f9f9] dark:bg-[#151a25] flex justify-between items-center">
          <button 
            onClick={() => onPageChange(currentPage - 1)} 
            disabled={currentPage === 1}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-sm hover:shadow-md text-white bg-neutral-800 hover:bg-black dark:bg-white dark:text-black disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Anterior
          </button>
          
          <span className="text-sm text-gray-700 dark:text-gray-400">
            Página <span className="font-semibold text-primary dark:text-white">{currentPage}</span> de <span className="font-semibold text-primary dark:text-white">{totalPages}</span>
          </span>
          
          <button 
            onClick={() => onPageChange(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-sm hover:shadow-md text-white bg-neutral-800 hover:bg-black dark:bg-white dark:text-black disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}