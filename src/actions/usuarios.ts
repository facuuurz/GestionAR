"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { deleteSession, getSession } from "@/lib/session";
import { validatePasswordStrength } from "@/lib/passwordUtils";
import { createNotification } from "@/lib/notifications";

const prisma = new PrismaClient();

export async function updateProfilePicture(userId: number, base64Image: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { profilePicture: base64Image },
    });

    revalidatePath("/cuenta");
    return { success: true };
  } catch (error) {
    console.error("Error updating profile picture:", error);
    return { success: false, error: "No se pudo actualizar la foto de perfil" };
  }
}

export async function changePassword(userId: number, oldPass: string, newPass: string) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { success: false, error: "Usuario no encontrado" };

    const isMatch = await bcrypt.compare(oldPass, user.passwordHash);
    if (!isMatch) return { success: false, error: "La contraseña actual es incorrecta" };

    const formatError = validatePasswordStrength(newPass);
    if (formatError) return { success: false, error: formatError };

    // Verificar si la contraseña fue usada recientemente
    const history = await prisma.passwordHistory.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    for (const record of history) {
      if (await bcrypt.compare(newPass, record.passwordHash)) {
        return { success: false, error: "La contraseña ya fue utilizada recientemente." };
      }
    }

    if (await bcrypt.compare(newPass, user.passwordHash)) {
      return { success: false, error: "La nueva contraseña no puede ser igual a la actual." };
    }

    const hashedPassword = await bcrypt.hash(newPass, 10);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { passwordHash: hashedPassword },
      }),
      prisma.passwordHistory.create({
        data: {
          userId,
          passwordHash: hashedPassword,
        },
      }),
    ]);

    // Delete the session since their credentials changed
    await deleteSession();

    return { success: true };
  } catch (error) {
    console.error("Error changing password:", error);
    return { success: false, error: "Error interno del servidor al cambiar la contraseña" };
  }
}

export async function deleteUser(userId: number) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPERADMIN")) {
      return { success: false, error: "No autorizado" };
    }

    const userToDelete = await prisma.user.findUnique({ where: { id: userId } });
    if (!userToDelete) {
      return { success: false, error: "Usuario no encontrado" };
    }

    if (userToDelete.role === "SUPERADMIN") {
      return { success: false, error: "No puedes eliminar a un SUPERADMIN" };
    }

    // Un ADMIN solo puede eliminar a los usuarios que  él mismo creó.
    // Un SUPERADMIN puede eliminar a cualquiera.
    if (session.role === "ADMIN" && userToDelete.createdById !== session.userId) {
      return { success: false, error: "Solo puedes eliminar usuarios creados por ti" };
    }

    await prisma.user.delete({
      where: { id: userId }
    });

    await createNotification(
      ["SUPERADMIN"],
      "USER_DELETED",
      `El usuario "${userToDelete.username}" ha sido eliminado.`,
      `/empleados/eliminado?nombre=${encodeURIComponent(userToDelete.name || userToDelete.username)}&email=${encodeURIComponent(userToDelete.email)}&role=${userToDelete.role}`
    );

    revalidatePath("/empleados");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: "Error al eliminar usuario" };
  }
}

export async function updateUser(
  userId: number,
  name: string,
  email: string,
  role: string,
  dni?: string,
  cuit?: string,
  profilePicture?: string,
  username?: string,
  password?: string
) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPERADMIN")) {
      return { success: false, error: "No autorizado" };
    }

    const userToEdit = await prisma.user.findUnique({ where: { id: userId } });
    if (!userToEdit) {
      return { success: false, error: "Usuario no encontrado" };
    }

    // A SUPERADMIN cannot be demoted
    if (userToEdit.role === "SUPERADMIN" && role !== "SUPERADMIN") {
      return { success: false, error: "No se puede cambiar el rol de un SUPERADMIN" };
    }

    // Only SUPERADMIN can edit another SUPERADMIN
    if (userToEdit.role === "SUPERADMIN" && session.role !== "SUPERADMIN") {
      return { success: false, error: "Solo un SUPERADMIN puede editar a otro" };
    }

    // Admins can only edit the users they created or themselves
    if (session.role === "ADMIN" && userToEdit.createdById !== session.userId && userToEdit.id !== session.userId) {
      return { success: false, error: "Solo puedes editar usuarios creados por ti" };
    }

    // Validation for duplicate emails
    const existingEmail = await prisma.user.findFirst({
      where: {
        email,
        NOT: { id: userId }
      }
    });

    if (existingEmail) {
      return { success: false, error: "El correo electrónico ya está en uso por otro usuario" };
    }

    // Validation for duplicate usernames
    if (username) {
      const existingUsername = await prisma.user.findFirst({
        where: {
          username,
          NOT: { id: userId }
        }
      });
      if (existingUsername) {
        return { success: false, error: "El nombre de usuario ya está en uso por otro usuario" };
      }
    }

    let passwordHash = undefined;
    if (password) {
      passwordHash = await bcrypt.hash(password, 10);
    }

    const updateData: any = {
      name,
      email,
      role: role as any,
      dni: dni || null,
      cuit: cuit || null,
    };

    if (username) updateData.username = username;
    if (passwordHash) updateData.passwordHash = passwordHash;
    if (profilePicture !== undefined) updateData.profilePicture = profilePicture;

    await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    revalidatePath("/empleados");
    revalidatePath(`/empleados/editar/${userId}`);
    return { success: true };

  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, error: "Error al actualizar los datos del usuario" };
  }
}
