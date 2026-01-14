import { obtenerClientes } from "@/actions/clientes";
import Link from "next/link";
import Search from "@/components/Search/Search";

export default async function CuentasCorrientesPage({
  searchParams,
}: {
  searchParams?: Promise<{ query?: string }>;
}) {
  const params = await searchParams;
  const query = params?.query || "";
  const clientes = await obtenerClientes(query);

  // Helper para formato de moneda
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(amount);
  };

  // Helper para colores de estado
  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case "Al Día": return "bg-[#dcfce7] text-[#166534] dark:bg-green-900/30 dark:text-green-300";
      case "Deudor": return "bg-[#fee2e2] text-[#991b1b] dark:bg-red-900/30 dark:text-red-300";
      case "Pendiente": return "bg-[#fef9c3] text-[#854d0e] dark:bg-yellow-900/30 dark:text-yellow-300";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#f4f4f5] dark:bg-[#0f172a] text-[#18181b] dark:text-[#f1f5f9]">
      
      <main className="flex-1 max-w-[1400px] w-full mx-auto p-6 md:p-8">
        
        {/* BREADCRUMBS */}
        <div className="flex items-center gap-2 text-sm text-[#71717a] dark:text-[#94a3b8] mb-6">
            <span>Panel</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="font-medium text-[#18181b] dark:text-[#f1f5f9]">Cuentas Corrientes</span>
        </div>

        {/* TÍTULO Y BOTÓN AGREGAR */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">Cuentas Corrientes</h1>
                <p className="text-[#71717a] dark:text-[#94a3b8]">Gestiona los saldos y estados de cuenta de tus clientes.</p>
            </div>
            <Link 
                href="/cuentas-corrientes/nuevo"
                className="bg-[#18181b] hover:bg-black/80 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200 px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
            >
                <span className="material-symbols-outlined text-xl">add</span>
                Agregar Cuenta Corriente
            </Link>
        </div>

        {/* BARRA DE BÚSQUEDA Y FILTROS */}
        <div className="bg-white dark:bg-[#1e293b] p-4 rounded-xl shadow-sm border border-[#e4e4e7] dark:border-[#334155] mb-6">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    {/* 👇 COMPONENTE SEARCH FUNCIONAL */}
                    <Search placeholder="Buscar por cliente, CUIT o ID..." />
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#1e293b] border border-[#e4e4e7] dark:border-[#334155] rounded-lg text-sm font-medium hover:bg-[#f4f4f5] dark:hover:bg-gray-800 transition-colors whitespace-nowrap">
                        <span className="material-symbols-outlined text-lg">filter_list</span>
                        Filtrar
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#1e293b] border border-[#e4e4e7] dark:border-[#334155] rounded-lg text-sm font-medium hover:bg-[#f4f4f5] dark:hover:bg-gray-800 transition-colors whitespace-nowrap">
                        <span className="material-symbols-outlined text-lg">sort</span>
                        Ordenar
                    </button>
                    {/* Botón Exportar eliminado */}
                </div>
            </div>
        </div>

        {/* TABLA DE CLIENTES */}
        <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-sm border border-[#e4e4e7] dark:border-[#334155] overflow-hidden flex flex-col">
            <div className="overflow-auto h-[600px]">
                <table className="w-full text-left text-sm border-collapse">
                    <thead className="sticky top-0 z-10 bg-white dark:bg-[#1e293b] shadow-sm">
                        <tr className="border-b border-[#e4e4e7] dark:border-[#334155] text-[#71717a] dark:text-[#94a3b8] uppercase tracking-wider text-xs font-semibold">
                            <th className="px-6 py-4">ID Cliente</th>
                            <th className="px-6 py-4">Cliente / Razón Social</th>
                            <th className="px-6 py-4">Estado</th>
                            <th className="px-6 py-4">Saldo Actual</th>
                            {/* Columnas eliminadas: Límite, Movimiento, Condición Fiscal */}
                            <th className="px-6 py-4 text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e4e4e7] dark:divide-[#334155] text-[#18181b] dark:text-[#f1f5f9]">
                        
                        {clientes.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    {query ? `No se encontraron clientes para "${query}"` : "No hay cuentas corrientes registradas."}
                                </td>
                            </tr>
                        )}

                        {clientes.map((cliente) => (
                            <tr key={cliente.id} className="hover:bg-[#f4f4f5] dark:hover:bg-gray-800 transition-colors group">
                                <td className="px-6 py-4 text-[#71717a] dark:text-[#94a3b8] font-mono">
                                    CC-{cliente.id.toString().padStart(5, '0')}
                                </td>
                                <td className="px-6 py-4">
                                    <Link 
                                      href={`/cuentas-corrientes/${cliente.id}`}
                                      className="block group-hover:translate-x-1 transition-transform"
                                    >
                                      <div className="font-bold text-base text-[#18181b] dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                                        {cliente.nombre}
                                      </div>
                                      <div className="text-xs text-[#71717a] dark:text-[#94a3b8] mt-0.5">
                                        CUIT: {cliente.cuit || "-"}
                                      </div>
                                    </Link>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`${getStatusBadge(cliente.estado)} px-2.5 py-1 rounded-md text-xs font-semibold`}>
                                        {cliente.estado}
                                    </span>
                                </td>
                                <td className={`px-6 py-4 font-medium ${Number(cliente.saldo) < 0 ? 'text-[#991b1b] dark:text-red-400' : 'text-[#166534] dark:text-green-400'}`}>
                                    {formatMoney(Number(cliente.saldo))}
                                </td>
                                
                                <td className="px-6 py-4 text-center">
                                    <Link 
                                        href={`/cuentas-corrientes/editar/${cliente.id}`}
                                        className="bg-[#18181b] text-white dark:bg-white dark:text-black px-3 py-1.5 rounded text-xs font-medium inline-flex items-center gap-1 hover:opacity-90 transition-opacity"
                                    >
                                        <span className="material-symbols-outlined text-sm">edit</span>
                                        Actualizar
                                    </Link>
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            </div>
        </div>

      </main>
    </div>
  );
}