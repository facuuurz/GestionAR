import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedTestNotifications() {
  // 1. Find superadmin and admin users
  const superadmin = await prisma.user.findFirst({ where: { role: "SUPERADMIN" } });
  const admins = await prisma.user.findMany({ where: { role: { in: ["SUPERADMIN", "ADMIN"] } } });

  if (!superadmin) {
    console.error("No se encontró un usuario SUPERADMIN. Asegurate de tener uno creado.");
    process.exit(1);
  }

  console.log(`SUPERADMIN encontrado: ${superadmin.username} (id: ${superadmin.id})`);
  console.log(`Usuarios a notificar: ${admins.map(u => u.username).join(", ")}`);

  // 2. Find a product for stock notifications
  const product = await prisma.producto.findFirst({ orderBy: { id: "asc" } });
  
  // 3. Find a promotion for promo notifications
  const promo = await prisma.promocion.findFirst({ orderBy: { id: "asc" } });

  // 4. Find a regular user for USER_CREATED notification
  const regularUser = await prisma.user.findFirst({ where: { role: "EMPLEADO" }, orderBy: { id: "asc" } });

  // 5. Clear existing notifications first
  const deleted = await prisma.notification.deleteMany({});
  console.log(`\nSe eliminaron ${deleted.count} notificaciones antiguas.`);

  const now = new Date();

  // 6. Seed one of each type
  for (const admin of admins) {
    // USER_CREATED -> solo para SUPERADMIN
    if (admin.role === "SUPERADMIN" && regularUser) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          type: "USER_CREATED",
          message: `Se creó un nuevo usuario: "${regularUser.name || regularUser.username}" en el sistema.`,
          linkUrl: `/empleados/${regularUser.id}`,
          isRead: false,
          createdAt: new Date(now.getTime() - 5 * 60000)
        }
      });
      console.log(`[USER_CREATED] creada para ${admin.username}`);
    }

    // USER_DELETED -> solo para SUPERADMIN
    if (admin.role === "SUPERADMIN") {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          type: "USER_DELETED",
          message: `El usuario "carlos.gomez" ha sido eliminado del sistema.`,
          linkUrl: `/empleados/eliminado?nombre=Carlos%20G%C3%B3mez&email=carlos.gomez%40empresa.com&role=EMPLEADO`,
          isRead: false,
          createdAt: new Date(now.getTime() - 10 * 60000)
        }
      });
      console.log(`[USER_DELETED] creada para ${admin.username}`);
    }

    // STOCK_LOW -> admin y superadmin
    if (product) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          type: "STOCK_LOW",
          message: `Queda poco stock (12 unidades) del producto "${product.nombre}".`,
          linkUrl: `/inventario/detalles-producto/${product.id}`,
          isRead: false,
          createdAt: new Date(now.getTime() - 20 * 60000)
        }
      });
      console.log(`[STOCK_LOW] creada para ${admin.username} - producto: ${product.nombre}`);
    }

    // STOCK_NONE -> admin y superadmin
    if (product) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          type: "STOCK_NONE",
          message: `El producto "${product.nombre}" se quedó sin stock.`,
          linkUrl: `/inventario/detalles-producto/${product.id}`,
          isRead: false,
          createdAt: new Date(now.getTime() - 30 * 60000)
        }
      });
      console.log(`[STOCK_NONE] creada para ${admin.username} - producto: ${product.nombre}`);
    }

    // PROMO_ACTIVED -> admin y superadmin
    if (promo) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          type: "PROMO_ACTIVED",
          message: `La promoción "${promo.nombre}" está ahora activa.`,
          linkUrl: `/promociones/${promo.id}`,
          isRead: false,
          createdAt: new Date(now.getTime() - 40 * 60000)
        }
      });
      console.log(`[PROMO_ACTIVED] creada para ${admin.username} - promo: ${promo.nombre}`);
    }

    // PROMO_ENDED -> admin y superadmin
    if (promo) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          type: "PROMO_ENDED",
          message: `La promoción "${promo.nombre}" ha finalizado.`,
          linkUrl: `/promociones/${promo.id}`,
          isRead: true, // Esta la dejamos como leída para mostrar la diferencia visual
          createdAt: new Date(now.getTime() - 60 * 60000)
        }
      });
      console.log(`[PROMO_ENDED] (leída para mostrar diferencia) creada para ${admin.username}`);
    }

    // PRODUCT_DELETED -> admin y superadmin
    if (product) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          type: "PRODUCT_DELETED",
          message: `El producto "Yerba Mate Taragüi 500g" ha sido eliminado del inventario por completo.`,
          linkUrl: `/inventario`,
          isRead: true, // Esta también como leída para mostrar diferencia
          createdAt: new Date(now.getTime() - 90 * 60000)
        }
      });
      console.log(`[PRODUCT_DELETED] (leída) creada para ${admin.username}`);
    }
  }

  console.log("\n✅ Notificaciones de prueba cargadas exitosamente.");
  await prisma.$disconnect();
}

seedTestNotifications().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
