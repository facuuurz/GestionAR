import "dotenv/config"
import { prisma } from "../src/lib/prisma"

async function main() {
  console.log("🧹 Limpiando base de datos...")
  
  // 1. Borrar TODOS los productos existentes
  await (prisma as any).producto.deleteMany({}) 
  console.log("✅ Tabla vaciada.")

  console.log("📝 Creando productos nuevos...")

  // 2. Crear productos de ejemplo (Array)
  await (prisma as any).producto.createMany({
    data: [
      {
        nombre: "Coca-Cola Original 2.25L", // Ahora con guión ;)
        stock: 120,
        precio: 2500.00,
        tipo: "Bebidas",
        proveedor: "PROV-101",
        codigoBarra: "77900704"
      },
      {
        nombre: "Leche La Serenísima 1L",
        stock: 45,
        precio: 1200.50,
        tipo: "Lácteos",
        proveedor: "PROV-102",
        codigoBarra: "77900123"
      }
    ]
  })

  console.log("✅ ¡Inventario reiniciado con éxito!")
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())