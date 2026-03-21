import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import EditProductForm from "../../../../components/Inventario/EditarProducto";

export default async function EditarProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (session?.role === 'EMPLEADO') redirect('/');
  const { id } = await params;
  const idNumerico = parseInt(id);

  if (isNaN(idNumerico)) {
    redirect("/inventario");
  }

  // 1. Obtenemos los datos del producto
  const producto = await prisma.producto.findUnique({
    where: { id: idNumerico },
  });

  if (!producto) {
    return (
      <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#101622] text-slate-900 dark:text-slate-100 font-sans flex items-center justify-center p-4 transition-colors duration-200">
        <div className="bg-white dark:bg-[#151a25] p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 text-center max-w-md w-full">
          <div className="mb-4 text-red-500 w-16 h-16 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">error</span>
          </div>
          <h2 className="text-xl font-bold mb-2">Producto no encontrado</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium text-sm">El producto que intentas editar no existe o fue eliminado.</p>
          <Link href="/inventario" className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors w-full shadow-sm">
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Volver al inventario
          </Link>
        </div>
      </div>
    );
  }

  // Obtenemos todas las categorías de la base de datos
  const categorias = await prisma.categoria.findMany({
    orderBy: { nombre: 'asc' },
  });

  // Normalizamos el precio
  const productoFormateado = {
    ...producto,
    precio: Number(producto.precio),
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

              {/* Pasamos producto Y categorias al formulario */}
              <EditProductForm producto={productoFormateado} categorias={categorias} />

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}