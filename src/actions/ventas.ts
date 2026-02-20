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
    // A. Construir la condición básica (Texto)
    const whereClause: any = {
      OR: query ? [
        { nombre: { contains: query, mode: "insensitive" } },
        { codigoBarra: { contains: query, mode: "insensitive" } },
      ] : undefined,
      // Por defecto solo mostramos stock > 0 si no hay filtro de stock específico,
      // PERO si el usuario filtra por "Sin Stock", debemos permitir verlos.
      // Lo manejamos abajo en el paso C.
    };

    // B. Filtro: Categoría (Tipo de producto)
    if (filters?.category && filters.category !== "Todas") {
        whereClause.tipo = { equals: filters.category, mode: "insensitive" };
    }

    // C. Filtro: Estado del Stock
    if (filters?.stockStatus && filters.stockStatus !== 'all') {
        if (filters.stockStatus === 'low') {
            // Bajo stock: mayor a 0 y menor o igual a 10
            whereClause.stock = { gt: 0, lte: 10 }; 
        } else if (filters.stockStatus === 'none') {
            // Sin stock: 0 o menos
            whereClause.stock = { lte: 0 }; 
        }
    } else {
        // Comportamiento por defecto: Si no hay filtro de stock explícito, 
        // normalmente queremos ver cosas que se puedan vender (stock > 0).
        // Si prefieres ver TODO siempre, borra este bloque else.
        if (!whereClause.stock) { 
             whereClause.stock = { gt: 0 }; 
        }
    }

    // D. Filtro: Rango de Precio
    if (filters?.priceRange) {
        const min = parseFloat(filters.priceRange.min);
        const max = parseFloat(filters.priceRange.max);
        
        // Solo aplicamos si al menos uno es un número válido
        if (!isNaN(min) || !isNaN(max)) {
            whereClause.precio = {};
            if (!isNaN(min)) whereClause.precio.gte = min;
            if (!isNaN(max)) whereClause.precio.lte = max;
        }
    }

    // E. Ejecutar la consulta
    const productos = await prisma.producto.findMany({
      where: whereClause,
      take: 20, // Limitamos para rendimiento
      orderBy: [
        { fechaVencimiento: 'asc' },
        { nombre: 'asc' }
      ]
    });

    return productos.map((producto) => ({
      ...producto,
      precio: producto.precio.toNumber(), // Decimal -> Number
    }));

  } catch (error) {
      console.error("Error buscando productos:", error);
      return [];
  }
}

// 2. BUSCAR CLIENTES
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
        await tx.cuenta_corriente.update({
          where: { id: clienteId },
          data: { saldo: { decrement: total } } 
        });

        await tx.movimiento.create({
          data: {
            cuentaCorrienteId: clienteId,
            descripcion: "Compra de productos / Venta Mostrador",
            monto: total,
            tipo: "DEBITO"
          }
        });
      }
    });

    // 3. Revalidar
    revalidatePath("/inventario");
    revalidatePath("/venta"); 
    revalidatePath("/cuentas-corrientes"); 
    
    return { success: true, message: "Venta procesada correctamente" };

  } catch (error: any) {
    console.error("Error al procesar venta:", error);
    return { success: false, message: error.message || "Error al procesar la venta" };
  }
}

export async function obtenerCategorias() {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: { nombre: 'asc' }, // Ordenadas alfabéticamente
    });

    // Devolvemos solo un array de strings: ["Bebidas", "Limpieza", etc.]
    return categorias.map((c) => c.nombre);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return [];
  }
}