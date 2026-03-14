import ProductRow from "@/components/Inventario/ListaProductos";

// 1. ELIMINAMOS el import de Prisma
// import { Producto } from "@prisma/client"; 

// 2. Creamos una interfaz que refleje cómo llegan los datos realmente al frontend
export interface ProductoFrontend {
  id: number;
  nombre: string;
  codigoBarra?: string | null;
  descripcion?: string | null;
  tipo?: string | null;
  proveedor?: string | null;
  stock: number;
  precio: number; // <-- ¡Aquí está la solución! Le decimos que en la vista es un número normal
  fechaVencimiento?: string | Date | null; // Las fechas suelen llegar como texto (string)
  esPorPeso?: boolean;
}

// 3. Usamos la nueva interfaz en las props
interface TablaProductosProps {
  productos: ProductoFrontend[]; 
  loading: boolean;
  busqueda: string;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  isAdmin?: boolean;
}

export default function TablaProductos({ 
  productos, 
  loading, 
  busqueda, 
  hasActiveFilters, 
  onClearFilters,
  isAdmin = true 
}: TablaProductosProps) {
  
  return (
// ... (El resto de tu código del return queda EXACTAMENTE igual) ...
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
              {isAdmin && (
                <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider text-center sticky right-0 bg-[#f9f9f9] dark:bg-[#151a25] shadow-[-1px_0_0_0_#ededed] dark:shadow-[-1px_0_0_0_#333]">Acciones</th>
              )}
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
              productos.map((prod) => (
                <ProductRow key={prod.id} prod={prod} isAdmin={isAdmin} />
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
                        onClick={onClearFilters}
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
          <span>Resultados: {productos.length}</span>
        </div>
      )}
    </div>
  );
}