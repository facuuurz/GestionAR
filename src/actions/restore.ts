"use server";

import fs from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { logger } from "@/lib/logger";

export async function getLocalBackups() {
  try {
    const backupDir = path.join(process.cwd(), "backups");
    await fs.mkdir(backupDir, { recursive: true });
    
    const files = await fs.readdir(backupDir);
    const backups = files
      .filter(f => f.endsWith(".json"))
      .sort((a, b) => {
        // Sort descending by looking at file stats
        return b.localeCompare(a); // Lexicographical works well enough for YYYY-MM-DD but here format is DD-MM-YYYY
      });

    // Let's get actual stats for proper sorting (newest first)
    const filesWithStats = await Promise.all(
      backups.map(async (file) => {
        const stat = await fs.stat(path.join(backupDir, file));
        return {
          filename: file,
          createdAt: stat.birthtimeMs,
        };
      })
    );

    filesWithStats.sort((a, b) => b.createdAt - a.createdAt);

    return { success: true, backups: filesWithStats.map(f => f.filename) };
  } catch (error) {
    logger.error({ err: error }, "Error al leer los backups locales");
    return { success: false, message: "Error al obtener la lista de backups." };
  }
}

export async function restoreFromBackup(jsonContent: string) {
  try {
    const parsedData = JSON.parse(jsonContent);

    if (!parsedData.datos) {
      return { success: false, message: "El formato del backup es inválido." };
    }

    const { productos, proveedores, promociones, clientes, ventas, usuarios, categorias, movimientos } = parsedData.datos;

    logger.info("Iniciando proceso de restauración...");

    await prisma.$transaction(async (tx) => {
      // 1. Borrar datos actuales en orden inverso a sus dependencias
      // DetalleVenta y Venta
      await tx.detalleVenta.deleteMany({});
      await tx.venta.deleteMany({});
      
      // PromocionProducto y Promocion
      await tx.promocionProducto.deleteMany({});
      await tx.promocion.deleteMany({});

      // Productos, Proveedores, Movimientos y Clientes (Cuenta_corriente)
      await tx.producto.deleteMany({});
      await tx.categoria.deleteMany({});
      await tx.proveedor.deleteMany({});
      await tx.movimiento.deleteMany({});
      await tx.cuenta_corriente.deleteMany({});

      // Usuarios y Dependencias (solo si vienen en el backup)
      if (usuarios && usuarios.length > 0) {
        await tx.passwordHistory.deleteMany({});
        await tx.notification.deleteMany({});
        await tx.user.updateMany({ data: { createdById: null } });
        await tx.user.deleteMany({});
      }

      // 2. Insertar los datos del backup (desactivando temporalmente triggers si es posible, o insertando con ids)
      // Usuarios
      if (usuarios && usuarios.length > 0) {
        const usersToInsert = usuarios.map((u: any) => ({ ...u, createdById: null }));
        await tx.user.createMany({ data: usersToInsert, skipDuplicates: true });
        await tx.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"users"', 'id'), coalesce(max(id), 1), max(id) IS NOT null) FROM "users";`);

        // Restaurar createdById
        for (const u of usuarios) {
          if (u.createdById) {
            await tx.user.update({ where: { id: u.id }, data: { createdById: u.createdById } });
          }
        }
      }

      // Proveedores
      if (proveedores && proveedores.length > 0) {
        await tx.proveedor.createMany({ data: proveedores, skipDuplicates: true });
        await tx.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"proveedores"', 'id'), coalesce(max(id), 1), max(id) IS NOT null) FROM "proveedores";`);
      }

      // Clientes (Cuenta_corriente)
      if (clientes && clientes.length > 0) {
        // En el schema, Cuenta_corriente -> @map("Cuentas_corrientes")
        await tx.cuenta_corriente.createMany({ data: clientes, skipDuplicates: true });
        await tx.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"Cuentas_corrientes"', 'id'), coalesce(max(id), 1), max(id) IS NOT null) FROM "Cuentas_corrientes";`);
      }

      // Movimientos
      if (movimientos && movimientos.length > 0) {
        await tx.movimiento.createMany({ data: movimientos, skipDuplicates: true });
        await tx.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"movimientos"', 'id'), coalesce(max(id), 1), max(id) IS NOT null) FROM "movimientos";`);
      }

      // Categorias
      if (categorias && categorias.length > 0) {
        await tx.categoria.createMany({ data: categorias, skipDuplicates: true });
        await tx.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"Categoria"', 'id'), coalesce(max(id), 1), max(id) IS NOT null) FROM "Categoria";`);
      }

      // Productos
      if (productos && productos.length > 0) {
        await tx.producto.createMany({ data: productos, skipDuplicates: true });
        await tx.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"productos"', 'id_producto'), coalesce(max(id_producto), 1), max(id_producto) IS NOT null) FROM "productos";`);
      }

      // Promociones
      if (promociones && promociones.length > 0) {
        const promosToInsert = promociones.map((p: any) => {
          const temp = { ...p };
          delete temp.items; // Remover items array
          return temp;
        });

        await tx.promocion.createMany({ data: promosToInsert, skipDuplicates: true });
        await tx.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"promociones"', 'id'), coalesce(max(id), 1), max(id) IS NOT null) FROM "promociones";`);

        // Promocion Productos (items)
        const promoItems = promociones.flatMap((p: any) => p.items || []);
        if (promoItems.length > 0) {
          await tx.promocionProducto.createMany({ data: promoItems, skipDuplicates: true });
        }
      }

      // Ventas y Detalles
      if (ventas && ventas.length > 0) {
        const ventasToInsert = ventas.map((v: any) => {
          const temp = { ...v };
          delete temp.detalles; // Remover detalles array
          return temp;
        });

        await tx.venta.createMany({ data: ventasToInsert, skipDuplicates: true });
        await tx.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"ventas"', 'id'), coalesce(max(id), 1), max(id) IS NOT null) FROM "ventas";`);

        const detalles = ventas.flatMap((v: any) => v.detalles || []);
        if (detalles.length > 0) {
          await tx.detalleVenta.createMany({ data: detalles, skipDuplicates: true });
          await tx.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"detalle_ventas"', 'id'), coalesce(max(id), 1), max(id) IS NOT null) FROM "detalle_ventas";`);
        }
      }
    });

    logger.info("Restauración completada con éxito");
    return { success: true, message: "Base de datos restaurada correctamente." };
  } catch (error) {
    logger.error({ err: error }, "Fallo al intentar restaurar el backup");
    return { success: false, message: "Error crítico al restaurar el backup." };
  }
}

export async function restoreLocalBackup(filename: string) {
  try {
    const filePath = path.join(process.cwd(), "backups", filename);
    const content = await fs.readFile(filePath, "utf-8");
    return restoreFromBackup(content);
  } catch (error) {
    logger.error({ err: error }, "Error al leer el archivo de backup");
    return { success: false, message: "No se pudo leer el archivo seleccionado." };
  }
}
