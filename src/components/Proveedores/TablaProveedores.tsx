import Link from "next/link";

// Define las props que espera recibir la tabla
interface TablaProveedoresProps {
  proveedores: any[]; // Lo ideal es cambiar 'any' por tu tipo Proveedor de Prisma
  totalProveedores: number;
}

export default function TablaProveedores({ proveedores, totalProveedores }: TablaProveedoresProps) {
  
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
                    <Link 
                      href={`/proveedores/${prov.id}`}
                      className="font-medium text-neutral-800 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 hover:underline cursor-pointer transition-colors"
                    >
                      {prov.razonSocial}
                    </Link>
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
  );
}