"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { crearPromocion, buscarProductosParaPromocion, State } from "@/actions/promociones";
import Link from "next/link";

// Tipo para los productos seleccionados
type ProductoSeleccionado = {
    producto: any;
    cantidad: number;
    precioPromoUnitario: number;
};

// --- HOOK DE DEBOUNCE ---
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

export default function NuevaPromocionPage() {
    const initialState: State = { message: null, errors: {} };
    const [state, formAction, isPending] = useActionState(crearPromocion, initialState);

    // --- ESTADOS ---
    const [textoBusqueda, setTextoBusqueda] = useState(""); 
    const busquedaDebounced = useDebounce(textoBusqueda, 200); 
    
    const [resultados, setResultados] = useState<any[]>([]);
    const [productosSeleccionados, setProductosSeleccionados] = useState<ProductoSeleccionado[]>([]);
    const [cargandoBusqueda, setCargandoBusqueda] = useState(false);
    const [mostrarResultados, setMostrarResultados] = useState(false);

    const wrapperRef = useRef<HTMLDivElement>(null);

    // --- VALIDACIÓN CLIENTE ---
    const [erroresCliente, setErroresCliente] = useState<{
        nombre?: string;
        descripcion?: string;
        fechas?: string;
        productos?: string;
    }>({});

    // --- EFECTO DE BÚSQUEDA ---
    useEffect(() => {
        const buscar = async () => {
            setCargandoBusqueda(true);
            const res = await buscarProductosParaPromocion(busquedaDebounced);
            setResultados(res);
            setCargandoBusqueda(false);
        };

        if (mostrarResultados || busquedaDebounced.length > 0) {
             buscar();
        }
    }, [busquedaDebounced, mostrarResultados]);

    // Cerrar buscador al hacer click fuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setMostrarResultados(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // --- FORMATEADORES ---
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 2,
        }).format(amount);
    };

    // --- LÓGICA DE INTERACCIÓN ---

    const handleSearchFocus = () => {
        setMostrarResultados(true);
        if (textoBusqueda === "" && resultados.length === 0) {
            setCargandoBusqueda(true);
            buscarProductosParaPromocion("").then(res => {
                setResultados(res);
                setCargandoBusqueda(false);
            });
        }
    };

    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTextoBusqueda(e.target.value);
        setMostrarResultados(true);
    };

    const agregarProducto = (prod: any) => {
        if (!productosSeleccionados.some((p) => p.producto.id === prod.id)) {
            setProductosSeleccionados([
                ...productosSeleccionados,
                { 
                    producto: prod, 
                    cantidad: 1,
                    precioPromoUnitario: Number(prod.precio) || 0 
                }
            ]);
            setErroresCliente(prev => ({ ...prev, productos: undefined }));
        }
        setMostrarResultados(false);
        setTextoBusqueda(""); 
    };

    const quitarProducto = (id: number) => {
        setProductosSeleccionados(productosSeleccionados.filter((p) => p.producto.id !== id));
    };

    const modificarCantidadBotones = (id: number, delta: number) => {
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

    const cambiarCantidadManual = (id: number, valor: string) => {
        const cantidadNumerica = parseInt(valor);
        setProductosSeleccionados(prevItems => 
            prevItems.map(item => {
                if (item.producto.id === id) {
                    return { ...item, cantidad: isNaN(cantidadNumerica) ? 0 : cantidadNumerica };
                }
                return item;
            })
        );
    };
    
    const validarCantidadOnBlur = (id: number) => {
         setProductosSeleccionados(prevItems => 
            prevItems.map(item => {
                if (item.producto.id === id && (item.cantidad <= 0 || !item.cantidad)) {
                    return { ...item, cantidad: 1 };
                }
                return item;
            })
        );
    };

    const actualizarPrecioUnitario = (id: number, valorInput: string) => {
        const nuevoPrecio = valorInput === "" ? 0 : parseFloat(valorInput);
        setProductosSeleccionados(prevItems =>
            prevItems.map(item => {
                if (item.producto.id === id) {
                    return { ...item, precioPromoUnitario: isNaN(nuevoPrecio) ? 0 : nuevoPrecio };
                }
                return item;
            })
        );
    };

    const totalGeneral = productosSeleccionados.reduce((acc, item) => {
        const cant = item.cantidad || 0;
        return acc + (cant * item.precioPromoUnitario);
    }, 0);


    // --- VALIDACIÓN AL SUBMIT ---
    const handleSubmit = (formData: FormData) => {
        const errores: typeof erroresCliente = {};
        let hayError = false;

        const nombre = formData.get("nombre") as string;
        const descripcion = formData.get("descripcion") as string;
        const fechaInicio = formData.get("fechaInicio") as string;
        const fechaFin = formData.get("fechaFin") as string;

        if (!nombre || nombre.trim().length < 3) {
            errores.nombre = "El nombre es obligatorio (mín. 3 caracteres).";
            hayError = true;
        }

        if (!descripcion || descripcion.trim().length < 3) {
            errores.descripcion = "La descripción es obligatoria.";
            hayError = true;
        }

        if (productosSeleccionados.length === 0) {
            errores.productos = "Debes agregar al menos un producto a la promoción.";
            hayError = true;
        }

        if (!fechaInicio || !fechaFin) {
            errores.fechas = "Ambas fechas son obligatorias.";
            hayError = true;
        } else if (fechaInicio > fechaFin) {
            errores.fechas = "La fecha de inicio no puede ser posterior a la de fin.";
            hayError = true;
        }

        if (hayError) {
            setErroresCliente(errores);
            return; 
        }

        setErroresCliente({});
        formAction(formData);
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#F3F4F6] dark:bg-[#0B1120] text-slate-800 dark:text-slate-200 font-sans transition-colors duration-200">

            <main className="flex-1 flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto">
                
                {/* --- BREADCRUMBS --- */}
                <div className="w-full mb-4">
                    <nav aria-label="Breadcrumb" className="flex items-center text-sm">
                        <Link href="/" className="text-neutral-500 hover:text-blue-600 dark:hover:text-white font-medium transition-colors">
                            Panel
                        </Link>
                        
                        <span className="material-symbols-outlined text-neutral-400 text-base mx-2">chevron_right</span>
                        
                        <Link href="/promociones" className="text-neutral-500 hover:text-blue-600 dark:hover:text-white font-medium transition-colors">
                            Promociones
                        </Link>
                        
                        <span className="material-symbols-outlined text-neutral-400 text-base mx-2">chevron_right</span>
                        
                        <span className="text-slate-900 dark:text-white font-bold">
                            Agregar Nueva Promoción
                        </span>
                    </nav>
                </div>

                <div className="w-full mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Agregar Nueva Promoción</h1>
                    <p className="mt-2 text-slate-500 dark:text-slate-400 text-lg">Ingrese los detalles de la nueva campaña promocional (Cálculo Automático).</p>
                </div>

                <div className="w-full bg-white dark:bg-[#1E293B] shadow-sm rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                    
                    <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700/50 flex items-center gap-3">
                        <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">local_offer</span>
                        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Información de la Promoción</h2>
                    </div>

                    <form action={handleSubmit} className="p-6 md:p-8">
                        
                        <input 
                            type="hidden" 
                            name="productosData" 
                            value={JSON.stringify(
                                productosSeleccionados.map(p => ({ 
                                    id: p.producto.id, 
                                    cantidad: p.cantidad <= 0 ? 1 : p.cantidad
                                }))
                            )} 
                        />
                        <input type="hidden" name="precio" value={totalGeneral} />

                        {state.message && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-900 text-sm font-medium flex items-center gap-2">
                                <span className="material-symbols-outlined text-[20px]">error</span>
                                {state.message}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            
                            {/* NOMBRE */}
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" htmlFor="nombre">
                                    Nombre de la Promoción <span className="text-black dark:text-white">*</span>
                                </label>
                                <div className={`flex items-center bg-slate-50 dark:bg-slate-800 border ${erroresCliente.nombre ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'} rounded-lg p-1.5 focus-within:ring-2 focus-within:ring-slate-200 dark:focus-within:ring-slate-600 transition-all`}>
                                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md flex items-center justify-center">
                                        <span className="material-symbols-outlined text-xl">loyalty</span>
                                    </div>
                                    <input 
                                        className="block w-full border-0 bg-transparent p-2 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 sm:text-sm focus:outline-none" 
                                        id="nombre" name="nombre" placeholder="Ej. Descuento de Verano 2024" type="text"
                                        defaultValue={state.payload?.nombre || ""}
                                    />
                                </div>
                                
                                {erroresCliente.nombre && (
                                    <p className="text-xs text-red-500 mt-1 flex items-center">
                                        <span className="material-symbols-outlined text-xs mr-1">info</span>
                                        {erroresCliente.nombre}
                                    </p>
                                )}
                                {state.errors?.nombre && (
                                    <p className="text-sm text-red-500 mt-1 flex items-center">
                                        <span className="material-symbols-outlined text-xs mr-1">info</span>
                                        {state.errors.nombre[0]}
                                    </p>
                                )}
                            </div>

                            {/* DESCRIPCIÓN */}
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" htmlFor="descripcion">
                                    Descripción <span className="text-black dark:text-white">*</span>
                                </label>
                                <div className={`flex items-center bg-slate-50 dark:bg-slate-800 border ${erroresCliente.descripcion ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'} rounded-lg p-1.5 focus-within:ring-2 focus-within:ring-slate-200 dark:focus-within:ring-slate-600 transition-all h-[54px]`}>
                                    <div className="flex-shrink-0 h-10 w-10 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-md flex items-center justify-center">
                                        <span className="material-symbols-outlined text-xl">description</span>
                                    </div>
                                    <input 
                                        className="block w-full border-0 bg-transparent p-2 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 sm:text-sm focus:outline-none" 
                                        id="descripcion" name="descripcion" placeholder="Breve descripción..." type="text"
                                        defaultValue={state.payload?.descripcion || ""}
                                    />
                                </div>
                                
                                {erroresCliente.descripcion && (
                                    <p className="text-xs text-red-500 mt-1 flex items-center">
                                        <span className="material-symbols-outlined text-xs mr-1">info</span>
                                        {erroresCliente.descripcion}
                                    </p>
                                )}
                                {state.errors?.descripcion && (
                                    <p className="text-sm text-red-500 mt-1 flex items-center">
                                        <span className="material-symbols-outlined text-xs mr-1">info</span>
                                        {state.errors.descripcion[0]}
                                    </p>
                                )}
                            </div>

                            {/* --- SECCIÓN PRODUCTOS --- */}
                            <div className="col-span-1 md:col-span-2 relative" ref={wrapperRef}>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    Productos Incluidos <span className="text-black dark:text-white">*</span>
                                </label>
                                
                                {/* BUSCADOR */}
                                <div className="relative mb-4">
                                    <div className={`flex items-center bg-slate-50 dark:bg-slate-800 border ${erroresCliente.productos ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'} rounded-lg p-1.5 focus-within:ring-2 focus-within:ring-slate-200 dark:focus-within:ring-slate-600 focus-within:border-slate-400 transition-all`}>
                                        <div className="flex-shrink-0 h-10 w-10 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-md flex items-center justify-center">
                                            {cargandoBusqueda ? (
                                                 <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span>
                                            ) : (
                                                 <span className="material-symbols-outlined text-xl">inventory_2</span>
                                            )}
                                        </div>
                                        <input 
                                            className="block w-full border-0 bg-transparent p-2 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 sm:text-sm focus:outline-none" 
                                            placeholder="Haga click para ver lista o escriba para buscar..." 
                                            type="text"
                                            value={textoBusqueda}
                                            onChange={handleSearchInput}
                                            onFocus={handleSearchFocus}
                                            autoComplete="off"
                                        />
                                        <div className="p-2 text-slate-400">
                                            <span className="material-symbols-outlined">search</span>
                                        </div>
                                    </div>

                                    {/* LISTA DESPLEGABLE RESULTADOS */}
                                    {mostrarResultados && resultados.length > 0 && (
                                        <div className="absolute z-20 mt-1 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg shadow-xl max-h-60 overflow-y-auto">
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
                                                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(prod.precio)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                     {mostrarResultados && resultados.length === 0 && !cargandoBusqueda && textoBusqueda.length > 0 && (
                                        <div className="absolute z-20 mt-1 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg shadow-xl p-4 text-center text-sm text-slate-500">
                                            No se encontraron productos.
                                        </div>
                                    )}
                                </div>

                                {erroresCliente.productos && (
                                    <p className="text-xs text-red-500 mb-2 flex items-center">
                                        <span className="material-symbols-outlined text-xs mr-1">info</span>
                                        {erroresCliente.productos}
                                    </p>
                                )}

                                {/* LISTA DE PRODUCTOS SELECCIONADOS */}
                                <div className="space-y-3">
                                    {productosSeleccionados.length === 0 ? (
                                         <div className={`bg-slate-50 dark:bg-slate-900/50 rounded-lg border ${erroresCliente.productos ? 'border-red-300' : 'border-slate-200 dark:border-slate-700'} p-8 flex flex-col items-center justify-center text-slate-400`}>
                                            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">shopping_cart_off</span>
                                            <span className="text-sm">Agrega productos para calcular la promoción.</span>
                                        </div>
                                    ) : (
                                        productosSeleccionados.map((item, index) => (
                                            <div key={item.producto.id} className="flex flex-col xl:flex-row items-start xl:items-center justify-between p-4 bg-white dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg shadow-sm gap-4">
                                                
                                                {/* Info Producto */}
                                                <div className="flex items-center gap-3 flex-1">
                                                    <div className="h-8 w-8 rounded bg-slate-100 dark:bg-slate-600/50 flex-shrink-0 flex items-center justify-center text-slate-500 dark:text-slate-300">
                                                        <span className="text-xs font-bold">{index + 1}</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{item.producto.nombre}</span>
                                                        <div className="flex flex-wrap items-center gap-2 mt-1">
                                                            <span className="text-xs text-slate-500 dark:text-slate-400">SKU: {item.producto.codigoBarra || "N/A"}</span>
                                                            <span className="text-xs text-slate-300 dark:text-slate-600 hidden sm:inline">|</span>
                                                            <span className="text-xs font-medium text-slate-400 dark:text-slate-500 line-through">U.P: {formatCurrency(item.producto.precio)}</span>
                                                            
                                                            {/* BADGE DE PRECIO PROMO UNITARIO */}
                                                            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded flex items-center">
                                                                <span className="material-symbols-outlined text-[10px] mr-1">payments</span>
                                                                Promo Unit: {formatCurrency(item.precioPromoUnitario)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Controles */}
                                                <div className="flex items-center justify-between xl:justify-end gap-6 w-full xl:w-auto">
                                                    
                                                    {/* INPUT: Precio Promo Unitario */}
                                                    <div className="flex flex-col items-start xl:items-center">
                                                        <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold mb-1">Precio Promo</span>
                                                        <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg overflow-hidden h-[34px]">
                                                            <span className="pl-3 pr-1 text-slate-400 text-sm">$</span>
                                                            <input 
                                                                className="w-24 p-1 text-sm bg-transparent border-0 text-slate-900 dark:text-white focus:ring-0 font-medium focus:outline-none" 
                                                                type="number"
                                                                min="0"
                                                                step="0.01"
                                                                value={item.precioPromoUnitario === 0 ? "" : item.precioPromoUnitario}
                                                                placeholder="0"
                                                                onChange={(e) => actualizarPrecioUnitario(item.producto.id, e.target.value)}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* INPUT: Cantidad */}
                                                    <div className="flex flex-col items-center">
                                                        <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold mb-1">Cantidad</span>
                                                        <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg overflow-hidden">
                                                            <button 
                                                                type="button"
                                                                onClick={() => modificarCantidadBotones(item.producto.id, -1)}
                                                                className="px-2 py-1.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors focus:outline-none"
                                                            >
                                                                <span className="material-symbols-outlined text-sm font-bold">remove</span>
                                                            </button>
                                                            <input 
                                                                className="w-16 p-1 text-center text-sm bg-transparent border-0 text-slate-900 dark:text-white focus:ring-0 font-medium focus:outline-none appearance-none" 
                                                                type="number"
                                                                min="1"
                                                                value={item.cantidad === 0 ? "" : item.cantidad}
                                                                onChange={(e) => cambiarCantidadManual(item.producto.id, e.target.value)}
                                                                onBlur={() => validarCantidadOnBlur(item.producto.id)}
                                                            />
                                                            <button 
                                                                type="button"
                                                                onClick={() => modificarCantidadBotones(item.producto.id, 1)}
                                                                className="px-2 py-1.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors focus:outline-none"
                                                            >
                                                                <span className="material-symbols-outlined text-sm font-bold">add</span>
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* SUBTOTAL */}
                                                    <div className="flex flex-col items-end min-w-[100px]">
                                                        <span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold mb-1">Subtotal</span>
                                                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                                                            {formatCurrency((item.cantidad || 0) * item.precioPromoUnitario)}
                                                        </span>
                                                    </div>

                                                    <button 
    type="button"
    onClick={() => quitarProducto(item.producto.id)}
    // Se agregó 'cursor-pointer' al inicio de las clases
    className="cursor-pointer h-9 w-9 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg flex items-center justify-center transition-colors shadow-sm border border-red-100 dark:border-red-900/30" 
    title="Eliminar"
>
    <span className="material-symbols-outlined text-xl">delete</span>
</button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* --- PIE DE FORMULARIO (Totales y Fechas) --- */}
                            <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                                
                                {/* TOTAL FINAL */}
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" htmlFor="display_price">Precio Promocional Final</label>
                                    <div className="flex items-center bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-600 rounded-lg p-1.5 transition-all">
                                        <div className="flex-shrink-0 h-10 w-10 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-md flex items-center justify-center">
                                            <span className="material-symbols-outlined text-xl">attach_money</span>
                                        </div>
                                        <input 
                                            className="block w-full border-0 bg-transparent p-2 text-slate-900 dark:text-white sm:text-sm font-bold focus:ring-0 focus:outline-none" 
                                            id="display_price" 
                                            readOnly 
                                            type="text" 
                                            value={formatCurrency(totalGeneral)}
                                        />
                                    </div>
                                    <p className="mt-1.5 text-[10px] text-slate-400 flex items-center">
                                        <span className="material-symbols-outlined text-xs mr-1">info</span> 
                                        Calculado automáticamente de la suma de subtotales
                                    </p>
                                </div>

                                {/* FECHA INICIO */}
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" htmlFor="fechaInicio">
                                        Fecha de Inicio <span className="text-black dark:text-white">*</span>
                                    </label>
                                    <div className={`flex items-center bg-slate-50 dark:bg-slate-800 border ${erroresCliente.fechas ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'} rounded-lg p-1.5 focus-within:ring-2 focus-within:ring-slate-200 dark:focus-within:ring-slate-600 transition-all`}>
                                        <div className="flex-shrink-0 h-10 w-10 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-md flex items-center justify-center">
                                            <span className="material-symbols-outlined text-xl">calendar_today</span>
                                        </div>
                                        <input 
                                            className="block w-full border-0 bg-transparent p-2 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 sm:text-sm focus:outline-none" 
                                            id="fechaInicio" name="fechaInicio" type="date"
                                            defaultValue={state.payload?.fechaInicio || ""}
                                        />
                                    </div>
                                    
                                    {erroresCliente.fechas && (
                                        <p className="text-xs text-red-500 mt-1 flex items-center">
                                            <span className="material-symbols-outlined text-xs mr-1">info</span>
                                            {erroresCliente.fechas}
                                        </p>
                                    )}
                                    {state.errors?.fechaInicio && (
                                        <p className="text-sm text-red-500 mt-1 flex items-center">
                                            <span className="material-symbols-outlined text-xs mr-1">info</span>
                                            {state.errors.fechaInicio[0]}
                                        </p>
                                    )}
                                </div>

                                {/* FECHA FIN */}
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" htmlFor="fechaFin">
                                        Fecha de Fin <span className="text-black dark:text-white">*</span>
                                    </label>
                                    <div className={`flex items-center bg-slate-50 dark:bg-slate-800 border ${erroresCliente.fechas ? 'border-red-500' : 'border-slate-200 dark:border-slate-600'} rounded-lg p-1.5 focus-within:ring-2 focus-within:ring-slate-200 dark:focus-within:ring-slate-600 transition-all`}>
                                        <div className="flex-shrink-0 h-10 w-10 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-md flex items-center justify-center">
                                            <span className="material-symbols-outlined text-xl">event_busy</span>
                                        </div>
                                        <input 
                                            className="block w-full border-0 bg-transparent p-2 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0 sm:text-sm focus:outline-none" 
                                            id="fechaFin" name="fechaFin" type="date"
                                            defaultValue={state.payload?.fechaFin || ""}
                                        />
                                    </div>
                                    {state.errors?.fechaFin && (
                                        <p className="text-sm text-red-500 mt-1 flex items-center">
                                            <span className="material-symbols-outlined text-xs mr-1">info</span>
                                            {state.errors.fechaFin[0]}
                                        </p>
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* --- BOTONES ACCIÓN (ESTILO ANIMADO) --- */}
                        <div className="mt-10 pt-6 border-t border-slate-100 dark:border-slate-700/50 flex flex-col sm:flex-row justify-end items-center gap-4">
                            <Link 
                                href="/promociones"
                                className="w-full md:w-auto h-10 px-4 rounded-lg text-sm font-semibold text-neutral-700 dark:text-slate-200 border border-neutral-300 dark:border-slate-600 flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md"
                            >
                                Cancelar
                            </Link>
                            
                            <button 
                                type="submit" 
                                disabled={isPending}
                                className={`hover:cursor-pointer w-full md:w-auto h-10 px-4 rounded-lg text-sm font-bold text-white flex items-center justify-center gap-2 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md
                                    ${isPending ? 'bg-neutral-500 cursor-not-allowed' : 'bg-neutral-800 hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-200'}
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
                                        Guardar Promoción
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}