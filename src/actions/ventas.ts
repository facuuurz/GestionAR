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

export async function obtenerHistorialVentas() {
  try {
    const ventas = await prisma.venta.findMany({
      orderBy: { fecha: 'desc' },
      include: {
        cuenta: true,
      },
      take: 100 
    });

    return ventas.map((venta) => {
      const dia = String(venta.fecha.getDate()).padStart(2, '0');
      const mes = String(venta.fecha.getMonth() + 1).padStart(2, '0');
      const anio = venta.fecha.getFullYear();

      const montoFormateado = new Intl.NumberFormat("es-AR", {
        style: "currency",
        currency: "ARS",
        minimumFractionDigits: 2,
      }).format(Number(venta.total));

      return {
        idRaw: venta.id,
        id: `#V-${venta.id}`,
        fecha: `${dia}/${mes}/${anio}`,
        cuit: venta.cuenta?.cuit || "-", 
        clienteNombre: venta.cuenta?.nombre || "Consumidor Final",
        monto: montoFormateado,
      };
    });

  } catch (error) {
    console.error("Error al obtener historial:", error);
    return [];
  }
}

export async function procesarVenta(
  items: { id: number; cantidad: number }[], 
  total: number, 
  clienteId?: number | null
) {
  try {
    await prisma.$transaction(async (tx) => {
      
      const nuevaVenta = await tx.venta.create({
        data: {
          total: total,
          cuentaCorrienteId: clienteId || null,
          fecha: new Date(),
        }
      });

      for (const item of items) {
        const producto = await tx.producto.findUnique({ where: { id: item.id } });
        
        if (!producto || producto.stock < item.cantidad) {
          throw new Error(`Stock insuficiente para el producto ID: ${item.id}`);
        }

        await tx.producto.update({
          where: { id: item.id },
          data: { stock: { decrement: item.cantidad } }
        });

        await tx.detalleVenta.create({
          data: {
            ventaId: nuevaVenta.id,
            productoId: item.id,
            cantidad: item.cantidad,
            precioUnit: producto.precio, 
            subtotal: Number(producto.precio) * item.cantidad
          }
        });
      }

      if (clienteId) {
        await tx.cuenta_corriente.update({
          where: { id: clienteId },
          data: { saldo: { decrement: total } } 
        });

        await tx.movimiento.create({
          data: {
            cuentaCorrienteId: clienteId,
            descripcion: `Compra #V-${nuevaVenta.id}`,
            monto: total,
            tipo: "DEBITO"
          }
        });
      }
    });

    revalidatePath("/historial-ventas"); 
    revalidatePath("/inventario");
    
    return { success: true, message: "Venta registrada con éxito" };

  } catch (error: any) {
    console.error("Error al procesar venta:", error);
    return { success: false, message: error.message || "Error al procesar la venta" };
  }
}

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

// Agrégalo al final de src/actions/ventas.ts

export async function obtenerDetalleVenta(idRaw: number) {
  try {
    const venta = await prisma.venta.findUnique({
      where: { id: idRaw },
      include: {
        cuenta: true,
        detalles: {
          include: { producto: true }
        }
      }
    });

    if (!venta) return null;

    // Helper para formatear moneda
    const formatear = (valor: any) => new Intl.NumberFormat("es-AR", {
        style: "currency", currency: "ARS", minimumFractionDigits: 2
    }).format(Number(valor));

    const dia = String(venta.fecha.getDate()).padStart(2, '0');
    const mes = String(venta.fecha.getMonth() + 1).padStart(2, '0');
    const anio = venta.fecha.getFullYear();
    const hora = String(venta.fecha.getHours()).padStart(2, '0');
    const minutos = String(venta.fecha.getMinutes()).padStart(2, '0');

    let subtotalGeneral = 0;
    let descuentoTotal = 0;

    // Mapear productos y calcular si hubo promociones
    const productos = venta.detalles.map((det) => {
        const precioLista = Number(det.producto.precio); 
        const precioCobrado = Number(det.precioUnit);
        const cantidad = Number(det.cantidad);

        subtotalGeneral += (precioLista * cantidad);
        
        const esPromo = precioCobrado < precioLista;
        if (esPromo) {
            descuentoTotal += ((precioLista - precioCobrado) * cantidad);
        }

        return {
            nombre: det.producto.nombre,
            sku: det.producto.codigoBarra || "S/C",
            // Si tiene decimales mostramos "kg", sino unidad normal
            cantidad: cantidad % 1 !== 0 ? `${cantidad.toFixed(3)} kg` : `${cantidad}`,
            precioUnitario: formatear(precioLista),
            precioPromocional: esPromo ? formatear(precioCobrado) : null,
            descuentoEtiqueta: esPromo ? "Precio Especial" : null,
            subtotal: formatear(det.subtotal)
        };
    });

    return {
        idVisual: `#V-${venta.id}`,
        fecha: `${dia}/${mes}/${anio}`,
        hora: `${hora}:${minutos}`,
        cliente: venta.cuenta ? `${venta.cuenta.nombre} (${venta.cuenta.cuit})` : "Consumidor Final",
        productos,
        subtotalGeneral: formatear(subtotalGeneral),
        descuentoTotal: descuentoTotal > 0 ? `-${formatear(descuentoTotal)}` : null,
        totalFinal: formatear(venta.total)
    };

  } catch (error) {
    console.error("Error obteniendo detalle:", error);
    return null;
  }
}