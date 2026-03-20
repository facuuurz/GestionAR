import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/notifications";

export async function checkProductExpirations() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const in7Days = new Date(today);
    in7Days.setDate(today.getDate() + 7);

    // Buscar todos los productos con fecha de vencimiento configurada
    const productos = await prisma.producto.findMany({
      where: {
        fechaVencimiento: {
          not: null
        }
      }
    });

    for (const prod of productos) {
      if (!prod.fechaVencimiento) continue;

      const vencimientoStr = prod.fechaVencimiento.toISOString();
      const vencimiento = new Date(vencimientoStr);
      vencimiento.setHours(0, 0, 0, 0);

      const isExpired = vencimiento.getTime() < today.getTime();
      const isExpiring = !isExpired && vencimiento.getTime() <= in7Days.getTime();

      if (!isExpired && !isExpiring) continue;

      const type = isExpired ? "PRODUCT_EXPIRED" : "PRODUCT_EXPIRING";
      const message = isExpired
        ? `El producto "${prod.nombre}" ha superado su fecha de vencimiento (` + prod.fechaVencimiento.toLocaleDateString() + `).`
        : `El producto "${prod.nombre}" está próximo a vencer (` + prod.fechaVencimiento.toLocaleDateString() + `).`;
      
      const linkUrl = `/inventario`; 

      // Verificar que no se haya enviado una notificación del mismo tipo en los últimos 7 días
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 7);

      const prevNotif = await prisma.notification.findFirst({
        where: {
          type,
          message: { contains: prod.nombre }, // Se puede buscar por nombre o link
          createdAt: { gte: sevenDaysAgo }
        }
      });

      if (!prevNotif) {
        await createNotification(
          ["SUPERADMIN", "ADMIN"],
          type,
          message,
          linkUrl
        );
      }
    }
    console.log("✅ Chequeo de vencimientos completado con éxito.");
  } catch (error) {
    console.error("Error comprobando fechas de vencimiento:", error);
  }
}
