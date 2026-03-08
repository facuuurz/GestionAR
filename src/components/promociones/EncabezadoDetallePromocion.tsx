import Link from "next/link";

interface Props {
  id: number;
  nombre: string;
}

export default function EncabezadoDetallePromocion({ id, nombre }: Props) {
  return (
    <>
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
        <span className="text-slate-900 dark:text-white font-bold">{nombre}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-bold tracking-tight">{nombre}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base font-normal">Detalles de la campaña promocional y estado actual del inventario.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Botón Editar */}
          <Link 
            href={`/promociones/editar/${id}`}
            className="group flex items-center gap-2 cursor-pointer justify-center overflow-hidden rounded-lg h-10 px-5 bg-neutral-800 text-white shadow-sm transition-all duration-300 hover:bg-black hover:shadow-lg hover:shadow-neutral-500/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px] transition-transform duration-300 group-hover:scale-110">
              edit
            </span>
            <span className="text-sm font-bold truncate">Editar Promoción</span>
          </Link>
        </div>
      </div>
    </>
  );
}