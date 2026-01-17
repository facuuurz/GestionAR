"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";


const proveedorSchema = z.object({
  razonSocial: z.string().min(1, "La Razón Social es obligatoria"),
  
  // Opcionales (permiten string vacío o null)
  contacto: z.string().optional(),
  
  telefono: z.string()
    .trim() // Quitamos espacios accidentales al inicio/final
    .refine((val) => val === "" || /^\+?[0-9]+$/.test(val), {
      message: "El teléfono solo puede contener números (ej: 115555) o + al inicio (ej: +54911...)",
    })
    .optional(),
  
  email: z.string()
    .email("El formato del email no es válido")
    .optional()
    .or(z.literal("")), // Permite dejarlo vacío
});

// 2. Definición del Estado
export type State = {
  errors?: {
    razonSocial?: string[];
    contacto?: string[];
    telefono?: string[];
    email?: string[];
  };
  message?: string | null;
  payload?: any; // Para no borrar lo que escribió el usuario si hay error
};

// 3. Función Crear Proveedor
export async function crearProveedor(prevState: State, formData: FormData) {
  
  // Extraemos datos
  const rawData = {
    razonSocial: formData.get("razonSocial") as string,
    contacto: formData.get("contacto") as string,
    telefono: formData.get("telefono") as string,
    email: formData.get("email") as string,
  };

  // Validamos
  const validatedFields = proveedorSchema.safeParse(rawData);

  // Si hay error, devolvemos los mensajes y lo que escribió
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Faltan datos o son incorrectos. Revise el formulario.",
      payload: rawData,
    };
  }

  try {
    // Generamos un código automático (Ej: PROV-1234)
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const codigoGenerado = `PROV-${randomCode}`;

    await prisma.proveedor.create({
      data: {
        codigo: codigoGenerado,
        razonSocial: validatedFields.data.razonSocial,
        contacto: validatedFields.data.contacto || null,
        telefono: validatedFields.data.telefono || null,
        email: validatedFields.data.email || null,
        estado: "Activo", // Valor por defecto
      },
    });
  } catch (error) {
    console.error("Error al crear proveedor:", error);
    return {
      message: "Error interno: No se pudo crear el proveedor.",
      payload: rawData,
    };
  }

  // Éxito
  revalidatePath("/proveedores");
  redirect("/proveedores");
}

export async function obtenerProveedores(query: string = "", sort: string = "") {
  try {
    let orderBy: any = { id: 'desc' }; // Por defecto: Más recientes

    switch (sort) {
      case "Contacto-asc":
        orderBy = { contacto: 'asc'}; 
        break;
      case "Contacto-desc":
        orderBy = { contacto: 'desc'};
        break;
      
      // Si el usuario elige "Razón Social" explícitamente
      case "razon-social-asc":
        orderBy = { razonSocial: 'asc' }; 
        break;
    }

    const proveedores = await prisma.proveedor.findMany({
      where: {
        OR: [
          // Buscamos en Razón Social, Contacto y Email (ya no en nombre)
          { razonSocial: { contains: query, mode: 'insensitive' } },
          { contacto: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { codigo: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: orderBy,
    });
    return proveedores;
  } catch (error) {
    console.error("Error al obtener proveedores:", error);
    return [];
  }
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


