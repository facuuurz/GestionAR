"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function obtenerProveedores(query: string = "") {
  try {
    const proveedores = await prisma.proveedor.findMany({
      where: {
        OR: [
          // Filtra por cualquiera de estos campos:
          { razonSocial: { contains: query, mode: 'insensitive' } },
          { codigo: { contains: query, mode: 'insensitive' } },
          { contacto: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { id: 'desc' },
    });
    return proveedores;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function crearProveedor(formData: FormData) {
  const codigo = formData.get("codigo") as string;
  const razonSocial = formData.get("razon_social") as string;
  const contacto = formData.get("contacto") as string;
  const telefono = formData.get("telefono") as string;
  const email = formData.get("email") as string;
  const estado = formData.get("estado") as string; // "Activo", "Inactivo", "Pendiente".

  // Validación básica
  if (!razonSocial || !codigo) {
    throw new Error("El código y la razón social son obligatorios");
  }

  try {
    await prisma.proveedor.create({
      data: {
        codigo,
        razonSocial,
        contacto,
        telefono,
        email,
        estado,
      },
    });
  } catch (error) {
    console.error("Error al crear proveedor:", error);
    throw new Error("Error al guardar en la base de datos");
  }

  // Actualiza la lista
  revalidatePath("/proveedores");
  redirect("/proveedores");
}

export async function actualizarProveedor(formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  const razonSocial = formData.get("razon_social") as string;
  const contacto = formData.get("contacto") as string;
  const telefono = formData.get("telefono") as string;
  const email = formData.get("email") as string;
  const estado = formData.get("estado") as string;

  if (!id) throw new Error("ID de proveedor no válido");

  try {
    await prisma.proveedor.update({
      where: { id },
      data: {
        razonSocial,
        contacto,
        telefono,
        email,
        estado,
      },
    });
  } catch (error) {
    console.error("Error al actualizar proveedor:", error);
    throw new Error("No se pudo actualizar el proveedor");
  }

  revalidatePath("/proveedores");
  redirect("/proveedores");
}

export async function eliminarProveedor(formData: FormData) {
  const id = parseInt(formData.get("id") as string);

  if (!id) throw new Error("ID de proveedor no válido");

  try {
    await prisma.proveedor.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error al eliminar proveedor:", error);
    // Manejar error si tiene productos asociados
    throw new Error("No se puede eliminar este proveedor");
  }

  revalidatePath("/proveedores");
  redirect("/proveedores");
}


