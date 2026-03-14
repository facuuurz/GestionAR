import Link from "next/link";
import Paginador from "@/components/Proveedores/ui/Paginador"; // <-- IMPORTAMOS EL ÁTOMO

interface TablaProveedoresProps {
  proveedores: any[]; 
  totalProveedores: number;
  currentPage: number;
  totalPages: number;
  createPageUrl: (newPage: number) => string;
  isAdmin?: boolean;
}

export default function TablaProveedores({ 
  proveedores, 
  totalProveedores,
  currentPage,
  totalPages,
  createPageUrl,
  isAdmin = true
}: TablaProveedoresProps) {
  
  const getAvatarColor = (id: number) => {
    const colors = [
      "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
      "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
      "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400",
      "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    ];
    return colors[id % colors.length];
  };

  return (
    <div className="flex flex-col rounded-xl border border-[#ededed] dark:border-[#333] bg-white dark:bg-[#1e2736] overflow-hidden shadow-sm flex-1 min-h-0">
      
      <div className="overflow-x-auto overflow-y-auto h-full relative custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#f9f9f9] dark:bg-[#151a25] border-b border-[#ededed] dark:border-[#333] sticky top-0 z-20">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Código</th>
              <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider">Razón Social</th>
              <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider hidden md:table-cell">Contacto</th>
              {isAdmin && (
                <th className="px-4 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wider text-center sticky right-0 z-20 bg-[#f9f9f9] dark:bg-[#151a25] shadow-[-1px_0_0_0_#ededed] dark:shadow-[-1px_0_0_0_#333]">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ededed] dark:divide-[#333] text-sm">
            
            {proveedores.length === 0 ? (
                <tr>
                    <td colSpan={4} className="text-center py-12 text-neutral-500 text-sm">
                        <div className="flex flex-col items-center gap-2">
                            <span className="material-symbols-outlined text-4xl text-neutral-300">search_off</span>
                            <p>No se encontraron proveedores.</p>
                        </div>
                    </td>
                </tr>
            ) : (
                proveedores.map((prov) => (
                <tr key={prov.id} className="hover:bg-neutral-50 dark:hover:bg-[#333]/50 transition-colors group">
                    <td className="px-4 py-3 font-medium text-blue-600 dark:text-blue-400 font-mono">
                    {prov.codigo}
                    </td>
                    <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs ${getAvatarColor(prov.id)}`}>
                        {prov.razonSocial.substring(0, 2).toUpperCase()}
                        </div>
                        <Link 
                        href={`/proveedores/${prov.id}`}
                        className="font-medium text-neutral-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:underline cursor-pointer transition-colors"
                        >
                        {prov.razonSocial}
                        </Link>
                    </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-500 dark:text-gray-400 hidden md:table-cell">{prov.contacto || "-"}</td>
                    
                    {isAdmin && (
                      <td className="px-4 py-3 text-center sticky right-0 bg-white group-hover:bg-neutral-50 dark:bg-[#1e2736] dark:group-hover:bg-[#1a222e] z-10 transition-colors">
                        <Link 
                            href={`/proveedores/editar/${prov.id}`} 
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 text-white text-xs font-bold rounded-lg hover:bg-black dark:bg-white dark:text-black dark:hover:bg-neutral-200 transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm"
                        >
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                            Actualizar
                        </Link>
                      </td>
                    )}
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* --- FOOTER: CONTEO Y PAGINACIÓN ATÓMICA --- */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-4 py-3 border-t border-[#ededed] dark:border-[#333] bg-[#f9f9f9] dark:bg-[#151a25]">
          
          <div className="text-xs text-neutral-500 font-medium">
            <span>Mostrando {proveedores.length} de {totalProveedores} proveedores</span>
          </div>

          <Paginador 
            currentPage={currentPage} 
            totalPages={totalPages} 
            createPageUrl={createPageUrl} 
          />

      </div>

    </div>
  );
}