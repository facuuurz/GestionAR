import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleGenerativeAIStream, StreamingTextResponse } from 'ai';
import { prisma } from '@/lib/prisma';

// Permitir tiempos de respuesta más largos para IA
export const maxDuration = 60; 

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Recopilación de contexto total desde la DB
    const [
      productos,
      categorias,
      proveedores,
      cuentasCorrientes,
      promociones,
      ventas
    ] = await Promise.all([
      prisma.producto.findMany(),
      prisma.categoria.findMany(),
      prisma.proveedor.findMany(),
      prisma.cuenta_corriente.findMany(),
      prisma.promocion.findMany(),
      prisma.venta.findMany({ include: { cuenta: true } }),
    ]);

    const contextoJSON = {
      fechaActual: new Date().toISOString(),
      productos: productos.map(p => ({ id: p.id, nombre: p.nombre, codigoBarra: p.codigoBarra, stock: p.stock, precio: Number(p.precio), tipo: p.tipo, proveedor: p.proveedor })),
      categorias: categorias.map(c => c.nombre),
      proveedores: proveedores.map(p => ({ codigo: p.codigo, razonSocial: p.razonSocial, contacto: p.contacto })),
      cuentasCorrientes: cuentasCorrientes.map(c => ({ id: c.id, razonSocial: c.nombre, saldo: Number(c.saldo), estado: c.estado })),
      promociones: promociones.map(p => ({ nombre: p.nombre, descripcion: p.descripcion, precio: Number(p.precio), activo: p.activo })),
      ventasResumen: ventas.map(v => ({ id: v.id, fecha: v.fecha, total: Number(v.total), cliente: v.cuenta?.nombre || 'Consumidor Final' }))
    };

    const systemPrompt = `
      Eres el asistente integral de GestionAR.
      Tu objetivo es responder consultas del usuario sobre la operación del negocio basándote ÚNICAMENTE en este contexto JSON provisto: 
      
      ${JSON.stringify(contextoJSON)}
      
      Si la información no se encuentra en el contexto, indícalo cortésmente sin inventar datos. 
      Sé breve, profesional, formatea tu texto con Markdown para que sea fácil de leer y responde siempre en español.
    `;

    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      systemInstruction: systemPrompt
    });

    const historyString = messages.map((m: any) => `${m.role === 'user' ? 'Usuario' : 'Tú'}: ${m.content}`).join('\n');
    const result = await model.generateContentStream(historyString);

    const stream = GoogleGenerativeAIStream(result);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("Error API ChatBot:", error);
    return new Response(JSON.stringify({ error: "Error interno del servidor", details: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
