'use server'

// 👇 IMPORTANTE: Ahora importamos desde tu nuevo archivo 'lib'
import { prisma } from "@/lib/prisma" 

// 1. Función para TRAER los productos de la base de datos
export async function obtenerProductosDB() {
  try {
    const productos = await (prisma as any).producto.findMany({
      orderBy: { id: 'desc' }
    })

    // 👇 AQUÍ ESTÁ EL TRUCO: Convertimos los datos antes de devolverlos
    const productosLimpios = productos.map((p: any) => ({
      ...p,
      precio: p.precio.toNumber(), // Convertimos Decimal -> Number
      // Si tienes fechas que den problemas, también se convierten aquí:
      // createdAt: p.createdAt.toISOString() 
    }))

    return productosLimpios
    
  } catch (error) {
    console.error("Error obteniendo productos:", error)
    return []
  }
}

// 2. Función para CARGAR DATOS DE PRUEBA (Para poblar la tabla rápido)
export async function cargarDatosDePrueba() {
  try {
    await prisma.producto.createMany({
      data: [
        {
          nombre: "Leche Entera La Serenísima 1L",
          descripcion: "Cartón / Larga Vida",
          stock: 45,
          precio: 1200.00,
          tipo: "Lácteos",
          proveedor: "PROV-101",
          codigoBarra: "77900123"
        },
        {
          nombre: "Arroz Gallo Oro 1kg",
          descripcion: "No se pasa ni se pega",
          stock: 20,
          precio: 1850.50,
          tipo: "Almacén",
          proveedor: "PROV-102",
          codigoBarra: "77900456"
        },
        {
          nombre: "Coca-Cola Original 2.25L",
          descripcion: "Botella retornable",
          stock: 120,
          precio: 2500.00,
          tipo: "Bebidas",
          proveedor: "PROV-103",
          codigoBarra: "77900789"
        }
      ]
    })
    return { success: true }
  } catch (error) {
    console.error("Error cargando datos de prueba:", error)
    return { success: false }
  }
}