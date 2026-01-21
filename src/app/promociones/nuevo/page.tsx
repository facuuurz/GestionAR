"use client";

import { useActionState, useState } from "react";
import { crearPromocion, buscarProductosParaPromocion, State } from "@/actions/promociones";
import Link from "next/link";

// Definimos un tipo para los ítems seleccionados que incluye la cantidad
type ProductoSeleccionado = {
    producto: any;
    cantidad: number;
};

export default function NuevaPromocionPage() {
  const initialState: State = { message: null, errors: {} };
  const [state, formAction, isPending] = useActionState(crearPromocion, initialState);

  // --- LÓGICA DE PRODUCTOS ---
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState<any[]>([]);
  
  // Ahora el estado guarda objetos con el producto y su cantidad
  const [productosSeleccionados, setProductosSeleccionados] = useState<ProductoSeleccionado[]>([]);

  // 1. Buscar productos
  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setBusqueda(term);
    if (term.length > 2) {
      const res = await buscarProductosParaPromocion(term);
      setResultados(res);
    } else {
      setResultados([]);
    }
  };

  // 2. Agregar producto (Inicia con cantidad 1)
  const agregarProducto = (prod: any) => {
    if (!productosSeleccionados.some((p) => p.producto.id === prod.id)) {
      setProductosSeleccionados([...productosSeleccionados, { producto: prod, cantidad: 1 }]);
    }
    setBusqueda("");
    setResultados([]);
  };

  // 3. Quitar producto
  const quitarProducto = (id: number) => {
    setProductosSeleccionados(productosSeleccionados.filter((p) => p.producto.id !== id));
  };

  // 4. NUEVO: Manejar el cambio de cantidad (+/-)
  const actualizarCantidad = (id: number, delta: number) => {
    setProductosSeleccionados(prevItems => 
        prevItems.map(item => {
            if (item.producto.id === id) {
                const nuevaCantidad = item.cantidad + delta;
                // Aseguramos que la cantidad mínima sea 1
                return { ...item, cantidad: nuevaCantidad > 0 ? nuevaCantidad : 1 };
            }
            return item;
        })
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F3F4F6] dark:bg-[#0B1120] text-slate-800 dark:text-slate-200">
      
      <main className="flex-1 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8 w-full">
        <div className="w-full max-w-7xl">
            
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="flex mb-4 text-sm text-slate-500 dark:text-slate-400">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                    <Link className="hover:text-slate-700 dark:hover:text-slate-200" href="/">Panel</Link>
                </li>
                <li>
                <div className="flex items-center">
                    <span className="material-symbols-outlined text-base mx-1">chevron_right</span>
                    <Link className="hover:text-slate-700 dark:hover:text-slate-200" href="/promociones">Promociones</Link>
                </div>
                </li>
                <li aria-current="page">
                <div className="flex items-center">
                    <span className="material-symbols-outlined text-base mx-1">chevron_right</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">Agregar Nueva Promoción</span>
                </div>
                </li>
            </ol>
            </nav>

            {/* Título */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Agregar Nueva Promoción</h1>
                <p className="mt-2 text-slate-500 dark:text-slate-400 text-lg">Ingrese los detalles de la nueva campaña promocional.</p>
            </div>

            {/* FORMULARIO */}
            <div className="bg-white dark:bg-[#1E293B] shadow-sm rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                
                <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700/50 flex items-center gap-3">
                    <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">local_offer</span>
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Información de la Promoción</h2>
                </div>

                <form action={formAction} className="p-6 md:p-8">
                    
                    {/* INPUT OCULTO: Envía solo los IDs por ahora */}
                    <input 
                        type="hidden" 
                        name="productosData" 
                        value={JSON.stringify(
                            productosSeleccionados.map(p => ({ 
                                id: p.producto.id, 
                                cantidad: p.cantidad 
                            }))
                        )} 
                    />

                    {/* Mensaje Global de Error */}
                    {state.message && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-900 text-sm font-medium flex items-center gap-2">
                            <span className="material-symbols-outlined text-[20px]">error</span>
                            {state.message}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        
                        {/* NOMBRE */}
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" htmlFor="nombre">Nombre de la Promoción</label>
                            <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg p-1.5 focus-within:ring-2 focus-within:ring-slate-200 dark:focus-within:ring-slate-600 focus-within:border-slate-400 transition-all">
                                <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md flex items-center justify-center">
                                    <span className="material-symbols-outlined text-xl">loyalty</span>
                                </div>
                                <input 
                                    className="block w-full border-0 bg-transparent p-2 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 sm:text-sm focus:outline-none" 
                                    id="nombre" name="nombre" placeholder="Ej. Descuento de Verano" type="text"
                                    defaultValue={state.payload?.nombre}
                                />
                            </div>
                            {state.errors?.nombre && <p className="text-sm text-red-500 mt-1">{state.errors.nombre[0]}</p>}
                        </div>

                        {/* DESCRIPCIÓN */}
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" htmlFor="descripcion">Descripción</label>
                            <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg p-1.5 focus-within:ring-2 focus-within:ring-slate-200 dark:focus-within:ring-slate-600 focus-within:border-slate-400 transition-all h-[54px]">
                                <div className="flex-shrink-0 h-10 w-10 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-md flex items-center justify-center">
                                    <span className="material-symbols-outlined text-xl">description</span>
                                </div>
                                <input 
                                    className="block w-full border-0 bg-transparent p-2 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 sm:text-sm focus:outline-none" 
                                    id="descripcion" name="descripcion" placeholder="Breve descripción..." type="text"
                                    defaultValue={state.payload?.descripcion}
                                />
                            </div>
                            {state.errors?.descripcion && <p className="text-sm text-red-500 mt-1">{state.errors.descripcion[0]}</p>}
                        </div>

                        {/* --- SECCIÓN DE PRODUCTOS (DISEÑO NUEVO) --- */}
                        <div className="col-span-1 md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Productos Incluidos</label>
                            
                            {/* BUSCADOR (Estilo más claro) */}
                            <div className="relative mb-4">
                                <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-2 focus-within:ring-2 focus-within:ring-blue-500 dark:focus-within:ring-blue-600 transition-all shadow-sm">
                                    <div className="flex-shrink-0 h-10 w-10 bg-orange-50 dark:bg-orange-900/20 text-orange-500 dark:text-orange-400 rounded-md flex items-center justify-center">
                                        <span className="material-symbols-outlined text-xl">search</span>
                                    </div>
                                    <input 
                                        type="text"
                                        value={busqueda}
                                        onChange={handleSearch}
                                        className="block w-full border-0 bg-transparent p-2 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 sm:text-sm focus:outline-none" 
                                        placeholder="Buscar y agregar producto..." 
                                    />
                                     <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center text-slate-400">
                                        <span className="material-symbols-outlined text-xl">add_circle</span>
                                    </div>
                                </div>

                                {/* LISTA FLOTANTE DE RESULTADOS */}
                                {resultados.length > 0 && (
                                    <div className="absolute z-10 mt-1 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                                        {resultados.map((prod) => (
                                            <div 
                                                key={prod.id}
                                                onClick={() => agregarProducto(prod)} 
                                                className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer flex justify-between items-center border-b border-slate-100 dark:border-slate-700 last:border-0"
                                            >
                                                <div>
                                                    <p className="font-semibold text-sm text-slate-900 dark:text-white">{prod.nombre}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{prod.codigoBarra}</p>
                                                </div>
                                                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">${prod.precio}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* LISTA DE SELECCIONADOS (DISEÑO IDENTICO A LA FOTO) */}
                            <div className="space-y-3">
                                {productosSeleccionados.length === 0 ? (
                                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700 p-6 flex flex-col items-center justify-center text-slate-400">
                                        <span className="material-symbols-outlined text-3xl mb-2 opacity-50">inventory_2</span>
                                        <span className="text-sm">No hay productos agregados.</span>
                                    </div>
                                ) : (
                                    productosSeleccionados.map((item, index) => (
                                        <div key={item.producto.id} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                                            
                                            {/* Izquierda: Numeración e Info */}
                                            <div className="flex items-center gap-4">
                                                <div className="h-8 w-8 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-500 dark:text-slate-400">
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{item.producto.nombre}</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">SKU: {item.producto.codigoBarra || "N/A"}</p>
                                                </div>
                                            </div>

                                            {/* Derecha: Controles y Eliminar */}
                                            <div className="flex items-center gap-4">
                                                
                                                {/* Control de Cantidad */}
                                                <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
                                                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 pl-2">Unidades</span>
                                                    <div className="flex items-center bg-white dark:bg-slate-800 rounded-md shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                                                        <button 
                                                            type="button"
                                                            onClick={() => actualizarCantidad(item.producto.id, -1)}
                                                            className="px-2 py-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">remove</span>
                                                        </button>
                                                        <span className="w-10 text-center text-sm font-bold text-slate-900 dark:text-white">
                                                            {item.cantidad}
                                                        </span>
                                                        <button 
                                                            type="button"
                                                            onClick={() => actualizarCantidad(item.producto.id, 1)}
                                                            className="px-2 py-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">add</span>
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Botón Eliminar (Estilo Rojo Claro) */}
                                                <button 
                                                    type="button" 
                                                    onClick={() => quitarProducto(item.producto.id)}
                                                    className="h-9 w-9 flex items-center justify-center bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-500 rounded-lg transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* PRECIO */}
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" htmlFor="precio">Precio Promocional</label>
                            <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg p-1.5 focus-within:ring-2 focus-within:ring-slate-200 dark:focus-within:ring-slate-600 focus-within:border-slate-400 transition-all">
                                <div className="flex-shrink-0 h-10 w-10 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-md flex items-center justify-center">
                                    <span className="material-symbols-outlined text-xl">attach_money</span>
                                </div>
                                <input 
                                    className="block w-full border-0 bg-transparent p-2 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 sm:text-sm focus:outline-none" 
                                    id="precio" name="precio" placeholder="0.00" step="0.01" type="number"
                                    defaultValue={state.payload?.precio}
                                />
                            </div>
                            {state.errors?.precio && <p className="text-sm text-red-500 mt-1">{state.errors.precio[0]}</p>}
                        </div>

                        {/* FECHAS */}
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" htmlFor="fechaInicio">Fecha de Inicio</label>
                            <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg p-1.5 focus-within:ring-2 focus-within:ring-slate-200 dark:focus-within:ring-slate-600 focus-within:border-slate-400 transition-all">
                                <div className="flex-shrink-0 h-10 w-10 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-md flex items-center justify-center">
                                    <span className="material-symbols-outlined text-xl">calendar_today</span>
                                </div>
                                <input 
                                    className="block w-full border-0 bg-transparent p-2 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 sm:text-sm focus:outline-none" 
                                    id="fechaInicio" name="fechaInicio" type="date"
                                    defaultValue={state.payload?.fechaInicio}
                                />
                            </div>
                            {state.errors?.fechaInicio && <p className="text-sm text-red-500 mt-1">{state.errors.fechaInicio[0]}</p>}
                        </div>

                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" htmlFor="fechaFin">Fecha de Fin</label>
                            <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg p-1.5 focus-within:ring-2 focus-within:ring-slate-200 dark:focus-within:ring-slate-600 focus-within:border-slate-400 transition-all">
                                <div className="flex-shrink-0 h-10 w-10 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-md flex items-center justify-center">
                                    <span className="material-symbols-outlined text-xl">event_busy</span>
                                </div>
                                <input 
                                    className="block w-full border-0 bg-transparent p-2 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 sm:text-sm focus:outline-none" 
                                    id="fechaFin" name="fechaFin" type="date"
                                    defaultValue={state.payload?.fechaFin}
                                />
                            </div>
                            {state.errors?.fechaFin && <p className="text-sm text-red-500 mt-1">{state.errors.fechaFin[0]}</p>}
                        </div>

                    </div>

                    <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-700/50 flex flex-col sm:flex-row justify-end items-center gap-4">
                        <Link 
                            href="/promociones"
                            className="w-full sm:w-auto px-6 py-2.5 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 font-medium transition-colors shadow-sm text-center"
                        >
                            Cancelar
                        </Link>
                        <button 
                            type="submit" 
                            disabled={isPending || productosSeleccionados.length === 0}
                            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 border border-transparent rounded-lg text-white bg-[#0F172A] hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 font-medium shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? (
                                <>Guardando...</>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-sm mr-2">save</span>
                                    Guardar Promoción
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
      </main>
    </div>
  );
}