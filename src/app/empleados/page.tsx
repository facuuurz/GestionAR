import { getSession } from "@/lib/session";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, Plus } from "lucide-react";
import EmployeeListClient from "./EmployeeListClient";

const prisma = new PrismaClient();

export const metadata = {
  title: "Gestión de Empleados | GestionAR",
};

export default async function EmpleadosPage() {
  const session = await getSession();

  if (!session || (session.role !== "ADMIN" && session.role !== "SUPERADMIN")) {
    redirect("/");
  }

  // Si es SUPERADMIN ve todos los usuarios. Si es ADMIN, solo ve los creados por él mismo.
  const whereClause = session.role === "SUPERADMIN" ? {} : { createdById: session.userId };

  const empleados = await (prisma.user as any).findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="px-4 sm:px-10 md:px-20 lg:px-40 flex flex-1 justify-center py-8">
      <div className="layout-content-container flex flex-col w-full max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Cabecera */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-primary dark:text-white text-3xl sm:text-4xl font-bold leading-tight flex items-center gap-3">
              <Users className="w-8 h-8 md:w-10 md:h-10 text-black dark:text-white" />
              Gestión de Usuarios
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-base md:text-lg">
              Administra el personal, accesos y su historial.
            </p>
          </div>
          
          <Link href="/empleados/nuevo" className="flex items-center gap-2 bg-black hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 text-white px-5 py-2.5 rounded-[12px] font-semibold transition-colors shadow-lg">
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Nuevo Usuario</span>
          </Link>
        </div>

        <EmployeeListClient empleados={empleados} currentUserRole={session.role} />
        
      </div>
    </div>
  );
}
