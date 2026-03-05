import Link from "next/link";

export default function EncabezadoProveedores() {
  return (
    <>
      {/* Breadcrumbs */}
      <div className="flex flex-wrap gap-2 items-center text-sm shrink-0">
        <Link href="/" className="text-neutral-500 hover:text-primary dark:hover:text-white font-medium transition-colors">
          Panel
        </Link>
        <span className="material-symbols-outlined text-neutral-400 text-base">chevron_right</span>
        <span className="text-primary dark:text-white font-bold">Proveedores</span>
      </div>

      {/* Título y Botón */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-primary dark:text-white tracking-tight text-[32px] font-bold leading-tight">
            Proveedores
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm font-normal">
            Gestione la lista de sus proveedores y sus códigos.
          </p>
        </div>
        <Link 
          className="group flex items-center gap-2 cursor-pointer justify-center rounded-lg h-10 px-5 bg-neutral-800 text-white shadow-sm transition-all hover:bg-black" 
          href="/proveedores/nuevo"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span className="text-sm font-bold truncate">Agregar Proveedor</span>
        </Link>
      </div>
    </>
  );
}