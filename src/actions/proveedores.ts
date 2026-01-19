"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";


const proveedorSchema = z.object({
  // AHORA EL CÓDIGO ES OBLIGATORIO Y MANUAL
  codigo: z.string()
    .min(1, "El código es obligatorio")
    .max(20, "El código no puede tener más de 20 caracteres")
    .trim(),

  razonSocial: z.string().min(1, "La Razón Social es obligatoria"),
  
  contacto: z.string().optional(),
  
  telefono: z.string()
    .trim()
    .refine((val) => val === "" || /^\+?[0-9]+$/.test(val), {
      message: "Solo números (ej: 112233) o + al inicio",
    })
    .optional(),
  
  email: z.string().email("Email inválido").optional().or(z.literal("")),
});

export type State = {
  errors?: {
    codigo?: string[]; // Agregamos error de código
    razonSocial?: string[];
    contacto?: string[];
    telefono?: string[];
    email?: string[];
  };
  message?: string | null;
  payload?: any;
};

export async function crearProveedor(prevState: State, formData: FormData) {
  const rawData = {
    codigo: formData.get("codigo") as string, // Leemos el código del form
    razonSocial: formData.get("razonSocial") as string,
    contacto: formData.get("contacto") as string,
    telefono: formData.get("telefono") as string,
    email: formData.get("email") as string,
  };

  const validatedFields = proveedorSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Faltan datos o son incorrectos.",
      payload: rawData,
    };
  }

  try {
    // Verificamos si el código ya existe para evitar error de Prisma
    const existeCodigo = await prisma.proveedor.findUnique({
        where: { codigo: validatedFields.data.codigo }
    });

    if (existeCodigo) {
        return {
            errors: { codigo: ["Este código ya existe, use otro."] },
            message: "El código de proveedor ya está registrado.",
            payload: rawData
        };
    }

    await prisma.proveedor.create({
      data: {
        codigo: validatedFields.data.codigo, // Usamos el manual
        razonSocial: validatedFields.data.razonSocial,
        contacto: validatedFields.data.contacto || null,
        telefono: validatedFields.data.telefono || null,
        email: validatedFields.data.email || null,
      },
    });
  } catch (error) {
    console.error("Error al crear proveedor:", error);
    return {
      message: "Error de base de datos. Intente nuevamente.",
      payload: rawData,
    };
  }

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

  if (!id) throw new Error("ID de proveedor no válido");

  try {
    await prisma.proveedor.update({
      where: { id },
      data: {
        razonSocial,
        contacto,
        telefono,
        email,
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


