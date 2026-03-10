import { obtenerClientePorId, obtenerMovimientosCliente } from "@/actions/cuentas-corrientes";
import { notFound } from "next/navigation";

// COMPONENTES EXTRAÍDOS
import EncabezadoDetalleCuenta from "@/components/Cuentas-corrientes/EncabezadoDetalleCuenta";
import InfoCuentaCliente from "@/components/Cuentas-corrientes/InfoCuentaCliente";
import HistorialCliente from "@/components/Cuentas-corrientes/historial-cliente"; 

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function DetalleClientePage({ params }: PageProps) {
  const { id } = await params;
  
  const clienteId = parseInt(id);
  if (isNaN(clienteId)) return notFound();

  // 1. Cargar Cliente y Movimientos en paralelo (Server-side)
  const [cliente, movimientos] = await Promise.all([
    obtenerClientePorId(clienteId),
    obtenerMovimientosCliente(clienteId)
  ]);

  if (!cliente) return notFound();

  // 2. Renderizado del Orquestador
  return (
    <div className="flex flex-col min-h-screen bg-[#f6f7f8] dark:bg-[#101922] text-[#111318] dark:text-white font-display">
      <main className="flex-1 px-4 md:px-10 py-8 max-w-300 mx-auto w-full flex flex-col gap-6">
        
        <EncabezadoDetalleCuenta clienteId={cliente.id} nombreCliente={cliente.nombre} />

        <InfoCuentaCliente cliente={cliente} />

        <HistorialCliente 
          movimientos={movimientos} 
          cliente={{ 
            nombre: cliente.nombre, 
            cuit: cliente.cuit || "Sin CUIT" 
          }} 
        />

      </main>
    </div>
  );
}