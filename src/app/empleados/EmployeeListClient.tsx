"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, Search, Pencil, Trash2, AlertTriangle, ShieldCheck, Eye, ChevronLeft, ChevronRight, ArrowDownUp } from "lucide-react";
import { deleteUser } from "@/actions/usuarios";
import { toast } from "react-hot-toast";

export default function EmployeeListClient({ empleados, currentUserRole }: { empleados: any[], currentUserRole: string }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("TODOS");
  const [sortBy, setSortBy] = useState<"NEWEST" | "OLDEST">("NEWEST");
  const [currentPage, setCurrentPage] = useState(1);
  const [employeeToDelete, setEmployeeToDelete] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Reiniciar a la página 1 cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, sortBy]);

  const filteredEmpleados = empleados.filter(emp => {
    const matchesSearch = emp.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          emp.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "TODOS" || emp.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getSeniority = (emp: any) => new Date(emp.seniorityDate || emp.createdAt).getTime();

  const sortedEmpleados = [...filteredEmpleados].sort((a, b) => {
    if (sortBy === "NEWEST") return getSeniority(b) - getSeniority(a);
    return getSeniority(a) - getSeniority(b);
  });

  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedEmpleados.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmpleados = sortedEmpleados.slice(startIndex, startIndex + itemsPerPage);

  const handleDeleteClick = (emp: any) => {
    if (emp.role === "SUPERADMIN") {
      toast.error("No se puede eliminar a un Super Administrador del sistema.", {
        style: { background: "#EF4444", color: "#fff", padding: "16px", borderRadius: "12px" },
        iconTheme: { primary: "#fff", secondary: "#EF4444" }
      });
      return;
    }
    setEmployeeToDelete(emp);
  };

  const handleDeleteConfirm = async () => {
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
      {/* Controles de filtro y búsqueda */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative w-full max-w-md">
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

        <div className="flex bg-gray-100 dark:bg-[#2a2a2a] p-1 rounded-xl w-full md:w-auto overflow-x-auto shrink-0 border border-gray-200 dark:border-[#333]">
          {["TODOS", "EMPLEADO", "ADMIN", "SUPERADMIN"].map(role => (
            <button 
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                roleFilter === role 
                  ? "bg-white dark:bg-[#444] text-black dark:text-white shadow-sm" 
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {role === "TODOS" ? "Todos" : role === "SUPERADMIN" ? "SuperAdmin" : role === "ADMIN" ? "Admins" : "Empleados"}
            </button>
          ))}
        </div>
      </div>

      {/* Barra de Totales y Ordenamiento */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50 dark:bg-[#1a1a1a] p-4 rounded-xl border border-gray-100 dark:border-[#333]">
        <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          Total de empleados: <span className="text-black dark:text-white font-bold ml-1">{filteredEmpleados.length}</span>
        </div>
        <div className="flex items-center gap-2 mt-3 sm:mt-0 bg-white dark:bg-[#222] border border-[#ededed] dark:border-[#333] px-3 py-1.5 rounded-lg shadow-sm">
          <ArrowDownUp className="w-4 h-4 text-gray-400" />
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as "NEWEST" | "OLDEST")}
            className="text-sm bg-transparent border-none text-gray-700 dark:text-gray-300 focus:ring-0 cursor-pointer font-medium outline-none ml-1"
          >
            <option value="NEWEST">Más recientes primero</option>
            <option value="OLDEST">Más antiguos primero</option>
          </select>
        </div>
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
              {paginatedEmpleados.map((emp: any) => {
                const diasAntiguedad = Math.floor((new Date().getTime() - new Date(emp.seniorityDate || emp.createdAt).getTime()) / (1000 * 3600 * 24));
                
                return (
                  <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-[#222] transition-colors group">
                    <td className="px-6 py-4">
                      <Link href={`/empleados/${emp.id}`} className="flex items-center gap-3 group/link">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-gray-700 to-black dark:from-gray-500 dark:to-gray-300 flex items-center justify-center text-white text-xs font-bold shadow-sm overflow-hidden shrink-0">
                          {emp.profilePicture ? (
                            <img src={emp.profilePicture} alt={emp.name || emp.username} className="w-full h-full object-cover" />
                          ) : (
                            emp.name?.charAt(0).toUpperCase() || emp.username.charAt(0).toUpperCase()
                          )}
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white group-hover/link:text-indigo-600 transition-colors cursor-pointer">
                          {emp.name || "Sin nombre"}
                        </span>
                      </Link>
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
                        <div className="flex items-center justify-center gap-3 transition-opacity">
                            <Link 
                                href={`/empleados/${emp.id}`}
                                className="p-2 text-green-600 bg-green-50 hover:bg-green-100 dark:text-green-400 dark:bg-green-900/20 dark:hover:bg-green-900/40 rounded-lg transition-colors"
                                title="Ver Perfil"
                            >
                                <Eye className="w-4 h-4" />
                            </Link>

                            <Link 
                                href={`/empleados/editar/${emp.id}`}
                                className="p-2 text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 rounded-lg transition-colors"
                                title="Modificar Empleado"
                            >
                                <Pencil className="w-4 h-4" />
                            </Link>

                            <button 
                                onClick={() => handleDeleteClick(emp)}
                                className="p-2 text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-lg transition-colors"
                                title="Eliminar Empleado"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </td>
                  </tr>
                )
              })}
              
              {paginatedEmpleados.length === 0 && (
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

      {/* Controles de Paginación */}
      {totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-[#1f1f1f] p-4 rounded-xl border border-[#ededed] dark:border-[#333] gap-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Mostrando <span className="font-medium text-gray-900 dark:text-white">{startIndex + 1}</span> a <span className="font-medium text-gray-900 dark:text-white">{Math.min(startIndex + itemsPerPage, sortedEmpleados.length)}</span> de <span className="font-medium text-gray-900 dark:text-white">{sortedEmpleados.length}</span> resultados
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 dark:border-[#444] text-gray-500 hover:bg-gray-50 dark:hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center px-2 gap-1">
              {Array.from({ length: totalPages }).map((_, i) => {
                if (
                  i === 0 || 
                  i === totalPages - 1 || 
                  (i >= currentPage - 2 && i <= currentPage)
                ) {
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === i + 1 
                          ? 'bg-black text-white dark:bg-white dark:text-black' 
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#333]'
                      }`}
                    >
                      {i + 1}
                    </button>
                  );
                } else if (i === currentPage - 3 || i === currentPage + 1) {
                  return <span key={i} className="text-gray-400 px-1">...</span>;
                }
                return null;
              })}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 dark:border-[#444] text-gray-500 hover:bg-gray-50 dark:hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

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
                onClick={handleDeleteConfirm}
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
