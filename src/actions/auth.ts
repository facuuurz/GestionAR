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
  profilePicture?: string,
  phone?: string,
  address?: string,
  localName?: string
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

    const fieldErrors: Record<string, string> = {};

    if (/\s/.test(username)) {
      return { success: false, error: "FIELD_ERRORS", fieldErrors: { username: "El nombre de usuario no puede contener espacios." } };
    }

    const [existingUsername, existingEmail, existingDni, existingCuit, existingPhone] = await Promise.all([
      prisma.user.findFirst({ where: { username: { equals: username.trim(), mode: 'insensitive' } } }),
      prisma.user.findFirst({ where: { email: { equals: email.trim(), mode: 'insensitive' } } }),
      (dni && dni.trim()) ? prisma.user.findFirst({ where: { dni: dni.trim() } }) : null,
      (cuit && cuit.trim()) ? prisma.user.findFirst({ where: { cuit: cuit.trim() } }) : null,
      (phone && phone.trim()) ? prisma.user.findFirst({ where: { phone: phone.trim() } }) : null,
    ]);

    if (existingUsername) fieldErrors.username = "El nombre de usuario ya está en uso.";
    if (existingEmail) fieldErrors.email = "El correo electrónico ya está registrado.";
    if (existingDni) fieldErrors.dni = "Ya existe un usuario con este DNI.";
    if (existingCuit) fieldErrors.cuit = "Ya existe un usuario con este CUIT / CUIL.";
    if (existingPhone) fieldErrors.phone = "Ya existe un usuario con este Teléfono.";

    if (Object.keys(fieldErrors).length > 0) {
      return { success: false, error: "FIELD_ERRORS", fieldErrors };
    }

    const passwordHash = await hash(rawPass, 10);

    const newUser = await prisma.user.create({
      data: {
        username: username.trim(),
        email: email.trim(),
        name: name.trim(),
        passwordHash,
        role: role as any,
        createdById: session.userId, // Asignamos el ID del administrador que lo creó
        dni: dni?.trim() || null,
        cuit: cuit?.trim() || null,
        profilePicture: profilePicture || null,
        phone: phone?.trim() || null,
        address: address?.trim() || null,
        localName: localName?.trim() || null,
      }
    });

    await createNotification(
      ["SUPERADMIN"],
      "USER_CREATED",
      `Se ha creado un nuevo usuario: ${username.trim()}`,
      `/empleados/${newUser.id}`
    );

    return { success: true, user: newUser };

  } catch (error) {
    console.error("Error registering user:", error);
    return { success: false, error: "Ocurrió un error al registrar el usuario en la base de datos." };
  }
}
