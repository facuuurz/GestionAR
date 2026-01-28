"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// 1. Esquema de Validación
const promocionSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  descripcion: z.string().optional(), // Puede ser opcional según tu DB
  
  // Convertimos el texto a número automáticamente
  precio: z.coerce.number().min(0, "El precio no puede ser negativo"),
  
  // El checkbox no envía "false", envía null si no está marcado. Lo manejamos manual fuera del schema o así:
  activo: z.boolean().optional().default(true),

  fechaInicio: z.coerce.date(),
  fechaFin: z.coerce.date(),
}).refine((data) => data.fechaFin >= data.fechaInicio, {
  message: "La fecha de fin debe ser posterior al inicio",
  path: ["fechaFin"],
});

export type State = {
  errors?: {
    nombre?: string[];
    descripcion?: string[];
    precio?: string[];
    fechaInicio?: string[];
    fechaFin?: string[];
  };
  message?: string | null;
  payload?: any;
};

// --- BUSCAR PRODUCTOS (Para el buscador del formulario) ---
export async function buscarProductosParaPromocion(query: string) {
  // Si no hay query, devolvemos los últimos 20
  if (!query || query.trim() === "") {
     try {
       const productos = await prisma.producto.findMany({
         take: 20,
         orderBy: { createdAt: 'desc' },
         select: { 
           id: true, 
           nombre: true, 
           codigoBarra: true, 
           precio: true 
         }
       });
       return productos.map((prod) => ({
         ...prod,
         precio: Number(prod.precio)
       }));
     } catch (error) {
       return [];
     }
  }
  
  // Búsqueda con filtro
  try {
    const productos = await prisma.producto.findMany({
      where: {
        OR: [
          { nombre: { contains: query, mode: "insensitive" } },
          { codigoBarra: { contains: query, mode: "insensitive" } }, 
        ]
      },
      take: 10,
      select: { 
        id: true, 
        nombre: true, 
        codigoBarra: true, 
        precio: true 
      }
    });

    return productos.map((prod) => ({
      ...prod,
      precio: Number(prod.precio)
    }));

  } catch (error) {
    console.error("Error buscando productos:", error);
    return [];
  }
}

// --- OBTENER PROMOCIONES (Para el Modal y la Lista) ---
export async function obtenerPromociones(query: string = "", soloActivas: boolean = false) {
  try {
    const promociones = await prisma.promocion.findMany({
      where: {
        // Solo traemos las ACTIVAS por defecto para el modal de ventas
        ...(soloActivas ? { activo: true } : {}),

        ...(query ? {
            OR: [
                { nombre: { contains: query, mode: "insensitive" } },
                { descripcion: { contains: query, mode: "insensitive" } },
            ],
        } : {})
      },
      // 👇 INCLUDE PROFUNDO: Traemos la tabla intermedia Y el producto real
      include: {
        items: {
          include: {
            producto: true 
          }
        }
      },
      orderBy: { fechaInicio: 'desc' }, 
    });

    return promociones.map((promo) => ({
      ...promo,
      precio: Number(promo.precio),
      items: promo.items.map(item => ({
        ...item,
        producto: {
            ...item.producto,
            precio: Number(item.producto.precio)
        }
      }))
    }));

  } catch (error) {
    console.error("Error obteniendo promociones:", error);
    return [];
  }
}

