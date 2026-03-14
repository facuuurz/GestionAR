"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { logger } from "@/lib/logger"; // <-- 1. IMPORTAMOS EL LOGGER

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
      logger.error({ err: error, query, filters }, "Error al buscar productos en el Punto de Venta");
      return [];
  }
}

// 2. BUSCAR CLIENTES
export async function buscarClienteVenta(query: string) {
  if (!query) return [];
  
  try {
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
  } catch (error) {
    logger.error({ err: error, query }, "Error al buscar cliente en el Punto de Venta");
    return [];
  }
}

// 3. OBTENER HISTORIAL
export async function obtenerHistorialVentas(empleadoId?: number) {
  try {
    const where = empleadoId ? { userId: empleadoId } : {};
    const ventas = await (prisma.venta as any).findMany({
      where,
      orderBy: { fecha: 'desc' },
      include: {
        cuenta: true,
        user: true,
      },
      take: 200 
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
        vendedorNombre: (venta as any).user?.name || (venta as any).user?.username || "Sistema",
      };
    });

  } catch (error) {
    logger.error({ err: error }, "Error al obtener el historial de ventas");
    return [];
  }
}

// 4. PROCESAR VENTA (CRÍTICO)
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

      // Log de éxito con contexto comercial
      logger.info({ 
        ventaId: nuevaVenta.id, 
        total, 
        clienteId: clienteId || "Consumidor Final",
        cantidadItems: items.length 
      }, "Venta procesada y registrada exitosamente");
    });

    revalidatePath("/historial-ventas"); 
    revalidatePath("/inventario");
    if (clienteId) revalidatePath("/cuentas-corrientes");
    
    return { success: true, message: "Venta registrada con éxito" };

  } catch (error: any) {
    // Log crítico: Pasamos los items exactos que se intentaron vender para poder rastrear qué falló
    logger.error({ err: error, items, total, clienteId }, "Fallo transaccional crítico al procesar la venta");
    return { success: false, message: error.message || "Error al procesar la venta" };
  }
}

// 5. OBTENER CATEGORÍAS
export async function obtenerCategorias() {
  try {
    const categorias = await prisma.categoria.findMany({
      orderBy: { nombre: 'asc' }, 
    });

    return categorias.map((c) => c.nombre);
  } catch (error) {
    logger.error({ err: error }, "Error al obtener categorías en ventas");
    return [];
  }
}

// 6. OBTENER DETALLE VENTA
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

    if (!venta) {
      logger.warn({ ventaId: idRaw }, "Intento de acceder a un detalle de venta inexistente");
      return null;
    }

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
    logger.error({ err: error, ventaId: idRaw }, "Error al intentar obtener el detalle de la venta");
    return null;
  }
}