import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

// Componentes
import EncabezadoDetalle from "@/components/Proveedores/EncabezadoDetalle";
import InfoProveedor from "@/components/Proveedores/InfoProveedor";
import TablaProductosAsociados from "@/components/Proveedores/TablaProductosAsociados";

export default async function DetalleProveedorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idNumerico = parseInt(id);

  //  Obtener datos del proveedor
  const proveedor = await prisma.proveedor.findUnique({
    where: { id: idNumerico },
  });

  if (!proveedor) {
    redirect("/proveedores");
  }

  const productosAsociadosRaw = await prisma.producto.findMany({
    where: {
      proveedor: proveedor.codigo, 
    },
    orderBy: { id: "desc" },
  });

  const productosAsociados = productosAsociadosRaw.map((prod) => ({
    ...prod,
    precio: Number(prod.precio),
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#101622] text-gray-900 dark:text-gray-100 font-sans pb-20">
      <main className="pt-8 pb-12 px-6 max-w-[1600px] mx-auto">
        
        <EncabezadoDetalle 
          proveedorId={proveedor.id} 
          razonSocial={proveedor.razonSocial} 
        />

        <InfoProveedor 
          proveedor={proveedor} 
        />

        <TablaProductosAsociados 
          productos={productosAsociados} 
          codigoProveedor={proveedor.codigo} 
        />

      </main>
    </div>
  );
}