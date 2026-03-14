import { obtenerHistorialVentas } from "@/actions/ventas";
import HistorialVentas from "@/components/Historial/HistorialVentas";
import { getSession } from "@/lib/session";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function HistorialPage({ searchParams }: { searchParams: { empleado?: string } }) {
  const session = await getSession();
  const isAdmin = session?.role === "ADMIN";
  
  const empleadoId = searchParams.empleado ? parseInt(searchParams.empleado, 10) : undefined;
  const ventas = await obtenerHistorialVentas(empleadoId);

  let empleadoNombre = null;
  if (empleadoId) {
    const empleado = await (prisma.user as any).findUnique({ where: { id: empleadoId } });
    if (empleado) empleadoNombre = empleado.name || empleado.username;
  }

  return (
    <HistorialVentas 
      ventasIniciales={ventas} 
      isAdmin={isAdmin} 
      empleadoNombre={empleadoNombre}
    />
  );
}