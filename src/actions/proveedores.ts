"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// --- SCHEMAS DE VALIDACIÓN ---

// Schema base para crear y actualizar
const baseSchema = z.object({
  codigo: z.string()
    .min(1, "El código es obligatorio")
    .max(20, "Máximo 20 caracteres")
    .trim(),
  razonSocial: z.string().min(1, "La Razón Social es obligatoria"),
  contacto: z.string().optional(),
  telefono: z.string()
    .trim()
    .min(1, "El teléfono es obligatorio")
    .refine((val) => /^\+?[0-9\s-]+$/.test(val), {
      message: "Solo números, espacios, guiones o +",
    }),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
});

// Schema específico para actualizar (necesita ID)
const updateSchema = baseSchema.extend({
  id: z.string(),
});

// --- TIPOS ---
export type State = {
  errors?: {
    codigo?: string[];
    razonSocial?: string[];
    contacto?: string[];
    telefono?: string[];
    email?: string[];
  };
  message?: string | null;
  payload?: any;
};

// --- ACCIONES ---

export async function crearProveedor(prevState: State, formData: FormData) {
  const rawData = {
    codigo: formData.get("codigo") as string,
    razonSocial: formData.get("razonSocial") as string,
    contacto: formData.get("contacto") as string,
    telefono: formData.get("telefono") as string,
    email: formData.get("email") as string,
  };

  const validatedFields = baseSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Faltan datos obligatorios o son incorrectos.",
      payload: rawData,
    };
  }

  try {
    const existeCodigo = await prisma.proveedor.findUnique({
        where: { codigo: validatedFields.data.codigo }
    });

    if (existeCodigo) {
        return {
            errors: { codigo: ["Este código ya existe."] },
            message: "El código de proveedor ya está registrado.",
            payload: rawData
        };
    }

    await prisma.proveedor.create({
      data: {
        codigo: validatedFields.data.codigo,
        razonSocial: validatedFields.data.razonSocial,
        contacto: validatedFields.data.contacto || null,
        telefono: validatedFields.data.telefono,
        email: validatedFields.data.email || null,
      },
    });
  } catch (error) {
    console.error("Error al crear:", error);
    return {
      message: "Error de base de datos. Intente nuevamente.",
      payload: rawData,
    };
  }

  revalidatePath("/proveedores");
  redirect("/proveedores");
}

export async function actualizarProveedor(prevState: State, formData: FormData) {
  const rawData = {
    id: formData.get("id") as string,
    codigo: formData.get("codigo") as string,
    razonSocial: formData.get("razonSocial") as string,
    contacto: formData.get("contacto") as string,
    telefono: formData.get("telefono") as string,
    email: formData.get("email") as string,
  };

  const validatedFields = updateSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Por favor revise los errores en el formulario.",
      payload: rawData,
    };
  }

  const idNumerico = parseInt(validatedFields.data.id);

  try {
    // Verificar si el código ya existe en OTRO proveedor (excluyendo el actual)
    const existeCodigo = await prisma.proveedor.findFirst({
        where: { 
            codigo: validatedFields.data.codigo,
            NOT: { id: idNumerico }
        }
    });

    if (existeCodigo) {
        return {
            errors: { codigo: ["Este código ya pertenece a otro proveedor."] },
            message: "Conflicto de duplicidad.",
            payload: rawData
        };
    }

    await prisma.proveedor.update({
      where: { id: idNumerico },
      data: {
        codigo: validatedFields.data.codigo,
        razonSocial: validatedFields.data.razonSocial,
        contacto: validatedFields.data.contacto || null,
        telefono: validatedFields.data.telefono,
        email: validatedFields.data.email || null,
      },
    });
  } catch (error) {
    console.error("Error al actualizar:", error);
    return {
      message: "No se pudo actualizar la base de datos.",
      payload: rawData,
    };
  }

  revalidatePath("/proveedores");
  redirect("/proveedores");
}

export async function eliminarProveedor(formData: FormData) {
  const id = parseInt(formData.get("id") as string);

  if (!id) throw new Error("ID inválido");

  try {
    await prisma.proveedor.delete({
      where: { id },
    });
  } catch (error) {
    console.error("Error al eliminar:", error);
    throw new Error("No se pudo eliminar el proveedor.");
  }

  revalidatePath("/proveedores");
  redirect("/proveedores");
}

export async function obtenerProveedores(query: string = "", sort: string = "") {
  try {
    let orderBy: any = { id: 'desc' };

    switch (sort) {
      case "Contacto-asc": orderBy = { contacto: 'asc'}; break;
      case "Contacto-desc": orderBy = { contacto: 'desc'}; break;
      case "razon-social-asc": orderBy = { razonSocial: 'asc' }; break;
    }

    const proveedores = await prisma.proveedor.findMany({
      where: {
        OR: [
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
    return [];
  }
}