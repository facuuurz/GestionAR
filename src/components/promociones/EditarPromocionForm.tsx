"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { State, buscarProductosParaPromocion } from "@/actions/promociones"; 
import Link from "next/link";
import EliminarPromocionModal from "@/components/promociones/Modal/EliminarPromocionModal"; 

// --- COMPONENTES UI ATÓMICOS ---
import InputConIcono from "@/components/promociones/ui/InputConIcono";
import BotonAccion from "@/components/promociones/ui/BotonAccion";

// --- TIPOS ---
type Producto = {
    id: number;
    nombre: string;
    codigoBarra: string | null;
    precio: number;
};

type ItemPromocionDB = {
    producto: Producto;
    cantidad: number;
    precioPromocional: number;
};

type PromocionData = {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    fechaInicio: Date;
    fechaFin: Date;
    activo: boolean; // <-- ¡NUEVO! Agregamos el campo al tipo
    productos: ItemPromocionDB[];
};

type ProductoSeleccionado = {
    producto: Producto;
    cantidad: number;
    precioPromoUnitario: number;
};

interface Props {
    promocion: PromocionData;
    actualizarAction: (prevState: State, formData: FormData) => Promise<State>;
    eliminarAction: () => Promise<void>;
}

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

export default function EditarPromocionForm({ promocion, actualizarAction, eliminarAction }: Props) {
    const router = useRouter();
    const [mostrarExito, setMostrarExito] = useState(false);
    const initialState: State = { message: null, errors: {} };
    const [state, formAction, isPending] = useActionState(actualizarAction, initialState);

    useEffect(() => {
        if (state.success) {
            setMostrarExito(true);
            setTimeout(() => {
                router.push("/promociones");
            }, 2500);
        }
    }, [state.success, router]);

    // --- ESTADOS ---
    const [textoBusqueda, setTextoBusqueda] = useState(""); 
    const busquedaDebounced = useDebounce(textoBusqueda, 200); 
    
    const [resultados, setResultados] = useState<any[]>([]);
    const [cargandoBusqueda, setCargandoBusqueda] = useState(false);
    const [mostrarResultados, setMostrarResultados] = useState(false);
    
    // ESTADOS PARA EL MODAL DE ELIMINAR
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const wrapperRef = useRef<HTMLDivElement>(null);

    // --- INICIALIZACIÓN DEL ESTADO ---
    const [productosSeleccionados, setProductosSeleccionados] = useState<ProductoSeleccionado[]>(
        promocion.productos.map(item => ({
            producto: item.producto,
            cantidad: item.cantidad,
            precioPromoUnitario: item.precioPromocional ?? item.producto.precio 
        }))
    );

    // --- ESTADOS PARA INPUTS CONTROLADOS ---
    const [nombre, setNombre] = useState(promocion.nombre);
    const [descripcion, setDescripcion] = useState(promocion.descripcion);
    const fechaInicioDefault = new Date(promocion.fechaInicio).toISOString().split('T')[0];
    const fechaFinDefault = new Date(promocion.fechaFin).toISOString().split('T')[0];
    const [fechaInicio, setFechaInicio] = useState(fechaInicioDefault);
    const [fechaFin, setFechaFin] = useState(fechaFinDefault);
    const [activo, setActivo] = useState(promocion.activo ?? true); // <-- ¡NUEVO ESTADO!

    // --- VALIDACIÓN CLIENTE ---
    const [erroresCliente, setErroresCliente] = useState<{
        nombre?: string;
        descripcion?: string;
        fechas?: string;
        productos?: string;
    }>({});

    // --- EFECTOS ---
    useEffect(() => {
        const buscar = async () => {
            setCargandoBusqueda(true);
            const res = await buscarProductosParaPromocion(busquedaDebounced);
            setResultados(res);
            setCargandoBusqueda(false);
        };
        if (mostrarResultados || busquedaDebounced.length > 0) { buscar(); }
    }, [busquedaDebounced, mostrarResultados]);

    useEffect(() => {
        if (state.payload) {
            setNombre(state.payload.nombre || "");
            setDescripcion(state.payload.descripcion || "");
            setFechaInicio(state.payload.fechaInicio || "");
            setFechaFin(state.payload.fechaFin || "");
            if (state.payload.activo !== undefined) setActivo(state.payload.activo);
        }
    }, [state]);

    useEffect(() => {
        if (state.payload && state.payload.productosDataUI) {
            try {
                const productosRestaurados = JSON.parse(state.payload.productosDataUI);
                setProductosSeleccionados(productosRestaurados);
            } catch (error) {
                console.error("Error al restaurar productos:", error);
            }
        }
    }, [state]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setMostrarResultados(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // --- FORMATEADORES Y LOGICA FORMULARIO ---
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 2 }).format(amount);
    };

    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTextoBusqueda(e.target.value);
        setMostrarResultados(true);
    };

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

    const agregarProducto = (prod: any) => {
        if (!productosSeleccionados.some((p) => p.producto.id === prod.id)) {
            setProductosSeleccionados([
                ...productosSeleccionados,
                { producto: prod, cantidad: 1, precioPromoUnitario: Number(prod.precio) || 0 }
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

    // --- NUEVA LOGICA DE ELIMINAR ---
    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await eliminarAction();
        } catch (error) {
            console.error(error);
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    // --- VALIDACIÓN AL SUBMIT ---
    const handleSubmit = (formData: FormData) => {
        const errores: typeof erroresCliente = {};
        let hayError = false;

        if (!nombre || nombre.trim().length < 3) {
            errores.nombre = "El nombre es obligatorio (mín. 3 caracteres).";
            hayError = true;
        }
        if (!descripcion || descripcion.trim().length < 3) {
            errores.descripcion = "La descripción es obligatoria.";
            hayError = true;
        }
        if (productosSeleccionados.length === 0) {
            errores.productos = "Debes agregar al menos un producto.";
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
        <div className="bg-white dark:bg-[#1E293B] shadow-sm rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
            
            <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-slate-700 dark:text-slate-300">edit_square</span>
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Editar Promoción</h2>
                </div>
                <div className="text-xs font-bold px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-500 rounded uppercase">
                    ID: {promocion.id}
                </div>
            </div>

            <form action={handleSubmit} className="p-6 md:p-8">
                
                <input 
                    type="hidden" 
                    name="productosData" 
                    value={JSON.stringify(productosSeleccionados.map(p => ({ id: p.producto.id, cantidad: p.cantidad <= 0 ? 1 : p.cantidad, precioPromoUnitario: p.precioPromoUnitario })))} 
                />
                <input 
                    type="hidden" 
                    name="productosDataUI" 
                    value={JSON.stringify(productosSeleccionados)} 
                />
                <input type="hidden" name="precio" value={totalGeneral} />
                
                {/* INPUT OCULTO QUE ENVÍA EL ESTADO REAL */}
                {activo && <input type="hidden" name="activo" value="on" />} 

                {state.message && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-900 text-sm font-medium flex items-center gap-2">
                        <span className="material-symbols-outlined text-[20px]">error</span>
                        {state.message}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    
                    {/* NOMBRE USANDO UI ATÓMICO */}
                    <InputConIcono
                        className="col-span-1"
                        label="Nombre de la Promoción"
                        name="nombre"
                        iconName="loyalty"
                        iconColorClass="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        errors={erroresCliente.nombre ? [erroresCliente.nombre] : state.errors?.nombre}
                        requiredMark
                    />

                    {/* DESCRIPCIÓN USANDO UI ATÓMICO */}
                    <InputConIcono
                        className="col-span-1"
                        label="Descripción"
                        name="descripcion"
                        iconName="description"
                        iconColorClass="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        errors={erroresCliente.descripcion ? [erroresCliente.descripcion] : state.errors?.descripcion}
                        requiredMark
                    />

                    {/* --- SECCIÓN PRODUCTOS --- */}
                    <div className="col-span-1 md:col-span-2 relative" ref={wrapperRef}>
                        <label className="block text-sm font-bold text-[#111318] dark:text-gray-200 mb-2">Productos Incluidos *</label>
                        
                        {/* Buscador */}
                        <div className="relative mb-4">
                             <div className={`flex items-center bg-[#f8fafa] dark:bg-gray-800 border-2 rounded-lg py-1 px-1 transition-all ${erroresCliente.productos ? 'border-red-500 focus-within:border-red-500 focus-within:ring-red-500/20' : 'border-transparent focus-within:border-[#135bec] focus-within:ring-2 focus-within:ring-[#135bec]/20'}`}>
                                <div className="flex-shrink-0 h-10 w-10 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-md flex items-center justify-center ml-1">
                                    {cargandoBusqueda ? <span className="material-symbols-outlined animate-spin text-xl">progress_activity</span> : <span className="material-symbols-outlined text-xl">inventory_2</span>}
                                </div>
                                <input className="block w-full border-0 bg-transparent p-2 text-slate-900 dark:text-white focus:ring-0 sm:text-sm focus:outline-none" placeholder="Buscar producto..." type="text" value={textoBusqueda} onChange={handleSearchInput} onFocus={handleSearchFocus} autoComplete="off" />
                                <div className="p-2 text-slate-400"><span className="material-symbols-outlined">search</span></div>
                            </div>
                            
                            {/* Resultados */}
                            {mostrarResultados && resultados.length > 0 && (
                                <div className="absolute z-20 mt-1 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                                    {resultados.map((prod) => (
                                        <div key={prod.id} onClick={() => agregarProducto(prod)} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer flex justify-between items-center border-b border-slate-100 dark:border-slate-700 last:border-0">
                                            <div><p className="font-semibold text-sm text-slate-900 dark:text-white">{prod.nombre}</p><p className="text-xs text-slate-500 dark:text-slate-400">{prod.codigoBarra}</p></div>
                                            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(prod.precio)}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        {erroresCliente.productos && <p className="text-xs text-red-500 mb-2 flex items-center"><span className="material-symbols-outlined text-xs mr-1">info</span>{erroresCliente.productos}</p>}
                        
                        <div className="space-y-3">
                            {productosSeleccionados.map((item, index) => (
                                <div key={item.producto.id} className="flex flex-col xl:flex-row items-start xl:items-center justify-between p-4 bg-white dark:bg-slate-700/30 border border-slate-200 dark:border-slate-600 rounded-lg shadow-sm gap-4">
                                    {/* Info Producto */}
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className="h-8 w-8 rounded bg-slate-100 dark:bg-slate-600/50 flex-shrink-0 flex items-center justify-center text-slate-500 dark:text-slate-300"><span className="text-xs font-bold">{index + 1}</span></div>
                                        <div className="flex flex-col"><span className="text-sm font-semibold text-slate-900 dark:text-white">{item.producto.nombre}</span><div className="flex flex-wrap items-center gap-2 mt-1"><span className="text-xs text-slate-500 dark:text-slate-400">SKU: {item.producto.codigoBarra || "N/A"}</span><span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-1.5 py-0.5 rounded flex items-center">Promo: {formatCurrency(item.precioPromoUnitario)}</span></div></div>
                                    </div>
                                    {/* Controles */}
                                    <div className="flex items-center justify-between xl:justify-end gap-6 w-full xl:w-auto">
                                        <div className="flex flex-col items-start xl:items-center"><span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold mb-1">Precio</span><div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg overflow-hidden h-[34px]"><span className="pl-3 pr-1 text-slate-400 text-sm">$</span><input className="w-24 p-1 text-sm bg-transparent border-0 text-slate-900 dark:text-white focus:ring-0 font-medium focus:outline-none" type="number" min="0" step="0.01" value={item.precioPromoUnitario === 0 ? "" : item.precioPromoUnitario} placeholder="0" onChange={(e) => actualizarPrecioUnitario(item.producto.id, e.target.value)} /></div></div>
                                        <div className="flex flex-col items-center"><span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold mb-1">Cant</span><div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg overflow-hidden"><button type="button" onClick={() => modificarCantidadBotones(item.producto.id, -1)} className="px-2 py-1.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"><span className="material-symbols-outlined text-sm font-bold">remove</span></button><input className="w-16 p-1 text-center text-sm bg-transparent border-0 text-slate-900 dark:text-white focus:ring-0 font-medium focus:outline-none appearance-none" type="number" min="1" value={item.cantidad === 0 ? "" : item.cantidad} onChange={(e) => cambiarCantidadManual(item.producto.id, e.target.value)} onBlur={() => validarCantidadOnBlur(item.producto.id)} /><button type="button" onClick={() => modificarCantidadBotones(item.producto.id, 1)} className="px-2 py-1.5 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"><span className="material-symbols-outlined text-sm font-bold">add</span></button></div></div>
                                        <div className="flex flex-col items-end min-w-[100px]"><span className="text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold mb-1">Subtotal</span><span className="text-sm font-bold text-slate-900 dark:text-white">{formatCurrency((item.cantidad || 0) * item.precioPromoUnitario)}</span></div>
                                        <button type="button" onClick={() => quitarProducto(item.producto.id)} className="h-9 w-9 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg flex items-center justify-center transition-colors shadow-sm border border-red-100 dark:border-red-900/30" title="Eliminar"><span className="material-symbols-outlined text-xl">delete</span></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* --- PIE DE FORMULARIO --- */}
                    <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Total Final */}
                        <div className="col-span-1">
                            <label className="block text-sm font-bold text-[#111318] dark:text-gray-200 mb-2">Precio Promocional Final</label>
                            <div className="flex items-center bg-[#f8fafa] dark:bg-gray-800 border-2 border-transparent rounded-lg py-1 px-1 transition-all">
                                <div className="flex-shrink-0 h-10 w-10 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-md flex items-center justify-center ml-1"><span className="material-symbols-outlined text-xl">attach_money</span></div>
                                <input className="block w-full border-0 bg-transparent p-2 text-slate-900 dark:text-white sm:text-sm font-bold focus:ring-0 focus:outline-none" readOnly type="text" value={formatCurrency(totalGeneral)} />
                            </div>
                        </div>

                        {/* FECHA INICIO USANDO UI ATÓMICO */}
                        <InputConIcono
                            className="col-span-1"
                            label="Fecha de Inicio"
                            name="fechaInicio"
                            type="date"
                            iconName="calendar_today"
                            iconColorClass="bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400"
                            value={fechaInicio}
                            onChange={(e) => setFechaInicio(e.target.value)}
                            errors={erroresCliente.fechas ? [erroresCliente.fechas] : state.errors?.fechaInicio}
                            requiredMark
                        />

                        {/* FECHA FIN USANDO UI ATÓMICO */}
                        <InputConIcono
                            className="col-span-1"
                            label="Fecha de Fin"
                            name="fechaFin"
                            type="date"
                            iconName="event_busy"
                            iconColorClass="bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400"
                            value={fechaFin}
                            onChange={(e) => setFechaFin(e.target.value)}
                            errors={state.errors?.fechaFin}
                            requiredMark
                        />
                    </div>
                    
                    {/* --- NUEVO: TOGGLE DE ESTADO ACTIVO/INACTIVO --- */}
                    <div className="col-span-1 md:col-span-2 mt-4 p-5 bg-slate-50 dark:bg-[#151a25] rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Estado de la Promoción</h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Activa o desactiva esta promoción manualmente, sin importar las fechas.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={activo} 
                                onChange={(e) => setActivo(e.target.checked)} 
                                className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-emerald-500"></div>
                            <span className={`ml-3 text-sm font-bold w-16 ${activo ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                                {activo ? 'Activa' : 'Inactiva'}
                            </span>
                        </label>
                    </div>

                </div>

                {/* --- FOOTER: BOTONES --- */}
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700/50 flex flex-col-reverse md:flex-row justify-between items-center gap-4">
                    
                    {/* BOTÓN ELIMINAR */}
                    <button 
                        type="button" 
                        onClick={handleDeleteClick} 
                        className="w-full md:w-auto h-10 px-4 rounded-lg bg-red-600 text-white font-bold text-sm shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-md hover:bg-red-700 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                        Eliminar Promoción
                    </button>

                    <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                        <Link href="/promociones" className="w-full md:w-auto h-10 px-4 rounded-lg text-sm font-semibold text-neutral-700 dark:text-slate-200 border border-neutral-300 dark:border-slate-600 flex items-center justify-center hover:bg-neutral-50 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md">
                            Cancelar
                        </Link>
                        
                        {/* BOTON GUARDAR ATÓMICO */}
                        <BotonAccion 
                            type="submit"
                            isPending={isPending}
                            texto="Guardar Cambios"
                            icono="save"
                        />
                    </div>
                </div>

            </form>

            {/* RENDERIZAR EL MODAL */}
            <EliminarPromocionModal 
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleConfirmDelete}
                isDeleting={isDeleting}
                nombrePromocion={promocion.nombre}
            />

            <div className={`fixed bottom-6 left-6 z-[100] transform transition-all duration-500 ease-in-out ${mostrarExito ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
                <div className="bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-green-500">
                    <div className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-xl">check</span>
                    </div>
                    <div>
                        <p className="font-bold text-sm">¡Éxito!</p>
                        <p className="text-xs text-green-100">{state.message || "La promoción se actualizó correctamente."}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}