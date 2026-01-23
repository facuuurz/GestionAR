// src/actions/dashboard.ts
"use server";

import { prisma } from "@/lib/prisma";

export async function obtenerMetricasDashboard() {
  try {
    const hoy = new Date();

    // 1. INVENTARIO: Contar total de productos
    const totalProductos = await prisma.producto.count();

    // 2. CUENTAS CORRIENTES:
    // - Cantidad de clientes con deuda (saldo negativo)
    // - Total de dinero pendiente (suma de saldos negativos)
    // Nota: Asumo que saldo < 0 es deuda. Si es al revés, cambia la condición.
    const clientesDeudores = await prisma.cuenta_corriente.count({
      where: { saldo: { lt: 0 } }
    });

    const deudaTotalAgregada = await prisma.cuenta_corriente.aggregate({
      _sum: { saldo: true },
      where: { saldo: { lt: 0 } }
    });

    // 3. PROMOCIONES: Contar las que están activas hoy
    const promocionesActivas = await prisma.promocion.count({
      where: {
        fechaInicio: { lte: hoy }, // Empezó antes o hoy
        fechaFin: { gte: hoy }     // Termina hoy o después
      }
    });

    // 4. PROVEEDORES: Total de proveedores
    const totalProveedores = await prisma.proveedor.count(); // Asumiendo modelo Proveedor

    return {
      totalProductos,
      clientesDeudores,
      deudaTotal: Number(deudaTotalAgregada._sum.saldo || 0), // Convertir Decimal a Number
      promocionesActivas,
      totalProveedores
    };

  } catch (error) {
    console.error("Error obteniendo métricas:", error);
    // Retornamos ceros en caso de error para no romper la UI
    return {
      totalProductos: 0,
      clientesDeudores: 0,
      deudaTotal: 0,
      promocionesActivas: 0,
      totalProveedores: 0
    };
  }
}