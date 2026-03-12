"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { logger } from "@/lib/logger"; // <-- 1. IMPORTAMOS EL LOGGER

// ----------------------------------------------------------------------
// 1. ESQUEMA DE VALIDACIÓN Y TIPOS
// ----------------------------------------------------------------------

const productoSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  codigoBarra: z.string().min(1, "El código de barra es obligatorio"),
  proveedor: z.string().min(1, "El código de proveedor es obligatorio"),
  
  tipo: z.string().min(1, "Seleccione un tipo válido"),

  stock: z.coerce
    .number({ message: "El stock debe ser un número" }) 
    .int("El stock debe ser un número entero")
    .min(0, "El stock no puede ser negativo"),

  precio: z.coerce
    .number({ message: "El precio debe ser un número válido" })
    .min(0.01, "El precio debe ser mayor a 0"),
  
  descripcion: z.string().max(200, "Máximo 200 caracteres").optional(),
  fechaVencimiento: z.string().optional().nullable(),
  esPorPeso: z.coerce.boolean().optional(),
});

export type State = {
  errors?: {
    nombre?: string[];
    codigoBarra?: string[];
    proveedor?: string[];
    tipo?: string[];
    stock?: string[];
    precio?: string[];
    descripcion?: string[];
    fechaVencimiento?: string[];
  };
  message?: string | null;
  payload?: any; 
};

// ----------------------------------------------------------------------
// 2. CREAR PRODUCTO
// ----------------------------------------------------------------------

export async function crearProducto(prevState: State, formData: FormData): Promise<State> {

  const rawEsPorPeso = formData.get("esPorPeso");
  const esPorPesoBoolean = rawEsPorPeso === "on" || rawEsPorPeso === "true";

  const rawData = {
    nombre: formData.get("nombre"),
    codigoBarra: formData.get("codigoBarra"),
    proveedor: formData.get("proveedor"),
    tipo: formData.get("tipo"),
    stock: formData.get("stock"), 
    precio: formData.get("precio"),
    descripcion: formData.get("descripcion"),
    fechaVencimiento: formData.get("fechaVencimiento"),
    esPorPeso: esPorPesoBoolean,
  };

  const validatedFields = productoSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Faltan campos requeridos. Revisa el formulario.",
      payload: Object.fromEntries(formData.entries()),
    };
  }

  const { nombre, codigoBarra, proveedor, tipo, stock, precio, descripcion, fechaVencimiento, esPorPeso } = validatedFields.data;

  try {
    const fechaFinal = fechaVencimiento ? new Date(fechaVencimiento) : null;

    const nuevoProducto = await prisma.producto.create({
      data: {
        nombre,
        codigoBarra,
        proveedor,
        tipo,
        stock,
        precio,
        descripcion: descripcion || "",
        fechaVencimiento: fechaFinal,
        esPorPeso: esPorPeso || false,
      },
    });

    logger.info({ productoId: nuevoProducto.id, codigoBarra }, "Producto creado exitosamente");

  } catch (error) {
    logger.error({ err: error, payload: rawData }, "Error crítico de base de datos al intentar crear un producto");
    return {
      message: "Error al guardar en la base de datos.",
      payload: Object.fromEntries(formData.entries()),
    };
  }

  revalidatePath("/inventario");
  redirect("/inventario");
}

// ----------------------------------------------------------------------
// 3. ACTUALIZAR PRODUCTO
// ----------------------------------------------------------------------

export async function actualizarProducto(prevState: State, formData: FormData): Promise<State> {
  const id = parseInt(formData.get("id") as string);

  const rawEsPorPeso = formData.get("esPorPeso");
  const esPorPesoBoolean = rawEsPorPeso === "on" || rawEsPorPeso === "true";

  const rawData = {
    nombre: formData.get("nombre"),
    codigoBarra: formData.get("codigoBarra"),
    proveedor: formData.get("proveedor"),
    tipo: formData.get("tipo"),
    stock: formData.get("stock"),
    precio: formData.get("precio"),
    descripcion: formData.get("descripcion"),
    fechaVencimiento: formData.get("fechaVencimiento"),
    esPorPeso: esPorPesoBoolean,
  };

  const validatedFields = productoSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Error de validación. Revisa los campos marcados.",
      payload: Object.fromEntries(formData.entries()),
    };
  }

  const { nombre, codigoBarra, proveedor, tipo, stock, precio, descripcion, fechaVencimiento, esPorPeso } = validatedFields.data;

  try {
    const fechaFinal = fechaVencimiento ? new Date(fechaVencimiento) : null;
    
    await prisma.producto.update({
      where: { id },
      data: {
        nombre,
        codigoBarra,
        stock,
        precio,
        tipo,
        proveedor,
        descripcion: descripcion || null,
        fechaVencimiento: fechaFinal,
        esPorPeso: esPorPeso || false,
      },
    });

    logger.info({ productoId: id, codigoBarra }, "Producto actualizado exitosamente");

  } catch (error) {
    logger.error({ err: error, productoId: id, payload: rawData }, "Error interno al actualizar producto en base de datos");
    return {
      message: "Error interno al actualizar la base de datos.",
      payload: Object.fromEntries(formData.entries()),
    };
  }

  revalidatePath("/inventario");
  redirect("/inventario");

  return { message: "Actualizado" };
}

