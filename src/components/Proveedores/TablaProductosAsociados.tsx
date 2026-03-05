"use client"; // <-- Agregamos esto para usar estados

import { useState } from "react";
import Link from "next/link";

interface TablaProductosAsociadosProps {
  productos: any[]; // Recuerda cambiar 'any' por tu tipo Producto si usas TS estricto
  codigoProveedor: string;
}

export default function TablaProductosAsociados({ productos, codigoProveedor }: TablaProductosAsociadosProps) {
  // 1. Estado local para la búsqueda
  const [busqueda, setBusqueda] = useState("");

  // 2. Lógica de filtrado instantáneo
  const productosFiltrados = productos.filter((prod) => {
    const termino = busqueda.toLowerCase();
    // Filtramos por nombre, código de barra o tipo
    return (
      prod.nombre.toLowerCase().includes(termino) ||
      (prod.codigoBarra && prod.codigoBarra.toLowerCase().includes(termino)) ||
      (prod.tipo && prod.tipo.toLowerCase().includes(termino))
    );
  });

  return (
    <>
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
        <span className="material-symbols-outlined">inventory</span>
        Productos Asociados ({productos.length})
      </h2>

      <div className="bg-white dark:bg-[#1A202C] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        
        {/* Barra de herramientas de tabla */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-[#1A202C]">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-gray-400 text-xl">search</span>
            </div>
            {/* 3. Conectamos el input al estado */}
            <input 
              className="block w-full pl-10 pr-3 py-2.5 border-none bg-gray-100 dark:bg-gray-800/50 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 transition-shadow outline-none" 
              placeholder="Buscar por nombre, código o tipo..." 
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-[#1A202C] border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <span className="material-symbols-outlined text-base">download</span> Exportar
            </button>
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Código</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Producto</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Precio Unit.</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-[#1A202C]">
              
              {/* 4. Mensajes dinámicos si no hay datos o si la búsqueda no arroja resultados */}
              {productos.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      No hay productos asociados a este proveedor ({codigoProveedor}).
                  </td>
                </tr>
              ) : productosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      No se encontraron productos que coincidan con "{busqueda}".
                  </td>
                </tr>
              ) : (
                /* 5. Mapeamos sobre los productos FILTRADOS, no sobre todos */
                productosFiltrados.map((prod) => (
                  <tr key={prod.id} className="group hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-medium font-mono">
                        {prod.codigoBarra || "-"}
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900 dark:text-white">{prod.nombre}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{prod.tipo}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${prod.stock < 10 ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'}`}>
                            {prod.stock} un.
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                        ${Number(prod.precio).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                        <Link href={`/inventario/editar/${prod.id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#135bec] text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                            <span className="material-symbols-outlined text-sm">sync_alt</span>
                            Actualizar
                        </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer de Tabla con contador dinámico */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-[#1A202C]">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Mostrando {productosFiltrados.length} {productosFiltrados.length === 1 ? 'producto' : 'productos'}
            {busqueda && ` (filtrados de ${productos.length})`}
          </span>
        </div>

      </div>
    </>
  );
}