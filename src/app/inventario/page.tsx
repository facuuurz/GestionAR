"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// Asegúrate de que las rutas sean correctas
import FilterModal from "@/components/FilterModal/FilterModal"; 
import Ordenar from "@/components/VentanaOrdenar/VentanaOrdenar";
import ProductRow from "@/components/ProductRow/ProductRow"; 
import { useProductos } from "@/hooks/useProductos";

export default function InventarioPage() {
  // --- ESTADOS DE UI ---
  const [showFilters, setShowFilters] = useState(false);
  const [mostrarOrdenar, setMostrarOrdenar] = useState(false);
  
  // --- ESTADO DEL BUSCADOR ---
  const [busqueda, setBusqueda] = useState("");

  // --- DATA DESDE EL HOOK (CONECTADO A DB) ---
  const { productos, setCriterioOrden, loading } = useProductos();

  // --- LÓGICA DE FILTRADO EN TIEMPO REAL ---
  const productosFiltrados = useMemo(() => {
    // 1. Si no hay nada escrito, mostramos todo lo que trajo el hook
    if (!busqueda) return productos;

    const termino = busqueda.toLowerCase();

    // 2. Filtramos considerando que algunos campos pueden ser null
    return productos.filter((prod) => {
      const nombreMatch = prod.nombre.toLowerCase().includes(termino);
      const tipoMatch = prod.tipo?.toLowerCase().includes(termino) || false;
      const proveedorMatch = prod.proveedor?.toLowerCase().includes(termino) || false;
      const codigoBarraMatch = prod.codigoBarra?.includes(termino) || false;
      // Convertimos el ID (number) a string para poder buscarlo
      const idMatch = prod.id.toString().includes(termino);

      return nombreMatch || tipoMatch || proveedorMatch || codigoBarraMatch || idMatch;
    });
  }, [productos, busqueda]);

  return (
    <main className="flex flex-1 flex-col items-center py-8 px-4 sm:px-10 md:px-20 lg:px-40 w-full max-w-360 mx-auto overflow-hidden relative">
      
      {/* --- MODALES --- */}
      <FilterModal 
        isOpen={showFilters} 
        onClose={() => setShowFilters(false)} 
      />
      <Ordenar
        isOpen={mostrarOrdenar}
        onClose={() => setMostrarOrdenar(false)}
        onAplicar={setCriterioOrden}
      />

      <div className="w-full flex flex-col gap-6 h-full">
        
        {/* --- BREADCRUMBS --- */}
        <div className="flex flex-wrap gap-2 items-center text-sm shrink-0">
          <Link href="/" className="text-neutral-500 hover:text-primary dark:hover:text-white font-medium transition-colors hover:text-blue-600 ">
            Panel
          </Link>
          <span className="material-symbols-outlined text-neutral-400 text-base">chevron_right</span>
          <span className="text-primary dark:text-white font-bold">Inventario</span>
        </div>

        {/* --- ENCABEZADO --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
          <div className="flex flex-col gap-1">
            <h1 className="text-primary dark:text-white tracking-tight text-[32px] font-bold leading-tight">
              Lista de Productos
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm font-normal">
              Gestiona el inventario, precios y stock de tus productos.
            </p>
          </div>
          <Link className="group flex items-center gap-2 cursor-pointer justify-center overflow-hidden rounded-lg h-10 px-5 bg-neutral-800 text-white shadow-sm transition-all duration-300 hover:bg-black hover:shadow-lg hover:shadow-neutral-500/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm" href="/inventario/nuevo-producto">
            <span className="material-symbols-outlined text-[20px] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-90">add</span>
            <span className="text-sm font-bold truncate">Agregar Nuevo Producto</span>
          </Link>
        </div>

        {/* --- BARRA DE HERRAMIENTAS (BUSCADOR Y BOTONES) --- */}
        <div className="bg-white dark:bg-[#222] p-4 rounded-xl border border-[#ededed] dark:border-[#333] shadow-sm flex flex-col md:flex-row gap-4 shrink-0">
          
          {/* INPUT BUSCADOR */}
          <div className="flex flex-1 items-center bg-[#f5f5f5] dark:bg-[#333] rounded-lg px-3 py-2 border border-transparent focus-within:border-primary transition-colors">
            <span className="material-symbols-outlined text-neutral-500">search</span>
            <input 
              className="bg-transparent border-none outline-none text-sm w-full focus:ring-0 text-primary dark:text-white placeholder:text-neutral-500 pl-1" 
              placeholder="Buscar por nombre, código, proveedor..." 
              type="text" 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          
          {/* BOTONES DE ACCIÓN */}
          <div className="flex gap-3 overflow-x-auto p-1"> 
            
            <button 
              onClick={() => setShowFilters(true)} 
              className="group flex items-center gap-2 h-10 px-4 rounded-lg border border-[#ededed] dark:border-[#333] bg-white dark:bg-[#222] text-primary dark:text-white text-sm font-medium cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md hover:bg-[#222] hover:text-white"
            >
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
              <span>Filtrar</span>
            </button>

            <button 
              onClick={() => setMostrarOrdenar(true)} 
              className="group flex items-center gap-2 h-10 px-4 rounded-lg border border-[#ededed] dark:border-[#333] bg-white dark:bg-[#222] text-primary dark:text-white text-sm font-medium cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md hover:bg-[#222] hover:text-white"
            >
              <span className="material-symbols-outlined text-[18px]">sort</span>
              <span>Ordenar</span>
            </button>

            <button className="group flex items-center gap-2 h-10 px-4 rounded-lg border border-[#ededed] dark:border-[#333] bg-white dark:bg-[#222] text-primary dark:text-white text-sm font-medium cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md hover:bg-[#222] hover:text-white">
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Exportar</span>
            </button>

          </div>
        </div>

        {/* --- TABLA DE RESULTADOS --- */}
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
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider whitespace-nowrap">Cod. Prov.</th>
                  <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider text-center sticky right-0 bg-[#f9f9f9] dark:bg-[#1a1a1a] shadow-[-1px_0_0_0_#ededed] dark:shadow-[-1px_0_0_0_#333]">Acciones</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-[#ededed] dark:divide-[#333]">
                {/* 1. ESTADO DE CARGA */}
                {loading ? (
                   <tr>
                     <td colSpan={7} className="text-center py-20">
                        <div className="flex flex-col items-center justify-center gap-2">
                           <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                           <span className="text-neutral-400 text-sm">Cargando inventario...</span>
                        </div>
                     </td>
                   </tr>
                ) : productosFiltrados.length > 0 ? (
                    // 2. LISTA DE PRODUCTOS
                    productosFiltrados.map((prod) => (
                      <ProductRow 
                        key={prod.id} 
                        prod={prod} 
                      />
                    ))
                ) : (
                    // 3. ESTADO VACÍO (NO SE ENCONTRÓ NADA)
                    <tr>
                        <td colSpan={7} className="text-center py-10 text-neutral-500 text-sm">
                            {busqueda 
                              ? `No se encontraron productos que coincidan con "${busqueda}"` 
                              : "No hay productos registrados."}
                        </td>
                    </tr>
                )}
              </tbody>

            </table>
          </div>
        </div>
      </div>
    </main>
  );
}