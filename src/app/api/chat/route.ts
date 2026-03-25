import { streamText, tool } from 'ai';
import { google } from '@ai-sdk/google';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Permitir tiempos de respuesta más largos para IA
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const systemPrompt = `
      Eres el asistente integral de GestionAR.
      Tu objetivo es responder consultas del usuario sobre la operación del negocio.
      Para obtener información, DEBES invocar las herramientas ("tools") disponibles; ya NO tienes la base de datos pre-cargada.
      
      REGLA ESTRICTA: Si la información no se encuentra usando las herramientas, indícalo cortésmente sin inventar datos.
      Sé breve, profesional, formatea tu texto con Markdown para que sea fácil de leer y responde siempre en español.
    `;

    const result = await streamText({

      //model: google('gemini-1.5-flash'),
      model: google('gemini-2.5-flash'),

      system: systemPrompt,
      messages,
      maxSteps: 3, // Permite que el modelo llame a una herramienta, reciba los datos y de una respuesta.
      tools: {
        buscarProductos: tool({
          description: 'Busca productos en el inventario. Permite filtrar por nombre, código, bajo stock, tipo o categoría, rango de precio o proveedor.',
          parameters: z.object({
            busqueda: z.string().optional().describe('Búsqueda por nombre o código.'),
            bajoStock: z.boolean().optional().describe('Filtrar productos con stock bajo.'),
            umbralStock: z.number().optional().describe('Umbral de bajo stock (por defecto 10).'),
            tipo: z.string().optional().describe('Filtrar por categoría o tipo de producto (ej. "bebida", "comida").'),
            precioMin: z.number().optional().describe('Precio mínimo.'),
            precioMax: z.number().optional().describe('Precio máximo.'),
            proveedor: z.string().optional().describe('Filtrar por código de proveedor.')
          }),
          execute: async ({ busqueda, bajoStock, umbralStock, tipo, precioMin, precioMax, proveedor }) => {
            const whereClause: any = {};
            if (busqueda) {
              whereClause.OR = [
                { nombre: { contains: busqueda, mode: 'insensitive' as const } },
                { codigoBarra: { contains: busqueda } }
              ];
            }
            if (bajoStock) {
              whereClause.stock = { lte: umbralStock !== undefined ? umbralStock : 10 };
            }
            if (tipo) whereClause.tipo = { contains: tipo, mode: 'insensitive' as const };
            if (precioMin !== undefined) whereClause.precio = { ...whereClause.precio, gte: precioMin };
            if (precioMax !== undefined) whereClause.precio = { ...whereClause.precio, lte: precioMax };
            if (proveedor) whereClause.proveedor = { contains: proveedor, mode: 'insensitive' as const };
            const resultados = await prisma.producto.findMany({
              where: whereClause,
              take: 50,
              select: { nombre: true, codigoBarra: true, stock: true, precio: true, tipo: true, proveedor: true }
            });
            return { resultados };
          }
        }),
        verVentas: tool({
          description: 'Consulta ventas registradas ordenadas desde la más reciente. Permite filtrar por cliente o por margen de días y monto.',
          parameters: z.object({
            limite: z.number().optional().describe('Cantidad de ventas a obtener (por defecto 20).'),
            clienteBusqueda: z.string().optional().describe('Buscar ventas por nombre de cliente.'),
            diasAtras: z.number().optional().describe('Filtrar ventas de los últimos N días (ej: 7 para la última semana).'),
            montoMin: z.number().optional().describe('Filtrar ventas cuyo monto total sea mayor o igual a este valor.')
          }),
          execute: async ({ limite, clienteBusqueda, diasAtras, montoMin }) => {
            const whereClause: any = {};
            if (clienteBusqueda) {
              whereClause.cuenta = { nombre: { contains: clienteBusqueda, mode: 'insensitive' as const } };
            }
            if (diasAtras !== undefined) {
              const date = new Date();
              date.setDate(date.getDate() - diasAtras);
              whereClause.fecha = { gte: date };
            }
            if (montoMin !== undefined) {
              whereClause.total = { gte: montoMin };
            }
            const resultados = await prisma.venta.findMany({
              where: whereClause,
              take: limite || 20,
              orderBy: { fecha: 'desc' },
              include: { cuenta: { select: { nombre: true } } }
            });
            return { resultados };
          }
        }),
        buscarProveedores: tool({
          description: 'Lista o busca proveedores registrados.',
          parameters: z.object({
             busqueda: z.string().optional().describe('Buscar proveedor por razón social, teléfono o email.'),
             soloActivos: z.boolean().optional().describe('Traer solo proveedores activos (true) o inactivos (false).')
          }),
          execute: async ({ busqueda, soloActivos }) => {
            const whereClause: any = {};
            if (busqueda) {
               whereClause.OR = [
                 { razonSocial: { contains: busqueda, mode: 'insensitive' as const } },
                 { telefono: { contains: busqueda } },
                 { email: { contains: busqueda, mode: 'insensitive' as const } }
               ];
            }
            if (soloActivos !== undefined) {
               whereClause.activo = soloActivos;
            }
            const resultados = await prisma.proveedor.findMany({
              where: whereClause,
              take: 30,
              select: { codigo: true, razonSocial: true, contacto: true, telefono: true, email: true, activo: true }
            });
            return { resultados };
          }
        }),
        buscarCuentas: tool({
          description: 'Consulta clientes y sus cuentas corrientes (saldo disponible y estado). Permite listar deudores.',
          parameters: z.object({
            nombreCliente: z.string().optional().describe('Buscar cuenta corriente o cliente por nombre.'),
            cuit: z.string().optional().describe('Buscar por número CUIT exacto o parcial.'),
            estado: z.string().optional().describe('Filtrar por estado exacto (ej. "Al Día", "Moroso").'),
            soloConDeuda: z.boolean().optional().describe('Si es verdadero, retorna sólo los clientes con deudas/saldo negativo (< 0).')
          }),
          execute: async ({ nombreCliente, cuit, estado, soloConDeuda }) => {
            const whereClause: any = {};
            if (nombreCliente) {
              whereClause.nombre = { contains: nombreCliente, mode: 'insensitive' as const };
            }
            if (cuit) {
              whereClause.cuit = { contains: cuit };
            }
            if (estado) {
              whereClause.estado = estado;
            }
            if (soloConDeuda) {
              whereClause.saldo = { lt: 0 };
            }
            const resultados = await prisma.cuenta_corriente.findMany({
              where: whereClause,
              take: 30,
              select: { nombre: true, cuit: true, saldo: true, estado: true, telefono: true, email: true }
            });
            return { resultados };
          }
        }),
        buscarPromociones: tool({
          description: 'Busca promociones en la base de datos.',
          parameters: z.object({
             activas: z.boolean().optional().describe('Filtrar solo promociones activas actuales.')
          }),
          execute: async ({ activas }) => {
             const whereClause: any = {};
             if (activas) {
                const hoy = new Date();
                whereClause.activo = true;
                whereClause.fechaInicio = { lte: hoy };
                whereClause.fechaFin = { gte: hoy };
             }
             const resultados = await prisma.promocion.findMany({
                where: whereClause,
                take: 10,
                select: { nombre: true, descripcion: true, precio: true, fechaInicio: true, fechaFin: true, activo: true }
             });
             return { resultados };
          }
        })
      }
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error API ChatBot:", error);
    return new Response(JSON.stringify({ error: "Error interno del servidor", details: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
