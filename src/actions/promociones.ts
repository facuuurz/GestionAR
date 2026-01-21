"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// 1. Esquema de Validación
const promocionSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  descripcion: z.string().min(1, "La descripción es obligatoria"),
  
  // Convertimos el texto a número/fecha automáticamente con coerce
  precio: z.coerce.number().min(0, "El precio no puede ser negativo"),
  
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

// --- NUEVA FUNCIÓN: BUSCAR PRODUCTOS (CORREGIDA) ---
export async function buscarProductosParaPromocion(query: string) {
  if (!query) return [];
  
  try {
    const productos = await prisma.producto.findMany({
      where: {
        OR: [
          { nombre: { contains: query, mode: "insensitive" } },
          { codigoBarra: { contains: query } }, 
        ]
      },
      take: 5,
      select: { 
        id: true, 
        nombre: true, 
        codigoBarra: true, 
        precio: true 
      }
    });

    // 👇 SOLUCIÓN: Convertimos el Decimal a Number para que Next.js no falle
    return productos.map((prod) => ({
      ...prod,
      precio: Number(prod.precio) // o prod.precio.toNumber()
    }));

  } catch (error) {
    console.error("Error buscando productos:", error);
    return [];
  }
}

// --- OBTENER PROMOCIONES (CORREGIDA) ---
export async function obtenerPromociones(query: string = "") {
    try {
        const promociones = await prisma.promocion.findMany({
          where: {
            OR: [
              { nombre: { contains: query, mode: "insensitive" } },
              { descripcion: { contains: query, mode: "insensitive" } },
            ],
          },
          include: {
            productos: true 
          },
          orderBy: { fechaInicio: 'desc' }, 
        });

        // 👇 SOLUCIÓN: También convertimos aquí por seguridad
        return promociones.map((promo) => ({
            ...promo,
            precio: Number(promo.precio)
        }));

      } catch (error) {
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
  };

  // 1. EXTRAER PRODUCTOS Y CANTIDADES (Formato JSON)
  // El frontend enviará un JSON string en el campo "productosData"
  const productosDataRaw = formData.get("productosData") as string;
  let productosParaInsertar: { id: number; cantidad: number }[] = [];

  try {
    if (productosDataRaw) {
        productosParaInsertar = JSON.parse(productosDataRaw);
    }
  } catch (e) {
    console.error("Error parseando JSON de productos", e);
  }

  const validatedFields = promocionSchema.safeParse(rawData);

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
    // 2. CREAR Y CONECTAR CON CANTIDADES
    await prisma.promocion.create({
      data: {
        nombre: validatedFields.data.nombre,
        descripcion: validatedFields.data.descripcion,
        precio: validatedFields.data.precio,
        fechaInicio: validatedFields.data.fechaInicio,
        fechaFin: validatedFields.data.fechaFin,
        
        // Aquí guardamos el ID y la CANTIDAD en la tabla intermedia
        productos: {
            create: productosParaInsertar.map((item) => ({
                producto: { connect: { id: item.id } },
                cantidad: item.cantidad // ✅ Guardamos la cantidad
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

export async function actualizarPromocion(id: number, prevState: State, formData: FormData) {
  const rawData = {
    nombre: formData.get("nombre"),
    descripcion: formData.get("descripcion"),
    precio: formData.get("precio"),
    fechaInicio: formData.get("fechaInicio"),
    fechaFin: formData.get("fechaFin"),
  };

  // Extraer productos y cantidades
  const productosDataRaw = formData.get("productosData") as string;
  let productosParaInsertar: { id: number; cantidad: number }[] = [];

  try {
    if (productosDataRaw) {
      productosParaInsertar = JSON.parse(productosDataRaw);
    }
  } catch (e) {
    console.error("Error parseando JSON de productos", e);
  }

  const validatedFields = promocionSchema.safeParse(rawData);

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
    // Usamos una transacción para asegurar integridad
    await prisma.$transaction(async (tx) => {
      // 1. Actualizar datos básicos de la promoción
      await tx.promocion.update({
        where: { id },
        data: {
          nombre: validatedFields.data.nombre,
          descripcion: validatedFields.data.descripcion,
          precio: validatedFields.data.precio,
          fechaInicio: validatedFields.data.fechaInicio,
          fechaFin: validatedFields.data.fechaFin,
        },
      });

      // 2. Eliminar relaciones de productos existentes
      await tx.promocionProducto.deleteMany({
        where: { promocionId: id },
      });

      // 3. Crear nuevas relaciones con cantidades
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
      message: "Error de base de datos al actualizar la promoción.",
      payload: rawData,
    };
  }

  revalidatePath("/promociones");
  redirect("/promociones");
}

// --- ELIMINAR PROMOCIÓN ---
export async function eliminarPromocion(id: number, formData: FormData) {
  try {
    await prisma.promocion.delete({
      where: { id },
    });
    
    revalidatePath("/promociones");
  } catch (error) {
    console.error("Error al eliminar:", error);
    // En producción podrías retornar un error para mostrarlo
  }
  
  // Redirigimos fuera del try/catch para evitar errores de Next.js
  redirect("/promociones");
}


// --- OBTENER PROMOCIÓN POR ID ---
export async function obtenerPromocionPorId(id: number) {
  try {
    const promocion = await prisma.promocion.findUnique({
      where: { id },
      include: {
        productos: {
          include: {
            producto: true, // Incluimos detalles del producto
          },
        },
      },
    });

    if (!promocion) return null;

    return {
      ...promocion,
      precio: Number(promocion.precio),
      // Mapeamos los productos al formato que usa el frontend
      productos: promocion.productos.map((p) => ({
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


