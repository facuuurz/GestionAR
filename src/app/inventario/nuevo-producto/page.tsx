"use client";

import { useState, useActionState, useEffect, useTransition, useRef } from "react";
import Link from "next/link";
import { crearProducto } from "@/actions/productos"; 
import { obtenerCategorias } from "@/actions/categorias"; 
import AgregarTipoModal from "@/components/Inventario/AgregarTipoModal/AgregarTipoModal";

type Categoria = {
  id: number;
  nombre: string;
};

// Categorías fijas del sistema
const CATEGORIAS_BASICAS = ["bebidas", "alimentos", "limpieza", "otros"];

function ErrorMessage({ errors }: { errors?: string[] }) {
  if (!errors || errors.length === 0) return null;
  return (
    <p className="text-red-500 text-xs mt-1 font-medium ml-1 flex items-center gap-1">
      <span className="material-symbols-outlined text-[14px]">error</span>
      {errors[0]}
    </p>
  );
}

export default function AgregarProductoPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  
  // ESTADOS PARA EL BUSCADOR (COMBOBOX)
  const [selectedTipo, setSelectedTipo] = useState<string>(""); 
  const [searchTerm, setSearchTerm] = useState<string>("");     
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);  

  // NUEVO ESTADO: Contador de caracteres
  const [descLength, setDescLength] = useState(0);

  const [isPendingCat, startTransitionCat] = useTransition();

  const cargarCategorias = () => {
    startTransitionCat(async () => {
      const datos = await obtenerCategorias();
      setCategorias(datos);
    });
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  // Lógica al cerrar el modal con un nuevo tipo
  const handleCloseModal = (nuevoNombre?: string) => {
    setIsModalOpen(false);
    
    if (nuevoNombre) {
      const nuevaCategoriaTemp = { id: Date.now(), nombre: nuevoNombre };
      setCategorias((prev) => [...prev, nuevaCategoriaTemp]);
      
      // Seleccionamos y mostramos el nuevo valor
      setSelectedTipo(nuevoNombre);
      setSearchTerm(nuevoNombre);
      setIsDropdownOpen(false);
      
      cargarCategorias(); 
    }
  };

  // Lógica de selección desde la lista
  const handleSelectOption = (valor: string) => {
    setSelectedTipo(valor);
    setSearchTerm(valor); 
    setIsDropdownOpen(false);
  };

  // Filtrado de listas
  const basicasFiltradas = CATEGORIAS_BASICAS.filter(c => 
    c.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const misCategoriasFiltradas = categorias.filter(c => 
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const initialState = { message: null, errors: {} };
  const [state, dispatch, isPending] = useActionState(crearProducto, initialState);

  return (
    <div className="bg-[#f6f6f8] dark:bg-[#101622] font-sans min-h-screen flex flex-col transition-colors duration-200">
      
      {/* Cierre del dropdown al hacer clic fuera */}
      {isDropdownOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
      )}

      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden text-[#0d121b] dark:text-gray-100">
        <div className="flex h-full grow flex-col">
          <div className="flex flex-1 justify-center py-6 px-4 md:px-8">
            <div className="flex flex-col max-w-240 flex-1 w-full gap-6">
              
              {/* Breadcrumbs */}
              <div className="flex flex-wrap items-center gap-2 px-1">
                <Link href="/" className="text-gray-500 dark:text-gray-400 text-sm font-medium  hover:text-blue-600  dark:hover:text-white transition-colors">
                  Panel
                </Link>
                <span className="material-symbols-outlined text-gray-400 text-sm">chevron_right</span>
                <Link href="/inventario" className="text-gray-500 dark:text-gray-400 text-sm font-medium  dark:hover:text-white transition-colors  hover:text-blue-600 ">
                  Inventario
                </Link>
                <span className="material-symbols-outlined text-gray-400 text-sm">chevron_right</span>
                <span className="text-[#0d121b] dark:text-gray-100 text-sm font-medium">Agregar Producto</span>
              </div>

              <div className="flex flex-col gap-2">
                <h1 className="text-[#0d121b] dark:text-white text-3xl md:text-4xl font-extrabold tracking-[-0.033em]">
                  Agregar Nuevo Producto
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-base font-normal">
                  Ingrese los detalles del nuevo artículo.
                </p>
              </div>

              {/* FORMULARIO */}
              <form action={dispatch} className="bg-white dark:bg-[#1e2736] rounded-xl shadow-sm border border-[#e5e7eb] dark:border-[#2d3748] overflow-hidden">
                
                <div className="border-b border-[#e5e7eb] dark:border-[#2d3748] px-6 py-4 bg-gray-50/50 dark:bg-[#1e2736]">
                  <h3 className="text-base font-bold text-[#0d121b] dark:text-white flex items-center gap-2">
                    <span className="material-symbols-outlined">inventory_2</span>
                    Información General
                  </h3>
                </div>

                <div className="p-6 md:p-8 flex flex-col gap-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Nombre */}
                    <label className="flex flex-col gap-2">
                      <span className="text-[#0d121b] dark:text-gray-200 text-sm font-semibold">Nombre del producto *</span>
                      <div className="relative w-full">
                        <input 
                          name="nombre"
                          className={`flex w-full rounded-lg border ${state.errors?.nombre ? 'border-red-500' : 'border-[#cfd7e7] dark:border-[#4a5568]'} bg-[#f8f9fc] dark:bg-[#2d3748] text-[#0d121b] dark:text-white h-12 pl-12 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-black/20`}
                          placeholder="Ej. Coca Cola 2L" 
                          type="text"
                        />
                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                          <span className="material-symbols-outlined text-lg">shopping_bag</span>
                        </div>
                      </div>
                      <ErrorMessage errors={state.errors?.nombre} />
                    </label>

                    {/* Código de Barra */}
                    <label className="flex flex-col gap-2 relative">
                      <span className="text-[#0d121b] dark:text-gray-200 text-sm font-semibold">Código de barra *</span>
                      <div className="relative w-full">
                        <input 
                          name="codigoBarra"
                          className={`flex w-full rounded-lg border ${state.errors?.codigoBarra ? 'border-red-500' : 'border-[#cfd7e7] dark:border-[#4a5568]'} bg-[#f8f9fc] dark:bg-[#2d3748] text-[#0d121b] dark:text-white h-12 pl-4 pr-14 text-sm font-medium outline-none focus:ring-2 focus:ring-black/20`}
                          placeholder="Escanee o ingrese código" 
                          type="text"
                        />
                        <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors cursor-pointer">
                          <span className="material-symbols-outlined text-lg">barcode_scanner</span>
                        </button>
                      </div>
                      <ErrorMessage errors={state.errors?.codigoBarra} />
                    </label>

                    {/* COMBOBOX TIPO DE PRODUCTO */}
                    <div className="flex flex-col gap-2 relative z-20">
                      <span className="text-[#0d121b] dark:text-gray-200 text-sm font-semibold">Tipo de Producto *</span>
                      <div className="flex gap-2 relative">
                        <div className="relative w-full">
                          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/50 text-orange-700 pointer-events-none z-10">
                            <span className="material-symbols-outlined text-lg">category</span>
                          </div>
                          
                          <input type="hidden" name="tipo" value={selectedTipo} />

                          <input
                            type="text"
                            placeholder="Buscar o seleccionar..."
                            className={`flex w-full rounded-lg border ${state.errors?.tipo ? 'border-red-500' : 'border-[#cfd7e7] dark:border-[#4a5568]'} bg-[#f8f9fc] dark:bg-[#2d3748] text-[#0d121b] dark:text-white h-12 pl-12 pr-10 text-sm font-medium outline-none focus:ring-2 focus:ring-black/20`}
                            value={searchTerm}
                            onChange={(e) => {
                              setSearchTerm(e.target.value);
                              setIsDropdownOpen(true);
                              if (e.target.value === "") setSelectedTipo("");
                            }}
                            onFocus={() => setIsDropdownOpen(true)}
                            autoComplete="off"
                          />
                          
                          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-black dark:text-gray-400">
                            <span className="material-symbols-outlined text-xl">expand_more</span>
                          </div>

                          {/* LISTA DESPLEGABLE */}
                          {isDropdownOpen && (
                            <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-[#2d3748] border border-[#e5e7eb] dark:border-[#4a5568] rounded-lg shadow-lg max-h-60 overflow-y-auto z-30 animate-in fade-in zoom-in-95 duration-100">
                              
                              {/* Básicos */}
                              {basicasFiltradas.length > 0 && (
                                <div>
                                  <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-[#1a202c]">
                                    Básicos
                                  </div>
                                  {basicasFiltradas.map((opcion) => (
                                    <button
                                      key={opcion}
                                      type="button"
                                      onClick={() => handleSelectOption(opcion)}
                                      className="w-full text-left px-4 py-2 text-sm text-[#0d121b] dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#4a5568] capitalize transition-colors"
                                    >
                                      {opcion}
                                    </button>
                                  ))}
                                </div>
                              )}

                              {/* Mis Categorías */}
                              {misCategoriasFiltradas.length > 0 && (
                                <div>
                                  <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-[#1a202c] border-t border-gray-100 dark:border-gray-700">
                                    Mis Categorías
                                  </div>
                                  {misCategoriasFiltradas.map((cat) => (
                                    <button
                                      key={cat.id}
                                      type="button"
                                      onClick={() => handleSelectOption(cat.nombre)}
                                      className="w-full text-left px-4 py-2 text-sm text-[#0d121b] dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#4a5568] capitalize transition-colors"
                                    >
                                      {cat.nombre}
                                    </button>
                                  ))}
                                </div>
                              )}

                              {basicasFiltradas.length === 0 && misCategoriasFiltradas.length === 0 && (
                                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                  No se encontraron resultados para "{searchTerm}"
                                </div>
                              )}
                            </div>
                          )}

                        </div>

                        {/* Botón Agregar Modal (ANIMADO) */}
                        <button 
                          onClick={() => setIsModalOpen(true)} 
                          className="hover:cursor-pointer flex items-center justify-center shrink-0 h-12 px-4 rounded-lg border border-[#cfd7e7] bg-[#f8f9fc] hover:bg-gray-100 font-bold text-sm transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md" 
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[20px] mr-2">add</span>
                          Agregar
                        </button>
                      </div>
                      <ErrorMessage errors={state.errors?.tipo} />
                    </div>

                    {/* Código de Proveedor */}
                    <label className="flex flex-col gap-2">
                      <span className="text-[#0d121b] dark:text-gray-200 text-sm font-semibold">Código de Proveedor *</span>
                      <div className="relative w-full">
                        <input 
                          name="proveedor"
                          className={`flex w-full rounded-lg border ${state.errors?.proveedor ? 'border-red-500' : 'border-[#cfd7e7] dark:border-[#4a5568]'} bg-[#f8f9fc] dark:bg-[#2d3748] text-[#0d121b] dark:text-white h-12 pl-12 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-black/20`}
                          placeholder="REF-000" 
                          type="text"
                        />
                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-teal-100 text-teal-700">
                          <span className="material-symbols-outlined text-lg">local_shipping</span>
                        </div>
                      </div>
                      <ErrorMessage errors={state.errors?.proveedor} />
                    </label>

                    {/* 🆕 NUEVO CAMPO: Fecha de Vencimiento */}
                    <label className="flex flex-col gap-2">
                      <span className="text-[#0d121b] dark:text-gray-200 text-sm font-semibold">Fecha de Vencimiento</span>
                      <div className="relative w-full">
                        <input 
                          name="fechaVencimiento"
                          type="date"
                          className="flex w-full rounded-lg border border-[#cfd7e7] dark:border-[#4a5568] bg-[#f8f9fc] dark:bg-[#2d3748] text-[#0d121b] dark:text-white h-12 pl-12 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-black/20"
                        />
                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300">
                          <span className="material-symbols-outlined text-lg">event</span>
                        </div>
                      </div>
                    </label>

                    {/* Descripción con Contador (Movido aquí para balancear la grilla) */}
                    <label className="flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[#0d121b] dark:text-gray-200 text-sm font-semibold">Descripción breve</span>
                        <span className={`text-xs ${descLength >= 200 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                          (Opcional {descLength} de 200)
                        </span>
                      </div>
                      <div className="relative w-full">
                        <textarea 
                          name="descripcion"
                          maxLength={200}
                          rows={1} 
                          onChange={(e) => setDescLength(e.target.value.length)}
                          className={`flex w-full rounded-lg border ${state.errors?.descripcion ? 'border-red-500' : 'border-[#cfd7e7] dark:border-[#4a5568]'} bg-[#f8f9fc] dark:bg-[#2d3748] text-[#0d121b] dark:text-white p-3 pl-12 text-sm font-medium resize-none outline-none focus:ring-2 focus:ring-black/20 min-h-[48px]`}
                          placeholder="Ingrese detalles..." 
                        />
                        <div className="pointer-events-none absolute left-3 top-3 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                          <span className="material-symbols-outlined text-lg">description</span>
                        </div>
                      </div>
                      <ErrorMessage errors={state.errors?.descripcion} />
                    </label>

                  </div>

                  <hr className="border-[#e5e7eb] dark:border-[#2d3748]"/>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Stock */}
                    <label className="flex flex-col gap-2">
                      <span className="text-[#0d121b] dark:text-gray-200 text-sm font-semibold">Stock inicial *</span>
                      <div className="relative w-full">
                        <input 
                          name="stock"
                          className={`flex w-full rounded-lg border ${state.errors?.stock ? 'border-red-500' : 'border-[#cfd7e7] dark:border-[#4a5568]'} bg-[#f8f9fc] dark:bg-[#2d3748] text-[#0d121b] dark:text-white h-12 pl-12 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-black/20`}
                          placeholder="0" 
                          type="number"
                        />
                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700">
                          <span className="material-symbols-outlined text-lg">inventory</span>
                        </div>
                      </div>
                      <ErrorMessage errors={state.errors?.stock} />
                    </label>

                    {/* Precio */}
                    <label className="flex flex-col gap-2">
                      <span className="text-[#0d121b] dark:text-gray-200 text-sm font-semibold">Precio Unitario *</span>
                      <div className="relative w-full">
                        <input 
                          name="precio"
                          className={`flex w-full rounded-lg border ${state.errors?.precio ? 'border-red-500' : 'border-[#cfd7e7] dark:border-[#4a5568]'} bg-[#f8f9fc] dark:bg-[#2d3748] text-[#0d121b] dark:text-white h-12 pl-12 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-black/20`}
                          placeholder="0.00" 
                          step="0.01" 
                          type="number"
                        />
                        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-700">
                          <span className="material-symbols-outlined text-lg">attach_money</span>
                        </div>
                      </div>
                      <ErrorMessage errors={state.errors?.precio} />
                    </label>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 dark:bg-[#1a202c] border-t border-[#e5e7eb] px-6 py-4 flex flex-col items-end gap-2">
                   {state.message && (
                      <div className="text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-md text-sm w-full text-center">
                         {state.message}
                      </div>
                   )}
                   <div className="flex flex-col-reverse md:flex-row justify-end items-center gap-4 w-full">
                    
                    {/* Botón Cancelar (ANIMADO) */}
                    <Link 
                      href="/inventario" 
                      className="w-full md:w-auto h-10 px-4 rounded-lg text-sm font-semibold text-neutral-700 border border-neutral-300 flex items-center justify-center hover:bg-neutral-50 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                    >
                      Cancelar
                    </Link>
                    
                    {/* Botón Guardar (ANIMADO) */}
                    <button 
                      type="submit" 
                      disabled={isPending}
                      className={`hover:cursor-pointer w-full md:w-auto h-10 px-4 rounded-lg text-sm font-bold text-white flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md
                        ${isPending ? 'bg-neutral-500 cursor-not-allowed' : 'bg-neutral-800 hover:bg-black'}
                      `}
                    >
                      {isPending ? (
                        <>
                          <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[18px]">save</span>
                          Guardar Producto
                        </>
                      )}
                    </button>
                   </div>
                </div>

              </form>
            </div>
          </div>
          <div className="h-10"></div>
        </div>
      </div>
      
      <AgregarTipoModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}