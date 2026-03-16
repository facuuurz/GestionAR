"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UserPlus, ShieldCheck, User } from "lucide-react";
import { registerUser } from "@/actions/auth"; // We'll modify or create an action for this

export default function NewUserForm({ currentUserRole }: { currentUserRole: string }) {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "EMPLEADO", // Default
  });
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const res = await registerUser(
        formData.username,
        formData.password,
        formData.email,
        formData.name,
        formData.role
      );

      if (!res.success) {
        setError(res.error || "Ocurrió un error al registrar el usuario");
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
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-lg">
              <UserPlus className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-primary dark:text-white text-2xl sm:text-3xl font-bold leading-tight">
                Crear Nuevo Usuario
              </h1>
              <p className="text-neutral-500 dark:text-neutral-400 text-base">
                Completa los datos para dar acceso a un nuevo integrante.
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
              <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-[#ededed] dark:border-[#333] pb-2">Datos de Acceso</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre de Usuario *</label>
                <input 
                  type="text" 
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full px-3 py-2.5 border border-[#ededed] dark:border-[#444] rounded-xl bg-gray-50 dark:bg-[#111] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="ej: jdoe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contraseña Inicial *</label>
                <input 
                  type="password" 
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-3 py-2.5 border border-[#ededed] dark:border-[#444] rounded-xl bg-gray-50 dark:bg-[#111] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirmar Contraseña *</label>
                <input 
                  type="password" 
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className="w-full px-3 py-2.5 border border-[#ededed] dark:border-[#444] rounded-xl bg-gray-50 dark:bg-[#111] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-[#ededed] dark:border-[#333] pb-2">Información Personal</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre Completo *</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2.5 border border-[#ededed] dark:border-[#444] rounded-xl bg-gray-50 dark:bg-[#111] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="Juan Pérez"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Correo Electrónico *</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2.5 border border-[#ededed] dark:border-[#444] rounded-xl bg-gray-50 dark:bg-[#111] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  placeholder="juan@ejemplo.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nivel de Acceso *</label>
                
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <label className={`
                    relative flex flex-col p-4 cursor-pointer rounded-xl border-2 transition-all
                    ${formData.role === 'EMPLEADO' 
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20' 
                      : 'border-[#ededed] dark:border-[#444] hover:bg-gray-50 dark:hover:bg-[#333]'}
                  `}>
                    <input 
                      type="radio" 
                      name="role" 
                      value="EMPLEADO" 
                      className="peer sr-only"
                      onChange={() => setFormData({...formData, role: "EMPLEADO"})}
                      checked={formData.role === "EMPLEADO"}
                    />
                    <User className={`w-6 h-6 mb-2 ${formData.role === 'EMPLEADO' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`} />
                    <span className={`text-sm font-bold ${formData.role === 'EMPLEADO' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                      Empleado
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Acceso limitado al punto de venta.</span>
                  </label>

                  {/* Solamente los administradores pueden crear a otros administradores o los superadmin */}
                  {(currentUserRole === "ADMIN" || currentUserRole === "SUPERADMIN") && (
                    <label className={`
                      relative flex flex-col p-4 cursor-pointer rounded-xl border-2 transition-all
                      ${formData.role === 'ADMIN' 
                        ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-900/20' 
                        : 'border-[#ededed] dark:border-[#444] hover:bg-gray-50 dark:hover:bg-[#333]'}
                    `}>
                      <input 
                        type="radio" 
                        name="role" 
                        value="ADMIN" 
                        className="peer sr-only"
                        onChange={() => setFormData({...formData, role: "ADMIN"})}
                        checked={formData.role === "ADMIN"}
                      />
                      <ShieldCheck className={`w-6 h-6 mb-2 ${formData.role === 'ADMIN' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'}`} />
                      <span className={`text-sm font-bold ${formData.role === 'ADMIN' ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                        Administrador
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">Gestión de inventario y personal.</span>
                    </label>
                  )}
                </div>
              </div>
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
                  Creando usuario...
                </>
              ) : (
                "Crear Usuario"
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
