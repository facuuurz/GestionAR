import { notFound } from "next/navigation";
import Link from "next/link";
import { obtenerProductoPorId } from "@/actions/productos";

// 1. params es Promesa en Next.js 15
interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const idProducto = Number(id);

  if (isNaN(idProducto)) {
    notFound();
  }

  const producto = await obtenerProductoPorId(idProducto);

  if (!producto) {
    notFound(); 
  }

  // --- LÓGICA VISUAL ---
  const precioFormateado = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(Number(producto.precio));

  // Calculamos porcentaje para la barra (máximo 100%)
  const porcentajeStock = Math.min((producto.stock / 200) * 100, 100); 

  // --- NUEVA LÓGICA DE SEMÁFORO (ROJO / AMARILLO / VERDE) ---
  let stockColorClass = "";
  let barColorClass = "";
  let textoEstado = "";

  if (producto.stock === 0) {
    // CASO 0: ROJO
    stockColorClass = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
    barColorClass = "bg-red-500 dark:bg-red-600";
    textoEstado = "Sin Stock";
  } else if (producto.stock <= 20) {
    // CASO 1-10: AMARILLO
    stockColorClass = "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    barColorClass = "bg-yellow-500 dark:bg-yellow-600";
    textoEstado = "Stock Bajo";
  } else {
    // CASO > 10: VERDE
    stockColorClass = "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    barColorClass = "bg-green-500 dark:bg-green-600";
    textoEstado = "En Stock";
  }

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-background-light dark:bg-background-dark min-h-screen">
      
      {/* NAVEGACIÓN */}
      <nav className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-6 font-display">
        <Link className="text-neutral-500 hover:text-primary dark:hover:text-white font-medium transition-colors hover:text-blue-600 " href="/">Panel</Link>
        <span className="material-symbols-outlined text-neutral-400 text-base">chevron_right</span>
        <Link className="text-neutral-500 hover:text-primary dark:hover:text-white font-medium transition-colors hover:text-blue-600 " href="/inventario">Inventario</Link>
        <span className="material-symbols-outlined text-neutral-400 text-base">chevron_right</span>
        <span className="text-black font-bold">{producto.nombre}</span>
      </nav>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
  <div className="space-y-1">
    <div className="flex items-center gap-3">
      <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
        {producto.nombre}
      </h2>
      {/* AGREGADO: 'mt-1' para compensar visualmente la altura */}
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold mt-1 ${stockColorClass}`}>
        {textoEstado}
      </span>
    </div>
    <p className="text-slate-500 dark:text-slate-400 text-base max-w-2xl">
      Detalle completo del producto y gestión de stock actual.
    </p>
  </div>
        
        {/* --- NUEVO BOTÓN CON ESTILO PERSONALIZADO --- */}
        <Link 
            href={`/inventario/editar/${producto.id}`} 
            className="group flex items-center gap-2 cursor-pointer justify-center overflow-hidden rounded-lg h-10 px-5 bg-neutral-800 text-white shadow-sm transition-all duration-300 hover:bg-black hover:shadow-lg hover:shadow-neutral-500/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm"
        >
          {/* Quitamos 'group-hover:rotate-90' para que no gire, solo escala */}
          <span className="material-symbols-outlined text-[20px] transition-transform duration-300 group-hover:scale-110">
            edit
          </span>
          <span className="text-sm font-bold truncate">Actualizar Producto</span>
        </Link>

      </div>

      {/* GRILLA DE INFORMACIÓN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* COLUMNA IZQUIERDA (Info General) */}
        <div className="lg:col-span-2 bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
              <span className="material-symbols-outlined text-black dark:text-white">inventory_2</span>
              Información General
            </h3>
            <span className="material-symbols-outlined text-slate-400 cursor-help" title="Detalles generales">info</span>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-8">
            {/* Código de Barra */}
            <div className="flex gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
              <div className="shrink-0 size-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm">
                <span className="material-symbols-outlined">qr_code_2</span>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-display">Código de Barra</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5 tracking-tight font-display">
                  {producto.codigoBarra || "N/A"}
                </p>
              </div>
            </div>

            {/* Tipo */}
            <div className="flex gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
              <div className="shrink-0 size-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-sm">
                <span className="material-symbols-outlined">category</span>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-display">Tipo de Producto</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5 font-display">
                  {producto.tipo || "General"}
                </p>
              </div>
            </div>

            {/* Proveedor */}
            <div className="flex gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
              <div className="shrink-0 size-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-sm">
                <span className="material-symbols-outlined">local_shipping</span>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-display">Código de Proveedor</p>
                <p className="text-lg font-bold text-slate-900 dark:text-white mt-0.5 font-display">
                  {producto.proveedor || "PROV-???"}
                </p>
              </div>
            </div>

            {/* Descripción */}
            <div className="flex gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50">
                <div className="shrink-0 size-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm">
                    <span className="material-symbols-outlined">description</span>
                </div>
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-display">Descripción del producto</p>
                    <p className="text-base font-medium text-slate-900 dark:text-white mt-0.5 leading-tight font-display">
                        {producto.descripcion || "Sin descripción disponible para este producto."}
                    </p>
                </div>
            </div>

          </div>
        </div>

        {/* COLUMNA DERECHA (Precio y Stock) */}
        <div className="flex flex-col gap-6">
          
          {/* TARJETA PRECIO */}
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <span className="material-symbols-outlined text-[120px] leading-none text-slate-900 dark:text-white">attach_money</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide font-display">Precio Unitario</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">{precioFormateado}</span>
                <span className="text-sm text-slate-500 font-bold">ARS</span>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
              <p className="text-xs text-slate-400 flex items-center gap-1 font-display">
                <span className="material-symbols-outlined text-[14px]">update</span>
                {/* RESPUESTA A TU DUDA: Usamos updatedAt */}
                Última act.: {new Date(producto.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* TARJETA STOCK */}
          <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <span className="material-symbols-outlined text-[120px] leading-none text-slate-900 dark:text-white">inventory</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide font-display">Stock Actual</p>
  
              {/* CAMBIO AQUÍ: Cambié 'items-baseline' por 'items-center' */}
              <div className="flex items-center gap-2">
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">{producto.stock}</span>
    
                {/* Badge con Color dinámico */}
                <span className={`text-sm font-bold px-2 py-1 rounded-md font-display ${stockColorClass}`}>
                    {textoEstado}
                </span>
              </div>
              </div>
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mb-2">
                <div 
                    // Barra con Color dinámico
                    className={`${barColorClass} h-2 rounded-full transition-all duration-500`} 
                    style={{ width: `${porcentajeStock}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-400 font-display">Nivel de reorden: 20 Unidades</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}