"use server";

import { prisma } from "@/lib/prisma";

export async function obtenerMetricasDashboard() {
  try {
    const hoy = new Date();

    // 1. INVENTARIO:
    const totalProductos = await prisma.producto.count();
    
    const productosStockBajo = await prisma.producto.count({
      where: { stock: { gt: 0, lte: 20 } }
    });

    const agregadosStock = await prisma.producto.aggregate({
      _sum: { stock: true }
    });
    const stockTotal = agregadosStock._sum.stock || 0;

    // 2. CUENTAS CORRIENTES:
    const clientesDeudores = await prisma.cuenta_corriente.count({
      where: { saldo: { lt: 0 } }
    });

    const deudaTotalAgregada = await prisma.cuenta_corriente.aggregate({
      _sum: { saldo: true },
      where: { saldo: { lt: 0 } }
    });

    // 3. PROMOCIONES (CORREGIDO): 
    // Contamos solo promociones vigentes que NO estén vacías
    const promocionesActivas = await prisma.promocion.count({
      where: {
        fechaInicio: { lte: hoy },
        fechaFin: { gte: hoy },
        items: {
          some: {} // ✅ Solo cuenta si tiene al menos 1 producto vinculado
        }
      }
    });

    // 4. PROVEEDORES:
    const totalProveedores = await prisma.proveedor.count();

    return {
      totalProductos,
      productosStockBajo,
      stockTotal,
      clientesDeudores,
      deudaTotal: Number(deudaTotalAgregada._sum.saldo || 0),
      promocionesActivas,
      totalProveedores
    };

  } catch (error) {
    console.error("Error obteniendo métricas:", error);
    return {
      totalProductos: 0,
      productosStockBajo: 0,
      stockTotal: 0,
      clientesDeudores: 0,
      deudaTotal: 0,
      promocionesActivas: 0,
      totalProveedores: 0
    };
  }
}