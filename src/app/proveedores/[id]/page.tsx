import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DetalleProveedorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idNumerico = parseInt(id);

  // 1. Obtener datos del proveedor
  const proveedor = await prisma.proveedor.findUnique({
    where: { id: idNumerico },
  });

  if (!proveedor) {
    redirect("/proveedores");
  }

  // 2. Obtener productos asociados a este proveedor (por código)
  // Buscamos productos donde 'proveedor' sea igual al 'codigo' del proveedor actual
  const productosAsociados = await prisma.producto.findMany({
    where: {
      proveedor: proveedor.codigo, 
    },
    orderBy: { id: "desc" },
  });

  // Helper para el badge de estado
  const getStatusColor = (estado: string) => {
    switch (estado) {
      case "Activo": return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300";
      case "Inactivo": return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";
      default: return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#101622] text-gray-900 dark:text-gray-100 font-sans pb-20">
      
      <main className="pt-8 pb-12 px-6 max-w-[1600px] mx-auto">
        
        {/* BREADCRUMBS */}
        <nav aria-label="Breadcrumb" className="flex mb-6">
          <ol className="inline-flex items-center space-x-1 md:space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <li className="inline-flex items-center hover:text-gray-700 dark:hover:text-gray-200">
              <Link href="/">Panel</Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="material-symbols-outlined text-base mx-1">chevron_right</span>
                <Link className="hover:text-gray-700 dark:hover:text-gray-200" href="/proveedores">Proveedores</Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <span className="material-symbols-outlined text-base mx-1">chevron_right</span>
                <span className="font-medium text-gray-900 dark:text-white">{proveedor.razonSocial}</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* ENCABEZADO Y BOTÓN EDITAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{proveedor.razonSocial}</h1>
            <p className="text-gray-500 dark:text-gray-400">Detalles del proveedor y catálogo de productos asociados.</p>
          </div>
          <div className="flex gap-3">
            <Link 
                href={`/proveedores/editar/${proveedor.id}`}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#1A202C] border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">edit</span>
              Editar
            </Link>
          </div>
        </div>

        {/* TARJETAS DE INFORMACIÓN DEL PROVEEDOR */}
        <div className="bg-white dark:bg-[#1A202C] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-8">
            
            {/* Código */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">qr_code</span>
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Código</h3>
                <p className="text-base font-semibold text-gray-900 dark:text-white">{proveedor.codigo}</p>
              </div>
            </div>

            {/* Razón Social */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">business</span>
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Razón Social</h3>
                <p className="text-base font-medium text-gray-900 dark:text-white">{proveedor.razonSocial}</p>
              </div>
            </div>

            {/* Contacto */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">person</span>
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Contacto Principal</h3>
                <p className="text-base font-medium text-gray-900 dark:text-white">{proveedor.contacto || "-"}</p>
              </div>
            </div>

            {/* Teléfono */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">call</span>
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Teléfono</h3>
                <p className="text-base font-medium text-gray-900 dark:text-white">{proveedor.telefono || "-"}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">mail</span>
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Email</h3>
                <p className="text-base font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">{proveedor.email || "-"}</p>
              </div>
            </div>

          </div>
        </div>

        {/* TABLA DE PRODUCTOS ASOCIADOS */}
        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
            <span className="material-symbols-outlined">inventory</span>
            Productos Asociados ({productosAsociados.length})
        </h2>

        <div className="bg-white dark:bg-[#1A202C] rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          
          {/* Barra de herramientas de tabla */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-[#1A202C]">
            <div className="relative w-full sm:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400 text-xl">search</span>
              </div>
              <input 
                className="block w-full pl-10 pr-3 py-2.5 border-none bg-gray-100 dark:bg-gray-800/50 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 transition-shadow outline-none" 
                placeholder="Buscar producto..." 
                type="text"
              />
            </div>
            {/* Botones decorativos */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-[#1A202C] border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <span className="material-symbols-outlined text-base">download</span> Exportar
                </button>
            </div>
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Código</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Producto</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Precio Unit.</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-[#1A202C]">
                
                {productosAsociados.length === 0 && (
                    <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                            No hay productos asociados a este proveedor ({proveedor.codigo}).
                        </td>
                    </tr>
                )}

                {productosAsociados.map((prod) => (
                    <tr key={prod.id} className="group hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-medium font-mono">
                            {prod.codigoBarra || "-"}
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900 dark:text-white">{prod.nombre}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{prod.tipo}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${prod.stock < 10 ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'}`}>
                                {prod.stock} un.
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                            ${Number(prod.precio).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                            <Link href={`/inventario/editar/${prod.id}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#135bec] text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                                <span className="material-symbols-outlined text-sm">sync_alt</span>
                                Actualizar
                            </Link>
                        </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Footer de Tabla */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-[#1A202C]">
            <span className="text-sm text-gray-500 dark:text-gray-400">Mostrando {productosAsociados.length} productos</span>
          </div>

        </div>
      </main>
    </div>
  );
}