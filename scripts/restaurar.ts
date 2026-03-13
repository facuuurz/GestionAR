import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

async function restaurar() {
  try {

    const nombreArchivo = "GestionAR_Backup_13-03-2026_16-00.json"; 
    
    const filePath = path.join(process.cwd(), 'backups', nombreArchivo);
    console.log(`⏳ Leyendo archivo de backup: ${nombreArchivo}...`);
    
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const backup = JSON.parse(fileContent);

    const { proveedores, productos, clientes } = backup.datos;

    console.log("🚀 Iniciando restauración en la Base de Datos...");


    if (proveedores && proveedores.length > 0) {
      await prisma.proveedor.createMany({ 
        data: proveedores, 
        skipDuplicates: true // Si el ID ya existe, lo ignora y no rompe nada
      });
      console.log(`✅ ${proveedores.length} proveedores procesados.`);
    }

   if (clientes && clientes.length > 0) {
      await prisma.cuenta_corriente.createMany({ 
        data: clientes, 
        skipDuplicates: true 
      });
      console.log(`✅ ${clientes.length} clientes procesados.`);
    }

    if (productos && productos.length > 0) {
      const productosFormateados = productos.map((p: any) => ({
        ...p,
        fechaVencimiento: p.fechaVencimiento ? new Date(p.fechaVencimiento) : null,
        createdAt: p.createdAt ? new Date(p.createdAt) : undefined,
        updatedAt: p.updatedAt ? new Date(p.updatedAt) : undefined,
      }));

      await prisma.producto.createMany({ 
        data: productosFormateados, 
        skipDuplicates: true 
      });
      console.log(`✅ ${productos.length} productos procesados.`);
    }


    console.log("🎉 ¡Restauración básica finalizada con éxito!");

  } catch (error) {
    console.error("❌ Error catastrófico durante la restauración:", error);
  } finally {
    await prisma.$disconnect();
  }
}

restaurar();


//  npx tsx scripts/restaurar.ts