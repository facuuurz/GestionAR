"use client";

import { useState, useEffect } from "react";
import { buscarProductosVenta, buscarClienteVenta, procesarVenta, obtenerCategorias } from "@/actions/ventas";
import { obtenerPromociones } from "@/actions/promociones";
import ModalPromociones from "@/components/ventas/ModalPromociones";
import { useDebounce } from "@/hooks/useDebounce";
import FilterModal, { FilterState } from "@/components/ventas/FilterModal";

// --- TIPOS ---
type Producto = {
  id: number;
  nombre: string;
  codigoBarra: string | null;
  stock: number;
  precio: number;
  categoria?: string; 
  fechaVencimiento?: Date | string | null;
  esPorPeso: boolean;
};

// ⚠️ MODIFICADO: ItemCarrito ahora soporta Productos y Promos
type ItemCarrito = {
  id: number;         // ID positivo = Producto, ID negativo = Promoción
  nombre: string;
  precio: number;
  cantidad: number;
  tipo: "PRODUCTO" | "PROMOCION"; 
  
  // Para validar stock
  stockMaximo: number;
  esPorPeso?: boolean; 

  // Solo si es promo, guardamos qué tiene adentro para descontar luego
  contenido?: { productoId: number; cantidad: number }[];
};

type Cliente = {
  id: number;
  nombre: string;
  saldo: number;
};

