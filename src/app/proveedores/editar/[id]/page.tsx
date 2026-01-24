import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import EditarProveedorForm from "@/components/Proveedores/EditarProveedorForm";

export default async function EditarProveedorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const idNumerico = parseInt(id);

  if (isNaN(idNumerico)) {
    redirect("/proveedores");
  }

  // Obtenemos los datos del servidor
  const proveedor = await prisma.proveedor.findUnique({
    where: { id: idNumerico },
  });

  if (!proveedor) {
    redirect("/proveedores");
  }

  // Se los pasamos al componente cliente
  return <EditarProveedorForm proveedor={proveedor} />;
}