// --- CREAR PROMOCIÓN ---
export async function crearPromocion(prevState: State, formData: FormData) {
  const rawData = {
    nombre: formData.get("nombre"),
    descripcion: formData.get("descripcion"),
    precio: formData.get("precio"),
    fechaInicio: formData.get("fechaInicio"),
    fechaFin: formData.get("fechaFin"),
    // En HTML, si el checkbox está on envía "on", si no, envía null
    activo: formData.get("activo") === "on", 
  };

  const productosDataRaw = formData.get("productosData") as string;
  let productosParaInsertar: { id: number; cantidad: number }[] = [];

  try {
    if (productosDataRaw) {
        productosParaInsertar = JSON.parse(productosDataRaw);
    }
  } catch (e) {
    console.error("Error parseando JSON de productos", e);
  }

  // Validamos con Zod (pasando activo manualmente)
  const validatedFields = promocionSchema.safeParse({
      ...rawData,
      activo: rawData.activo
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Faltan datos o las fechas son incorrectas.",
      payload: rawData,
    };
  }

  if (productosParaInsertar.length === 0) {
    return {
      message: "Debes agregar al menos un producto a la promoción.",
      payload: rawData,
    };
  }

  try {
    await prisma.promocion.create({
      data: {
        nombre: validatedFields.data.nombre,
        descripcion: validatedFields.data.descripcion || "",
        precio: validatedFields.data.precio,
        fechaInicio: validatedFields.data.fechaInicio,
        fechaFin: validatedFields.data.fechaFin,
        activo: validatedFields.data.activo, // ✅ Guardamos el estado
        
        // Relación Many-to-Many
        items: {
            create: productosParaInsertar.map((item) => ({
                productoId: item.id, // Usamos el ID directo que es más eficiente
                cantidad: item.cantidad
            }))
        }
      },
    });
  } catch (error) {
    console.error("Error creando promoción:", error);
    return {
      message: "Error de base de datos al crear la promoción.",
      payload: rawData,
    };
  }

  revalidatePath("/promociones");
  redirect("/promociones");
}

// --- ACTUALIZAR PROMOCIÓN ---
export async function actualizarPromocion(id: number, prevState: State, formData: FormData) {
  const rawData = {
    nombre: formData.get("nombre"),
    descripcion: formData.get("descripcion"),
    precio: formData.get("precio"),
    fechaInicio: formData.get("fechaInicio"),
    fechaFin: formData.get("fechaFin"),
    activo: formData.get("activo") === "on", // ✅ Lógica checkbox
  };

  const productosDataRaw = formData.get("productosData") as string;
  let productosParaInsertar: { id: number; cantidad: number }[] = [];

  try {
    if (productosDataRaw) {
      productosParaInsertar = JSON.parse(productosDataRaw);
    }
  } catch (e) { console.error(e); }

  const validatedFields = promocionSchema.safeParse({
      ...rawData,
      activo: rawData.activo
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Datos inválidos.",
      payload: rawData,
    };
  }

  if (productosParaInsertar.length === 0) {
    return { message: "Debe haber al menos un producto.", payload: rawData };
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Actualizar datos básicos
      await tx.promocion.update({
        where: { id },
        data: {
          nombre: validatedFields.data.nombre,
          descripcion: validatedFields.data.descripcion || "",
          precio: validatedFields.data.precio,
          fechaInicio: validatedFields.data.fechaInicio,
          fechaFin: validatedFields.data.fechaFin,
          activo: validatedFields.data.activo,
        },
      });

      // 2. Borrar items viejos (Estrategia simple: borrar todo y crear de nuevo)
      // Nota: Usamos 'promocionProducto' (camelCase) que es como Prisma nombra la tabla intermedia por defecto
      await tx.promocionProducto.deleteMany({
        where: { promocionId: id },
      });

      // 3. Insertar items nuevos
      await tx.promocionProducto.createMany({
        data: productosParaInsertar.map((item) => ({
          promocionId: id,
          productoId: item.id,
          cantidad: item.cantidad,
        })),
      });
    });

  } catch (error) {
    console.error("Error actualizando promoción:", error);
    return {
      message: "Error al actualizar la promoción.",
      payload: rawData,
    };
  }

  revalidatePath("/promociones");
  redirect("/promociones");
}

// --- ELIMINAR ---
export async function eliminarPromocion(id: number) {
  try {
    await prisma.promocion.delete({ where: { id } });
    revalidatePath("/promociones");
  } catch (error) {
    console.error("Error al eliminar:", error);
  }
  redirect("/promociones");
}

// --- OBTENER POR ID (Para editar) ---
export async function obtenerPromocionPorId(id: number) {
  try {
    const promocion = await prisma.promocion.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            producto: true,
          },
        },
      },
    });

    if (!promocion) return null;

    return {
      ...promocion,
      precio: Number(promocion.precio),

      items: promocion.items.map((item) => ({
        ...item,
        producto: {
            ...item.producto,
            precio: Number(item.producto.precio) // Convertimos precio del producto
        }
      })),
      // Mapeamos para que el frontend lo lea fácil
      productos: promocion.items.map((p) => ({
        producto: {
            ...p.producto,
            precio: Number(p.producto.precio)
        },
        cantidad: p.cantidad,
      })),
    };
  } catch (error) {
    console.error("Error obteniendo promoción:", error);
    return null;
  }
}