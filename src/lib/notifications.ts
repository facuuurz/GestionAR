import { prisma } from "@/lib/prisma";

export type NotificationType = 
  | "USER_CREATED" 
  | "USER_DELETED" 
  | "STOCK_LOW" 
  | "STOCK_NONE" 
  | "PROMO_ACTIVED" 
  | "PROMO_ENDED"
  | "PROMO_CREATED"
  | "PROMO_DELETED"
  | "PRODUCT_CREATED"
  | "PRODUCT_DELETED"
  | "SUPPLIER_CREATED"
  | "SUPPLIER_DELETED"
  | "PRODUCT_EXPIRED"
  | "PRODUCT_EXPIRING";

export async function createNotification(
  targetRoles: ("SUPERADMIN" | "ADMIN" | "EMPLEADO")[],
  type: NotificationType,
  message: string,
  linkUrl?: string
) {
  try {
    const targetUsers = await prisma.user.findMany({
      where: {
        role: {
          in: targetRoles
        }
      },
      select: { id: true }
    });

    if (targetUsers.length === 0) return;

    const notifications = targetUsers.map(user => ({
      userId: user.id,
      type,
      message,
      linkUrl: linkUrl || null,
      isRead: false
    }));

    await prisma.notification.createMany({
      data: notifications
    });
    
  } catch (error) {
    console.error("Error creating notifications:", error);
  }
}

export async function getUnreadNotifications(userId: number) {
  try {
    return await prisma.notification.findMany({
      where: {
        userId,
        isRead: false
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
  } catch (error) {
    console.error("Error fetching unread notifications:", error);
    return [];
  }
}

export async function markNotificationsAsRead(userId: number, notificationIds: number[]) {
  try {
    await prisma.notification.updateMany({
      where: {
        userId,
        id: { in: notificationIds }
      },
      data: { isRead: true }
    });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
  }
}