// ----------------------------------------------------------------------
// 4. OTRAS FUNCIONES
// ----------------------------------------------------------------------

export async function eliminarProducto(formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  try {
    await prisma.producto.delete({ where: { id } });
    logger.info({ productoId: id }, "Producto eliminado exitosamente");
    revalidatePath("/inventario");
    redirect("/inventario");
  } catch (error) {
    logger.error({ err: error, productoId: id }, "Error al intentar eliminar un producto");
    throw new Error("No se pudo eliminar el producto.");
  }
}

// DEFINICIÓN DE LOS FILTROS
interface ProductFilters {
  query?: string;
  category?: string;
  stockStatus?: string;
  priceMin?: string;
  priceMax?: string;
  sort?: string;
  page?: number;
}

const ITEMS_POR_PAGINA = 15; 

export async function obtenerProductosDB(filters?: ProductFilters) {
  try {
    const where: Prisma.ProductoWhereInput = {};

    if (filters?.query) {
      const search = filters.query.trim();
      where.OR = [
        { nombre: { contains: search, mode: "insensitive" } },
        { codigoBarra: { contains: search, mode: "insensitive" } },
        { tipo: { contains: search, mode: "insensitive" } },
        { proveedor: { contains: search, mode: "insensitive" } },
      ];
    }

    if (filters?.category && filters.category !== "Todas") {
      where.tipo = { equals: filters.category, mode: "insensitive" };
    }

    if (filters?.stockStatus) {
      if (filters.stockStatus === "low") {
        where.stock = { gt: 0, lte: 20 };
      } else if (filters.stockStatus === "none") {
        where.stock = { equals: 0 };
      } else if (filters.stockStatus === "expiring") {
        const hoy = new Date();
        const futuro = new Date();
        futuro.setDate(hoy.getDate() + 30);
        where.fechaVencimiento = { gte: hoy, lte: futuro };
      }
    }

    if (filters?.priceMin || filters?.priceMax) {
      where.precio = {};
      if (filters.priceMin) where.precio.gte = parseFloat(filters.priceMin);
      if (filters.priceMax) where.precio.lte = parseFloat(filters.priceMax);
    }

    let orderBy: Prisma.ProductoOrderByWithRelationInput[] = [];

    switch (filters?.sort) {
      case "nombre-asc": orderBy = [{ nombre: "asc" }]; break;
      case "stock-desc": orderBy = [{ stock: "desc" }]; break;
      case "stock-asc": orderBy = [{ stock: "asc" }]; break;
      case "precio-desc": orderBy = [{ precio: "desc" }]; break;
      case "precio-asc": orderBy = [{ precio: "asc" }]; break;
      case "vencimiento-asc": orderBy = [{ fechaVencimiento: "asc" }]; break;
      default: orderBy = [{ createdAt: "desc" }];
    }

    const page = filters?.page || 1;
    const skip = (page - 1) * ITEMS_POR_PAGINA;

    const totalProductos = await prisma.producto.count({ where });

    const productos = await prisma.producto.findMany({
      where,
      orderBy,
      skip,
      take: ITEMS_POR_PAGINA,
    });

    return {
      productos: productos.map((p) => ({
        ...p,
        precio: Number(p.precio), 
      })),
      totalPages: Math.ceil(totalProductos / ITEMS_POR_PAGINA) || 1
    };

  } catch (error) {
    logger.error({ err: error, filters }, "Error en consulta obtenerProductosDB");
    throw new Error("Error interno al conectarse con la base de datos."); 
  }
}

export async function cargarDatosDePrueba() {
  try {
    await prisma.producto.createMany({
      data: [
        { nombre: "Producto A", stock: 10, precio: 100, tipo: "Almacén", codigoBarra: "111", proveedor: "P1", descripcion: "Test A" },
        { nombre: "Producto B", stock: 20, precio: 200, tipo: "Bebidas", codigoBarra: "222", proveedor: "P2", descripcion: "Test B" },
      ],
      skipDuplicates: true,
    });
    logger.info("Datos de prueba de inventario cargados exitosamente");
    revalidatePath("/inventario");
  } catch (error) {
    logger.error({ err: error }, "Fallo al intentar cargar datos de prueba en inventario");
  }
}

export async function obtenerProductoPorId(id: number) {
  if (!id || typeof id !== 'number' || isNaN(id)) return null;
  try {
    const prod = await prisma.producto.findUnique({ where: { id } });
    if (!prod) {
      logger.warn({ productoId: id }, "Se intentó buscar un producto por ID pero no existe");
      return null;
    }
    return {
        ...prod,
        precio: Number(prod.precio)
    }
  } catch (error) {
    logger.error({ err: error, productoId: id }, "Error al obtener producto por ID");
    return null;
  }
}