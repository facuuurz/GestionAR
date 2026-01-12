"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// ----------------------------------------------------------------------
// 1. ESQUEMA DE VALIDACIÓN
// ----------------------------------------------------------------------

const productoSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio"),
  codigoBarra: z.string().min(1, "El código de barra es obligatorio"),
  proveedor: z.string().min(1, "El código de proveedor es obligatorio"),
  
  // Zod compatible con tu versión
  tipo: z.string().min(1, "Seleccione un tipo válido"),

  // Lógica para que Stock sea OBLIGATORIO (no vacío)
  stock: z.string()
    .trim()
    .min(1, "El stock es obligatorio") 
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val >= 0, { message: "El stock no puede ser negativo" }),

  // Lógica para que Precio sea OBLIGATORIO (no vacío)
  precio: z.string()
    .trim()
    .min(1, "El precio es obligatorio")
    .transform((val) => parseFloat(val))
    .refine((val) => !isNaN(val) && val > 0, { message: "El precio debe ser mayor a 0" }),
  
  descripcion: z.string().max(200, "Máximo 200 caracteres").optional(),
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
  };
  message?: string | null;
};

// ----------------------------------------------------------------------
// 2. FUNCIONES (ACTIONS)
// ----------------------------------------------------------------------

export async function obtenerProductosDB() {
  try {
    const productos = await prisma.producto.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return productos.map((p) => ({
      ...p,
      precio: Number(p.precio),
    }));
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return [];
  }
}

export async function crearProducto(prevState: State, formData: FormData) {
  // Validación
  const validatedFields = productoSchema.safeParse({
    nombre: formData.get("nombre"),
    codigoBarra: formData.get("codigoBarra"),
    proveedor: formData.get("proveedor"),
    tipo: formData.get("tipo"),
    stock: formData.get("stock"), 
    precio: formData.get("precio"),
    descripcion: formData.get("descripcion"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Faltan campos requeridos. Revisa el formulario.",
    };
  }

  const { nombre, codigoBarra, proveedor, tipo, stock, precio, descripcion } = validatedFields.data;

  try {
    await prisma.producto.create({
      data: {
        nombre,
        codigoBarra,
        proveedor,
        tipo,
        stock,
        precio,
        descripcion: descripcion || "",
      },
    });
  } catch (error) {
    console.error("Error DB:", error);
    return {
      message: "Error al guardar en la base de datos.",
    };
  }

  revalidatePath("/inventario");
  redirect("/inventario");
}

export async function actualizarProducto(formData: FormData) {
  const id = parseInt(formData.get("id") as string);
  
  const data = {
    nombre: formData.get("nombre") as string,
    codigoBarra: formData.get("codigoBarra") as string,
    stock: parseInt(formData.get("stock") as string) || 0,
    precio: parseFloat(formData.get("precio") as string) || 0,
    tipo: formData.get("tipo") as string,
    proveedor: formData.get("proveedor") as string,
    descripcion: formData.get("descripcion") as string,
  };

  await prisma.producto.update({
    where: { id },
    data,
  });

  revalidatePath("/inventario");
  redirect("/inventario");
}

export async function eliminarProducto(formData: FormData) {
  const id = parseInt(formData.get("id") as string);

  await prisma.producto.delete({
    where: { id },
  });

  revalidatePath("/inventario");
  redirect("/inventario");
}

export async function cargarDatosDePrueba() {
  await prisma.producto.createMany({
    data: [
      { nombre: "Producto A", stock: 10, precio: 100, tipo: "otros", codigoBarra: "111", proveedor: "P1", descripcion: "Test A" },
      { nombre: "Producto B", stock: 20, precio: 200, tipo: "otros", codigoBarra: "222", proveedor: "P2", descripcion: "Test B" },
    ]
  });
  revalidatePath("/inventario");
}