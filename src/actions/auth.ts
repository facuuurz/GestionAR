"use server";

import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { getSession } from "@/lib/session";
import { createNotification } from "@/lib/notifications";

const prisma = new PrismaClient();

export async function registerUser(
  username: string, 
  rawPass: string, 
  email: string, 
  name: string, 
  role: string,
  dni?: string,
  cuit?: string,
  profilePicture?: string
) {
  try {
    const session = await getSession();
    
    // Only ADMIN or SUPERADMIN can create users
    if (!session || (session.role !== "ADMIN" && session.role !== "SUPERADMIN")) {
      return { success: false, error: "No tienes permiso para crear usuarios." };
    }

    // Admins cannot create Superadmins
    if (role === "SUPERADMIN") {
      return { success: false, error: "No se puede crear un usuario con nivel Super Administrador." };
    }

    // Verify if username or email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username },
          { email }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return { success: false, error: "El nombre de usuario ya está en uso." };
      }
      return { success: false, error: "El correo electrónico ya está registrado." };
    }

    const passwordHash = await hash(rawPass, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        name,
        passwordHash,
        role: role as any,
        createdById: session.userId, // Asignamos el ID del administrador que lo creó
        dni: dni || null,
        cuit: cuit || null,
        profilePicture: profilePicture || null,
      }
    });

    await createNotification(
      ["SUPERADMIN"],
      "USER_CREATED",
      `Se ha creado un nuevo usuario: ${username}`,
      `/empleados/${newUser.id}`
    );

    return { success: true, user: newUser };

  } catch (error) {
    console.error("Error registering user:", error);
    return { success: false, error: "Ocurrió un error al registrar el usuario en la base de datos." };
  }
}
