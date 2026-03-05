"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// --- SCHEMA DE VALIDACIÓN ---
const proveedorSchema = z.object({
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

    await prisma.proveedor.create({
      data: {
        codigo: validatedFields.data.codigo,
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



const ITEMS_POR_PAGINA = 15; // Puedes cambiar este número

export async function obtenerProveedores(query: string = "", sort: string = "", page: number = 1) {
  try {
    // 1. Construir filtros de búsqueda
    const where: any = {};
    if (query) {
      where.OR = [
        { codigo: { contains: query, mode: "insensitive" } },
        { razonSocial: { contains: query, mode: "insensitive" } },
        { contacto: { contains: query, mode: "insensitive" } },
      ];
    }

    // (Aquí iría tu lógica del switch de 'sort' si ya la tienes armada, por defecto ordenamos por ID)
    let orderBy: any = { id: "desc" };
    if (sort === "nombre-asc") orderBy = { razonSocial: "asc" };
    if (sort === "nombre-desc") orderBy = { razonSocial: "desc" };
    // ... agrega más casos según necesites

    // 2. Lógica de Paginación
    const skip = (page - 1) * ITEMS_POR_PAGINA;
    
    // Contar el total real para calcular las páginas
    const totalProveedores = await prisma.proveedor.count({ where });

    // 3. Traer solo los de esta página
    const proveedores = await prisma.proveedor.findMany({
      where,
      orderBy,
      skip,
      take: ITEMS_POR_PAGINA,
    });

    // 4. Devolvemos un objeto completo en lugar de solo el arreglo
    return {
      proveedores,
      totalProveedores, 
      totalPages: Math.ceil(totalProveedores / ITEMS_POR_PAGINA) || 1,
      error: null // Todo salió bien
    };

  } catch (error) {
    console.error("Error al obtener proveedores:", error);
    // Si la DB falla, no rompemos la app, devolvemos un error controlado
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

  try {
    await prisma.proveedor.update({
      where: { id },
      data: {
        razonSocial: rawData.razonSocial,
        contacto: rawData.contacto,
        telefono: rawData.telefono,
        email: rawData.email,
      },
    });
  } catch (error) {
    console.error("Error al actualizar proveedor:", error);
    return {
      message: "No se pudo actualizar el proveedor en la base de datos.",
      payload: rawData,
    };
  }

  revalidatePath("/proveedores");
  redirect("/proveedores");
  return { message: null };
}

/**
 * ELIMINAR PROVEEDOR
 */
export async function eliminarProveedor(prevState: State, formData: FormData): Promise<State> {
  const id = parseInt(formData.get("id") as string);

  if (!id || isNaN(id)) return { message: "ID de proveedor no válido" };

  try {
    // 1. Primero buscamos el proveedor para obtener su CÓDIGO
    const proveedor = await prisma.proveedor.findUnique({
      where: { id },
      select: { codigo: true } // Solo necesitamos el código
    });

    if (!proveedor) {
      return { message: "El proveedor no existe." };
    }

    // 2. Usamos una transacción para asegurar integridad
    // Primero borramos los productos asociados a ese código, luego el proveedor.
    await prisma.$transaction([
      // Paso A: Borrar productos donde el campo 'proveedor' coincida con el código
      prisma.producto.deleteMany({
        where: { proveedor: proveedor.codigo },
      }),
      // Paso B: Borrar el proveedor por su ID
      prisma.proveedor.delete({
        where: { id },
      }),
    ]);

  } catch (error) {
    console.error("Error al eliminar proveedor y productos:", error);
    return { 
      message: "Ocurrió un error al intentar eliminar el proveedor y sus productos." 
    };
  }

  revalidatePath("/proveedores");
  revalidatePath("/inventario"); // También revalidamos inventario porque borramos productos
  redirect("/proveedores");
}