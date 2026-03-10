import Link from "next/link";
import { obtenerProductoPorId } from "@/actions/productos";
import VistaDetalleProducto from "@/components/Inventario/VistaDetalleProducto";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const idProducto = Number(id);

  if (isNaN(idProducto)) {
    return <NotFoundView />;
  }

  const producto = await obtenerProductoPorId(idProducto);

  if (!producto) {
    return <NotFoundView />;
  }

  // Convertimos el producto devuelto a un formato compatible (asegurando el formato de fecha)
  const productoFormateado = {
    ...producto,
    fechaVencimiento: producto.fechaVencimiento ? new Date(producto.fechaVencimiento) : null,
    createdAt: new Date(producto.createdAt),
    updatedAt: new Date(producto.updatedAt),
  };

  return <VistaDetalleProducto producto={productoFormateado} />;
}

// Subcomponente local para aislar la vista de "No encontrado"
function NotFoundView() {
  return (
    <div className="min-h-screen bg-[#f6f6f8] dark:bg-[#101622] text-slate-900 dark:text-slate-100 font-sans flex items-center justify-center p-4 transition-colors duration-200">
      <div className="bg-white dark:bg-[#151a25] p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 text-center max-w-md w-full">
        <div className="mb-4 text-amber-500 w-16 h-16 mx-auto rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
          <span className="material-symbols-outlined text-3xl">warning</span>
        </div>
        <h2 className="text-xl font-bold mb-2">Producto no encontrado</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium text-sm">El producto que intentas ver no existe o fue eliminado del inventario.</p>
        <Link href="/inventario" className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors w-full shadow-sm">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Volver al inventario
        </Link>
      </div>
    </div>
  );
}