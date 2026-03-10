import Link from "next/link";

interface Props {
  clienteId: number;
  nombreCliente: string;
}

export default function EncabezadoDetalleCuenta({ clienteId, nombreCliente }: Props) {
  return (
    <>
      {/* BREADCRUMBS */}
      <nav className="text-sm text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-2">
        <Link href="/" className="text-neutral-500 hover:text-primary dark:hover:text-white font-medium transition-colors hover:text-blue-600">
            Panel
        </Link>
        <span className="material-symbols-outlined text-neutral-400 text-base">chevron_right</span>
        <Link href="/cuentas-corrientes" className="text-neutral-500 hover:text-primary dark:hover:text-white font-medium transition-colors hover:text-blue-600">
            Cuentas Corrientes
        </Link>
        <span className="material-symbols-outlined text-neutral-400 text-base">chevron_right</span>
        <p className="text-black dark:text-white font-bold">{nombreCliente}</p>
      </nav>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#111318] dark:text-white tracking-tight">
              {nombreCliente}
          </h1>
          <p className="text-[#616f89] dark:text-gray-400">Detalle de Cuenta Corriente</p>
        </div>
        
        <Link 
          href={`/cuentas-corrientes/editar/${clienteId}`}
          className="group flex items-center gap-2 cursor-pointer justify-center overflow-hidden rounded-lg h-10 px-5 bg-neutral-800 text-white shadow-sm transition-all duration-300 hover:bg-black hover:shadow-lg hover:shadow-neutral-500/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px] transition-transform duration-300 group-hover:scale-110">
              edit
          </span>
          <span className="text-sm font-bold truncate">Actualizar Cliente</span>
        </Link>
      </div>
    </>
  );
}