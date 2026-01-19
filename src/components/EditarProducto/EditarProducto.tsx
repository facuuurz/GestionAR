"use client";

import { useState, useActionState, useRef } from "react";
import Link from "next/link";
import { actualizarProducto, eliminarProducto, State } from "@/actions/productos";
import AgregarTipoModal from "@/components/AgregarTipoModal/AgregarTipoModal"; 

// --- TIPOS ---
interface ProductFormProps {
  producto: {
    id: number;
    codigoBarra: string;
    nombre: string;
    stock: number;
    precio: number;
    tipo: string;
    proveedor: string;
    descripcion: string;
  };
  categorias: {
    id: number;
    nombre: string;
  }[];
}

// Categorías fijas del sistema
const CATEGORIAS_BASICAS = ["bebidas", "alimentos", "limpieza", "otros"];

// --- COMPONENTES AUXILIARES ---
function ErrorMessage({ errors }: { errors?: string[] }) {
  if (!errors || errors.length === 0) return null;
  return (
    <p className="text-red-500 text-xs mt-1 font-medium ml-1 flex items-center gap-1">
      <span className="material-symbols-outlined text-[14px]">error</span>
      {errors[0]}
    </p>
  );
}

// --- COMPONENTE PRINCIPAL ---
export default function EditProductForm({ producto, categorias: categoriasIniciales }: ProductFormProps) {
  // 1. Estados iniciales del formulario
  const initialState: State = { message: null, errors: {} };
  const [state, dispatch, isPending] = useActionState<State, FormData>(actualizarProducto, initialState);

  // 2. Estado para el Modal y Categorías
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoriasList, setCategoriasList] = useState(categoriasIniciales);
  
  // 3. ESTADOS PARA EL BUSCADOR (COMBOBOX)
  const initialTipo = state.payload?.tipo || producto.tipo || "";
  const [selectedTipo, setSelectedTipo] = useState<string>(initialTipo); 
  const [searchTerm, setSearchTerm] = useState<string>(initialTipo);     
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  // 4. Estados de Stock y Descripción
  // SOLUCIÓN: Tipamos el estado como <number | string> para permitir el vacío ""
  const [stockActual, setStockActual] = useState<number | string>(state.payload?.stock ?? producto.stock);
  const [descLength, setDescLength] = useState(producto.descripcion?.length || 0);
  
  // Helpers de Stock (Actualizados para manejar string vacío)
  const handleSumarStock = () => {
    setStockActual((prev) => (prev === "" ? 1 : Number(prev) + 1));
  };

  const handleRestarStock = () => {
    setStockActual((prev) => {
        const valorNumerico = prev === "" ? 0 : Number(prev);
        return valorNumerico > 0 ? valorNumerico - 1 : 0;
    });
  };

  // --- LÓGICA DEL COMBOBOX ---
  const mostrarTodo = searchTerm === selectedTipo;

  const basicasFiltradas = mostrarTodo 
    ? CATEGORIAS_BASICAS 
    : CATEGORIAS_BASICAS.filter(c => c.toLowerCase().includes(searchTerm.toLowerCase()));

  const misCategoriasFiltradas = mostrarTodo
    ? categoriasList
    : categoriasList.filter(c => c.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSelectOption = (valor: string) => {
    setSelectedTipo(valor);
    setSearchTerm(valor); 
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    if (!isDropdownOpen) {
        setIsDropdownOpen(true);
        inputRef.current?.focus();
    } else {
        setIsDropdownOpen(false);
    }
  };

  const handleCloseModal = (nuevoNombre?: string) => {
    setIsModalOpen(false);
    if (nuevoNombre) {
      const nuevaCategoriaTemp = { id: Date.now(), nombre: nuevoNombre };
      setCategoriasList((prev) => [...prev, nuevaCategoriaTemp]);
      
      setSelectedTipo(nuevoNombre);
      setSearchTerm(nuevoNombre);
      setIsDropdownOpen(false);
    }
  };
  
  return (
    <>
      {isDropdownOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
      )}

      <form action={dispatch} className="flex flex-col gap-8">
        <input type="hidden" name="id" value={producto.id} />

        {/* --- GRUPO SUPERIOR: INFO GENERAL --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
          
          {/* Código de Barra */}
          <label className="flex flex-col gap-2 relative">
             <span className="text-[#0d121b] dark:text-gray-200 text-sm font-semibold">Código de barra *</span>
             <div className="relative w-full">
               <input 
                 name="codigoBarra"
                 defaultValue={state.payload?.codigoBarra ?? producto.codigoBarra}
                 className={`flex w-full rounded-lg border ${state.errors?.codigoBarra ? 'border-red-500' : 'border-[#cfd7e7] dark:border-[#4a5568]'} bg-[#f8f9fc] dark:bg-[#2d3748] text-[#0d121b] dark:text-white h-12 pl-4 pr-14 text-sm font-medium outline-none focus:ring-2 focus:ring-black/20`}
                 placeholder="Escanee o ingrese código" 
                 type="text"
               />
               <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-700">
                 <span className="material-symbols-outlined text-lg">barcode_scanner</span>
               </div>
             </div>
             <ErrorMessage errors={state.errors?.codigoBarra} />
          </label>

          {/* Nombre */}
          <label className="flex flex-col gap-2">
             <span className="text-[#0d121b] dark:text-gray-200 text-sm font-semibold">Nombre del producto *</span>
             <div className="relative w-full">
               <input 
                 name="nombre"
                 defaultValue={state.payload?.nombre ?? producto.nombre}
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

          {/* --- COMBOBOX TIPO DE PRODUCTO --- */}
          <div className="flex flex-col gap-2 relative z-20">
             <span className="text-[#0d121b] dark:text-gray-200 text-sm font-semibold">Tipo de Producto *</span>
             <div className="flex gap-2 relative">
               <div className="relative w-full">
                 <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/50 text-orange-700 pointer-events-none z-10">
                   <span className="material-symbols-outlined text-lg">category</span>
                 </div>
                 
                 <input type="hidden" name="tipo" value={selectedTipo} />

                 <input
                   ref={inputRef}
                   type="text"
                   placeholder="Buscar o seleccionar..."
                   className={`flex w-full rounded-lg border ${state.errors?.tipo ? 'border-red-500' : 'border-[#cfd7e7] dark:border-[#4a5568]'} bg-[#f8f9fc] dark:bg-[#2d3748] text-[#0d121b] dark:text-white h-12 pl-12 pr-10 text-sm font-medium outline-none focus:ring-2 focus:ring-black/20 cursor-text`}
                   value={searchTerm}
                   onChange={(e) => {
                     setSearchTerm(e.target.value);
                     setIsDropdownOpen(true);
                     if (e.target.value === "") setSelectedTipo("");
                   }}
                   onFocus={() => setIsDropdownOpen(true)}
                   autoComplete="off"
                 />
                 
                 <button 
                    type="button"
                    onClick={toggleDropdown}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-black dark:text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
                 >
                   <span className={`material-symbols-outlined text-xl transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>expand_more</span>
                 </button>

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

               <button 
                 onClick={() => setIsModalOpen(true)} 
                 className="hover:cursor-pointer flex items-center justify-center shrink-0 h-12 px-4 rounded-lg border border-[#cfd7e7] bg-[#f8f9fc] hover:bg-gray-100 font-bold text-sm transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md dark:border-[#4a5568] dark:bg-[#2d3748] dark:hover:bg-[#4a5568] dark:text-white" 
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
                 defaultValue={state.payload?.proveedor ?? producto.proveedor}
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
          
          {/* DESCRIPCION */}
          <div className="md:col-span-2">
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
                  rows={3}
                  defaultValue={state.payload?.descripcion ?? producto.descripcion ?? ""}
                  onChange={(e) => setDescLength(e.target.value.length)}
                  className={`flex w-full rounded-lg border ${state.errors?.descripcion ? 'border-red-500' : 'border-[#cfd7e7] dark:border-[#4a5568]'} bg-[#f8f9fc] dark:bg-[#2d3748] text-[#0d121b] dark:text-white p-3 pl-12 text-sm font-medium resize-none outline-none focus:ring-2 focus:ring-black/20`}
                  placeholder="Ingrese detalles..." 
                />
                <div className="pointer-events-none absolute left-3 top-3 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                  <span className="material-symbols-outlined text-lg">description</span>
                </div>
              </div>
              <ErrorMessage errors={state.errors?.descripcion} />
            </label>
          </div>
        </div>

        {/* --- GRUPO INFERIOR: STOCK Y PRECIO --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
            
          {/* Stock (CORREGIDO) */}
          <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                  <span className="text-[#0d121b] dark:text-gray-200 text-sm font-semibold">Stock Total *</span>
                  <span className="text-xs font-medium text-slate-500 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      Original: <b>{producto.stock}</b>
                  </span>
              </div>
              <div className="relative w-full flex items-center gap-2">
                 <button 
                    type="button"
                    onClick={handleRestarStock}
                    className="h-12 w-12 flex items-center justify-center rounded-lg border border-[#cfd7e7] dark:border-[#4a5568] bg-white dark:bg-[#2d3748] hover:bg-red-50 hover:border-red-200 text-slate-600 hover:text-red-600 transition-colors"
                 >
                    <span className="material-symbols-outlined">remove</span>
                 </button>

                 <div className="relative w-full">
                   <input 
                     name="stock"
                     value={stockActual}
                     // SOLUCIÓN: Si el valor está vacío, lo dejamos vacío. Si no, lo convertimos a número (eliminando ceros a la izquierda)
                     onChange={(e) => {
                        const val = e.target.value;
                        if (val === "") setStockActual("");
                        else setStockActual(Number(val));
                     }}
                     className={`flex w-full rounded-lg border ${state.errors?.stock ? 'border-red-500' : 'border-[#cfd7e7] dark:border-[#4a5568]'} bg-[#f8f9fc] dark:bg-[#2d3748] text-[#0d121b] dark:text-white h-12 pl-12 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-black/20`}
                     placeholder="0" 
                     type="number"
                   />
                   <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 text-emerald-700">
                     <span className="material-symbols-outlined text-lg">inventory</span>
                   </div>
                 </div>

                 <button 
                    type="button"
                    onClick={handleSumarStock}
                    className="h-12 w-12 flex items-center justify-center rounded-lg border border-[#cfd7e7] dark:border-[#4a5568] bg-white dark:bg-[#2d3748] hover:bg-green-50 hover:border-green-200 text-slate-600 hover:text-green-600 transition-colors"
                 >
                    <span className="material-symbols-outlined">add</span>
                 </button>
              </div>
              <ErrorMessage errors={state.errors?.stock} />
          </div>

          {/* Precio */}
          <label className="flex flex-col gap-2">
             <span className="text-[#0d121b] dark:text-gray-200 text-sm font-semibold">Precio Unitario *</span>
             <div className="relative w-full">
               <input 
                 name="precio"
                 defaultValue={state.payload?.precio ?? producto.precio}
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

        <div className="h-px bg-slate-100 dark:bg-slate-800 w-full"></div>

        {/* --- BOTONES DE ACCIÓN --- */}
        <div className="flex flex-col items-end gap-2">
            {state.message && (
               <div className="text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-md text-sm w-full text-center">
                   {state.message}
               </div>
            )}

            <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4 w-full">
              
              <button
                formAction={eliminarProducto}
                className="w-full md:w-auto h-10 px-4 rounded-lg bg-red-600 text-white font-bold text-sm shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-md hover:bg-red-700 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
                Eliminar Producto
              </button>

              <div className="flex flex-col-reverse md:flex-row gap-4 w-full md:w-auto">
                
                <Link
                  href="/inventario"
                  className="w-full md:w-auto h-10 px-4 rounded-lg text-sm font-semibold text-neutral-700 border border-neutral-300 flex items-center justify-center hover:bg-neutral-50 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md dark:text-neutral-300 dark:border-neutral-700 dark:hover:bg-neutral-800"
                >
                  Cancelar
                </Link>

                <button
                  type="submit"
                  disabled={isPending}
                  className={`hover:cursor-pointer w-full md:w-auto h-10 px-4 rounded-lg text-sm font-bold text-white flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md
                  ${isPending ? 'bg-neutral-500 cursor-not-allowed' : 'bg-neutral-800 hover:bg-black dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200'}`}
                >
                  {isPending ? (
                      <>
                          <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                          Guardando...
                      </>
                  ) : (
                      <>
                          <span className="material-symbols-outlined text-[18px]">save</span>
                          Guardar Cambios
                      </>
                  )}
                </button>
              </div>
            </div>
        </div>
      </form>
      
      {/* MODAL PARA AGREGAR TIPO */}
      <AgregarTipoModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}