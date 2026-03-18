import { UserMinus, ArrowLeft, Shield, Mail, Calendar } from "lucide-react";
import Link from "next/link";

export default function DeletedUserPage({
  searchParams,
}: {
  searchParams: { nombre?: string; email?: string; role?: string };
}) {
  const nombre = searchParams.nombre || "Usuario Desconocido";
  const email = searchParams.email || "Sin email";
  const role = searchParams.role || "EMPLEADO";
  const fecha = new Date().toLocaleDateString("es-AR", { day: '2-digit', month: 'long', year: 'numeric' });

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto mt-8 relative">
      <Link 
        href="/empleados"
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a empleados
      </Link>

      <div className="bg-white dark:bg-[#222] border border-red-500/30 rounded-3xl p-8 shadow-xl shadow-red-500/5 relative overflow-hidden">
        
        {/* Decorative background circle */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-red-100 dark:bg-red-900/10 rounded-full blur-3xl opacity-50 z-0"></div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mb-5 ring-8 ring-red-50/50 dark:ring-red-500/5">
            <UserMinus className="w-10 h-10 text-red-500" />
          </div>
          
          <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Usuario Eliminado</h1>
          <p className="text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
            El perfil que estás intentando visualizar pertenece a una cuenta que ya no existe en el sistema.
          </p>

          <div className="w-full bg-[#f8f9fa] dark:bg-[#1a1a1a] rounded-2xl p-6 border border-[#ededed] dark:border-[#333] mb-6">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 border-b border-[#ededed] dark:border-[#333] pb-2 text-left">
              Último registro conocido
            </h3>
            
            <div className="space-y-4 text-left">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2">
                  <UserMinus className="w-4 h-4" /> Nombre
                </span>
                <span className="text-gray-900 dark:text-white font-bold">{nombre}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Email
                </span>
                <span className="text-gray-900 dark:text-white font-bold">{email}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Rol Histórico
                </span>
                <span className="bg-gray-200 dark:bg-[#333] text-gray-800 dark:text-gray-200 px-2 py-0.5 rounded text-xs font-bold">
                  {role}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Fecha de Consulta
                </span>
                <span className="text-gray-900 dark:text-white font-medium">{fecha}</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
