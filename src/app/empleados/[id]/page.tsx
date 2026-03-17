import { getSession } from "@/lib/session";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Key, ShoppingCart, Calendar, Mail, Building, Clock } from "lucide-react";

// For Next.js 14 params are synchronous but in recent versions it can be a Promise
// So we use standard Next.js 14 Page props or modern ones
interface PageProps {
  params: Promise<{ id: string }>;
}

const prisma = new PrismaClient();

export default async function EmpleadoDetallePage({ params }: PageProps) {
  const session = await getSession();
  const awaitedParams = await params;

  if (!session || (session.role !== "ADMIN" && session.role !== "SUPERADMIN")) {
    redirect("/");
  }

  const employeeId = parseInt(awaitedParams.id, 10);

  if (isNaN(employeeId)) {
    redirect("/empleados");
  }

  const empleado = await (prisma.user as any).findUnique({
    where: { id: employeeId, role: "EMPLEADO" }
  });

  if (!empleado) {
    redirect("/empleados");
  }

  const cantidadVentas = await (prisma.venta as any).count({
    where: { userId: employeeId }
  });

  return (
    <div className="px-4 sm:px-10 md:px-20 lg:px-40 flex flex-1 justify-center py-8">
      <div className="layout-content-container flex flex-col w-full max-w-5xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Cabecera y Back Button */}
        <div className="flex flex-col gap-6 pb-6 border-b border-[#ededed] dark:border-[#333] mb-8">
          <Link href="/empleados" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 w-fit transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Volver a la lista
          </Link>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {empleado.name?.charAt(0).toUpperCase() || empleado.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-primary dark:text-white text-2xl sm:text-3xl font-bold leading-tight flex items-center gap-3">
                  {empleado.name || "Empleado sin nombre"}
                </h1>
                <p className="text-neutral-500 dark:text-neutral-400 text-base">
                  @{empleado.username}
                </p>
              </div>
            </div>
            
            <button className="flex items-center gap-2 bg-white dark:bg-[#222] border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-xl font-medium transition-all shadow-sm">
              <Key className="w-5 h-5 text-indigo-500" />
              Cambiar contraseña
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Tarjeta de Información General */}
          <div className="bg-white dark:bg-[#222] border border-[#ededed] dark:border-[#333] rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Información General</h3>
            
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 rounded-xl shrink-0">
                  <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nombre Completo</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white mt-0.5">{empleado.name || "—"}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 rounded-xl shrink-0">
                  <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Correo Electrónico</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white mt-0.5">{empleado.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 rounded-xl shrink-0">
                  <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">DNI / Documento</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white mt-0.5">{empleado.dni || "—"}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-blue-50 dark:bg-blue-500/10 rounded-xl shrink-0">
                  <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">CUIT / CUIL</p>
                  <p className="text-base font-medium text-gray-900 dark:text-white mt-0.5">{empleado.cuit || "—"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta de Actividad y Ventas (Datos Ocultos) */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#222] border border-[#ededed] dark:border-[#333] rounded-2xl p-6 shadow-sm">
               <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Actividad y Registros</h3>
               
               <div className="space-y-5">
                 <div className="flex items-start gap-4">
                   <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl shrink-0">
                     <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                   </div>
                   <div>
                     <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha de Ingreso (Antigüedad)</p>
                     <p className="text-base font-medium text-gray-900 dark:text-white mt-0.5">
                       {new Date(empleado.seniorityDate || empleado.createdAt).toLocaleDateString("es-AR", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                     </p>
                   </div>
                 </div>

                 <div className="flex items-start gap-4">
                   <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl shrink-0">
                     <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                   </div>
                   <div>
                     <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Última Vez Activo</p>
                     <p className="text-base font-medium text-gray-900 dark:text-white mt-0.5">
                       {empleado.lastActive 
                          ? new Date(empleado.lastActive).toLocaleString("es-AR", { dateStyle: "full", timeStyle: "short" }) 
                          : "Nunca se ha conectado"}
                     </p>
                   </div>
                 </div>
               </div>
            </div>

            {/* Rendimiento - Ventas */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
                <ShoppingCart className="w-32 h-32 text-white" />
              </div>
              <div className="relative z-10 text-white flex flex-col h-full justify-between">
                <div>
                  <h3 className="text-lg font-medium text-indigo-100 mb-1">Rendimiento Operativo</h3>
                  <div className="flex items-baseline gap-2 mt-4">
                    <span className="text-5xl font-extrabold">{cantidadVentas}</span>
                    <span className="text-lg text-indigo-100 font-medium tracking-wide">Ventas</span>
                  </div>
                </div>
                
                <Link 
                  href={`/historial-ventas?empleado=${empleado.id}`}
                  className="mt-8 flex items-center justify-between bg-white/10 hover:bg-white/20 px-4 py-3 rounded-xl transition-colors font-semibold backdrop-blur-sm"
                >
                  Cantidad de ventas realizadas
                  <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
