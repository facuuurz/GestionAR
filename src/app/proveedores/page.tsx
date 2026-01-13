import { obtenerProveedores } from "@/actions/proveedores";
import Link from "next/link";
import Search from "@/components/Search/Search";

export default async function ProveedoresPage(props: {
  searchParams?: Promise<{ query?: string }>;
}) {
  //const proveedores = await obtenerProveedores();
  
  const searchParams = await props.searchParams;
  const query = searchParams?.query || ""; // Leemos lo que escribiste en el buscador
  const proveedores = await obtenerProveedores(query);

  // Función auxiliar para colores aleatorios
  const getAvatarColor = (id: number) => {
    const colors = [
      "bg-blue-100 text-primary dark:bg-blue-900 dark:text-blue-300",
      "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300",
      "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300",
      "bg-teal-100 text-teal-600 dark:bg-teal-900 dark:text-teal-300",
      "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300",
    ];
    return colors[id % colors.length];
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case "Activo": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "Inactivo": return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      case "Pendiente": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#f6f6f8] dark:bg-[#101622]">
      
      <main className="flex-1 flex flex-col items-center py-8 px-6 lg:px-12 xl:px-40 w-full">
        <div className="flex flex-col w-full max-w-[1200px]">
          
          {/* Breadcrumbs */}
          <nav className="flex flex-wrap gap-2 pb-4">
            <Link className="text-[#616f89] dark:text-gray-400 text-sm font-medium hover:text-[#135bec] transition-colors" href="/">
              Panel
            </Link>
            <span className="text-[#616f89] dark:text-gray-400 text-sm font-medium">&gt;</span>
            <span className="text-[#111318] dark:text-gray-100 text-sm font-medium">Proveedores</span>
          </nav>

          {/* Título y Botón Agregar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-[#111318] dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
                Proveedores
              </h1>
              <p className="text-[#616f89] dark:text-gray-400 text-base font-normal">
                Gestione la lista de sus proveedores y sus códigos.
              </p>
            </div>
            <div className="flex gap-3">
              <Link 
                href="/proveedores/nuevo" 
                className="flex items-center justify-center h-10 px-4 gap-2 rounded-lg bg-black text-white font-bold text-sm shadow-md hover:bg-gray-800 transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
                <span>Agregar Proveedor</span>
              </Link>
            </div>
          </div>

          {/* Barra de Búsqueda */}
          <div className="bg-white dark:bg-[#1A202C] rounded-t-xl border border-b-0 border-[#e5e7eb] dark:border-gray-700 p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="w-full sm:max-w-md">
                <Search placeholder="Buscar por nombre o código..." />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-[#616f89] dark:text-gray-400 hover:bg-[#f0f2f4] dark:hover:bg-gray-800 transition-colors">
                  <span className="material-symbols-outlined text-[20px]">filter_list</span>
                  Filtrar
                </button>
              </div>
            </div>
          </div>

          {/* TABLA */}
          <div className="w-full overflow-hidden border border-[#e5e7eb] dark:border-gray-700 rounded-b-xl bg-white dark:bg-[#1A202C] shadow-sm flex flex-col min-h-[400px]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-[#f8f9fa] dark:bg-gray-800 border-b border-[#e5e7eb] dark:border-gray-700 text-[#616f89] dark:text-gray-400 text-xs uppercase tracking-wider font-semibold">
                    <th className="py-4 px-4 w-12 text-center">
                      <input className="rounded border-gray-300 text-[#135bec] focus:ring-[#135bec] h-4 w-4 bg-gray-100 dark:bg-gray-700 dark:border-gray-600" type="checkbox"/>
                    </th>
                    <th className="py-4 px-4 w-32">Código</th>
                    <th className="py-4 px-4 flex-1">Razón Social</th>
                    <th className="py-4 px-4 hidden md:table-cell">Contacto</th>
                    <th className="py-4 px-4 hidden lg:table-cell">Teléfono</th>
                    <th className="py-4 px-4 hidden xl:table-cell">Email</th>
                    <th className="py-4 px-4 w-28 text-center">Estado</th>
                    <th className="py-4 px-4 w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f0f2f4] dark:divide-gray-700 text-sm">
                  
                  {proveedores.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-gray-500">
                        No hay proveedores registrados.
                      </td>
                    </tr>
                  )}

                  {proveedores.map((prov) => (
                    <tr key={prov.id} className="group hover:bg-[#f8faff] dark:hover:bg-gray-750 transition-colors">
                      <td className="py-4 px-4 text-center">
                        <input className="rounded border-gray-300 text-[#135bec] focus:ring-[#135bec] h-4 w-4 bg-gray-100 dark:bg-gray-700 dark:border-gray-600" type="checkbox"/>
                      </td>
                      
                      {/* 👇 AQUÍ ESTÁ EL CAMBIO: El Código ahora es un LINK */}
                      <td className="py-4 px-4">
                        <Link 
                            href={`/proveedores/${prov.id}`}
                            className="font-bold text-[#135bec] dark:text-blue-400 text-base hover:underline hover:text-blue-600 cursor-pointer"
                            title="Ver detalles del proveedor"
                        >
                            {prov.codigo}
                        </Link>
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${getAvatarColor(prov.id)}`}>
                            {prov.razonSocial.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="font-medium text-[#111318] dark:text-gray-200">{prov.razonSocial}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-[#616f89] dark:text-gray-400 hidden md:table-cell">{prov.contacto || "-"}</td>
                      <td className="py-4 px-4 text-[#616f89] dark:text-gray-400 hidden lg:table-cell">{prov.telefono || "-"}</td>
                      <td className="py-4 px-4 text-[#616f89] dark:text-gray-400 hidden xl:table-cell">{prov.email || "-"}</td>
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(prov.estado)}`}>
                          {prov.estado}
                        </span>
                      </td>
                       <td className="py-4 px-4 text-center">
                         <Link href={`/proveedores/editar/${prov.id}`} className="text-gray-400 hover:text-[#135bec]">
                            <span className="material-symbols-outlined text-[20px]">edit</span>
                         </Link>
                      </td>
                    </tr>
                  ))}
                  
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}