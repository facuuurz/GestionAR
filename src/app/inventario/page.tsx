import Link from "next/link";

export default function InventarioPage() {
  // Datos de ejemplo para la tabla (puedes convertirlos en un estado o fetch más adelante)
  const productos = [
    { id: "77900123", nombre: "Leche Entera La Serenísima 1L", sub: "Cartón / Larga Vida", stock: "45 un.", precio: "$1.200,00", lotes: 3, tipo: "Lácteos", prov: "PROV-101", status: "ok" },
    { id: "77900654", nombre: "Yogur Frutilla Bebible 180g", sub: "", stock: "8 un.", precio: "$950,00", lotes: 1, tipo: "Lácteos", prov: "PROV-101", status: "low" },
    { id: "77900789", nombre: "Coca Cola Sabor Original 2.25L", sub: "", stock: "12 un.", precio: "$2.100,00", lotes: 2, tipo: "Bebidas", prov: "PROV-310", status: "warning" },
  ];

  return (
    <main className="flex flex-1 flex-col items-center py-8 px-4 sm:px-10 md:px-20 lg:px-40 w-full max-w-360 mx-auto overflow-hidden">
      <div className="w-full flex flex-col gap-6 h-full">
        
        {/* --- BREADCRUMBS --- */}
        <div className="flex flex-wrap gap-2 items-center text-sm shrink-0">
          <Link href="/" className="text-neutral-500 hover:text-primary dark:hover:text-white font-medium transition-colors">
            Panel
          </Link>
          <span className="material-symbols-outlined text-neutral-400 text-base">chevron_right</span>
          <span className="text-primary dark:text-white font-bold">Inventario</span>
        </div>

        {/* --- ENCABEZADO DE SECCIÓN --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
          <div className="flex flex-col gap-1">
            <h1 className="text-primary dark:text-white tracking-tight text-[32px] font-bold leading-tight">
              Lista de Productos
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm font-normal">
              Gestiona el inventario, precios y stock de tus productos.
            </p>
          </div>
          <button className="flex items-center gap-2 cursor-pointer justify-center overflow-hidden rounded-lg h-10 px-5 bg-primary text-white hover:bg-neutral-800 transition-colors shadow-sm">
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span className="text-sm font-bold truncate">Agregar Nuevo Producto</span>
          </button>
        </div>

        {/* --- FILTROS Y BÚSQUEDA --- */}
        <div className="bg-white dark:bg-[#222] p-4 rounded-xl border border-[#ededed] dark:border-[#333] shadow-sm flex flex-col md:flex-row gap-4 shrink-0">
          <div className="flex flex-1 items-center bg-[#f5f5f5] dark:bg-[#333] rounded-lg px-3 py-2 border border-transparent focus-within:border-primary transition-colors">
            <span className="material-symbols-outlined text-neutral-500">search</span>
            <input 
              className="bg-transparent border-none text-sm w-full focus:ring-0 text-primary dark:text-white placeholder:text-neutral-500" 
              placeholder="Buscar por nombre, código de barra o proveedor..." 
              type="text" 
            />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 md:pb-0">
            <button className="flex items-center gap-2 h-10 px-4 rounded-lg border border-[#ededed] dark:border-[#333] bg-white dark:bg-[#222] text-primary dark:text-white text-sm font-medium hover:bg-neutral-50 dark:hover:bg-[#333] transition-colors whitespace-nowrap">
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
              <span>Filtrar</span>
            </button>
            <button className="flex items-center gap-2 h-10 px-4 rounded-lg border border-[#ededed] dark:border-[#333] bg-white dark:bg-[#222] text-primary dark:text-white text-sm font-medium hover:bg-neutral-50 dark:hover:bg-[#333] transition-colors whitespace-nowrap">
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Exportar</span>
            </button>
          </div>
        </div>

        {/* --- CONTENEDOR DE TABLA --- */}
        <div className="flex flex-col rounded-xl border border-[#ededed] dark:border-[#333] bg-white dark:bg-[#222] overflow-hidden shadow-sm flex-1 min-h-0">
          <div className="overflow-x-auto overflow-y-auto h-full relative custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#f9f9f9] dark:bg-[#1a1a1a] border-b border-[#ededed] dark:border-[#333] sticky top-0 z-20">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Código</th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider min-w-50">Producto</th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Stock</th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Precio Unit.</th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider text-center sticky right-0 bg-[#f9f9f9] dark:bg-[#1a1a1a] shadow-[-1px_0_0_0_#ededed] dark:shadow-[-1px_0_0_0_#333]">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ededed] dark:divide-[#333]">
                {/* Ejemplo de fila mapeada */}
                {productos.map((prod) => (
                  <tr key={prod.id} className="hover:bg-neutral-50 dark:hover:bg-[#333]/50 transition-colors group">
                    <td className="px-4 py-3 text-sm font-medium text-neutral-600 dark:text-neutral-400 font-mono">{prod.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-primary dark:text-white">{prod.nombre}</span>
                        {prod.sub && <span className="text-xs text-neutral-500">{prod.sub}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${prod.status === 'ok' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                          prod.status === 'low' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                        {prod.status === 'low' && <span className="material-symbols-outlined text-[14px] mr-1">warning</span>}
                        {prod.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-primary dark:text-white">{prod.precio}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-[#444] text-gray-800 dark:text-neutral-300">
                        {prod.tipo}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center sticky right-0 bg-white dark:bg-[#222] group-hover:bg-neutral-50 dark:group-hover:bg-[#333] transition-colors z-10 shadow-[-1px_0_0_0_#ededed] dark:shadow-[-1px_0_0_0_#333]">
                      <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-primary text-white hover:bg-neutral-800 dark:bg-white dark:text-primary dark:hover:bg-neutral-200 text-xs font-bold transition-colors">
                        <span className="material-symbols-outlined text-[16px]">sync_alt</span>
                        <span>Actualizar</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}