"use server";

import { createSession, deleteSession } from "./session";
import { PrismaClient } from "@prisma/client";
import { compare, hash } from "bcryptjs";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export async function login(prevState: any, formData: FormData) {
  const identifier = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!identifier || !password) {
    return { error: "Por favor, ingresa usuario y contraseña." };
  }

  // Buscar por username o email
  const user = await (prisma.user as any).findFirst({
    where: {
      OR: [
        { username: identifier },
        { email: identifier },
      ],
    },
  });

  if (!user) {
    return { error: "Credenciales inválidas." };
  }

  // Verificar contraseña
  const isMatch = await compare(password, user.passwordHash);

  if (!isMatch) {
    return { error: "Credenciales inválidas." };
  }

  // Actualizar lastActive
  await (prisma.user as any).update({
    where: { id: user.id },
    data: { lastActive: new Date() },
  });

  // Crear la sesión en la cookie
  await createSession(user.id, user.role, user.username, user.name);

  // Redirigir al inicio correspondiente
  redirect("/");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}

export async function createInitialAdmin() {
  // Solo para entorno de desarrollo o inicialización
  const exist = await (prisma.user as any).findFirst({
    where: { role: "ADMIN" }
  });

  if (exist) {
    return { error: "Ya existe un administrador." };
  }

  const hashedPassword = await hash("admin123", 10);

  const admin = await (prisma.user as any).create({
    data: {
      username: "admin",
      email: "admin@gestionar.com",
      passwordHash: hashedPassword,
      role: "ADMIN",
      name: "Administrador Principal",
    }
  });

  return { success: true, user: admin.username };
}
