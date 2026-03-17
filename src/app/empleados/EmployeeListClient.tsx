"use client";

import { useState } from "react";
import Link from "next/link";
import { Users, Search, Pencil, Trash2, AlertTriangle, ShieldCheck } from "lucide-react";
import { deleteUser } from "@/actions/usuarios";
import { toast } from "react-hot-toast";

export default function EmployeeListClient({ empleados, currentUserRole }: { empleados: any[], currentUserRole: string }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [employeeToDelete, setEmployeeToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const filteredEmpleados = empleados.filter(emp => 
    (emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     emp.username.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = async () => {
    if (!employeeToDelete) return;
    setIsDeleting(true);
    setErrorMsg("");
    
    try {
      const res = await deleteUser(employeeToDelete.id);
      if (!res.success) {
        toast.error(res.error || "No se pudo eliminar al usuario.");
        setErrorMsg(res.error || "No se pudo eliminar al usuario.");
        setIsDeleting(false);
        return;
      }
      
      toast.success("Usuario eliminado correctamente", {
        style: { background: "#EF4444", color: "#fff", padding: "16px" }, // Red
        iconTheme: { primary: "#fff", secondary: "#EF4444" }
      });
      setEmployeeToDelete(null);
      window.location.reload();
    } catch (err) {
      toast.error("Ocurrió un error inesperado al eliminar.");
      setErrorMsg("Ocurrió un error inesperado.");
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Buscador */}
      <div className="mb-6 relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-2.5 border border-[#ededed] dark:border-[#333] rounded-xl bg-white dark:bg-[#222] text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
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
                <th className="px-6 py-4 font-semibold">Rol</th>
                <th className="px-6 py-4 font-semibold">DNI</th>
                <th className="px-6 py-4 font-semibold">CUIT/CUIL</th>
                <th className="px-6 py-4 font-semibold">Antigüedad</th>
                <th className="px-6 py-4 font-semibold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ededed] dark:divide-[#333]">
              {filteredEmpleados.map((emp: any) => {
                const diasAntiguedad = Math.floor((new Date().getTime() - new Date(emp.seniorityDate || emp.createdAt).getTime()) / (1000 * 3600 * 24));
                
                return (
                  <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-[#222] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-black dark:from-gray-500 dark:to-gray-300 flex items-center justify-center text-white text-xs font-bold shadow-sm overflow-hidden shrink-0">
                          {emp.profilePicture ? (
                            <img src={emp.profilePicture} alt={emp.name || emp.username} className="w-full h-full object-cover" />
                          ) : (
                            emp.name?.charAt(0).toUpperCase() || emp.username.charAt(0).toUpperCase()
                          )}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {emp.name || "Sin nombre"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      @{emp.username}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        emp.role === 'ADMIN' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                        emp.role === 'SUPERADMIN' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                      }`}>
                        {emp.role === 'SUPERADMIN' && <ShieldCheck className="w-3.5 h-3.5" />}
                        {emp.role}
                      </span>
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
                    <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link 
                                href={`/empleados/editar/${emp.id}`}
                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                title="Modificar Empleado"
                            >
                                <Pencil className="w-4 h-4" />
                            </Link>

                            <button 
                                onClick={() => setEmployeeToDelete(emp)}
                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                title="Eliminar Empleado"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </td>
                  </tr>
                )
              })}
              
              {filteredEmpleados.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    <Users className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                    <p>No se encontraron empleados registrados.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {employeeToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#222] border border-[#ededed] dark:border-[#333] rounded-2xl p-6 shadow-xl max-w-md w-full mx-4 animate-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  ¿Eliminar definitivamente a {employeeToDelete.name || employeeToDelete.username}?
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Esta acción no se puede deshacer. Se eliminará el acceso del usuario al sistema de inmediato.
                </p>
              </div>
            </div>
            
            {errorMsg && (
              <p className="mt-4 text-sm text-center text-red-500 font-medium">{errorMsg}</p>
            )}

            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setEmployeeToDelete(null)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-[#444] text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-[#333] transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {isDeleting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Eliminar usuario"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
