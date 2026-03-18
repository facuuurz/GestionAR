import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedTestNotifications() {
  const superadmin = await prisma.user.findFirst({ where: { role: "SUPERADMIN" } });
  const allAdmins = await prisma.user.findMany({ where: { role: { in: ["SUPERADMIN", "ADMIN"] } } });

  if (!superadmin) {
    console.error("No se encontró SUPERADMIN.");
    process.exit(1);
  }

  const product = await prisma.producto.findFirst({ orderBy: { id: "asc" } });
  const promo = await prisma.promocion.findFirst({ orderBy: { id: "asc" } });
  const proveedor = await prisma.proveedor.findFirst({ orderBy: { id: "asc" } });
  const empleado = await prisma.user.findFirst({ where: { role: "EMPLEADO" }, orderBy: { id: "asc" } });

  // --- Limpiar todo ---
  const del = await prisma.notification.deleteMany({});
  console.log(`Eliminadas ${del.count} notificaciones antiguas.\n`);

  const now = Date.now();

  const cases = [
    // Solo SUPERADMIN
    {
      roles: ["SUPERADMIN"],
      type: "USER_CREATED",
      message: `Se creó un nuevo usuario: "${empleado?.name || empleado?.username || 'empleado1'}" en el sistema.`,
      linkUrl: `/empleados/${empleado?.id || 1}`,
      minutesAgo: 2,
      isRead: false,
    },
    {
      roles: ["SUPERADMIN"],
      type: "USER_DELETED",
      message: `El usuario "carlos.gomez" fue eliminado del sistema.`,
      linkUrl: `/empleados/eliminado?nombre=Carlos%20G%C3%B3mez&email=carlos.gomez%40empresa.com&role=EMPLEADO`,
      minutesAgo: 5,
      isRead: false,
    },
    // SUPERADMIN + ADMIN
    {
      roles: ["SUPERADMIN", "ADMIN"],
      type: "PRODUCT_CREATED",
      message: `Se agregó el nuevo producto "${product?.nombre || 'Producto Ficticio 1'}" al inventario.`,
      linkUrl: `/inventario/detalles-producto/${product?.id || 1}`,
      minutesAgo: 10,
      isRead: false,
    },
    {
      roles: ["SUPERADMIN", "ADMIN"],
      type: "PRODUCT_DELETED",
      message: `El producto "Yerba Mate Taragüi 500g" fue eliminado del inventario.`,
      linkUrl: `/inventario/eliminado?nombre=Yerba+Mate+Taragu%C3%AD+500g&codigo=7790001020304&tipo=Alimentos&precio=850.00&proveedor=P001&descripcion=Yerba+mate+suave&esPorPeso=0`,
      minutesAgo: 15,
      isRead: false,
    },
    {
      roles: ["SUPERADMIN", "ADMIN"],
      type: "STOCK_LOW",
      message: `Queda poco stock (8 unidades) del producto "${product?.nombre || 'Producto Ficticio 1'}".`,
      linkUrl: `/inventario/detalles-producto/${product?.id || 1}`,
      minutesAgo: 20,
      isRead: false,
    },
    {
      roles: ["SUPERADMIN", "ADMIN"],
      type: "STOCK_NONE",
      message: `El producto "${product?.nombre || 'Producto Ficticio 1'}" se quedó sin stock.`,
      linkUrl: `/inventario/detalles-producto/${product?.id || 1}`,
      minutesAgo: 25,
      isRead: false,
    },
    {
      roles: ["SUPERADMIN", "ADMIN"],
      type: "SUPPLIER_CREATED",
      message: `Se registró el nuevo proveedor "${proveedor?.razonSocial || 'Distribuidora Sur SRL'}" (Cód: ${proveedor?.codigo || 'P999'}).`,
      linkUrl: `/proveedores`,
      minutesAgo: 30,
      isRead: false,
    },
    {
      roles: ["SUPERADMIN", "ADMIN"],
      type: "SUPPLIER_DELETED",
      message: `El proveedor "Distribuidora Norte SA" (Cód: P888) fue eliminado junto con sus productos.`,
      linkUrl: `/proveedores/eliminado?razonSocial=Distribuidora+Norte+SA&codigo=P888&contacto=Juan+P%C3%A9rez&telefono=1122334455&email=norte%40dist.com`,
      minutesAgo: 40,
      isRead: false,
    },
    {
      roles: ["SUPERADMIN", "ADMIN"],
      type: "PROMO_CREATED",
      message: `Se creó la promoción "${promo?.nombre || 'Promo Semanal'}" en el sistema.`,
      linkUrl: `/promociones/${promo?.id || 1}`,
      minutesAgo: 50,
      isRead: false,
    },
    {
      roles: ["SUPERADMIN", "ADMIN"],
      type: "PROMO_ACTIVED",
      message: `Se activó la promoción "${promo?.nombre || 'Promo Semanal'}".`,
      linkUrl: `/promociones/${promo?.id || 1}`,
      minutesAgo: 55,
      isRead: false,
    },
    {
      roles: ["SUPERADMIN", "ADMIN"],
      type: "PROMO_ENDED",
      message: `La promoción "${promo?.nombre || 'Promo Semanal'}" ha finalizado.`,
      linkUrl: `/promociones/${promo?.id || 1}`,
      minutesAgo: 70,
      isRead: true, // leída para mostrar contraste visual
    },
    {
      roles: ["SUPERADMIN", "ADMIN"],
      type: "PROMO_DELETED",
      message: `La promoción "Oferta de Verano" fue eliminada del sistema.`,
      linkUrl: `/promociones/eliminado?nombre=Oferta+de+Verano&descripcion=Descuentos+de+temporada&precio=1500.00&fechaInicio=2026-01-01&fechaFin=2026-03-15`,
      minutesAgo: 90,
      isRead: true, // leída para mostrar contraste visual
    },
  ];

  let total = 0;
  for (const c of cases) {
    const targetUsers = allAdmins.filter(u => c.roles.includes(u.role));
    for (const user of targetUsers) {
      await prisma.notification.create({
        data: {
          userId: user.id,
          type: c.type,
          message: c.message,
          linkUrl: c.linkUrl,
          isRead: c.isRead,
          createdAt: new Date(now - c.minutesAgo * 60000),
        },
      });
      total++;
    }
    console.log(`[${c.type}] -> ${targetUsers.map(u => u.username).join(", ")}`);
  }

  console.log(`\n✅ Cargadas ${total} notificaciones de prueba.`);
  await prisma.$disconnect();
}

seedTestNotifications().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
