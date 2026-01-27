import { obtenerPromocionPorId } from "@/actions/promociones";
import Link from "next/link";
import { notFound } from "next/navigation";
// Se eliminó la importación de EliminarPromocion

// Helper para formatear moneda
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Helper para formatear fecha
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
};

export default async function DetallePromocionPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = parseInt(params.id);
  const promocion = await obtenerPromocionPorId(id);

  if (!promocion) {
    notFound();
  }

  // Lógica de estado (Activa/Vencida)
  const hoy = new Date();
  const fechaFin = new Date(promocion.fechaFin);
  const fechaInicio = new Date(promocion.fechaInicio);
  
  const esVencida = hoy > fechaFin;
  const esProgramada = hoy < fechaInicio;
  
  let estadoLabel = "Activa";
  // Colores adaptados para Light y Dark mode
  let estadoColor = "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
  let estadoIcon = "check";

  if (esVencida) {
    estadoLabel = "Vencida";
    estadoColor = "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
    estadoIcon = "event_busy";
  } else if (esProgramada) {
    estadoLabel = "Programada";
    estadoColor = "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
    estadoIcon = "schedule";
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F3F4F6] dark:bg-[#0B1120] text-slate-900 dark:text-slate-200 font-sans transition-colors duration-200">
      
      <main className="flex-1 flex flex-col items-center py-8 px-5 md:px-10 lg:px-20 w-full">
        <div className="w-full max-w-300 flex flex-col">
          
          {/* Breadcrumbs */}
          <div className="flex flex-wrap items-center gap-2 mb-6 text-sm text-slate-500 dark:text-slate-400">
            <Link href="/" className="text-neutral-500 hover:text-blue-600 dark:hover:text-white font-medium transition-colors">
                Panel
            </Link>
                                    
            <span className="material-symbols-outlined text-neutral-400 text-base mx-2">chevron_right</span>
                                    
            <Link href="/promociones" className="text-neutral-500 hover:text-blue-600 dark:hover:text-white font-medium transition-colors">
                Promociones
            </Link>
                                    
            <span className="material-symbols-outlined text-neutral-400 text-base mx-2">chevron_right</span>
                      
            <span className="text-slate-900 dark:text-white font-bold">{promocion.nombre}</span>
          </div>

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
            <div className="flex flex-col gap-1">
              <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-bold tracking-tight">{promocion.nombre}</h1>
              <p className="text-slate-500 dark:text-slate-400 text-base font-normal">Detalles de la campaña promocional y estado actual del inventario.</p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Botón Eliminar ELIMINADO */}
              
              {/* Botón Editar ACTUALIZADO */}
              <Link 
                href={`/promociones/editar/${promocion.id}`}
                className="group flex items-center gap-2 cursor-pointer justify-center overflow-hidden rounded-lg h-10 px-5 bg-neutral-800 text-white shadow-sm transition-all duration-300 hover:bg-black hover:shadow-lg hover:shadow-neutral-500/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px] transition-transform duration-300 group-hover:scale-110">
                  edit
                </span>
                <span className="text-sm font-bold truncate">Editar Promoción</span>
              </Link>
            </div>
          </div>

          {/* Contenido Principal */}
          <div className="bg-white dark:bg-[#1E293B] rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            
            {/* Cabecera Tarjeta */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-700/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-slate-900 dark:text-white">sell</span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Información de la Promoción</h3>
              </div>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${estadoColor}`}>
                <span className="material-symbols-outlined text-[16px] font-bold">{estadoIcon}</span>
                <span className="text-xs font-bold uppercase tracking-wide">{estadoLabel}</span>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Columna Izquierda (Descripción y Productos) */}
              <div className="lg:col-span-2 flex flex-col gap-8">
                
                {/* Descripción */}
                <div className="flex flex-col gap-2">
                  <label className="block text-sm font-medium text-slate-900 dark:text-slate-200">Descripción</label>
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    {promocion.descripcion}
                  </div>
                </div>

                {/* Lista de Productos */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-slate-900 dark:text-slate-200">Productos Incluidos</label>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                        {promocion.productos.length} Artículos
                    </span>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    {promocion.productos.length === 0 ? (
                         <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded border border-dashed border-slate-300 dark:border-slate-600 text-center text-sm text-slate-400">
                            No hay productos asociados a esta promoción.
                         </div>
                    ) : (
                        promocion.productos.map((item: any, index: number) => (
                            <div key={item.producto.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
                                <div className="flex items-center gap-3">
                                <div className="size-10 flex items-center justify-center rounded bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 font-bold text-sm">
                                    {index + 1}
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white">{item.producto.nombre}</span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400 uppercase">SKU: {item.producto.codigoBarra || "N/A"}</span>
                                </div>
                                </div>
                                <div className="flex items-center gap-4">
                                <span className="text-xs text-slate-500 dark:text-slate-400 uppercase hidden sm:block">Unidades</span>
                                <div className="bg-slate-50 dark:bg-slate-700 px-3 py-1 rounded border border-slate-200 dark:border-slate-600 text-sm font-medium text-slate-900 dark:text-white">
                                    {item.cantidad}
                                </div>
                                </div>
                            </div>
                        ))
                    )}
                  </div>
                </div>
              </div>

              {/* Columna Derecha (Precio, Fechas y Métricas) */}
              <div className="lg:col-span-1 flex flex-col gap-6">
                
                {/* Precio */}
                <div className="flex flex-col gap-2">
                  <label className="block text-sm font-medium text-slate-900 dark:text-slate-200">Precio Promocional</label>
                  <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-900/30">
                    <div className="size-10 rounded bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0 text-green-600 dark:text-green-400">
                      <span className="material-symbols-outlined">attach_money</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                        {formatCurrency(promocion.precio)}
                      </span>
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">trending_down</span>
                        Oferta Especial
                      </span>
                    </div>
                  </div>
                </div>

                {/* Fechas */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-slate-900 dark:text-slate-200">Fecha de Inicio</label>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="size-10 rounded bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center shrink-0 text-teal-600 dark:text-teal-400">
                        <span className="material-symbols-outlined">calendar_today</span>
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {formatDate(fechaInicio)}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-slate-900 dark:text-slate-200">Fecha de Fin</label>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      <div className="size-10 rounded bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center shrink-0 text-pink-500 dark:text-pink-400">
                        <span className="material-symbols-outlined">event_busy</span>
                      </div>
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {formatDate(fechaFin)}
                      </span>
                    </div>
                  </div>
                </div>
              

              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}