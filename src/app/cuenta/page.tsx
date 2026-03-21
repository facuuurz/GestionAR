import { getSession } from "@/lib/session";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { Shield, User, Building, Phone, MapPin, Mail, Calendar, UserCheck, CreditCard, Hash, Pencil } from "lucide-react";
import Link from "next/link";
import ProfilePicture from "./ProfilePicture";

const prisma = new PrismaClient();

export const metadata = {
  title: "Mi Cuenta | GestionAR",
};

export default async function CuentaPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // Fetch complete user data including their creator (encargado)
  const user = await (prisma.user as any).findUnique({
    where: { id: session.userId },
    include: {
      createdBy: {
        select: { id: true, name: true, username: true, role: true }
      }
    }
  });

  if (!user) {
    redirect("/login");
  }

  const isAdmin = user.role === "ADMIN" || user.role === "SUPERADMIN";

  return (
    <div className="px-4 sm:px-10 md:px-20 lg:px-40 flex flex-1 justify-center py-8">
      <div className="layout-content-container flex flex-col max-w-4xl flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Cabecera */}
        <div className="flex flex-col gap-2 pb-8">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-primary dark:text-white text-3xl sm:text-4xl font-bold leading-tight flex items-center gap-3">
              <User className="w-8 h-8 md:w-10 md:h-10 text-blue-500" />
              Mi Cuenta
            </h1>
            <Link
              href={`/empleados/editar/${user.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#222] text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#333] transition-all duration-200 shadow-sm hover:scale-105 active:scale-95 shrink-0"
            >
              <Pencil className="w-4 h-4" />
              Editar cuenta
            </Link>
          </div>
          <p className="text-neutral-500 dark:text-neutral-400 text-base md:text-lg">
            Gestiona la información de tu perfil y credenciales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Tarjeta de Perfil Principal */}
          <div className="md:col-span-1 bg-white dark:bg-[#222] border border-[#ededed] dark:border-[#333] rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
            <ProfilePicture 
              userId={user.id}
              initials={user.name?.charAt(0).toUpperCase() || user.username.charAt(0).toUpperCase()}
              currentPicture={user.profilePicture}
            />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{user.name || "Sin nombre"}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
            
            <div className="mt-4 px-4 py-1.5 rounded-full bg-gray-100 dark:bg-[#333] border border-gray-200 dark:border-gray-700 flex items-center gap-2 text-sm font-medium">
              <Shield className={`w-4 h-4 ${user.role === "SUPERADMIN" ? "text-purple-500" : isAdmin ? "text-blue-500" : "text-green-500"}`} />
              {user.role === "SUPERADMIN" ? "Super Admin" : isAdmin ? "Administrador" : "Empleado"}
            </div>
            
            <div className="mt-8 border-t border-gray-200 dark:border-gray-800 w-full pt-4">
              <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> Ingreso</span>
                <span>{new Date(user.createdAt).toLocaleDateString("es-AR")}</span>
              </div>
            </div>
          </div>

          {/* Detalles e Información Adicional */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Información Personal */}
            <div className="bg-white dark:bg-[#222] border border-[#ededed] dark:border-[#333] rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                Información Personal
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg shrink-0">
                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Nombre completo</p>
                    <p className="text-base text-gray-900 dark:text-white">{user.name || "No especificado"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg shrink-0">
                    <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Correo Electrónico</p>
                    <p className="text-base text-gray-900 dark:text-white">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg shrink-0">
                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Nombre de Usuario</p>
                    <p className="text-base text-gray-900 dark:text-white">@{user.username}</p>
                  </div>
                </div>

                {/* DNI - visible para todos */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg shrink-0">
                    <Hash className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">DNI</p>
                    <p className="text-base text-gray-900 dark:text-white">{user.dni || "No especificado"}</p>
                  </div>
                </div>

                {/* CUIT - visible para todos */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg shrink-0">
                    <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">CUIT / CUIL</p>
                    <p className="text-base text-gray-900 dark:text-white">{user.cuit || "No especificado"}</p>
                  </div>
                </div>

                {/* Encargado - solo si no es SUPERADMIN y tiene un creador */}
                {user.role !== "SUPERADMIN" && user.createdBy && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-50 dark:bg-purple-500/10 rounded-lg shrink-0">
                      <UserCheck className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Encargado</p>
                      <p className="text-base text-gray-900 dark:text-white">
                        {user.createdBy.name || user.createdBy.username}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {user.createdBy.role === "SUPERADMIN" ? "Super Admin" : user.createdBy.role === "ADMIN" ? "Administrador" : "Empleado"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Información del Local (Solo Admin) */}
            {isAdmin && (
              <div className="bg-white dark:bg-[#222] border border-[#ededed] dark:border-[#333] rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Información del Negocio</h3>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg shrink-0">
                      <Building className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Nombre del Local</p>
                      <p className="text-base text-gray-900 dark:text-white">{user.localName || "No especificado"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg shrink-0">
                      <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Dirección</p>
                      <p className="text-base text-gray-900 dark:text-white">{user.address || "No especificada"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 sm:col-span-2">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg shrink-0">
                      <Phone className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Teléfono</p>
                      <p className="text-base text-gray-900 dark:text-white">{user.phone || "No especificado"}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}


          </div>

        </div>
      </div>
    </div>
  );
}
