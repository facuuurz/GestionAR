"use client";

import { useState } from "react";
import Link from "next/link";
import { crearProducto } from "@/actions/productos"; // <--- IMPORTAMOS LA ACCIÓN
import AgregarTipoModal from "@/components/AgregarTipoModal/AgregarTipoModal";

export default function AgregarProductoPage() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div className="bg-[#f6f6f8] dark:bg-[#101622] font-sans min-h-screen flex flex-col transition-colors duration-200">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden text-[#0d121b] dark:text-gray-100">
        <div className="flex h-full grow flex-col">
          <div className="flex flex-1 justify-center py-6 px-4 md:px-8">
            <div className="flex flex-col max-w-240 flex-1 w-full gap-6">
              
              {/* Breadcrumbs */}
              <div className="flex flex-wrap items-center gap-2 px-1">
                <Link 
                  href="/inventario" 
                  className="text-gray-500 dark:text-gray-400 text-sm font-medium leading-normal hover:text-black dark:hover:text-white transition-colors"
                >
                  Inventario
                </Link>
                <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 text-sm">chevron_right</span>
                <span className="text-[#0d121b] dark:text-gray-100 text-sm font-medium leading-normal">Agregar Producto</span>
              </div>

              <div className="flex flex-col gap-2">
                <h1 className="text-[#0d121b] dark:text-white text-3xl md:text-4xl font-extrabold leading-tight tracking-[-0.033em]">
                  Agregar Nuevo Producto
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-base font-normal leading-normal">
                  Ingrese los detalles del nuevo artículo para el inventario.
                </p>
              </div>

              {/* INICIO DEL FORMULARIO - Server Action */}
              <form action={crearProducto} className="bg-white dark:bg-[#1e2736] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-[#2d3748] overflow-hidden">
                
                <div className="border-b border-[#e5e7eb] dark:border-[#2d3748] px-6 py-4 bg-gray-50/50 dark:bg-[#1e2736]">
                  <h3 className="text-base font-bold text-[#0d121b] dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-black dark:text-white">inventory_2</span>
                    Información General
                  </h3>
                </div>

                <div className="p-6 md:p-8 flex flex-col gap-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Nombre del Producto */}
                    <label className="flex flex-col gap-2">
                      <span className="text-[#0d121b] dark:text-gray-200 text-sm font-semibold leading-normal">Nombre del producto</span>
                      <div className="relative w-full">
                        <input 
                          name="nombre" // <--- NAME IMPORTANTE
                          required      // <--- Validación HTML básica
                          className="flex w-full rounded-lg border border-[#cfd7e7] dark:border-[#4a5568] bg-[#f8f9fc] dark:bg-[#2d3748] text-[#0d121b] dark:text-white focus:ring-2 focus:ring-black/20 focus:border-black dark:focus:border-white h-12 pl-12 pr-4 placeholder:text-[#9ca3af] text-sm font-medium transition-all outline-none" 
                          placeholder="Ej. Coca Cola 2L" 
                          type="text"
                        />
                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                          <span className="material-symbols-outlined text-lg">shopping_bag</span>
                        </div>
                      </div>
                    </label>

                    {/* Código de Barra */}
                    <label className="flex flex-col gap-2 relative">
                      <span className="text-[#0d121b] dark:text-gray-200 text-sm font-semibold leading-normal">Código de barra</span>
                      <div className="relative w-full">
                        <input 
                          name="codigoBarra" // <--- NAME IMPORTANTE
                          className="flex w-full rounded-lg border border-[#cfd7e7] dark:border-[#4a5568] bg-[#f8f9fc] dark:bg-[#2d3748] text-[#0d121b] dark:text-white focus:ring-2 focus:ring-black/20 focus:border-black dark:focus:border-white h-12 pl-4 pr-14 placeholder:text-[#9ca3af] text-sm font-medium transition-all outline-none" 
                          placeholder="Escanee o ingrese código" 
                          type="text"
                        />
                        <button 
                          type="button"
                          className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900 transition-colors cursor-pointer" 
                          title="Escanear"
                        >
                          <span className="material-symbols-outlined text-lg">barcode_scanner</span>
                        </button>
                      </div>
                    </label>

                    {/* Tipo de Producto */}
                    <div className="flex flex-col gap-2">
                      <span className="text-[#0d121b] dark:text-gray-200 text-sm font-semibold leading-normal">Tipo de Producto</span>
                      <div className="flex gap-2">
                        <div className="relative w-full">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 pointer-events-none z-10">
                            <span className="material-symbols-outlined text-lg">category</span>
                          </div>
                          <select 
                            name="tipo" // <--- NAME IMPORTANTE
                            className="flex w-full rounded-lg border border-[#cfd7e7] dark:border-[#4a5568] bg-[#f8f9fc] dark:bg-[#2d3748] text-[#0d121b] dark:text-white focus:ring-2 focus:ring-black/20 focus:border-black dark:focus:border-white h-12 pl-12 pr-10 text-sm font-medium appearance-none transition-all cursor-pointer outline-none" 
                            defaultValue=""
                          >
                            <option disabled value="">Seleccione una categoría</option>
                            <option value="bebidas">Bebidas</option>
                            <option value="alimentos">Alimentos</option>
                            <option value="limpieza">Limpieza</option>
                            <option value="otros">Otros</option>
                          </select>
                          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-black dark:text-gray-400">
                            <span className="material-symbols-outlined text-xl">expand_more</span>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => setIsModalOpen(true)}
                          className="flex items-center justify-center shrink-0 h-12 px-4 rounded-lg border border-[#cfd7e7] dark:border-[#4a5568] bg-[#f8f9fc] dark:bg-[#2d3748] text-[#0d121b] dark:text-white hover:bg-gray-100 dark:hover:bg-[#374151] font-bold text-sm transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-black/20 cursor-pointer hover:border-neutral-700" 
                          title="Agregar Tipo de Producto" 
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[20px] mr-2 text-black dark:text-gray-300">add</span>
                          Agregar Tipo
                        </button>
                      </div>
                    </div>

                    {/* Código de Proveedor */}
                    <label className="flex flex-col gap-2">
                      <span className="text-[#0d121b] dark:text-gray-200 text-sm font-semibold leading-normal">Código de Proveedor</span>
                      <div className="relative w-full">
                        <input 
                          name="proveedor" // <--- NAME IMPORTANTE
                          className="flex w-full rounded-lg border border-[#cfd7e7] dark:border-[#4a5568] bg-[#f8f9fc] dark:bg-[#2d3748] text-[#0d121b] dark:text-white focus:ring-2 focus:ring-black/20 focus:border-black dark:focus:border-white h-12 pl-12 pr-4 placeholder:text-[#9ca3af] text-sm font-medium transition-all outline-none" 
                          placeholder="REF-000" 
                          type="text"
                        />
                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300">
                          <span className="material-symbols-outlined text-lg">local_shipping</span>
                        </div>
                      </div>
                    </label>
                  </div>

                  <hr className="border-[#e5e7eb] dark:border-[#2d3748]"/>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Stock Inicial */}
                    <label className="flex flex-col gap-2">
                      <span className="text-[#0d121b] dark:text-gray-200 text-sm font-semibold leading-normal">Stock inicial</span>
                      <div className="relative w-full">
                        <input 
                          name="stock" // <--- NAME IMPORTANTE
                          className="flex w-full rounded-lg border border-[#cfd7e7] dark:border-[#4a5568] bg-[#f8f9fc] dark:bg-[#2d3748] text-[#0d121b] dark:text-white focus:ring-2 focus:ring-black/20 focus:border-black dark:focus:border-white h-12 pl-12 pr-4 placeholder:text-[#9ca3af] text-sm font-medium transition-all outline-none" 
                          min="0" 
                          placeholder="0" 
                          type="number"
                        />
                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                          <span className="material-symbols-outlined text-lg">inventory</span>
                        </div>
                      </div>
                    </label>

                    {/* Precio Unitario */}
                    <label className="flex flex-col gap-2">
                      <span className="text-[#0d121b] dark:text-gray-200 text-sm font-semibold leading-normal">Precio Unitario</span>
                      <div className="relative w-full">
                        <input 
                          name="precio" // <--- NAME IMPORTANTE
                          className="flex w-full rounded-lg border border-[#cfd7e7] dark:border-[#4a5568] bg-[#f8f9fc] dark:bg-[#2d3748] text-[#0d121b] dark:text-white focus:ring-2 focus:ring-black/20 focus:border-black dark:focus:border-white h-12 pl-12 pr-4 placeholder:text-[#9ca3af] text-sm font-medium transition-all outline-none" 
                          placeholder="0.00" 
                          step="0.01" 
                          type="number"
                        />
                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300">
                          <span className="material-symbols-outlined text-lg">attach_money</span>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Footer / Botones de Acción */}
                <div className="bg-gray-50 dark:bg-[#1a202c] border-t border-[#e5e7eb] dark:border-[#2d3748] px-6 py-4 flex flex-col-reverse md:flex-row justify-end items-center gap-4">
                  <Link 
                    href="/inventario"
                    className="w-full md:w-auto h-10 px-4 rounded-lg text-sm font-semibold text-neutral-700 dark:text-neutral-200 bg-white dark:bg-transparent border border-neutral-300 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 hover:border-neutral-700 hover:text-neutral-700"
                  >
                    Cancelar
                  </Link>
                  <button 
                    type="submit" // <--- IMPORTANTE QUE SEA SUBMIT
                    className="w-full md:w-auto h-10 px-4 rounded-lg text-sm font-bold bg-neutral-800 hover:bg-black text-white shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-md cursor-pointer flex items-center justify-center gap-2 dark:bg-white dark:text-black"
                  >
                    <span className="material-symbols-outlined text-[18px]">save</span>
                    Guardar Producto
                  </button>
                </div>

              </form>
            </div>
          </div>
          <div className="h-10"></div>
        </div>
      </div>

      {/* Renderizado del Modal */}
      <AgregarTipoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}