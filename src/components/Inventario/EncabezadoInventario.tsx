import Link from "next/link";

export default function EncabezadoInventario({ isAdmin = true }: { isAdmin?: boolean }) {
  return (
    <>
      {/* Breadcrumbs */}
      <div className="flex flex-wrap gap-2 items-center text-sm shrink-0">
        <Link href="/" className="text-neutral-500 hover:text-primary dark:hover:text-white font-medium transition-colors hover:text-blue-600">
          Panel
        </Link>
        <span className="material-symbols-outlined text-neutral-400 text-base">chevron_right</span>
        <span className="text-primary dark:text-white font-bold">Inventario</span>
      </div>

      {/* Título y Botón */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-primary dark:text-white tracking-tight text-[32px] font-bold leading-tight">
            Lista de Productos
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm font-normal">
            Gestiona el inventario, precios y stock de tus productos.
          </p>
        </div>
        {isAdmin && (
          <Link 
            className="group flex items-center gap-2 cursor-pointer justify-center overflow-hidden rounded-lg h-10 px-5 bg-neutral-800 text-white shadow-sm transition-all duration-300 hover:bg-black hover:shadow-lg hover:shadow-neutral-500/30 hover:-translate-y-0.5" 
            href="./inventario/nuevo-producto"
          >
            <span className="material-symbols-outlined text-[20px] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-90">add</span>
            <span className="text-sm font-bold truncate">Agregar Nuevo Producto</span>
          </Link>
        )}
      </div>
    </>
  );
}