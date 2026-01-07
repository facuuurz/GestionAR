"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// 1. Obtener productos (Lectura)
export async function obtenerProductosDB() {
  try {
    const productos = await prisma.producto.findMany({
      orderBy: { createdAt: 'desc' },
    });
    // Convertimos Decimal a number para que sea fácil de usar en el frontend
    return productos.map((p) => ({
      ...p,
      precio: Number(p.precio),
    }));
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return [];
  }
}

// 2. Crear producto (Escritura)
export async function crearProducto(formData: FormData) {
  const nombre = formData.get("nombre") as string;
  const codigoBarra = formData.get("codigoBarra") as string;
  const tipo = formData.get("tipo") as string;
  const proveedor = formData.get("proveedor") as string;
  const stock = formData.get("stock");
  const precio = formData.get("precio");

  if (!nombre) throw new Error("El nombre es obligatorio");

  await prisma.producto.create({
    data: {
      nombre,
      codigoBarra: codigoBarra || null,
      tipo: tipo || null,
      proveedor: proveedor || null,
      stock: stock ? parseInt(stock.toString()) : 0,
      precio: precio ? parseFloat(precio.toString()) : 0.00,
    },
  });

  revalidatePath("/inventario");
  redirect("/inventario");
}

// 3. Cargar datos de prueba
export async function cargarDatosDePrueba() {
  await prisma.producto.createMany({
    data: [
      { nombre: "Producto A", stock: 10, precio: 100, tipo: "General" },
      { nombre: "Producto B", stock: 20, precio: 200, tipo: "General" },
    ]
  });
  revalidatePath("/inventario");
}