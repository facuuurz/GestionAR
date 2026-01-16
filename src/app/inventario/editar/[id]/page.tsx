import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import EditProductForm from "../../../../components/EditarProducto/EditarProducto";

export default async function EditarProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idNumerico = parseInt(id);

  if (isNaN(idNumerico)) {
    redirect("/inventario");
  }

  // Obtenemos los datos del producto (Server Side)
  const producto = await prisma.producto.findUnique({
    where: { id: idNumerico },
  });

  if (!producto) {
    redirect("/inventario");
  }

  // Normalizamos el precio a número para que TypeScript no se queje si Prisma devuelve Decimal
  const productoFormateado = {
    ...producto,
    precio: Number(producto.precio),
    // Aseguramos que tipo, proveedor y codigoBarra no sean null si la DB lo permite (aunque Zod lo exige)
    tipo: producto.tipo || "",
    proveedor: producto.proveedor || "",
    codigoBarra: producto.codigoBarra || "",
  };

  return (
    <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#101622] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-200">
      
      <main className="w-full min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl space-y-8">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 font-medium">
            <Link href="/" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                 Panel
            </Link>
            <span className="material-symbols-outlined text-base">chevron_right</span>
            <Link href="/inventario" className="hover:text-blue-600 dark:hover:text-white transition-colors">
              Inventario
            </Link>
            <span className="material-symbols-outlined text-base">chevron_right</span>
            <span className="text-slate-900 dark:text-white font-bold">Editar Producto</span>
          </div>

          {/* Header */}
          <div className="flex flex-col gap-1.5">
            <h1 className="text-slate-900 dark:text-white text-3xl font-bold tracking-tight">
              Editar Producto
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Modifique los detalles del producto existente{" "}
              <span className="text-slate-900 dark:text-white font-bold font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                #{producto.id}
              </span>
            </p>
          </div>

          {/* Card Principal */}
          <div className="bg-white dark:bg-[#151a25] rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-6 md:p-8">
              
              {/* Formulario Interactivo (Cliente) */}
              <EditProductForm producto={productoFormateado} />

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}