import Link from "next/link";
import { crearProveedor } from "@/actions/proveedores";
import FormularioProveedor from "@/components/Proveedores/FormularioProveedor";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function NuevoProveedorPage() {
  const session = await getSession();
  if (session?.role === 'EMPLEADO') redirect('/');
  return (
    <div className="flex flex-col min-h-screen bg-[#f6f6f8] dark:bg-[#101622]">
      <main className="flex-1 flex flex-col items-center py-8 px-6 lg:px-12 xl:px-40 w-full">
        <div className="flex flex-col w-full max-w-4xl"> 
          
          {/* --- Breadcrumbs --- */}
          <div className="flex flex-wrap items-center gap-2 px-1 pb-4">
            <Link href="/" className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-blue-600 dark:hover:text-white transition-colors">
              Panel
            </Link>
            <span className="material-symbols-outlined text-gray-400 text-sm">chevron_right</span>
            <Link href="/proveedores" className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-blue-600 dark:hover:text-white transition-colors">
              Proveedores
            </Link>
            <span className="material-symbols-outlined text-gray-400 text-sm">chevron_right</span>
            <span className="text-[#0d121b] dark:text-gray-100 text-sm font-medium">Agregar Proveedor</span>
          </div>

          {/* Título */}
          <div className="flex flex-col gap-2 mb-8">
            <h1 className="text-[#111318] dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
              Agregar Proveedor
            </h1>
            <p className="text-[#616f89] dark:text-gray-400 text-base font-normal">
              Complete el formulario a continuación para registrar un nuevo proveedor en el sistema.
            </p>
          </div>

          {/* FORMULARIO IMPORTADO */}
          <FormularioProveedor actionFunc={crearProveedor} />

        </div>
      </main>
    </div>
  );
}