type PromocionBackend = {
    id: number;
    nombre: string;
    descripcion: string | null;
    precio: number; // Asegúrate de que tu backend mande esto
    items: {
        cantidad: number;
        producto: Producto;
    }[];
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
  const [mostrarExito, setMostrarExito] = useState(false);

  // Estados para Promociones
  const [listaPromociones, setListaPromociones] = useState<PromocionBackend[]>([]);
  const [showModalPromos, setShowModalPromos] = useState(false);

  const [productoAPesar, setProductoAPesar] = useState<Producto | null>(null);
  const [pesoInput, setPesoInput] = useState<string>("");
  const [pesoInputRef, setPesoInputRef] = useState<HTMLInputElement | null>(null);

  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
      category: "Todas",
      stockStatus: "all",
      priceRange: { min: "", max: "" }
  });

  const [categoriasDisponibles, setCategoriasDisponibles] = useState<string[]>([]);

  // --- EFECTOS ---
  useEffect(() => {
    if (productoAPesar && pesoInputRef) {
        pesoInputRef.focus();
    }
  }, [productoAPesar, pesoInputRef]);
  
  useEffect(() => {
    obtenerCategorias().then((cats) => {
        setCategoriasDisponibles(cats);
    });
  }, []);

  useEffect(() => {
    // Llamamos a la acción pasando el texto Y los filtros
    buscarProductosVenta(debouncedProd, activeFilters).then(setListaProductos);
  }, [debouncedProd, activeFilters]);
  
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

  useEffect(() => {
    obtenerPromociones("", false).then((data) => {
        setListaPromociones(data as unknown as PromocionBackend[]);
    });
  }, []);

  // --- LÓGICA CARRITO (PRODUCTOS) ---

  const agregarProductoAlCarrito = (prod: Producto) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === prod.id && item.tipo === "PRODUCTO");
      
      if (existe) {
        if (existe.cantidad + 1 > prod.stock) {
             alert(`Stock insuficiente para ${prod.nombre}`);
             return prev; 
        }
        return prev.map((item) => 
            item.id === prod.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      }
      
      if (1 > prod.stock) {
          alert(`Sin stock de ${prod.nombre}`);
          return prev;
      }

      // Agregamos como ItemCarrito normal
      return [...prev, { 
          id: prod.id,
          nombre: prod.nombre,
          precio: prod.precio,
          cantidad: 1,
          tipo: "PRODUCTO",
          stockMaximo: prod.stock,
          esPorPeso: prod.esPorPeso
      }];
    });
  };

  const iniciarAgregadoProducto = (prod: Producto) => {
    if (prod.esPorPeso) {
        setPesoInput(""); // Limpiar input anterior
        setProductoAPesar(prod); // Esto abre el modal (cuando lo agreguemos al JSX)
    } else {
        agregarProductoAlCarrito(prod); // Flujo normal para unidades
    }
  };

  // B. Confirmar el peso ingresado en el modal
  const confirmarPeso = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!productoAPesar) return;

    const gramos = parseInt(pesoInput);
    
    if (isNaN(gramos) || gramos <= 0) {
        alert("Ingrese un peso válido");
        return;
    }

    // Agregamos al carrito manual (modificando el estado directamente para poner los gramos)
    setCarrito((prev) => {
        const existe = prev.find((item) => item.id === productoAPesar.id && item.tipo === "PRODUCTO");
        
        // Si ya existe, sumamos los gramos
        if (existe) {
            if (existe.cantidad + gramos > productoAPesar.stock) {
                 alert(`Stock insuficiente. Máximo disponible: ${productoAPesar.stock} gr`);
                 return prev; 
            }
            return prev.map((item) => 
                item.id === productoAPesar.id ? { ...item, cantidad: item.cantidad + gramos } : item
            );
        }
        
        // Si no existe, lo creamos
        if (gramos > productoAPesar.stock) {
            alert(`Stock insuficiente. Disponible: ${productoAPesar.stock} gr`);
            return prev;
        }

        return [...prev, { 
            id: productoAPesar.id,
            nombre: productoAPesar.nombre,
            precio: productoAPesar.precio,
            cantidad: gramos, // Guardamos GRAMOS aquí
            tipo: "PRODUCTO",
            stockMaximo: productoAPesar.stock,
            esPorPeso: true // Importante para renderizar correctamente
        }];
    });

    setProductoAPesar(null); // Cerrar modal
  };

  // 🆕 LÓGICA CARRITO (PROMOCIONES) ---
  const aplicarPromocion = (promo: PromocionBackend) => {
      // 1. Calcular Stock Máximo de la promo
      // (El stock de la promo es igual al del ingrediente que menos tenga)
      let stockPosible = 999999;
      
      promo.items.forEach(item => {
          const cuantosPuedoHacer = Math.floor(item.producto.stock / item.cantidad);
          if (cuantosPuedoHacer < stockPosible) {
              stockPosible = cuantosPuedoHacer;
          }
      });

      if (stockPosible < 1) {
          alert("No hay stock suficiente de los productos para armar esta promoción.");
          return;
      }

      // 2. Crear el objeto para el carrito
      // Usamos ID negativo para diferenciarlo de productos
      const promoId = -promo.id; 

      setCarrito((prev) => {
          const existe = prev.find(i => i.id === promoId && i.tipo === "PROMOCION");

          if (existe) {
              if (existe.cantidad + 1 > stockPosible) {
                  alert("No alcanzan los productos para agregar más promociones de este tipo.");
                  return prev;
              }
              return prev.map(i => i.id === promoId ? { ...i, cantidad: i.cantidad + 1 } : i);
          }

          return [...prev, {
              id: promoId,
              nombre: `PROMO: ${promo.nombre}`,
              precio: promo.precio, // ✅ Usamos el PRECIO DE LA PROMO
              cantidad: 1,
              tipo: "PROMOCION",
              stockMaximo: stockPosible,
              contenido: promo.items.map(pi => ({
                  productoId: pi.producto.id,
                  cantidad: pi.cantidad
              }))
          }];
      });

      setShowModalPromos(false);
  };

  const modificarCantidad = (id: number, delta: number) => {
    setCarrito((prev) => 
      prev.map((item) => {
        if (item.id === id) {
          const paso = item.esPorPeso ? 50 : 1; 
          const nuevaCant = item.cantidad + (delta * paso);
          
          if (nuevaCant < (item.esPorPeso ? 5 : 1)) return item; 
          
          if (nuevaCant > item.stockMaximo) {
              return item; 
          }
          
          return { ...item, cantidad: nuevaCant };
        }
        return item;
      })
    );
  };

  const subtotal = carrito.reduce((acc, item) => {
      if (item.esPorPeso) {
          // Regla de tres simple: (PrecioPorKilo * Gramos) / 1000
          return acc + ((item.precio * item.cantidad) / 1000);
      } else {
          return acc + (item.precio * item.cantidad);
      }
  }, 0);
  
  const total = subtotal;

  const eliminarDelCarrito = (id: number) => {
      setCarrito(prev => prev.filter(item => item.id !== id));
  }

  const seleccionarCliente = (c: Cliente) => {
      setCliente(c);
      setQueryCliente(c.nombre);
      setShowClienteResults(false);
  }

  const handleFinalizar = async () => {
    if (carrito.length === 0) return;
    setProcesando(true);
    
    // ⚠️ PASO CRUCIAL: "DESEMPAQUETAR" EL CARRITO
    // El servidor espera una lista de Productos para descontar stock.
    // Debemos convertir las promos en sus componentes sumados.
    
    const mapaProductos = new Map<number, number>();

    carrito.forEach(item => {
        if (item.tipo === "PRODUCTO") {
            const actual = mapaProductos.get(item.id) || 0;
            mapaProductos.set(item.id, actual + item.cantidad);
        } 
        else if (item.tipo === "PROMOCION" && item.contenido) {
            // Si es promo, multiplicamos sus ingredientes por la cantidad de promos
            item.contenido.forEach(componente => {
                const idProd = componente.productoId;
                const cantTotal = componente.cantidad * item.cantidad;
                const actual = mapaProductos.get(idProd) || 0;
                mapaProductos.set(idProd, actual + cantTotal);
            });
        }
    });

    // Convertimos el mapa al formato que espera la acción
    const itemsParaDescontar = Array.from(mapaProductos.entries()).map(([id, cantidad]) => ({
        id,
        cantidad
    }));

    // Enviamos el TOTAL calculado en el frontend (que respeta el precio promo)
    // y los ITEMS calculados (que respetan el stock real)
    const resultado = await procesarVenta(
        itemsParaDescontar, 
        total, 
        cliente?.id
    );

    if (resultado.success) {
        setCarrito([]);
        setCliente(null);
        setQueryCliente("");
        setMostrarExito(true);
        setTimeout(() => setMostrarExito(false), 3000); 
    } else {
        alert("Error: " + resultado.message);
    }
    setProcesando(false);
  };

  const formatMoney = (n: number) => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(n);

  return (
    <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6 h-full bg-[#f6f6f8] dark:bg-[#101622] p-4 relative">
      
      <FilterModal 
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        currentFilters={activeFilters}
        onApply={setActiveFilters}
        categoriasDisponibles={categoriasDisponibles} 
      />

      <ModalPromociones 
        isOpen={showModalPromos}
        onClose={() => setShowModalPromos(false)}
        promociones={listaPromociones}
        onSelect={aplicarPromocion}
      />

      {/* --- COLUMNA IZQUIERDA: PRODUCTOS --- */}
      <div className="lg:col-span-6 flex flex-col gap-4 h-full min-h-0">
        
        {/* BUSCADOR */}
        <div className="flex-none bg-white dark:bg-[#1e2736] p-4 rounded-xl border border-[#ededed] dark:border-[#333] shadow-sm">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative grow">
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
                {/* BOTÓN FILTRAR */}
{/* BOTÓN FILTRAR */}
<button 
    onClick={() => setShowFilters(true)}
    // Eliminamos la lógica de colores condicionales para mantener el estilo base siempre
    className="group flex items-center gap-2 h-10 px-4 rounded-lg border border-[#ededed] dark:border-[#333] bg-white dark:bg-[#151a25] text-neutral-700 dark:text-neutral-200 text-sm font-medium cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm hover:shadow-md hover:bg-[#222] hover:text-white dark:hover:bg-white dark:hover:text-black"
>
    <span className="material-symbols-outlined text-[18px] transition-transform duration-500 ease-in-out group-hover:rotate-12">
        filter_list
    </span>
    <span className="hidden sm:inline">Filtrar</span>
    
    {/* El único indicador visual de filtros activos: el punto azul */}
    {(activeFilters.category !== "Todas" || activeFilters.stockStatus !== "all" || activeFilters.priceRange.min !== "") && (
        <span className="flex h-2 w-2 rounded-full bg-blue-600 ml-1 animate-in fade-in zoom-in duration-300"></span>
    )}
</button>
                <button 
    onClick={() => setShowModalPromos(true)}
    className="group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-sm hover:shadow-md text-white bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-400 dark:hover:bg-emerald-500 whitespace-nowrap"
>
    <span className="material-symbols-outlined text-[20px] transition-transform duration-500 ease-in-out group-hover:rotate-12">
        local_offer
    </span> 
    <span className="hidden sm:inline">Promociones</span>
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
                    <tr key={prod.id} className="hover:bg-[#f9f9f9] dark:hover:bg-[#151a25]/50 transition-colors group cursor-pointer" 
                        onClick={() => iniciarAgregadoProducto(prod)}>
                        <td className="px-6 py-4">
                            <div className="flex flex-col">
                                <span className="font-medium text-gray-900 dark:text-white text-base">{prod.nombre}</span>
                                <span className="text-xs text-neutral-500">{prod.codigoBarra || "S/C"}</span>
                                {(prod as any).fechaVencimiento && (
                                    <span className="text-[10px] font-bold text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300 px-1.5 py-0.5 rounded w-fit mt-1">
                                         Vence: {new Date((prod as any).fechaVencimiento).toLocaleDateString()}
                                    </span>
                                )}
                            </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold ${prod.stock < 10 ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'}`}>
                                {prod.stock} un.
                            </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{formatMoney(prod.precio)}</td>
                        <td className="px-6 py-4 text-right">
                            <button 
                              className="group flex items-center gap-1.5 ml-auto px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-sm hover:shadow-md text-white bg-neutral-800 hover:bg-black dark:bg-white dark:text-black"
                              onClick={(e) => { e.stopPropagation(); iniciarAgregadoProducto(prod); }}
                            >
                              <span className="material-symbols-outlined text-sm transition-transform duration-500 ease-in-out group-hover:rotate-90">add</span>
                              <span>Agregar</span>
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
      <div className="lg:col-span-6 flex flex-col gap-4 h-full min-h-0">
        
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
        <div className="h-auto max-h-[55vh] shrink-0 bg-white dark:bg-[#1e2736] rounded-xl border border-[#ededed] dark:border-[#333] shadow-sm flex flex-col overflow-hidden transition-all duration-300">
            <div className="flex-none p-4 border-b border-[#ededed] dark:border-[#333] flex justify-between items-center bg-[#f9f9f9] dark:bg-[#151a25]">
                <h3 className="font-bold text-sm text-gray-800 dark:text-neutral-200">Carrito de Compra</h3>
                <span className="text-xs bg-white dark:bg-[#1e2736] text-neutral-600 dark:text-neutral-300 px-2 py-1 rounded border border-[#ededed] dark:border-[#333] font-medium">
                    {carrito.length} ítems
                </span>
            </div>
            
            <div className="overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {carrito.length === 0 ? (
                    <div className="py-8 flex flex-col items-center justify-center text-neutral-400 opacity-50">
                        <span className="material-symbols-outlined text-5xl mb-3">shopping_cart</span>
                        <p className="text-sm font-medium">El carrito está vacío</p>
                    </div>
                ) : (
                    carrito.map((item) => (
                        <div key={item.id} className={`group relative p-3 rounded-xl border transition-all 
                            ${item.tipo === 'PROMOCION' ? 'bg-indigo-50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/30' : 'bg-[#f9f9f9] dark:bg-[#151a25] border-transparent hover:border-[#ededed] dark:hover:border-[#333]'}`}>

                            <div className="flex justify-between items-start">
                                <div className="grow pr-2 pl-5">
                                    <p className="text-base font-bold text-gray-900 dark:text-white line-clamp-1">{item.nombre}</p>
                                    <p className="text-xs text-neutral-500 mt-1">{formatMoney(item.precio)} {item.esPorPeso ? '/kg' : 'unidad'}</p>
                                </div>
                                <div className="text-right flex flex-col items-end gap-2">
                                    <p className="text-base font-bold text-gray-900 dark:text-white">
                                        {formatMoney(
                                            item.esPorPeso 
                                            ? (item.precio * item.cantidad) / 1000 
                                            : item.precio * item.cantidad
                                        )}
                                    </p>
                                    
                                    <div className="flex items-center gap-1 bg-white dark:bg-[#1e2736] rounded-lg border border-[#ededed] dark:border-[#333] p-0.5 shadow-sm">
                                        <button onClick={() => modificarCantidad(item.id, -1)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#f9f9f9] dark:hover:bg-[#151a25] text-neutral-600 dark:text-neutral-300 transition-colors">
                                            <span className="material-symbols-outlined text-lg">remove</span>
                                        </button>
                                        <span className="text-lg font-bold w-8 text-center text-gray-900 dark:text-white leading-none">{item.cantidad}</span>
                                        <button onClick={() => modificarCantidad(item.id, 1)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#f9f9f9] dark:hover:bg-[#151a25] text-neutral-600 dark:text-neutral-300 transition-colors">
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
            : 'bg-blue-600 hover:bg-blue-500 hover:cursor-pointer shadow-blue-500/30'}`} 
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

      <div className={`fixed bottom-6 left-6 z-50 transform transition-all duration-500 ease-in-out ${mostrarExito ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
  <div className="bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-green-500">
    
    {/* Contenedor del icono ajustado */}
    <div className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
      <span className="material-symbols-outlined text-xl">check</span>
    </div>

    <div>
      <p className="font-bold text-sm">¡Venta exitosa!</p>
      <p className="text-xs text-green-100">La operación se registró correctamente.</p>
    </div>
            
  </div>
</div>

      {productoAPesar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-[#1e2736] w-full max-w-sm rounded-2xl shadow-2xl p-6 border border-neutral-200 dark:border-[#333]">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Ingresar Peso</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{productoAPesar.nombre}</p>
                    </div>
                    <button onClick={() => setProductoAPesar(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <form onSubmit={confirmarPeso} className="flex flex-col gap-4">
                    <div className="relative">
                        <input 
                            ref={setPesoInputRef}
                            type="number" 
                            value={pesoInput}
                            onChange={(e) => setPesoInput(e.target.value)}
                            className="w-full text-center text-4xl font-bold py-4 rounded-xl bg-gray-50 dark:bg-[#151a25] border-2 border-indigo-100 dark:border-[#333] focus:border-indigo-500 outline-none text-gray-900 dark:text-white"
                            placeholder="0"
                            min="1"
                            autoFocus
                        />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">gr</span>
                    </div>
                    
                    <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                        Precio: {formatMoney(productoAPesar.precio)} / kg
                        <br/>
                        <span className="text-indigo-600 dark:text-indigo-400 font-bold text-lg mt-1 block">
                            = {formatMoney((productoAPesar.precio * (parseInt(pesoInput) || 0)) / 1000)}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-2">
                        <button 
                            type="button" 
                            onClick={() => setProductoAPesar(null)}
                            className="px-4 py-3 rounded-lg border border-gray-200 dark:border-[#444] text-gray-700 dark:text-white font-bold hover:bg-gray-50 dark:hover:bg-[#252a35]"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit"
                            className="px-4 py-3 rounded-lg bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/30"
                        >
                            Confirmar
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

    </div>
  );
}