import Link from "next/link";
import FormularioNuevoProducto from "@/components/Inventario/FormularioNuevoProducto";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function AgregarProductoPage() {
  const session = await getSession();
  if (session?.role === 'EMPLEADO') redirect('/');
  return (
    <div className="bg-[#f6f6f8] dark:bg-[#101622] font-sans min-h-screen flex flex-col transition-colors duration-200">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden text-[#0d121b] dark:text-gray-100">
        <div className="flex h-full grow flex-col">
          <div className="flex flex-1 justify-center py-6 px-4 md:px-8">
            <div className="flex flex-col max-w-240 flex-1 w-full gap-6">

              {/* Breadcrumbs */}
              <div className="flex flex-wrap items-center gap-2 px-1">
                <Link href="/" className="text-gray-500 dark:text-gray-400 text-sm font-medium hover:text-blue-600 dark:hover:text-white transition-colors">
                  Panel
                </Link>
                <span className="material-symbols-outlined text-gray-400 text-sm">chevron_right</span>
                <Link href="/inventario" className="text-gray-500 dark:text-gray-400 text-sm font-medium dark:hover:text-white transition-colors hover:text-blue-600">
                  Inventario
                </Link>
                <span className="material-symbols-outlined text-gray-400 text-sm">chevron_right</span>
                <span className="text-[#0d121b] dark:text-gray-100 text-sm font-medium">Agregar Producto</span>
              </div>

              <div className="flex flex-col gap-2">
                <h1 className="text-[#0d121b] dark:text-white text-3xl md:text-4xl font-extrabold tracking-[-0.033em]">
                  Agregar Nuevo Producto
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-base font-normal">
                  Ingrese los detalles del nuevo artículo para su gestión.
                </p>
              </div>

              <FormularioNuevoProducto />

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}