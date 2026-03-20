"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getUnreadNotificationsAction(userId: number) {
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

export async function getRecentNotificationsAction(userId: number) {
  try {
    return await prisma.notification.findMany({
      where: {
        userId
      },
      orderBy: { createdAt: 'desc' },
      take: 30
    });
  } catch (error) {
    console.error("Error fetching recent notifications:", error);
    return [];
  }
}

export async function markNotificationsAsReadAction(userId: number, notificationIds: number[]) {
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

export async function deleteNotificationsAction(userId: number, notificationIds: number[]) {
  try {
    await prisma.notification.deleteMany({
      where: {
        userId,
        id: { in: notificationIds }
      }
    });
  } catch (error) {
    console.error("Error deleting notifications:", error);
  }
}
