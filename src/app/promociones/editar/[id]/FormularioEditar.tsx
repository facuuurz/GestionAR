"use client";

import { useActionState, useState } from "react";
import { actualizarPromocion, eliminarPromocion, buscarProductosParaPromocion, State } from "@/actions/promociones";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Definimos los tipos para los props
type Producto = {
    id: number;
    nombre: string;
    codigoBarra: string | null;
    precio: number;
};

type ItemPromocion = {
    producto: Producto;
    cantidad: number;
};

type PromocionData = {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    fechaInicio: Date;
    fechaFin: Date;
    productos: ItemPromocion[];
};

export default function FormularioEditar({ promocion }: { promocion: PromocionData }) {
  const router = useRouter();
  const initialState: State = { message: null, errors: {} };
  
  // Bind del ID a la acción de actualizar
  const actualizarPromocionConId = actualizarPromocion.bind(null, promocion.id);
  const [state, formAction, isPending] = useActionState(actualizarPromocionConId, initialState);

  // --- LÓGICA DE PRODUCTOS ---
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState<any[]>([]);
  
  // Inicializamos el estado con los productos de la promoción cargada
  const [productosSeleccionados, setProductosSeleccionados] = useState<ItemPromocion[]>(promocion.productos);

  // Formateo de fechas para los inputs (YYYY-MM-DD)
  const fechaInicioDefault = new Date(promocion.fechaInicio).toISOString().split('T')[0];
  const fechaFinDefault = new Date(promocion.fechaFin).toISOString().split('T')[0];

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

  // 2. Agregar producto
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

  // 4. Actualizar cantidad
  const actualizarCantidad = (id: number, delta: number) => {
    setProductosSeleccionados(prevItems => 
        prevItems.map(item => {
            if (item.producto.id === id) {
                const nuevaCantidad = item.cantidad + delta;
                return { ...item, cantidad: nuevaCantidad > 0 ? nuevaCantidad : 1 };
            }
            return item;
        })
    );
  };

  // 5. Eliminar Promoción Completa
  const handleEliminar = async () => {
    if (confirm("¿Estás seguro de que deseas eliminar esta promoción? Esta acción no se puede deshacer.")) {
        await eliminarPromocion(promocion.id);
        // La redirección se maneja en el server action, pero por seguridad:
        // router.push('/promociones'); 
    }
  }

  return (
    <div className="bg-white dark:bg-[#1E293B] shadow-sm rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
        
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700/50 flex items-center gap-3">
            <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">sell</span>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Información de la Promoción</h2>
        </div>

        <form action={formAction} className="p-6 md:p-8">
            
            {/* INPUT OCULTO CON PRODUCTOS Y CANTIDADES */}
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
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Nombre de la Promoción</label>
                    <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg p-1.5 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-50 text-blue-500 rounded-md flex items-center justify-center">
                            <span className="material-symbols-outlined text-xl">local_offer</span>
                        </div>
                        <input 
                            name="nombre" 
                            type="text"
                            defaultValue={state.payload?.nombre || promocion.nombre}
                            className="block w-full border-0 bg-transparent p-2 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 sm:text-sm focus:outline-none" 
                        />
                    </div>
                    {state.errors?.nombre && <p className="text-sm text-red-500 mt-1">{state.errors.nombre[0]}</p>}
                </div>

                {/* DESCRIPCIÓN */}
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Descripción</label>
                    <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg p-1.5 focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500 transition-all">
                        <div className="flex-shrink-0 h-10 w-10 bg-purple-50 text-purple-500 rounded-md flex items-center justify-center">
                            <span className="material-symbols-outlined text-xl">description</span>
                        </div>
                        <input 
                            name="descripcion" 
                            type="text"
                            defaultValue={state.payload?.descripcion || promocion.descripcion}
                            className="block w-full border-0 bg-transparent p-2 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 sm:text-sm focus:outline-none" 
                        />
                    </div>
                </div>

                {/* --- SECCIÓN PRODUCTOS --- */}
                <div className="col-span-1 md:col-span-2 mt-2">
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Productos Incluidos</label>
                    
                    <div className="relative mb-4">
                        <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg p-1.5 focus-within:ring-2 focus-within:ring-orange-500/20 focus-within:border-orange-500 transition-all">
                            <div className="flex-shrink-0 h-10 w-10 bg-orange-50 text-orange-500 rounded-md flex items-center justify-center">
                                <span className="material-symbols-outlined text-xl">inventory_2</span>
                            </div>
                            <input 
                                type="text"
                                value={busqueda}
                                onChange={handleSearch}
                                placeholder="Buscar y agregar producto..." 
                                className="block w-full border-0 bg-transparent p-2 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 sm:text-sm focus:outline-none"
                            />
                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center text-slate-400">
                                <span className="material-symbols-outlined text-2xl">add_circle</span>
                            </div>
                        </div>

                        {/* Resultados Flotantes */}
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
                                            <p className="text-xs text-slate-500">{prod.codigoBarra}</p>
                                        </div>
                                        <span className="text-sm font-bold text-emerald-600">${prod.precio}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Lista de Seleccionados */}
                    <div className="flex flex-col gap-3">
                         {productosSeleccionados.length === 0 ? (
                            <p className="text-center text-slate-400 py-4 text-sm">No hay productos en esta promoción.</p>
                        ) : (
                            productosSeleccionados.map((item, index) => (
                                <div key={item.producto.id} className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <div className="flex items-center gap-4 flex-1 w-full">
                                        <div className="size-10 flex items-center justify-center bg-gray-100 dark:bg-slate-700 rounded text-sm font-bold text-gray-500 dark:text-gray-300">
                                            {index + 1}
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-slate-900 dark:text-white font-medium text-base">{item.producto.nombre}</p>
                                            <p className="text-slate-500 dark:text-slate-400 text-xs uppercase">SKU: {item.producto.codigoBarra || "N/A"}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                        <div className="text-sm text-slate-500 dark:text-slate-400 mr-2">Unidades</div>
                                        <div className="flex items-center rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800">
                                            <button 
                                                type="button"
                                                onClick={() => actualizarCantidad(item.producto.id, -1)}
                                                className="size-8 flex items-center justify-center text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors rounded-l-lg border-r border-slate-200 dark:border-slate-600"
                                            >
                                                <span className="material-symbols-outlined text-sm">remove</span>
                                            </button>
                                            <span className="w-12 text-center text-slate-900 dark:text-white font-medium text-sm">
                                                {item.cantidad}
                                            </span>
                                            <button 
                                                type="button"
                                                onClick={() => actualizarCantidad(item.producto.id, 1)}
                                                className="size-8 flex items-center justify-center text-slate-500 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors rounded-r-lg border-l border-slate-200 dark:border-slate-600"
                                            >
                                                <span className="material-symbols-outlined text-sm">add</span>
                                            </button>
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={() => quitarProducto(item.producto.id)}
                                            className="flex items-center justify-center size-9 rounded bg-red-500 text-white hover:bg-red-600 transition-all shadow-sm"
                                            title="Eliminar producto"
                                        >
                                            <span className="material-symbols-outlined text-lg">delete</span>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* PRECIO Y FECHAS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 col-span-1 md:col-span-2">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Precio Promocional</label>
                        <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg p-1.5 focus-within:ring-2 focus-within:ring-green-500/20 focus-within:border-green-500 transition-all">
                            <div className="flex-shrink-0 h-10 w-10 bg-green-50 text-green-500 rounded-md flex items-center justify-center">
                                <span className="material-symbols-outlined text-xl">attach_money</span>
                            </div>
                            <input 
                                name="precio" 
                                type="number" 
                                step="0.01"
                                defaultValue={state.payload?.precio ?? promocion.precio}
                                className="block w-full border-0 bg-transparent p-2 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 sm:text-sm focus:outline-none" 
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Fecha de Inicio</label>
                        <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg p-1.5 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all">
                            <div className="flex-shrink-0 h-10 w-10 bg-emerald-50 text-emerald-500 rounded-md flex items-center justify-center">
                                <span className="material-symbols-outlined text-xl">calendar_today</span>
                            </div>
                            <input 
                                name="fechaInicio" 
                                type="date"
                                defaultValue={state.payload?.fechaInicio || fechaInicioDefault}
                                className="block w-full border-0 bg-transparent p-2 text-slate-900 dark:text-white focus:ring-0 sm:text-sm focus:outline-none" 
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Fecha de Fin</label>
                        <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg p-1.5 focus-within:ring-2 focus-within:ring-pink-500/20 focus-within:border-pink-500 transition-all">
                            <div className="flex-shrink-0 h-10 w-10 bg-pink-50 text-pink-500 rounded-md flex items-center justify-center">
                                <span className="material-symbols-outlined text-xl">event_busy</span>
                            </div>
                            <input 
                                name="fechaFin" 
                                type="date"
                                defaultValue={state.payload?.fechaFin || fechaFinDefault}
                                className="block w-full border-0 bg-transparent p-2 text-slate-900 dark:text-white focus:ring-0 sm:text-sm focus:outline-none" 
                            />
                        </div>
                    </div>
                </div>

            </div>

            {/* FOOTER BOTONES */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-between pt-8 border-t border-slate-100 dark:border-slate-700 mt-4 gap-4">
                <button 
                    type="button"
                    onClick={handleEliminar}
                    className="w-full sm:w-auto min-w-[120px] px-6 h-12 rounded-lg border border-red-200 text-red-600 text-base font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors bg-white dark:bg-transparent flex items-center justify-center gap-2"
                >
                    <span className="material-symbols-outlined text-sm">delete</span>
                    Eliminar Promoción
                </button>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <Link 
                        href="/promociones"
                        className="w-full sm:w-auto min-w-[120px] px-6 h-12 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-base font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors bg-white dark:bg-slate-800 flex items-center justify-center"
                    >
                        Cancelar
                    </Link>
                    <button 
                        type="submit" 
                        disabled={isPending || productosSeleccionados.length === 0}
                        className="w-full sm:w-auto min-w-[180px] px-6 h-12 rounded-lg bg-[#111a22] hover:bg-black dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-base font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isPending ? (
                            <>Guardando...</>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-sm">save</span>
                                Guardar Cambios
                            </>
                        )}
                    </button>
                </div>
            </div>

        </form>
    </div>
  );
}