"use server";

import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";
import fs from "fs/promises";
import path from "path";

export async function generarBackupLocal() {
  try {
    logger.info("Iniciando generación de Backup automático local...");

    // 1. Extraer toda la información de la base de datos
    const [productos, proveedores, promociones, clientes, ventas, categorias, movimientos] = await Promise.all([
      prisma.producto.findMany(),
      prisma.proveedor.findMany(),
      prisma.promocion.findMany({ include: { items: true } }),
      prisma.cuenta_corriente.findMany(),
      prisma.venta.findMany({ include: { detalles: true } }),
      prisma.categoria.findMany(),
      prisma.movimiento.findMany()
    ]);

    // 2. Empaquetar
    const backupData = {
      fechaBackup: new Date().toISOString(),
      datos: { productos, proveedores, promociones, clientes, ventas, categorias, movimientos }
    };

    const jsonString = JSON.stringify(backupData, null, 2);

    // 3. Crear nombre del archivo con fecha y hora
    const fecha = new Date();
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    const hora = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    
    const nombreArchivo = `GestionAR_Backup_${dia}-${mes}-${anio}_${hora}-${minutos}.json`;

    // 4. Definir la carpeta "backups" en la raíz de tu proyecto
    const backupDir = path.join(process.cwd(), "backups");

    // 5. Crear la carpeta si no existe, y guardar el archivo
    await fs.mkdir(backupDir, { recursive: true });
    const filePath = path.join(backupDir, nombreArchivo);
    await fs.writeFile(filePath, jsonString, "utf-8");

    logger.info({ archivo: nombreArchivo }, "Backup local guardado exitosamente");
    return { success: true, message: `Backup guardado en /backups/${nombreArchivo}` };

  } catch (error) {
    logger.error({ err: error }, "Fallo crítico al intentar generar el backup local");
    return { success: false, message: "Error al generar el backup." };
  }
}