"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { Prisma } from "@prisma/client";

// ----------------------------------------------------------------------
// 1. ESQUEMA DE VALIDACIÓN Y TIPOS
// ----------------------------------------------------------------------

const productoSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  codigoBarra: z.string().min(1, "El código de barra es obligatorio"),
  proveedor: z.string().min(1, "El código de proveedor es obligatorio"),
  
  tipo: z.string().min(1, "Seleccione un tipo válido"),

  // Usamos 'message' en lugar de 'invalid_type_error' para evitar conflictos de tipos
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

// Definición del Estado para useActionState
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
  // 'payload' almacena lo que el usuario escribió para devolverlo si hay error
  payload?: any; 
};

// ----------------------------------------------------------------------
// 2. CREAR PRODUCTO
// ----------------------------------------------------------------------

export async function crearProducto(prevState: State, formData: FormData): Promise<State> {

  const rawEsPorPeso = formData.get("esPorPeso");
  const esPorPesoBoolean = rawEsPorPeso === "on" || rawEsPorPeso === "true";

  const validatedFields = productoSchema.safeParse({
    nombre: formData.get("nombre"),
    codigoBarra: formData.get("codigoBarra"),
    proveedor: formData.get("proveedor"),
    tipo: formData.get("tipo"),
    stock: formData.get("stock"), 
    precio: formData.get("precio"),
    descripcion: formData.get("descripcion"),
    fechaVencimiento: formData.get("fechaVencimiento"),
    esPorPeso: esPorPesoBoolean,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Faltan campos requeridos. Revisa el formulario.",
      payload: Object.fromEntries(formData.entries()), // Retornamos lo escrito
    };
  }

  const { nombre, codigoBarra, proveedor, tipo, stock, precio, descripcion, fechaVencimiento, esPorPeso } = validatedFields.data;

  try {
    const fechaFinal = fechaVencimiento ? new Date(fechaVencimiento) : null;

    await prisma.producto.create({
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
  } catch (error) {
    console.error("Error DB:", error);
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

  // 1. Validar datos
  const validatedFields = productoSchema.safeParse({
    nombre: formData.get("nombre"),
    codigoBarra: formData.get("codigoBarra"),
    proveedor: formData.get("proveedor"),
    tipo: formData.get("tipo"),
    stock: formData.get("stock"),
    precio: formData.get("precio"),
    descripcion: formData.get("descripcion"),
    fechaVencimiento: formData.get("fechaVencimiento"),
    esPorPeso: esPorPesoBoolean,
  });

  // 2. Si falla, retornamos errores Y los datos que escribió el usuario (payload)
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Error de validación. Revisa los campos marcados.",
      payload: Object.fromEntries(formData.entries()),
    };
  }

  const { nombre, codigoBarra, proveedor, tipo, stock, precio, descripcion, fechaVencimiento, esPorPeso } = validatedFields.data;

  // 3. Actualizar DB
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
  } catch (error) {
    console.error("Error al actualizar DB:", error);
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
// 4. OTRAS FUNCIONES (Eliminar, Obtener, Cargar Prueba)
// ----------------------------------------------------------------------

export async function eliminarProducto(formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  await prisma.producto.delete({ where: { id } });
  revalidatePath("/inventario");
  redirect("/inventario");
}

// DEFINICIÓN DE LOS FILTROS
interface ProductFilters {
  query?: string;
  category?: string;
  stockStatus?: string;
  priceMin?: string;
  priceMax?: string;
  sort?: string;
  page?: number; // <-- NUEVO: Recibimos la página actual
}

const ITEMS_POR_PAGINA = 15; // <-- NUEVO: Cantidad de productos por página

// ⚠️ FUNCIÓN MODIFICADA PARA PAGINAR, FILTRAR Y ORDENAR EN LA BD
export async function obtenerProductosDB(filters?: ProductFilters) {
  try {

    // 1. Construir cláusula WHERE (Filtros)
    const where: Prisma.ProductoWhereInput = {};

    // A. Búsqueda General (Nombre, Código, Tipo, Proveedor)
    if (filters?.query) {
      const search = filters.query.trim();
      where.OR = [
        { nombre: { contains: search, mode: "insensitive" } },
        { codigoBarra: { contains: search, mode: "insensitive" } },
        { tipo: { contains: search, mode: "insensitive" } },
        { proveedor: { contains: search, mode: "insensitive" } },
      ];
    }

    // B. Categoría
    if (filters?.category && filters.category !== "Todas") {
      where.tipo = { equals: filters.category, mode: "insensitive" };
    }

    // C. Estado del Stock
    if (filters?.stockStatus) {
      if (filters.stockStatus === "low") {
        // Stock Bajo: entre 1 y 20
        where.stock = { gt: 0, lte: 20 };
      } else if (filters.stockStatus === "none") {
        // Sin Stock: 0
        where.stock = { equals: 0 };
      } else if (filters.stockStatus === "expiring") {
        // Por Vencer: Fecha entre HOY y 30 días en el futuro
        const hoy = new Date();
        const futuro = new Date();
        futuro.setDate(hoy.getDate() + 30);
        
        where.fechaVencimiento = {
          gte: hoy,
          lte: futuro
        };
      }
    }

    // D. Rango de Precio
    if (filters?.priceMin || filters?.priceMax) {
      where.precio = {};
      if (filters.priceMin) where.precio.gte = parseFloat(filters.priceMin);
      if (filters.priceMax) where.precio.lte = parseFloat(filters.priceMax);
    }

    // 2. Construir cláusula ORDER BY (Ordenamiento)
    let orderBy: Prisma.ProductoOrderByWithRelationInput[] = [];

    switch (filters?.sort) {
      case "nombre-asc":
        orderBy = [{ nombre: "asc" }];
        break;
      case "stock-desc":
        orderBy = [{ stock: "desc" }];
        break;
      case "stock-asc":
        orderBy = [{ stock: "asc" }];
        break;
      case "precio-desc":
        orderBy = [{ precio: "desc" }];
        break;
      case "precio-asc":
        orderBy = [{ precio: "asc" }];
        break;
      case "vencimiento-asc":
        // Primero los que vencen pronto, los nulos al final
        orderBy = [{ fechaVencimiento: "asc" }]; 
        break;
      default:
        // Por defecto: Creados recientemente
        orderBy = [{ createdAt: "desc" }];
    }

    // --- 3. NUEVA LÓGICA DE PAGINACIÓN ---
    const page = filters?.page || 1;
    const skip = (page - 1) * ITEMS_POR_PAGINA;

    // Contar el TOTAL de productos para saber cuántas páginas hay
    const totalProductos = await prisma.producto.count({ where });

    // 4. Ejecutar consulta con Skip y Take
    const productos = await prisma.producto.findMany({
      where,
      orderBy,
      skip,                    // <-- Saltamos los registros anteriores
      take: ITEMS_POR_PAGINA,  // <-- Tomamos solo los de esta página
    });

    // 5. Devolver objeto con productos y total de páginas
    return {
      productos: productos.map((p) => ({
        ...p,
        precio: Number(p.precio), // Convertir Decimal a Number para el frontend
      })),
      totalPages: Math.ceil(totalProductos / ITEMS_POR_PAGINA) || 1
    };

  } catch (error) {
    console.error("Error al obtener productos:", error);
    // Lanza el error para que el hook de React pueda capturarlo y mostrar la UI de error
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
    revalidatePath("/inventario");
  } catch (error) {
    console.error("Error cargando datos de prueba:", error);
  }
}

export async function obtenerProductoPorId(id: number) {
  if (!id || typeof id !== 'number' || isNaN(id)) return null;
  try {
    const prod = await prisma.producto.findUnique({ where: { id } });
    if (!prod) return null;
    return {
        ...prod,
        precio: Number(prod.precio)
    }
  } catch (error) {
    return null;
  }
}