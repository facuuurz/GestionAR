"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { logger } from "@/lib/logger"; // <-- 1. IMPORTAMOS EL LOGGER

// 1. Esquema de Validación
const promocionSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  descripcion: z.string().optional(),
  precio: z.coerce.number().min(0, "El precio no puede ser negativo"),
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

// --- BUSCAR PRODUCTOS PARA EL FORMULARIO ---
export async function buscarProductosParaPromocion(query: string) {
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
       // Log de error silencioso
       logger.error({ err: error, query: "vacío" }, "Error al cargar productos iniciales para promoción");
       return [];
     }
  }
  
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
    logger.error({ err: error, query }, "Error buscando productos específicos para promoción");
    return [];
  }
}

const ITEMS_POR_PAGINA = 15; // Ajusta este número según prefieras

export async function obtenerPromociones(query: string = "", soloActivas: boolean = false, page: number = 1) {
  try {
    const where: any = {
      items: {
        some: {} 
      },
      ...(soloActivas ? { activo: true } : {}),
      ...(query ? {
          OR: [
              { nombre: { contains: query, mode: "insensitive" } },
              { descripcion: { contains: query, mode: "insensitive" } },
          ],
      } : {})
    };

    const skip = (page - 1) * ITEMS_POR_PAGINA;
    const totalPromociones = await prisma.promocion.count({ where });

    const promociones = await prisma.promocion.findMany({
      where,
      include: {
        items: {
          include: {
            producto: true 
          }
        }
      },
      orderBy: { fechaInicio: 'desc' }, 
      skip,
      take: ITEMS_POR_PAGINA
    });

    const promocionesFormateadas = promociones.map((promo) => ({
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

    return {
      promociones: promocionesFormateadas,
      totalPages: Math.ceil(totalPromociones / ITEMS_POR_PAGINA) || 1,
      totalPromociones
    };

  } catch (error) {
    logger.error({ err: error, query, soloActivas, page }, "Error obteniendo el listado de promociones");
    return { promociones: [], totalPages: 1, totalPromociones: 0 };
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
    activo: formData.get("activo") === "on", 
  };

  const productosDataRaw = formData.get("productosData") as string;
  let productosParaInsertar: { id: number; cantidad: number }[] = [];

  try {
    if (productosDataRaw) {
        productosParaInsertar = JSON.parse(productosDataRaw);
    }
  } catch (e) {
    // Usamos warn (advertencia) porque es un problema de formato de datos del cliente, no una caída del servidor
    logger.warn({ err: e, rawData: productosDataRaw }, "Fallo al parsear el JSON de productosDataRaw en crearPromocion");
  }

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
    const nuevaPromocion = await prisma.promocion.create({
      data: {
        nombre: validatedFields.data.nombre,
        descripcion: validatedFields.data.descripcion || "",
        precio: validatedFields.data.precio,
        fechaInicio: validatedFields.data.fechaInicio,
        fechaFin: validatedFields.data.fechaFin,
        activo: validatedFields.data.activo,
        items: {
            create: productosParaInsertar.map((item) => ({
                productoId: item.id,
                cantidad: item.cantidad
            }))
        }
      },
    });

    logger.info({ promocionId: nuevaPromocion.id, nombre: nuevaPromocion.nombre }, "Promoción creada exitosamente");

  } catch (error) {
    logger.error({ err: error, payload: rawData }, "Error de base de datos al intentar crear la promoción");
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
    activo: formData.get("activo") === "on",
  };

  const productosDataRaw = formData.get("productosData") as string;
  let productosParaInsertar: { id: number; cantidad: number }[] = [];

  try {
    if (productosDataRaw) {
      productosParaInsertar = JSON.parse(productosDataRaw);
    }
  } catch (e) { 
    logger.warn({ err: e, promocionId: id, rawData: productosDataRaw }, "Fallo al parsear el JSON de productosDataRaw en actualizarPromocion");
  }

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

      await tx.promocionProducto.deleteMany({
        where: { promocionId: id },
      });

      await tx.promocionProducto.createMany({
        data: productosParaInsertar.map((item) => ({
          promocionId: id,
          productoId: item.id,
          cantidad: item.cantidad,
        })),
      });
    });

    logger.info({ promocionId: id }, "Promoción y sus productos actualizados exitosamente");

  } catch (error) {
    logger.error({ err: error, promocionId: id, payload: rawData }, "Fallo transaccional al actualizar la promoción");
    return {
      message: "Error al actualizar la promoción.",
      payload: rawData,
    };
  }

  revalidatePath("/promociones");
  redirect("/promociones");
}

// --- ELIMINAR PROMOCIÓN ---
export async function eliminarPromocion(id: number) {
  try {
    await prisma.promocion.delete({ where: { id } });
    
    logger.info({ promocionId: id }, "Promoción eliminada exitosamente");
    revalidatePath("/promociones");
  } catch (error) {
    logger.error({ err: error, promocionId: id }, "Error crítico al intentar eliminar la promoción");
  }
  redirect("/promociones");
}

// --- OBTENER POR ID ---
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

    if (!promocion) {
      logger.warn({ promocionId: id }, "Se intentó buscar una promoción por ID pero no existe");
      return null;
    }

    return {
      ...promocion,
      precio: Number(promocion.precio),
      items: promocion.items.map((item) => ({
        ...item,
        producto: {
            ...item.producto,
            precio: Number(item.producto.precio)
        }
      })),
      productos: promocion.items.map((p) => ({
        producto: {
            ...p.producto,
            precio: Number(p.producto.precio)
        },
        cantidad: p.cantidad,
      })),
    };
  } catch (error) {
    logger.error({ err: error, promocionId: id }, "Error obteniendo detalles de promoción por ID");
    return null;
  }
}