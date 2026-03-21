"use client";

import FilaCliente from "@/components/Cuentas-corrientes/FilaCliente/FilaCliente";

interface TablaCuentasProps {
  clientes: any[]; 
  loading: boolean;
  busqueda: string;
  hasActiveFilters: boolean;
  onClearAll: () => void;
  // Nuevas props para paginación
  currentPage: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
  onDeleteSuccess?: () => void;
  isAdmin: boolean;
}

export default function TablaCuentas({ 
  clientes, loading, busqueda, hasActiveFilters, onClearAll, currentPage, totalPages, onPageChange, onDeleteSuccess, isAdmin 
}: TablaCuentasProps) {

  return (
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
            ) : clientes.length > 0 ? (
                // Mapeamos directamente 'clientes', ya vienen filtrados del backend
                clientes.map((cliente) => (
                  <FilaCliente key={cliente.id} cliente={cliente} onDeleteSuccess={onDeleteSuccess} isAdmin={isAdmin} />
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
                            {hasActiveFilters && (
                                <button onClick={onClearAll} className="text-blue-600 hover:underline text-xs font-bold mt-1">
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
      
      {/* Footer Paginación */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-between items-center px-4 py-3 border-t border-[#ededed] dark:border-[#333]">
          
          {/* Botón Anterior */}
          <button 
            onClick={() => onPageChange(currentPage - 1)} 
            disabled={currentPage === 1}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors 
              ${currentPage === 1 
                ? 'text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-[#151a25] border border-gray-200 dark:border-[#333] cursor-not-allowed' 
                : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1e2736] border border-gray-300 dark:border-[#333] hover:bg-gray-50 dark:hover:bg-[#2a3649]'}`}
          >
            Anterior
          </button>
          
          <span className="text-sm text-gray-700 dark:text-gray-400">
            Página <span className="font-semibold text-primary dark:text-white">{currentPage}</span> de <span className="font-semibold text-primary dark:text-white">{totalPages}</span>
          </span>
          
          {/* Botón Siguiente */}
          <button 
            onClick={() => onPageChange(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors 
              ${currentPage === totalPages 
                ? 'text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-[#151a25] border border-gray-200 dark:border-[#333] cursor-not-allowed' 
                : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-[#1e2736] border border-gray-300 dark:border-[#333] hover:bg-gray-50 dark:hover:bg-[#2a3649]'}`}
          >
            Siguiente
          </button>

        </div>
      )}
    </div>
  );
}