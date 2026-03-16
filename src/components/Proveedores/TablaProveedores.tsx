import Link from "next/link";
import Paginador from "@/components/Proveedores/ui/Paginador";
import ProveedorRow from "@/components/Proveedores/ProveedorRow";

interface TablaProveedoresProps {
  proveedores: any[]; 
  totalProveedores: number;
  currentPage: number;
  totalPages: number;
  createPageUrl: (newPage: number) => string;
  isAdmin?: boolean;
  onDeleteSuccess?: () => void;
}

export default function TablaProveedores({ 
  proveedores, 
  totalProveedores,
  currentPage,
  totalPages,
  createPageUrl,
  isAdmin = true,
  onDeleteSuccess
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
                    <ProveedorRow 
                        key={prov.id} 
                        prov={prov} 
                        isAdmin={isAdmin} 
                        onDeleteSuccess={onDeleteSuccess} 
                    />
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