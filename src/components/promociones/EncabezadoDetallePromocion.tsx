import LinkBoton from "@/components/promociones/ui/LinkBoton";
import Breadcrumbs from "@/components/promociones/ui/Breadcrumbs";

interface Props {
  id: number;
  nombre: string;
}

export default function EncabezadoDetallePromocion({ id, nombre }: Props) {
  
  // Definimos la ruta de las migas de pan de forma limpia
  const breadcrumbItems = [
    { label: "Panel", href: "/" },
    { label: "Promociones", href: "/promociones" },
    { label: nombre } // El último no lleva href
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        
        <div className="flex flex-col gap-1">
          <h1 className="text-slate-900 dark:text-white text-3xl md:text-4xl font-bold tracking-tight">
            {nombre}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-base font-normal">
            Detalles de la campaña promocional y estado actual del inventario.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <LinkBoton 
            href={`/promociones/editar/${id}`}
            texto="Editar Promoción"
            icono="edit"
          />
        </div>

      </div>
    </>
  );
}