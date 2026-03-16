"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UserCog, ShieldCheck, User } from "lucide-react";
import { updateUser } from "@/actions/usuarios";

export default function EditUserForm({ userToEdit, currentUserRole }: { userToEdit: any, currentUserRole: string }) {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: userToEdit.name || "",
    email: userToEdit.email || "",
    role: userToEdit.role,
    dni: userToEdit.dni || "",
    cuit: userToEdit.cuit || "",
  });
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isSuperadminTarget = userToEdit.role === "SUPERADMIN";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await updateUser(
        userToEdit.id,
        formData.name,
        formData.email,
        formData.role,
        formData.dni,
        formData.cuit
      );

      if (!res.success) {
        setError(res.error || "Ocurrió un error al actualizar el usuario");
        return;
      }

      router.push("/empleados");
      
    } catch (err) {
      setError("Error interno del servidor. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-10 md:px-20 lg:px-40 flex flex-1 justify-center py-8">
      <div className="layout-content-container flex flex-col w-full max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="flex flex-col gap-6 pb-6 border-b border-[#ededed] dark:border-[#333] mb-8">
          <Link href="/empleados" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 w-fit transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Volver a la lista
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-gray-700 to-black dark:from-gray-500 dark:to-gray-300 flex items-center justify-center text-white shadow-lg">
              <UserCog className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-primary dark:text-white text-2xl sm:text-3xl font-bold leading-tight">
                Modificar Usuario
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400 text-base">
                Editando a: <span className="font-semibold text-gray-900 dark:text-white">@{userToEdit.username}</span>
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-[#222] border border-[#ededed] dark:border-[#333] rounded-2xl p-6 sm:p-8 shadow-sm">
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/30 rounded-xl text-sm font-medium flex items-center gap-2">
               <span className="material-symbols-outlined shrink-0 text-xl">error</span>
               {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-[#ededed] dark:border-[#333] pb-2">Información Personal</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre Completo *</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2.5 border border-[#ededed] dark:border-[#444] rounded-xl bg-gray-50 dark:bg-[#111] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo Electrónico *</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2.5 border border-[#ededed] dark:border-[#444] rounded-xl bg-gray-50 dark:bg-[#111] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">DNI / Documento</label>
                <input 
                  type="text" 
                  value={formData.dni}
                  onChange={(e) => setFormData({...formData, dni: e.target.value})}
                  className="w-full px-3 py-2.5 border border-[#ededed] dark:border-[#444] rounded-xl bg-gray-50 dark:bg-[#111] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CUIT / CUIL</label>
                <input 
                  type="text" 
                  value={formData.cuit}
                  onChange={(e) => setFormData({...formData, cuit: e.target.value})}
                  className="w-full px-3 py-2.5 border border-[#ededed] dark:border-[#444] rounded-xl bg-gray-50 dark:bg-[#111] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-[#ededed] dark:border-[#333] pb-2">Nivel de Acceso</h3>
              
              {isSuperadminTarget ? (
                 <div className="p-4 bg-gray-50 dark:bg-[#333] rounded-xl border border-gray-200 dark:border-[#444]">
                   <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                     Este usuario es un <strong className="text-red-500">SUPERADMIN</strong> y su nivel de acceso es permanente y no puede ser disminuido.
                   </p>
                 </div>
              ) : (
                <div className="flex flex-col gap-3 mt-2">
                  <label className={`
                    relative flex items-center gap-3 p-4 cursor-pointer rounded-xl border-2 transition-all
                    ${formData.role === 'EMPLEADO' 
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20' 
                      : 'border-[#ededed] dark:border-[#444] hover:bg-gray-50 dark:hover:bg-[#333]'}
                  `}>
                    <input 
                      type="radio" 
                      name="role" 
                      value="EMPLEADO" 
                      className="w-4 h-4 text-indigo-600"
                      onChange={() => setFormData({...formData, role: "EMPLEADO"})}
                      checked={formData.role === "EMPLEADO"}
                    />
                    <User className={`w-5 h-5 shrink-0 ${formData.role === 'EMPLEADO' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`} />
                    <div className="flex flex-col">
                      <span className={`text-sm font-bold ${formData.role === 'EMPLEADO' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                        Empleado
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Acceso limitado al punto de venta.</span>
                    </div>
                  </label>

                  {(currentUserRole === "ADMIN" || currentUserRole === "SUPERADMIN") && (
                    <label className={`
                      relative flex items-center gap-3 p-4 cursor-pointer rounded-xl border-2 transition-all
                      ${formData.role === 'ADMIN' 
                        ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-900/20' 
                        : 'border-[#ededed] dark:border-[#444] hover:bg-gray-50 dark:hover:bg-[#333]'}
                    `}>
                      <input 
                        type="radio" 
                        name="role" 
                        value="ADMIN" 
                        className="w-4 h-4 text-purple-600"
                        onChange={() => setFormData({...formData, role: "ADMIN"})}
                        checked={formData.role === "ADMIN"}
                      />
                      <ShieldCheck className={`w-5 h-5 shrink-0 ${formData.role === 'ADMIN' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`} />
                      <div className="flex flex-col">
                        <span className={`text-sm font-bold ${formData.role === 'ADMIN' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                          Administrador
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Gestión de inventario y personal.</span>
                      </div>
                    </label>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#ededed] dark:border-[#333]">
            <button 
              type="submit" 
              disabled={loading}
              className="bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white dark:border-black/30 dark:border-t-black rounded-full animate-spin" />
                  Guardando cambios...
                </>
              ) : (
                "Guardar Cambios"
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
