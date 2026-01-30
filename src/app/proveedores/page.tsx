import { obtenerProveedores } from "@/actions/proveedores";
import Link from "next/link";
import Search from "@/components/Proveedores/Search";
import SortProveedoresWrapper from "@/components/Proveedores/SortProveedoresWrapper";
import { Suspense } from "react"; // 🆕 IMPORTANTE: Viene de React

export default async function ProveedoresPage(props: {
  searchParams?: Promise<{ query?: string; sort?: string }>;
}) {
  const searchParams = await props.searchParams;
  const params = await searchParams;
  const query = searchParams?.query || "";
  const sort = params?.sort || "";
  
  const proveedores = await obtenerProveedores(query, sort);

  let totalProveedores = proveedores.length;
  if (query) {
     const todosLosProveedores = await obtenerProveedores("", ""); 
     totalProveedores = todosLosProveedores.length;
  }

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

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#f6f6f8] dark:bg-[#101622]">
      <main className="flex flex-1 flex-col items-center py-8 px-4 sm:px-10 md:px-20 lg:px-40 w-full max-w-360 mx-auto overflow-hidden relative">
        <div className="w-full flex flex-col gap-6 h-full">
          
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

          {/* Barra de Navegación con SUSPENSE */}
          <div className="bg-white dark:bg-[#1e2736] p-4 rounded-xl border border-[#ededed] dark:border-[#333] shadow-sm flex flex-col md:flex-row items-center gap-4 shrink-0">
              
              <div className="w-full md:flex-1">
                {/* 🆕 Si Search usa useSearchParams, también debería ir en Suspense */}
                <Suspense fallback={<div className="h-10 w-full bg-gray-100 animate-pulse rounded-lg" />}>
                   <Search placeholder="Buscar por Código, Razón Social o Contacto..." />
                </Suspense>
              </div>

              <div className="flex shrink-0">
                 {/* 🆕 AQUÍ ESTABA EL ERROR: SortProveedoresWrapper usa useSearchParams */}
                 <Suspense fallback={<div className="h-10 w-32 bg-gray-100 animate-pulse rounded-lg" />}>
                    <SortProveedoresWrapper />
                 </Suspense>
              </div>
          </div>

          {/* TABLA (se mantiene igual) */}
          <div className="flex flex-col rounded-xl border border-[#ededed] dark:border-[#333] bg-white dark:bg-[#1e2736] overflow-hidden shadow-sm flex-1 min-h-0">
            <div className="overflow-x-auto overflow-y-auto h-full relative custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#f9f9f9] dark:bg-[#151a25] border-b border-[#ededed] dark:border-[#333] sticky top-0 z-20">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Código</th>
                    <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Razón Social</th>
                    <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider hidden md:table-cell">Contacto</th>
                    <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider text-center sticky right-0 z-20 bg-[#f9f9f9] dark:bg-[#151a25]">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#ededed] dark:divide-[#333] text-sm">
                  {proveedores.map((prov) => (
                    <tr key={prov.id} className="hover:bg-neutral-50 dark:hover:bg-[#333]/50 transition-colors group">
                      <td className="px-4 py-3 font-medium text-[#135bec] dark:text-blue-400 font-mono">
                        {prov.codigo}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${getAvatarColor(prov.id)}`}>
                            {prov.razonSocial.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="font-medium text-neutral-800 dark:text-white">{prov.razonSocial}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-neutral-500 dark:text-gray-400 hidden md:table-cell">{prov.contacto || "-"}</td>
                      <td className="px-4 py-3 text-center sticky right-0 bg-white dark:bg-[#222] z-10">
                        <Link href={`/proveedores/editar/${prov.id}`} className="px-3 py-1.5 rounded text-xs font-bold text-white bg-neutral-800 hover:bg-black">
                          Actualizar
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 border-t border-[#ededed] dark:border-[#333] bg-[#f9f9f9] dark:bg-[#151a25] text-xs text-neutral-500 font-medium flex justify-between">
                <span>Mostrando {proveedores.length} proveedores</span>
                <span>Total: {totalProveedores}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}