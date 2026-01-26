"use client";

import { useState, useEffect } from "react";
import { buscarProductosVenta, buscarClienteVenta, procesarVenta } from "@/actions/ventas";
import { useDebounce } from "@/hooks/useDebounce";

type Producto = {
  id: number;
  nombre: string;
  codigoBarra: string | null;
  stock: number;
  precio: number;
  categoria?: string; 
};

type ItemCarrito = Producto & { cantidad: number };

type Cliente = {
  id: number;
  nombre: string;
  saldo: number;
};

export default function PantallaVenta() {
  // --- ESTADOS ---
  const [queryProd, setQueryProd] = useState("");
  const debouncedProd = useDebounce(queryProd, 300);
  const [listaProductos, setListaProductos] = useState<Producto[]>([]);
  
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  
  const [queryCliente, setQueryCliente] = useState("");
  const [listaClientes, setListaClientes] = useState<Cliente[]>([]);
  const [showClienteResults, setShowClienteResults] = useState(false);
  const debouncedCliente = useDebounce(queryCliente, 300);

  const [procesando, setProcesando] = useState(false);

  // --- EFECTOS ---
  useEffect(() => {
    if (debouncedProd) {
      buscarProductosVenta(debouncedProd).then(setListaProductos);
    } else {
      buscarProductosVenta("").then(setListaProductos);
    }
  }, [debouncedProd]);

  useEffect(() => {
    if (debouncedCliente) {
      buscarClienteVenta(debouncedCliente).then(setListaClientes);
      setShowClienteResults(true);
    } else {
      setListaClientes([]);
    }
  }, [debouncedCliente]);

  // --- LOGICA CARRITO ---
  const agregarAlCarrito = (prod: Producto) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === prod.id);
      if (existe) {
        if (existe.cantidad + 1 > prod.stock) return prev; 
        return prev.map((item) => item.id === prod.id ? { ...item, cantidad: item.cantidad + 1 } : item);
      }
      return [...prev, { ...prod, cantidad: 1 }];
    });
  };

  const modificarCantidad = (id: number, delta: number) => {
    setCarrito((prev) => 
      prev.map((item) => {
        if (item.id === id) {
          const nuevaCant = item.cantidad + delta;
          if (nuevaCant < 1) return item; 
          if (nuevaCant > item.stock) return item; 
          return { ...item, cantidad: nuevaCant };
        }
        return item;
      })
    );
  };

  const eliminarDelCarrito = (id: number) => {
      setCarrito(prev => prev.filter(item => item.id !== id));
  }

  const seleccionarCliente = (c: Cliente) => {
      setCliente(c);
      setQueryCliente(c.nombre);
      setShowClienteResults(false);
  }

  const subtotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  const descuento = 0; 
  const total = subtotal - descuento;

  const handleFinalizar = async () => {
    if (carrito.length === 0) return;
    
    setProcesando(true);
    
    const itemsParaDescontar = carrito.map(i => ({ 
        id: i.id, 
        cantidad: i.cantidad 
    }));

    const resultado = await procesarVenta(
        itemsParaDescontar, 
        total, 
        cliente?.id
    );

    if (resultado.success) {
        setCarrito([]);
        setCliente(null);
        setQueryCliente("");
    } else {
        alert("Error: " + resultado.message);
    }
    setProcesando(false);
  };

  const formatMoney = (n: number) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(n);

  return (
    <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6 h-full bg-[#f6f6f8] dark:bg-[#101622] p-4">
      
      {/* --- COLUMNA IZQUIERDA: PRODUCTOS --- */}
      <div className="lg:col-span-8 flex flex-col gap-4 h-full min-h-0">
        
        {/* BUSCADOR */}
        <div className="flex-none bg-white dark:bg-[#1e2736] p-4 rounded-xl border border-[#ededed] dark:border-[#333] shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">search</span>
              <input 
                className="w-full pl-10 pr-4 py-2.5 bg-[#f9f9f9] dark:bg-[#151a25] border border-[#ededed] dark:border-[#333] rounded-lg text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder-neutral-500" 
                placeholder="Buscar por nombre, código de barra..." 
                type="text"
                value={queryProd}
                onChange={(e) => setQueryProd(e.target.value)}
                autoFocus
              />
            </div>
            <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#151a25] border border-[#ededed] dark:border-[#333] rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-[#f9f9f9] dark:hover:bg-[#1f2937] transition-colors">
                    <span className="material-symbols-outlined text-lg">filter_list</span> Filtrar
                </button>
            </div>
          </div>
        </div>

        {/* TABLA DE PRODUCTOS */}
        <div className="flex-1 min-h-0 bg-white dark:bg-[#1e2736] rounded-xl border border-[#ededed] dark:border-[#333] shadow-sm flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#f9f9f9] dark:bg-[#151a25] sticky top-0 z-10 text-xs font-semibold text-neutral-500 uppercase tracking-wider backdrop-blur-sm border-b border-[#ededed] dark:border-[#333]">
                <tr>
                  <th className="px-6 py-4">Producto</th>
                  <th className="px-6 py-4 text-center">Stock</th>
                  <th className="px-6 py-4">Precio</th>
                  <th className="px-6 py-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ededed] dark:divide-[#333] text-sm">
                {listaProductos.map((prod) => (
                    <tr key={prod.id} className="hover:bg-[#f9f9f9] dark:hover:bg-[#151a25]/50 transition-colors group cursor-pointer" onClick={() => agregarAlCarrito(prod)}>
                        <td className="px-6 py-4">
                            <div className="flex flex-col">
                                <span className="font-medium text-gray-900 dark:text-white text-base">{prod.nombre}</span>
                                <span className="text-xs text-neutral-500">{prod.codigoBarra || "S/C"}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold ${prod.stock < 10 ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'}`}>
                                {prod.stock} un.
                            </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{formatMoney(prod.precio)}</td>
                        <td className="px-6 py-4 text-right">
                            {/* Botón Agregar estilizado */}
                            <button className="text-white bg-[#1e2736] hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-200 px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ml-auto shadow-sm">
                                <span className="material-symbols-outlined text-sm">add</span> Agregar
                            </button>
                        </td>
                    </tr>
                ))}
                {listaProductos.length === 0 && (
                    <tr>
                        <td colSpan={4} className="text-center py-10 text-neutral-500">No se encontraron productos</td>
                    </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- COLUMNA DERECHA: CARRITO --- */}
      <div className="lg:col-span-4 flex flex-col gap-4 h-full min-h-0">
        
        {/* SELECCIONAR CLIENTE */}
        <div className="flex-none bg-white dark:bg-[#1e2736] p-5 rounded-xl border border-[#ededed] dark:border-[#333] shadow-sm z-20">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">Cliente</h3>
                <span className="text-xs text-blue-500 font-medium">{cliente ? `Saldo: ${formatMoney(cliente.saldo)}` : 'Consumidor Final'}</span>
            </div>
            <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-lg">person_search</span>
                <input 
                    className="w-full pl-9 pr-12 py-2.5 bg-[#f9f9f9] dark:bg-[#151a25] border border-[#ededed] dark:border-[#333] rounded-lg text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all" 
                    placeholder="Buscar Cliente..." 
                    type="text"
                    value={queryCliente}
                    onChange={(e) => setQueryCliente(e.target.value)}
                    onFocus={() => setShowClienteResults(true)}
                />
                {cliente && (
                    <button onClick={() => { setCliente(null); setQueryCliente(""); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-red-500">
                        <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                )}
                
                {showClienteResults && listaClientes.length > 0 && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-[#1e2736] border border-[#ededed] dark:border-[#333] rounded-lg shadow-xl max-h-48 overflow-y-auto z-50">
                        {listaClientes.map(c => (
                            <div key={c.id} onClick={() => seleccionarCliente(c)} className="p-3 hover:bg-[#f9f9f9] dark:hover:bg-[#151a25] cursor-pointer text-sm border-b border-[#ededed] dark:border-[#333] last:border-0">
                                <p className="font-bold text-gray-800 dark:text-white">{c.nombre}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* LISTA ITEMS CARRITO */}
        <div className="flex-1 min-h-0 bg-white dark:bg-[#1e2736] rounded-xl border border-[#ededed] dark:border-[#333] shadow-sm flex flex-col overflow-hidden">
            <div className="flex-none p-4 border-b border-[#ededed] dark:border-[#333] flex justify-between items-center bg-[#f9f9f9] dark:bg-[#151a25]">
                <h3 className="font-bold text-sm text-gray-800 dark:text-neutral-200">Carrito de Compra</h3>
                <span className="text-xs bg-white dark:bg-[#1e2736] text-neutral-600 dark:text-neutral-300 px-2 py-1 rounded border border-[#ededed] dark:border-[#333] font-medium">
                    {carrito.length} ítems
                </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {carrito.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-neutral-400 opacity-50">
                        <span className="material-symbols-outlined text-5xl mb-3">shopping_cart</span>
                        <p className="text-sm font-medium">El carrito está vacío</p>
                    </div>
                ) : (
                    carrito.map((item) => (
                        <div key={item.id} className="group relative bg-[#f9f9f9] dark:bg-[#151a25] p-3 rounded-xl border border-transparent hover:border-[#ededed] dark:hover:border-[#333] transition-all">
                            <div className="flex justify-between items-start">
                                <div className="flex-grow pr-2 pl-5">
                                    <p className="text-base font-bold text-gray-900 dark:text-white line-clamp-1">{item.nombre}</p>
                                    <p className="text-xs text-neutral-500 mt-1">{formatMoney(item.precio)} unidad</p>
                                </div>
                                <div className="text-right flex flex-col items-end gap-2">
                                    <p className="text-base font-bold text-gray-900 dark:text-white">{formatMoney(item.precio * item.cantidad)}</p>
                                    
                                    {/* Controles de cantidad */}
                                    <div className="flex items-center gap-1 bg-white dark:bg-[#1e2736] rounded-lg border border-[#ededed] dark:border-[#333] p-0.5 shadow-sm">
                                        <button 
                                            onClick={() => modificarCantidad(item.id, -1)} 
                                            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#f9f9f9] dark:hover:bg-[#151a25] text-neutral-600 dark:text-neutral-300 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-lg">remove</span>
                                        </button>
                                        
                                        <span className="text-lg font-bold w-8 text-center text-gray-900 dark:text-white leading-none">
                                            {item.cantidad}
                                        </span>
                                        
                                        <button 
                                            onClick={() => modificarCantidad(item.id, 1)} 
                                            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#f9f9f9] dark:hover:bg-[#151a25] text-neutral-600 dark:text-neutral-300 transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-lg">add</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => eliminarDelCarrito(item.id)} className="absolute -left-2 -top-2 bg-white dark:bg-[#1e2736] text-red-500 border border-[#ededed] dark:border-[#333] shadow-sm opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-full flex items-center justify-center hover:bg-red-50">
                                <span className="material-symbols-outlined text-sm">delete</span>
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>

        {/* TOTALES Y BOTON */}
        <div className="flex-none bg-white dark:bg-[#1e2736] p-5 rounded-xl border border-[#ededed] dark:border-[#333] shadow-sm z-30">
            <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm text-neutral-500 dark:text-neutral-400">
                    <span>Subtotal</span>
                    <span>{formatMoney(subtotal)}</span>
                </div>
                {descuento > 0 && (
                    <div className="flex justify-between text-sm text-green-600 font-medium">
                        <span>Descuentos</span>
                        <span>-{formatMoney(descuento)}</span>
                    </div>
                )}
            </div>
            <div className="border-t border-dashed border-[#ededed] dark:border-[#333] pt-4 mb-5">
                <div className="flex justify-between items-end">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                    <span className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{formatMoney(total)}</span>
                </div>
            </div>
            
            <button 
                onClick={handleFinalizar}
                disabled={procesando || carrito.length === 0}
                className={`w-full text-white py-4 rounded-xl text-lg font-bold shadow-lg flex justify-center items-center gap-2 transition-all transform active:scale-[0.99]
                    ${procesando || carrito.length === 0 
                        ? 'bg-neutral-300 dark:bg-neutral-700 cursor-not-allowed text-neutral-500 dark:text-neutral-500' 
                        : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/30'}`} 
            >
                {procesando ? (
                    <span className="material-symbols-outlined animate-spin text-2xl">progress_activity</span>
                ) : (
                    <>
                        <span className="material-symbols-outlined text-2xl">check</span>
                        CONFIRMAR VENTA
                    </>
                )}
            </button>
        </div>

      </div>
    </div>
  );
}