"use client";

import { useState, useActionState, useRef, useEffect } from "react";
import Link from "next/link";
import { actualizarProducto, eliminarProducto, State } from "@/actions/productos";
import AgregarTipoModal from "@/components/Inventario/AgregarTipoModal/AgregarTipoModal"; 
import EliminarProductoModal from "@/components/Inventario/Modal/EliminarProductoModal";
import InputConIcono from "@/components/Inventario/ui/InputConIcono";
import TextareaConContador from "@/components/Inventario/ui/TextareaConContador";
import ToggleSwitch from "@/components/Inventario/ui/ToggleSwitch";

// --- TIPOS ---
interface ProductFormProps {
  producto: {
    id: number;
    codigoBarra: string | null;
    nombre: string;
    stock: number;
    precio: number;
    tipo: string;
    proveedor: string | null;
    descripcion: string | null;
    fechaVencimiento?: Date | string | null; 
    esPorPeso: boolean;
  };
  categorias: {
    id: number;
    nombre: string;
  }[];
}

const CATEGORIAS_BASICAS = ["bebidas", "alimentos", "limpieza", "otros"];



const formatDateForInput = (date?: Date | string | null) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().split('T')[0];
};

export default function EditProductForm({ producto, categorias: categoriasIniciales }: ProductFormProps) {
  const initialState: State = { message: null, errors: {} };
  const [state, dispatch, isPending] = useActionState<State, FormData>(actualizarProducto, initialState);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoriasList, setCategoriasList] = useState(categoriasIniciales);
  
  const [esPorPeso, setEsPorPeso] = useState(producto.esPorPeso);

  const initialTipo = state.payload?.tipo || producto.tipo || "";
  const [selectedTipo, setSelectedTipo] = useState<string>(initialTipo); 
  const [searchTerm, setSearchTerm] = useState<string>(initialTipo);     
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [stockActual, setStockActual] = useState<number | string>(state.payload?.stock ?? producto.stock);
  const [descLength, setDescLength] = useState(producto.descripcion?.length || 0);

  // 2. ESTADOS PARA EL MODAL DE ELIMINAR
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, []);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescLength(e.target.value.length);
    adjustHeight();
  };
  
  const handleSumarStock = () => setStockActual((prev) => (prev === "" ? 1 : Number(prev) + 1));
  const handleRestarStock = () => {
    setStockActual((prev) => {
        const valorNumerico = prev === "" ? 0 : Number(prev);
        return valorNumerico > 0 ? valorNumerico - 1 : 0;
    });
  };

  const mostrarTodo = searchTerm === selectedTipo;
  const basicasFiltradas = mostrarTodo ? CATEGORIAS_BASICAS : CATEGORIAS_BASICAS.filter(c => c.toLowerCase().includes(searchTerm.toLowerCase()));
  const misCategoriasFiltradas = mostrarTodo ? categoriasList : categoriasList.filter(c => c.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

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

  // 3. FUNCIÓN PARA CONFIRMAR ELIMINACIÓN
  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    // Creamos el FormData manualmente porque no es un submit nativo
    const formData = new FormData();
    formData.append("id", producto.id.toString());

    try {
        await eliminarProducto(formData);
        // Si hay redirect, el componente se desmonta aquí.
    } catch (error: any) {
        // Ignoramos el error de redirección de Next.js
        if (error.message === "NEXT_REDIRECT") {
            throw error;
        }
        console.error(error);
        setIsDeleting(false);
        setShowDeleteModal(false);
        alert("Error al eliminar el producto");
    }
  };
  
  return (
    <>
      {isDropdownOpen && (
        <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
      )}

      <form action={dispatch} className="flex flex-col gap-8">
        <input type="hidden" name="id" value={producto.id} />
        <input type="hidden" name="esPorPeso" value={esPorPeso ? "true" : "false"} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
          
          <InputConIcono
            name="codigoBarra"
            label="Código de barra *"
            icon="barcode_scanner"
            iconBgColor="bg-purple-100 text-purple-700"
            placeholder="Escanee o ingrese código"
            type="text"
            defaultValue={state.payload?.codigoBarra ?? producto.codigoBarra ?? ""}
            error={state.errors?.codigoBarra?.[0]}
            rightElement={
              <button type="button" className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-700 hover:bg-purple-200 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-lg">qr_code_scanner</span>
              </button>
            }
          />

          <InputConIcono
            name="nombre"
            label="Nombre del producto *"
            icon="shopping_bag"
            placeholder="Ej. Coca Cola 2L"
            type="text"
            defaultValue={state.payload?.nombre ?? producto.nombre}
            error={state.errors?.nombre?.[0]}
          />

          {/* ... (SECCIÓN TIPO DE PRODUCTO - IGUAL QUE ANTES) ... */}
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
                  <button type="button" onClick={toggleDropdown} className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-black dark:text-gray-400 hover:text-blue-600 transition-colors cursor-pointer">
                    <span className={`material-symbols-outlined text-xl transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}>expand_more</span>
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 w-full bg-white dark:bg-[#2d3748] border border-[#e5e7eb] dark:border-[#4a5568] rounded-lg shadow-lg max-h-60 overflow-y-auto z-30 animate-in fade-in zoom-in-95 duration-100">
                      {basicasFiltradas.length > 0 && (
                        <div>
                          <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-[#1a202c]">Básicos</div>
                          {basicasFiltradas.map((opcion) => (
                            <button key={opcion} type="button" onClick={() => handleSelectOption(opcion)} className="w-full text-left px-4 py-2 text-sm text-[#0d121b] dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#4a5568] capitalize transition-colors">
                              {opcion}
                            </button>
                          ))}
                        </div>
                      )}
                      {misCategoriasFiltradas.length > 0 && (
                        <div>
                          <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 dark:bg-[#1a202c] border-t border-gray-100 dark:border-gray-700">Mis Categorías</div>
                          {misCategoriasFiltradas.map((cat) => (
                            <button key={cat.id} type="button" onClick={() => handleSelectOption(cat.nombre)} className="w-full text-left px-4 py-2 text-sm text-[#0d121b] dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#4a5568] capitalize transition-colors">
                              {cat.nombre}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <button onClick={() => setIsModalOpen(true)} className="hover:cursor-pointer flex items-center justify-center shrink-0 h-12 px-4 rounded-lg border border-[#cfd7e7] bg-[#f8f9fc] hover:bg-gray-100 font-bold text-sm transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md dark:border-[#4a5568] dark:bg-[#2d3748] dark:hover:bg-[#4a5568] dark:text-white" type="button">
                  <span className="material-symbols-outlined text-[20px] mr-2">add</span>Agregar
                </button>
              </div>
              {state.errors?.tipo && (
                  <p className="text-red-500 text-xs mt-1 font-medium ml-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">error</span>
                      {state.errors.tipo[0]}
                  </p>
              )}
          </div>

          <InputConIcono
            className="z-20"
            name="proveedor"
            label="Código de Proveedor *"
            icon="local_shipping"
            iconBgColor="bg-teal-100 text-teal-700"
            placeholder="REF-000"
            type="text"
            defaultValue={state.payload?.proveedor ?? producto.proveedor ?? ""}
            error={state.errors?.proveedor?.[0]}
          />

          <InputConIcono
            className="z-10"
            name="fechaVencimiento"
            label="Fecha de Vencimiento"
            icon="event"
            iconBgColor="bg-pink-100 text-pink-700 dark:bg-pink-900/50 dark:text-pink-300"
            type="date"
            defaultValue={formatDateForInput(state.payload?.fechaVencimiento ?? producto.fechaVencimiento)}
          />

          <div className="md:col-span-1 z-10">
            <TextareaConContador
              name="descripcion"
              label="Descripción breve"
              icon="description"
              maxLength={200}
              placeholder="Ingrese detalles..."
              initialValue={state.payload?.descripcion ?? producto.descripcion ?? ""}
              onValueChange={(val) => {
                setDescLength(val.length);
                adjustHeight();
              }}
              error={state.errors?.descripcion?.[0]}
            />
          </div>
        </div>

        <div className="h-px bg-slate-100 dark:bg-slate-800 w-full"></div>

        {/* SECCIÓN TOGGLE, STOCK Y PRECIO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <ToggleSwitch
            label="¿Producto por Peso?"
            descriptionTruphy="El stock se guardará en Gramos y el precio será por Kilo."
            descriptionFalsy="El stock se guardará por Unidades y el precio será Unitario."
            checked={esPorPeso}
            onChange={() => setEsPorPeso(!esPorPeso)}
            className="md:col-span-2"
          />

          {/* Stock */}
          <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                  <span className="text-[#0d121b] dark:text-gray-200 text-sm font-semibold">
                    {esPorPeso ? "Stock Total (Gramos) *" : "Stock Total (Unidades) *"}
                  </span>
                  <span className="text-xs font-medium text-slate-500 bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                      Original: <b>{producto.stock}</b>
                  </span>
              </div>
              <div className="relative w-full flex items-center gap-2">
                 <button type="button" onClick={handleRestarStock} className="h-12 w-12 flex items-center justify-center rounded-lg border border-[#cfd7e7] dark:border-[#4a5568] bg-white dark:bg-[#2d3748] hover:bg-red-50 hover:border-red-200 text-slate-600 hover:text-red-600 transition-colors cursor-pointer shrink-0">
                    <span className="material-symbols-outlined">remove</span>
                 </button>
                 
                 <div className="w-full">
                   <InputConIcono
                     name="stock"
                     label=""
                     icon={esPorPeso ? "scale" : "inventory"}
                     iconBgColor={esPorPeso ? 'bg-blue-100 text-blue-700' : 'bg-sky-100 text-sky-700'}
                     placeholder={esPorPeso ? "Ej. 1500" : "0"}
                     type="number"
                     value={stockActual}
                     onChange={(e) => {
                       const val = e.target.value;
                       setStockActual(val === "" ? "" : Number(val));
                     }}
                     error={state.errors?.stock?.[0]}
                     rightElement={esPorPeso ? <span className="text-xs font-bold text-blue-600 mr-2">gr</span> : undefined}
                   />
                 </div>

                 <button type="button" onClick={handleSumarStock} className="h-12 w-12 flex items-center justify-center rounded-lg border border-[#cfd7e7] dark:border-[#4a5568] bg-white dark:bg-[#2d3748] hover:bg-green-50 hover:border-green-200 text-slate-600 hover:text-green-600 transition-colors cursor-pointer shrink-0">
                    <span className="material-symbols-outlined">add</span>
                 </button>
              </div>
          </div>

          {/* Precio */}
          <InputConIcono
            name="precio"
            label={esPorPeso ? "Precio por Kilo *" : "Precio Unitario *"}
            icon="attach_money"
            iconBgColor={esPorPeso ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}
            placeholder="0.00"
            step="0.01"
            type="number"
            defaultValue={state.payload?.precio ?? producto.precio}
            error={state.errors?.precio?.[0]}
            rightElement={esPorPeso ? <span className="text-xs font-bold text-blue-600 mr-2">/kg</span> : undefined}
          />
        </div>

        <div className="flex flex-col items-end gap-2">
            {state.message && (
               <div className="text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-md text-sm w-full text-center">{state.message}</div>
            )}
            <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-4 w-full">
              
              {/* 4. BOTÓN ELIMINAR MODIFICADO */}
              <button 
                type="button" // Cambiado a type="button"
                onClick={() => setShowDeleteModal(true)} // Abre el modal
                disabled={isPending || isDeleting}
                className="w-full md:w-auto h-10 px-4 rounded-lg bg-red-600 text-white font-bold text-sm shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-md hover:bg-red-700 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
                Eliminar Producto
              </button>

              <div className="flex flex-col-reverse md:flex-row gap-4 w-full md:w-auto">
                <Link href="/inventario" className="w-full md:w-auto h-10 px-4 rounded-lg text-sm font-semibold text-neutral-700 border border-neutral-300 flex items-center justify-center hover:bg-neutral-50 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md dark:text-neutral-300 dark:border-neutral-700 dark:hover:bg-neutral-800">Cancelar</Link>
                
                <button type="submit" disabled={isPending || isDeleting} className={`hover:cursor-pointer w-full md:w-auto h-10 px-4 rounded-lg text-sm font-bold text-white flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md ${isPending || isDeleting ? 'bg-neutral-500 cursor-not-allowed' : 'bg-neutral-800 hover:bg-black dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200'}`}>
                  {isPending ? (<><span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>Guardando...</>) : (<><span className="material-symbols-outlined text-[18px]">save</span>Guardar Cambios</>)}
                </button>
              </div>
            </div>
        </div>
      </form>
      
      <AgregarTipoModal isOpen={isModalOpen} onClose={handleCloseModal} />
      
      {/* 5. RENDERIZAR EL MODAL */}
      <EliminarProductoModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
        nombreProducto={producto.nombre}
      />
    </>
  );
}