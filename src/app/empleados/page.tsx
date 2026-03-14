import { getSession } from "@/lib/session";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, Search, Plus } from "lucide-react";

const prisma = new PrismaClient();

export const metadata = {
  title: "Gestión de Empleados | GestionAR",
};

export default async function EmpleadosPage() {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    redirect("/");
  }

  const empleados = await (prisma.user as any).findMany({
    where: { role: "EMPLEADO" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="px-4 sm:px-10 md:px-20 lg:px-40 flex flex-1 justify-center py-8">
      <div className="layout-content-container flex flex-col w-full max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Cabecera */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-primary dark:text-white text-3xl sm:text-4xl font-bold leading-tight flex items-center gap-3">
              <Users className="w-8 h-8 md:w-10 md:h-10 text-indigo-500" />
              Ver Empleados
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-base md:text-lg">
              Administra el personal, accesos y su historial de ventas.
            </p>
          </div>
          
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-indigo-500/30">
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Nuevo Empleado</span>
          </button>
        </div>

        {/* Buscador */}
        <div className="mb-6 relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2.5 border border-[#ededed] dark:border-[#333] rounded-xl bg-white dark:bg-[#222] text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            placeholder="Buscar por nombre o usuario..."
          />
        </div>

        {/* Tabla */}
        <div className="bg-white dark:bg-[#1f1f1f] rounded-2xl border border-[#ededed] dark:border-[#333] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#2a2a2a] border-b border-[#ededed] dark:border-[#333] text-sm text-gray-500 dark:text-gray-400">
                  <th className="px-6 py-4 font-semibold">Nombre del Empleado</th>
                  <th className="px-6 py-4 font-semibold">Usuario</th>
                  <th className="px-6 py-4 font-semibold">DNI</th>
                  <th className="px-6 py-4 font-semibold">CUIT/CUIL</th>
                  <th className="px-6 py-4 font-semibold">Antigüedad</th>
                  <th className="px-6 py-4 font-semibold text-right">Última Actividad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ededed] dark:divide-[#333]">
                {empleados.map((emp: any) => {
                  const diasAntiguedad = Math.floor((new Date().getTime() - new Date(emp.seniorityDate || emp.createdAt).getTime()) / (1000 * 3600 * 24));
                  
                  return (
                    <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-[#222] transition-colors group">
                      <td className="px-6 py-4">
                        <Link href={`/empleados/${emp.id}`} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                            {emp.name?.charAt(0).toUpperCase() || emp.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                            {emp.name || "Sin nombre"}
                          </span>
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        @{emp.username}
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        {emp.dni || "—"}
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        {emp.cuit || "—"}
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        {diasAntiguedad} días
                      </td>
                      <td className="px-6 py-4 text-right">
                        {emp.lastActive ? (
                          <div className="flex flex-col items-end">
                            <span className="text-gray-900 dark:text-gray-300">
                              {new Date(emp.lastActive).toLocaleDateString("es-AR")}
                            </span>
                            <span className="text-xs text-green-500">
                              {new Date().getTime() - new Date(emp.lastActive).getTime() < 86400000 ? "Activo Reciente" : "Inactivo"}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Nunca</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
                
                {empleados.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      <Users className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                      <p>No se encontraron empleados registrados.</p>
                      <button className="mt-4 text-indigo-500 hover:text-indigo-400 font-medium transition-colors">
                        Registrar al primer empleado
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
}
