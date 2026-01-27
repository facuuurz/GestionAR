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
      
      // A. Descontar Stock de Productos
      for (const item of items) {
        const productoActual = await tx.producto.findUnique({ where: { id: item.id } });
        
        if (!productoActual || productoActual.stock < item.cantidad) {
          throw new Error(`Stock insuficiente para el producto ID: ${item.id}`);
        }

        await tx.producto.update({
          where: { id: item.id },
          data: { stock: { decrement: item.cantidad } }
        });
      }

      // B. Lógica de Cliente (Cuenta Corriente)
      if (clienteId) {
        // 1. Descontar el saldo (Aumentar la deuda)
        await tx.cuenta_corriente.update({
          where: { id: clienteId },
          data: { saldo: { decrement: total } } 
        });

        // 2. REGISTRAR EL MOVIMIENTO DE DÉBITO [NUEVO]
        // Esto asegura que la venta aparezca en el historial
        await tx.movimiento.create({
            data: {
                cuentaCorrienteId: clienteId,
                tipo: "DEBITO", 
                monto: total, // Guardamos el valor absoluto
                descripcion: `Compra de productos (${items.length} ítems)`, 
            }
        });

        // 3. Actualizar Estado del Cliente
        const cuentaActualizada = await tx.cuenta_corriente.findUnique({ where: { id: clienteId } });
        
        if (cuentaActualizada) {
            const saldoNumerico = cuentaActualizada.saldo.toNumber();
            const nuevoEstado = saldoNumerico < 0 ? "Deudor" : "Al Día";

            if (cuentaActualizada.estado !== nuevoEstado) {
                await tx.cuenta_corriente.update({
                    where: { id: clienteId },
                    data: { estado: nuevoEstado }
                });
            }
        }
      }
    });

    // Revalidación de rutas
    revalidatePath("/inventario");
    revalidatePath("/venta"); 
    revalidatePath("/cuentas-corrientes");
    
    // Si hubo un cliente, revalidamos su página de detalle específica
    if (clienteId) {
        revalidatePath(`/cuentas-corrientes/${clienteId}`);
    }
    
    return { success: true, message: "Venta procesada correctamente" };

  } catch (error: any) {
    console.error("Error al procesar venta:", error);
    return { success: false, message: error.message || "Error al procesar la venta" };
  }
}