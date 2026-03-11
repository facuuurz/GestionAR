import LinkBoton from "@/components/promociones/ui/LinkBoton";
import Breadcrumbs from "@/components/promociones/ui/Breadcrumbs";

export default function EncabezadoPromociones() {
  
  // Definimos la ruta de las migas de pan
  const breadcrumbItems = [
    { label: "Panel", href: "/" },
    { label: "Promociones" } // El actual no lleva href
  ];

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />

      {/* Encabezado y Botón */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div className="flex flex-col gap-1">
          <h1 className="text-slate-900 dark:text-white tracking-tight text-[32px] font-bold leading-tight">
            Listado de Promociones
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-normal">
            Gestiona tus ofertas activas, precios promocionales y vigencias.
          </p>
        </div>
        
        {/* Botón Atómico */}
        <LinkBoton 
          href="/promociones/nuevo"
          texto="Nueva Promoción"
          icono="add"
        />
      </div>
    </>
  );
}