"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function crearCategoria(nombre: string) {
  try {
    // Validamos que no esté vacío
    if (!nombre || nombre.trim().length === 0) {
      return { success: false, message: "El nombre no puede estar vacío" };
    }

    // Guardamos en la BD
    await prisma.categoria.create({
      data: {
        nombre: nombre.trim(), // Limpiamos espacios
      },
    });

    // Actualizamos la página para que el nuevo tipo aparezca en el dropdown
    revalidatePath("/inventario/agregar");
    
    return { success: true, message: "Categoría creada con éxito" };

  } catch (error) {
    console.error(error);
    return { success: false, message: "Error: La categoría ya existe o hubo un problema." };
  }
}

// También necesitaremos esto para llenar el Dropdown luego
export async function obtenerCategorias() {
  try {
    return await prisma.categoria.findMany({
      orderBy: { nombre: 'asc' }
    });
  } catch (error) {
    return [];
  }
}