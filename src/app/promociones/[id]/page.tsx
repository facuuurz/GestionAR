import { obtenerPromocionPorId } from "@/actions/promociones";
import { notFound } from "next/navigation";

// Componentes extraídos
import EncabezadoDetallePromocion from "@/components/promociones/EncabezadoDetallePromocion";
import InfoPromocion from "@/components/promociones/InfoPromocion";

export default async function DetallePromocionPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = parseInt(params.id);
  
  // Solicitud al servidor
  const promocion = await obtenerPromocionPorId(id);

  if (!promocion) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F3F4F6] dark:bg-[#0B1120] text-slate-900 dark:text-slate-200 font-sans transition-colors duration-200">
      <main className="flex-1 flex flex-col items-center py-8 px-5 md:px-10 lg:px-20 w-full">
        <div className="w-full max-w-300 flex flex-col gap-8">
          
          <EncabezadoDetallePromocion id={promocion.id} nombre={promocion.nombre} />

          <InfoPromocion promocion={promocion} />

        </div>
      </main>
    </div>
  );
}