"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// --- TIPOS ---
type Filters = {
  category?: string;
  stockStatus?: string; // 'all' | 'low' | 'none'
  priceRange?: { min: string; max: string };
};

// 1. BUSCAR PRODUCTOS (CON FILTROS AVANZADOS)
export async function buscarProductosVenta(query: string, filters?: Filters) {
  try {
    const whereClause: any = {
      OR: query ? [
        { nombre: { contains: query, mode: "insensitive" } },
        { codigoBarra: { contains: query, mode: "insensitive" } },
      ] : undefined,
    };

    if (filters?.category && filters.category !== "Todas") {
      whereClause.tipo = { equals: filters.category, mode: "insensitive" };
    }

    if (filters?.stockStatus && filters.stockStatus !== 'all') {
      if (filters.stockStatus === 'low') {
        whereClause.stock = { gt: 0, lte: 10 }; 
      } else if (filters.stockStatus === 'none') {
        whereClause.stock = { lte: 0 }; 
      }
    } else {
      if (!whereClause.stock) { 
        whereClause.stock = { gt: 0 }; 
      }
    }

    if (filters?.priceRange) {
      const min = parseFloat(filters.priceRange.min);
      const max = parseFloat(filters.priceRange.max);
      if (!isNaN(min) || !isNaN(max)) {
        whereClause.precio = {};
        if (!isNaN(min)) whereClause.precio.gte = min;
        if (!isNaN(max)) whereClause.precio.lte = max;
      }
    }

    const productos = await prisma.producto.findMany({
      where: whereClause,
      take: 20,
      orderBy: [
        { fechaVencimiento: 'asc' },
        { nombre: 'asc' }
      ]
    });

    return productos.map((producto) => ({
      ...producto,
      precio: producto.precio.toNumber(),
    }));

  } catch (error) {
    console.error("Error buscando productos:", error);
    return [];
  }
}

// 2. BUSCAR CLIENTES (CUENTAS CORRIENTES)
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

// 3. PROCESAR VENTA
export async function procesarVenta(
  items: { id: number; nombre: string; cantidad: number; precio: number; esPromo?: boolean }[], 
  total: number, 
  metodoPago: string,
  clienteId?: number | null
) {
  try {
    const resultado = await prisma.$transaction(async (tx) => {
      
      // A. Crear la Venta y sus Detalles
      const nuevaVenta = await tx.venta.create({
        data: {
          codigoVenta: `VEN-${Date.now()}`, 
          metodoPago: metodoPago,
          montoTotal: total,
          cuentaCorrienteId: clienteId || null,
          cliente: clienteId ? undefined : "Consumidor Final",
          items: {
            create: items.map(item => ({
              productoId: item.id,
              nombre: item.nombre,
              cantidad: item.cantidad,
              precioUnitario: item.precio,
              esPromo: item.esPromo || false
            }))
          }
        }
      });

      // B. Descontar Stock
      for (const item of items) {
        await tx.producto.update({
          where: { id: item.id },
          data: { stock: { decrement: Math.ceil(item.cantidad) } } 
        });
      }

      // C. Si es Cuenta Corriente, actualizar saldo y crear movimiento
      if (metodoPago === "Cuenta Corriente" && clienteId) {
        await tx.cuenta_corriente.update({
          where: { id: clienteId },
          data: { saldo: { increment: total } } // Incrementa la deuda
        });

        await tx.movimiento.create({
          data: {
            cuentaCorrienteId: clienteId,
            descripcion: `Compra - Ref: ${nuevaVenta.codigoVenta}`,
            monto: total,
            tipo: "DEBITO"
          }
        });
      }

      return nuevaVenta;
    });

    revalidatePath("/inventario");
    revalidatePath("/venta"); 
    revalidatePath("/cuentas-corrientes"); 
    
    return { success: true, message: "Venta procesada con éxito", id: resultado.id };

  } catch (error: any) {
    console.error("Error al procesar venta:", error);
    return { success: false, message: error.message || "Error al procesar la venta" };
  }
}

// 4. OBTENER CATEGORÍAS
export async function obtenerCategorias() {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: { nombre: 'asc' },
    });
    return categorias.map((c) => c.nombre);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return [];
  }
}

// 5. OBTENER HISTORIAL DE VENTAS
export async function obtenerHistorialVentas(query: string) {
  try {
    const whereClause: any = {};

    if (query) {
      const isNumeric = !isNaN(Number(query));
      whereClause.OR = [
        { codigoVenta: { contains: query, mode: "insensitive" } },
        { cliente: { contains: query, mode: "insensitive" } },
        ...(isNumeric ? [{ id: Number(query) }] : []),
        { cuentaCorriente: { nombre: { contains: query, mode: "insensitive" } } }
      ];
    }

    const ventas = await prisma.venta.findMany({
      where: whereClause,
      include: { 
        cuentaCorriente: true,
        items: true 
      },
      orderBy: { fecha: 'desc' },
      take: 50
    });

    return ventas.map(v => ({
      id: v.id,
      codigoVenta: v.codigoVenta,
      fecha: v.fecha.toLocaleDateString('es-AR'),
      cliente: v.cuentaCorriente?.nombre || v.cliente,
      montoTotal: v.montoTotal.toNumber(),
      metodoPago: v.metodoPago,
      items: v.items.map(i => ({
        nombre: i.nombre,
        cantidad: i.cantidad,
        precioUnitario: i.precioUnitario.toNumber(),
        esPromo: i.esPromo
      }))
    }));
  } catch (error) {
    console.error("Error al obtener historial:", error);
    return [];
  }
}