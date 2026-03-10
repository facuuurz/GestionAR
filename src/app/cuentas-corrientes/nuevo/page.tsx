import Link from "next/link";
import { crearCliente } from "@/actions/cuentas-corrientes";
import FormularioCliente from "@/components/Cuentas-corrientes/FormularioCliente";

export default function NuevoClientePage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f3f4f6] dark:bg-[#111827] text-slate-800 dark:text-slate-100 font-sans">
      
      {/* CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col items-center py-10 px-4">
        <div className="w-full max-w-4xl">
          
          {/* Breadcrumbs */}
          <nav className="text-sm text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-2">
            <Link href="/" className="text-neutral-500 hover:text-primary dark:hover:text-white font-medium transition-colors hover:text-blue-600">Panel</Link>
            <span className="material-symbols-outlined text-neutral-400 text-base">chevron_right</span>
            <Link href="/cuentas-corrientes" className="text-neutral-500 hover:text-primary dark:hover:text-white font-medium transition-colors hover:text-blue-600">Cuentas Corrientes</Link>
            <span className="material-symbols-outlined text-neutral-400 text-base">chevron_right</span>
            <p className="text-black dark:text-white font-bold">Agregar Cuenta</p>
          </nav>

          {/* Título */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Agregar Nueva Cuenta</h1>
            <p className="text-slate-500 dark:text-slate-400">Ingrese los detalles del nuevo cliente para abrir una cuenta corriente.</p>
          </div>

          {/* FORMULARIO IMPORTADO */}
          <FormularioCliente actionFunc={crearCliente} />

        </div>
      </div>
    </div>
  );
}