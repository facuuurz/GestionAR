"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { logger } from "@/lib/logger";
import { createNotification } from "@/lib/notifications";

// --- SCHEMA DE VALIDACIÓN ---
const proveedorSchema = z.object({
  codigo: z.string()
    .min(1, "El código es obligatorio")
    .max(20, "El código no puede tener más de 20 caracteres")
    .trim(),
  razonSocial: z.string().min(4, "La Razón Social debe tener al menos 4 caracteres"),
  contacto: z.string()
    .min(4, "El contacto debe tener al menos 4 caracteres")
    .max(50, "El contacto no puede tener más de 50 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/, "El contacto solo puede contener letras y espacios"),
  telefono: z.string()
    .trim()
    .min(1, "El teléfono es obligatorio")
    .refine((val) => /^\+?[0-9]+$/.test(val), {
      message: "Solo números (ej: 112233) o + al inicio",
    }),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
});

const actualizacionProveedorSchema = z.object({
  razonSocial: z.string().min(4, "La Razón Social debe tener al menos 4 caracteres"),
  contacto: z.string()
    .min(4, "El contacto debe tener al menos 4 caracteres")
    .max(50, "El contacto no puede tener más de 50 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/, "El contacto solo puede contener letras y espacios"),
  telefono: z.string()
    .trim()
    .min(1, "El teléfono es obligatorio")
    .refine((val) => /^\+?[0-9]+$/.test(val), {
      message: "Solo números (ej: 112233) o + al inicio",
    }),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
});

// --- TIPO DE ESTADO ---
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
  success?: boolean;
};

// --- ACCIONES ---

/**
 * CREAR PROVEEDOR
 */
export async function crearProveedor(prevState: State, formData: FormData): Promise<State> {
  const rawData = {
    codigo: formData.get("codigo") as string,
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

    const nuevoProveedor = await prisma.proveedor.create({
      data: {
        codigo: validatedFields.data.codigo,
        razonSocial: validatedFields.data.razonSocial,
        contacto: validatedFields.data.contacto || null,
        telefono: validatedFields.data.telefono || null,
        email: validatedFields.data.email || null,
      },
    });
    
    logger.info({ codigo: validatedFields.data.codigo, razonSocial: validatedFields.data.razonSocial }, "Proveedor creado exitosamente");

    createNotification(
      ["SUPERADMIN", "ADMIN"],
      "SUPPLIER_CREATED",
      `Se registró el nuevo proveedor "${nuevoProveedor.razonSocial}" (Cód: ${nuevoProveedor.codigo}).`,
      `/proveedores`
    ).catch(console.error);

  } catch (error) {
    // <-- 2. APLICAMOS EL LOGGER CON CONTEXTO
    logger.error({ err: error, payload: rawData }, "Error crítico al intentar crear un proveedor");
    return {
      message: "Error de base de datos. Intente nuevamente.",
      payload: rawData,
    };
  }

  revalidatePath("/proveedores");
  return { success: true };
}

const ITEMS_POR_PAGINA = 15; 

export async function obtenerProveedores(query: string = "", sort: string = "", page: number = 1) {
  try {
    const where: any = {};
    if (query) {
      where.OR = [
        { codigo: { contains: query, mode: "insensitive" } },
        { razonSocial: { contains: query, mode: "insensitive" } },
        { contacto: { contains: query, mode: "insensitive" } },
      ];
    }

    let orderBy: any = { id: "desc" };
    if (sort === "nombre-asc") orderBy = { razonSocial: "asc" };
    if (sort === "nombre-desc") orderBy = { razonSocial: "desc" };

    const skip = (page - 1) * ITEMS_POR_PAGINA;
    
    const totalProveedores = await prisma.proveedor.count({ where });

    const proveedores = await prisma.proveedor.findMany({
      where,
      orderBy,
      skip,
      take: ITEMS_POR_PAGINA,
    });

    return {
      proveedores,
      totalProveedores, 
      totalPages: Math.ceil(totalProveedores / ITEMS_POR_PAGINA) || 1,
      error: null 
    };

  } catch (error) {
    // <-- 3. APLICAMOS EL LOGGER PASANDO LOS PARÁMETROS DE BÚSQUEDA
    logger.error({ err: error, query, page, sort }, "Error al consultar la lista de proveedores");
    return { 
      proveedores: [], 
      totalProveedores: 0, 
      totalPages: 1, 
      error: "No se pudo conectar con la base de datos de proveedores." 
    };
  }
}

/**
 * ACTUALIZAR PROVEEDOR
 */
export async function actualizarProveedor(prevState: State, formData: FormData): Promise<State> {
  const id = parseInt(formData.get("id") as string);
  
  const rawData = {
    razonSocial: formData.get("razonSocial") as string,
    contacto: formData.get("contacto") as string,
    telefono: formData.get("telefono") as string,
    email: formData.get("email") as string,
  };

  if (!id) {
    return { message: "ID de proveedor no válido", errors: {} };
  }

  const validatedFields = actualizacionProveedorSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Faltan datos o son incorrectos.",
      payload: rawData,
    };
  }

  try {
    await prisma.proveedor.update({
      where: { id },
      data: {
        razonSocial: validatedFields.data.razonSocial,
        contacto: validatedFields.data.contacto,
        telefono: validatedFields.data.telefono,
        email: validatedFields.data.email || null,
      },
    });
    
    logger.info({ proveedorId: id, razonSocial: rawData.razonSocial }, "Proveedor actualizado exitosamente");

  } catch (error) {
    // <-- 4. APLICAMOS EL LOGGER CON EL ID DEL PROVEEDOR
    logger.error({ err: error, proveedorId: id, payload: rawData }, "Error al actualizar el proveedor en la base de datos");
    return {
      message: "No se pudo actualizar el proveedor en la base de datos.",
      payload: rawData,
    };
  }

  revalidatePath("/proveedores");
  return { success: true };
}

/**
 * ELIMINAR PROVEEDOR
 */
export async function eliminarProveedor(prevState: State, formData: FormData): Promise<State> {
  const id = parseInt(formData.get("id") as string);

  if (!id || isNaN(id)) return { message: "ID de proveedor no válido" };

  try {
    const proveedor = await prisma.proveedor.findUnique({
      where: { id },
    });

    if (!proveedor) {
      return { message: "El proveedor no existe." };
    }

    await prisma.$transaction([
      prisma.producto.deleteMany({
        where: { proveedor: proveedor.codigo },
      }),
      prisma.proveedor.delete({
        where: { id },
      }),
    ]);

    logger.info({ proveedorId: id, codigoAfectado: proveedor.codigo }, "Proveedor y productos asociados eliminados correctamente");

    const params = new URLSearchParams({
      razonSocial: proveedor.razonSocial,
      codigo: proveedor.codigo,
      contacto: proveedor.contacto || "",
      telefono: proveedor.telefono || "",
      email: proveedor.email || "",
    });

    createNotification(
      ["SUPERADMIN", "ADMIN"],
      "SUPPLIER_DELETED",
      `El proveedor "${proveedor.razonSocial}" (Cód: ${proveedor.codigo}) fue eliminado del sistema junto con sus productos.`,
      `/proveedores/eliminado?${params.toString()}`
    ).catch(console.error);

  } catch (error) {
    logger.error({ err: error, proveedorId: id }, "Fallo transaccional al intentar eliminar el proveedor y sus productos");
    return { 
      message: "Ocurrió un error al intentar eliminar el proveedor y sus productos." 
    };
  }

  revalidatePath("/proveedores");
  revalidatePath("/inventario"); 
  redirect("/proveedores");
}