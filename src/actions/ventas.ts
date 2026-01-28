"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. Buscar Productos
export async function buscarProductosVenta(query: string) {
  const productos = await prisma.producto.findMany({
    where: {
      OR: [
        { nombre: { contains: query, mode: "insensitive" } },
        { codigoBarra: { contains: query } },
      ],
      stock: { gt: 0 }
    },
    take: 20,
  });

  return productos.map((producto) => ({
    ...producto,
    precio: producto.precio.toNumber(), // Convierte Decimal -> Number para el frontend
  }));
}

// 2. Buscar Clientes
export async function buscarClienteVenta(query: string) {
  if (!query) return [];
  
  const clientes = await prisma.cuenta_corriente.findMany({
    where: {
      OR: [
        { nombre: { contains: query, mode: "insensitive" } },
        { cuit: { contains: query } },
      ]
    },
    take: 5
  });

  return clientes.map((cliente) => ({
    ...cliente,
    saldo: cliente.saldo.toNumber(),
  }));
}

// 3. PROCESAR VENTA (ACTUALIZADO CON MOVIMIENTOS)
export async function procesarVenta(
  items: { id: number; cantidad: number }[], 
  total: number, 
  clienteId?: number | null
) {
  try {
    await prisma.$transaction(async (tx) => {
      
      // 1. DESCONTAR STOCK DE PRODUCTOS
      for (const item of items) {
        const producto = await tx.producto.findUnique({ where: { id: item.id } });
        
        if (!producto || producto.stock < item.cantidad) {
          throw new Error(`Stock insuficiente para el producto ID: ${item.id}`);
        }

        await tx.producto.update({
          where: { id: item.id },
          data: { stock: { decrement: item.cantidad } }
        });
      }

      // 2. SI HAY CLIENTE -> DESCONTAR SALDO Y CREAR MOVIMIENTO
      if (clienteId) {
        // A. Descontar el dinero de la cuenta (decrement)
        // NOTA: Asumiendo que el saldo positivo es dinero a favor del cliente.
        // Si "saldo" representa deuda, deberías usar 'increment'.
        await tx.cuenta_corriente.update({
          where: { id: clienteId },
          data: { saldo: { decrement: total } } 
        });

        // B. Registrar el movimiento en el historial
        // IMPORTANTE: Aquí usamos 'movimiento' (minuscula) porque así lo genera Prisma
        await tx.movimiento.create({
          data: {
            cuentaCorrienteId: clienteId,
            descripcion: "Compra de productos / Venta Mostrador",
            monto: total,
            tipo: "DEBITO" // O "VENTA", según como prefieras clasificarlo
          }
        });
      }
    });

    // 3. Revalidar todas las pantallas afectadas
    revalidatePath("/inventario");
    revalidatePath("/venta"); 
    revalidatePath("/cuentas-corrientes"); 
    
    return { success: true, message: "Venta procesada correctamente" };

  } catch (error: any) {
    console.error("Error al procesar venta:", error);
    return { success: false, message: error.message || "Error al procesar la venta" };
  }
}