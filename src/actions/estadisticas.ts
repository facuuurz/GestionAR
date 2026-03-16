"use server";

import { prisma } from "@/lib/prisma"; // Asegurar que sea la ruta correcta a tu instancia prisma

export async function getEstadisticas() {
  try {
    const now = new Date();

    // Determinar Rangos de Fechas
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Domingo
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [
      facturacionHoyAggr,
      facturacionSemanaAggr,
      facturacionMesAggr,
      todasLasVentas,
      topVolumen,
      topFacturacion,
      todosLosProductos,
      deudoresPeligrosos
    ] = await Promise.all([
      // 1. Facturación Bruta (Hoy, Semana, Mes)
      prisma.venta.aggregate({
        where: { fecha: { gte: startOfToday } },
        _sum: { total: true }
      }),
      prisma.venta.aggregate({
        where: { fecha: { gte: startOfWeek } },
        _sum: { total: true }
      }),
      prisma.venta.aggregate({
        where: { fecha: { gte: startOfMonth } },
        _sum: { total: true }
      }),

      // 2. Horarios y Días Pico (Se traen todas para procesar en memoria rápido, o al menos las recientes)
      prisma.venta.findMany({
        select: { fecha: true }
      }),

      // 3. Top 5 Productos Más Vendidos (Por Volumen normalizado)
      prisma.detalleVenta.groupBy({
        by: ['productoId'],
        _sum: { cantidad: true }
      }).then(async (groupings) => {
         const ids = groupings.map(g => g.productoId);
         const prods = await prisma.producto.findMany({ 
           where: { id: { in: ids } }, 
           select: { id: true, esPorPeso: true, nombre: true } 
         });
         const pMap = new Map(prods.map(p => [p.id, p]));
         
         return groupings.map(g => {
            const p = pMap.get(g.productoId);
            const qty = g._sum.cantidad ? Number(g._sum.cantidad) : 0;
            const isPeso = p?.esPorPeso || false;
            return {
               productoId: g.productoId,
               nombre: p?.nombre || `Producto #${g.productoId}`,
               cantidad: isPeso ? qty / 1000 : qty,
               esPorPeso: isPeso
            };
         }).sort((a, b) => b.cantidad - a.cantidad).slice(0, 5);
      }),

      // 4. Top 5 Productos Estrella (Por Facturación normalizada)
      prisma.detalleVenta.groupBy({
        by: ['productoId'],
        _sum: { subtotal: true }
      }).then(async (groupings) => {
         const ids = groupings.map(g => g.productoId);
         const prods = await prisma.producto.findMany({ 
           where: { id: { in: ids } }, 
           select: { id: true, esPorPeso: true, nombre: true } 
         });
         const pMap = new Map(prods.map(p => [p.id, p]));
         
         return groupings.map(g => {
            const p = pMap.get(g.productoId);
            const subtotal = g._sum.subtotal ? Number(g._sum.subtotal) : 0;
            const isPeso = p?.esPorPeso || false;
            return {
               productoId: g.productoId,
               nombre: p?.nombre || `Producto #${g.productoId}`,
               // Si el producto fue ingresado como peso (gramos), probablemente el subtotal se calculó mal en la bd originaria (cantidad * precioUnitario = gramos * precio). Lo dividimos por 1000 para volverlo a base kilos.
               subtotal: isPeso ? subtotal / 1000 : subtotal,
               esPorPeso: isPeso
            };
         }).sort((a, b) => b.subtotal - a.subtotal).slice(0, 5);
      }),

      // 5. Ranking de "Huesos"
      // Traemos productos con stock > 0 e incluimos cuándo fue su última venta (si la tiene)
      prisma.producto.findMany({
        where: { stock: { gt: 0 } },
        select: { id: true, nombre: true, stock: true },
      }),

      // 6. Top 5 Deudores Peligrosos
      prisma.cuenta_corriente.findMany({
        where: { saldo: { lt: 0 } },
        orderBy: { saldo: 'asc' }, // Más negativo primero
        take: 5,
        select: { id: true, nombre: true, saldo: true, telefono: true }
      })
    ]);

    // Procesar Horarios y Días Pico
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const conteoDias: Record<string, number> = {};
    const conteoHoras: Record<number, number> = {};

    todasLasVentas.forEach(v => {
      const d = new Date(v.fecha);
      const nombreDia = diasSemana[d.getDay()];
      const hora = d.getHours();

      conteoDias[nombreDia] = (conteoDias[nombreDia] || 0) + 1;
      conteoHoras[hora] = (conteoHoras[hora] || 0) + 1;
    });

    let diaPico = 'N/A';
    let maxVentasDia = 0;
    for (const [dia, cant] of Object.entries(conteoDias)) {
      if (cant > maxVentasDia) {
        maxVentasDia = cant;
        diaPico = dia;
      }
    }

    let horaPico = -1;
    let maxVentasHora = 0;
    for (const [horaTxt, cant] of Object.entries(conteoHoras)) {
      if (cant > maxVentasHora) {
        maxVentasHora = cant;
        horaPico = parseInt(horaTxt);
      }
    }
    const txtHoraPico = horaPico !== -1 ? `${horaPico}:00 - ${horaPico + 1}:00` : 'N/A';

    // Generar arreglo de Trafico por Dia
    const traficoPorDia = [
      { dia: 'L', fullDia: 'Lunes', ventas: conteoDias['Lunes'] || 0 },
      { dia: 'M', fullDia: 'Martes', ventas: conteoDias['Martes'] || 0 },
      { dia: 'X', fullDia: 'Miércoles', ventas: conteoDias['Miércoles'] || 0 },
      { dia: 'J', fullDia: 'Jueves', ventas: conteoDias['Jueves'] || 0 },
      { dia: 'V', fullDia: 'Viernes', ventas: conteoDias['Viernes'] || 0 },
      { dia: 'S', fullDia: 'Sábado', ventas: conteoDias['Sábado'] || 0 },
      { dia: 'D', fullDia: 'Domingo', ventas: conteoDias['Domingo'] || 0 },
    ];

    // La información de los tops ya incluye los nombres debido al .then() en el Promise.all

    // Procesar Huesos (Sin ventas en los últimos 30 días)
    // Para simplificar y hacerlo rápido, buscaremos si estos productos tuvieron ventas recientes.
    const IDsProductosConStock = todosLosProductos.map(p => p.id);

    const ventasRecientesHuesosAux = await prisma.detalleVenta.groupBy({
      by: ['productoId'],
      where: {
        productoId: { in: IDsProductosConStock },
        venta: { fecha: { gte: thirtyDaysAgo } }
      }
    });

    const idsConVentasRecientes = new Set(ventasRecientesHuesosAux.map(v => v.productoId));

    const huesos = todosLosProductos
      .filter(p => !idsConVentasRecientes.has(p.id))
      .sort((a, b) => b.stock - a.stock) // Los que tienen MAS stock atrapado primero
      .slice(0, 5)
      .map(p => ({ nombre: p.nombre, stock: p.stock }));

    return {
      facturacion: {
        hoy: facturacionHoyAggr._sum.total ? Number(facturacionHoyAggr._sum.total) : 0,
        semana: facturacionSemanaAggr._sum.total ? Number(facturacionSemanaAggr._sum.total) : 0,
        mes: facturacionMesAggr._sum.total ? Number(facturacionMesAggr._sum.total) : 0
      },
      picos: {
        dia: diaPico,
        hora: txtHoraPico,
        traficoPorDia: traficoPorDia
      },
      topVolumen,
      topFacturacion,
      huesos,
      deudoresPeligrosos: deudoresPeligrosos.map(d => ({
        ...d,
        saldo: Number(d.saldo)
      }))
    };

  } catch (error) {
    console.error("Error obteniendo estadísticas:", error);
    throw new Error("No se pudieron cargar las estadísticas.");
  }
}
